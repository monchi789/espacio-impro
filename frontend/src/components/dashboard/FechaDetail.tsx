import { useCallback, useEffect, useRef, useState } from 'react'
import { IK_TEAMS } from '../../data/impronakuy-teams'
import {
  authFetch,
  type DashboardDate,
  type Match,
} from '../../lib/dashboard-api'
import MatchControl from './MatchControl'
import MatchCreator from './MatchCreator'
import MvpControl from './MvpControl'
import MvpCreator from './MvpCreator'
import styles from './FechaDetail.module.css'

interface Props {
  fechaNumber: number
}

interface MvpState {
  id: string
  status: 'pending' | 'open' | 'closed'
  event_date_id: string
  eligible_member_ids: string[]
  winner_member_id: string | null
}

const MAX_MATCHES_PER_DATE = 2

export default function FechaDetail({ fechaNumber }: Props) {
  const [date, setDate] = useState<DashboardDate | null>(null)
  const [mvp, setMvp] = useState<MvpState | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showMatchCreator, setShowMatchCreator] = useState(false)
  const [showMvpCreator, setShowMvpCreator] = useState(false)
  const pollRef = useRef<number | null>(null)

  const load = useCallback(async () => {
    try {
      const res = await authFetch('/api/dates')
      if (!res.ok) throw new Error('Error al cargar fechas')
      const data = (await res.json()) as DashboardDate[]
      const found = data.find((d) => d.date_number === fechaNumber) ?? null
      setDate(found)

      if (found) {
        const mvpRes = await authFetch(`/api/dates/${found.id}/mvp`).catch(() => null)
        if (mvpRes && mvpRes.ok) {
          setMvp((await mvpRes.json()) as MvpState)
        } else {
          setMvp(null)
        }
      }
      setError(null)
    } catch (e) {
      setError((e as Error).message)
    } finally {
      setLoading(false)
    }
  }, [fechaNumber])

  useEffect(() => {
    void load()
    pollRef.current = window.setInterval(() => {
      void load()
    }, 3000)
    return () => {
      if (pollRef.current) window.clearInterval(pollRef.current)
    }
  }, [load])

  if (loading) return <p className={styles.loading}>Cargando…</p>
  if (error) return <p className={styles.error}>{error}</p>
  if (!date) return <p className={styles.error}>Fecha no encontrada</p>

  const usedTeamIds = date.matches.flatMap((m) => [m.team_a_id, m.team_b_id])
  const allFinished =
    date.matches.length > 0 && date.matches.every((m) => m.status === 'finished')
  const activeMatch = date.matches.find((m) => m.status === 'active') ?? null
  const canCreateMatch =
    !activeMatch && date.matches.length < MAX_MATCHES_PER_DATE && !mvp

  const matchTeamIds = Array.from(new Set(usedTeamIds))

  const handleReset = async () => {
    if (!date) return
    const ok = window.confirm(
      `¿Borrar todos los matches y la votación MVP de "${date.label}"? Esta acción no se puede deshacer.`,
    )
    if (!ok) return
    const res = await authFetch(`/api/dates/${date.id}/reset`, { method: 'POST' })
    if (!res.ok) {
      window.alert('No se pudo reiniciar la fecha.')
      return
    }
    await load()
  }

  return (
    <div>
      <div className={styles.heading}>
        <h1 className={styles.title}>{date.label}</h1>
        <div className={styles.headingActions}>
          <button
            type="button"
            className={styles.btnDanger}
            onClick={handleReset}
            disabled={date.matches.length === 0 && !mvp}
          >
            Reiniciar fecha
          </button>
          <a className={styles.back} href="/dashboard/fechas">← Todas las fechas</a>
        </div>
      </div>

      <div className={styles.layout}>
        {/* Matches */}
        <section className={styles.column}>
          <h2 className={styles.columnTitle}>Matches</h2>

          {date.matches.length === 0 && !showMatchCreator && (
            <p className={styles.empty}>Aún no hay matches en esta fecha.</p>
          )}

          {date.matches.map((match) =>
            match.status === 'active' ? (
              <MatchControl key={match.id} match={match} onChanged={() => void load()} />
            ) : (
              <MatchSummary key={match.id} match={match} />
            ),
          )}

          {showMatchCreator && canCreateMatch && (
            <MatchCreator
              dateId={date.id}
              usedTeamIds={usedTeamIds}
              onCreated={() => {
                setShowMatchCreator(false)
                void load()
              }}
              onCancel={() => setShowMatchCreator(false)}
            />
          )}

          {!showMatchCreator && canCreateMatch && (
            <button
              className={styles.btnPrimary}
              onClick={() => setShowMatchCreator(true)}
            >
              Crear Match
            </button>
          )}
        </section>

        {/* MVP */}
        <section className={styles.column}>
          <h2 className={styles.columnTitle}>MVP</h2>

          {!mvp && !allFinished && (
            <p className={styles.note}>
              Termina todos los matches de la fecha para habilitar la votación MVP.
            </p>
          )}

          {!mvp && allFinished && !showMvpCreator && (
            <button
              className={styles.btnPrimary}
              onClick={() => setShowMvpCreator(true)}
            >
              Crear Votación MVP
            </button>
          )}

          {!mvp && allFinished && showMvpCreator && (
            <MvpCreator
              dateId={date.id}
              matchTeamIds={matchTeamIds}
              onCreated={() => {
                setShowMvpCreator(false)
                void load()
              }}
              onCancel={() => setShowMvpCreator(false)}
            />
          )}

          {mvp && (
            <MvpControl
              mvpId={mvp.id}
              status={mvp.status}
              eligibleMemberIds={mvp.eligible_member_ids}
              winnerMemberId={mvp.winner_member_id}
              onChanged={() => void load()}
            />
          )}
        </section>
      </div>
    </div>
  )
}

