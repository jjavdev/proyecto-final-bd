import { useState, FormEvent } from 'react'
import api from '../../services/api'
import Card from '../../components/Card'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Alert from '@mui/material/Alert'
import CircularProgress from '@mui/material/CircularProgress'
import Typography from '@mui/material/Typography'

export default function Contactos() {
  const [contactos, setContactos] = useState([{ nombre: '', telefono: '', parentesco: '' }])
  const [msg, setMsg] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function addContacto() {
    if (contactos.length >= 5) return
    setContactos([...contactos, { nombre: '', telefono: '', parentesco: '' }])
  }

  function update(i: number, field: string, value: string) {
    const c = [...contactos]; (c[i] as any)[field] = value; setContactos(c)
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setMsg(''); setError('')
    setLoading(true)
    try {
      await api.post('/choferes/contactos', { contactos })
      setMsg('Contactos guardados exitosamente')
    } catch (err: any) {
      const msg = err.response?.data?.error
      setError(typeof msg === 'string' ? msg : 'Error al guardar')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card title="Contactos de Emergencia (mínimo 2)">
      {msg && <Alert severity="success" sx={{ mb: 2, borderRadius: 1 }}>{msg}</Alert>}
      {error && <Alert severity="error" sx={{ mb: 2, borderRadius: 1 }}>{error}</Alert>}
      <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, maxWidth: 600 }}>
        {contactos.map((c, i) => (
          <Box key={i} sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <Typography variant="body2" sx={{ fontWeight: 700, color: 'text.secondary', minWidth: 20 }}>
              {i + 1}.
            </Typography>
            <TextField placeholder="Nombre" value={c.nombre} onChange={(e) => update(i, 'nombre', e.target.value)} required size="small" sx={{ flex: 1 }} />
            <TextField placeholder="Teléfono" value={c.telefono} onChange={(e) => update(i, 'telefono', e.target.value.replace(/\D/g, ''))} required size="small" sx={{ flex: 1 }} />
            <TextField placeholder="Parentesco" value={c.parentesco} onChange={(e) => update(i, 'parentesco', e.target.value)} required size="small" sx={{ flex: 1 }} />
          </Box>
        ))}
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button variant="outlined" onClick={addContacto} disabled={contactos.length >= 5}>
            + Agregar Contacto
          </Button>
          <Button type="submit" variant="contained" color="primary" disabled={loading} sx={{ gap: 1 }}>
            {loading && <CircularProgress size={14} />}
            {loading ? 'GUARDANDO...' : 'Guardar Contactos'}
          </Button>
        </Box>
      </Box>
    </Card>
  )
}
