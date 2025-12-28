from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import EventoDB, EquipoDB
from ..managers import manager
from ..schemas import ContactoFormulario
from ..email_service import email_service
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

@router.post("/api/contacto")
async def enviar_contacto(formulario: ContactoFormulario):
    """
    Endpoint para enviar mensajes de contacto.
    Envía un correo al usuario y otro al administrador.
    
    Parámetros:
    - nombre: Nombre de la persona
    - email: Correo electrónico del remitente
    - mensaje: Mensaje a enviar
    """
    try:
        resultado = await email_service.send_contact_form_email(
            nombre=formulario.nombre,
            email_remitente=formulario.email,
            mensaje=formulario.mensaje
        )
        return resultado
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error al enviar el correo: {str(e)}"
        )

