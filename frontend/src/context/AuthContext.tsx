// Contexto de autenticacion global.
// Provee el usuario actual, estado de carga y funciones login/register/logout.
// Al montarse, intenta recuperar la sesion desde el token guardado en localStorage.

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import api from '../services/api'

interface Usuario {
  id: number
  email: string
  nombre: string
  rol: string
}

interface AuthContextType {
  usuario: Usuario | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (data: any) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      api.get('/auth/perfil')
        .then((res) => setUsuario(res.data))
        .catch(() => localStorage.removeItem('token'))
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  async function login(email: string, password: string) {
    const res = await api.post('/auth/login', { email, password })
    localStorage.setItem('token', res.data.token)
    setUsuario(res.data.usuario)
  }

  async function register(data: any) {
    const res = await api.post('/auth/registro', data)
    localStorage.setItem('token', res.data.token)
    setUsuario(res.data.usuario)
  }

  function logout() {
    localStorage.removeItem('token')
    setUsuario(null)
  }

  return (
    <AuthContext.Provider value={{ usuario, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
