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
import Divider from '@mui/material/Divider'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(email, password)
      navigate('/dashboard')
    } catch (err: any) {
      const msg = err.response?.data?.error
      setError(typeof msg === 'string' ? msg : 'Error al iniciar sesión')
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
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography
            variant="h3"
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
            Soluciones de Movilidad
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: 1 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          <TextField
            label="Correo electrónico"
            type="email"
            placeholder="pilot@decarrerita.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            fullWidth
            size="medium"
          />
          <TextField
            label="Contraseña"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            fullWidth
            size="medium"
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={loading}
            sx={{ py: 1.5, mt: 0.5, gap: 1 }}
          >
            {loading && <CircularProgress size={16} sx={{ color: 'on.primary' }} />}
            {loading ? 'INICIANDO...' : 'INICIAR SESIÓN'}
          </Button>
        </Box>

        <Divider sx={{ my: 3 }}>
          <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, letterSpacing: '0.1em' }}>
            O CONTINÚA CON
          </Typography>
        </Divider>

        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5 }}>
          <Button variant="outlined" disabled fullWidth sx={{ py: 1.5 }}>
            Google
          </Button>
          <Button variant="outlined" disabled fullWidth sx={{ py: 1.5 }}>
            Apple
          </Button>
        </Box>

        <Typography variant="body2" sx={{ textAlign: 'center', mt: 3, color: 'text.secondary' }}>
          ¿No tienes una cuenta?{' '}
          <Box
            component={RouterLink}
            to="/register"
            sx={{ color: 'primary.dark', fontWeight: 700, textDecoration: 'underline', textUnderlineOffset: 4 }}
          >
            Registrarse
          </Box>
        </Typography>
      </Paper>
    </Box>
  )
}
