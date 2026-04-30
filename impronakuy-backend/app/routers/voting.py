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
from sqlalchemy.orm import selectinload

from app.database import AsyncSessionLocal, get_db
from app.models.event import Match, Round
from app.models.voting import Vote
from app.routers.public import build_active_match_payload
from app.schemas.voting import CatchVoteRequest, RoundResultsResponse
from app.ws_manager import manager

router = APIRouter()


async def _vote_counts(db: AsyncSession, round_id: str, match: Match) -> tuple[int, int]:
    result = await db.execute(
        select(Vote.team_voted_id, func.count(Vote.id))
        .where(Vote.round_id == round_id)
        .group_by(Vote.team_voted_id)
    )
    counts = {row[0]: row[1] for row in result.all()}
    return counts.get(match.team_a_id, 0), counts.get(match.team_b_id, 0)


@router.post("/rounds/{round_id}/vote", status_code=status.HTTP_201_CREATED)
async def cast_vote(
    round_id: str,
    payload: CatchVoteRequest,
    db: AsyncSession = Depends(get_db),
):
    from app.routers.settings import ensure_voting_enabled
    await ensure_voting_enabled(db)
    round_result = await db.execute(select(Round).where(Round.id == round_id))
    round_obj = round_result.scalar_one_or_none()
    if not round_obj:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Ronda no encontrada"
        )
    if round_obj.status != "open":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="La ronda no está abierta"
        )

    match_result = await db.execute(select(Match).where(Match.id == round_obj.match_id))
    match = match_result.scalar_one()
    if payload.team_id not in (match.team_a_id, match.team_b_id):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="El equipo no es parte del match",
        )

    existing_result = await db.execute(
        select(Vote).where(
            Vote.round_id == round_id, Vote.session_token == payload.session_token
        )
    )
    existing = existing_result.scalar_one_or_none()
    if existing:
        existing.team_voted_id = payload.team_id
        await db.flush()
    else:
        vote = Vote(
            round_id=round_id,
            team_voted_id=payload.team_id,
            session_token=payload.session_token,
        )
        db.add(vote)
        try:
            await db.flush()
        except IntegrityError:
            await db.rollback()
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT, detail="Conflicto de voto"
            )

    votes_a, votes_b = await _vote_counts(db, round_id, match)
    await manager.broadcast_match(
        match.id,
        {
            "type": "vote_update",
            "round_id": round_id,
            "votes_a": votes_a,
            "votes_b": votes_b,
        },
    )
    # Full IKActiveMatch payload para landing VotingPanel
    full_match_result = await db.execute(
        select(Match).options(selectinload(Match.rounds)).where(Match.id == match.id)
    )
    full_match = full_match_result.scalar_one()
    payload = await build_active_match_payload(db, full_match)
    await manager.broadcast_match(match.id, payload)
    return {"ok": True, "votes_a": votes_a, "votes_b": votes_b}


@router.get("/rounds/{round_id}/results", response_model=RoundResultsResponse)
async def round_results(round_id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Round).where(Round.id == round_id))
    round_obj = result.scalar_one_or_none()
    if not round_obj:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Ronda no encontrada"
        )
    match_result = await db.execute(select(Match).where(Match.id == round_obj.match_id))
    match = match_result.scalar_one()
    votes_a, votes_b = await _vote_counts(db, round_id, match)
    return RoundResultsResponse(
        round_id=round_obj.id,
        round_status=round_obj.status,
        votes_a=votes_a,
        votes_b=votes_b,
    )


@router.websocket("/ws/match/{match_id}")
async def ws_match(websocket: WebSocket, match_id: str):
    await manager.connect_match(match_id, websocket)
    try:
        async with AsyncSessionLocal() as db:
            match_result = await db.execute(select(Match).where(Match.id == match_id))
            match = match_result.scalar_one_or_none()
            if match:
                round_result = await db.execute(
                    select(Round)
                    .where(Round.match_id == match_id)
                    .order_by(Round.round_number.desc())
                    .limit(1)
                )
                latest = round_result.scalar_one_or_none()
                votes_a = votes_b = 0
                if latest:
                    votes_a, votes_b = await _vote_counts(db, latest.id, match)
                await websocket.send_json(
                    {
                        "type": "init",
                        "match_id": match_id,
                        "round_id": latest.id if latest else None,
                        "round_number": latest.round_number if latest else None,
                        "round_status": latest.status if latest else None,
                        "votes_a": votes_a,
                        "votes_b": votes_b,
                    }
                )
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        manager.disconnect_match(match_id, websocket)
    except Exception:
        manager.disconnect_match(match_id, websocket)
