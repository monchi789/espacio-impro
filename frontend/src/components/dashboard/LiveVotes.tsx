import { useEffect, useRef, useState } from 'react'
import { authFetch, wsUrl } from '../../lib/dashboard-api'
import styles from './LiveVotes.module.css'

interface Props {
  matchId: string
  roundId?: string | null
  teamAName: string
  teamBName: string
  teamAColor: string
  teamBColor: string
}

interface InitMsg {
  type: 'init'
  votes_a: number
  votes_b: number
}
interface VoteMsg {
  type: 'vote_update'
  votes_a: number
  votes_b: number
}
interface RoundClosedMsg {
  type: 'round_closed'
  winner_team_id: string | null
}
interface MatchFinishedMsg {
  type: 'match_finished'
  winner_team_id: string | null
}

type WsMsg = InitMsg | VoteMsg | RoundClosedMsg | MatchFinishedMsg | { type: string }

export default function LiveVotes({
  matchId,
  roundId,
  teamAName,
  teamBName,
  teamAColor,
  teamBColor,
}: Props) {
  const [votesA, setVotesA] = useState(0)
  const [votesB, setVotesB] = useState(0)
  const [banner, setBanner] = useState<string | null>(null)
  const wsRef = useRef<WebSocket | null>(null)
  const reconnectRef = useRef<number | null>(null)
  const closedRef = useRef(false)

  useEffect(() => {
    function connect() {
      const ws = new WebSocket(wsUrl(`/ws/match/${matchId}`))
      wsRef.current = ws

      ws.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data) as WsMsg
          if (msg.type === 'init' || msg.type === 'vote_update') {
            const m = msg as InitMsg | VoteMsg
            setVotesA(m.votes_a)
            setVotesB(m.votes_b)
          } else if (msg.type === 'round_closed') {
            setBanner('Ronda cerrada')
            setTimeout(() => setBanner(null), 3000)
          } else if (msg.type === 'match_finished') {
            setBanner('Match finalizado')
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
  }, [matchId])

  // Polling fallback (en caso de WS caído)
  useEffect(() => {
    if (!roundId) return
    let cancelled = false
    async function poll() {
      try {
        const res = await authFetch(`/api/rounds/${roundId}/results`)
        if (!res.ok) return
        const data = (await res.json()) as { votes_a: number; votes_b: number }
        if (!cancelled) {
          setVotesA(data.votes_a)
          setVotesB(data.votes_b)
        }
      } catch {
        // ignore
      }
    }
    void poll()
    const id = window.setInterval(poll, 2000)
    return () => {
      cancelled = true
      window.clearInterval(id)
    }
  }, [roundId])

  const total = votesA + votesB
  const pctA = total === 0 ? 50 : (votesA / total) * 100
  const pctB = 100 - pctA

  return (
    <div className={styles.wrapper}>
      <div className={styles.row}>
        <span className={styles.team} style={{ color: teamAColor }}>
          {teamAName}
        </span>
        <div className={styles.bar}>
          <div
            className={styles.fillA}
            style={{ width: `${pctA}%`, background: teamAColor }}
          />
          <div
            className={styles.fillB}
            style={{ width: `${pctB}%`, background: teamBColor }}
          />
        </div>
        <span className={`${styles.team} ${styles.teamRight}`} style={{ color: teamBColor }}>
          {teamBName}
        </span>
      </div>
      <div className={styles.counts}>
        <span>{votesA} votos</span>
        <span>{votesB} votos</span>
      </div>
      {banner && <div className={styles.banner}>{banner}</div>}
    </div>
  )
}
