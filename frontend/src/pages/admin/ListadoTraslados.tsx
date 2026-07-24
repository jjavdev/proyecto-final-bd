import { useState } from 'react'
import api from '../../services/api'
import Card from '../../components/Card'
import Table from '../../components/Table'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import Typography from '@mui/material/Typography'

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
          <Box sx={{ display: 'flex', gap: 0.5 }}>
            <Button onClick={() => completar(row.id)} disabled={isLoading} variant="contained" color="primary" size="small" sx={{ minWidth: 36 }}>
              {isLoading ? '...' : 'OK'}
            </Button>
            <Button onClick={() => cancelar(row.id)} disabled={isLoading} variant="contained" color="error" size="small" sx={{ minWidth: 36 }}>
              {isLoading ? '...' : 'X'}
            </Button>
          </Box>
        ) : (
          <Typography variant="body2" sx={{ fontWeight: 700, color: row.estado === 'completado' ? 'primary.main' : 'error.main' }}>
            {row.estado === 'completado' ? 'Completado' : 'Cancelado'}
          </Typography>
        )
      },
    },
  ]

  return (
    <Card title="Listado de Traslados">
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{ display: 'flex', gap: 1.5, mb: 2.5, alignItems: 'flex-end', flexWrap: 'wrap' }}
      >
        <TextField label="Inicio" type="date" value={inicio} onChange={(e) => setInicio(e.target.value)} size="small" slotProps={{ inputLabel: { shrink: true } }} />
        <TextField label="Fin" type="date" value={fin} onChange={(e) => setFin(e.target.value)} size="small" slotProps={{ inputLabel: { shrink: true } }} />
        <TextField select label="Estado" value={estado} onChange={(e) => setEstado(e.target.value)} size="small" sx={{ minWidth: 130 }}>
          <MenuItem value="">Todos</MenuItem>
          <MenuItem value="pendiente">Pendiente</MenuItem>
          <MenuItem value="completado">Completado</MenuItem>
          <MenuItem value="cancelado">Cancelado</MenuItem>
        </TextField>
        <TextField select label="Pagado" value={pagado} onChange={(e) => setPagado(e.target.value)} size="small" sx={{ minWidth: 100 }}>
          <MenuItem value="">Todos</MenuItem>
          <MenuItem value="true">Sí</MenuItem>
          <MenuItem value="false">No</MenuItem>
        </TextField>
        <Button type="submit" variant="outlined" disabled={loading}>{loading ? '...' : 'Filtrar'}</Button>
        <Button type="button" variant="outlined" onClick={filtrarTodo} disabled={loading}>Filtrar Todo</Button>
      </Box>
      {loading && !data.length ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}><CircularProgress size={24} /></Box>
      ) : (
        <Table columns={columns} data={data} emptyMsg="No hay traslados para los filtros seleccionados" />
      )}
    </Card>
  )
}
