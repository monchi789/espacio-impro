"""add penalty and tie

Revision ID: 002_penalty_tie
Revises: 001_initial
Create Date: 2026-04-28

"""
from alembic import op
import sqlalchemy as sa


revision = "002_penalty_tie"
down_revision = "001_initial"
branch_labels = None
depends_on = None


def upgrade() -> None:
    with op.batch_alter_table("matches") as batch:
        batch.add_column(sa.Column("penalty_a", sa.Integer(), nullable=False, server_default="0"))
        batch.add_column(sa.Column("penalty_b", sa.Integer(), nullable=False, server_default="0"))
    with op.batch_alter_table("rounds") as batch:
        batch.add_column(
            sa.Column("is_tie", sa.Boolean(), nullable=False, server_default=sa.false())
        )


def downgrade() -> None:
    with op.batch_alter_table("rounds") as batch:
        batch.drop_column("is_tie")
    with op.batch_alter_table("matches") as batch:
        batch.drop_column("penalty_b")
        batch.drop_column("penalty_a")
