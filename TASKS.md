# TASKS.md — Backend FastAPI + Dashboard Admin

Directorio de trabajo:
- Backend: `/home/monchi789/Projects/espacio-impro/impronakuy-backend/`
- Dashboard: `/home/monchi789/Projects/espacio-impro/frontend/`

---

## FASE 0 — Setup del backend

### TASK-B001: Crear estructura de carpetas del backend
```bash
cd /home/monchi789/Projects/espacio-impro/impronakuy-backend

mkdir -p app/models
mkdir -p app/schemas
mkdir -p app/routers
mkdir -p alembic/versions

touch app/__init__.py
touch app/models/__init__.py
touch app/schemas/__init__.py
touch app/routers/__init__.py
```
**Done cuando**: La estructura de carpetas existe.

---

### TASK-B002: Crear `app/config.py`
```python
from pydantic_settings import BaseSettings
from functools import lru_cache

class Settings(BaseSettings):
    database_url: str
    secret_key: str
    admin_username: str
    admin_password: str
    access_token_expire_minutes: int = 480
    cors_origins: str = "http://localhost:4321"
    environment: str = "production"

    @property
    def cors_origins_list(self) -> list[str]:
        return [o.strip() for o in self.cors_origins.split(",")]

    class Config:
        env_file = ".env"

@lru_cache
def get_settings() -> Settings:
    return Settings()
```
**Done cuando**: `from app.config import get_settings` funciona sin errores.

---

### TASK-B003: Crear `app/database.py`
```python
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from sqlalchemy.orm import DeclarativeBase
from app.config import get_settings

settings = get_settings()

engine = create_async_engine(
    settings.database_url,
    echo=settings.environment == "development",
    pool_size=10,
    max_overflow=20,
)

AsyncSessionLocal = async_sessionmaker(
    engine,
    class_=AsyncSession,
    expire_on_commit=False,
)

class Base(DeclarativeBase):
    pass

async def get_db():
    async with AsyncSessionLocal() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise
```
**Done cuando**: El engine se crea sin errores.

---

### TASK-B004: Crear modelos SQLAlchemy en `app/models/`

**`app/models/admin.py`**:
```python
from sqlalchemy import String, DateTime
from sqlalchemy.orm import Mapped, mapped_column
from datetime import datetime, UTC
from app.database import Base

class AdminUser(Base):
    __tablename__ = "admin_users"

    id: Mapped[str] = mapped_column(String, primary_key=True)
    username: Mapped[str] = mapped_column(String, unique=True, nullable=False)
    hashed_password: Mapped[str] = mapped_column(String, nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(UTC)
    )
```

**`app/models/event.py`**:
```python
# Modelos: EventDate, Match, Round
# EventDate: id, date_number (1-4), label, event_date, status
# Match: id, event_date_id (FK), team_a_id, team_b_id, status,
#        winner_team_id (nullable), order_in_date
# Round: id, match_id (FK), round_number, status,
#        winner_team_id (nullable), opened_at, closed_at
# Usar Mapped[] con tipos explícitos
# status como String con valores: pending/active/finished para Match,
#                                  open/closed para Round
#                                  upcoming/active/done para EventDate
```

**`app/models/voting.py`**:
```python
# Modelos: Vote, MvpVoting, MvpVote
# Vote: id, round_id (FK), team_voted_id, session_token, created_at
#       UniqueConstraint("round_id", "session_token")
# MvpVoting: id, event_date_id (FK), status (open/closed),
#            eligible_member_ids (JSON), winner_member_id (nullable),
#            opened_at, closed_at
# MvpVote: id, mvp_voting_id (FK), member_id, session_token, created_at
#          UniqueConstraint("mvp_voting_id", "session_token")
# Usar uuid.uuid4() como default para ids
```

