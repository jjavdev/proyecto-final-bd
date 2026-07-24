import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid2'
import Typography from '@mui/material/Typography'
import Paper from '@mui/material/Paper'
import Chip from '@mui/material/Chip'
import CircularProgress from '@mui/material/CircularProgress'
import TableContainer from '@mui/material/TableContainer'
import Table from '@mui/material/Table'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableRow from '@mui/material/TableRow'
import TableCell from '@mui/material/TableCell'

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
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
          Bienvenido, {usuario?.nombre}
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          Panel de <strong>{rolNames[rol] || rol}</strong>
        </Typography>
      </Box>

      {data.loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
          <CircularProgress />
        </Box>
      ) : data.error ? (
        <Typography color="error">Error al cargar datos</Typography>
      ) : (
        <>
          {(rol === 'ADMIN' || rol === 'PERSONAL_ADMIN') && <AdminDashboard data={data} />}
          {rol === 'CHOFER' && <ChoferDashboard data={data} />}
          {rol === 'CLIENTE' && <ClienteDashboard data={data} />}
        </>
      )}
    </Box>
  )
}

function StatCard({ label, value, accent = false }: { label: string; value: string; accent?: boolean }) {
  return (
    <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 2 }}>
      <Typography variant="overline" sx={{ color: 'text.secondary', display: 'block', mb: 0.5 }}>
        {label}
      </Typography>
      <Typography
        variant="h4"
        sx={{
          fontFamily: 'Sora, sans-serif',
          fontWeight: 700,
          color: accent ? 'primary.main' : 'text.primary',
        }}
      >
        {value}
      </Typography>
    </Paper>
  )
}

function StatusChip({ estado }: { estado: string }) {
  const color = estado === 'completado' ? 'primary' as const : estado === 'pendiente' ? 'warning' as const : 'error' as const
  return <Chip label={estado} color={color} size="small" variant="outlined" />
}

function RecentTable({ title, data, columns }: {
  title: string
  data: any[]
  columns: { key: string; label: string; render?: (v: any, row: any) => any }[]
}) {
  if (!data?.length) return null

  return (
    <Box>
      <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
        {title}
      </Typography>
      <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2 }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              {columns.map((col) => (
                <TableCell
                  key={col.key}
                  sx={{
                    fontWeight: 600,
                    fontSize: '0.75rem',
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    color: 'text.secondary',
                    bgcolor: 'action.hover',
                  }}
                >
                  {col.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row: any, i: number) => (
              <TableRow key={row.id || i} sx={{ '&:hover': { bgcolor: 'rgba(255,255,255,0.02)' } }}>
                {columns.map((col) => (
                  <TableCell key={col.key} sx={{ color: 'text.primary' }}>
                    {col.render ? col.render(row[col.key], row) : row[col.key]}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  )
}

function AdminDashboard({ data }: { data: any }) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <Grid container spacing={2}>
        <Grid size={{ xs: 6, md: 3 }}><StatCard label="Traslados" value={String(data.totalTraslados)} /></Grid>
        <Grid size={{ xs: 6, md: 3 }}><StatCard label="Completados" value={String(data.completados)} accent /></Grid>
        <Grid size={{ xs: 6, md: 3 }}><StatCard label="Pendientes" value={String(data.pendientes)} /></Grid>
        <Grid size={{ xs: 6, md: 3 }}><StatCard label="Cancelados" value={String(data.cancelados)} /></Grid>
        <Grid size={{ xs: 6, md: 4 }}><StatCard label="Choferes" value={String(data.totalChoferes)} /></Grid>
        <Grid size={{ xs: 6, md: 4 }}><StatCard label="Choferes activos" value={String(data.choferesActivos)} accent /></Grid>
        <Grid size={{ xs: 6, md: 4 }}><StatCard label="Total viajes" value={String(data.totalViajes)} /></Grid>
        <Grid size={{ xs: 6, md: 6 }}><StatCard label="Bruto total" value={`$${Number(data.totalBruto).toFixed(2)}`} /></Grid>
        <Grid size={{ xs: 6, md: 6 }}><StatCard label="Ganancia (30%)" value={`$${Number(data.gananciaTotal).toFixed(2)}`} accent /></Grid>
      </Grid>

      <RecentTable
        title="Últimos Traslados"
        data={data.ultimosTraslados}
        columns={[
          { key: 'origen', label: 'Origen' },
          { key: 'destino', label: 'Destino' },
          { key: 'costo', label: 'Costo', render: (v: any) => `$${Number(v).toFixed(2)}` },
          { key: 'estado', label: 'Estado', render: (v: any) => <StatusChip estado={v} /> },
        ]}
      />
    </Box>
  )
}

function ChoferDashboard({ data }: { data: any }) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <Grid container spacing={2}>
        <Grid size={{ xs: 6, md: 4 }}>
          <StatCard label="Por cobrar" value={`$${Math.max(0, Number(data.stats?.saldo_pendiente)).toFixed(2)}`} />
        </Grid>
        <Grid size={{ xs: 6, md: 4 }}>
          <StatCard label="Cobrado" value={`$${Number(data.stats?.saldo_pagado).toFixed(2)}`} accent />
        </Grid>
        <Grid size={{ xs: 6, md: 4 }}><StatCard label="Viajes pendientes" value={String(data.pendientes)} /></Grid>
        <Grid size={{ xs: 6, md: 6 }}><StatCard label="Completados" value={String(data.completados)} accent /></Grid>
        <Grid size={{ xs: 6, md: 6 }}><StatCard label="Vehículos" value={String(data.totalVehiculos)} /></Grid>
      </Grid>

      <RecentTable
        title="Últimos Viajes Asignados"
        data={data.ultimosViajes}
        columns={[
          { key: 'origen', label: 'Origen' },
          { key: 'destino', label: 'Destino' },
          { key: 'costo', label: 'Costo', render: (v: any) => `$${Number(v).toFixed(2)}` },
          { key: 'estado', label: 'Estado', render: (v: any) => <StatusChip estado={v} /> },
        ]}
      />
    </Box>
  )
}

function ClienteDashboard({ data }: { data: any }) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 2 }}>
            <Typography variant="overline" sx={{ color: 'text.secondary', display: 'block', mb: 0.5 }}>
              Saldo disponible
            </Typography>
            <Typography
              variant="h3"
              sx={{ fontFamily: 'Sora, sans-serif', fontWeight: 700, color: 'primary.main' }}
            >
              ${Number(data.saldo).toFixed(2)}
            </Typography>
          </Paper>
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}><StatCard label="Viajes realizados" value={String(data.totalViajes)} /></Grid>
        <Grid size={{ xs: 6, md: 3 }}><StatCard label="Recargas" value={String(data.totalRecargas)} accent /></Grid>
      </Grid>

      <RecentTable
        title="Últimos Viajes"
        data={data.ultimosViajes}
        columns={[
          { key: 'origen', label: 'Origen' },
          { key: 'destino', label: 'Destino' },
          { key: 'costo', label: 'Costo', render: (v: any) => `$${Number(v).toFixed(2)}` },
          { key: 'estado', label: 'Estado', render: (v: any) => <StatusChip estado={v} /> },
        ]}
      />
    </Box>
  )
}
