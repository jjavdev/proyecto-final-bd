import { useState, FormEvent } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [hoverBtn, setHoverBtn] = useState<string | null>(null)
  const { login } = useAuth()
  const navigate = useNavigate()

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(email, password)
      navigate('/dashboard')
    } catch (err: any) {
      const msg = err.response?.data?.error
      setError(typeof msg === 'string' ? msg : 'Error al iniciar sesión')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-glow-1" />
      <div className="auth-glow-2" />
      <main className="bg-surface-container/85 backdrop-blur-lg border border-outline rounded-xl p-lg shadow-neon w-full max-w-[440px] mx-4 relative z-10">
        <div className="text-center mb-8">
          <h1 className="font-headline text-4xl font-extrabold italic text-primary-fixed-dim -tracking-[0.02em]">Decarrerita</h1>
          <p className="font-body text-xs text-on-surface-variant tracking-[0.15em] uppercase mt-1">Soluciones de Movilidad</p>
        </div>

        {error && (
          <p className="text-error text-sm text-center mb-4 py-2.5 px-4 bg-error/10 border border-error/30 rounded-md">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div>
            <label className="block mb-1.5">Correo electrónico</label>
            <input
              type="email"
              placeholder="pilot@decarrerita.com"
              value={email}
              maxLength={100}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-surface-container-lowest border border-outline rounded-lg px-4 py-4 w-full text-on-surface text-body-md outline-none focus:border-primary focus:shadow-neon-sm transition-all"
              required
            />
          </div>
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label>Contraseña</label>
              <span className="text-xs text-primary-fixed-dim/60 cursor-default">¿Olvidaste tu contraseña?</span>
            </div>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              maxLength={50}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-surface-container-lowest border border-outline rounded-lg px-4 py-4 w-full text-on-surface text-body-md outline-none focus:border-primary focus:shadow-neon-sm transition-all"
              required
            />
          </div>
          <button type="submit" className="btn-primary mt-1 flex items-center justify-center gap-2" disabled={loading}>
            {loading && <span className="w-4 h-4 border-2 border-surface border-t-transparent rounded-full animate-spin" />}
            {loading ? 'INICIANDO...' : 'INICIAR SESIÓN'}
          </button>
        </form>

        <div className="flex items-center gap-4 my-6 text-on-surface-variant text-xs font-semibold tracking-[0.1em] uppercase">
          <span className="flex-1 h-px bg-outline/50" />
          <span>o continúa con</span>
          <span className="flex-1 h-px bg-outline/50" />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onMouseEnter={() => setHoverBtn('google')}
            onMouseLeave={() => setHoverBtn(null)}
            className="relative flex items-center justify-center gap-2 py-3 px-4 rounded-lg border border-outline/50 bg-transparent text-on-surface-variant text-sm font-medium font-body hover:bg-surface-container-high cursor-not-allowed transition-colors"
          >
            {hoverBtn === 'google' ? 'En desarrollo' : 'Google'}
          </button>
          <button
            type="button"
            onMouseEnter={() => setHoverBtn('apple')}
            onMouseLeave={() => setHoverBtn(null)}
            className="relative flex items-center justify-center gap-2 py-3 px-4 rounded-lg border border-outline/50 bg-transparent text-on-surface-variant text-sm font-medium font-body hover:bg-surface-container-high cursor-not-allowed transition-colors"
          >
            {hoverBtn === 'apple' ? 'En desarrollo' : 'Apple'}
          </button>
        </div>

        <p className="text-center mt-6 text-on-surface-variant text-sm">
          ¿No tienes una cuenta?{' '}
          <Link to="/register" className="text-primary-fixed-dim font-bold underline underline-offset-4">Registrarse</Link>
        </p>
      </main>
    </div>
  )
}
