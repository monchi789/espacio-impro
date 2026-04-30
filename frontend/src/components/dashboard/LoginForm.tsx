import { useState, type FormEvent } from 'react'
import { publicFetch, setToken } from '../../lib/dashboard-api'
import styles from './LoginForm.module.css'

export default function LoginForm() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const res = await publicFetch('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ username, password }),
      })
      if (res.status === 200) {
        const data = (await res.json()) as { access_token: string }
        setToken(data.access_token)
        window.location.href = '/dashboard/fechas'
        return
      }
      if (res.status === 401) {
        setError('Credenciales incorrectas')
      } else {
        setError('Error del servidor')
      }
    } catch {
      setError('Error de conexión')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.wrapper}>
      <form className={styles.card} onSubmit={handleSubmit}>
        <h1 className={styles.title}>Dashboard</h1>
        <p className={styles.subtitle}>Iniciá sesión para administrar el evento</p>

        {error && <div className={styles.error}>{error}</div>}

        <div className={styles.field}>
          <label className={styles.label} htmlFor="username">Usuario</label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
            required
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="password">Contraseña</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
          />
        </div>

        <button className={styles.submit} type="submit" disabled={loading}>
          {loading ? 'Verificando…' : 'Entrar'}
        </button>
      </form>
    </div>
  )
}
