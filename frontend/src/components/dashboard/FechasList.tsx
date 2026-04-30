import { useEffect, useState } from 'react'
import { authFetch, type DashboardDate } from '../../lib/dashboard-api'
import styles from './FechasList.module.css'

const STATUS_LABELS: Record<DashboardDate['status'], string> = {
  upcoming: 'Próxima',
  active: 'Activa',
  done: 'Terminada',
}

const STATUS_CLASS: Record<DashboardDate['status'], string> = {
  upcoming: styles.badgeUpcoming,
  active: styles.badgeActive,
  done: styles.badgeDone,
}

export default function FechasList() {
  const [dates, setDates] = useState<DashboardDate[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    authFetch('/api/dates')
      .then(async (res) => {
        if (!res.ok) throw new Error('Error al cargar fechas')
        return res.json() as Promise<DashboardDate[]>
      })
      .then((data) => setDates(data))
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <p className={styles.loading}>Cargando fechas…</p>
  if (error) return <p className={styles.error}>{error}</p>

  return (
    <div>
      <h1 className={styles.heading}>Fechas del torneo</h1>
      <div className={styles.grid}>
        {dates.map((d) => (
          <a
            key={d.id}
            href={`/dashboard/fechas/${d.date_number}`}
            className={styles.card}
          >
            <div className={styles.cardHeader}>
              <span className={styles.number}>{d.date_number}</span>
              <span className={`${styles.badge} ${STATUS_CLASS[d.status]}`}>
                {STATUS_LABELS[d.status]}
              </span>
            </div>
            <div className={styles.label}>{d.label}</div>
            <div className={styles.date}>
              {new Date(d.event_date).toLocaleDateString('es-PE', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </div>
            <div className={styles.footer}>
              <span className={styles.matches}>
                {d.matches.length} {d.matches.length === 1 ? 'match' : 'matches'}
              </span>
            </div>
          </a>
        ))}
      </div>
    </div>
  )
}
