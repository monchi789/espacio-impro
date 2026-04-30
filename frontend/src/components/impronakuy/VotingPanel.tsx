import { useEffect, useRef, useState } from 'react'
import {
  IKActiveMatchSchema,
  type IKActiveMatch,
} from '../../data/impronakuy-schemas'
import { IK_TEAMS } from '../../data/impronakuy-teams'
import styles from './VotingPanel.module.css'

const SESSION_KEY = 'impronakuy_session'
const VOTED_KEY_PREFIX = 'impronakuy_voted_round_'

const getSessionToken = (): string => {
  if (typeof window === 'undefined') return ''
  const existing = localStorage.getItem(SESSION_KEY)
  if (existing) return existing
  const token =
    typeof crypto !== 'undefined' && 'randomUUID' in crypto
      ? crypto.randomUUID()
      : `s-${Date.now()}-${Math.random().toString(36).slice(2)}`
  localStorage.setItem(SESSION_KEY, token)
  return token
}

const getVotedTeamForRound = (roundId: string): string | null => {
  if (typeof window === 'undefined') return null
  return localStorage.getItem(VOTED_KEY_PREFIX + roundId)
}

const setVotedTeamForRound = (roundId: string, teamId: string) => {
  if (typeof window === 'undefined') return
  localStorage.setItem(VOTED_KEY_PREFIX + roundId, teamId)
}

