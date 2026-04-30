from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.deps import get_current_admin
from app.models.settings import SETTING_VOTING_ENABLED, Setting

router = APIRouter()


class SettingsResponse(BaseModel):
    voting_enabled: bool


class SetVotingEnabledRequest(BaseModel):
    enabled: bool


async def _get_voting_enabled(db: AsyncSession) -> bool:
    result = await db.execute(
        select(Setting).where(Setting.key == SETTING_VOTING_ENABLED)
    )
    row = result.scalar_one_or_none()
    if not row:
        return True
    return row.value.lower() == "true"


@router.get("/api/settings", response_model=SettingsResponse)
async def get_settings(db: AsyncSession = Depends(get_db)):
    return SettingsResponse(voting_enabled=await _get_voting_enabled(db))


@router.post("/api/admin/settings/voting", response_model=SettingsResponse)
async def set_voting_enabled(
    payload: SetVotingEnabledRequest,
    db: AsyncSession = Depends(get_db),
    _admin=Depends(get_current_admin),
):
    result = await db.execute(
        select(Setting).where(Setting.key == SETTING_VOTING_ENABLED)
    )
    row = result.scalar_one_or_none()
    new_value = "true" if payload.enabled else "false"
    if row:
        row.value = new_value
    else:
        db.add(Setting(key=SETTING_VOTING_ENABLED, value=new_value))
    await db.flush()
    return SettingsResponse(voting_enabled=payload.enabled)


async def ensure_voting_enabled(db: AsyncSession) -> None:
    if not await _get_voting_enabled(db):
        raise HTTPException(
            status_code=status.HTTP_423_LOCKED,
            detail="La votación está pausada por el administrador.",
        )
