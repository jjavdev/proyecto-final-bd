import { useState, FormEvent } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Register() {
  const [form, setForm] = useState({ email: '', password: '', confirmPassword: '', nombre: '', apellido: '', cedula: '', telefono: '', rol: 'CLIENTE' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()
  const navigate = useNavigate()

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')

    if (form.password !== form.confirmPassword) {
      setError('Las contraseñas no coinciden')
      return
    }

    setLoading(true)
    try {
      const { confirmPassword, ...data } = form
      await register(data)
      navigate('/dashboard')
    } catch (err: any) {
      const msg = err.response?.data?.error
      setError(typeof msg === 'string' ? msg : 'Error al registrarse')
    } finally {
      setLoading(false)
    }
  }

  function soloLetras(e: React.ChangeEvent<HTMLInputElement>, campo: 'nombre' | 'apellido') {
    const val = e.target.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, '')
    setForm({ ...form, [campo]: val })
  }

  function soloDigitos(e: React.ChangeEvent<HTMLInputElement>, campo: 'cedula' | 'telefono') {
    const val = e.target.value.replace(/\D/g, '')
    setForm({ ...form, [campo]: val })
  }

  return (
    <div className="auth-page">
      <div className="auth-glow-1" />
      <div className="auth-glow-2" />
      <main className="bg-surface-container/85 backdrop-blur-lg border border-outline rounded-xl p-lg shadow-neon w-full max-w-[440px] mx-4 relative z-10">
        <div className="text-center mb-6">
          <h1 className="font-headline text-3xl font-extrabold italic text-primary-fixed-dim -tracking-[0.02em]">Decarrerita</h1>
          <p className="font-body text-xs text-on-surface-variant tracking-[0.15em] uppercase mt-1">Crear Cuenta</p>
        </div>

        {error && (
          <p className="text-error text-sm text-center mb-4 py-2.5 px-4 bg-error/10 border border-error/30 rounded-md">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
          <input
            type="email"
            placeholder="Correo electrónico"
            value={form.email}
            maxLength={100}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="bg-surface-container-lowest border border-outline rounded-lg px-4 py-3.5 w-full text-on-surface text-sm outline-none focus:border-primary focus:shadow-neon-sm transition-all"
            required
          />
          <div className="grid grid-cols-2 gap-3">
            <input
              type="password"
              placeholder="Contraseña"
              value={form.password}
              maxLength={50}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="bg-surface-container-lowest border border-outline rounded-lg px-4 py-3.5 w-full text-on-surface text-sm outline-none focus:border-primary focus:shadow-neon-sm transition-all"
              required
              minLength={6}
            />
            <input
              type="password"
              placeholder="Confirmar contraseña"
              value={form.confirmPassword}
              maxLength={50}
              onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
              className="bg-surface-container-lowest border border-outline rounded-lg px-4 py-3.5 w-full text-on-surface text-sm outline-none focus:border-primary focus:shadow-neon-sm transition-all"
              required
              minLength={6}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <input
              placeholder="Nombre"
              value={form.nombre}
              maxLength={50}
              onChange={(e) => soloLetras(e, 'nombre')}
              className="bg-surface-container-lowest border border-outline rounded-lg px-4 py-3.5 w-full text-on-surface text-sm outline-none focus:border-primary focus:shadow-neon-sm transition-all"
              required
            />
            <input
              placeholder="Apellido"
              value={form.apellido}
              maxLength={50}
              onChange={(e) => soloLetras(e, 'apellido')}
              className="bg-surface-container-lowest border border-outline rounded-lg px-4 py-3.5 w-full text-on-surface text-sm outline-none focus:border-primary focus:shadow-neon-sm transition-all"
              required
            />
          </div>
          <input
            placeholder="Cédula (solo dígitos)"
            value={form.cedula}
            maxLength={10}
            onChange={(e) => soloDigitos(e, 'cedula')}
            className="bg-surface-container-lowest border border-outline rounded-lg px-4 py-3.5 w-full text-on-surface text-sm outline-none focus:border-primary focus:shadow-neon-sm transition-all"
            required
            minLength={7}
          />
          <input
            placeholder="Teléfono (ej: 04121234567)"
            value={form.telefono}
            maxLength={15}
            onChange={(e) => soloDigitos(e, 'telefono')}
            className="bg-surface-container-lowest border border-outline rounded-lg px-4 py-3.5 w-full text-on-surface text-sm outline-none focus:border-primary focus:shadow-neon-sm transition-all"
            required
            minLength={10}
          />
          <select
            value={form.rol}
            onChange={(e) => setForm({ ...form, rol: e.target.value })}
            className="bg-surface-container-lowest border border-outline rounded-lg px-4 py-3.5 w-full text-on-surface text-sm outline-none focus:border-primary focus:shadow-neon-sm transition-all"
          >
            <option value="CLIENTE">Cliente</option>
            <option value="CHOFER">Chofer</option>
          </select>
          <button type="submit" className="btn-primary mt-1.5 flex items-center justify-center gap-2" disabled={loading}>
            {loading && <span className="w-4 h-4 border-2 border-surface border-t-transparent rounded-full animate-spin" />}
            {loading ? 'CREANDO...' : 'CREAR CUENTA'}
          </button>
        </form>

        <p className="text-center mt-5 text-on-surface-variant text-sm">
          ¿Ya tienes una cuenta?{' '}
          <Link to="/login" className="text-primary-fixed-dim font-bold underline underline-offset-4">Iniciar Sesión</Link>
        </p>
      </main>
    </div>
  )
}
