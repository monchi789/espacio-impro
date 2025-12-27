import json
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import update
from ..database import get_db
from ..models import EventoDB, EquipoDB, HistorialDB
from ..schemas import EventoCrear, EventoSalida
from ..managers import manager
from ..security import get_current_admin # Importamos la seguridad

# TODAS las rutas de este router pedirán usuario y contraseña
router = APIRouter(
    prefix="/admin", 
    tags=["Admin"], 
    dependencies=[Depends(get_current_admin)]
)

@router.post("/crear-evento", response_model=EventoSalida)
def crear_evento(evento: EventoCrear, db: Session = Depends(get_db)):
    nuevo_evento = EventoDB(nombre=evento.nombre)
    db.add(nuevo_evento)
    db.commit()
    db.refresh(nuevo_evento)
    
    for eq in evento.equipos:
        db.add(EquipoDB(nombre=eq.nombre, color=eq.color, evento_id=nuevo_evento.id))
    db.commit()
    db.refresh(nuevo_evento)
    return nuevo_evento

@router.post("/activar/{evento_id}")
def activar_evento_en_vivo(evento_id: int, db: Session = Depends(get_db)):
    # 1. Apagar todos
    db.execute(update(EventoDB).values(en_vivo=False))
    # 2. Encender el elegido
    evento = db.query(EventoDB).filter(EventoDB.id == evento_id).first()
    if not evento: raise HTTPException(404, "Evento no existe")
    
    evento.en_vivo = True
    db.commit()
    return {"mensaje": f"Evento '{evento.nombre}' (ID: {evento.id}) ahora está EN VIVO"}

@router.post("/{evento_id}/siguiente-ronda")
async def siguiente_ronda(evento_id: int, db: Session = Depends(get_db)):
    evento = db.query(EventoDB).filter(EventoDB.id == evento_id).first()
    if not evento: raise HTTPException(404, "Evento no existe")

    # 1. Guardar Snapshot
    resultados = [{"nombre": e.nombre, "votos": e.votos} for e in evento.equipos]
    db.add(HistorialDB(
        evento_id=evento.id, 
        ronda=evento.ronda_actual, 
        resultados_json=json.dumps(resultados)
    ))

    # 2. Limpiar votos y subir ronda
    for e in evento.equipos:
        e.votos = 0
    evento.ronda_actual += 1
    
    db.commit()

    # 3. Avisar al Frontend (Socket)
    await manager.broadcast(json.dumps({
        "tipo": "NUEVA_RONDA",
        "ronda": evento.ronda_actual,
        "equipos": [{"id": e.id, "votos": 0} for e in evento.equipos]
    }), evento.id)
    
    return {"mensaje": "Ronda guardada y reiniciada"}

@router.post("/{evento_id}/terminar-votacion")
async def terminar_votacion(evento_id: int, db: Session = Depends(get_db)):
    evento = db.query(EventoDB).filter(EventoDB.id == evento_id).first()
    if not evento: raise HTTPException(404, "Evento no existe")

    # 1. Guardar snapshot final antes de terminar
    resultados = [{"nombre": e.nombre, "votos": e.votos} for e in evento.equipos]
    db.add(HistorialDB(
        evento_id=evento.id, 
        ronda=evento.ronda_actual, 
        resultados_json=json.dumps(resultados)
    ))

    # 2. Desactivar la votación
    evento.en_vivo = False
    db.commit()

    # 3. Avisar al Frontend
    await manager.broadcast(json.dumps({
        "tipo": "VOTACION_TERMINADA",
        "mensaje": "La votación ha terminado"
    }), evento.id)
    
    return {"mensaje": "Votación terminada exitosamente"}

@router.get("/{evento_id}/reporte")
def obtener_reporte(evento_id: int, db: Session = Depends(get_db)):
    evento = db.query(EventoDB).filter(EventoDB.id == evento_id).first()
    if not evento: raise HTTPException(404, "Evento no existe")

    # Obtener historial de todas las rondas
    historial = db.query(HistorialDB).filter(HistorialDB.evento_id == evento_id).order_by(HistorialDB.ronda).all()
    
    rondas = []
    for registro in historial:
        rondas.append({
            "ronda": registro.ronda,
            "fecha": registro.fecha_registro,
            "resultados": json.loads(registro.resultados_json)
        })
    
    # Votos finales actuales
    votos_finales = [{"id": e.id, "nombre": e.nombre, "color": e.color, "votos": e.votos} for e in evento.equipos]
    
    return {
        "evento_id": evento.id,
        "nombre": evento.nombre,
        "en_vivo": evento.en_vivo,
        "ronda_actual": evento.ronda_actual,
        "rondas": rondas,
        "votos_finales": votos_finales
    }