"""Load test: simulate N concurrent voters.

Discovers active match (and MVP if open), then fires N concurrent POST votes
with unique session tokens. Reports success/failure counts and latency stats.

Usage:
  python scripts/load_test_vote.py --voters 100 --mode match
  python scripts/load_test_vote.py --voters 100 --mode mvp
  python scripts/load_test_vote.py --voters 100 --mode both
  python scripts/load_test_vote.py --voters 100 --base http://localhost:8000

Run from impronakuy-backend/ with the API already running.
"""
from __future__ import annotations

import argparse
import asyncio
import random
import statistics
import sys
import time
import uuid
from typing import Any

import httpx


async def fetch_active_match(client: httpx.AsyncClient, base: str) -> dict[str, Any] | None:
    r = await client.get(f"{base}/api/active-match")
    if r.status_code != 200:
        return None
    data = r.json()
    if not data:
        return None
    if (data.get("currentRound") or {}).get("status") != "open":
        return None
    return data


async def fetch_active_mvp(client: httpx.AsyncClient, base: str) -> dict[str, Any] | None:
    r = await client.get(f"{base}/api/active-mvp")
    if r.status_code != 200:
        return None
    data = r.json()
    if not data or data.get("status") != "open":
        return None
    return data


async def cast_match_vote(
    client: httpx.AsyncClient,
    base: str,
    round_id: str,
    team_ids: list[str],
    session_token: str,
) -> tuple[bool, float, int]:
    body = {"teamId": random.choice(team_ids), "sessionToken": session_token}
    t0 = time.perf_counter()
    try:
        r = await client.post(f"{base}/api/rounds/{round_id}/vote", json=body)
        dt = time.perf_counter() - t0
        return r.status_code in (200, 201), dt, r.status_code
    except Exception:
        return False, time.perf_counter() - t0, 0


async def cast_mvp_vote(
    client: httpx.AsyncClient,
    base: str,
    mvp_id: str,
    member_ids: list[str],
    session_token: str,
) -> tuple[bool, float, int]:
    body = {"memberId": random.choice(member_ids), "sessionToken": session_token}
    t0 = time.perf_counter()
    try:
        r = await client.post(f"{base}/api/mvp/{mvp_id}/vote", json=body)
        dt = time.perf_counter() - t0
        return r.status_code in (200, 201), dt, r.status_code
    except Exception:
        return False, time.perf_counter() - t0, 0


def report(label: str, results: list[tuple[bool, float, int]], wall: float) -> None:
    n = len(results)
    ok = sum(1 for r in results if r[0])
    fail = n - ok
    lat_ms = sorted(r[1] * 1000 for r in results)
    status_dist: dict[int, int] = {}
    for _, _, code in results:
        status_dist[code] = status_dist.get(code, 0) + 1

    def pct(p: float) -> float:
        if not lat_ms:
            return 0.0
        idx = min(len(lat_ms) - 1, int(round((p / 100) * (len(lat_ms) - 1))))
        return lat_ms[idx]

    print(f"\n=== {label} ===")
    print(f"Voters:        {n}")
    print(f"Success:       {ok}")
    print(f"Failures:      {fail}")
    print(f"Wall time:     {wall*1000:.0f} ms")
    print(f"Throughput:    {n/wall:.1f} req/s")
    if lat_ms:
        print(f"Latency (ms):  min={lat_ms[0]:.1f}  p50={pct(50):.1f}  "
              f"p95={pct(95):.1f}  p99={pct(99):.1f}  max={lat_ms[-1]:.1f}  "
              f"mean={statistics.mean(lat_ms):.1f}")
    print(f"Status codes:  {status_dist}")


async def run_match(client: httpx.AsyncClient, base: str, voters: int) -> None:
    match = await fetch_active_match(client, base)
    if not match:
        print("[match] no active match with open round — skip", file=sys.stderr)
        return
    round_id = match["currentRound"]["id"]
    team_ids = [match["teamA"]["id"], match["teamB"]["id"]]
    print(f"[match] round={round_id} teams={team_ids} voters={voters}")

    sessions = [str(uuid.uuid4()) for _ in range(voters)]
    t0 = time.perf_counter()
    results = await asyncio.gather(
        *(cast_match_vote(client, base, round_id, team_ids, s) for s in sessions)
    )
    wall = time.perf_counter() - t0
    report("MATCH VOTE LOAD TEST", list(results), wall)


async def run_mvp(client: httpx.AsyncClient, base: str, voters: int) -> None:
    mvp = await fetch_active_mvp(client, base)
    if not mvp:
        print("[mvp] no active open MVP voting — skip", file=sys.stderr)
        return
    mvp_id = mvp["id"]
    member_ids = mvp["eligibleMemberIds"]
    if not member_ids:
        print("[mvp] no eligible members — skip", file=sys.stderr)
        return
    print(f"[mvp] mvp={mvp_id} eligible={len(member_ids)} voters={voters}")

    sessions = [str(uuid.uuid4()) for _ in range(voters)]
    t0 = time.perf_counter()
    results = await asyncio.gather(
        *(cast_mvp_vote(client, base, mvp_id, member_ids, s) for s in sessions)
    )
    wall = time.perf_counter() - t0
    report("MVP VOTE LOAD TEST", list(results), wall)


async def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--base", default="http://localhost:8000")
    ap.add_argument("--voters", type=int, default=100)
    ap.add_argument("--mode", choices=["match", "mvp", "both"], default="match")
    ap.add_argument("--timeout", type=float, default=15.0)
    args = ap.parse_args()

    limits = httpx.Limits(max_connections=args.voters + 10, max_keepalive_connections=args.voters)
    timeout = httpx.Timeout(args.timeout)
    async with httpx.AsyncClient(limits=limits, timeout=timeout) as client:
        if args.mode in ("match", "both"):
            await run_match(client, args.base, args.voters)
        if args.mode in ("mvp", "both"):
            await run_mvp(client, args.base, args.voters)


if __name__ == "__main__":
    asyncio.run(main())
