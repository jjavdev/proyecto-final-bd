import { useState, useEffect } from 'react'
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
  const [choferes, setChoferes] = useState<any[]>([])

  useEffect(() => {
    api.get('/choferes/listar').then((r) => setChoferes(r.data)).catch(() => {})
  }, [])

  async function consultarGanancias(e: React.FormEvent) {
    e.preventDefault()
    setLoadingG(true)
    try {
      const params: any = {}
      if (inicio) params.inicio = inicio
      if (fin) params.fin = fin
      const r = await api.get('/reportes/ganancias', { params })
      setGanancias(r.data)
    } catch {} finally { setLoadingG(false) }
  }

  async function filtrarTodoGanancias() {
    setLoadingG(true)
    setInicio(''); setFin('')
    try {
      const r = await api.get('/reportes/ganancias')
      setGanancias(r.data)
    } catch {} finally { setLoadingG(false) }
  }

  async function consultarPagos(e: React.FormEvent) {
    e.preventDefault()
    if (!choferId) return
    setLoadingP(true)
    try {
      const params: any = { chofer_id: choferId }
      if (inicio) params.inicio = inicio
      if (fin) params.fin = fin
      const r = await api.get('/reportes/pagos-chofer', { params })
      setPagos(r.data)
    } catch {} finally { setLoadingP(false) }
  }

  async function filtrarTodoPagos() {
    if (!choferId) return
    setLoadingP(true)
    setInicio(''); setFin('')
    try {
      const r = await api.get('/reportes/pagos-chofer', { params: { chofer_id: choferId } })
      setPagos(r.data)
    } catch {} finally { setLoadingP(false) }
  }

  const seleccionado = choferes.find((c: any) => c.id === Number(choferId))

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
        <form onSubmit={consultarGanancias} className="flex gap-3 mb-5 items-end flex-wrap">
          <div><label className="text-xs text-on-surface-variant block mb-1">Inicio</label><input type="date" value={inicio} onChange={(e) => setInicio(e.target.value)} className="px-3 py-2 bg-surface border border-outline rounded-lg text-on-surface text-sm outline-none focus:border-primary transition-all" /></div>
          <div><label className="text-xs text-on-surface-variant block mb-1">Fin</label><input type="date" value={fin} onChange={(e) => setFin(e.target.value)} className="px-3 py-2 bg-surface border border-outline rounded-lg text-on-surface text-sm outline-none focus:border-primary transition-all" /></div>
          <button type="submit" disabled={loadingG} className="px-4 py-2 rounded-lg bg-surface-container-high text-on-surface text-sm font-medium border border-outline hover:bg-surface-container transition-all disabled:opacity-50">{loadingG ? '...' : 'Consultar'}</button>
          <button type="button" onClick={filtrarTodoGanancias} disabled={loadingG} className="px-4 py-2 rounded-lg bg-surface-container-high text-on-surface text-sm font-medium border border-outline hover:bg-surface-container transition-all disabled:opacity-50">Filtrar Todo</button>
        </form>
        {loadingG && !ganancias.length ? (
          <div className="flex items-center justify-center py-8"><div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" /></div>
        ) : (
          <Table columns={colG} data={ganancias} emptyMsg="Selecciona un período y consulta" />
        )}
      </Card>

      <Card title="Reporte de Pagos a Chofer">
        <form onSubmit={consultarPagos} className="flex gap-3 mb-5 items-end flex-wrap">
          <div>
            <label className="text-xs text-on-surface-variant block mb-1">Chofer</label>
            <select value={choferId} onChange={(e) => { setChoferId(e.target.value); setPagos([]) }} required className="px-3 py-2 bg-surface border border-outline rounded-lg text-on-surface text-sm outline-none focus:border-primary transition-all min-w-[200px]">
              <option value="">Seleccionar Chofer</option>
              {choferes.map((c: any) => (
                <option key={c.id} value={c.id}>{c.nombre} {c.apellido} — {c.cedula}</option>
              ))}
            </select>
          </div>
          <div><label className="text-xs text-on-surface-variant block mb-1">Inicio</label><input type="date" value={inicio} onChange={(e) => setInicio(e.target.value)} className="px-3 py-2 bg-surface border border-outline rounded-lg text-on-surface text-sm outline-none focus:border-primary transition-all" /></div>
          <div><label className="text-xs text-on-surface-variant block mb-1">Fin</label><input type="date" value={fin} onChange={(e) => setFin(e.target.value)} className="px-3 py-2 bg-surface border border-outline rounded-lg text-on-surface text-sm outline-none focus:border-primary transition-all" /></div>
          <button type="submit" disabled={loadingP || !choferId} className="px-4 py-2 rounded-lg bg-surface-container-high text-on-surface text-sm font-medium border border-outline hover:bg-surface-container transition-all disabled:opacity-50">{loadingP ? '...' : 'Consultar'}</button>
          <button type="button" onClick={filtrarTodoPagos} disabled={loadingP || !choferId} className="px-4 py-2 rounded-lg bg-surface-container-high text-on-surface text-sm font-medium border border-outline hover:bg-surface-container transition-all disabled:opacity-50">Filtrar Todo</button>
        </form>
        {seleccionado && (
          <p className="text-xs text-on-surface-variant mb-3">Banco: {seleccionado.banco || 'N/A'} | Cuenta: {seleccionado.nro_cuenta || 'N/A'}</p>
        )}
        {loadingP && !pagos.length ? (
          <div className="flex items-center justify-center py-8"><div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" /></div>
        ) : (
          <Table columns={colP} data={pagos} emptyMsg="Selecciona un chofer y consulta" />
        )}
      </Card>
    </>
  )
}
