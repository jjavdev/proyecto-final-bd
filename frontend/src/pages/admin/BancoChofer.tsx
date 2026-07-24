import { useState, useEffect, FormEvent } from 'react'
import api from '../../services/api'
import Card from '../../components/Card'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'
import Button from '@mui/material/Button'
import Alert from '@mui/material/Alert'
import CircularProgress from '@mui/material/CircularProgress'

export default function BancoChofer() {
  const [choferId, setChoferId] = useState('')
  const [bancoId, setBancoId] = useState('')
  const [nroCuenta, setNroCuenta] = useState('')
  const [choferes, setChoferes] = useState<any[]>([])
  const [bancos, setBancos] = useState<any[]>([])
  const [msg, setMsg] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    api.get('/choferes/listar').then((r) => setChoferes(r.data)).catch(() => {})
    api.get('/bancos').then((r) => setBancos(r.data)).catch(() => {})
  }, [])

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setMsg(''); setError('')
    setLoading(true)
    try {
      await api.put(`/admin/choferes/${choferId}/banco`, {
        banco_id: Number(bancoId),
        nro_cuenta: nroCuenta,
      })
      setMsg('Banco actualizado para el chofer')
      setChoferId(''); setBancoId(''); setNroCuenta('')
    } catch (err: any) {
      const msg = err.response?.data?.error
      setError(typeof msg === 'string' ? msg : 'Error al actualizar')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card title="Asignar Banco a Chofer">
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
            <MenuItem key={c.id} value={c.id}>{c.nombre} {c.apellido} — {c.cedula}</MenuItem>
          ))}
        </TextField>
        <TextField
          select
          label="Seleccionar Banco"
          value={bancoId}
          onChange={(e) => setBancoId(e.target.value)}
          required
          size="small"
        >
          <MenuItem value="">Seleccionar Banco</MenuItem>
          {bancos.map((b) => <MenuItem key={b.id} value={b.id}>{b.nombre}</MenuItem>)}
        </TextField>
        <TextField
          label="Número de Cuenta (solo dígitos)"
          value={nroCuenta}
          onChange={(e) => setNroCuenta(e.target.value.replace(/\D/g, ''))}
          required
          size="small"
          slotProps={{ htmlInput: { maxLength: 30 } }}
        />
        <Button type="submit" variant="contained" color="primary" disabled={loading} sx={{ py: 1.5, gap: 1 }}>
          {loading && <CircularProgress size={14} />}
          {loading ? 'GUARDANDO...' : 'Guardar'}
        </Button>
      </Box>
    </Card>
  )
}
