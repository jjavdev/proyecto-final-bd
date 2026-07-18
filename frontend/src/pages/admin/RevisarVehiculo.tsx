import { useState, useEffect, FormEvent } from 'react'
import api from '../../services/api'
import Card from '../../components/Card'

export default function RevisarVehiculo() {
  const [vehiculoId, setVehiculoId] = useState('')
  const [calificacion, setCalificacion] = useState('')
  const [vehiculos, setVehiculos] = useState<any[]>([])
  const [msg, setMsg] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    api.get('/vehiculos').then((r) => setVehiculos(r.data)).catch(() => {})
  }, [])

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setMsg(''); setError('')
    setLoading(true)
    try {
      const res = await api.post('/admin/revisar-vehiculo', { vehiculo_id: Number(vehiculoId), calificacion: Number(calificacion) })
      setMsg(`Revisión registrada. ${res.data.apto ? 'Apto — Vehículo activado' : 'No apto (mínimo 65)'} (Calificación: ${res.data.calificacion})`)
      setVehiculoId(''); setCalificacion('')
    } catch (err: any) {
      const msg = err.response?.data?.error
      setError(typeof msg === 'string' ? msg : 'Error al revisar')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card title="Revisión Vehicular">
      {msg && <p className="text-primary text-sm text-center mb-4 py-2.5 px-4 bg-primary/10 border border-primary/30 rounded-md">{msg}</p>}
      {error && <p className="text-error text-sm text-center mb-4 py-2.5 px-4 bg-error/10 border border-error/30 rounded-md">{error}</p>}
      <form onSubmit={handleSubmit} className="flex flex-col gap-3 max-w-[400px]">
        <select value={vehiculoId} onChange={(e) => setVehiculoId(e.target.value)} required className="w-full px-3 py-2.5 bg-surface border border-outline rounded-lg text-on-surface text-sm outline-none focus:border-primary transition-all">
          <option value="">Seleccionar Vehículo</option>
          {vehiculos.filter((v: any) => !v.activo).map((v: any) => (
            <option key={v.id} value={v.id}>{v.placa} — {v.marca} {v.modelo} ({v.chofer_nombre} {v.chofer_apellido})</option>
          ))}
        </select>
        <input placeholder="Calificación (0-100)" type="number" min="0" max="100" value={calificacion} onChange={(e) => setCalificacion(e.target.value)} required className="w-full px-3 py-2.5 bg-surface border border-outline rounded-lg text-on-surface text-sm outline-none focus:border-primary transition-all" />
        <p className="text-xs text-on-surface-variant">Calificación mínima para apto: 65</p>
        <button type="submit" className="w-full py-2.5 rounded-lg font-headline font-bold text-sm tracking-widest uppercase text-surface bg-gradient-to-r from-primary to-[#2be088] transition-all duration-300 shadow-lg shadow-primary/20 hover:shadow-primary/40 flex items-center justify-center gap-2 disabled:opacity-60" disabled={loading}>
          {loading && <span className="w-4 h-4 border-2 border-surface border-t-transparent rounded-full animate-spin" />}
          {loading ? 'REGISTRANDO...' : 'Registrar Revisión'}
        </button>
      </form>
    </Card>
  )
}
