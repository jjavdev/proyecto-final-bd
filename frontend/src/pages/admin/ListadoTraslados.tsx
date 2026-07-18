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
  const [actionLoading, setActionLoading] = useState<number | null>(null)

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

  async function filtrarTodo() {
    setLoading(true)
    setInicio(''); setFin(''); setEstado(''); setPagado('')
    try {
      const r = await api.get('/reportes/traslados')
      setData(r.data)
    } catch {} finally { setLoading(false) }
  }

  async function completar(id: number) {
    if (!confirm('¿Completar este traslado?')) return
    setActionLoading(id)
    try {
      await api.put(`/traslados/${id}/completar`)
      setData(data.map((r: any) => r.id === id ? { ...r, estado: 'completado' } : r))
    } catch {} finally { setActionLoading(null) }
  }

  async function cancelar(id: number) {
    if (!confirm('¿Cancelar este traslado? Se reembolsará al cliente.')) return
    setActionLoading(id)
    try {
      await api.put(`/traslados/${id}/cancelar`)
      setData(data.map((r: any) => r.id === id ? { ...r, estado: 'cancelado' } : r))
    } catch {} finally { setActionLoading(null) }
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
      render: (_: any, row: any) => {
        const isLoading = actionLoading === row.id
        return row.estado === 'pendiente' ? (
          <div className="flex gap-2">
            <button onClick={() => completar(row.id)} disabled={isLoading} className="px-3 py-1.5 rounded-md bg-primary text-xs font-bold text-surface hover:brightness-110 transition-all disabled:opacity-50">
              {isLoading ? '...' : 'OK'}
            </button>
            <button onClick={() => cancelar(row.id)} disabled={isLoading} className="px-3 py-1.5 rounded-md bg-error text-xs font-bold text-white hover:brightness-110 transition-all disabled:opacity-50">
              {isLoading ? '...' : 'X'}
            </button>
          </div>
        ) : row.estado === 'completado' ? (
          <span className="text-primary font-bold text-sm">Completado</span>
        ) : (
          <span className="text-error font-bold text-sm">Cancelado</span>
        )
      },
    },
  ]

  return (
    <Card title="Listado de Traslados">
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
        <div>
          <label className="text-xs text-on-surface-variant block mb-1">Pagado</label>
          <select value={pagado} onChange={(e) => setPagado(e.target.value)} className="px-3 py-2 bg-surface border border-outline rounded-lg text-on-surface text-sm outline-none focus:border-primary transition-all">
            <option value="">Todos</option>
            <option value="true">Sí</option>
            <option value="false">No</option>
          </select>
        </div>
        <button type="submit" disabled={loading} className="px-4 py-2 rounded-lg bg-surface-container-high text-on-surface text-sm font-medium border border-outline hover:bg-surface-container transition-all disabled:opacity-50">
          {loading ? '...' : 'Filtrar'}
        </button>
        <button type="button" onClick={filtrarTodo} disabled={loading} className="px-4 py-2 rounded-lg bg-surface-container-high text-on-surface text-sm font-medium border border-outline hover:bg-surface-container transition-all disabled:opacity-50">
          Filtrar Todo
        </button>
      </form>
      {loading && !data.length ? (
        <div className="flex items-center justify-center py-8">
          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <Table columns={columns} data={data} emptyMsg="No hay traslados para los filtros seleccionados" />
      )}
    </Card>
  )
}
