from datetime import UTC, datetime

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.database import get_db
from app.deps import get_current_admin
from app.models.event import EventDate, Match, Round
from app.models.voting import MvpVoting, Vote
from app.schemas.event import (
    CreateMatchRequest,
    MatchResponse,
    PenaltyRequest,
    RoundResponse,
)
from app.scoring import compute_match_winner, compute_scores
from app.ws_manager import manager

router = APIRouter()


async def _any_active_match(db: AsyncSession, exclude_id: str | None = None) -> bool:
    stmt = select(Match.id).where(Match.status == "active")
    if exclude_id:
        stmt = stmt.where(Match.id != exclude_id)
    result = await db.execute(stmt)
    return result.first() is not None


async def _any_open_mvp(db: AsyncSession) -> bool:
    result = await db.execute(select(MvpVoting.id).where(MvpVoting.status == "open"))
    return result.first() is not None


def _calc_match_winner(match: Match, rounds: list[Round]) -> str | None:
    closed = [r for r in rounds if r.status == "closed"]
    if not closed:
        return None
    return compute_match_winner(match, closed)


@router.post(
    "/matches", response_model=MatchResponse, status_code=status.HTTP_201_CREATED
)
async def create_match(
    payload: CreateMatchRequest,
    db: AsyncSession = Depends(get_db),
    _admin=Depends(get_current_admin),
):
    if payload.team_a_id == payload.team_b_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Los equipos no pueden ser iguales",
        )

    date_result = await db.execute(
        select(EventDate).where(EventDate.id == payload.date_id)
    )
    event_date = date_result.scalar_one_or_none()
    if not event_date:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Fecha no encontrada"
        )

    if await _any_active_match(db):
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Ya hay un match activo",
        )

    order_result = await db.execute(
        select(func.count(Match.id)).where(Match.event_date_id == payload.date_id)
    )
    order = (order_result.scalar() or 0) + 1

    match = Match(
        event_date_id=payload.date_id,
        team_a_id=payload.team_a_id,
        team_b_id=payload.team_b_id,
        status="pending",
        order_in_date=order,
    )
    db.add(match)
    await db.flush()
    await db.refresh(match, ["rounds"])
    return MatchResponse.model_validate(match)


@router.patch("/matches/{match_id}/start", response_model=MatchResponse)
async def start_match(
    match_id: str,
    db: AsyncSession = Depends(get_db),
    _admin=Depends(get_current_admin),
):
    result = await db.execute(
        select(Match).options(selectinload(Match.rounds)).where(Match.id == match_id)
    )
    match = result.scalar_one_or_none()
    if not match:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Match no encontrado"
        )
    if match.status == "active":
        return MatchResponse.model_validate(match)
    if match.status == "finished":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Match ya finalizado"
        )
    if await _any_active_match(db, exclude_id=match_id):
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Ya hay otro match activo",
        )
    if await _any_open_mvp(db):
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Hay una votación MVP abierta",
        )
    match.status = "active"
    await db.flush()
    return MatchResponse.model_validate(match)


@router.post(
    "/matches/{match_id}/rounds",
    response_model=RoundResponse,
    status_code=status.HTTP_201_CREATED,
)
async def open_round(
    match_id: str,
    db: AsyncSession = Depends(get_db),
    _admin=Depends(get_current_admin),
):
    result = await db.execute(
        select(Match).options(selectinload(Match.rounds)).where(Match.id == match_id)
    )
    match = result.scalar_one_or_none()
    if not match:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Match no encontrado"
        )
    if match.status != "active":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Match no está activo"
        )
    if any(r.status == "open" for r in match.rounds):
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Ya hay una ronda abierta",
        )
    next_number = (max((r.round_number for r in match.rounds), default=0)) + 1
    new_round = Round(
        match_id=match_id,
        round_number=next_number,
        status="open",
        opened_at=datetime.now(UTC),
    )
    db.add(new_round)
    await db.flush()
    await manager.broadcast_match(
        match_id,
        {
            "type": "round_opened",
            "round_id": new_round.id,
            "round_number": new_round.round_number,
        },
    )
    return RoundResponse.model_validate(new_round)


