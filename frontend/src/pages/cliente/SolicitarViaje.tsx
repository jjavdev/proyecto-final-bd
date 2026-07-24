import { useState, FormEvent } from 'react'
import api from '../../services/api'
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Alert from '@mui/material/Alert'
import CircularProgress from '@mui/material/CircularProgress'
import Grid from '@mui/material/Grid2'

const DISTANCIA_MAX = 999.9

export default function SolicitarViaje() {
  const [form, setForm] = useState({ origen: '', destino: '', distancia_km: '' })
  const [msg, setMsg] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [viaje, setViaje] = useState<any>(null)

  const costoEstimado = form.distancia_km
    ? (parseFloat(form.distancia_km) * 2.5).toFixed(2)
    : '—'

  function validarForm(): string | null {
    if (form.origen.trim().toLowerCase() === form.destino.trim().toLowerCase()) {
      return 'El origen y destino no pueden ser iguales'
    }
    if (parseFloat(form.distancia_km) > DISTANCIA_MAX) {
      return `La distancia máxima permitida es ${DISTANCIA_MAX} km`
    }
    return null
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setMsg(''); setError(''); setViaje(null)

    const errorMsg = validarForm()
    if (errorMsg) {
      setError(errorMsg)
      return
    }

    setLoading(true)
    try {
      const res = await api.post('/traslados', { ...form, distancia_km: parseFloat(form.distancia_km) })
      setViaje(res.data)
      setMsg('¡Viaje solicitado exitosamente!')
      setForm({ origen: '', destino: '', distancia_km: '' })
    } catch (err: any) {
      const msg = err.response?.data?.error
      setError(typeof msg === 'string' ? msg : 'Error al solicitar viaje')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
      <Box sx={{ width: '100%', maxWidth: 900 }}>
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
            Solicitar Viaje
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Completa los datos para solicitar tu traslado
          </Typography>
        </Box>

        <Grid container spacing={2.5}>
          <Grid size={{ xs: 12, md: 7 }}>
            <Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
              <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <TextField
                  label="Origen"
                  placeholder="¿Dónde te recogemos?"
                  value={form.origen}
                  onChange={(e) => setForm({ ...form, origen: e.target.value })}
                  required
                  fullWidth
                  size="small"
                  slotProps={{ htmlInput: { maxLength: 200 } }}
                />

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box sx={{ flex: 1, height: 1, bgcolor: 'divider', opacity: 0.3 }} />
                  <Typography variant="caption" sx={{ color: 'text.secondary', opacity: 0.4 }}>↓</Typography>
                  <Box sx={{ flex: 1, height: 1, bgcolor: 'divider', opacity: 0.3 }} />
                </Box>

                <TextField
                  label="Destino"
                  placeholder="¿A dónde vas?"
                  value={form.destino}
                  onChange={(e) => setForm({ ...form, destino: e.target.value })}
                  required
                  fullWidth
                  size="small"
                  slotProps={{ htmlInput: { maxLength: 200 } }}
                />

                <TextField
                  label="Distancia (km)"
                  type="number"
                  placeholder="0.0"
                  value={form.distancia_km}
                  onChange={(e) => setForm({ ...form, distancia_km: e.target.value })}
                  required
                  fullWidth
                  size="small"
                  slotProps={{ htmlInput: { step: '0.1', min: '0.1', max: DISTANCIA_MAX } }}
                />

                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={loading}
                  sx={{ py: 1.5, gap: 1 }}
                >
                  {loading && <CircularProgress size={14} />}
                  {loading ? 'SOLICITANDO...' : 'Solicitar Viaje'}
                </Button>
              </Box>
            </Paper>
          </Grid>

          <Grid size={{ xs: 12, md: 5 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 2 }}>
                <Typography variant="overline" sx={{ color: 'text.secondary', display: 'block', mb: 0.25 }}>
                  Costo estimado
                </Typography>
                <Typography variant="h4" sx={{ fontFamily: 'Sora, sans-serif', fontWeight: 700, color: 'primary.main' }}>
                  {costoEstimado === '—' ? (
                    <Box component="span" sx={{ color: 'text.secondary', opacity: 0.5 }}>—</Box>
                  ) : (
                    <>${costoEstimado}</>
                  )}
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary', opacity: 0.6, display: 'block', mt: 0.25 }}>
                  Tarifa: $2.50/km
                </Typography>
              </Paper>

              <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 2 }}>
                <Typography variant="overline" sx={{ color: 'text.secondary', display: 'block', mb: 1 }}>
                  Ruta
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: 'primary.main', flexShrink: 0 }} />
                    <Typography variant="body2" sx={{ fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {form.origen || <Box component="span" sx={{ fontStyle: 'italic', opacity: 0.4 }}>Origen</Box>}
                    </Typography>
                  </Box>
                  <Box sx={{ width: 1, height: 16, bgcolor: 'primary.main', opacity: 0.3, ml: '4.5px' }} />
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: 'error.main', flexShrink: 0 }} />
                    <Typography variant="body2" sx={{ fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {form.destino || <Box component="span" sx={{ fontStyle: 'italic', opacity: 0.4 }}>Destino</Box>}
                    </Typography>
                  </Box>
                </Box>
                <Typography variant="caption" sx={{ color: 'text.secondary', opacity: 0.6, display: 'block', mt: 0.5 }}>
                  {form.distancia_km ? `${form.distancia_km} km` : '— km'}
                </Typography>
              </Paper>
            </Box>
          </Grid>
        </Grid>

        {msg && (
          <Alert severity="success" sx={{ mt: 2, borderRadius: 2 }}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body1" sx={{ fontWeight: 600, mb: 1.5, color: 'success.main' }}>{msg}</Typography>
              {viaje && (
                <Grid container spacing={1.5}>
                  <Grid size={{ xs: 4 }}>
                    <Paper variant="outlined" sx={{ p: 1.5, borderRadius: 1, bgcolor: 'action.hover' }}>
                      <Typography variant="overline" sx={{ color: 'text.secondary', display: 'block' }}>Costo</Typography>
                      <Typography variant="h6" sx={{ fontFamily: 'Sora, sans-serif', fontWeight: 700, color: 'primary.main' }}>
                        ${viaje.costo}
                      </Typography>
                    </Paper>
                  </Grid>
                  <Grid size={{ xs: 4 }}>
                    <Paper variant="outlined" sx={{ p: 1.5, borderRadius: 1, bgcolor: 'action.hover' }}>
                      <Typography variant="overline" sx={{ color: 'text.secondary', display: 'block' }}>Chofer</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {viaje.chofer.nombre} {viaje.chofer.apellido}
                      </Typography>
                    </Paper>
                  </Grid>
                  <Grid size={{ xs: 4 }}>
                    <Paper variant="outlined" sx={{ p: 1.5, borderRadius: 1, bgcolor: 'action.hover' }}>
                      <Typography variant="overline" sx={{ color: 'text.secondary', display: 'block' }}>Vehículo</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {viaje.vehiculo.marca} {viaje.vehiculo.modelo}
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'text.secondary', opacity: 0.6 }}>
                        {viaje.vehiculo.placa}
                      </Typography>
                    </Paper>
                  </Grid>
                </Grid>
              )}
            </Box>
          </Alert>
        )}

        {error && (
          <Alert severity="error" sx={{ mt: 2, borderRadius: 2 }}>{error}</Alert>
        )}
      </Box>
    </Box>
  )
}
