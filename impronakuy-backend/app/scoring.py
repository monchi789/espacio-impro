"""Scoring helpers — handles ties and admin penalties."""
from app.models.event import Match


def compute_scores(match: Match, rounds_iter=None) -> tuple[int, int]:
    """Return (score_a, score_b) for a match.

    - Closed round won by a team → +1 for that team
    - Closed round flagged as tie → +1 for BOTH teams
    - Penalty against team A → -1 from A, +1 to B (and vice versa)
    """
    rounds = rounds_iter if rounds_iter is not None else match.rounds
    closed = [r for r in rounds if r.status == "closed"]
    wins_a = sum(
        1 for r in closed if r.winner_team_id == match.team_a_id or r.is_tie
    )
    wins_b = sum(
        1 for r in closed if r.winner_team_id == match.team_b_id or r.is_tie
    )
    pen_a = match.penalty_a or 0
    pen_b = match.penalty_b or 0
    score_a = wins_a - pen_a + pen_b
    score_b = wins_b - pen_b + pen_a
    return score_a, score_b


def compute_match_winner(match: Match, rounds_iter=None) -> str | None:
    score_a, score_b = compute_scores(match, rounds_iter)
    if score_a > score_b:
        return match.team_a_id
    if score_b > score_a:
        return match.team_b_id
    return None
