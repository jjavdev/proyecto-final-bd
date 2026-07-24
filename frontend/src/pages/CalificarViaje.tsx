import { useState, useEffect } from 'react'
import api from '../services/api'
import Card from '../components/Card'
import StarRating from '../components/StarRating'
import { useAuth } from '../context/AuthContext'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Alert from '@mui/material/Alert'
import CircularProgress from '@mui/material/CircularProgress'
import Typography from '@mui/material/Typography'
import Paper from '@mui/material/Paper'

export default function CalificarViaje() {
  const { usuario } = useAuth()
  const [pendientes, setPendientes] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [enviando, setEnviando] = useState<number | null>(null)
  const [puntajes, setPuntajes] = useState<Record<number, number>>({})
  const [comentarios, setComentarios] = useState<Record<number, string>>({})
  const [msg, setMsg] = useState('')
  const [error, setError] = useState('')

  async function load() {
    setLoading(true)
    try {
      const r = await api.get('/calificaciones/pendientes')
      setPendientes(r.data)
    } catch {} finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])

  async function handleCalificar(id: number) {
    const puntuacion = puntajes[id]
    if (!puntuacion) {
      setError('Selecciona una puntuación')
      return
    }
    setEnviando(id)
    setMsg(''); setError('')
    try {
      await api.post('/calificaciones', { traslado_id: id, puntuacion, comentario: comentarios[id] || undefined })
      setMsg('Calificación enviada')
      setPendientes(pendientes.filter((p) => p.id !== id))
    } catch (err: any) {
      const msg = err.response?.data?.error
      setError(typeof msg === 'string' ? msg : 'Error al calificar')
    } finally {
      setEnviando(null)
    }
  }

  const esCliente = usuario?.rol === 'CLIENTE'
  const nombreCampo = esCliente ? 'chofer_nombre' : 'cliente_nombre'
  const apellidoCampo = esCliente ? 'chofer_apellido' : 'cliente_apellido'

  return (
    <Card title={esCliente ? 'Calificar a mi Chofer' : 'Calificar al Cliente'}>
      {msg && <Alert severity="success" sx={{ mb: 2, borderRadius: 1 }}>{msg}</Alert>}
      {error && <Alert severity="error" sx={{ mb: 2, borderRadius: 1 }}>{error}</Alert>}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      ) : pendientes.length === 0 ? (
        <Typography variant="body2" sx={{ textAlign: 'center', py: 4, color: 'text.secondary' }}>
          No tienes viajes pendientes por calificar
        </Typography>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {pendientes.map((v: any) => (
            <Paper key={v.id} variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {v.origen} → {v.destino}
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary', opacity: 0.6 }}>
                    {v[nombreCampo]} {v[apellidoCampo]} · ${Number(v.costo).toFixed(2)} · {new Date(v.fecha).toLocaleDateString()}
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
                <StarRating value={puntajes[v.id] || 0} onChange={(val) => setPuntajes({ ...puntajes, [v.id]: val })} />
                <Typography variant="caption" sx={{ color: 'text.secondary', opacity: 0.5 }}>
                  {puntajes[v.id] ? `${puntajes[v.id]}/5` : ''}
                </Typography>
              </Box>
              <TextField
                placeholder="Comentario (opcional)"
                value={comentarios[v.id] || ''}
                onChange={(e) => setComentarios({ ...comentarios, [v.id]: e.target.value })}
                size="small"
                fullWidth
                sx={{ mb: 1.5 }}
                slotProps={{ htmlInput: { maxLength: 200 } }}
              />
              <Button
                onClick={() => handleCalificar(v.id)}
                disabled={enviando === v.id}
                variant="contained"
                color="primary"
                size="small"
              >
                {enviando === v.id ? 'ENVIANDO...' : 'Enviar Calificación'}
              </Button>
            </Paper>
          ))}
        </Box>
      )}
    </Card>
  )
}
