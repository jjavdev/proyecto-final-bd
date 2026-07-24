import { useState } from 'react'
import api from '../../services/api'
import Card from '../../components/Card'
import Table from '../../components/Table'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import Chip from '@mui/material/Chip'
import Typography from '@mui/material/Typography'

export default function ListadoChoferes() {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  async function load() {
    setLoading(true)
    try {
      const r = await api.get('/choferes/listar')
      setData(r.data)
    } catch {} finally { setLoading(false) }
  }

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'nombre', label: 'Nombre', render: (_: any, row: any) => `${row.nombre} ${row.apellido}` },
    { key: 'cedula', label: 'Cédula' },
    { key: 'email', label: 'Email' },
    { key: 'banco', label: 'Banco' },
    { key: 'nro_cuenta', label: 'Nro. Cuenta' },
    { key: 'saldo_pendiente', label: 'Por Cobrar', render: (v: number) => `$${Number(v).toFixed(2)}` },
    { key: 'saldo_pagado', label: 'Cobrado', render: (v: number) => `$${Number(v).toFixed(2)}` },
    {
      key: 'activo', label: 'Activo',
      render: (v: boolean, row: any) => {
        const vigente = row.evaluacion_vigente
        const label = v ? 'Sí' : 'No'
        const extra = !vigente && v ? ' (Eval. vencida)' : ''
        return <Chip label={label + extra} color={v ? 'primary' : 'default'} size="small" variant="outlined" />
      },
    },
    {
      key: 'ultima_evaluacion_nota', label: 'Últ. Evaluación',
      render: (v: number, row: any) => {
        if (!v) return <Typography variant="caption" sx={{ fontStyle: 'italic', color: 'text.secondary', opacity: 0.6 }}>Sin evaluar</Typography>
        const fecha = row.ultima_evaluacion_fecha ? new Date(row.ultima_evaluacion_fecha).toLocaleDateString() : ''
        return `${v}/100 (${fecha})`
      },
    },
  ]

  return (
    <Card title="Listado de Choferes">
      <Button variant="outlined" onClick={load} disabled={loading} sx={{ mb: 2, gap: 1 }}>
        {loading && <CircularProgress size={14} />}
        {loading ? 'Cargando...' : 'Cargar Choferes'}
      </Button>
      <Table columns={columns} data={data} emptyMsg="No hay choferes registrados" />
    </Card>
  )
}
