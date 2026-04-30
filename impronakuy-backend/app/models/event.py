import uuid
from datetime import date, datetime
from typing import Optional

from sqlalchemy import Boolean, Date, DateTime, ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class EventDate(Base):
    __tablename__ = "event_dates"

    id: Mapped[str] = mapped_column(
        String, primary_key=True, default=lambda: str(uuid.uuid4())
    )
    date_number: Mapped[int] = mapped_column(Integer, unique=True, nullable=False)
    label: Mapped[str] = mapped_column(String, nullable=False)
    event_date: Mapped[date] = mapped_column(Date, nullable=False)
    status: Mapped[str] = mapped_column(String, nullable=False, default="upcoming")

    matches: Mapped[list["Match"]] = relationship(
        "Match", back_populates="event_date", cascade="all, delete-orphan"
    )


class Match(Base):
    __tablename__ = "matches"

    id: Mapped[str] = mapped_column(
        String, primary_key=True, default=lambda: str(uuid.uuid4())
    )
    event_date_id: Mapped[str] = mapped_column(
        String, ForeignKey("event_dates.id", ondelete="CASCADE"), nullable=False
    )
    team_a_id: Mapped[str] = mapped_column(String, nullable=False)
    team_b_id: Mapped[str] = mapped_column(String, nullable=False)
    status: Mapped[str] = mapped_column(String, nullable=False, default="pending")
    winner_team_id: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    order_in_date: Mapped[int] = mapped_column(Integer, nullable=False, default=1)
    penalty_a: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    penalty_b: Mapped[int] = mapped_column(Integer, nullable=False, default=0)

    event_date: Mapped["EventDate"] = relationship("EventDate", back_populates="matches")
    rounds: Mapped[list["Round"]] = relationship(
        "Round", back_populates="match", cascade="all, delete-orphan"
    )


class Round(Base):
    __tablename__ = "rounds"

    id: Mapped[str] = mapped_column(
        String, primary_key=True, default=lambda: str(uuid.uuid4())
    )
    match_id: Mapped[str] = mapped_column(
        String, ForeignKey("matches.id", ondelete="CASCADE"), nullable=False
    )
    round_number: Mapped[int] = mapped_column(Integer, nullable=False)
    status: Mapped[str] = mapped_column(String, nullable=False, default="open")
    winner_team_id: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    is_tie: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)
    opened_at: Mapped[Optional[datetime]] = mapped_column(
        DateTime(timezone=True), nullable=True
    )
    closed_at: Mapped[Optional[datetime]] = mapped_column(
        DateTime(timezone=True), nullable=True
    )

    match: Mapped["Match"] = relationship("Match", back_populates="rounds")
    votes: Mapped[list["Vote"]] = relationship(
        "Vote", back_populates="round", cascade="all, delete-orphan"
    )
