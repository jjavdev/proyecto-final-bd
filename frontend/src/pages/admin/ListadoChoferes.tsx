import { useState } from 'react'
import api from '../../services/api'
import Card from '../../components/Card'
import Table from '../../components/Table'

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
        return (
          <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${v ? 'bg-primary/20 text-primary' : 'bg-surface-container-high text-on-surface-variant'}`}>
            {v ? 'Sí' : 'No'}
            {!vigente && v ? ' (Eval. vencida)' : ''}
          </span>
        )
      },
    },
    {
      key: 'ultima_evaluacion_nota', label: 'Últ. Evaluación',
      render: (v: number, row: any) => {
        if (!v) return <span className="text-on-surface-variant/60 italic text-sm">Sin evaluar</span>
        const fecha = row.ultima_evaluacion_fecha ? new Date(row.ultima_evaluacion_fecha).toLocaleDateString() : ''
        return `${v}/100 (${fecha})`
      },
    },
  ]

  return (
    <Card title="Listado de Choferes">
      <button onClick={load} disabled={loading} className="mb-4 px-4 py-2 rounded-lg bg-surface-container-high text-on-surface text-sm font-medium border border-outline hover:bg-surface-container transition-all flex items-center gap-2 disabled:opacity-50">
        {loading && <span className="w-4 h-4 border-2 border-on-surface border-t-transparent rounded-full animate-spin" />}
        {loading ? 'Cargando...' : 'Cargar Choferes'}
      </button>
      <Table columns={columns} data={data} emptyMsg="No hay choferes registrados" />
    </Card>
  )
}