@router.patch("/rounds/{round_id}/close", response_model=RoundResponse)
async def close_round(
    round_id: str,
    db: AsyncSession = Depends(get_db),
    _admin=Depends(get_current_admin),
):
    result = await db.execute(select(Round).where(Round.id == round_id))
    round_obj = result.scalar_one_or_none()
    if not round_obj:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Ronda no encontrada"
        )
    if round_obj.status != "open":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Ronda no está abierta"
        )

    match_result = await db.execute(
        select(Match).options(selectinload(Match.rounds)).where(Match.id == round_obj.match_id)
    )
    match = match_result.scalar_one()

    counts_result = await db.execute(
        select(Vote.team_voted_id, func.count(Vote.id))
        .where(Vote.round_id == round_id)
        .group_by(Vote.team_voted_id)
    )
    counts = {row[0]: row[1] for row in counts_result.all()}
    votes_a = counts.get(match.team_a_id, 0)
    votes_b = counts.get(match.team_b_id, 0)

    if votes_a > votes_b:
        winner = match.team_a_id
        is_tie = False
    elif votes_b > votes_a:
        winner = match.team_b_id
        is_tie = False
    else:
        winner = None
        is_tie = True

    round_obj.status = "closed"
    round_obj.winner_team_id = winner
    round_obj.is_tie = is_tie
    round_obj.closed_at = datetime.now(UTC)
    await db.flush()

    closed_rounds = [r for r in match.rounds if r.status == "closed" or r.id == round_obj.id]
    score_a, score_b = compute_scores(match, closed_rounds)

    await manager.broadcast_match(
        match.id,
        {
            "type": "round_closed",
            "round_id": round_obj.id,
            "winner_team_id": winner,
            "is_tie": is_tie,
            "rounds_won": {"team_a": score_a, "team_b": score_b},
        },
    )
    return RoundResponse.model_validate(round_obj)


@router.patch("/matches/{match_id}/finish", response_model=MatchResponse)
async def finish_match(
    match_id: str,
    db: AsyncSession = Depends(get_db),
    _admin=Depends(get_current_admin),
):
    result = await db.execute(
        select(Match).options(selectinload(Match.rounds)).where(Match.id == match_id)
    )
    match = result.scalar_one_or_none()
    if not match:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Match no encontrado"
        )
    if match.status == "finished":
        return MatchResponse.model_validate(match)
    if any(r.status == "open" for r in match.rounds):
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Cierra la ronda abierta antes de finalizar",
        )
    winner = _calc_match_winner(match, match.rounds)
    match.status = "finished"
    match.winner_team_id = winner
    await db.flush()
    await manager.broadcast_match(
        match.id, {"type": "match_finished", "winner_team_id": winner}
    )
    return MatchResponse.model_validate(match)


@router.post("/matches/{match_id}/penalty", response_model=MatchResponse)
async def apply_penalty(
    match_id: str,
    payload: PenaltyRequest,
    db: AsyncSession = Depends(get_db),
    _admin=Depends(get_current_admin),
):
    if payload.team not in ("a", "b"):
        raise HTTPException(status_code=400, detail="team debe ser 'a' o 'b'")
    result = await db.execute(
        select(Match).options(selectinload(Match.rounds)).where(Match.id == match_id)
    )
    match = result.scalar_one_or_none()
    if not match:
        raise HTTPException(status_code=404, detail="Match no encontrado")
    if match.status == "finished":
        raise HTTPException(status_code=409, detail="Match ya finalizado")

    if payload.team == "a":
        match.penalty_a = (match.penalty_a or 0) + 1
    else:
        match.penalty_b = (match.penalty_b or 0) + 1
    await db.flush()

    score_a, score_b = compute_scores(match, match.rounds)
    await manager.broadcast_match(
        match.id,
        {
            "type": "penalty",
            "team": payload.team,
            "penalty_a": match.penalty_a,
            "penalty_b": match.penalty_b,
            "rounds_won": {"team_a": score_a, "team_b": score_b},
        },
    )
    return MatchResponse.model_validate(match)


@router.get("/matches/{match_id}/rounds-votes")
async def match_rounds_votes(
    match_id: str,
    db: AsyncSession = Depends(get_db),
    _admin=Depends(get_current_admin),
):
    result = await db.execute(
        select(Match).options(selectinload(Match.rounds)).where(Match.id == match_id)
    )
    match = result.scalar_one_or_none()
    if not match:
        raise HTTPException(status_code=404, detail="Match no encontrado")
    rounds_sorted = sorted(match.rounds, key=lambda r: r.round_number)
    rids = [r.id for r in rounds_sorted]
    counts: dict[str, dict[str, int]] = {}
    if rids:
        rows = await db.execute(
            select(Vote.round_id, Vote.team_voted_id, func.count(Vote.id))
            .where(Vote.round_id.in_(rids))
            .group_by(Vote.round_id, Vote.team_voted_id)
        )
        for rid, team_id, c in rows.all():
            counts.setdefault(rid, {})[team_id] = c
    return {
        "match_id": match.id,
        "team_a_id": match.team_a_id,
        "team_b_id": match.team_b_id,
        "rounds": [
            {
                "id": r.id,
                "round_number": r.round_number,
                "status": r.status,
                "votes_a": counts.get(r.id, {}).get(match.team_a_id, 0),
                "votes_b": counts.get(r.id, {}).get(match.team_b_id, 0),
                "winner_team_id": r.winner_team_id,
                "is_tie": bool(r.is_tie),
            }
            for r in rounds_sorted
        ],
    }
