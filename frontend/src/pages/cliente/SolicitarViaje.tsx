import { useState, FormEvent } from 'react'
import api from '../../services/api'
import Card from '../../components/Card'

export default function SolicitarViaje() {
  const [form, setForm] = useState({ origen: '', destino: '', distancia_km: '' })
  const [msg, setMsg] = useState('')
  const [error, setError] = useState('')
  const [viaje, setViaje] = useState<any>(null)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setMsg(''); setError(''); setViaje(null)
    try {
      const res = await api.post('/traslados', { ...form, distancia_km: parseFloat(form.distancia_km) })
      setViaje(res.data)
      setMsg('Viaje solicitado exitosamente')
      setForm({ origen: '', destino: '', distancia_km: '' })
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error al solicitar viaje')
    }
  }

  return (
    <Card title="Solicitar Viaje">
      {msg && <p style={{ color: 'green' }}>{msg}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 400 }}>
        <input placeholder="Origen" value={form.origen} onChange={(e) => setForm({ ...form, origen: e.target.value })} required style={inputStyle} />
        <input placeholder="Destino" value={form.destino} onChange={(e) => setForm({ ...form, destino: e.target.value })} required style={inputStyle} />
        <input placeholder="Distancia (km)" type="number" step="0.1" value={form.distancia_km} onChange={(e) => setForm({ ...form, distancia_km: e.target.value })} required style={inputStyle} />
        <button type="submit" style={btnStyle}>Solicitar Viaje</button>
      </form>
      {viaje && (
        <div style={{ marginTop: 20, padding: 15, background: '#e8f5e9', borderRadius: 6 }}>
          <p><strong>Costo:</strong> ${viaje.costo}</p>
          <p><strong>Chofer:</strong> {viaje.chofer.nombre} {viaje.chofer.apellido}</p>
          <p><strong>Vehículo:</strong> {viaje.vehiculo.marca} {viaje.vehiculo.modelo} — {viaje.vehiculo.placa}</p>
        </div>
      )}
    </Card>
  )
}

const inputStyle: React.CSSProperties = { padding: '10px 12px', border: '1px solid #ddd', borderRadius: 6, fontSize: 14 }
const btnStyle: React.CSSProperties = { padding: '10px 12px', border: 'none', borderRadius: 6, background: '#1a1a2e', color: '#fff', fontSize: 14, cursor: 'pointer' }
