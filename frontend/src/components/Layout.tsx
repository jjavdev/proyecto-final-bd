// Layout principal con sidebar de navegacion.
// Muestra el menu segun el rol del usuario.
// Para CLIENTE muestra saldo disponible. Para CHOFER muestra saldos pendiente/pagado.

import { ReactNode, useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate, useLocation } from 'react-router-dom'
import api from '../services/api'

// Menu de navegacion compartido (Inicio + Perfil) y especifico por rol
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

  return (
    <div style={{ display: 'flex', minHeight: '100vh', margin: 0, fontFamily: 'Arial, sans-serif' }}>
      <nav style={{ width: 240, background: '#1a1a2e', color: '#fff', padding: 20, display: 'flex', flexDirection: 'column' }}>
        <h2 style={{ margin: '0 0 20px 0', fontSize: 20 }}>Decarrerita</h2>
        <p style={{ fontSize: 12, opacity: 0.7, marginBottom: 4 }}>{usuario?.rol} — {usuario?.nombre}</p>
        <p style={{ fontSize: 11, opacity: 0.5, marginBottom: 20 }}>{usuario?.email}</p>

        {usuario?.rol === 'CLIENTE' && saldo !== null && (
          <div style={{ background: '#16213e', borderRadius: 8, padding: '12px 15px', marginBottom: 20 }}>
            <p style={{ fontSize: 11, opacity: 0.7, margin: 0 }}>Saldo disponible</p>
            <p style={{ fontSize: 22, fontWeight: 700, margin: '4px 0 0', color: '#4ecca3' }}>${saldo.toFixed(2)}</p>
          </div>
        )}

        {usuario?.rol === 'CHOFER' && choferStats && (
          <div style={{ background: '#16213e', borderRadius: 8, padding: '12px 15px', marginBottom: 20 }}>
            <p style={{ fontSize: 11, opacity: 0.7, margin: 0 }}>Por cobrar</p>
            <p style={{ fontSize: 16, fontWeight: 700, margin: '4px 0 0', color: '#f0a500' }}>${choferStats.saldo_pendiente.toFixed(2)}</p>
            <p style={{ fontSize: 11, opacity: 0.7, margin: '8px 0 0' }}>Cobrado</p>
            <p style={{ fontSize: 16, fontWeight: 700, margin: '4px 0 0', color: '#4ecca3' }}>${choferStats.saldo_pagado.toFixed(2)}</p>
          </div>
        )}

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 5 }}>
          {items.map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              style={{
                textAlign: 'left', padding: '10px 12px', border: 'none', borderRadius: 6,
                cursor: 'pointer', fontSize: 14,
                background: location.pathname === item.path ? '#16213e' : 'transparent',
                color: '#fff', fontWeight: location.pathname === item.path ? 700 : 400,
              }}
            >
              {item.label}
            </button>
          ))}
        </div>
        <button onClick={handleLogout} style={{
          padding: '10px 12px', border: 'none', borderRadius: 6, cursor: 'pointer',
          background: '#e94560', color: '#fff', fontSize: 14, marginTop: 20,
        }}>
          Cerrar Sesión
        </button>
      </nav>
      <main style={{ flex: 1, padding: 30, background: '#f5f5f5' }}>
        {children}
      </main>
    </div>
  )
}
