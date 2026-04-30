import uuid
from datetime import UTC, datetime
from typing import Optional

from sqlalchemy import JSON, DateTime, ForeignKey, String, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class Vote(Base):
    __tablename__ = "votes"
    __table_args__ = (
        UniqueConstraint("round_id", "session_token", name="uq_votes_round_session"),
    )

    id: Mapped[str] = mapped_column(
        String, primary_key=True, default=lambda: str(uuid.uuid4())
    )
    round_id: Mapped[str] = mapped_column(
        String, ForeignKey("rounds.id", ondelete="CASCADE"), nullable=False
    )
    team_voted_id: Mapped[str] = mapped_column(String, nullable=False)
    session_token: Mapped[str] = mapped_column(String, nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(UTC), nullable=False
    )

    round: Mapped["Round"] = relationship("Round", back_populates="votes")  # noqa: F821


class MvpVoting(Base):
    __tablename__ = "mvp_votings"

    id: Mapped[str] = mapped_column(
        String, primary_key=True, default=lambda: str(uuid.uuid4())
    )
    event_date_id: Mapped[str] = mapped_column(
        String, ForeignKey("event_dates.id", ondelete="CASCADE"), nullable=False
    )
    status: Mapped[str] = mapped_column(String, nullable=False, default="pending")
    eligible_member_ids: Mapped[list[str]] = mapped_column(JSON, nullable=False)
    winner_member_id: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    opened_at: Mapped[Optional[datetime]] = mapped_column(
        DateTime(timezone=True), nullable=True
    )
    closed_at: Mapped[Optional[datetime]] = mapped_column(
        DateTime(timezone=True), nullable=True
    )

    votes: Mapped[list["MvpVote"]] = relationship(
        "MvpVote", back_populates="mvp_voting", cascade="all, delete-orphan"
    )


class MvpVote(Base):
    __tablename__ = "mvp_votes"
    __table_args__ = (
        UniqueConstraint(
            "mvp_voting_id", "session_token", name="uq_mvp_votes_voting_session"
        ),
    )

    id: Mapped[str] = mapped_column(
        String, primary_key=True, default=lambda: str(uuid.uuid4())
    )
    mvp_voting_id: Mapped[str] = mapped_column(
        String, ForeignKey("mvp_votings.id", ondelete="CASCADE"), nullable=False
    )
    member_id: Mapped[str] = mapped_column(String, nullable=False)
    session_token: Mapped[str] = mapped_column(String, nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(UTC), nullable=False
    )

    mvp_voting: Mapped["MvpVoting"] = relationship("MvpVoting", back_populates="votes")
