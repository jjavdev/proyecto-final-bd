// Cliente HTTP centralizado para las peticiones al backend.
// Usa Axios con baseURL /api (el proxy de Vite redirige al backend).
// Interceptor de request: agrega el token JWT del localStorage.
// Interceptor de response: en 401 redirige al login.

import axios from 'axios'

const api = axios.create({
  baseURL: '/api'
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

export default api
