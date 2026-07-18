import { useState } from 'react'
import api from '../../services/api'
import Card from '../../components/Card'
import Table from '../../components/Table'

export default function ViajesAsignados() {
  const [inicio, setInicio] = useState('')
  const [fin, setFin] = useState('')
  const [estado, setEstado] = useState('')
  const [viajes, setViajes] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [actionLoading, setActionLoading] = useState<number | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      const params: any = {}
      if (inicio) params.inicio = inicio
      if (fin) params.fin = fin
      if (estado) params.estado = estado
      const r = await api.get('/choferes/viajes', { params })
      setViajes(r.data)
    } catch {} finally { setLoading(false) }
  }

  async function completar(id: number) {
    if (!confirm('¿Completar este viaje?')) return
    setActionLoading(id)
    try {
      await api.put(`/traslados/${id}/completar`)
      setViajes(viajes.map((v: any) => v.id === id ? { ...v, estado: 'completado' } : v))
    } catch {} finally { setActionLoading(null) }
  }

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'origen', label: 'Origen' },
    { key: 'destino', label: 'Destino' },
    { key: 'costo', label: 'Costo', render: (v: number) => `$${v?.toFixed(2)}` },
    { key: 'estado', label: 'Estado' },
    { key: 'fecha', label: 'Fecha', render: (v: string) => new Date(v).toLocaleDateString() },
    { key: 'cliente_nombre', label: 'Cliente', render: (_: any, row: any) => `${row.cliente_nombre} ${row.cliente_apellido}` },
    {
      key: 'accion', label: 'Acción',
      render: (_: any, row: any) => {
        const isLoading = actionLoading === row.id
        return row.estado === 'pendiente' ? (
          <button onClick={() => completar(row.id)} disabled={isLoading} className="px-3 py-1.5 rounded-md bg-primary text-xs font-bold text-surface hover:brightness-110 transition-all disabled:opacity-50">
            {isLoading ? '...' : 'Completar'}
          </button>
        ) : row.estado === 'completado' ? (
          <span className="text-on-surface-variant italic text-sm">Completado</span>
        ) : null
      },
    },
  ]

  return (
    <Card title="Mis Viajes">
      <form onSubmit={handleSubmit} className="flex gap-3 mb-5 items-end flex-wrap">
        <div>
          <label className="text-xs text-on-surface-variant block mb-1">Inicio</label>
          <input type="date" value={inicio} onChange={(e) => setInicio(e.target.value)} className="px-3 py-2 bg-surface border border-outline rounded-lg text-on-surface text-sm outline-none focus:border-primary transition-all" />
        </div>
        <div>
          <label className="text-xs text-on-surface-variant block mb-1">Fin</label>
          <input type="date" value={fin} onChange={(e) => setFin(e.target.value)} className="px-3 py-2 bg-surface border border-outline rounded-lg text-on-surface text-sm outline-none focus:border-primary transition-all" />
        </div>
        <div>
          <label className="text-xs text-on-surface-variant block mb-1">Estado</label>
          <select value={estado} onChange={(e) => setEstado(e.target.value)} className="px-3 py-2 bg-surface border border-outline rounded-lg text-on-surface text-sm outline-none focus:border-primary transition-all">
            <option value="">Todos</option>
            <option value="pendiente">Pendiente</option>
            <option value="completado">Completado</option>
            <option value="cancelado">Cancelado</option>
          </select>
        </div>
        <button type="submit" disabled={loading} className="px-4 py-2 rounded-lg bg-surface-container-high text-on-surface text-sm font-medium border border-outline hover:bg-surface-container transition-all disabled:opacity-50">
          {loading ? '...' : 'Filtrar'}
        </button>
      </form>
      <Table columns={columns} data={viajes} emptyMsg="No hay viajes para los filtros seleccionados" />
    </Card>
  )
}
