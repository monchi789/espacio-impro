from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from ..managers import manager

router = APIRouter()

@router.websocket("/ws/{evento_id}")
async def websocket_endpoint(websocket: WebSocket, evento_id: int):
    # Nota: WebSocket no suele llevar Auth Basic standard, 
    # se protege validando el evento_id o por token en query param si fuera necesario.
    # Para votaciones públicas, suele dejarse abierto.
    await manager.connect(websocket, evento_id)
    try:
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        manager.disconnect(websocket, evento_id)
        