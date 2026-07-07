import { useState, useEffect } from 'react'
import api from '../services/api'
import { useAuth } from '../context/AuthContext'
import Card from '../components/Card'

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

  if (!perfil) return <p>Cargando perfil...</p>

  return (
    <Card title="Mis Datos Personales">
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 15, maxWidth: 500 }}>
        <Campo label="Nombre" valor={`${perfil.nombre} ${perfil.apellido}`} />
        <Campo label="Cédula" valor={perfil.cedula} />
        <Campo label="Email" valor={perfil.email} />
        <Campo label="Teléfono" valor={perfil.telefono} />
        <Campo label="Rol" valor={rolNames[perfil.rol] || perfil.rol} />
      </div>

      {usuario?.rol === 'CHOFER' && extra && (
        <div style={{ marginTop: 20 }}>
          <h4 style={{ margin: '0 0 10px', color: '#1a1a2e' }}>Finanzas</h4>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 15, maxWidth: 500 }}>
            <Campo label="Por cobrar" valor={`$${extra.saldo_pendiente.toFixed(2)}`} />
            <Campo label="Cobrado" valor={`$${extra.saldo_pagado.toFixed(2)}`} />
          </div>
        </div>
      )}
    </Card>
  )
}

function Campo({ label, valor }: { label: string; valor: string }) {
  return (
    <div>
      <p style={{ fontSize: 12, color: '#888', margin: 0 }}>{label}</p>
      <p style={{ fontSize: 16, fontWeight: 600, margin: '2px 0 0' }}>{valor}</p>
    </div>
  )
}
