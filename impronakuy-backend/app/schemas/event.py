from datetime import date, datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict


class RoundResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    match_id: str
    round_number: int
    status: str
    winner_team_id: Optional[str] = None
    is_tie: bool = False
    opened_at: Optional[datetime] = None
    closed_at: Optional[datetime] = None


class MatchResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    event_date_id: str
    team_a_id: str
    team_b_id: str
    status: str
    winner_team_id: Optional[str] = None
    order_in_date: int
    penalty_a: int = 0
    penalty_b: int = 0
    rounds: list[RoundResponse] = []


class DateResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    date_number: int
    label: str
    event_date: date
    status: str
    matches: list[MatchResponse] = []


class CreateMatchRequest(BaseModel):
    date_id: str
    team_a_id: str
    team_b_id: str


class UpdateDateStatusRequest(BaseModel):
    status: str


class PenaltyRequest(BaseModel):
    team: str  # "a" or "b"


class VoteCount(BaseModel):
    votes_a: int
    votes_b: int
