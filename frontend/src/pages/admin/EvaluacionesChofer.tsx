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
    { key: 'aprobado', label: 'Aprobado', render: (v: boolean) => v ? 'Si' : 'No' },
    { key: 'fecha', label: 'Fecha', render: (v: string) => new Date(v).toLocaleDateString() },
    { key: 'evaluador_nombre', label: 'Evaluador' },
  ]

  return (
    <Card title="Historial de Evaluaciones del Chofer">
      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 12, marginBottom: 20, alignItems: 'end' }}>
        <div>
          <label style={{ fontSize: 12, display: 'block' }}>ID del Chofer</label>
          <input type="number" value={choferId} onChange={(e) => setChoferId(e.target.value)} required style={s} />
        </div>
        <button type="submit" style={btn} disabled={loading}>{loading ? '...' : 'Consultar'}</button>
      </form>
      <Table columns={columns} data={data} emptyMsg="No hay evaluaciones registradas" />
    </Card>
  )
}

const s: React.CSSProperties = { padding: '10px 12px', border: '1px solid #ddd', borderRadius: 6, fontSize: 14 }
const btn: React.CSSProperties = { padding: '10px 12px', border: 'none', borderRadius: 6, background: '#1a1a2e', color: '#fff', fontSize: 14, cursor: 'pointer' }
