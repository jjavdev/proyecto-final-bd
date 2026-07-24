import { useState, FormEvent } from 'react'
import { useNavigate, Link as RouterLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Alert from '@mui/material/Alert'
import CircularProgress from '@mui/material/CircularProgress'
import MenuItem from '@mui/material/MenuItem'

export default function Register() {
  const [form, setForm] = useState({ email: '', password: '', confirmPassword: '', nombre: '', apellido: '', cedula: '', telefono: '', rol: 'CLIENTE' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()
  const navigate = useNavigate()

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')

    if (form.password !== form.confirmPassword) {
      setError('Las contraseñas no coinciden')
      return
    }

    setLoading(true)
    try {
      const { confirmPassword, ...data } = form
      await register(data)
      navigate('/dashboard')
    } catch (err: any) {
      const msg = err.response?.data?.error
      setError(typeof msg === 'string' ? msg : 'Error al registrarse')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'fixed',
          inset: 0,
          zIndex: 0,
          opacity: 0.5,
          backgroundImage: 'linear-gradient(to right, rgba(61,255,163,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(61,255,163,0.05) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        },
      }}
    >
      <Box
        sx={{
          position: 'fixed',
          top: '-10%',
          left: '-10%',
          width: 500,
          height: 500,
          bgcolor: 'rgba(61,255,163,0.1)',
          filter: 'blur(120px)',
          borderRadius: '50%',
          zIndex: 0,
          pointerEvents: 'none',
        }}
      />
      <Box
        sx={{
          position: 'fixed',
          bottom: '-10%',
          right: '-10%',
          width: 400,
          height: 400,
          bgcolor: 'rgba(61,255,163,0.05)',
          filter: 'blur(100px)',
          borderRadius: '50%',
          zIndex: 0,
          pointerEvents: 'none',
        }}
      />

      <Paper
        sx={{
          p: 4,
          width: '100%',
          maxWidth: 440,
          mx: 2,
          position: 'relative',
          zIndex: 10,
          backdropFilter: 'blur(12px)',
          border: '1px solid',
          borderColor: 'divider',
          boxShadow: '0 0 20px rgba(61, 255, 163, 0.2)',
        }}
      >
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Typography
            variant="h4"
            sx={{
              fontFamily: 'Sora, sans-serif',
              fontWeight: 800,
              fontStyle: 'italic',
              color: 'primary.dark',
              letterSpacing: '-0.02em',
            }}
          >
            Decarrerita
          </Typography>
          <Typography
            variant="overline"
            sx={{ color: 'text.secondary', letterSpacing: '0.15em', mt: 0.5, display: 'block' }}
          >
            Crear Cuenta
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2, borderRadius: 1 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="Correo electrónico"
            type="email"
            placeholder="Correo electrónico"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
            fullWidth
            size="small"
          />
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5 }}>
            <TextField
              label="Contraseña"
              type="password"
              placeholder="Contraseña"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
              fullWidth
              size="small"
              inputProps={{ minLength: 6, maxLength: 50 }}
            />
            <TextField
              label="Confirmar"
              type="password"
              placeholder="Confirmar contraseña"
              value={form.confirmPassword}
              onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
              required
              fullWidth
              size="small"
              inputProps={{ minLength: 6, maxLength: 50 }}
            />
          </Box>
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5 }}>
            <TextField
              label="Nombre"
              placeholder="Nombre"
              value={form.nombre}
              onChange={(e) => {
                const val = e.target.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, '')
                setForm({ ...form, nombre: val })
              }}
              required
              fullWidth
              size="small"
              inputProps={{ maxLength: 50 }}
            />
            <TextField
              label="Apellido"
              placeholder="Apellido"
              value={form.apellido}
              onChange={(e) => {
                const val = e.target.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, '')
                setForm({ ...form, apellido: val })
              }}
              required
              fullWidth
              size="small"
              inputProps={{ maxLength: 50 }}
            />
          </Box>
          <TextField
            label="Cédula"
            placeholder="Cédula (solo dígitos)"
            value={form.cedula}
            onChange={(e) => {
              const val = e.target.value.replace(/\D/g, '')
              setForm({ ...form, cedula: val })
            }}
            required
            fullWidth
            size="small"
            inputProps={{ minLength: 7, maxLength: 10 }}
          />
          <TextField
            label="Teléfono"
            placeholder="Teléfono (ej: 04121234567)"
            value={form.telefono}
            onChange={(e) => {
              const val = e.target.value.replace(/\D/g, '')
              setForm({ ...form, telefono: val })
            }}
            required
            fullWidth
            size="small"
            inputProps={{ minLength: 10, maxLength: 15 }}
          />
          <TextField
            select
            label="Rol"
            value={form.rol}
            onChange={(e) => setForm({ ...form, rol: e.target.value })}
            fullWidth
            size="small"
          >
            <MenuItem value="CLIENTE">Cliente</MenuItem>
            <MenuItem value="CHOFER">Chofer</MenuItem>
          </TextField>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={loading}
            sx={{ py: 1.5, mt: 0.5, gap: 1 }}
          >
            {loading && <CircularProgress size={16} sx={{ color: 'on.primary' }} />}
            {loading ? 'CREANDO...' : 'CREAR CUENTA'}
          </Button>
        </Box>

        <Typography variant="body2" sx={{ textAlign: 'center', mt: 3, color: 'text.secondary' }}>
          ¿Ya tienes una cuenta?{' '}
          <Box
            component={RouterLink}
            to="/login"
            sx={{ color: 'primary.dark', fontWeight: 700, textDecoration: 'underline', textUnderlineOffset: 4 }}
          >
            Iniciar Sesión
          </Box>
        </Typography>
      </Paper>
    </Box>
  )
}
