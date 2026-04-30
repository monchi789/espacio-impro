import { useState } from 'react'
import { IK_TEAMS } from '../../data/impronakuy-teams'
import { authFetch } from '../../lib/dashboard-api'
import styles from './MatchCreator.module.css'

interface Props {
  dateId: string
  usedTeamIds: string[]
  onCreated: () => void
  onCancel?: () => void
}

export default function MatchCreator({ dateId, usedTeamIds, onCreated, onCancel }: Props) {
  const [teamA, setTeamA] = useState('')
  const [teamB, setTeamB] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const available = IK_TEAMS.filter((t) => !usedTeamIds.includes(t.id))

  async function handleCreate() {
    if (!teamA || !teamB) {
      setError('Selecciona ambos equipos')
      return
    }
    if (teamA === teamB) {
      setError('Los equipos deben ser distintos')
      return
    }
    setError(null)
    setSubmitting(true)
    try {
      const createRes = await authFetch('/api/matches', {
        method: 'POST',
        body: JSON.stringify({ date_id: dateId, team_a_id: teamA, team_b_id: teamB }),
      })
      if (!createRes.ok) {
        const err = await createRes.json().catch(() => ({}))
        throw new Error(err.detail || 'Error al crear el match')
      }
      const match = (await createRes.json()) as { id: string }
      const startRes = await authFetch(`/api/matches/${match.id}/start`, { method: 'PATCH' })
      if (!startRes.ok) {
        const err = await startRes.json().catch(() => ({}))
        throw new Error(err.detail || 'Error al iniciar el match')
      }
      onCreated()
    } catch (e) {
      setError((e as Error).message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className={styles.section}>
      <h3 className={styles.title}>Crear nuevo match</h3>
      <div className={styles.row}>
        <select value={teamA} onChange={(e) => setTeamA(e.target.value)}>
          <option value="">Equipo A…</option>
          {available
            .filter((t) => t.id !== teamB)
            .map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
        </select>
        <span className={styles.vs}>VS</span>
        <select value={teamB} onChange={(e) => setTeamB(e.target.value)}>
          <option value="">Equipo B…</option>
          {available
            .filter((t) => t.id !== teamA)
            .map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
        </select>
      </div>
      {error && <p className={styles.error}>{error}</p>}
      <div className={styles.actions}>
        {onCancel && (
          <button className={styles.btnGhost} onClick={onCancel} disabled={submitting}>
            Cancelar
          </button>
        )}
        <button className={styles.btn} onClick={handleCreate} disabled={submitting}>
          {submitting ? 'Creando…' : 'Crear y empezar'}
        </button>
      </div>
    </div>
  )
}
