from typing import Optional

from pydantic import BaseModel, ConfigDict, Field


class CatchVoteRequest(BaseModel):
    model_config = ConfigDict(populate_by_name=True)
    team_id: str = Field(alias="teamId")
    session_token: str = Field(alias="sessionToken")


class MvpVoteRequest(BaseModel):
    model_config = ConfigDict(populate_by_name=True)
    member_id: str = Field(alias="memberId")
    session_token: str = Field(alias="sessionToken")


class CreateMvpRequest(BaseModel):
    date_id: str
    member_ids: list[str]


class MvpMemberResult(BaseModel):
    member_id: str
    votes: int


class MvpResults(BaseModel):
    id: str
    status: str
    winner_member_id: Optional[str] = None
    results: list[MvpMemberResult]


class RoundResultsResponse(BaseModel):
    round_id: str
    round_status: str
    votes_a: int
    votes_b: int


class TeamLite(BaseModel):
    id: str


class CurrentRoundLite(BaseModel):
    id: str
    round_number: int
    status: str
    votes_a: int
    votes_b: int


class RoundsWon(BaseModel):
    team_a: int
    team_b: int


class ActiveMatchData(BaseModel):
    id: str
    team_a: TeamLite
    team_b: TeamLite
    current_round: Optional[CurrentRoundLite] = None
    rounds_won: RoundsWon
    status: str


class ActiveMvpData(BaseModel):
    id: str
    eligible_members: list[MvpMemberResult]
    status: str
    total_votes: int


class LiveStateResponse(BaseModel):
    match: Optional[ActiveMatchData] = None
    mvp: Optional[ActiveMvpData] = None
