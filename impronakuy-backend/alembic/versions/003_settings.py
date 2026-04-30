"""add settings table

Revision ID: 003_settings
Revises: 002_penalty_tie
Create Date: 2026-04-28
"""
from alembic import op
import sqlalchemy as sa


revision = "003_settings"
down_revision = "002_penalty_tie"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "settings",
        sa.Column("key", sa.String(), primary_key=True),
        sa.Column("value", sa.String(), nullable=False),
    )
    op.bulk_insert(
        sa.table(
            "settings",
            sa.column("key", sa.String()),
            sa.column("value", sa.String()),
        ),
        [{"key": "voting_enabled", "value": "true"}],
    )


def downgrade() -> None:
    op.drop_table("settings")
