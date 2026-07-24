import { useState } from 'react'
import api from '../../services/api'
import Card from '../../components/Card'
import Table from '../../components/Table'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'

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
          <Button onClick={() => completar(row.id)} disabled={isLoading} variant="contained" color="primary" size="small">
            {isLoading ? '...' : 'Completar'}
          </Button>
        ) : row.estado === 'completado' ? (
          <Typography variant="caption" sx={{ fontStyle: 'italic', color: 'text.secondary' }}>
            Completado
          </Typography>
        ) : null
      },
    },
  ]

  return (
    <Card title="Mis Viajes">
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
      <Table columns={columns} data={viajes} emptyMsg="No hay viajes para los filtros seleccionados" />
    </Card>
  )
}
