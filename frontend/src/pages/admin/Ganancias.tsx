import { useState } from 'react'
import api from '../../services/api'
import Card from '../../components/Card'
import Table from '../../components/Table'

export default function Ganancias() {
  const [inicio, setInicio] = useState('')
  const [fin, setFin] = useState('')
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(''); setLoading(true)
    try {
      const params: any = {}
      if (inicio) params.inicio = inicio
      if (fin) params.fin = fin
      const r = await api.get('/reportes/ganancias', { params })
      setData(r.data)
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error al consultar')
    } finally {
      setLoading(false)
    }
  }

  async function filtrarTodo() {
    setError(''); setLoading(true)
    setInicio(''); setFin('')
    try {
      const r = await api.get('/reportes/ganancias')
      setData(r.data)
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error al consultar')
    } finally {
      setLoading(false)
    }
  }

  const columns = [
    { key: 'dia', label: 'Fecha', render: (v: string) => new Date(v).toLocaleDateString() },
    { key: 'viajes', label: 'Viajes' },
    { key: 'total_bruto', label: 'Total Bruto', render: (v: number) => `$${Number(v).toFixed(2)}` },
    { key: 'ganancia_empresa', label: 'Ganancia (30%)', render: (v: number) => `$${Number(v).toFixed(2)}` },
  ]

  return (
    <Card title="Ganancias por Período">
      <form onSubmit={handleSubmit} className="flex gap-3 mb-5 items-end flex-wrap">
        <div>
          <label className="text-xs text-on-surface-variant block mb-1">Fecha Inicio</label>
          <input type="date" value={inicio} onChange={(e) => setInicio(e.target.value)} className="px-3 py-2 bg-surface border border-outline rounded-lg text-on-surface text-sm outline-none focus:border-primary transition-all" />
        </div>
        <div>
          <label className="text-xs text-on-surface-variant block mb-1">Fecha Fin</label>
          <input type="date" value={fin} onChange={(e) => setFin(e.target.value)} className="px-3 py-2 bg-surface border border-outline rounded-lg text-on-surface text-sm outline-none focus:border-primary transition-all" />
        </div>
        <button type="submit" disabled={loading} className="px-4 py-2 rounded-lg bg-surface-container-high text-on-surface text-sm font-medium border border-outline hover:bg-surface-container transition-all disabled:opacity-50">
          {loading ? '...' : 'Consultar'}
        </button>
        <button type="button" onClick={filtrarTodo} disabled={loading} className="px-4 py-2 rounded-lg bg-surface-container-high text-on-surface text-sm font-medium border border-outline hover:bg-surface-container transition-all disabled:opacity-50">
          Filtrar Todo
        </button>
      </form>
      {error && <p className="text-error text-sm mb-4 py-2.5 px-4 bg-error/10 border border-error/30 rounded-md">{error}</p>}
      {loading && !data.length ? (
        <div className="flex items-center justify-center py-8">
          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <Table columns={columns} data={data} emptyMsg="No hay datos para el período seleccionado" />
      )}
    </Card>
  )
}
