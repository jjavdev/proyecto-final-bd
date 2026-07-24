import { useState } from 'react'
import api from '../../services/api'
import Card from '../../components/Card'
import Table from '../../components/Table'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'

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
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{ display: 'flex', gap: 1.5, mb: 2.5, alignItems: 'flex-end', flexWrap: 'wrap' }}
      >
        <TextField
          label="Inicio"
          type="date"
          value={inicio}
          onChange={(e) => setInicio(e.target.value)}
          size="small"
          slotProps={{ inputLabel: { shrink: true } }}
        />
        <TextField
          label="Fin"
          type="date"
          value={fin}
          onChange={(e) => setFin(e.target.value)}
          size="small"
          slotProps={{ inputLabel: { shrink: true } }}
        />
        <TextField
          select
          label="Estado"
          value={estado}
          onChange={(e) => setEstado(e.target.value)}
          size="small"
          sx={{ minWidth: 130 }}
        >
          <MenuItem value="">Todos</MenuItem>
          <MenuItem value="pendiente">Pendiente</MenuItem>
          <MenuItem value="completado">Completado</MenuItem>
          <MenuItem value="cancelado">Cancelado</MenuItem>
        </TextField>
        <Button type="submit" variant="outlined" disabled={loading} sx={{ py: 1 }}>
          {loading ? '...' : 'Filtrar'}
        </Button>
      </Box>
      {loading && !viajes.length ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress size={24} />
        </Box>
      ) : (
        <Table columns={columns} data={viajes} emptyMsg="No has realizado viajes aún" />
      )}
    </Card>
  )
}
