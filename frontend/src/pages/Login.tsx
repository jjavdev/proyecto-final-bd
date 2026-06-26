import { useState, FormEvent } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const { login } = useAuth()
  const navigate = useNavigate()

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    try {
      await login(email, password)
      navigate('/dashboard')
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error al iniciar sesión')
    }
  }

  return (
    <div style={{ maxWidth: 400, margin: '100px auto', padding: 20 }}>
      <h1>Decarrerita</h1>
      <h2>Iniciar Sesión</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div>
          <input type="password" placeholder="Contraseña" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <button type="submit">Ingresar</button>
      </form>
      <p>¿No tienes cuenta? <Link to="/register">Regístrate</Link></p>
    </div>
  )
}
