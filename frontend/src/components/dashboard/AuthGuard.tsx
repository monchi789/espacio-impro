import { useEffect, useState, type ReactNode } from 'react'
import { authFetch, clearToken, getToken } from '../../lib/dashboard-api'
import styles from './AuthGuard.module.css'

interface Props {
  children: ReactNode
}

export default function AuthGuard({ children }: Props) {
  const [authorized, setAuthorized] = useState(false)
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    const token = getToken()
    if (!token) {
      window.location.href = '/dashboard/login'
      return
    }
    authFetch('/auth/me')
      .then((res) => {
        if (res.ok) {
          setAuthorized(true)
        } else {
          clearToken()
          window.location.href = '/dashboard/login'
        }
      })
      .catch(() => {
        clearToken()
        window.location.href = '/dashboard/login'
      })
      .finally(() => setChecking(false))
  }, [])

  if (checking || !authorized) {
    return (
      <div className={styles.guard}>
        <div className={styles.spinner} aria-label="Verificando sesión" />
      </div>
    )
  }

  return <>{children}</>
}
