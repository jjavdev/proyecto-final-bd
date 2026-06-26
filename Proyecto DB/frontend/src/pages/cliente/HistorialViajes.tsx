import { useState, useEffect } from 'react'
import api from '../../services/api'
import Card from '../../components/Card'
import Table from '../../components/Table'

export default function HistorialViajes() {
  const [viajes, setViajes] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/clientes/viajes').then((r) => setViajes(r.data)).catch(() => {}).finally(() => setLoading(false))
  }, [])

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'origen', label: 'Origen' },
    { key: 'destino', label: 'Destino' },
    { key: 'costo', label: 'Costo', render: (v: number) => `$${v?.toFixed(2)}` },
    { key: 'estado', label: 'Estado' },
    { key: 'fecha', label: 'Fecha', render: (v: string) => new Date(v).toLocaleDateString() },
    { key: 'chofer_nombre', label: 'Chofer' },
    { key: 'placa', label: 'Vehículo' },
  ]

  if (loading) return <p>Cargando...</p>

  return (
    <Card title="Historial de Viajes">
      <Table columns={columns} data={viajes} emptyMsg="No has realizado viajes aún" />
    </Card>
  )
}