**`app/models/__init__.py`**:
```python
from app.models.admin import AdminUser
from app.models.event import EventDate, Match, Round
from app.models.voting import Vote, MvpVoting, MvpVote

__all__ = ["AdminUser", "EventDate", "Match", "Round", "Vote", "MvpVoting", "MvpVote"]
```

**Done cuando**: Todos los modelos importan sin errores.

---

### TASK-B005: Configurar Alembic

```bash
cd /home/monchi789/Projects/espacio-impro/impronakuy-backend
alembic init alembic
```

Editar `alembic/env.py`:
- Importar `Base` de `app.database`
- Importar todos los modelos de `app.models`
- Configurar `target_metadata = Base.metadata`
- Usar `settings.database_url` para la URL de conexión
- Configurar para async con `run_async_migrations()`

Crear `alembic/versions/001_initial.py`:
```bash
alembic revision --autogenerate -m "initial"
```

**Done cuando**: `alembic upgrade head` crea todas las tablas en PostgreSQL sin errores.

---

### TASK-B006: Crear `app/ws_manager.py`
```python
from fastapi import WebSocket
import json

class ConnectionManager:
    def __init__(self):
        self.match_connections: dict[str, list[WebSocket]] = {}
        self.mvp_connections: dict[str, list[WebSocket]] = {}

    async def connect_match(self, match_id: str, websocket: WebSocket):
        await websocket.accept()
        self.match_connections.setdefault(match_id, []).append(websocket)

    def disconnect_match(self, match_id: str, websocket: WebSocket):
        conns = self.match_connections.get(match_id, [])
        if websocket in conns:
            conns.remove(websocket)

    async def broadcast_match(self, match_id: str, message: dict):
        conns = self.match_connections.get(match_id, [])
        dead = []
        for ws in conns:
            try:
                await ws.send_json(message)
            except Exception:
                dead.append(ws)
        for ws in dead:
            self.disconnect_match(match_id, ws)

    async def connect_mvp(self, mvp_id: str, websocket: WebSocket):
        await websocket.accept()
        self.mvp_connections.setdefault(mvp_id, []).append(websocket)

    def disconnect_mvp(self, mvp_id: str, websocket: WebSocket):
        conns = self.mvp_connections.get(mvp_id, [])
        if websocket in conns:
            conns.remove(websocket)

    async def broadcast_mvp(self, mvp_id: str, message: dict):
        conns = self.mvp_connections.get(mvp_id, [])
        dead = []
        for ws in conns:
            try:
                await ws.send_json(message)
            except Exception:
                dead.append(ws)
        for ws in dead:
            self.disconnect_mvp(mvp_id, ws)

manager = ConnectionManager()
```
**Done cuando**: El manager importa sin errores.

---

### TASK-B007: Crear `app/deps.py`
```python
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import JWTError, jwt
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_db
from app.models.admin import AdminUser
from app.config import get_settings
from sqlalchemy import select

settings = get_settings()
bearer = HTTPBearer()

async def get_current_admin(
    credentials: HTTPAuthorizationCredentials = Depends(bearer),
    db: AsyncSession = Depends(get_db),
) -> AdminUser:
    token = credentials.credentials
    try:
        payload = jwt.decode(token, settings.secret_key, algorithms=["HS256"])
        username: str = payload.get("sub")
        if not username:
            raise HTTPException(status_code=401, detail="Token inválido")
    except JWTError:
        raise HTTPException(status_code=401, detail="Token inválido o expirado")

    result = await db.execute(select(AdminUser).where(AdminUser.username == username))
    admin = result.scalar_one_or_none()
    if not admin:
        raise HTTPException(status_code=401, detail="Usuario no encontrado")
    return admin
```
**Done cuando**: El dep importa sin errores.

---

