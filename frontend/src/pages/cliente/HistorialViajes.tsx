import { useState } from 'react'
import api from '../../services/api'
import Card from '../../components/Card'
import Table from '../../components/Table'

export default function HistorialViajes() {
  const [inicio, setInicio] = useState('')
  const [fin, setFin] = useState('')
  const [estado, setEstado] = useState('')
  const [viajes, setViajes] = useState<any[]>([])
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
      {loading && !viajes.length ? (
        <div className="flex items-center justify-center py-8">
          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <Table columns={columns} data={viajes} emptyMsg="No has realizado viajes aún" />
      )}
    </Card>
  )
}
