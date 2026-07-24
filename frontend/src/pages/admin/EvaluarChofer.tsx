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

export default function EvaluarChofer() {
  const [choferId, setChoferId] = useState('')
  const [nota, setNota] = useState('')
  const [choferes, setChoferes] = useState<any[]>([])
  const [msg, setMsg] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    api.get('/choferes/listar').then((r) => setChoferes(r.data)).catch(() => {})
  }, [])

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setMsg(''); setError('')
    setLoading(true)
    try {
      const res = await api.post('/admin/evaluar-chofer', { chofer_id: Number(choferId), nota: Number(nota) })
      setMsg(`Evaluación registrada. ${res.data.aprobado ? 'Aprobado — Chofer activado para trabajar' : 'Reprobado (mínimo 73)'} (Nota: ${res.data.nota})`)
      setChoferId(''); setNota('')
    } catch (err: any) {
      const msg = err.response?.data?.error
      setError(typeof msg === 'string' ? msg : 'Error al evaluar')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card title="Evaluación Psicológica — Chofer">
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
          label="Nota (0-100)"
          type="number"
          value={nota}
          onChange={(e) => setNota(e.target.value)}
          required
          size="small"
          slotProps={{ htmlInput: { min: 0, max: 100 } }}
        />
        <Typography variant="caption" sx={{ color: 'text.secondary' }}>Nota mínima aprobatoria: 73</Typography>
        <Button type="submit" variant="contained" color="primary" disabled={loading} sx={{ py: 1.5, gap: 1 }}>
          {loading && <CircularProgress size={14} />}
          {loading ? 'REGISTRANDO...' : 'Registrar Evaluación'}
        </Button>
      </Box>
    </Card>
  )
}