### TASK-B008: Crear `app/seed.py`
```python
import uuid
from datetime import date
from passlib.context import CryptContext
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.models.admin import AdminUser
from app.models.event import EventDate
from app.config import get_settings

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
settings = get_settings()

EVENT_DATES = [
    {"date_number": 1, "label": "Fecha 1", "event_date": date(2026, 1, 1)},
    {"date_number": 2, "label": "Fecha 2", "event_date": date(2026, 1, 8)},
    {"date_number": 3, "label": "Fecha 3", "event_date": date(2026, 1, 15)},
    {"date_number": 4, "label": "Fecha 4", "event_date": date(2026, 1, 22)},
]
# NOTA: Actualizar las fechas reales del evento antes del deploy

async def run_seed(db: AsyncSession):
    # Crear admin si no existe
    result = await db.execute(
        select(AdminUser).where(AdminUser.username == settings.admin_username)
    )
    if not result.scalar_one_or_none():
        admin = AdminUser(
            id=str(uuid.uuid4()),
            username=settings.admin_username,
            hashed_password=pwd_context.hash(settings.admin_password),
        )
        db.add(admin)

    # Crear las 4 fechas si no existen
    for date_data in EVENT_DATES:
        result = await db.execute(
            select(EventDate).where(EventDate.date_number == date_data["date_number"])
        )
        if not result.scalar_one_or_none():
            event_date = EventDate(id=str(uuid.uuid4()), **date_data, status="upcoming")
            db.add(event_date)

    await db.commit()
```
**Done cuando**: El seed corre sin errores en una BD vacía y es idempotente (puede correr N veces).

---

## FASE 1 — Routers del backend

### TASK-B009: Crear `app/routers/auth.py`
```python
# POST /auth/login
#   body: { username: str, password: str }
#   verifica credenciales con bcrypt
#   retorna: { access_token: str, token_type: "bearer" }
#
# GET /auth/me
#   requiere Depends(get_current_admin)
#   retorna: { username: str }
#
# JWT payload: { "sub": username, "exp": datetime }
# Usar settings.secret_key + HS256
```
**Done cuando**: POST /auth/login retorna JWT válido con credenciales correctas y 401 con incorrectas.

---

### TASK-B010: Crear `app/routers/dates.py`
```python
# GET /api/dates
#   requiere JWT
#   retorna lista de EventDate con sus matches y estado
#   cada fecha incluye: id, date_number, label, event_date, status, matches[]
#
# PATCH /api/dates/{id}/status
#   requiere JWT
#   body: { status: "upcoming" | "active" | "done" }
```
**Done cuando**: GET /api/dates retorna las 4 fechas del seed.

---

### TASK-B011: Crear `app/routers/matches.py`
```python
# POST /api/matches
#   requiere JWT
#   body: { date_id, team_a_id, team_b_id }
#   valida: team_a_id != team_b_id
#   valida: no hay match activo en este momento (globalmente)
#   crea match con status "pending"
#
# PATCH /api/matches/{id}/start
#   requiere JWT
#   valida: no hay otro match activo
#   cambia status a "active"
#   broadcast WS no necesario aquí (el polling lo detecta)
#
# POST /api/matches/{id}/rounds
#   requiere JWT
#   valida: match está active
#   valida: no hay ronda open en este match
#   crea Round con round_number = max(existentes) + 1, status "open"
#   broadcast a /ws/match/{id}: { type: "round_opened", roundNumber, roundId }
#
# PATCH /api/rounds/{id}/close
#   requiere JWT
#   calcula ganador: equipo con más votos en esa ronda
#   si empate: winner_team_id = None
#   actualiza round: status "closed", winner_team_id, closed_at
#   broadcast: { type: "round_closed", winnerTeamId, roundsWon: {teamA, teamB} }
#
# PATCH /api/matches/{id}/finish
#   requiere JWT
#   valida: no hay ronda open
#   calcula ganador por rondas ganadas
#   actualiza match: status "finished", winner_team_id
#   broadcast: { type: "match_finished", winnerTeamId }
```
**Done cuando**: El flujo completo match → rondas → finish funciona via curl/httpie.

