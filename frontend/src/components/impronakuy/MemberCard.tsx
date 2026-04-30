import { useEffect, useState } from 'react'
import type { IKMember } from '../../data/impronakuy-teams'
import styles from './MemberCard.module.css'

interface Props {
  member: IKMember
  teamColor: string
  teamName?: string
}

const STAT_LABELS: Array<{ key: keyof IKMember['stats']; label: string }> = [
  { key: 'ataque', label: 'Ataque' },
  { key: 'defensa', label: 'Defensa' },
  { key: 'velocidad', label: 'Velocidad' },
]

const MAX_STARS = 5

function StatStars({ value, color }: { value: number; color: string }) {
  return (
    <span className={styles.statStars} aria-label={`${value} de ${MAX_STARS}`}>
      {Array.from({ length: MAX_STARS }, (_, i) => (
        <span
          key={i}
          className={`${styles.star} ${i < value ? styles.starOn : ''}`}
          style={i < value ? { color } : undefined}
          aria-hidden="true"
        >
          ★
        </span>
      ))}
    </span>
  )
}

export default function MemberCard({ member, teamColor, teamName }: Props) {
  const [isMobile, setIsMobile] = useState(false)
  const [showAlt, setShowAlt] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const mq = window.matchMedia('(hover: none)')
    setIsMobile(mq.matches)
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  useEffect(() => {
    if (!isMobile) return
    const id = setInterval(() => setShowAlt((v) => !v), 4000)
    return () => clearInterval(id)
  }, [isMobile])

  const totalPower =
    member.stats.ataque + member.stats.defensa + member.stats.velocidad
  const className = `${styles.card} ${showAlt ? styles.alt : ''}`

  return (
    <article
      className={className}
      style={{ ['--team-color' as never]: teamColor } as React.CSSProperties}
    >
      <div className={styles.frame}>
        <div className={styles.topBar}>
          <span className={styles.typeBadge}>
            <span className={styles.typeDot} />
            {teamName ?? 'Impronakuy'}
          </span>
          <span className={styles.hp}>PWR {totalPower * 10}</span>
        </div>

        <div className={styles.photoWrapper}>
          <img
            className={`${styles.photo} ${styles.photoBase}`}
            src={member.photo1}
            alt={member.artisticName}
            loading="lazy"
            decoding="async"
          />
          <img
            className={`${styles.photo} ${styles.photoAlt}`}
            src={member.photo2}
            alt={`${member.artisticName} (alt)`}
            loading="lazy"
            decoding="async"
          />
        </div>

        <div className={styles.nameBanner}>
          <h3 className={styles.nameArtistic}>{member.artisticName}</h3>
        </div>

        <div className={styles.statsBlock}>
          {STAT_LABELS.map(({ key, label }) => (
            <div className={styles.statRow} key={key}>
              <span className={styles.statLabel}>{label}</span>
              <StatStars value={member.stats[key]} color={teamColor} />
            </div>
          ))}
        </div>

        <div className={styles.footer}>
          <span>Impronakuy 2026</span>
          <span className={styles.footerAccent}>#{member.id.slice(0, 4).toUpperCase()}</span>
        </div>
      </div>
    </article>
  )
}
