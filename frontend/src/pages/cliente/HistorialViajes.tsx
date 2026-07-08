import { useState } from 'react'
import api from '../../services/api'
import Card from '../../components/Card'
import Table from '../../components/Table'

export default function HistorialViajes() {
  const [inicio, setInicio] = useState('')
  const [fin, setFin] = useState('')
  const [estado, setEstado] = useState('')
  const [viajes, setViajes] = useState([])
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      const params: any = {}
      if (inicio) params.inicio = inicio
      if (fin) params.fin = fin
      if (estado) params.estado = estado
      const r = await api.get('/clientes/viajes', { params })
      setViajes(r.data)
    } catch {} finally { setLoading(false) }
  }

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'origen', label: 'Origen' },
    { key: 'destino', label: 'Destino' },
    { key: 'costo', label: 'Costo', render: (v: number) => `$${v?.toFixed(2)}` },
    { key: 'estado', label: 'Estado' },
    { key: 'fecha', label: 'Fecha', render: (v: string) => new Date(v).toLocaleDateString() },
    { key: 'chofer_nombre', label: 'Chofer', render: (_: any, row: any) => `${row.chofer_nombre} ${row.chofer_apellido || ''}` },
    { key: 'placa', label: 'Vehículo' },
  ]

  return (
    <Card title="Historial de Viajes">
      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 12, marginBottom: 20, alignItems: 'end', flexWrap: 'wrap' }}>
        <div>
          <label style={{ fontSize: 12, display: 'block' }}>Inicio</label>
          <input type="date" value={inicio} onChange={(e) => setInicio(e.target.value)} style={s} />
        </div>
        <div>
          <label style={{ fontSize: 12, display: 'block' }}>Fin</label>
          <input type="date" value={fin} onChange={(e) => setFin(e.target.value)} style={s} />
        </div>
        <div>
          <label style={{ fontSize: 12, display: 'block' }}>Estado</label>
          <select value={estado} onChange={(e) => setEstado(e.target.value)} style={s}>
            <option value="">Todos</option>
            <option value="pendiente">Pendiente</option>
            <option value="completado">Completado</option>
            <option value="cancelado">Cancelado</option>
          </select>
        </div>
        <button type="submit" style={btn} disabled={loading}>{loading ? '...' : 'Filtrar'}</button>
      </form>
      <Table columns={columns} data={viajes} emptyMsg="No has realizado viajes aún" />
    </Card>
  )
}

const s: React.CSSProperties = { padding: '10px 12px', border: '1px solid #ddd', borderRadius: 6, fontSize: 14 }
const btn: React.CSSProperties = { padding: '10px 12px', border: 'none', borderRadius: 6, background: '#1a1a2e', color: '#fff', fontSize: 14, cursor: 'pointer' }