---

### TASK-B012: Crear `app/routers/voting.py`
```python
# POST /api/rounds/{id}/vote
#   SIN auth (público)
#   body: { team_id: str, session_token: str }
#   valida: ronda está open
#   valida: team_id es team_a o team_b del match
#   inserta Vote con IntegrityError si ya votó (UNIQUE constraint)
#   si IntegrityError → 409 "Ya votaste en esta ronda"
#   broadcast a /ws/match/{match_id}: { type: "vote_update", votesA, votesB }
#
# GET /api/rounds/{id}/results
#   SIN auth (público)
#   retorna: { votesA: int, votesB: int, roundStatus: str }
#
# WS /ws/match/{match_id}
#   acepta conexión
#   envía estado actual al conectarse: { type: "init", votesA, votesB, roundNumber, roundStatus }
#   mantiene conexión
#   cleanup al desconectar
```
**Done cuando**: Voto incremental actualiza los contadores y llega via WS a todos los conectados.

---

### TASK-B013: Crear `app/routers/mvp.py`
```python
# POST /api/mvp
#   requiere JWT
#   body: { date_id: str, member_ids: list[str] }
#   valida: no hay MVP activo
#   crea MvpVoting con status "pending", eligible_member_ids = member_ids
#
# PATCH /api/mvp/{id}/open
#   requiere JWT
#   valida: no hay match activo (no pueden correr simultáneamente)
#   cambia status a "open"
#
# PATCH /api/mvp/{id}/close
#   requiere JWT
#   calcula ganador: member_id con más votos
#   actualiza: status "closed", winner_member_id, closed_at
#   broadcast: { type: "mvp_closed", winnerMemberId, results: [{memberId, votes}] }
#
# POST /api/mvp/{id}/vote
#   SIN auth (público)
#   body: { member_id: str, session_token: str }
#   valida: MVP está open
#   valida: member_id está en eligible_member_ids
#   inserta MvpVote con IntegrityError check (409 si ya votó)
#   broadcast: { type: "vote_update", results: [{memberId, votes}] }
#
# GET /api/mvp/{id}/results
#   SIN auth
#   retorna: { results: [{memberId, votes}], status, winnerMemberId }
#
# WS /ws/mvp/{mvp_id}
#   acepta conexión
#   envía estado actual al conectarse
#   mantiene conexión
```
**Done cuando**: Votación MVP completa funciona via curl incluyendo WS broadcast.

---

### TASK-B014: Crear `app/routers/public.py`
```python
# GET /api/live-state
#   SIN auth
#   retorna el estado actual completo para el landing:
#   {
#     match: {
#       id, teamA: {id, name, color}, teamB: {id, name, color},
#       currentRound: {id, roundNumber, status, votesA, votesB} | null,
#       roundsWon: {teamA, teamB},
#       status
#     } | null,
#     mvp: {
#       id,
#       eligibleMembers: [{memberId, votes}],
#       status,
#       totalVotes
#     } | null
#   }
#
# GET /health
#   SIN auth
#   retorna: { status: "ok" }
#   (usado por el healthcheck de podman)
```
**Done cuando**: GET /api/live-state retorna null/null cuando no hay nada activo.

---

### TASK-B015: Crear `app/main.py`
```python
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import get_settings
from app.database import AsyncSessionLocal
from app.seed import run_seed
from app.routers import auth, dates, matches, voting, mvp, public

settings = get_settings()

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: correr seed
    async with AsyncSessionLocal() as db:
        await run_seed(db)
    yield
    # Shutdown: nada especial

app = FastAPI(
    title="Impronakuy 2026 API",
    lifespan=lifespan,
    docs_url="/api/docs" if settings.environment == "development" else None,
    redoc_url=None,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, tags=["auth"])
app.include_router(public.router, tags=["public"])
app.include_router(dates.router, prefix="/api", tags=["dates"])
app.include_router(matches.router, prefix="/api", tags=["matches"])
app.include_router(voting.router, prefix="/api", tags=["voting"])
app.include_router(mvp.router, prefix="/api", tags=["mvp"])
```
**Done cuando**: `uvicorn app.main:app --reload` arranca sin errores y `/health` retorna ok.

