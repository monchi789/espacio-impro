import { useEffect } from 'react'

const FOCUS_CLASS = 'ik-focus'

export default function FocusGate() {
  const apiUrl = (import.meta.env.PUBLIC_API_URL as string | undefined) ?? ''
  const pollInterval = Number(import.meta.env.PUBLIC_POLLING_INTERVAL ?? 5000)

  useEffect(() => {
    if (!apiUrl) return
    let cancelled = false

    const apply = (focus: boolean) => {
      if (typeof document === 'undefined') return
      document.body.classList.toggle(FOCUS_CLASS, focus)
    }

    const check = async () => {
      let focus = false
      try {
        const [matchRes, mvpRes] = await Promise.all([
          fetch(`${apiUrl}/api/active-match`).catch(() => null),
          fetch(`${apiUrl}/api/active-mvp`).catch(() => null),
        ])
        if (matchRes && matchRes.ok) {
          const m = await matchRes.json().catch(() => null)
          if (
            m &&
            m.status === 'active' &&
            m.currentRound &&
            m.currentRound.status === 'open'
          ) {
            focus = true
          }
        }
        if (!focus && mvpRes && mvpRes.ok) {
          const v = await mvpRes.json().catch(() => null)
          if (v && v.status === 'open') focus = true
        }
      } catch {
        focus = false
      }
      if (!cancelled) apply(focus)
    }

    check()
    const id = window.setInterval(check, pollInterval)
    return () => {
      cancelled = true
      window.clearInterval(id)
      apply(false)
    }
  }, [apiUrl, pollInterval])

  return null
}
