import { useState, useEffect } from 'react'
import api from '../../services/api'
import Card from '../../components/Card'
import Table from '../../components/Table'

export default function HistorialRecargas() {
  const [recargas, setRecargas] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/clientes/recargas').then((r) => setRecargas(r.data)).catch(() => {}).finally(() => setLoading(false))
  }, [])

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'monto', label: 'Monto', render: (v: number) => `$${v?.toFixed(2)}` },
    { key: 'banco', label: 'Banco' },
    { key: 'nro_referencia', label: 'Referencia' },
    { key: 'fecha', label: 'Fecha', render: (v: string) => new Date(v).toLocaleString() },
  ]

  if (loading) return <p>Cargando...</p>

  return (
    <Card title="Historial de Recargas">
      <Table columns={columns} data={recargas} emptyMsg="No has realizado recargas aún" />
    </Card>
  )
}