---

## FASE 2 — Schemas Pydantic

### TASK-B016: Crear schemas en `app/schemas/`

**`app/schemas/auth.py`**:
```python
from pydantic import BaseModel

class LoginRequest(BaseModel):
    username: str
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"

class AdminMe(BaseModel):
    username: str
```

**`app/schemas/event.py`**:
```python
# CreateMatchRequest: date_id, team_a_id, team_b_id
# MatchResponse: id, date_id, team_a_id, team_b_id, status, winner_team_id, order_in_date
# RoundResponse: id, match_id, round_number, status, winner_team_id, opened_at, closed_at
# VoteCount: votes_a, votes_b
# DateResponse: id, date_number, label, event_date, status, matches: list[MatchResponse]
```

**`app/schemas/voting.py`**:
```python
# CatchVoteRequest: team_id, session_token
# MvpVoteRequest: member_id, session_token
# CreateMvpRequest: date_id, member_ids: list[str]
# MvpMemberResult: member_id, votes
# MvpResults: results: list[MvpMemberResult], status, winner_member_id
# LiveStateResponse: match: ActiveMatchData | None, mvp: ActiveMvpData | None
```

**Done cuando**: Todos los schemas importan y validan datos de prueba correctamente.

---

## FASE 3 — Dashboard (en el frontend Astro)

### TASK-D001: Crear `src/components/dashboard/DashboardLayout.astro`
Layout propio del dashboard. No usa Layout.astro del sitio.

```astro
---
interface Props { title?: string }
const { title = 'Dashboard — Impronakuy 2026' } = Astro.props
---
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>{title}</title>
  <link rel="preload" href="/fonts/Manrope-SemiBold.woff2" as="font" type="font/woff2" crossorigin />
</head>
<body class="dashboard-page">
  <nav class="db-sidebar">
    <div class="db-logo">IMPRONAKUY<br/><span>2026</span></div>
    <a href="/dashboard/fechas">Fechas</a>
    <button id="logout-btn">Cerrar sesión</button>
  </nav>
  <main class="db-main">
    <slot />
  </main>
</body>
</html>
```

Con `<style is:global>` scoped a `body.dashboard-page`:
- Variables CSS `--db-*`
- `@font-face` para Manrope e Inter
- Layout: sidebar fijo izquierda + main con scroll
- Reset base

**Done cuando**: El layout se renderiza con sidebar y área de contenido.

---

### TASK-D002: Crear `src/components/dashboard/AuthGuard.tsx`
```typescript
// Props: { children: ReactNode }
// En useEffect (client-side):
//   1. Lee token de localStorage('impronakuy_admin_token')
//   2. Si no hay token → window.location.href = '/dashboard/login'
//   3. Si hay token → GET /auth/me con Authorization: Bearer {token}
//   4. Si 401 → borra token → redirect login
//   5. Si 200 → setIsAuthorized(true)
// Mientras verifica: muestra spinner o null
// Si autorizado: renderiza children
```

CSS Module: `AuthGuard.module.css`
**Done cuando**: Sin token en localStorage, cualquier página del dashboard redirige al login.

---

### TASK-D003: Crear `src/components/dashboard/LoginForm.tsx`
```typescript
// Estado: username, password, error, isLoading
// onSubmit: POST /auth/login
//   200 → guarda token → window.location.href = '/dashboard/fechas'
//   401 → muestra "Credenciales incorrectas"
//   otro → muestra "Error del servidor"
// Form con dos inputs y botón submit
// Sin librería de forms — useState simple
```

