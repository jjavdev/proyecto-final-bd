import { useState, FormEvent } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Register() {
  const [form, setForm] = useState({ email: '', password: '', nombre: '', apellido: '', cedula: '', telefono: '', rol: 'CLIENTE' })
  const [error, setError] = useState('')
  const { register } = useAuth()
  const navigate = useNavigate()

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    try {
      await register(form)
      navigate('/dashboard')
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error al registrarse')
    }
  }

  return (
    <div style={{ maxWidth: 400, margin: '100px auto', padding: 20 }}>
      <h1>Decarrerita</h1>
      <h2>Registro</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <input type="password" placeholder="Contraseña" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        <input placeholder="Nombre" value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} />
        <input placeholder="Apellido" value={form.apellido} onChange={(e) => setForm({ ...form, apellido: e.target.value })} />
        <input placeholder="Cédula" value={form.cedula} onChange={(e) => setForm({ ...form, cedula: e.target.value })} />
        <input placeholder="Teléfono" value={form.telefono} onChange={(e) => setForm({ ...form, telefono: e.target.value })} />
        <select value={form.rol} onChange={(e) => setForm({ ...form, rol: e.target.value })}>
          <option value="CLIENTE">Cliente</option>
          <option value="CHOFER">Chofer</option>
          <option value="PERSONAL_ADMIN">Personal Administrativo</option>
        </select>
        <button type="submit">Registrarse</button>
      </form>
      <p>¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link></p>
    </div>
  )
}
