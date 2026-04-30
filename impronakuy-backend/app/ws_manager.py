from fastapi import WebSocket


class ConnectionManager:
    def __init__(self) -> None:
        self.match_connections: dict[str, list[WebSocket]] = {}
        self.mvp_connections: dict[str, list[WebSocket]] = {}

    async def connect_match(self, match_id: str, websocket: WebSocket) -> None:
        await websocket.accept()
        self.match_connections.setdefault(match_id, []).append(websocket)

    def disconnect_match(self, match_id: str, websocket: WebSocket) -> None:
        conns = self.match_connections.get(match_id, [])
        if websocket in conns:
            conns.remove(websocket)
        if not conns and match_id in self.match_connections:
            del self.match_connections[match_id]

    async def broadcast_match(self, match_id: str, message: dict) -> None:
        conns = list(self.match_connections.get(match_id, []))
        dead: list[WebSocket] = []
        for ws in conns:
            try:
                await ws.send_json(message)
            except Exception:
                dead.append(ws)
        for ws in dead:
            self.disconnect_match(match_id, ws)

    async def connect_mvp(self, mvp_id: str, websocket: WebSocket) -> None:
        await websocket.accept()
        self.mvp_connections.setdefault(mvp_id, []).append(websocket)

    def disconnect_mvp(self, mvp_id: str, websocket: WebSocket) -> None:
        conns = self.mvp_connections.get(mvp_id, [])
        if websocket in conns:
            conns.remove(websocket)
        if not conns and mvp_id in self.mvp_connections:
            del self.mvp_connections[mvp_id]

    async def broadcast_mvp(self, mvp_id: str, message: dict) -> None:
        conns = list(self.mvp_connections.get(mvp_id, []))
        dead: list[WebSocket] = []
        for ws in conns:
            try:
                await ws.send_json(message)
            except Exception:
                dead.append(ws)
        for ws in dead:
            self.disconnect_mvp(mvp_id, ws)


manager = ConnectionManager()
