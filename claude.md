# Impronakuy 2026 — Backend + Dashboard

## Directorios de trabajo

```
Backend:   /home/monchi789/Projects/espacio-impro/impronakuy-backend/
Dashboard: /home/monchi789/Projects/espacio-impro/frontend/
```

## Leer primero — en este orden

1. `AGENT.md` — stack, estructura de archivos, endpoints, modelos
2. `PLAN.md` — arquitectura, flujo completo, vistas del dashboard
3. `DECISIONS.md` — decisiones técnicas tomadas (especialmente DEC-B004 y DEC-B009)
4. `TASKS.md` — tareas TASK-B001 a TASK-B019 + TASK-D001 a TASK-D013

## Regla de oro

Solo crear archivos en:
- `impronakuy-backend/` (todo el backend)
- `frontend/src/pages/dashboard/` (páginas Astro del dashboard)
- `frontend/src/components/dashboard/` (componentes React del dashboard)
- `frontend/src/lib/dashboard-api.ts` (helper de API)

**No tocar** nada fuera de esas rutas.

## Orden de ejecución

Ejecutar las tareas **B** primero (backend completo), luego las tareas **D** (dashboard).

```
TASK-B001 → TASK-B002 → ... → TASK-B016  (backend)
TASK-D001 → TASK-D002 → ... → TASK-D013  (dashboard)
TASK-B017 → TASK-B018 → TASK-B019        (QA final)
```

## Verificación crítica — leer antes de TASK-B001

DEC-B004 y DEC-B009 en DECISIONS.md: el backend debe usar `--workers 1`
en el Dockerfile (no 4). Actualizar el Dockerfile existente antes de continuar.

## Comandos

```bash
# Backend — desarrollo local
cd impronakuy-backend
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000

# Frontend — verificar build
cd frontend
npm run build

# Levantar todo
cd /home/monchi789/Projects/espacio-impro
podman-compose up -d
```

## Prompt de inicio para Copilot

```
Lee AGENT.md, PLAN.md, DECISIONS.md y TASKS.md en ese orden.

Antes de escribir código, confirma:
1. Que entiendes que el backend usa --workers 1 (ver DEC-B009)
2. Que el dashboard NO modifica ningún archivo existente del frontend Astro
3. Que usarás SQLAlchemy async con asyncpg

Luego ejecuta desde TASK-B001.
```
