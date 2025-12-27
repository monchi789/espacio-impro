import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import engine, Base
from .routers import admin, public, ws

# Crear tablas al iniciar
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Espacio Impro")

# CORS: Configura esto con tu dominio real de React en produccion
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
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