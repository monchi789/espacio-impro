"""initial schema

Revision ID: 001_initial
Revises:
Create Date: 2026-01-01 00:00:00.000000

"""
from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op


revision: str = "001_initial"
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "admin_users",
        sa.Column("id", sa.String(), primary_key=True),
        sa.Column("username", sa.String(), nullable=False, unique=True),
        sa.Column("hashed_password", sa.String(), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
    )

    op.create_table(
        "event_dates",
        sa.Column("id", sa.String(), primary_key=True),
        sa.Column("date_number", sa.Integer(), nullable=False, unique=True),
        sa.Column("label", sa.String(), nullable=False),
        sa.Column("event_date", sa.Date(), nullable=False),
        sa.Column("status", sa.String(), nullable=False, server_default="upcoming"),
    )

    op.create_table(
        "matches",
        sa.Column("id", sa.String(), primary_key=True),
        sa.Column(
            "event_date_id",
            sa.String(),
            sa.ForeignKey("event_dates.id", ondelete="CASCADE"),
            nullable=False,
        ),
        sa.Column("team_a_id", sa.String(), nullable=False),
        sa.Column("team_b_id", sa.String(), nullable=False),
        sa.Column("status", sa.String(), nullable=False, server_default="pending"),
        sa.Column("winner_team_id", sa.String(), nullable=True),
        sa.Column("order_in_date", sa.Integer(), nullable=False, server_default="1"),
    )

    op.create_table(
        "rounds",
        sa.Column("id", sa.String(), primary_key=True),
        sa.Column(
            "match_id",
            sa.String(),
            sa.ForeignKey("matches.id", ondelete="CASCADE"),
            nullable=False,
        ),
        sa.Column("round_number", sa.Integer(), nullable=False),
        sa.Column("status", sa.String(), nullable=False, server_default="open"),
        sa.Column("winner_team_id", sa.String(), nullable=True),
        sa.Column("opened_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("closed_at", sa.DateTime(timezone=True), nullable=True),
    )

    op.create_table(
        "votes",
        sa.Column("id", sa.String(), primary_key=True),
        sa.Column(
            "round_id",
            sa.String(),
            sa.ForeignKey("rounds.id", ondelete="CASCADE"),
            nullable=False,
        ),
        sa.Column("team_voted_id", sa.String(), nullable=False),
        sa.Column("session_token", sa.String(), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.UniqueConstraint("round_id", "session_token", name="uq_votes_round_session"),
    )

    op.create_table(
        "mvp_votings",
        sa.Column("id", sa.String(), primary_key=True),
        sa.Column(
            "event_date_id",
            sa.String(),
            sa.ForeignKey("event_dates.id", ondelete="CASCADE"),
            nullable=False,
        ),
        sa.Column("status", sa.String(), nullable=False, server_default="pending"),
        sa.Column("eligible_member_ids", sa.JSON(), nullable=False),
        sa.Column("winner_member_id", sa.String(), nullable=True),
        sa.Column("opened_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("closed_at", sa.DateTime(timezone=True), nullable=True),
    )

    op.create_table(
        "mvp_votes",
        sa.Column("id", sa.String(), primary_key=True),
        sa.Column(
            "mvp_voting_id",
            sa.String(),
            sa.ForeignKey("mvp_votings.id", ondelete="CASCADE"),
            nullable=False,
        ),
        sa.Column("member_id", sa.String(), nullable=False),
        sa.Column("session_token", sa.String(), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.UniqueConstraint(
            "mvp_voting_id", "session_token", name="uq_mvp_votes_voting_session"
        ),
    )


def downgrade() -> None:
    op.drop_table("mvp_votes")
    op.drop_table("mvp_votings")
    op.drop_table("votes")
    op.drop_table("rounds")
    op.drop_table("matches")
    op.drop_table("event_dates")
    op.drop_table("admin_users")
