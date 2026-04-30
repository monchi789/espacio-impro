import { useEffect, useMemo, useRef, useState } from 'react'
import { IK_TEAMS, type IKMember } from '../../data/impronakuy-teams'
import { wsUrl } from '../../lib/dashboard-api'
import styles from './LiveMvpVotes.module.css'

interface Props {
  mvpId: string
  eligibleMemberIds: string[]
}

interface WsResult {
  member_id: string
  votes: number
}

interface InitMsg {
  type: 'init'
  results: WsResult[]
}
interface VoteMsg {
  type: 'vote_update'
  results: WsResult[]
}
type WsMsg = InitMsg | VoteMsg | { type: string }

export default function LiveMvpVotes({ mvpId, eligibleMemberIds }: Props) {
  const memberMap = useMemo(() => {
    const map = new Map<string, IKMember>()
    for (const team of IK_TEAMS) {
      for (const m of team.members) map.set(m.id, m)
    }
    return map
  }, [])

  const [counts, setCounts] = useState<Record<string, number>>(() =>
    Object.fromEntries(eligibleMemberIds.map((id) => [id, 0])),
  )
  const wsRef = useRef<WebSocket | null>(null)
  const reconnectRef = useRef<number | null>(null)
  const closedRef = useRef(false)

  useEffect(() => {
    function applyResults(results: WsResult[]) {
      const next: Record<string, number> = Object.fromEntries(
        eligibleMemberIds.map((id) => [id, 0]),
      )
      for (const r of results) next[r.member_id] = r.votes
      setCounts(next)
    }

    function connect() {
      const ws = new WebSocket(wsUrl(`/ws/mvp/${mvpId}`))
      wsRef.current = ws
      ws.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data) as WsMsg
          if (msg.type === 'init' || msg.type === 'vote_update') {
            applyResults((msg as InitMsg | VoteMsg).results)
          }
        } catch {
          // ignore
        }
      }
      ws.onclose = () => {
        if (closedRef.current) return
        reconnectRef.current = window.setTimeout(connect, 3000)
      }
      ws.onerror = () => ws.close()
    }

    connect()
    return () => {
      closedRef.current = true
      if (reconnectRef.current) window.clearTimeout(reconnectRef.current)
      wsRef.current?.close()
    }
  }, [mvpId, eligibleMemberIds])

  const max = Math.max(1, ...Object.values(counts))
  const sorted = [...eligibleMemberIds].sort((a, b) => (counts[b] ?? 0) - (counts[a] ?? 0))
  const leader = sorted[0]
  const leaderHasVotes = counts[leader] > 0

  return (
    <div className={styles.grid}>
      {sorted.map((id) => {
        const m = memberMap.get(id)
        const v = counts[id] ?? 0
        const isLeader = id === leader && leaderHasVotes
        return (
          <div
            key={id}
            className={`${styles.card} ${isLeader ? styles.cardLeader : ''}`}
          >
            <img
              className={styles.photo}
              src={m?.photo1 ?? ''}
              alt={m?.artisticName ?? id}
              loading="lazy"
            />
            <div className={styles.name}>{m?.artisticName ?? id}</div>
            <div className={styles.bar}>
              <div className={styles.fill} style={{ width: `${(v / max) * 100}%` }} />
            </div>
            <div className={styles.votes}>{v} votos</div>
          </div>
        )
      })}
    </div>
  )
}
