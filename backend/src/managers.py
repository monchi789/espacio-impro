from typing import Dict, List
from fastapi import WebSocket

class ConnectionManager:
    def __init__(self):
        # Mapea CodigoEvento -> Lista de Conexiones
        self.active_connections: Dict[int, List[WebSocket]] = {}
    
    async def connect(self, websocket: WebSocket, evento_id: int):
        await websocket.accept()
        if evento_id not in self.active_connections:
            self.active_connections[evento_id] = []
        self.active_connections[evento_id].append(websocket)
    
    def disconnect(self, websocket: WebSocket, evento_id: int):
        if evento_id in self.active_connections:
            if websocket in self.active_connections[evento_id]:
                self.active_connections[evento_id].remove(websocket)
            # Limpia la memoria si la sala esta vacía
            if not self.active_connections[evento_id]:
                del self.active_connections[evento_id]
    
    async def broadcast(self, message: str, evento_id: int):
        if evento_id in self.active_connections:
            for connection in self.active_connections[evento_id]:
                try: 
                    await connection.send_text(message)
                except:
                    # Si falla lo desconectamos
                    self.disconnect(connection, evento_id)

manager = ConnectionManager()
