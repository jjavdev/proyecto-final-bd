import { useState } from 'react'
import api from '../../services/api'
import Card from '../../components/Card'
import Table from '../../components/Table'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Alert from '@mui/material/Alert'
import CircularProgress from '@mui/material/CircularProgress'

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
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{ display: 'flex', gap: 1.5, mb: 2.5, alignItems: 'flex-end', flexWrap: 'wrap' }}
      >
        <TextField
          label="Fecha Inicio"
          type="date"
          value={inicio}
          onChange={(e) => setInicio(e.target.value)}
          size="small"
          slotProps={{ inputLabel: { shrink: true } }}
        />
        <TextField
          label="Fecha Fin"
          type="date"
          value={fin}
          onChange={(e) => setFin(e.target.value)}
          size="small"
          slotProps={{ inputLabel: { shrink: true } }}
        />
        <Button type="submit" variant="outlined" disabled={loading}>
          {loading ? '...' : 'Consultar'}
        </Button>
        <Button type="button" variant="outlined" onClick={filtrarTodo} disabled={loading}>
          Filtrar Todo
        </Button>
      </Box>
      {error && <Alert severity="error" sx={{ mb: 2, borderRadius: 1 }}>{error}</Alert>}
      {loading && !data.length ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress size={24} />
        </Box>
      ) : (
        <Table columns={columns} data={data} emptyMsg="No hay datos para el período seleccionado" />
      )}
    </Card>
  )
}
