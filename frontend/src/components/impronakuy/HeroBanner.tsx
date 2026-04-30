import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import type { IKTeam } from '../../data/impronakuy-teams'
import styles from './HeroBanner.module.css'

interface Props {
  teams: IKTeam[]
  activeMatchTeams?: { teamA: IKTeam; teamB: IKTeam } | null
}

interface Star {
  top: string
  left: string
  size: string
  delay: string
  dur: string
}

export default function HeroBanner({ teams, activeMatchTeams = null }: Props) {
  const slides = useMemo<Array<[IKTeam, IKTeam]>>(() => {
    const out: Array<[IKTeam, IKTeam]> = []
    for (let i = 0; i < teams.length; i++) {
      out.push([teams[i], teams[(i + 1) % teams.length]])
    }
    return out
  }, [teams])

  const stars = useMemo<Star[]>(() => {
    const arr: Star[] = []
    for (let i = 0; i < 80; i++) {
      arr.push({
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        size: `${1 + Math.random() * 2}px`,
        delay: `${Math.random() * 4}s`,
        dur: `${2 + Math.random() * 4}s`,
      })
    }
    return arr
  }, [])

  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (activeMatchTeams) return
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % slides.length)
    }, 5000)
    return () => clearInterval(id)
  }, [slides.length, activeMatchTeams])

  const [teamA, teamB] = activeMatchTeams
    ? [activeMatchTeams.teamA, activeMatchTeams.teamB]
    : slides[index]

  return (
    <section className={`${styles.hero} ${activeMatchTeams ? styles.bigMode : ''}`}>
      <div className={styles.starsContainer} aria-hidden="true">
        {stars.map((s, i) => (
          <span
            key={i}
            className={styles.star}
            style={{
              top: s.top,
              left: s.left,
              width: s.size,
              height: s.size,
              ['--delay' as never]: s.delay,
              ['--dur' as never]: s.dur,
            } as React.CSSProperties}
          />
        ))}
      </div>

      <h1 className={styles.title}>
        <span className={styles.titleMain}>IMPRONAKUY</span>
        <span className={styles.titleYear}>2026</span>
      </h1>
      <p className={styles.subtitle}>
        {activeMatchTeams ? 'Enfrentamiento en vivo' : 'Torneo de catch de improvisación'}
      </p>

      <div className={styles.matchup}>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={`A-${teamA.id}`}
            className={`${styles.teamSlot}`}
            style={{ ['--team-color' as never]: teamA.color } as React.CSSProperties}
            initial={{ opacity: 0, x: -60, scale: 0.92 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -60, scale: 0.92 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className={styles.teamPhotoWrap}>
              <img
                src={teamA.teamPhoto}
                alt={teamA.name}
                className={styles.teamPhoto}
                loading="eager"
                fetchPriority="high"
                decoding="async"
              />
            </div>
            <span className={styles.teamLabel}>{teamA.name}</span>
          </motion.div>
        </AnimatePresence>

        <motion.div
          className={styles.vs}
          animate={{ scale: [1, 1.12, 1], rotate: [0, -4, 4, 0] }}
          transition={{ duration: 0.9, ease: 'easeInOut' }}
          key={`vs-${teamA.id}-${teamB.id}`}
        >
          VS
        </motion.div>

        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={`B-${teamB.id}`}
            className={`${styles.teamSlot}`}
            style={{ ['--team-color' as never]: teamB.color } as React.CSSProperties}
            initial={{ opacity: 0, x: 60, scale: 0.92 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 60, scale: 0.92 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className={styles.teamPhotoWrap}>
              <img
                src={teamB.teamPhoto}
                alt={teamB.name}
                className={styles.teamPhoto}
                loading="eager"
                fetchPriority="high"
                decoding="async"
              />
            </div>
            <span className={styles.teamLabel}>{teamB.name}</span>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  )
}
