import { useState } from 'react'
import api from '../../services/api'
import Card from '../../components/Card'
import Table from '../../components/Table'

export default function ListadoTraslados() {
  const [inicio, setInicio] = useState('')
  const [fin, setFin] = useState('')
  const [estado, setEstado] = useState('')
  const [pagado, setPagado] = useState('')
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      const params: any = {}
      if (inicio) params.inicio = inicio
      if (fin) params.fin = fin
      if (estado) params.estado = estado
      if (pagado) params.pagado = pagado
      const r = await api.get('/reportes/traslados', { params })
      setData(r.data)
    } catch {} finally { setLoading(false) }
  }

  async function completar(id: number) {
    if (!confirm('¿Completar este traslado?')) return
    try {
      await api.put(`/traslados/${id}/completar`)
      setData(data.map((r: any) => r.id === id ? { ...r, estado: 'completado' } : r))
    } catch {}
  }

  async function cancelar(id: number) {
    if (!confirm('¿Cancelar este traslado? Se reembolsará al cliente.')) return
    try {
      await api.put(`/traslados/${id}/cancelar`)
      setData(data.map((r: any) => r.id === id ? { ...r, estado: 'cancelado' } : r))
    } catch {}
  }

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'origen', label: 'Origen' },
    { key: 'destino', label: 'Destino' },
    { key: 'costo', label: 'Costo', render: (v: number) => `$${Number(v).toFixed(2)}` },
    { key: 'estado', label: 'Estado' },
    { key: 'fecha', label: 'Fecha', render: (v: string) => new Date(v).toLocaleString() },
    { key: 'chofer_nombre', label: 'Chofer', render: (_: any, row: any) => `${row.chofer_nombre} ${row.chofer_apellido}` },
    { key: 'cliente_nombre', label: 'Cliente', render: (_: any, row: any) => `${row.cliente_nombre} ${row.cliente_apellido}` },
    { key: 'pagado', label: 'Pagado', render: (v: boolean) => v ? 'Sí' : 'No' },
    { key: 'placa', label: 'Vehículo' },
    {
      key: 'accion', label: 'Acción',
      render: (_: any, row: any) => row.estado === 'pendiente' ? (
        <div style={{ display: 'flex', gap: 6 }}>
          <button onClick={() => completar(row.id)} style={btnSm}>OK</button>
          <button onClick={() => cancelar(row.id)} style={btnDanger}>X</button>
        </div>
      ) : null,
    },
  ]

  return (
    <Card title="Listado de Traslados">
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
        <div>
          <label style={{ fontSize: 12, display: 'block' }}>Pagado</label>
          <select value={pagado} onChange={(e) => setPagado(e.target.value)} style={s}>
            <option value="">Todos</option>
            <option value="true">Sí</option>
            <option value="false">No</option>
          </select>
        </div>
        <button type="submit" style={btn} disabled={loading}>{loading ? '...' : 'Filtrar'}</button>
      </form>
      <Table columns={columns} data={data} emptyMsg="No hay traslados para los filtros seleccionados" />
    </Card>
  )
}

const s: React.CSSProperties = { padding: '10px 12px', border: '1px solid #ddd', borderRadius: 6, fontSize: 14 }
const btn: React.CSSProperties = { padding: '10px 12px', border: 'none', borderRadius: 6, background: '#1a1a2e', color: '#fff', fontSize: 14, cursor: 'pointer' }
const btnSm: React.CSSProperties = { padding: '6px 10px', border: 'none', borderRadius: 4, background: '#4ecca3', color: '#fff', fontSize: 12, cursor: 'pointer' }
const btnDanger: React.CSSProperties = { padding: '6px 10px', border: 'none', borderRadius: 4, background: '#e94560', color: '#fff', fontSize: 12, cursor: 'pointer' }
