from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import get_settings
from app.database import AsyncSessionLocal
from app.routers import auth, dates, matches, mvp, public, settings as settings_router, voting
from app.seed import run_seed

settings = get_settings()


@asynccontextmanager
async def lifespan(app: FastAPI):
    async with AsyncSessionLocal() as db:
        await run_seed(db)
    yield


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
app.include_router(settings_router.router, tags=["settings"])