CSS Module: `LoginForm.module.css`
Diseño: card centrada en la pantalla, fondo `--db-bg`, estilo oscuro funcional.

**Done cuando**: Login exitoso guarda el token y redirige. Login fallido muestra el error.

---

### TASK-D004: Crear páginas Astro del dashboard

**`src/pages/dashboard/index.astro`**:
```astro
---
// Redirect inmediato a /dashboard/fechas
// La protección real la hace AuthGuard en el cliente
---
<script>window.location.href = '/dashboard/fechas'</script>
```

**`src/pages/dashboard/login.astro`**:
```astro
---
import DashboardLayout from '../../components/dashboard/DashboardLayout.astro'
import LoginForm from '../../components/dashboard/LoginForm.tsx'
---
<DashboardLayout title="Login — Impronakuy 2026">
  <!-- Sin AuthGuard — esta es la página pública del dashboard -->
  <LoginForm client:load />
</DashboardLayout>
```

**`src/pages/dashboard/fechas/index.astro`**:
```astro
---
import DashboardLayout from '../../../components/dashboard/DashboardLayout.astro'
import AuthGuard from '../../../components/dashboard/AuthGuard.tsx'
import FechasList from '../../../components/dashboard/FechasList.tsx'
---
<DashboardLayout>
  <AuthGuard client:load>
    <FechasList client:load />
  </AuthGuard>
</DashboardLayout>
```

**`src/pages/dashboard/fechas/[fecha].astro`**:
```astro
---
export function getStaticPaths() {
  return [1,2,3,4].map(n => ({ params: { fecha: String(n) } }))
}
const { fecha } = Astro.params
import DashboardLayout from '../../../components/dashboard/DashboardLayout.astro'
import AuthGuard from '../../../components/dashboard/AuthGuard.tsx'
import FechaDetail from '../../../components/dashboard/FechaDetail.tsx'
---
<DashboardLayout>
  <AuthGuard client:load>
    <FechaDetail client:load fechaNumber={Number(fecha)} />
  </AuthGuard>
</DashboardLayout>
```

**Done cuando**: Las 4 rutas existen y redirigen al login si no hay token.

---

### TASK-D005: Crear `src/lib/dashboard-api.ts`
Helper para llamadas autenticadas a la API:

```typescript
// Funciones:
// getToken(): string | null — lee de localStorage
// authFetch(path, options?): Promise<Response>
//   agrega Authorization: Bearer {token}
//   si 401 → borra token + redirect login
//
// Todas las llamadas del dashboard usan authFetch
// Las llamadas públicas (live-state, vote) usan fetch normal
```

**Done cuando**: `authFetch('/auth/me')` retorna 200 con token válido.

---

### TASK-D006: Crear `src/components/dashboard/FechasList.tsx`
```typescript
// Fetcha GET /api/dates al montar
// Renderiza 4 cards en grid 2x2
// Cada card: número de fecha, label, estado (badge), cantidad de matches
// Click en card → window.location.href = `/dashboard/fechas/${fecha.date_number}`
// Estado: loading spinner, error state, empty state
```

CSS Module con cards oscuras, borde sutil, hover con ligero glow accent.

**Done cuando**: Las 4 fechas del seed aparecen como cards navegables.

---

### TASK-D007: Crear `src/components/dashboard/FechaDetail.tsx`
Props: `{ fechaNumber: number }`

```typescript
// Al montar: GET /api/dates → encuentra la fecha por date_number
// Estado: fecha, matches, mvpVoting, isLoading
// Polling cada 3s para mantener estado actualizado durante el evento
//
// Layout dos columnas:
//   izquierda: sección de matches
//   derecha: sección MVP
//
// Sección matches:
//   - lista de matches existentes con su estado
//   - si no hay match activo Y quedan slots: botón "Crear Match"
//     → toggle showMatchCreator
//   - si showMatchCreator: renderiza <MatchCreator>
//   - si hay match active: renderiza <MatchControl matchId={id}>
//
// Sección MVP:
//   - si todos los matches están finished: botón "Crear Votación MVP"
//   - si mvpVoting pending: botón "Abrir Votación"
//   - si mvpVoting open: renderiza <MvpControl mvpId={id}>
//   - si mvpVoting closed: muestra ganador
```

