import { useState, useEffect } from 'react'
import api from '../services/api'
import Card from '../components/Card'
import StarRating from '../components/StarRating'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import CircularProgress from '@mui/material/CircularProgress'
import Paper from '@mui/material/Paper'

export default function MisCalificaciones() {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/calificaciones/recibidas')
      .then((r) => setData(r.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return (
    <Card title="Calificaciones Recibidas">
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      ) : data.length === 0 ? (
        <Typography variant="body2" sx={{ textAlign: 'center', py: 4, color: 'text.secondary' }}>
          Aún no tienes calificaciones
        </Typography>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          {data.map((c: any) => (
            <Paper key={c.id} variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                <StarRating value={c.puntuacion} readonly size="sm" />
                <Typography variant="caption" sx={{ color: 'text.secondary', opacity: 0.6 }}>
                  {new Date(c.creado_en).toLocaleDateString()}
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ fontWeight: 500 }}>{c.origen} → {c.destino}</Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary', opacity: 0.6, display: 'block', mb: 0.5 }}>
                Calificado por: {c.calificador_nombre} {c.calificador_apellido}
              </Typography>
              {c.comentario && (
                <Typography variant="body2" sx={{ color: 'text.secondary', fontStyle: 'italic' }}>
                  "{c.comentario}"
                </Typography>
              )}
            </Paper>
          ))}
        </Box>
      )}
    </Card>
  )
}
