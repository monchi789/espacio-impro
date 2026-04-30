# PLAN.md — Backend FastAPI + Dashboard Admin

## Visión

El backend es el cerebro del sistema de votación de Impronakuy 2026. Expone una API REST + WebSockets que consume tanto el landing público (votos del público) como el dashboard admin (control del evento). El dashboard es una sección protegida dentro del mismo Astro.

---

## Dónde van los archivos

```
/home/monchi789/Projects/espacio-impro/
│
├── impronakuy-backend/           ← TODO el backend va aquí
│   ├── Dockerfile                (ya existe)
│   ├── requirements.txt          (ya existe)
│   ├── alembic.ini
│   ├── alembic/
│   └── app/
│
└── frontend/                     ← repo Astro existente
    └── src/
        ├── pages/
        │   └── dashboard/        ← páginas del dashboard (NUEVO)
        └── components/
            └── dashboard/        ← componentes del dashboard (NUEVO)
```

---

## Arquitectura de requests

```
LANDING PÚBLICO
  Browser → GET  /api/live-state        (polling 5s)
  Browser → POST /api/rounds/{id}/vote  (voto catch)
  Browser → POST /api/mvp/{id}/vote     (voto MVP)
  Browser → WS   /ws/match/{id}         (tiempo real catch)
  Browser → WS   /ws/mvp/{id}           (tiempo real MVP)

DASHBOARD ADMIN
  Browser → POST /auth/login            (obtiene JWT)
  Browser → GET  /auth/me               (verifica JWT)
  Browser → GET  /api/dates             (lista fechas)
  Browser → POST /api/matches           (crea match)
  Browser → PATCH /api/matches/{id}/start
  Browser → POST  /api/matches/{id}/rounds
  Browser → PATCH /api/rounds/{id}/close
  Browser → PATCH /api/matches/{id}/finish
  Browser → POST  /api/mvp
  Browser → PATCH /api/mvp/{id}/open
  Browser → PATCH /api/mvp/{id}/close
```

---

## Flujo de un evento completo (lo que hace el admin)

```
[FECHA 1]
  1. Admin login → /dashboard/login
  2. Ve las 4 fechas → /dashboard/fechas
  3. Entra a Fecha 1 → /dashboard/fechas/1
  4. Crea Match: Culiprincess vs Tetris
  5. Inicia Match → landing entra en modo catch
  6. Abre Ronda 1 → público vota
  7. Cierra Ronda 1 → ganador de ronda registrado
  8. Abre Ronda 2 → público vota
  9. ... (tantas rondas como quiera)
  10. Cierra Match → ganador calculado por mayoría de rondas
  11. (Opcional) Crea segundo Match en Fecha 1
  12. Crea Votación MVP → selecciona integrantes de los equipos que jugaron
  13. Abre MVP → landing entra en modo MVP
  14. Cierra MVP → se proclama el MVP
  15. Landing vuelve a modo normal
```

---

## Decisiones de diseño

### Por qué `/api/live-state` unificado
El landing hace UN solo polling cada 5s en lugar de dos endpoints separados. Retorna:
```json
{
  "match": null | { id, teamA, teamB, currentRound, roundsWon, status },
  "mvp":   null | { id, eligibleMembers, status, totalVotes }
}
```
Si ambos son null → modo normal. Si match != null → modo catch. Si mvp != null → modo MVP. El landing nunca tiene ambos activos a la vez (el backend lo valida).

### Por qué JWT en localStorage (no cookies)
Astro SSR podría leer cookies en el servidor, pero el dashboard es completamente client-side (Astro con `client:load`). localStorage es más simple y suficiente para este caso de uso interno. El token expira en 8 horas.

### Por qué seed en startup
Las 4 fechas del evento son fijas y conocidas. Crearlas en código evita que el admin tenga que configurarlas manualmente. El seed es idempotente — si ya existen, no hace nada.

### Por qué `eligible_member_ids` como JSON en MvpVoting
Los integrantes son datos estáticos del frontend (`impronakuy-teams.ts`). El backend no tiene tabla de integrantes — solo guarda sus IDs como JSON. Esto evita sincronizar dos fuentes de verdad. El admin selecciona qué integrantes participan al crear la votación MVP.