**Done cuando**: La vista de fecha muestra los matches y el estado del MVP correctamente.

---

### TASK-D008: Crear `src/components/dashboard/MatchCreator.tsx`
Props: `{ dateId: string, usedTeamIds: string[], onCreated: () => void }`

```typescript
// IK_TEAMS importado de '@/data/impronakuy-teams'
// Dos selects: Equipo A y Equipo B
// Filtra usedTeamIds de las opciones
// Valida que A !== B
// onSubmit:
//   POST /api/matches { date_id, team_a_id, team_b_id }
//   PATCH /api/matches/{id}/start
//   onCreated() → refresca FechaDetail
```

**Done cuando**: Crear un match y empezarlo funciona y actualiza la vista.

---

### TASK-D009: Crear `src/components/dashboard/LiveVotes.tsx`
Props: `{ matchId: string, teamAId: string, teamBId: string, teamAColor: string, teamBColor: string }`

```typescript
// Abre WS /ws/match/{matchId}
// Estado inicial: { votesA: 0, votesB: 0 }
// onmessage: actualiza votos según type
//   "vote_update" → setVotes
//   "round_closed" → muestra ganador de ronda brevemente
//   "match_finished" → banner ganador del match
// Reconexión automática: si WS se cierra inesperadamente, reintenta en 3s
// cleanup en useEffect return
//
// Renderiza:
//   Nombre equipo A | [barra progreso A] [barra progreso B] | Nombre equipo B
//   Números de votos en tiempo real
```

CSS Module con barras de color del equipo.

**Done cuando**: Los votos se actualizan en tiempo real en el dashboard.

---

### TASK-D010: Crear `src/components/dashboard/MatchControl.tsx`
Props: `{ matchId: string, onMatchFinished: () => void }`

```typescript
// Fetcha estado del match al montar
// Muestra:
//   - nombres de equipos con marcador de rondas (ej: "2 — 1")
//   - estado de la ronda actual (ABIERTA / CERRADA / sin ronda)
//   - <LiveVotes> si hay match activo
//
// Botones según estado:
//   sin ronda o ronda cerrada → "Abrir Nueva Ronda"
//     → POST /api/matches/{id}/rounds
//   ronda abierta → "Cerrar Ronda"
//     → PATCH /api/rounds/{roundId}/close
//     → confirmar con dialog: "¿Cerrar la ronda? [Cancelar] [Cerrar]"
//   siempre visible (si no hay ronda abierta) → "Cerrar Enfrentamiento"
//     → PATCH /api/matches/{id}/finish
//     → confirmar con dialog
//     → onMatchFinished()
//
// Deshabilitar botones durante operaciones async (isSubmitting)
```

**Done cuando**: El flujo completo de abrir/cerrar rondas y cerrar match funciona desde el dashboard.

---

### TASK-D011: Crear `src/components/dashboard/MvpCreator.tsx`
Props: `{ dateId: string, matchTeamIds: string[], onCreated: () => void }`

```typescript
// matchTeamIds: IDs de los equipos que jugaron en esta fecha
// Filtra IK_TEAMS para obtener solo esos equipos
// Muestra todos sus integrantes con checkboxes (todos pre-marcados)
// Admin puede desmarcar a alguno
// onSubmit:
//   POST /api/mvp { date_id, member_ids: selectedMemberIds }
//   PATCH /api/mvp/{id}/open
//   onCreated()
```

Layout: grid de integrantes con foto pequeña (foto1), nombre artístico, checkbox.

