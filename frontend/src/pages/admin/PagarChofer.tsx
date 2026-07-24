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

export default function PagarChofer() {
  const [choferId, setChoferId] = useState('')
  const [monto, setMonto] = useState('')
  const [nroReferencia, setNroReferencia] = useState('')
  const [choferes, setChoferes] = useState<any[]>([])
  const [msg, setMsg] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    api.get('/choferes/listar').then((r) => setChoferes(r.data)).catch(() => {})
  }, [])

  const seleccionado = choferes.find((c: any) => c.id === Number(choferId))

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setMsg(''); setError('')

    const montoNum = Math.round(Number(monto) * 100) / 100
    const pendiente = seleccionado ? Math.round(Number(seleccionado.saldo_pendiente) * 100) / 100 : 0

    if (montoNum < pendiente) {
      setError(`El monto ($${montoNum.toFixed(2)}) es menor al saldo pendiente ($${pendiente.toFixed(2)})`)
      return
    }
    if (montoNum > pendiente) {
      setError(`El monto ($${montoNum.toFixed(2)}) excede el saldo pendiente ($${pendiente.toFixed(2)})`)
      return
    }

    setLoading(true)
    try {
      await api.post('/admin/pagar-chofer', { chofer_id: Number(choferId), monto: montoNum, nro_referencia: nroReferencia })
      setMsg('Pago registrado exitosamente')
      setChoferId(''); setMonto(''); setNroReferencia('')
      api.get('/choferes/listar').then((r) => setChoferes(r.data)).catch(() => {})
    } catch (err: any) {
      const msg = err.response?.data?.error
      setError(typeof msg === 'string' ? msg : 'Error al registrar pago')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card title="Pagar a Chofer">
      {msg && <Alert severity="success" sx={{ mb: 2, borderRadius: 1 }}>{msg}</Alert>}
      {error && <Alert severity="error" sx={{ mb: 2, borderRadius: 1 }}>{error}</Alert>}
      <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, maxWidth: 400 }}>
        <TextField
          select
          label="Seleccionar Chofer"
          value={choferId}
          onChange={(e) => setChoferId(e.target.value)}
          required
          size="small"
        >
          <MenuItem value="">Seleccionar Chofer</MenuItem>
          {choferes.map((c: any) => (
            <MenuItem key={c.id} value={c.id}>{c.nombre} {c.apellido} — Saldo pendiente: ${Number(c.saldo_pendiente).toFixed(2)}</MenuItem>
          ))}
        </TextField>
        {seleccionado && (
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            Banco: {seleccionado.banco || 'N/A'} | Cuenta: {seleccionado.nro_cuenta || 'N/A'} | Saldo pendiente: ${Number(seleccionado.saldo_pendiente).toFixed(2)}
          </Typography>
        )}
        <TextField
          label="Monto a pagar ($)"
          type="number"
          value={monto}
          onChange={(e) => setMonto(e.target.value)}
          required
          size="small"
          slotProps={{ htmlInput: { step: '0.01', min: '0.01', max: '999999.99' } }}
        />
        <TextField
          label="Nro. Referencia (4 dígitos)"
          value={nroReferencia}
          onChange={(e) => setNroReferencia(e.target.value.replace(/\D/g, '').slice(0, 4))}
          required
          size="small"
          slotProps={{ htmlInput: { maxLength: 4 } }}
        />
        <Button type="submit" variant="contained" color="primary" disabled={loading} sx={{ py: 1.5, gap: 1 }}>
          {loading && <CircularProgress size={14} />}
          {loading ? 'REGISTRANDO...' : 'Registrar Pago'}
        </Button>
      </Box>
    </Card>
  )
}
