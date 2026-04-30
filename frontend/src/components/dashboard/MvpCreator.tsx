import { useMemo, useState } from 'react'
import { IK_TEAMS, type IKMember } from '../../data/impronakuy-teams'
import { authFetch } from '../../lib/dashboard-api'
import styles from './MvpCreator.module.css'

interface Props {
  dateId: string
  matchTeamIds: string[]
  onCreated: () => void
  onCancel?: () => void
}

export default function MvpCreator({ dateId, matchTeamIds, onCreated, onCancel }: Props) {
  const candidates = useMemo<IKMember[]>(() => {
    const teams = IK_TEAMS.filter((t) => matchTeamIds.includes(t.id))
    return teams.flatMap((t) => t.members)
  }, [matchTeamIds])

  const [selected, setSelected] = useState<Set<string>>(
    () => new Set(candidates.map((m) => m.id)),
  )
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function toggle(id: string) {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  async function handleCreate() {
    if (selected.size === 0) {
      setError('Selecciona al menos un integrante')
      return
    }
    setError(null)
    setSubmitting(true)
    try {
      const res = await authFetch('/api/mvp', {
        method: 'POST',
        body: JSON.stringify({ date_id: dateId, member_ids: Array.from(selected) }),
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.detail || 'Error al crear MVP')
      }
      const mvp = (await res.json()) as { id: string }
      const openRes = await authFetch(`/api/mvp/${mvp.id}/open`, { method: 'PATCH' })
      if (!openRes.ok) {
        const err = await openRes.json().catch(() => ({}))
        throw new Error(err.detail || 'Error al abrir MVP')
      }
      onCreated()
    } catch (e) {
      setError((e as Error).message)
    } finally {
      setSubmitting(false)
    }
  }

  if (candidates.length === 0) {
    return (
      <div className={styles.section}>
        <h3 className={styles.title}>Crear votación MVP</h3>
        <p className={styles.empty}>
          No hay matches finalizados todavía — no se pueden seleccionar integrantes.
        </p>
        {onCancel && (
          <div className={styles.actions}>
            <button className={styles.btnGhost} onClick={onCancel}>Cerrar</button>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className={styles.section}>
      <h3 className={styles.title}>Crear votación MVP</h3>
      <div className={styles.grid}>
        {candidates.map((m) => {
          const isSelected = selected.has(m.id)
          return (
            <div
              key={m.id}
              className={`${styles.member} ${isSelected ? styles.memberSelected : ''}`}
              onClick={() => toggle(m.id)}
            >
              <img className={styles.photo} src={m.photo1} alt={m.artisticName} loading="lazy" />
              <div className={styles.name}>{m.artisticName}</div>
              <label className={styles.checkbox}>
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => toggle(m.id)}
                  onClick={(e) => e.stopPropagation()}
                />
                {isSelected ? 'Incluido' : 'Excluido'}
              </label>
            </div>
          )
        })}
      </div>
      {error && <p className={styles.error}>{error}</p>}
      <div className={styles.actions}>
        {onCancel && (
          <button className={styles.btnGhost} onClick={onCancel} disabled={submitting}>
            Cancelar
          </button>
        )}
        <button className={styles.btn} onClick={handleCreate} disabled={submitting}>
          {submitting ? 'Creando…' : `Crear y abrir (${selected.size})`}
        </button>
      </div>
    </div>
  )
}