export default function VotingPanel() {
  const [match, setMatch] = useState<IKActiveMatch | null>(null)
  const [votedTeamId, setVotedTeamId] = useState<string | null>(null)
  const [isVoting, setIsVoting] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const wsRef = useRef<WebSocket | null>(null)

  const apiUrl = (import.meta.env.PUBLIC_API_URL as string | undefined) ?? ''
  const wsUrl = (import.meta.env.PUBLIC_WS_URL as string | undefined) ?? ''
  const pollInterval = Number(import.meta.env.PUBLIC_POLLING_INTERVAL ?? 5000)

  useEffect(() => {
    if (!apiUrl) return
    let cancelled = false

    const fetchMatch = async () => {
      try {
        const res = await fetch(`${apiUrl}/api/active-match`)
        if (!res.ok) {
          if (!cancelled) setMatch(null)
          return
        }
        const json = await res.json()
        const parsed = IKActiveMatchSchema.safeParse(json)
        if (!parsed.success) {
          if (!cancelled) setMatch(null)
          return
        }
        if (!cancelled) setMatch(parsed.data)
      } catch {
        if (!cancelled) setMatch(null)
      }
    }

    fetchMatch()
    const id = setInterval(fetchMatch, pollInterval)
    return () => {
      cancelled = true
      clearInterval(id)
    }
  }, [apiUrl, pollInterval])

  useEffect(() => {
    if (!wsUrl || !match?.id) return
    let ws: WebSocket | null = null
    try {
      ws = new WebSocket(`${wsUrl}/ws/match/${match.id}`)
      wsRef.current = ws
      ws.onmessage = (e) => {
        try {
          const data = JSON.parse(e.data)
          const parsed = IKActiveMatchSchema.safeParse(data)
          if (parsed.success) setMatch(parsed.data)
        } catch {
          /* ignore malformed messages */
        }
      }
      ws.onerror = () => {
        /* fall back to polling */
      }
    } catch {
      /* swallow */
    }
    return () => {
      try {
        ws?.close()
      } catch {
        /* noop */
      }
      wsRef.current = null
    }
  }, [wsUrl, match?.id])

  const round = match?.currentRound ?? null

  useEffect(() => {
    if (!round) {
      setVotedTeamId(null)
      return
    }
    setVotedTeamId(getVotedTeamForRound(round.id))
  }, [round?.id])

  if (!match) return null
  if (match.status !== 'active' || round?.status !== 'open') return null

  const teamA = match.teamA
  const teamB = match.teamB
  const totalVotes = (round?.votesA ?? 0) + (round?.votesB ?? 0)
  const pctA = totalVotes ? Math.round(((round?.votesA ?? 0) / totalVotes) * 100) : 0
  const pctB = totalVotes ? 100 - pctA : 0

  const handleVote = async (teamId: string) => {
    if (!apiUrl || !round || round.status !== 'open' || isVoting) return
    if (votedTeamId === teamId) return
    setIsVoting(true)
    setErrorMsg(null)
    try {
      const res = await fetch(`${apiUrl}/api/rounds/${round.id}/vote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          teamId,
          sessionToken: getSessionToken(),
        }),
      })
      if (!res.ok) {
        setErrorMsg('No se pudo registrar el voto. Intenta de nuevo.')
        return
      }
      setVotedTeamForRound(round.id, teamId)
      setVotedTeamId(teamId)
    } catch {
      setErrorMsg('Sin conexión con el servidor.')
    } finally {
      setIsVoting(false)
    }
  }

  if (match.status === 'finished') {
    const winner =
      match.winnerTeamId === teamA.id
        ? teamA
        : match.winnerTeamId === teamB.id
        ? teamB
        : match.roundsWon.teamA > match.roundsWon.teamB
        ? teamA
        : teamB
    return (
      <section
        className={styles.panel}
        style={{ ['--winner-color' as never]: winner.color } as React.CSSProperties}
      >
        <div className={styles.header}>
          <span className={styles.statusText}>Match finalizado</span>
        </div>
        <div className={styles.score}>
          <div
            className={styles.scoreNumber}
            style={{ color: teamA.color }}
          >
            {match.roundsWon.teamA}
          </div>
          <span className={styles.scoreSep}>—</span>
          <div
            className={styles.scoreNumber}
            style={{ color: teamB.color }}
          >
            {match.roundsWon.teamB}
          </div>
        </div>
        <p className={styles.winnerBanner}>¡{winner.name} GANÓ!</p>
      </section>
    )
  }

  const roundOpen = round?.status === 'open'
  const roundClosed = round?.status === 'closed'

  return (
    <section className={styles.panel}>
      <div className={styles.header}>
        {round && (
          <h2 className={styles.roundLabel}>
            RONDA {round.roundNumber}
          </h2>
        )}
        <span className={styles.statusText}>
          {roundOpen
            ? 'Votación abierta'
            : roundClosed
            ? 'Ronda cerrada'
            : 'Esperando ronda'}
        </span>
      </div>

      <div className={styles.score}>
        <div className={styles.scoreNumber} style={{ color: teamA.color }}>
          {match.roundsWon.teamA}
        </div>
        <span className={styles.scoreSep}>—</span>
        <div className={styles.scoreNumber} style={{ color: teamB.color }}>
          {match.roundsWon.teamB}
        </div>
      </div>

      {round && (
        <>
          <div className={styles.voteRow}>
            {[teamA, teamB].map((team) => {
              const teamData = IK_TEAMS.find((t) => t.id === team.id)
              const isVoted = votedTeamId === team.id
              return (
                <button
                  key={team.id}
                  type="button"
                  className={`${styles.teamCard} ${isVoted ? styles.voted : ''}`}
                  style={{ ['--btn-color' as never]: team.color } as React.CSSProperties}
                  disabled={!roundOpen || isVoting || isVoted}
                  onClick={() => handleVote(team.id)}
                >
                  <div className={styles.teamPhotoWrap}>
                    {teamData?.teamPhoto && (
                      <img
                        className={styles.teamPhoto}
                        src={teamData.teamPhoto}
                        alt={team.name}
                        loading="lazy"
                      />
                    )}
                    <div className={styles.teamPhotoOverlay} />
                  </div>
                  <div className={styles.teamCardBody}>
                    <h3 className={styles.teamName}>{team.name}</h3>
                    <span className={styles.teamCta}>
                      {isVoted ? '✓ Tu voto' : `Votar por ${team.name}`}
                    </span>
                  </div>
                </button>
              )
            })}
          </div>

          <div className={styles.tallyBlock}>
            <div
              className={styles.tallyCell}
              style={{ ['--bar-color' as never]: teamA.color } as React.CSSProperties}
            >
              <span className={styles.tallyVotes}>{round?.votesA ?? 0}</span>
              <span className={styles.tallyLabel}>{teamA.name} · {pctA}%</span>
            </div>
            <div
              className={styles.tallyCell}
              style={{ ['--bar-color' as never]: teamB.color } as React.CSSProperties}
            >
              <span className={styles.tallyVotes}>{round?.votesB ?? 0}</span>
              <span className={styles.tallyLabel}>{teamB.name} · {pctB}%</span>
            </div>
          </div>

          {votedTeamId && (
            <p className={styles.message}>
              ✓ Votaste por{' '}
              {votedTeamId === teamA.id ? teamA.name : teamB.name}
            </p>
          )}
          {roundClosed && round.winnerTeamId && (
            <p className={styles.message}>
              Ganador de la ronda:{' '}
              {round.winnerTeamId === teamA.id ? teamA.name : teamB.name}
            </p>
          )}
          {errorMsg && <p className={styles.message}>{errorMsg}</p>}
          {match.rounds && match.rounds.length > 0 && (
            <div className={styles.roundsHistory}>
              <h4 className={styles.historyTitle}>Rondas</h4>
              <ul className={styles.historyList}>
                {match.rounds.map((r) => {
                  const wonA = r.winnerTeamId === teamA.id
                  const wonB = r.winnerTeamId === teamB.id
                  return (
                    <li key={r.id} className={styles.historyRow}>
                      <span className={styles.historyLabel}>
                        R{r.roundNumber}
                        {r.status === 'open' ? ' · en vivo' : ''}
                      </span>
                      <span
                        className={`${styles.historyVotes} ${wonA ? styles.historyWin : ''}`}
                        style={{ color: teamA.color }}
                      >
                        {r.votesA}
                      </span>
                      <span className={styles.historySep}>—</span>
                      <span
                        className={`${styles.historyVotes} ${wonB ? styles.historyWin : ''}`}
                        style={{ color: teamB.color }}
                      >
                        {r.votesB}
                      </span>
                      <span className={styles.historyResult}>
                        {r.isTie
                          ? 'Empate'
                          : wonA
                            ? teamA.name
                            : wonB
                              ? teamB.name
                              : ''}
                      </span>
                    </li>
                  )
                })}
              </ul>
            </div>
          )}
        </>
      )}
    </section>
  )
}
