# DECISIONS.md — Backend + Dashboard

## DEC-B001: PostgreSQL en lugar de SQLite

**Contexto**: El plan original mencionaba SQLite como opción para 100 usuarios.

**Decisión**: PostgreSQL 16.

**Razón**: Ya está en el `podman-compose.yml`. PostgreSQL maneja correctamente las escrituras concurrentes durante el burst de votos (100 usuarios votando en ~10s). SQLite con WAL mode funcionaría, pero PostgreSQL elimina el riesgo de lock contention y es la elección natural en un stack containerizado con volumen persistente.

---

## DEC-B002: SQLAlchemy async sobre sync

**Contexto**: FastAPI es async nativo.

**Decisión**: SQLAlchemy 2.0 con `asyncpg` driver y `create_async_engine`.

**Razón**: El bottleneck de la API son las queries a BD. Con sync SQLAlchemy, cada query bloquea el event loop de FastAPI — catastrófico para WebSockets + polling simultáneo. Async permite manejar 100 conexiones WS + polling sin bloquear.

---

## DEC-B003: WebSockets nativos de FastAPI vs socket.io

**Decisión**: WebSockets nativos de FastAPI (`from fastapi import WebSocket`).

**Razón**:
- socket.io requiere una librería adicional y su propio protocolo
- Los WebSockets nativos son suficientes: el mensaje es JSON simple
- El `ConnectionManager` es ~50 líneas y hace exactamente lo que necesitamos
- socket.io tiene overhead de handshake y fallbacks que no necesitamos

---

## DEC-B004: Singleton global para ConnectionManager

**Decisión**: `manager = ConnectionManager()` al nivel de módulo en `ws_manager.py`.

**Razón**: Con Uvicorn en modo `--workers 4`, hay 4 procesos separados. Esto significa que un voto recibido en el worker 1 no puede hacer broadcast a conexiones WS del worker 2.

**Solución**: Para el VPS de 100 usuarios, usar `--workers 1` para el proceso que maneja WS, o mejor: usar `--workers 1` con `--worker-class uvicorn.workers.UvicornWorker` bajo Gunicorn. Alternativamente, para este caso de uso (100 usuarios, evento en vivo), **un solo worker** de Uvicorn es perfectamente suficiente:

```bash
# En Dockerfile CMD — cambiar a 1 worker durante el evento
uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 1
```

Para múltiples workers se necesitaría Redis pub/sub para propagar los broadcasts — complejidad innecesaria para 100 usuarios.

**Actualización al Dockerfile**: Cambiar `--workers 4` a `--workers 1` en el CMD.

---

## DEC-B005: `eligible_member_ids` como JSON en MvpVoting

**Decisión**: Columna JSON en `MvpVoting` en lugar de tabla intermedia.

**Razón**: Los integrantes son datos estáticos del frontend (`impronakuy-teams.ts`). Crear una tabla `Members` en el backend duplicaría la fuente de verdad. El backend no necesita conocer los detalles del integrante — solo su ID string. El admin selecciona qué IDs participan al crear la votación.

---

## DEC-B006: Seed en startup vs migration vs comando manual

**Decisión**: Seed en evento `lifespan` de FastAPI (startup).

**Razón**:
- Idempotente: si las fechas y el admin ya existen, no hace nada
- Se ejecuta automáticamente en cada `podman-compose up`
- Sin comandos extra en el deploy
- Las fechas del evento son conocidas y fijas — no necesitan ser configurables

---

## DEC-B007: Dashboard en Astro SSG vs SPA separada

**Decisión**: Sub-rutas dentro del mismo Astro, con `getStaticPaths` para las rutas dinámicas.

**Razón**:
- Un solo repo, un solo build, un solo contenedor
- Las 4 fechas son conocidas → `getStaticPaths` genera `/dashboard/fechas/1` a `/dashboard/fechas/4` en build time
- La protección de ruta es client-side con `AuthGuard.tsx` — Astro SSG no puede verificar JWT en servidor sin SSR mode

**Trade-off**: La protección es client-side (el HTML de la página llega al browser antes de redirigir si no hay token). Esto es aceptable para un dashboard admin interno — no hay contenido sensible en el HTML estático, solo el shell de la UI.

---

## DEC-B008: Polling en FechaDetail vs WebSocket

**Decisión**: Polling cada 3s en `FechaDetail` para actualizar el estado de la fecha.

**Razón**:
- El admin ya tiene `LiveVotes` con WS para los votos en tiempo real
- El estado de la fecha (match creado, ronda abierta/cerrada) no necesita latencia sub-segundo
- Polling es más simple y suficiente para las acciones del admin (él mismo las ejecuta)
- Evita una tercera conexión WS

---

## DEC-B009: `--workers 1` para Uvicorn durante el evento

**Contexto**: DEC-B004 explica por qué el ConnectionManager singleton no funciona con múltiples workers.

**Decisión**: El Dockerfile usa `--workers 1` para el backend.

**Razón para el VPS de 100 usuarios**: Un solo worker de Uvicorn con async puede manejar miles de conexiones concurrentes porque todo es I/O-bound (esperar queries, esperar mensajes WS). El CPU nunca es el bottleneck. Los 4 workers solo ayudarían si hubiera trabajo CPU-intensivo, que no es el caso.

---

## DEC-B010: `/api/docs` solo en development

**Decisión**: `docs_url="/api/docs" if environment == "development" else None`.

**Razón**: La documentación Swagger expone todos los endpoints y schemas de la API. En producción esto no es necesario y reduce la superficie de ataque. En desarrollo es esencial para probar la API.
