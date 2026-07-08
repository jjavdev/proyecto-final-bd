import { ReactNode, useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate, useLocation } from 'react-router-dom'
import api from '../services/api'

const shared = [
  { label: 'Inicio', path: '/dashboard' },
  { label: 'Mi Perfil', path: '/dashboard/perfil' },
]

const menuItems: Record<string, { label: string; path: string }[]> = {
  ADMIN: [
    ...shared,
    { label: 'Listado Traslados', path: '/dashboard/traslados' },
    { label: 'Reportes', path: '/dashboard/reportes' },
  ],
  PERSONAL_ADMIN: [
    ...shared,
    { label: 'Evaluar Chofer', path: '/dashboard/evaluar-chofer' },
    { label: 'Revisar Vehículo', path: '/dashboard/revisar-vehiculo' },
    { label: 'Pagar Chofer', path: '/dashboard/pagar-chofer' },
    { label: 'Ganancias', path: '/dashboard/ganancias' },
    { label: 'Listado Traslados', path: '/dashboard/traslados' },
    { label: 'Banco Chofer', path: '/dashboard/banco-chofer' },
    { label: 'Evaluaciones', path: '/dashboard/evaluaciones-chofer' },
    { label: 'Revisiones', path: '/dashboard/revisiones-vehiculo' },
    { label: 'Listado Choferes', path: '/dashboard/listado-choferes' },
  ],
  CHOFER: [
    ...shared,
    { label: 'Mis Vehículos', path: '/dashboard/vehiculos' },
    { label: 'Contactos Emergencia', path: '/dashboard/contactos' },
    { label: 'Datos Bancarios', path: '/dashboard/banco' },
    { label: 'Mis Viajes', path: '/dashboard/viajes' },
  ],
  CLIENTE: [
    ...shared,
    { label: 'Recargar Saldo', path: '/dashboard/recargar' },
    { label: 'Solicitar Viaje', path: '/dashboard/solicitar-viaje' },
    { label: 'Historial Viajes', path: '/dashboard/historial-viajes' },
    { label: 'Historial Recargas', path: '/dashboard/historial-recargas' },
  ],
}

export default function Layout({ children }: { children: ReactNode }) {
  const { usuario, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const items = menuItems[usuario?.rol || ''] || []

  const [saldo, setSaldo] = useState<number | null>(null)
  const [choferStats, setChoferStats] = useState<{ saldo_pendiente: number; saldo_pagado: number } | null>(null)

  useEffect(() => {
    if (usuario?.rol === 'CLIENTE') {
      api.get('/clientes/saldo').then((r) => setSaldo(r.data.saldo)).catch(() => {})
    }
    if (usuario?.rol === 'CHOFER') {
      api.get('/choferes/stats').then((r) => setChoferStats(r.data)).catch(() => {})
    }
  }, [usuario])

  function handleLogout() {
    logout()
    navigate('/login')
  }

  const rolNames: Record<string, string> = {
    ADMIN: 'Administrador',
    CHOFER: 'Chofer',
    CLIENTE: 'Cliente',
    PERSONAL_ADMIN: 'Personal Administrativo',
  }

  return (
    <div className="layout-wrapper">
      <nav className="sidebar bg-dark text-white p-4">
        <h2 className="mb-3 fw-bold fs-4">Decarrerita</h2>
        <p className="small opacity-75 mb-0">{rolNames[usuario?.rol || ''] || usuario?.rol}</p>
        <p className="small opacity-50 mb-3">{usuario?.email}</p>

        {usuario?.rol === 'CLIENTE' && saldo !== null && (
          <div className="p-3 rounded mb-3" style={{ background: '#16213e' }}>
            <p className="small opacity-75 mb-0">Saldo disponible</p>
            <p className="fs-4 fw-bold mb-0" style={{ color: '#4ecca3' }}>${saldo.toFixed(2)}</p>
          </div>
        )}

        {usuario?.rol === 'CHOFER' && choferStats && (
          <div className="p-3 rounded mb-3" style={{ background: '#16213e' }}>
            <p className="small opacity-75 mb-0">Por cobrar</p>
            <p className="fs-5 fw-bold mb-0" style={{ color: '#f0a500' }}>${choferStats.saldo_pendiente.toFixed(2)}</p>
            <p className="small opacity-75 mb-0 mt-2">Cobrado</p>
            <p className="fs-5 fw-bold mb-0" style={{ color: '#4ecca3' }}>${choferStats.saldo_pagado.toFixed(2)}</p>
          </div>
        )}

        <div className="d-flex flex-column gap-1 flex-grow-1">
          {items.map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`btn text-start rounded py-2 px-3 border-0 ${
                location.pathname === item.path
                  ? 'fw-bold' : ''
              }`}
              style={{
                background: location.pathname === item.path ? '#16213e' : 'transparent',
                color: '#fff',
                fontSize: 14,
              }}
            >
              {item.label}
            </button>
          ))}
        </div>

        <button onClick={handleLogout} className="btn w-100 mt-3 border-0 py-2 rounded"
          style={{ background: '#e94560', color: '#fff', fontSize: 14 }}>
          Cerrar Sesión
        </button>
      </nav>
      <main className="main-content">
        {children}
      </main>
    </div>
  )
}