**Done cuando**: Se puede crear y abrir una votación MVP con los integrantes seleccionados.

---

### TASK-D012: Crear `src/components/dashboard/LiveMvpVotes.tsx`
Props: `{ mvpId: string, eligibleMemberIds: string[] }`

```typescript
// Abre WS /ws/mvp/{mvpId}
// Estado: { [memberId]: votes } inicializado en 0 para cada eligible
// onmessage type "vote_update" → actualiza votos
// Renderiza grid de integrantes:
//   foto + nombre artístico + barra de votos + número
//   ordenados por votos (mayor primero, actualización dinámica)
```

**Done cuando**: Los votos MVP se actualizan en tiempo real en el dashboard.

---

### TASK-D013: Crear `src/components/dashboard/MvpControl.tsx`
Props: `{ mvpId: string, eligibleMemberIds: string[], onMvpClosed: () => void }`

```typescript
// Muestra: "VOTACIÓN MVP — ABIERTA"
// <LiveMvpVotes>
// Botón "Proclamar MVP"
//   → confirmar: "¿Cerrar la votación y proclamar al MVP?"
//   → PATCH /api/mvp/{id}/close
//   → onMvpClosed()
// Si status closed: muestra banner "MVP: [nombre artístico del ganador]"
```

**Done cuando**: Cerrar la votación MVP muestra el ganador.

---

## FASE 4 — QA e integración

### TASK-B017: Test de flujo completo end-to-end
Verificar el flujo completo usando curl o httpie:

```bash
# 1. Login
TOKEN=$(curl -s -X POST http://localhost:8000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"TU_PASSWORD"}' | jq -r .access_token)

# 2. Ver fechas
curl -H "Authorization: Bearer $TOKEN" http://localhost:8000/api/dates

# 3. Crear match en fecha 1
MATCH=$(curl -s -X POST http://localhost:8000/api/matches \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"date_id":"[ID_FECHA_1]","team_a_id":"culiprincess","team_b_id":"tetris"}')

# 4. Iniciar match
MATCH_ID=$(echo $MATCH | jq -r .id)
curl -X PATCH http://localhost:8000/api/matches/$MATCH_ID/start \
  -H "Authorization: Bearer $TOKEN"

# 5. Verificar live-state (debería mostrar el match)
curl http://localhost:8000/api/live-state

# 6. Abrir ronda
curl -X POST http://localhost:8000/api/matches/$MATCH_ID/rounds \
  -H "Authorization: Bearer $TOKEN"

# 7. Votar (como público)
curl -X POST http://localhost:8000/api/rounds/[ROUND_ID]/vote \
  -H "Content-Type: application/json" \
  -d '{"team_id":"culiprincess","session_token":"test-token-123"}'

# 8. Verificar resultados
curl http://localhost:8000/api/rounds/[ROUND_ID]/results
```

**Done cuando**: Todos los pasos retornan los códigos esperados (200, 201, 409 en doble voto).

---

### TASK-B018: Verificar build Astro sin errores
```bash
cd /home/monchi789/Projects/espacio-impro/frontend
npm run build
```
Verificar:
- Sin errores TypeScript en los componentes del dashboard
- Las 4 rutas estáticas `/dashboard/fechas/[1-4]` se generan
- El sitio principal (`/`, `/nosotros`, etc.) sigue sin errores

**Done cuando**: Build exitoso, cero regresiones en el sitio principal.

---

### TASK-B019: Verificar contenedores en podman
```bash
cd /home/monchi789/Projects/espacio-impro
podman-compose up -d --build impronakuy-db
sleep 5
podman-compose run --rm impronakuy-api alembic upgrade head
podman-compose up -d

# Verificar que todos los contenedores están healthy
podman-compose ps

# Verificar que el seed corrió
curl http://localhost/api/live-state
curl http://localhost/health
```

**Done cuando**: Los 4 contenedores están `healthy` y `/api/live-state` responde.
