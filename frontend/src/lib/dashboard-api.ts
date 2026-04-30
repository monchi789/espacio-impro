const TOKEN_KEY = 'impronakuy_admin_token'

export function getToken(): string | null {
  if (typeof window === 'undefined') return null
  return window.localStorage.getItem(TOKEN_KEY)
}

export function setToken(token: string): void {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(TOKEN_KEY, token)
}

export function clearToken(): void {
  if (typeof window === 'undefined') return
  window.localStorage.removeItem(TOKEN_KEY)
}

export function logout(): void {
  clearToken()
  if (typeof window !== 'undefined') {
    window.location.href = '/dashboard/login'
  }
}

export const API_BASE: string =
  (import.meta.env.PUBLIC_API_BASE as string | undefined) ?? 'http://localhost:8000'

export async function authFetch(path: string, options: RequestInit = {}): Promise<Response> {
  const token = getToken()
  const headers = new Headers(options.headers)
  if (token) headers.set('Authorization', `Bearer ${token}`)
  if (options.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json')
  }
  const res = await fetch(`${API_BASE}${path}`, { ...options, headers })
  if (res.status === 401) {
    clearToken()
    if (typeof window !== 'undefined') {
      window.location.href = '/dashboard/login'
    }
  }
  return res
}

export function publicFetch(path: string, options: RequestInit = {}): Promise<Response> {
  const headers = new Headers(options.headers)
  if (options.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json')
  }
  return fetch(`${API_BASE}${path}`, { ...options, headers })
}

export interface Match {
  id: string
  event_date_id: string
  team_a_id: string
  team_b_id: string
  status: 'pending' | 'active' | 'finished'
  winner_team_id: string | null
  order_in_date: number
  penalty_a: number
  penalty_b: number
  rounds: Round[]
}

export interface Round {
  id: string
  match_id: string
  round_number: number
  status: 'open' | 'closed'
  winner_team_id: string | null
  is_tie: boolean
  opened_at: string | null
  closed_at: string | null
}

export interface DashboardDate {
  id: string
  date_number: number
  label: string
  event_date: string
  status: 'upcoming' | 'active' | 'done'
  matches: Match[]
}

export interface RoundResults {
  round_id: string
  round_status: string
  votes_a: number
  votes_b: number
}

export interface MvpMemberResult {
  member_id: string
  votes: number
}

export interface MvpResults {
  id: string
  status: 'pending' | 'open' | 'closed'
  winner_member_id: string | null
  results: MvpMemberResult[]
}

export function wsUrl(path: string): string {
  if (typeof window === 'undefined') return path
  if (API_BASE) {
    return API_BASE.replace(/^http/, 'ws') + path
  }
  const proto = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
  return `${proto}//${window.location.host}${path}`
}
