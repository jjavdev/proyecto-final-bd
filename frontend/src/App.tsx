// Componente raiz de la aplicacion.
// Define las rutas publicas (login, register) y protegidas (dashboard).
// PrivateRoute verifica autenticacion y redirige al login si es necesario.

import { Routes, Route, Navigate } from 'react-router-dom'
import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import theme from './theme/theme'
import { AuthProvider, useAuth } from './context/AuthContext'
import { BalanceProvider } from './context/BalanceContext'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'

function PrivateRoute({ children, roles }: { children: React.ReactNode; roles?: string[] }) {
  const { usuario, loading } = useAuth()

  if (loading) return <div style={{ padding: 50, textAlign: 'center' }}>Cargando...</div>
  if (!usuario) return <Navigate to="/login" />
  if (roles && !roles.includes(usuario.rol)) return <Navigate to="/dashboard" />

  return <>{children}</>
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <BalanceProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard/*" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        </BalanceProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
