import { useState } from 'react'
import api from '../../services/api'
import Card from '../../components/Card'
import Table from '../../components/Table'

export default function EvaluacionesChofer() {
  const [choferId, setChoferId] = useState('')
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      const r = await api.get(`/choferes/${choferId}/evaluaciones`)
      setData(r.data)
    } catch {} finally { setLoading(false) }
  }

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'nota', label: 'Nota' },
    { key: 'aprobado', label: 'Aprobado', render: (v: boolean) => v ? 'Sí' : 'No' },
    { key: 'fecha', label: 'Fecha', render: (v: string) => new Date(v).toLocaleDateString() },
    { key: 'evaluador_nombre', label: 'Evaluador' },
  ]

  return (
    <Card title="Historial de Evaluaciones del Chofer">
      <form onSubmit={handleSubmit} className="flex gap-3 mb-5 items-end flex-wrap">
        <div>
          <label className="text-xs text-on-surface-variant block mb-1">ID del Chofer</label>
          <input type="number" value={choferId} onChange={(e) => setChoferId(e.target.value)} required className="px-3 py-2 bg-surface border border-outline rounded-lg text-on-surface text-sm outline-none focus:border-primary transition-all" />
        </div>
        <button type="submit" disabled={loading} className="px-4 py-2 rounded-lg bg-surface-container-high text-on-surface text-sm font-medium border border-outline hover:bg-surface-container transition-all disabled:opacity-50">
          {loading ? '...' : 'Consultar'}
        </button>
      </form>
      {loading ? (
        <div className="flex items-center justify-center py-8">
          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <Table columns={columns} data={data} emptyMsg="No hay evaluaciones registradas" />
      )}
    </Card>
  )
}
