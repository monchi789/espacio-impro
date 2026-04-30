import { useEffect, useMemo, useState } from 'react'
import { IK_TEAMS, type IKMember, type IKTeam } from '../../data/impronakuy-teams'
import styles from './MvpVotingPanel.module.css'

const SESSION_KEY = 'impronakuy_session'
const MVP_VOTED_KEY_PREFIX = 'impronakuy_voted_mvp_'

type ActiveMvp = {
  id: string
  status: 'open' | 'closed'
  eligibleMemberIds: string[]
  winnerMemberId: string | null
  results: { memberId: string; votes: number }[]
  totalVotes: number
}

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

const getVotedMember = (mvpId: string): string | null => {
  if (typeof window === 'undefined') return null
  return localStorage.getItem(MVP_VOTED_KEY_PREFIX + mvpId)
}

const setVotedMember = (mvpId: string, memberId: string) => {
  if (typeof window === 'undefined') return
  localStorage.setItem(MVP_VOTED_KEY_PREFIX + mvpId, memberId)
}

type MemberWithTeam = IKMember & { team: IKTeam }

const buildMemberIndex = (): Record<string, MemberWithTeam> => {
  const idx: Record<string, MemberWithTeam> = {}
  for (const t of IK_TEAMS) {
    for (const m of t.members) {
      idx[m.id] = { ...m, team: t }
    }
  }
  return idx
}

export default function MvpVotingPanel() {
  const [mvp, setMvp] = useState<ActiveMvp | null>(null)
  const [votedMemberId, setVotedMemberIdState] = useState<string | null>(null)
  const [isVoting, setIsVoting] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const apiUrl = (import.meta.env.PUBLIC_API_URL as string | undefined) ?? ''
  const pollInterval = Number(import.meta.env.PUBLIC_POLLING_INTERVAL ?? 5000)

  const memberIndex = useMemo(buildMemberIndex, [])

  useEffect(() => {
    if (!apiUrl) return
    let cancelled = false

    const fetchMvp = async () => {
      try {
        const res = await fetch(`${apiUrl}/api/active-mvp`)
        if (!res.ok) {
          if (!cancelled) setMvp(null)
          return
        }
        const json = (await res.json()) as ActiveMvp | null
        if (!cancelled) setMvp(json ?? null)
      } catch {
        if (!cancelled) setMvp(null)
      }
    }

    fetchMvp()
    const id = setInterval(fetchMvp, pollInterval)
    return () => {
      cancelled = true
      clearInterval(id)
    }
  }, [apiUrl, pollInterval])

  useEffect(() => {
    if (!mvp) {
      setVotedMemberIdState(null)
      return
    }
    setVotedMemberIdState(getVotedMember(mvp.id))
  }, [mvp?.id])

  if (!mvp) return null
  if (mvp.status !== 'open') return null

  const isOpen = mvp.status === 'open'
  const isClosed = mvp.status === 'closed'
  const winnerId = mvp.winnerMemberId
  const voteByMember: Record<string, number> = {}
  for (const r of mvp.results) voteByMember[r.memberId] = r.votes

  const handleVote = async (memberId: string) => {
    if (!apiUrl || !isOpen || isVoting) return
    if (votedMemberId === memberId) return
    setIsVoting(true)
    setErrorMsg(null)
    try {
      const res = await fetch(`${apiUrl}/api/mvp/${mvp.id}/vote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          memberId,
          sessionToken: getSessionToken(),
        }),
      })
      if (!res.ok) {
        setErrorMsg('No se pudo registrar el voto. Intenta de nuevo.')
        return
      }
      setVotedMember(mvp.id, memberId)
      setVotedMemberIdState(memberId)
    } catch {
      setErrorMsg('Sin conexión con el servidor.')
    } finally {
      setIsVoting(false)
    }
  }

  return (
    <section className={styles.panel}>
      <div className={styles.header}>
        <h2 className={styles.title}>MVP DE LA NOCHE</h2>
        <span className={styles.subtitle}>
          {isOpen
            ? 'Vota por tu improvisador favorito'
            : isClosed && winnerId
            ? 'Resultado final'
            : 'Votación cerrada'}
        </span>
      </div>

      <div className={styles.grid}>
        {mvp.eligibleMemberIds.map((mid) => {
          const m = memberIndex[mid]
          if (!m) return null
          const votes = voteByMember[mid] ?? 0
          const isSelected = votedMemberId === mid
          const isWinner = winnerId === mid
          return (
            <button
              key={mid}
              type="button"
              className={`${styles.card} ${isSelected ? styles.cardSelected : ''} ${
                isWinner ? styles.cardWinner : ''
              }`}
              style={{ ['--card-color' as never]: m.team.color } as React.CSSProperties}
              disabled={!isOpen || isVoting || isSelected}
              onClick={() => handleVote(mid)}
            >
              <img className={styles.photo} src={m.photo1} alt={m.artisticName} loading="lazy" />
              <p className={styles.name}>{m.artisticName}</p>
              <p className={styles.team}>{m.team.name}</p>
              {(isClosed || votes > 0) && (
                <p className={styles.votes}>
                  {votes} voto{votes === 1 ? '' : 's'}
                </p>
              )}
            </button>
          )
        })}
      </div>

      {isClosed && winnerId && memberIndex[winnerId] && (
        <p className={styles.winnerBanner}>
          🏆 ¡{memberIndex[winnerId].artisticName} es el MVP!
        </p>
      )}
      {votedMemberId && memberIndex[votedMemberId] && isOpen && (
        <p className={styles.message}>
          ✓ Votaste por {memberIndex[votedMemberId].artisticName}
        </p>
      )}
      {errorMsg && <p className={styles.message}>{errorMsg}</p>}
    </section>
  )
}
