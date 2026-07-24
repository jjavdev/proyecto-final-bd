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

export default function RecargarSaldo() {
  const [form, setForm] = useState({ monto: '', banco_id: '', nro_referencia: '' })
  const [bancos, setBancos] = useState<any[]>([])
  const [referencia, setReferencia] = useState<{ promedio: number; sugerido: number } | null>(null)
  const [msg, setMsg] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    api.get('/bancos').then((r) => setBancos(r.data)).catch(() => {})
    api.get('/clientes/referencia-recarga').then((r) => setReferencia(r.data)).catch(() => {})
  }, [])

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setMsg(''); setError('')
    setLoading(true)
    try {
      await api.post('/clientes/recargar', { ...form, monto: parseFloat(form.monto), banco_id: parseInt(form.banco_id) })
      setMsg('Saldo recargado exitosamente')
      setForm({ monto: '', banco_id: '', nro_referencia: '' })
    } catch (err: any) {
      const msg = err.response?.data?.error
      setError(typeof msg === 'string' ? msg : 'Error al recargar')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card title="Recargar Saldo">
      {msg && <Alert severity="success" sx={{ mb: 2, borderRadius: 1 }}>{msg}</Alert>}
      {error && <Alert severity="error" sx={{ mb: 2, borderRadius: 1 }}>{error}</Alert>}
      <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2, maxWidth: 400 }}>
        <TextField
          label="Monto ($)"
          type="number"
          value={form.monto}
          onChange={(e) => setForm({ ...form, monto: e.target.value })}
          required
          slotProps={{ htmlInput: { step: '0.01', min: '0.01', max: '99999.99' } }}
          size="small"
        />
        {referencia && (
          <Typography variant="caption" sx={{ color: 'text.secondary', mt: -0.5 }}>
            Costo promedio por viaje: <Box component="span" sx={{ color: 'primary.main', fontWeight: 600 }}>${referencia.promedio.toFixed(2)}</Box>
            {' · '}Sugerido: <Box component="span" sx={{ color: 'primary.main', fontWeight: 600 }}>${referencia.sugerido.toFixed(2)}</Box>
          </Typography>
        )}
        <TextField
          select
          label="Banco"
          value={form.banco_id}
          onChange={(e) => setForm({ ...form, banco_id: e.target.value })}
          required
          size="small"
        >
          {bancos.map((b) => <MenuItem key={b.id} value={b.id}>{b.nombre}</MenuItem>)}
        </TextField>
        <TextField
          label="Nro. Referencia"
          value={form.nro_referencia}
          onChange={(e) => setForm({ ...form, nro_referencia: e.target.value.replace(/\D/g, '').slice(0, 4) })}
          required
          size="small"
          slotProps={{ htmlInput: { maxLength: 4 } }}
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={loading}
          sx={{ py: 1.5, gap: 1 }}
        >
          {loading && <CircularProgress size={14} />}
          {loading ? 'RECARGANDO...' : 'Recargar'}
        </Button>
      </Box>
    </Card>
  )
}
