import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'

export default function Home() {
  const { usuario } = useAuth()
  const [data, setData] = useState<any>({ loading: true })

  useEffect(() => {
    if (!usuario) return
    const role = usuario.rol

    async function load() {
      try {
        if (role === 'ADMIN' || role === 'PERSONAL_ADMIN') {
          const [trasladosRes, choferesRes, gananciasRes] = await Promise.all([
            api.get('/reportes/traslados'),
            api.get('/choferes/listar'),
            api.get('/reportes/ganancias'),
          ])
          const traslados: any[] = trasladosRes.data
          const choferes: any[] = choferesRes.data
          const ganancias: any[] = gananciasRes.data

          const totalBruto = ganancias.reduce((s: number, r: any) => s + Number(r.total_bruto || 0), 0)
          const gananciaTotal = ganancias.reduce((s: number, r: any) => s + Number(r.ganancia_empresa || 0), 0)

          setData({
            loading: false,
            totalTraslados: traslados.length,
            completados: traslados.filter((t: any) => t.estado === 'completado').length,
            pendientes: traslados.filter((t: any) => t.estado === 'pendiente').length,
            cancelados: traslados.filter((t: any) => t.estado === 'cancelado').length,
            totalChoferes: choferes.length,
            choferesActivos: choferes.filter((c: any) => c.activo).length,
            totalViajes: ganancias.reduce((s: number, r: any) => s + Number(r.viajes || 0), 0),
            gananciaTotal,
            totalBruto,
            ultimosTraslados: traslados.slice(0, 5),
            choferes,
          })
        }

        if (role === 'CHOFER') {
          const [statsRes, viajesRes, vehiculosRes] = await Promise.all([
            api.get('/choferes/stats'),
            api.get('/choferes/viajes'),
            api.get('/choferes/vehiculos'),
          ])
          const viajes: any[] = viajesRes.data
          setData({
            loading: false,
            stats: statsRes.data,
            pendientes: viajes.filter((v: any) => v.estado === 'pendiente').length,
            completados: viajes.filter((v: any) => v.estado === 'completado').length,
            totalVehiculos: vehiculosRes.data.length,
            ultimosViajes: viajes.slice(0, 5),
          })
        }

        if (role === 'CLIENTE') {
          const [saldoRes, viajesRes, recargasRes] = await Promise.all([
            api.get('/clientes/saldo'),
            api.get('/clientes/viajes'),
            api.get('/clientes/recargas'),
          ])
          const viajes: any[] = viajesRes.data
          setData({
            loading: false,
            saldo: saldoRes.data.saldo,
            totalViajes: viajes.length,
            completados: viajes.filter((v: any) => v.estado === 'completado').length,
            ultimosViajes: viajes.slice(0, 5),
            totalRecargas: recargasRes.data.length,
          })
        }
      } catch {
        setData({ loading: false, error: true })
      }
    }

    load()
  }, [usuario])

  const rol = usuario?.rol || ''
  const rolNames: Record<string, string> = {
    ADMIN: 'Administrador',
    CHOFER: 'Chofer',
    CLIENTE: 'Cliente',
    PERSONAL_ADMIN: 'Personal Administrativo',
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-headline text-headline-lg text-on-surface mb-2">
          Bienvenido, {usuario?.nombre}
        </h1>
        <p className="text-on-surface-variant font-body">
          Panel de <strong>{rolNames[rol] || rol}</strong>
        </p>
      </div>

      {data.loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : data.error ? (
        <p className="text-error">Error al cargar datos</p>
      ) : (
        <>
          {/* ADMIN + PERSONAL_ADMIN dashboard */}
          {(rol === 'ADMIN' || rol === 'PERSONAL_ADMIN') && <AdminDashboard data={data} />}

          {/* CHOFER dashboard */}
          {rol === 'CHOFER' && <ChoferDashboard data={data} />}

          {/* CLIENTE dashboard */}
          {rol === 'CLIENTE' && <ClienteDashboard data={data} />}
        </>
      )}
    </div>
  )
}

function StatCard({ label, value, accent = false }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="bg-surface-container border border-outline rounded-xl p-5">
      <p className="text-xs font-semibold tracking-[0.08em] uppercase text-on-surface-variant mb-1.5">{label}</p>
      <p className={`font-headline text-3xl font-bold ${accent ? 'text-primary' : 'text-on-surface'}`}>{value}</p>
    </div>
  )
}

