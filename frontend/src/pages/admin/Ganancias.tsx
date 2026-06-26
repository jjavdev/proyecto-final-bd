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
      const r = await api.get('/reportes/ganancias', { params: { inicio, fin } })
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
      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 12, marginBottom: 20, alignItems: 'end' }}>
        <div>
          <label style={{ fontSize: 12, display: 'block', marginBottom: 4 }}>Fecha Inicio</label>
          <input type="date" value={inicio} onChange={(e) => setInicio(e.target.value)} required style={s} />
        </div>
        <div>
          <label style={{ fontSize: 12, display: 'block', marginBottom: 4 }}>Fecha Fin</label>
          <input type="date" value={fin} onChange={(e) => setFin(e.target.value)} required style={s} />
        </div>
        <button type="submit" style={btn} disabled={loading}>Consultar</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {loading ? <p>Cargando...</p> : <Table columns={columns} data={data} emptyMsg="No hay datos para el período seleccionado" />}
    </Card>
  )
}

const s: React.CSSProperties = { padding: '10px 12px', border: '1px solid #ddd', borderRadius: 6, fontSize: 14 }
const btn: React.CSSProperties = { padding: '10px 12px', border: 'none', borderRadius: 6, background: '#1a1a2e', color: '#fff', fontSize: 14, cursor: 'pointer' }
