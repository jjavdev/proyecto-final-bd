import { useState, useEffect, FormEvent } from 'react'
import api from '../../services/api'
import Card from '../../components/Card'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'
import Button from '@mui/material/Button'
import Alert from '@mui/material/Alert'
import CircularProgress from '@mui/material/CircularProgress'

export default function DatosBancarios() {
  const [bancos, setBancos] = useState<any[]>([])
  const [form, setForm] = useState({ banco_id: '', nro_cuenta: '' })
  const [msg, setMsg] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    api.get('/bancos').then((r) => setBancos(r.data)).catch(() => {})
  }, [])

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setMsg(''); setError('')
    setLoading(true)
    try {
      await api.put('/choferes/banco', { banco_id: parseInt(form.banco_id), nro_cuenta: form.nro_cuenta })
      setMsg('Datos bancarios actualizados')
    } catch (err: any) {
      const msg = err.response?.data?.error
      setError(typeof msg === 'string' ? msg : 'Error al actualizar')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card title="Datos Bancarios">
      {msg && <Alert severity="success" sx={{ mb: 2, borderRadius: 1 }}>{msg}</Alert>}
      {error && <Alert severity="error" sx={{ mb: 2, borderRadius: 1 }}>{error}</Alert>}
      <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, maxWidth: 400 }}>
        <TextField
          select
          label="Banco"
          value={form.banco_id}
          onChange={(e) => setForm({ ...form, banco_id: e.target.value })}
          required
          size="small"
        >
          <MenuItem value="">Seleccionar banco</MenuItem>
          {bancos.map((b) => <MenuItem key={b.id} value={b.id}>{b.nombre}</MenuItem>)}
        </TextField>
        <TextField
          label="Número de Cuenta"
          value={form.nro_cuenta}
          onChange={(e) => setForm({ ...form, nro_cuenta: e.target.value.replace(/\D/g, '') })}
          required
          size="small"
          slotProps={{ htmlInput: { maxLength: 30 } }}
        />
        <Button type="submit" variant="contained" color="primary" disabled={loading} sx={{ py: 1.5, gap: 1 }}>
          {loading && <CircularProgress size={14} />}
          {loading ? 'ACTUALIZANDO...' : 'Actualizar'}
        </Button>
      </Box>
    </Card>
  )
}