function MatchSummary({ match }: { match: Match }) {
  const teamA = IK_TEAMS.find((t) => t.id === match.team_a_id)
  const teamB = IK_TEAMS.find((t) => t.id === match.team_b_id)
  const winner = IK_TEAMS.find((t) => t.id === match.winner_team_id)

  const closed = match.rounds.filter((r) => r.status === 'closed')
  const winsA = closed.filter(
    (r) => r.winner_team_id === match.team_a_id || r.is_tie,
  ).length
  const winsB = closed.filter(
    (r) => r.winner_team_id === match.team_b_id || r.is_tie,
  ).length
  const penA = match.penalty_a ?? 0
  const penB = match.penalty_b ?? 0
  const scoreA = winsA - penA + penB
  const scoreB = winsB - penB + penA

  const statusLabel: Record<Match['status'], string> = {
    pending: 'Pendiente',
    active: 'Activo',
    finished: 'Finalizado',
  }
  const statusClass: Record<Match['status'], string> = {
    pending: styles.statusPending,
    active: styles.statusActive,
    finished: styles.statusFinished,
  }

  return (
    <div
      className={`${styles.matchCard} ${
        match.status === 'finished' ? styles.matchCardFinished : ''
      }`}
    >
      <div className={styles.matchHeader}>
        <span className={styles.matchTeams}>
          {teamA?.name ?? match.team_a_id} vs {teamB?.name ?? match.team_b_id}
        </span>
        <span className={`${styles.matchStatus} ${statusClass[match.status]}`}>
          {statusLabel[match.status]}
        </span>
      </div>
      {(match.status === 'finished' || closed.length > 0) && (
        <div className={styles.matchWinner}>
          Puntos: <strong>{scoreA}</strong> — <strong>{scoreB}</strong>
          {(penA > 0 || penB > 0) && (
            <> · Penal.: {penA}/{penB}</>
          )}
          {match.status === 'finished' && (
            <> · Ganador: <strong>{winner ? winner.name : 'Empate'}</strong></>
          )}
        </div>
      )}
    </div>
  )
}
