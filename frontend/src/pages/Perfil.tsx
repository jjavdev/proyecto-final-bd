import { useState, useEffect } from 'react'
import api from '../services/api'
import { useAuth } from '../context/AuthContext'
import Card from '../components/Card'
import Grid from '@mui/material/Grid2'
import Typography from '@mui/material/Typography'
import CircularProgress from '@mui/material/CircularProgress'
import Box from '@mui/material/Box'

const rolNames: Record<string, string> = {
  ADMIN: 'Administrador',
  CHOFER: 'Chofer',
  CLIENTE: 'Cliente',
  PERSONAL_ADMIN: 'Personal Administrativo',
}

export default function Perfil() {
  const { usuario } = useAuth()
  const [perfil, setPerfil] = useState<any>(null)
  const [extra, setExtra] = useState<any>(null)

  useEffect(() => {
    api.get('/auth/perfil').then((r) => setPerfil(r.data)).catch(() => {})
    if (usuario?.rol === 'CHOFER') {
      api.get('/choferes/stats').then((r) => setExtra(r.data)).catch(() => {})
    }
  }, [usuario])

  if (!perfil) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
      <CircularProgress />
    </Box>
  )

  return (
    <Card title="Mis Datos Personales">
      <Grid container spacing={2} sx={{ maxWidth: 500 }}>
        <Grid size={{ xs: 6 }}>
          <Campo label="Nombre" valor={`${perfil.nombre} ${perfil.apellido}`} />
        </Grid>
        <Grid size={{ xs: 6 }}>
          <Campo label="Cédula" valor={perfil.cedula} />
        </Grid>
        <Grid size={{ xs: 6 }}>
          <Campo label="Email" valor={perfil.email} />
        </Grid>
        <Grid size={{ xs: 6 }}>
          <Campo label="Teléfono" valor={perfil.telefono} />
        </Grid>
        <Grid size={{ xs: 6 }}>
          <Campo label="Rol" valor={rolNames[perfil.rol] || perfil.rol} />
        </Grid>
      </Grid>

      {usuario?.rol === 'CHOFER' && extra && (
        <Box sx={{ mt: 4 }}>
          <Typography
            variant="overline"
            sx={{ color: 'text.secondary', mb: 1.5, display: 'block' }}
          >
            Finanzas
          </Typography>
          <Grid container spacing={2} sx={{ maxWidth: 500 }}>
            <Grid size={{ xs: 6 }}>
              <Campo label="Por cobrar" valor={`$${Math.max(0, extra.saldo_pendiente).toFixed(2)}`} />
            </Grid>
            <Grid size={{ xs: 6 }}>
              <Campo label="Cobrado" valor={`$${extra.saldo_pagado.toFixed(2)}`} />
            </Grid>
          </Grid>
        </Box>
      )}
    </Card>
  )
}

function Campo({ label, valor }: { label: string; valor: string }) {
  return (
    <Box>
      <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
        {label}
      </Typography>
      <Typography variant="body1" sx={{ fontWeight: 600, mt: 0.25 }}>
        {valor}
      </Typography>
    </Box>
  )
}
