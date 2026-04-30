from datetime import UTC, datetime

from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    WebSocket,
    WebSocketDisconnect,
    status,
)
from sqlalchemy import func, select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import AsyncSessionLocal, get_db
from app.deps import get_current_admin
from app.models.event import EventDate, Match
from app.models.voting import MvpVote, MvpVoting
from app.schemas.voting import (
    CreateMvpRequest,
    MvpMemberResult,
    MvpResults,
    MvpVoteRequest,
)
from app.ws_manager import manager

router = APIRouter()


async def _mvp_results(db: AsyncSession, mvp: MvpVoting) -> list[MvpMemberResult]:
    result = await db.execute(
        select(MvpVote.member_id, func.count(MvpVote.id))
        .where(MvpVote.mvp_voting_id == mvp.id)
        .group_by(MvpVote.member_id)
    )
    counts = {row[0]: row[1] for row in result.all()}
    return [
        MvpMemberResult(member_id=mid, votes=counts.get(mid, 0))
        for mid in mvp.eligible_member_ids
    ]


@router.post("/mvp", status_code=status.HTTP_201_CREATED)
async def create_mvp(
    payload: CreateMvpRequest,
    db: AsyncSession = Depends(get_db),
    _admin=Depends(get_current_admin),
):
    if not payload.member_ids:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Debe haber al menos un integrante elegible",
        )
    date_result = await db.execute(select(EventDate).where(EventDate.id == payload.date_id))
    if not date_result.scalar_one_or_none():
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Fecha no encontrada"
        )

    active_result = await db.execute(
        select(MvpVoting.id).where(MvpVoting.status.in_(["pending", "open"]))
    )
    if active_result.first():
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT, detail="Ya hay una votación MVP en curso"
        )

    mvp = MvpVoting(
        event_date_id=payload.date_id,
        status="pending",
        eligible_member_ids=payload.member_ids,
    )
    db.add(mvp)
    await db.flush()
    return {
        "id": mvp.id,
        "status": mvp.status,
        "eligible_member_ids": mvp.eligible_member_ids,
    }


@router.patch("/mvp/{mvp_id}/open")
async def open_mvp(
    mvp_id: str,
    db: AsyncSession = Depends(get_db),
    _admin=Depends(get_current_admin),
):
    result = await db.execute(select(MvpVoting).where(MvpVoting.id == mvp_id))
    mvp = result.scalar_one_or_none()
    if not mvp:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Votación no encontrada"
        )
    if mvp.status == "open":
        return {"id": mvp.id, "status": mvp.status}
    if mvp.status == "closed":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="La votación ya cerró"
        )

    active_match = await db.execute(select(Match.id).where(Match.status == "active"))
    if active_match.first():
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="No se puede abrir MVP con un match activo",
        )

    mvp.status = "open"
    mvp.opened_at = datetime.now(UTC)
    await db.flush()
    return {"id": mvp.id, "status": mvp.status}


@router.patch("/mvp/{mvp_id}/close")
async def close_mvp(
    mvp_id: str,
    db: AsyncSession = Depends(get_db),
    _admin=Depends(get_current_admin),
):
    result = await db.execute(select(MvpVoting).where(MvpVoting.id == mvp_id))
    mvp = result.scalar_one_or_none()
    if not mvp:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Votación no encontrada"
        )
    if mvp.status != "open":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="La votación no está abierta"
        )

    results = await _mvp_results(db, mvp)
    winner = None
    if results:
        top = max(results, key=lambda r: r.votes)
        ties = [r for r in results if r.votes == top.votes]
        winner = top.member_id if len(ties) == 1 and top.votes > 0 else None

    mvp.status = "closed"
    mvp.winner_member_id = winner
    mvp.closed_at = datetime.now(UTC)
    await db.flush()

    await manager.broadcast_mvp(
        mvp.id,
        {
            "type": "mvp_closed",
            "winner_member_id": winner,
            "results": [r.model_dump() for r in results],
        },
    )
    return {"id": mvp.id, "status": mvp.status, "winner_member_id": winner}


@router.post("/mvp/{mvp_id}/vote", status_code=status.HTTP_201_CREATED)
async def vote_mvp(
    mvp_id: str,
    payload: MvpVoteRequest,
    db: AsyncSession = Depends(get_db),
):
    from app.routers.settings import ensure_voting_enabled
    await ensure_voting_enabled(db)
    result = await db.execute(select(MvpVoting).where(MvpVoting.id == mvp_id))
    mvp = result.scalar_one_or_none()
    if not mvp:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Votación no encontrada"
        )
    if mvp.status != "open":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="La votación no está abierta"
        )
    if payload.member_id not in mvp.eligible_member_ids:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Integrante no elegible"
        )

    existing_result = await db.execute(
        select(MvpVote).where(
            MvpVote.mvp_voting_id == mvp_id,
            MvpVote.session_token == payload.session_token,
        )
    )
    existing = existing_result.scalar_one_or_none()
    if existing:
        existing.member_id = payload.member_id
        await db.flush()
    else:
        vote = MvpVote(
            mvp_voting_id=mvp_id,
            member_id=payload.member_id,
            session_token=payload.session_token,
        )
        db.add(vote)
        try:
            await db.flush()
        except IntegrityError:
            await db.rollback()
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT, detail="Conflicto de voto MVP"
            )

    results = await _mvp_results(db, mvp)
    await manager.broadcast_mvp(
        mvp.id,
        {"type": "vote_update", "results": [r.model_dump() for r in results]},
    )
    return {"ok": True, "results": [r.model_dump() for r in results]}


@router.get("/mvp/{mvp_id}/results", response_model=MvpResults)
async def mvp_results(mvp_id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(MvpVoting).where(MvpVoting.id == mvp_id))
    mvp = result.scalar_one_or_none()
    if not mvp:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Votación no encontrada"
        )
    results = await _mvp_results(db, mvp)
    return MvpResults(
        id=mvp.id,
        status=mvp.status,
        winner_member_id=mvp.winner_member_id,
        results=results,
    )


@router.websocket("/ws/mvp/{mvp_id}")
async def ws_mvp(websocket: WebSocket, mvp_id: str):
    await manager.connect_mvp(mvp_id, websocket)
    try:
        async with AsyncSessionLocal() as db:
            result = await db.execute(select(MvpVoting).where(MvpVoting.id == mvp_id))
            mvp = result.scalar_one_or_none()
            if mvp:
                results = await _mvp_results(db, mvp)
                await websocket.send_json(
                    {
                        "type": "init",
                        "mvp_id": mvp.id,
                        "status": mvp.status,
                        "results": [r.model_dump() for r in results],
                    }
                )
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        manager.disconnect_mvp(mvp_id, websocket)
    except Exception:
        manager.disconnect_mvp(mvp_id, websocket)
