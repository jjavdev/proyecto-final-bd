// Componente raiz de la aplicacion.
// Define las rutas publicas (login, register) y protegidas (dashboard).
// PrivateRoute verifica autenticacion y redirige al login si es necesario.

import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
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
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard/*" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </AuthProvider>
  )
}

export default App
