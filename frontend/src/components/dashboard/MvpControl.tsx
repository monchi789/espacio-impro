import { useState } from 'react'
import { IK_TEAMS } from '../../data/impronakuy-teams'
import { authFetch } from '../../lib/dashboard-api'
import LiveMvpVotes from './LiveMvpVotes'
import styles from './MvpControl.module.css'

interface Props {
  mvpId: string
  status: 'pending' | 'open' | 'closed'
  eligibleMemberIds: string[]
  winnerMemberId: string | null
  onChanged: () => void
}

function findMemberName(id: string | null): string | null {
  if (!id) return null
  for (const team of IK_TEAMS) {
    for (const m of team.members) if (m.id === id) return m.artisticName
  }
  return id
}

export default function MvpControl({
  mvpId,
  status,
  eligibleMemberIds,
  winnerMemberId,
  onChanged,
}: Props) {
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function closeMvp() {
    if (!window.confirm('¿Cerrar la votación y proclamar al MVP?')) return
    setSubmitting(true)
    setError(null)
    try {
      const res = await authFetch(`/api/mvp/${mvpId}/close`, { method: 'PATCH' })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.detail || 'Error al cerrar MVP')
      }
      onChanged()
    } catch (e) {
      setError((e as Error).message)
    } finally {
      setSubmitting(false)
    }
  }

  if (status === 'closed') {
    const winnerName = findMemberName(winnerMemberId)
    return (
      <div className={styles.box}>
        <div className={styles.header}>
          <h3 className={styles.title}>VOTACIÓN MVP — CERRADA</h3>
        </div>
        <div className={styles.banner}>
          {winnerName ? `MVP: ${winnerName}` : 'Sin ganador (empate o sin votos)'}
        </div>
        <LiveMvpVotes mvpId={mvpId} eligibleMemberIds={eligibleMemberIds} />
      </div>
    )
  }

  return (
    <div className={styles.box}>
      <div className={styles.header}>
        <h3 className={styles.title}>VOTACIÓN MVP</h3>
        <span className={styles.statusBadge}>{status === 'open' ? 'ABIERTA' : 'PENDIENTE'}</span>
      </div>

      {status === 'open' && (
        <LiveMvpVotes mvpId={mvpId} eligibleMemberIds={eligibleMemberIds} />
      )}

      {status === 'open' && (
        <button className={styles.btnDanger} onClick={closeMvp} disabled={submitting}>
          {submitting ? 'Cerrando…' : 'Proclamar MVP'}
        </button>
      )}

      {error && <p className={styles.error}>{error}</p>}
    </div>
  )
}