function AdminDashboard({ data }: { data: any }) {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Traslados" value={String(data.totalTraslados)} />
        <StatCard label="Completados" value={String(data.completados)} accent />
        <StatCard label="Pendientes" value={String(data.pendientes)} />
        <StatCard label="Cancelados" value={String(data.cancelados)} />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <StatCard label="Choferes" value={String(data.totalChoferes)} />
        <StatCard label="Choferes activos" value={String(data.choferesActivos)} accent />
        <StatCard label="Total viajes" value={String(data.totalViajes)} />
        <StatCard label="Bruto total" value={`$${Number(data.totalBruto).toFixed(2)}`} />
        <StatCard label="Ganancia (30%)" value={`$${Number(data.gananciaTotal).toFixed(2)}`} accent />
      </div>

      <RecentTable
        title="Últimos Traslados"
        data={data.ultimosTraslados}
        columns={[
          { key: 'origen', label: 'Origen' },
          { key: 'destino', label: 'Destino' },
          { key: 'costo', label: 'Costo', render: (v: any) => `$${Number(v).toFixed(2)}` },
          {
            key: 'estado', label: 'Estado',
            render: (v: any) => (
              <span className={`status-badge ${v === 'completado' ? 'status-completado' : v === 'pendiente' ? 'status-pendiente' : 'status-cancelado'}`}>
                {v}
              </span>
            ),
          },
        ]}
      />
    </div>
  )
}

function ChoferDashboard({ data }: { data: any }) {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Por cobrar" value={`$${Math.max(0, Number(data.stats?.saldo_pendiente)).toFixed(2)}`} />
        <StatCard label="Cobrado" value={`$${Number(data.stats?.saldo_pagado).toFixed(2)}`} accent />
        <StatCard label="Viajes pendientes" value={String(data.pendientes)} />
        <StatCard label="Completados" value={String(data.completados)} accent />
        <StatCard label="Vehículos" value={String(data.totalVehiculos)} />
      </div>

      <RecentTable
        title="Últimos Viajes Asignados"
        data={data.ultimosViajes}
        columns={[
          { key: 'origen', label: 'Origen' },
          { key: 'destino', label: 'Destino' },
          { key: 'costo', label: 'Costo', render: (v: any) => `$${Number(v).toFixed(2)}` },
          {
            key: 'estado', label: 'Estado',
            render: (v: any) => (
              <span className={`status-badge ${v === 'completado' ? 'status-completado' : v === 'pendiente' ? 'status-pendiente' : 'status-cancelado'}`}>
                {v}
              </span>
            ),
          },
        ]}
      />
    </div>
  )
}

function ClienteDashboard({ data }: { data: any }) {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="bg-surface-container border border-outline rounded-xl p-5 md:col-span-2">
          <p className="text-xs font-semibold tracking-[0.08em] uppercase text-on-surface-variant mb-1.5">Saldo disponible</p>
          <p className="font-headline text-4xl font-bold text-primary">${Number(data.saldo).toFixed(2)}</p>
        </div>
        <StatCard label="Viajes realizados" value={String(data.totalViajes)} />
        <StatCard label="Recargas" value={String(data.totalRecargas)} accent />
      </div>

      <RecentTable
        title="Últimos Viajes"
        data={data.ultimosViajes}
        columns={[
          { key: 'origen', label: 'Origen' },
          { key: 'destino', label: 'Destino' },
          { key: 'costo', label: 'Costo', render: (v: any) => `$${Number(v).toFixed(2)}` },
          {
            key: 'estado', label: 'Estado',
            render: (v: any) => (
              <span className={`status-badge ${v === 'completado' ? 'status-completado' : v === 'pendiente' ? 'status-pendiente' : 'status-cancelado'}`}>
                {v}
              </span>
            ),
          },
        ]}
      />
    </div>
  )
}

function RecentTable({ title, data, columns }: {
  title: string
  data: any[]
  columns: { key: string; label: string; render?: (v: any, row: any) => any }[]
}) {
  if (!data?.length) return null

  return (
    <div>
      <h3 className="font-headline text-headline-md font-semibold mb-4">{title}</h3>
      <div className="border border-outline rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-surface-container-high">
              {columns.map((col) => (
                <th key={col.key} className="text-left px-4 py-3 font-body text-xs font-semibold tracking-[0.08em] uppercase text-on-surface-variant">
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row: any, i: number) => (
              <tr key={row.id || i} className="border-t border-outline/50 hover:bg-white/[0.02]">
                {columns.map((col) => (
                  <td key={col.key} className="px-4 py-3 text-on-surface">
                    {col.render ? col.render(row[col.key], row) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
