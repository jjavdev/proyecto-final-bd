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
    { label: 'Calificar Cliente', path: '/dashboard/calificar' },
    { label: 'Mis Calificaciones', path: '/dashboard/mis-calificaciones' },
  ],
  CLIENTE: [
    ...shared,
    { label: 'Recargar Saldo', path: '/dashboard/recargar' },
    { label: 'Solicitar Viaje', path: '/dashboard/solicitar-viaje' },
    { label: 'Historial Viajes', path: '/dashboard/historial-viajes' },
    { label: 'Historial Recargas', path: '/dashboard/historial-recargas' },
    { label: 'Calificar Chofer', path: '/dashboard/calificar' },
    { label: 'Mis Calificaciones', path: '/dashboard/mis-calificaciones' },
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
      <nav className="sidebar">
        <h2 className="font-headline text-3xl font-extrabold italic text-primary-fixed-dim -tracking-[0.02em] mb-1">Decarrerita</h2>
        <p className="font-body text-xs tracking-[0.1em] text-on-surface-variant mb-1">{rolNames[usuario?.rol || ''] || usuario?.rol}</p>
        <p className="font-body text-sm text-on-surface-variant/50 mb-6">{usuario?.email}</p>

        {usuario?.rol === 'CLIENTE' && saldo !== null && (
          <div className="saldo-box">
            <p className="font-body text-xs tracking-[0.05em] text-on-surface-variant mb-0.5">Saldo disponible</p>
            <p className="font-headline text-2xl font-bold text-primary">{saldo.toFixed(2)}</p>
          </div>
        )}

        {usuario?.rol === 'CHOFER' && choferStats && (
          <div className="saldo-box">
            <p className="font-body text-xs tracking-[0.05em] text-on-surface-variant mb-0.5">Por cobrar</p>
            <p className="font-headline text-lg font-bold text-primary-fixed-dim">${Math.max(0, choferStats.saldo_pendiente).toFixed(2)}</p>
            <p className="font-body text-xs tracking-[0.05em] text-on-surface-variant mb-0.5 mt-2">Cobrado</p>
            <p className="font-headline text-2xl font-bold text-primary">${choferStats.saldo_pagado.toFixed(2)}</p>
          </div>
        )}

        <div className="flex flex-col gap-0.5 flex-1">
          {items.map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`sidebar-link${location.pathname === item.path ? ' active' : ''}`}
            >
              {item.label}
            </button>
          ))}
        </div>

        <button onClick={handleLogout} className="logout-btn mt-4">
          Cerrar Sesión
        </button>
      </nav>
      <main className="main-content">
        {children}
      </main>
    </div>
  )
}
