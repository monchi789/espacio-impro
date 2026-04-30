"""Team metadata mirrored from frontend/src/data/impronakuy-teams.ts."""

TEAMS: dict[str, dict[str, str]] = {
    "culiprincess": {"name": "Las Culiprincess", "color": "#e879f9"},
    "tetris": {"name": "Tetris", "color": "#4ade80"},
    "cercano-oeste": {"name": "Cercano Oeste", "color": "#fb923c"},
    "mal-organizado": {"name": "El Mal Organizado", "color": "#f87171"},
    "fachonistas": {"name": "Los Fachonistas", "color": "#fbbf24"},
}


def team_meta(team_id: str) -> dict[str, str]:
    meta = TEAMS.get(team_id, {})
    return {
        "id": team_id,
        "name": meta.get("name", team_id),
        "color": meta.get("color", "#888888"),
    }
