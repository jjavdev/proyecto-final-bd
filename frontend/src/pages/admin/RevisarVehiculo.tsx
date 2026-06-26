import { useState, FormEvent } from 'react'
import api from '../../services/api'
import Card from '../../components/Card'

export default function RevisarVehiculo() {
  const [form, setForm] = useState({ vehiculo_id: '', calificacion: '' })
  const [msg, setMsg] = useState('')
  const [error, setError] = useState('')

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setMsg(''); setError('')
    try {
      const res = await api.post('/admin/revisar-vehiculo', { vehiculo_id: parseInt(form.vehiculo_id), calificacion: parseInt(form.calificacion) })
      setMsg(`Revisión registrada. ${res.data.apto ? 'Apto' : 'No apto'} (Calificación: ${res.data.calificacion})`)
      setForm({ vehiculo_id: '', calificacion: '' })
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error al revisar')
    }
  }

  return (
    <Card title="Revisión Vehicular">
      {msg && <p style={{ color: 'green' }}>{msg}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 400 }}>
        <input placeholder="ID del Vehículo" type="number" value={form.vehiculo_id} onChange={(e) => setForm({ ...form, vehiculo_id: e.target.value })} required style={s} />
        <input placeholder="Calificación (0-100)" type="number" min="0" max="100" value={form.calificacion} onChange={(e) => setForm({ ...form, calificacion: e.target.value })} required style={s} />
        <p style={{ fontSize: 12, color: '#888' }}>Calificación mínima para apto: 65</p>
        <button type="submit" style={btn}>Registrar Revisión</button>
      </form>
    </Card>
  )
}

const s: React.CSSProperties = { padding: '10px 12px', border: '1px solid #ddd', borderRadius: 6, fontSize: 14 }
const btn: React.CSSProperties = { padding: '10px 12px', border: 'none', borderRadius: 6, background: '#1a1a2e', color: '#fff', fontSize: 14, cursor: 'pointer' }
