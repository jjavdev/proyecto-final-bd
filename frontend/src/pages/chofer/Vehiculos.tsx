import { useState, useEffect, FormEvent } from 'react'
import api from '../../services/api'
import Card from '../../components/Card'
import Table from '../../components/Table'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Alert from '@mui/material/Alert'
import CircularProgress from '@mui/material/CircularProgress'
import Chip from '@mui/material/Chip'

export default function Vehiculos() {
  const [vehiculos, setVehiculos] = useState<any[]>([])
  const [form, setForm] = useState({ placa: '', marca: '', modelo: '', anio: '', color: '' })
  const [msg, setMsg] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function load() {
    try {
      const r = await api.get('/choferes/vehiculos')
      setVehiculos(r.data)
    } catch {}
  }

  useEffect(() => { load() }, [])

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setMsg(''); setError('')
    setLoading(true)
    try {
      await api.post('/choferes/vehiculos', { ...form, anio: parseInt(form.anio) })
      setMsg('Vehículo registrado')
      setForm({ placa: '', marca: '', modelo: '', anio: '', color: '' })
      load()
    } catch (err: any) {
      const msg = err.response?.data?.error
      setError(typeof msg === 'string' ? msg : 'Error al registrar')
    } finally {
      setLoading(false)
    }
  }

  const columns = [
    { key: 'placa', label: 'Placa' },
    { key: 'marca', label: 'Marca' },
    { key: 'modelo', label: 'Modelo' },
    { key: 'anio', label: 'Año' },
    { key: 'color', label: 'Color' },
    { key: 'activo', label: 'Activo', render: (v: boolean) => v ? 'Sí' : 'No' },
    {
      key: 'revision_vigente', label: 'Revisión',
      render: (v: boolean, row: any) => {
        if (row.ultima_revision_fecha) {
          const fecha = new Date(row.ultima_revision_fecha).toLocaleDateString()
          const ok = row.ultima_revision_apta && v
          return <Chip label={ok ? `Vigente (${fecha})` : `Vencida (${fecha})`} color={ok ? 'primary' : 'error'} size="small" variant="outlined" />
        }
        return <Chip label="Sin revisión" size="small" variant="outlined" />
      },
    },
  ]

  return (
    <>
      <Card title="Registrar Vehículo">
        {msg && <Alert severity="success" sx={{ mb: 2, borderRadius: 1 }}>{msg}</Alert>}
        {error && <Alert severity="error" sx={{ mb: 2, borderRadius: 1 }}>{error}</Alert>}
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5, maxWidth: 500 }}
        >
          <TextField
            label="Placa"
            value={form.placa}
            onChange={(e) => setForm({ ...form, placa: e.target.value.toUpperCase() })}
            required
            size="small"
          />
          <TextField label="Marca" value={form.marca} onChange={(e) => setForm({ ...form, marca: e.target.value })} required size="small" />
          <TextField label="Modelo" value={form.modelo} onChange={(e) => setForm({ ...form, modelo: e.target.value })} required size="small" />
          <TextField label="Año" type="number" value={form.anio} onChange={(e) => setForm({ ...form, anio: e.target.value })} required size="small" slotProps={{ htmlInput: { min: 2000, max: 2030 } }} />
          <TextField
            label="Color"
            value={form.color}
            onChange={(e) => setForm({ ...form, color: e.target.value })}
            required
            size="small"
            sx={{ gridColumn: 'span 2' }}
          />
          <Button type="submit" variant="contained" color="primary" disabled={loading} sx={{ py: 1.5, gridColumn: 'span 2', gap: 1 }}>
            {loading && <CircularProgress size={14} />}
            {loading ? 'REGISTRANDO...' : 'Registrar'}
          </Button>
        </Box>
      </Card>
      <Card title="Mis Vehículos">
        <Table columns={columns} data={vehiculos} emptyMsg="No tienes vehículos registrados" />
      </Card>
    </>
  )
}
