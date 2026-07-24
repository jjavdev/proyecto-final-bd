import { useState, useEffect, FormEvent } from 'react'
import api from '../../services/api'
import Card from '../../components/Card'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'
import Button from '@mui/material/Button'
import Alert from '@mui/material/Alert'
import CircularProgress from '@mui/material/CircularProgress'
import Typography from '@mui/material/Typography'

export default function RevisarVehiculo() {
  const [vehiculoId, setVehiculoId] = useState('')
  const [calificacion, setCalificacion] = useState('')
  const [vehiculos, setVehiculos] = useState<any[]>([])
  const [msg, setMsg] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    api.get('/vehiculos').then((r) => setVehiculos(r.data)).catch(() => {})
  }, [])

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setMsg(''); setError('')
    setLoading(true)
    try {
      const res = await api.post('/admin/revisar-vehiculo', { vehiculo_id: Number(vehiculoId), calificacion: Number(calificacion) })
      setMsg(`Revisión registrada. ${res.data.apto ? 'Apto — Vehículo activado' : 'No apto (mínimo 65)'} (Calificación: ${res.data.calificacion})`)
      setVehiculoId(''); setCalificacion('')
    } catch (err: any) {
      const msg = err.response?.data?.error
      setError(typeof msg === 'string' ? msg : 'Error al revisar')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card title="Revisión Vehicular">
      {msg && <Alert severity="success" sx={{ mb: 2, borderRadius: 1 }}>{msg}</Alert>}
      {error && <Alert severity="error" sx={{ mb: 2, borderRadius: 1 }}>{error}</Alert>}
      <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, maxWidth: 400 }}>
        <TextField
          select
          label="Seleccionar Vehículo"
          value={vehiculoId}
          onChange={(e) => setVehiculoId(e.target.value)}
          required
          size="small"
        >
          <MenuItem value="">Seleccionar Vehículo</MenuItem>
          {vehiculos.filter((v: any) => !v.activo).map((v: any) => (
            <MenuItem key={v.id} value={v.id}>{v.placa} — {v.marca} {v.modelo} ({v.chofer_nombre} {v.chofer_apellido})</MenuItem>
          ))}
        </TextField>
        <TextField
          label="Calificación (0-100)"
          type="number"
          value={calificacion}
          onChange={(e) => setCalificacion(e.target.value)}
          required
          size="small"
          slotProps={{ htmlInput: { min: 0, max: 100 } }}
        />
        <Typography variant="caption" sx={{ color: 'text.secondary' }}>Calificación mínima para apto: 65</Typography>
        <Button type="submit" variant="contained" color="primary" disabled={loading} sx={{ py: 1.5, gap: 1 }}>
          {loading && <CircularProgress size={14} />}
          {loading ? 'REGISTRANDO...' : 'Registrar Revisión'}
        </Button>
      </Box>
    </Card>
  )
}
