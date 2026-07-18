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

  if (!perfil) return (
    <div className="flex items-center justify-center py-12">
      <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  )

  return (
    <Card title="Mis Datos Personales">
      <div className="grid grid-cols-2 gap-4 max-w-[500px]">
        <Campo label="Nombre" valor={`${perfil.nombre} ${perfil.apellido}`} />
        <Campo label="Cédula" valor={perfil.cedula} />
        <Campo label="Email" valor={perfil.email} />
        <Campo label="Teléfono" valor={perfil.telefono} />
        <Campo label="Rol" valor={rolNames[perfil.rol] || perfil.rol} />
      </div>

      {usuario?.rol === 'CHOFER' && extra && (
        <div className="mt-6">
          <h4 className="text-sm font-semibold tracking-[0.08em] uppercase text-surface-container-high mb-3">Finanzas</h4>
          <div className="grid grid-cols-2 gap-4 max-w-[500px]">
            <Campo label="Por cobrar" valor={`$${Math.max(0, extra.saldo_pendiente).toFixed(2)}`} />
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
      <p className="text-xs text-on-surface-variant m-0">{label}</p>
      <p className="text-base font-semibold mt-0.5 text-on-surface">{valor}</p>
    </div>
  )
}
