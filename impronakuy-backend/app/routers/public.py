from fastapi import APIRouter, Depends
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.database import get_db
from app.models.event import Match, Round
from app.models.voting import MvpVote, MvpVoting, Vote
from app.schemas.voting import (
    ActiveMatchData,
    ActiveMvpData,
    CurrentRoundLite,
    LiveStateResponse,
    MvpMemberResult,
    RoundsWon,
    TeamLite,
)
from app.scoring import compute_scores
from app.teams import team_meta

router = APIRouter()


async def build_active_match_payload(db: AsyncSession, match: Match) -> dict:
    rounds_sorted = sorted(match.rounds, key=lambda r: r.round_number)
    score_a, score_b = compute_scores(match, rounds_sorted)

    rounds_breakdown: list[dict] = []
    counts_by_round: dict[str, dict[str, int]] = {}
    if rounds_sorted:
        rids = [r.id for r in rounds_sorted]
        counts_result = await db.execute(
            select(Vote.round_id, Vote.team_voted_id, func.count(Vote.id))
            .where(Vote.round_id.in_(rids))
            .group_by(Vote.round_id, Vote.team_voted_id)
        )
        for rid, team_id, c in counts_result.all():
            counts_by_round.setdefault(rid, {})[team_id] = c
        for r in rounds_sorted:
            rc = counts_by_round.get(r.id, {})
            rounds_breakdown.append(
                {
                    "id": r.id,
                    "roundNumber": r.round_number,
                    "status": r.status,
                    "votesA": rc.get(match.team_a_id, 0),
                    "votesB": rc.get(match.team_b_id, 0),
                    "winnerTeamId": r.winner_team_id,
                    "isTie": bool(r.is_tie),
                }
            )

    latest = rounds_sorted[-1] if rounds_sorted else None
    current_round = None
    if latest:
        rc = counts_by_round.get(latest.id, {})
        current_round = {
            "id": latest.id,
            "roundNumber": latest.round_number,
            "status": latest.status,
            "votesA": rc.get(match.team_a_id, 0),
            "votesB": rc.get(match.team_b_id, 0),
            "winnerTeamId": latest.winner_team_id,
            "isTie": bool(latest.is_tie),
        }
    return {
        "id": match.id,
        "teamA": team_meta(match.team_a_id),
        "teamB": team_meta(match.team_b_id),
        "currentRound": current_round,
        "rounds": rounds_breakdown,
        "roundsWon": {"teamA": score_a, "teamB": score_b},
        "penalties": {"teamA": match.penalty_a or 0, "teamB": match.penalty_b or 0},
        "status": match.status,
        "winnerTeamId": match.winner_team_id,
    }


@router.get("/api/active-mvp")
async def active_mvp_endpoint(db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(MvpVoting).where(MvpVoting.status == "open").limit(1)
    )
    mvp = result.scalar_one_or_none()
    if not mvp:
        result = await db.execute(
            select(MvpVoting)
            .where(MvpVoting.status == "closed")
            .order_by(MvpVoting.id.desc())
            .limit(1)
        )
        mvp = result.scalar_one_or_none()
    if not mvp:
        return None
    counts_result = await db.execute(
        select(MvpVote.member_id, func.count(MvpVote.id))
        .where(MvpVote.mvp_voting_id == mvp.id)
        .group_by(MvpVote.member_id)
    )
    counts = {row[0]: row[1] for row in counts_result.all()}
    results = [
        {"memberId": mid, "votes": counts.get(mid, 0)}
        for mid in mvp.eligible_member_ids
    ]
    return {
        "id": mvp.id,
        "status": mvp.status,
        "eligibleMemberIds": mvp.eligible_member_ids,
        "winnerMemberId": mvp.winner_member_id,
        "results": results,
        "totalVotes": sum(counts.values()),
    }


@router.get("/health")
async def health():
    return {"status": "ok"}


@router.get("/api/active-match")
async def active_match(db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(Match)
        .options(selectinload(Match.rounds))
        .where(Match.status == "active")
        .limit(1)
    )
    match = result.scalar_one_or_none()
    if not match:
        result = await db.execute(
            select(Match)
            .options(selectinload(Match.rounds))
            .where(Match.status == "finished")
            .order_by(Match.order_in_date.desc())
            .limit(1)
        )
        match = result.scalar_one_or_none()
    if not match:
        return None
    return await build_active_match_payload(db, match)


@router.get("/api/live-state", response_model=LiveStateResponse)
async def live_state(db: AsyncSession = Depends(get_db)):
    match_result = await db.execute(
        select(Match)
        .options(selectinload(Match.rounds))
        .where(Match.status == "active")
        .limit(1)
    )
    match = match_result.scalar_one_or_none()

    active_match: ActiveMatchData | None = None
    if match:
        rounds_sorted = sorted(match.rounds, key=lambda r: r.round_number)
        score_a, score_b = compute_scores(match, rounds_sorted)
        latest = rounds_sorted[-1] if rounds_sorted else None
        current_round = None
        if latest:
            counts_result = await db.execute(
                select(Vote.team_voted_id, func.count(Vote.id))
                .where(Vote.round_id == latest.id)
                .group_by(Vote.team_voted_id)
            )
            counts = {row[0]: row[1] for row in counts_result.all()}
            current_round = CurrentRoundLite(
                id=latest.id,
                round_number=latest.round_number,
                status=latest.status,
                votes_a=counts.get(match.team_a_id, 0),
                votes_b=counts.get(match.team_b_id, 0),
            )
        active_match = ActiveMatchData(
            id=match.id,
            team_a=TeamLite(id=match.team_a_id),
            team_b=TeamLite(id=match.team_b_id),
            current_round=current_round,
            rounds_won=RoundsWon(team_a=score_a, team_b=score_b),
            status=match.status,
        )

    mvp_result = await db.execute(
        select(MvpVoting).where(MvpVoting.status == "open").limit(1)
    )
    mvp = mvp_result.scalar_one_or_none()
    active_mvp: ActiveMvpData | None = None
    if mvp:
        counts_result = await db.execute(
            select(MvpVote.member_id, func.count(MvpVote.id))
            .where(MvpVote.mvp_voting_id == mvp.id)
            .group_by(MvpVote.member_id)
        )
        counts = {row[0]: row[1] for row in counts_result.all()}
        members = [
            MvpMemberResult(member_id=mid, votes=counts.get(mid, 0))
            for mid in mvp.eligible_member_ids
        ]
        active_mvp = ActiveMvpData(
            id=mvp.id,
            eligible_members=members,
            status=mvp.status,
            total_votes=sum(counts.values()),
        )

    return LiveStateResponse(match=active_match, mvp=active_mvp)
