import { useState } from 'react'
import api from '../../services/api'
import Card from '../../components/Card'
import Table from '../../components/Table'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'

export default function RevisionesVehiculo() {
  const [vehiculoId, setVehiculoId] = useState('')
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      const r = await api.get(`/vehiculos/${vehiculoId}/revisiones`)
      setData(r.data)
    } catch {} finally { setLoading(false) }
  }

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'calificacion', label: 'Calificación' },
    { key: 'apto', label: 'Apto', render: (v: boolean) => v ? 'Sí' : 'No' },
    { key: 'fecha', label: 'Fecha', render: (v: string) => new Date(v).toLocaleDateString() },
    { key: 'evaluador_nombre', label: 'Evaluador' },
  ]

  return (
    <Card title="Historial de Revisiones del Vehículo">
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{ display: 'flex', gap: 1.5, mb: 2.5, alignItems: 'flex-end', flexWrap: 'wrap' }}
      >
        <TextField
          label="ID del Vehículo"
          type="number"
          value={vehiculoId}
          onChange={(e) => setVehiculoId(e.target.value)}
          required
          size="small"
        />
        <Button type="submit" variant="outlined" disabled={loading}>
          {loading ? '...' : 'Consultar'}
        </Button>
      </Box>
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress size={24} />
        </Box>
      ) : (
        <Table columns={columns} data={data} emptyMsg="No hay revisiones registradas" />
      )}
    </Card>
  )
}
