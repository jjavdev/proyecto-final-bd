import { useState } from 'react'
import api from '../../services/api'
import Card from '../../components/Card'
import Table from '../../components/Table'

export default function Reportes() {
  const [inicio, setInicio] = useState('')
  const [fin, setFin] = useState('')
  const [choferId, setChoferId] = useState('')
  const [ganancias, setGanancias] = useState<any[]>([])
  const [pagos, setPagos] = useState<any[]>([])
  const [loadingG, setLoadingG] = useState(false)
  const [loadingP, setLoadingP] = useState(false)

  async function consultarGanancias(e: React.FormEvent) {
    e.preventDefault()
    setLoadingG(true)
    try {
      const r = await api.get('/reportes/ganancias', { params: { inicio, fin } })
      setGanancias(r.data)
    } catch {} finally { setLoadingG(false) }
  }

  async function consultarPagos(e: React.FormEvent) {
    e.preventDefault()
    if (!choferId) return
    setLoadingP(true)
    try {
      const r = await api.get('/reportes/pagos-chofer', { params: { chofer_id: choferId, inicio, fin } })
      setPagos(r.data)
    } catch {} finally { setLoadingP(false) }
  }

  const colG = [
    { key: 'dia', label: 'Fecha', render: (v: string) => new Date(v).toLocaleDateString() },
    { key: 'viajes', label: 'Viajes' },
    { key: 'total_bruto', label: 'Bruto', render: (v: number) => `$${Number(v).toFixed(2)}` },
    { key: 'ganancia_empresa', label: 'Ganancia 30%', render: (v: number) => `$${Number(v).toFixed(2)}` },
  ]

  const colP = [
    { key: 'id', label: 'ID' },
    { key: 'monto', label: 'Monto', render: (v: number) => `$${Number(v).toFixed(2)}` },
    { key: 'nro_referencia', label: 'Referencia' },
    { key: 'fecha', label: 'Fecha', render: (v: string) => new Date(v).toLocaleString() },
  ]

  return (
    <>
      <Card title="Reporte de Ganancias (Empresa)">
        <form onSubmit={consultarGanancias} style={{ display: 'flex', gap: 12, marginBottom: 20, alignItems: 'end', flexWrap: 'wrap' }}>
          <div><label style={{ fontSize: 12, display: 'block' }}>Inicio</label><input type="date" value={inicio} onChange={(e) => setInicio(e.target.value)} required style={s} /></div>
          <div><label style={{ fontSize: 12, display: 'block' }}>Fin</label><input type="date" value={fin} onChange={(e) => setFin(e.target.value)} required style={s} /></div>
          <button type="submit" style={btn}>{loadingG ? '...' : 'Consultar'}</button>
        </form>
        <Table columns={colG} data={ganancias} emptyMsg="Selecciona un período y consulta" />
      </Card>

      <Card title="Reporte de Pagos a Chofer">
        <form onSubmit={consultarPagos} style={{ display: 'flex', gap: 12, marginBottom: 20, alignItems: 'end', flexWrap: 'wrap' }}>
          <div><label style={{ fontSize: 12, display: 'block' }}>ID Chofer</label><input placeholder="ID" type="number" value={choferId} onChange={(e) => setChoferId(e.target.value)} required style={{ ...s, width: 80 }} /></div>
          <div><label style={{ fontSize: 12, display: 'block' }}>Inicio</label><input type="date" value={inicio} onChange={(e) => setInicio(e.target.value)} required style={s} /></div>
          <div><label style={{ fontSize: 12, display: 'block' }}>Fin</label><input type="date" value={fin} onChange={(e) => setFin(e.target.value)} required style={s} /></div>
          <button type="submit" style={btn}>{loadingP ? '...' : 'Consultar'}</button>
        </form>
        <Table columns={colP} data={pagos} emptyMsg="Selecciona un chofer y período" />
      </Card>
    </>
  )
}

const s: React.CSSProperties = { padding: '10px 12px', border: '1px solid #ddd', borderRadius: 6, fontSize: 14 }
const btn: React.CSSProperties = { padding: '10px 12px', border: 'none', borderRadius: 6, background: '#1a1a2e', color: '#fff', fontSize: 14, cursor: 'pointer' }
