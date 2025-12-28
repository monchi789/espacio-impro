import uvicorn
import os
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import engine, Base
from .routers import admin, public, ws

# Cargar variables de entorno
load_dotenv()

# Crear tablas al iniciar
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Espacio Impro")

# Configuración de CORS desde variables de entorno
cors_origins_str = os.getenv("CORS_ORIGINS", "http://localhost:3000,http://localhost:4321")
allowed_origins = [origin.strip() for origin in cors_origins_str.split(",")]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(admin.router)
app.include_router(public.router)
app.include_router(ws.router)

@app.get("/")
def root():
    return {"mensaje": "Backend Funcionando. Ve a /docs para ver la API"}

def start():
    """Entrypoint para Poetry"""
    uvicorn.run("src.main:app", host="0.0.0.0", port=8000, reload=True)