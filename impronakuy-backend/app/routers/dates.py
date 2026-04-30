from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import delete, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.database import get_db
from app.deps import get_current_admin
from app.models.event import EventDate, Match
from app.models.voting import MvpVoting
from app.schemas.event import DateResponse, UpdateDateStatusRequest

router = APIRouter()

VALID_DATE_STATUSES = {"upcoming", "active", "done"}


@router.get("/dates", response_model=list[DateResponse])
async def list_dates(
    db: AsyncSession = Depends(get_db),
    _admin=Depends(get_current_admin),
):
    result = await db.execute(
        select(EventDate)
        .options(selectinload(EventDate.matches).selectinload(Match.rounds))
        .order_by(EventDate.date_number)
    )
    dates = result.scalars().all()
    return [DateResponse.model_validate(d) for d in dates]


@router.patch("/dates/{date_id}/status", response_model=DateResponse)
async def update_date_status(
    date_id: str,
    payload: UpdateDateStatusRequest,
    db: AsyncSession = Depends(get_db),
    _admin=Depends(get_current_admin),
):
    if payload.status not in VALID_DATE_STATUSES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Estado inválido"
        )
    result = await db.execute(
        select(EventDate)
        .options(selectinload(EventDate.matches).selectinload(Match.rounds))
        .where(EventDate.id == date_id)
    )
    event_date = result.scalar_one_or_none()
    if not event_date:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Fecha no encontrada"
        )
    event_date.status = payload.status
    await db.flush()
    return DateResponse.model_validate(event_date)


@router.get("/dates/{date_id}/mvp")
async def get_date_mvp(
    date_id: str,
    db: AsyncSession = Depends(get_db),
    _admin=Depends(get_current_admin),
):
    result = await db.execute(
        select(MvpVoting)
        .where(MvpVoting.event_date_id == date_id)
        .order_by(MvpVoting.id.desc())
        .limit(1)
    )
    mvp = result.scalar_one_or_none()
    if not mvp:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="No hay votación MVP"
        )
    return {
        "id": mvp.id,
        "event_date_id": mvp.event_date_id,
        "status": mvp.status,
        "eligible_member_ids": mvp.eligible_member_ids,
        "winner_member_id": mvp.winner_member_id,
    }


@router.post("/dates/{date_id}/reset", status_code=status.HTTP_200_OK)
async def reset_date(
    date_id: str,
    db: AsyncSession = Depends(get_db),
    _admin=Depends(get_current_admin),
):
    result = await db.execute(select(EventDate).where(EventDate.id == date_id))
    event_date = result.scalar_one_or_none()
    if not event_date:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Fecha no encontrada"
        )
    # Cascada borra rounds+votes+mvp_votes via FK ondelete=CASCADE
    await db.execute(delete(Match).where(Match.event_date_id == date_id))
    await db.execute(delete(MvpVoting).where(MvpVoting.event_date_id == date_id))
    event_date.status = "upcoming"
    await db.flush()
    return {"ok": True, "date_id": date_id}
