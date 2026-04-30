import uuid
from datetime import date

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.config import get_settings
from app.models.admin import AdminUser
from app.models.event import EventDate
from app.security import hash_password

settings = get_settings()

EVENT_DATES = [
    {"date_number": 1, "label": "Fecha 1 — 9 de mayo", "event_date": date(2026, 5, 9)},
    {"date_number": 2, "label": "Fecha 2 — 16 de mayo", "event_date": date(2026, 5, 16)},
    {"date_number": 3, "label": "Fecha 3 — 23 de mayo", "event_date": date(2026, 5, 23)},
    {"date_number": 4, "label": "Fecha 4 — 30 de mayo", "event_date": date(2026, 5, 30)},
]


async def run_seed(db: AsyncSession) -> None:
    result = await db.execute(
        select(AdminUser).where(AdminUser.username == settings.admin_username)
    )
    if not result.scalar_one_or_none():
        db.add(
            AdminUser(
                id=str(uuid.uuid4()),
                username=settings.admin_username,
                hashed_password=hash_password(settings.admin_password),
            )
        )

    for entry in EVENT_DATES:
        result = await db.execute(
            select(EventDate).where(EventDate.date_number == entry["date_number"])
        )
        existing = result.scalar_one_or_none()
        if existing:
            existing.label = entry["label"]
            existing.event_date = entry["event_date"]
        else:
            db.add(
                EventDate(
                    id=str(uuid.uuid4()),
                    date_number=entry["date_number"],
                    label=entry["label"],
                    event_date=entry["event_date"],
                    status="upcoming",
                )
            )

    await db.commit()