### Ganador de match — lógica
```python
def calculate_match_winner(rounds: list[Round]) -> str | None:
    closed = [r for r in rounds if r.status == 'closed']
    if not closed:
        return None
    wins_a = sum(1 for r in closed if r.winner_team_id == match.team_a_id)
    wins_b = sum(1 for r in closed if r.winner_team_id == match.team_b_id)
    if wins_a > wins_b:
        return match.team_a_id
    elif wins_b > wins_a:
        return match.team_b_id
    else:
        return None  # empate — el admin decide manualmente
```

---

## Dashboard — flujo de autenticación

```
/dashboard/*  (cualquier sub-ruta)
    │
    ▼
AuthGuard.tsx (client:load)
    │
    ├── sin token en localStorage → redirect /dashboard/login
    │
    ├── con token → GET /auth/me
    │       │
    │       ├── 200 OK → renderiza el contenido
    │       └── 401    → borra token → redirect /dashboard/login
    │
/dashboard/login
    │
    └── LoginForm.tsx → POST /auth/login
            │
            ├── 200 → guarda token → redirect /dashboard/fechas
            └── 401 → muestra error "Credenciales incorrectas"
```

---

## Dashboard — vistas detalladas

### `/dashboard/fechas` — Listado de fechas
- 4 cards, una por fecha
- Cada card muestra: nombre de la fecha, cantidad de matches, estado (upcoming/active/done)
- Click → va a `/dashboard/fechas/[1-4]`

### `/dashboard/fechas/[fecha]` — Detalle de fecha
Layout de dos columnas:

**Columna izquierda: Matches**
- Lista de matches de esa fecha (máx 2)
- Si no hay match activo: botón "Crear Match" → abre `MatchCreator`
- Si hay match activo: muestra `MatchControl` + `LiveVotes`
- Matches finalizados: muestra ganador

**Columna derecha: MVP**
- Si todos los matches están finalizados: botón "Crear Votación MVP"
- Si hay MVP activo: muestra `MvpControl` + `LiveMvpVotes`
- Si hay MVP finalizado: muestra el ganador

### `MatchCreator` — formulario
- Dos dropdowns: Equipo A y Equipo B (de los 5 equipos)
- Validación: no puede ser el mismo equipo en ambos
- Equipos que ya jugaron en esa fecha aparecen deshabilitados
- Botón "Crear y empezar" → POST /api/matches + PATCH /api/matches/{id}/start

### `MatchControl` — control de ronda
```
┌─────────────────────────────────────┐
│  Culiprincess  VS  Tetris           │
│  Rondas: ████░ 2-1                  │
│                                     │
│  RONDA 3 — ABIERTA                  │
│  [  Cerrar Ronda  ]                 │
│                                     │
│  [  Abrir Nueva Ronda  ]            │
│  [  Cerrar Enfrentamiento  ]        │
└─────────────────────────────────────┘
```

### `LiveVotes` — votos en tiempo real
- Dos barras de progreso con colores de cada equipo
- Números de votos actualizados via WebSocket
- Se conecta a `/ws/match/{id}` con reconexión automática

### `MvpCreator` — formulario MVP
- Precarga automáticamente todos los integrantes de los equipos que jugaron esa fecha
- Checkboxes para quitar/agregar integrantes
- Muestra foto + nombre artístico de cada uno
- Botón "Crear y abrir votación"

### `LiveMvpVotes` — votos MVP en tiempo real
- Grid de integrantes con foto
- Barra de votos debajo de cada uno
- Actualización via `/ws/mvp/{id}`
- Botón "Proclamar MVP" → cierra la votación

---

## Paleta del dashboard

Oscura y funcional. No galáctica — es una herramienta de trabajo para el admin.

```
Fondo:    #0f172a  (slate-900)
Surface:  #1e293b  (slate-800)
Border:   #334155  (slate-700)
Text:     #e2e8f0  (slate-200)
Muted:    #94a3b8  (slate-400)
Accent:   #818cf8  (indigo-400) — botones primarios
Success:  #4ade80  (green-400)  — ganadores, estados ok
Warning:  #fbbf24  (amber-400)  — activo, en vivo
Danger:   #f87171  (red-400)    — cerrar, eliminar
```
