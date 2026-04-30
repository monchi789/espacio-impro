# Agente: Impronakuy 2026 — Backend + Dashboard

## Contexto del repositorio

Estás trabajando en dos partes del mismo proyecto:

### 1. Backend FastAPI
Ubicación en el VPS/repo:
```
/home/monchi789/Projects/espacio-impro/impronakuy-backend/
```

### 2. Dashboard Admin (dentro del Astro existente)
Ubicación:
```
/home/monchi789/Projects/espacio-impro/frontend/src/pages/dashboard/
/home/monchi789/Projects/espacio-impro/frontend/src/components/dashboard/
```

## Reglas absolutas

1. **No tocar** nada fuera de `impronakuy-backend/` y `src/pages/dashboard/` + `src/components/dashboard/`
2. **No modificar** el `podman-compose.yml` — ya está configurado correctamente
3. **No modificar** el `nginx/conf.d/default.conf` — las rutas `/api/`, `/auth/`, `/ws/` ya están enrutadas
4. El dashboard usa su **propio layout** — no el `Layout.astro` del sitio principal
5. TypeScript estricto en el dashboard — sin `any`

## Stack Backend

- **FastAPI** 0.115 con routers separados por dominio
- **SQLAlchemy 2.0** async con `asyncpg`
- **PostgreSQL 16** (via Docker/Podman)
- **Alembic** para migraciones
- **Pydantic v2** para schemas de request/response
- **python-jose** para JWT
- **passlib[bcrypt]** para hash de passwords
- **WebSockets** nativos de FastAPI (sin socket.io)

## Stack Dashboard

- **Astro** para páginas (protección de ruta en el cliente)
- **React** (`.tsx`) para todos los componentes interactivos con `client:load`
- **CSS Modules** — mismo patrón que el landing de Impronakuy
- **Zod** para validar responses de la API
- **Sin Tailwind** — el proyecto no lo usa

## Estructura de archivos — Backend

```
impronakuy-backend/
├── Dockerfile                    (ya existe)
├── requirements.txt              (ya existe)
├── alembic.ini
├── alembic/
│   ├── env.py
│   └── versions/
│       └── 001_initial.py
└── app/
    ├── main.py                   (FastAPI app + CORS + routers)
    ├── config.py                 (Settings con pydantic-settings)
    ├── database.py               (engine async + get_db)
    ├── deps.py                   (Depends: get_current_admin)
    ├── ws_manager.py             (ConnectionManager para WS)
    ├── models/
    │   ├── __init__.py
    │   ├── admin.py              (AdminUser)
    │   ├── event.py              (EventDate, Match, Round)
    │   └── voting.py             (Vote, MvpVoting, MvpVote)
    ├── schemas/
    │   ├── __init__.py
    │   ├── auth.py               (LoginRequest, TokenResponse)
    │   ├── event.py              (Match, Round schemas)
    │   └── voting.py             (Vote, MvpVoting schemas)
    └── routers/
        ├── __init__.py
        ├── auth.py               (POST /auth/login, GET /auth/me)
        ├── dates.py              (GET/POST /api/dates)
        ├── matches.py            (CRUD matches + control de rondas)
        ├── voting.py             (votos catch + WS)
        ├── mvp.py                (votos MVP + WS)
        └── public.py             (GET /api/live-state — sin auth)
```

## Estructura de archivos — Dashboard

```
frontend/src/
├── pages/dashboard/
│   ├── index.astro               (redirect a /dashboard/login si no auth)
│   ├── login.astro               (página de login)
│   └── fechas/
│       ├── index.astro           (lista de 4 fechas)
│       └── [fecha].astro         (detalle de fecha + matches + MVP)
│
└── components/dashboard/
    ├── DashboardLayout.astro     (html propio, nav lateral)
    ├── LoginForm.tsx             (formulario login + manejo JWT)
    ├── AuthGuard.tsx             (protección client-side de rutas)
    ├── FechasList.tsx            (listado de 4 fechas)
    ├── FechaDetail.tsx           (matches + botón crear MVP de esa fecha)
    ├── MatchCreator.tsx          (form: seleccionar 2 equipos)
    ├── MatchControl.tsx          (abrir ronda / cerrar ronda / cerrar match)
    ├── LiveVotes.tsx             (barras de votos en tiempo real via WS)
    ├── MvpCreator.tsx            (form: seleccionar integrantes elegibles)
    ├── MvpControl.tsx            (abrir/cerrar votación MVP)
    └── LiveMvpVotes.tsx          (grid de integrantes con votos en vivo)
```

## Endpoints de la API — contrato completo

### Auth
```
POST /auth/login         → { access_token, token_type }
GET  /auth/me            → { username } (requiere JWT)
```

