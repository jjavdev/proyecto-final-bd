import { useState, useEffect, FormEvent } from 'react'
import api from '../../services/api'
import Card from '../../components/Card'

export default function RevisarVehiculo() {
  const [vehiculoId, setVehiculoId] = useState('')
  const [calificacion, setCalificacion] = useState('')
  const [vehiculos, setVehiculos] = useState<any[]>([])
  const [msg, setMsg] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    api.get('/vehiculos').then((r) => setVehiculos(r.data)).catch(() => {})
  }, [])

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setMsg(''); setError('')
    try {
      const res = await api.post('/admin/revisar-vehiculo', { vehiculo_id: Number(vehiculoId), calificacion: Number(calificacion) })
      setMsg(`Revision registrada. ${res.data.apto ? 'Apto — Vehiculo activado' : 'No apto (minimo 65)'} (Calificacion: ${res.data.calificacion})`)
      setVehiculoId(''); setCalificacion('')
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error al revisar')
    }
  }

  return (
    <Card title="Revision Vehicular">
      {msg && <p style={{ color: 'green' }}>{msg}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 400 }}>
        <select value={vehiculoId} onChange={(e) => setVehiculoId(e.target.value)} required style={s}>
          <option value="">Seleccionar Vehiculo</option>
          {vehiculos.filter((v: any) => !v.activo).map((v: any) => (
            <option key={v.id} value={v.id}>{v.placa} — {v.marca} {v.modelo} ({v.chofer_nombre} {v.chofer_apellido})</option>
          ))}
        </select>
        <input placeholder="Calificacion (0-100)" type="number" min="0" max="100" value={calificacion} onChange={(e) => setCalificacion(e.target.value)} required style={s} />
        <p style={{ fontSize: 12, color: '#888' }}>Calificacion minima para apto: 65</p>
        <button type="submit" style={btn}>Registrar Revision</button>
      </form>
    </Card>
  )
}

const s: React.CSSProperties = { padding: '10px 12px', border: '1px solid #ddd', borderRadius: 6, fontSize: 14 }
const btn: React.CSSProperties = { padding: '10px 12px', border: 'none', borderRadius: 6, background: '#1a1a2e', color: '#fff', fontSize: 14, cursor: 'pointer' }
