from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import EventoDB, EquipoDB
from ..managers import manager
import json

router = APIRouter(tags=["Publico"])

@router.get("/api/votacion-activa")
def obtener_votacion_activa(db: Session = Depends(get_db)):
    evento = db.query(EventoDB).filter(EventoDB.en_vivo == True).first()
    
    if not evento:
        return {"estado": "esperando", "mensaje": "No hay votación en curso"}
    
    return {
        "estado": "activa",
        "socket_room_id": evento.id,
        "nombre": evento.nombre,
        "ronda": evento.ronda_actual,
        "equipos": [{"id": e.id, "nombre": e.nombre, "color": e.color, "votos": e.votos} for e in evento.equipos]
    }

@router.post("/api/votar/{equipo_id}")
async def registrar_voto(equipo_id: int, db: Session = Depends(get_db)):
    equipo = db.query(EquipoDB).filter(EquipoDB.id == equipo_id).first()
    if not equipo: raise HTTPException(404, "Equipo no encontrado")
    
    evento = equipo.evento
    if not evento.en_vivo: raise HTTPException(400, "Votación cerrada")

    equipo.votos += 1
    db.commit()

    # Notificar WebSocket
    payload = {
        "tipo": "ACTUALIZACION",
        "equipos": [{"id": e.id, "votos": e.votos} for e in evento.equipos]
    }
    await manager.broadcast(json.dumps(payload), evento.id)

    return {"ok": True}