### Público (sin auth — lo consume el landing)
```
GET  /api/live-state     → { match: ActiveMatch | null, mvp: ActiveMvp | null }
POST /api/rounds/{id}/vote    body: { team_id, session_token }
POST /api/mvp/{id}/vote       body: { member_id, session_token }
```

### Admin (requieren JWT)
```
GET  /api/dates                           → lista de 4 fechas con sus matches
POST /api/matches                         body: { date_id, team_a_id, team_b_id }
PATCH /api/matches/{id}/start             → activa el match
PATCH /api/matches/{id}/finish            → cierra match, calcula ganador
POST  /api/matches/{id}/rounds            → abre nueva ronda
PATCH /api/rounds/{id}/close              → cierra ronda, calcula ganador
POST  /api/mvp                            body: { date_id, member_ids[] }
PATCH /api/mvp/{id}/open                  → abre votación MVP
PATCH /api/mvp/{id}/close                 → cierra, proclama MVP
GET   /api/rounds/{id}/results            → votos actuales de una ronda
GET   /api/mvp/{id}/results               → votos actuales MVP
```

### WebSockets
```
WS /ws/match/{match_id}   → broadcast: vote_update, round_closed, round_opened, match_finished
WS /ws/mvp/{mvp_id}       → broadcast: vote_update, mvp_closed
```

## Modelos de BD

```python
# EventDate — las 4 fechas del torneo (se crean con el seed inicial)
id, date_number (1-4), label, event_date, status

# Match — enfrentamiento entre 2 equipos
id, event_date_id, team_a_id, team_b_id, status, winner_team_id, order_in_date

# Round — ronda dentro de un match (incremental)
id, match_id, round_number, status, winner_team_id, opened_at, closed_at

# Vote — voto de catch por equipo
id, round_id, team_voted_id, session_token, created_at
UNIQUE(round_id, session_token)

# MvpVoting — votación MVP de una fecha
id, event_date_id, status, eligible_member_ids (JSON), winner_member_id, opened_at, closed_at

# MvpVote — voto individual al MVP
id, mvp_voting_id, member_id, session_token, created_at
UNIQUE(mvp_voting_id, session_token)

# AdminUser — usuario del dashboard
id, username, hashed_password, created_at
```

## WebSocket — ConnectionManager

```python
# ws_manager.py
class ConnectionManager:
    def __init__(self):
        # match_id → List[WebSocket]
        self.match_connections: dict[str, list[WebSocket]] = {}
        # mvp_id → List[WebSocket]
        self.mvp_connections: dict[str, list[WebSocket]] = {}

    async def connect_match(self, match_id: str, ws: WebSocket): ...
    async def disconnect_match(self, match_id: str, ws: WebSocket): ...
    async def broadcast_match(self, match_id: str, message: dict): ...
    async def connect_mvp(self, mvp_id: str, ws: WebSocket): ...
    async def disconnect_mvp(self, mvp_id: str, ws: WebSocket): ...
    async def broadcast_mvp(self, mvp_id: str, message: dict): ...

manager = ConnectionManager()  # singleton global
```

## Manejo de JWT en el Dashboard (client-side)

```typescript
// El token se guarda en localStorage bajo 'impronakuy_admin_token'
// AuthGuard.tsx verifica en onMount:
//   - si no hay token → redirect a /dashboard/login
//   - si hay token → GET /auth/me para verificar validez
//   - si 401 → borrar token + redirect a /dashboard/login

// Hook useAdminAuth():
//   token: string | null
//   isChecking: boolean
//   logout(): void
```

## Paleta dashboard — funcional oscura

```css
/* Variables en DashboardLayout.astro */
--db-bg:      #0f172a;
--db-surface: #1e293b;
--db-border:  #334155;
--db-text:    #e2e8f0;
--db-muted:   #94a3b8;
--db-accent:  #818cf8;   /* indigo — acciones principales */
--db-success: #4ade80;   /* verde — ganador, cerrado ok */
--db-warning: #fbbf24;   /* amarillo — activo, en vivo */
--db-danger:  #f87171;   /* rojo — cerrar, eliminar */
```

## Fuentes dashboard

Reutilizar las ya disponibles en `public/fonts/`:
- `Manrope-SemiBold.woff2` → títulos de sección
- `Inter_18pt-Medium.woff2` → labels y botones
- `Inter_18pt-Regular.woff2` → texto general

## Seed inicial

Al arrancar por primera vez, el backend debe crear:
1. Las 4 fechas del evento en `EventDate`
2. El usuario admin con las credenciales del `.env`

Implementar en `app/seed.py` con función `run_seed()` llamada desde `main.py` en el evento `startup`.
