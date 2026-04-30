import { useEffect, useState } from 'react'
import { IK_TEAMS } from '../../data/impronakuy-teams'
import { authFetch, type Match, type Round } from '../../lib/dashboard-api'
import LiveVotes from './LiveVotes'
import styles from './MatchControl.module.css'

interface Props {
  match: Match
  onChanged: () => void
}

interface RoundVotes {
  id: string
  round_number: number
  status: string
  votes_a: number
  votes_b: number
  winner_team_id: string | null
  is_tie: boolean
}

export default function MatchControl({ match, onChanged }: Props) {
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const teamA = IK_TEAMS.find((t) => t.id === match.team_a_id)
  const teamB = IK_TEAMS.find((t) => t.id === match.team_b_id)

  const closedRounds = match.rounds.filter((r) => r.status === 'closed')
  const winsA = closedRounds.filter(
    (r) => r.winner_team_id === match.team_a_id || r.is_tie,
  ).length
  const winsB = closedRounds.filter(
    (r) => r.winner_team_id === match.team_b_id || r.is_tie,
  ).length
  const penA = match.penalty_a ?? 0
  const penB = match.penalty_b ?? 0
  const scoreA = winsA - penA + penB
  const scoreB = winsB - penB + penA

  const openRound: Round | undefined = match.rounds.find((r) => r.status === 'open')
  const lastClosed = [...closedRounds].sort((a, b) => b.round_number - a.round_number)[0]

  const [roundVotes, setRoundVotes] = useState<RoundVotes[]>([])

  useEffect(() => {
    let cancelled = false
    async function poll() {
      try {
        const res = await authFetch(`/api/matches/${match.id}/rounds-votes`)
        if (!res.ok) return
        const data = (await res.json()) as { rounds: RoundVotes[] }
        if (!cancelled) setRoundVotes(data.rounds)
      } catch {
        // ignore
      }
    }
    void poll()
    const id = window.setInterval(poll, 2500)
    return () => {
      cancelled = true
      window.clearInterval(id)
    }
  }, [match.id, match.rounds.length])

  async function action(label: string, runner: () => Promise<Response>) {
    setSubmitting(true)
    setError(null)
    try {
      const res = await runner()
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.detail || `Error: ${label}`)
      }
      onChanged()
    } catch (e) {
      setError((e as Error).message)
    } finally {
      setSubmitting(false)
    }
  }

  function openNewRound() {
    void action('abrir ronda', () =>
      authFetch(`/api/matches/${match.id}/rounds`, { method: 'POST' }),
    )
  }

  function closeRound() {
    if (!openRound) return
    if (!window.confirm('¿Cerrar la ronda actual?')) return
    void action('cerrar ronda', () =>
      authFetch(`/api/rounds/${openRound.id}/close`, { method: 'PATCH' }),
    )
  }

  function finishMatch() {
    if (!window.confirm('¿Cerrar el enfrentamiento? Esto calculará el ganador.')) return
    void action('finalizar match', () =>
      authFetch(`/api/matches/${match.id}/finish`, { method: 'PATCH' }),
    )
  }

  function penalize(team: 'a' | 'b') {
    const target = team === 'a' ? teamA?.name ?? 'A' : teamB?.name ?? 'B'
    if (!window.confirm(`¿Aplicar penalización a ${target}? -1 punto a ${target}, +1 al rival.`)) return
    void action('penalizar', () =>
      authFetch(`/api/matches/${match.id}/penalty`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ team }),
      }),
    )
  }

  if (match.status === 'finished') {
    const winner = IK_TEAMS.find((t) => t.id === match.winner_team_id)
    return (
      <div className={styles.box}>
        <div className={styles.header}>
          <span className={styles.matchup}>
            {teamA?.name ?? match.team_a_id} vs {teamB?.name ?? match.team_b_id}
          </span>
          <span className={styles.score}>
            <strong>{scoreA}</strong> — <strong>{scoreB}</strong>
          </span>
        </div>
        <div className={styles.roundLabel}>
          Ganador: <strong>{winner ? winner.name : 'Empate'}</strong>
          {(penA > 0 || penB > 0) && (
            <span className={styles.penaltyHint}>
              {' '}· Penalizaciones: {teamA?.name ?? 'A'}={penA}, {teamB?.name ?? 'B'}={penB}
            </span>
          )}
        </div>
      </div>
    )
  }

  const currentRound = openRound ?? lastClosed
  const currentLabel = currentRound
    ? `RONDA ${currentRound.round_number} — ${currentRound.status === 'open' ? 'ABIERTA' : 'CERRADA'}`
    : 'Sin rondas aún'

  return (
    <div className={styles.box}>
      <div className={styles.header}>
        <span className={styles.matchup}>
          {teamA?.name ?? match.team_a_id} vs {teamB?.name ?? match.team_b_id}
        </span>
        <span className={styles.score}>
          Puntos <strong>{scoreA}</strong> — <strong>{scoreB}</strong>
        </span>
      </div>

      {(penA > 0 || penB > 0) && (
        <div className={styles.penaltyHint}>
          Penalizaciones aplicadas — {teamA?.name ?? 'A'}: {penA} · {teamB?.name ?? 'B'}: {penB}
        </div>
      )}

      <div className={styles.roundInfo}>
        <span className={styles.roundLabel}>{currentLabel}</span>
        {currentRound && (
          <span
            className={`${styles.statusBadge} ${
              currentRound.status === 'open' ? styles.statusOpen : styles.statusClosed
            }`}
          >
            {currentRound.status}
          </span>
        )}
      </div>

      {openRound && teamA && teamB && (
        <LiveVotes
          matchId={match.id}
          roundId={openRound.id}
          teamAName={teamA.name}
          teamBName={teamB.name}
          teamAColor={teamA.color}
          teamBColor={teamB.color}
        />
      )}

      {roundVotes.length > 0 && teamA && teamB && (
        <div className={styles.roundsTable}>
          <div className={styles.roundsTableHead}>
            <span>Ronda</span>
            <span style={{ color: teamA.color }}>{teamA.name}</span>
            <span style={{ color: teamB.color }}>{teamB.name}</span>
            <span>Resultado</span>
          </div>
          {roundVotes.map((r) => {
            const wonA = r.winner_team_id === match.team_a_id
            const wonB = r.winner_team_id === match.team_b_id
            return (
              <div key={r.id} className={styles.roundsTableRow}>
                <span>R{r.round_number}{r.status === 'open' ? ' · vivo' : ''}</span>
                <span
                  style={{ color: teamA.color, fontWeight: wonA ? 700 : 500 }}
                >
                  {r.votes_a}
                </span>
                <span
                  style={{ color: teamB.color, fontWeight: wonB ? 700 : 500 }}
                >
                  {r.votes_b}
                </span>
                <span>
                  {r.is_tie
                    ? 'Empate'
                    : wonA
                      ? `→ ${teamA.name}`
                      : wonB
                        ? `→ ${teamB.name}`
                        : '—'}
                </span>
              </div>
            )
          })}
        </div>
      )}

      <div className={styles.actions}>
        {openRound ? (
          <button className={styles.btnWarning} onClick={closeRound} disabled={submitting}>
            Cerrar Ronda
          </button>
        ) : (
          <>
            <button className={styles.btn} onClick={openNewRound} disabled={submitting}>
              Abrir Nueva Ronda
            </button>
            <button className={styles.btnDanger} onClick={finishMatch} disabled={submitting}>
              Cerrar Enfrentamiento
            </button>
          </>
        )}
      </div>

      <div className={styles.actions}>
        <button
          className={styles.btnPenalty}
          onClick={() => penalize('a')}
          disabled={submitting}
          title={`Quita 1 punto a ${teamA?.name ?? 'A'} y se lo da al rival`}
        >
          Penalizar {teamA?.name ?? 'A'}
        </button>
        <button
          className={styles.btnPenalty}
          onClick={() => penalize('b')}
          disabled={submitting}
          title={`Quita 1 punto a ${teamB?.name ?? 'B'} y se lo da al rival`}
        >
          Penalizar {teamB?.name ?? 'B'}
        </button>
      </div>

      {error && <p className={styles.error}>{error}</p>}
    </div>
  )
}
