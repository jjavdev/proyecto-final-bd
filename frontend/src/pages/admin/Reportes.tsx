import { useState, useEffect } from 'react'
import api from '../../services/api'
import Card from '../../components/Card'
import Table from '../../components/Table'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import Typography from '@mui/material/Typography'

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
        <Box
          component="form"
          onSubmit={consultarGanancias}
          sx={{ display: 'flex', gap: 1.5, mb: 2.5, alignItems: 'flex-end', flexWrap: 'wrap' }}
        >
          <TextField label="Inicio" type="date" value={inicio} onChange={(e) => setInicio(e.target.value)} size="small" slotProps={{ inputLabel: { shrink: true } }} />
          <TextField label="Fin" type="date" value={fin} onChange={(e) => setFin(e.target.value)} size="small" slotProps={{ inputLabel: { shrink: true } }} />
          <Button type="submit" variant="outlined" disabled={loadingG}>{loadingG ? '...' : 'Consultar'}</Button>
          <Button type="button" variant="outlined" onClick={filtrarTodoGanancias} disabled={loadingG}>Filtrar Todo</Button>
        </Box>
        {loadingG && !ganancias.length ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}><CircularProgress size={24} /></Box>
        ) : (
          <Table columns={colG} data={ganancias} emptyMsg="Selecciona un período y consulta" />
        )}
      </Card>

      <Card title="Reporte de Pagos a Chofer">
        <Box
          component="form"
          onSubmit={consultarPagos}
          sx={{ display: 'flex', gap: 1.5, mb: 2.5, alignItems: 'flex-end', flexWrap: 'wrap' }}
        >
          <TextField
            select
            label="Chofer"
            value={choferId}
            onChange={(e) => { setChoferId(e.target.value); setPagos([]) }}
            required
            size="small"
            sx={{ minWidth: 200 }}
          >
            <MenuItem value="">Seleccionar Chofer</MenuItem>
            {choferes.map((c: any) => (
              <MenuItem key={c.id} value={c.id}>{c.nombre} {c.apellido} — {c.cedula}</MenuItem>
            ))}
          </TextField>
          <TextField label="Inicio" type="date" value={inicio} onChange={(e) => setInicio(e.target.value)} size="small" slotProps={{ inputLabel: { shrink: true } }} />
          <TextField label="Fin" type="date" value={fin} onChange={(e) => setFin(e.target.value)} size="small" slotProps={{ inputLabel: { shrink: true } }} />
          <Button type="submit" variant="outlined" disabled={loadingP || !choferId}>{loadingP ? '...' : 'Consultar'}</Button>
          <Button type="button" variant="outlined" onClick={filtrarTodoPagos} disabled={loadingP || !choferId}>Filtrar Todo</Button>
        </Box>
        {seleccionado && (
          <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 1.5 }}>
            Banco: {seleccionado.banco || 'N/A'} | Cuenta: {seleccionado.nro_cuenta || 'N/A'}
          </Typography>
        )}
        {loadingP && !pagos.length ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}><CircularProgress size={24} /></Box>
        ) : (
          <Table columns={colP} data={pagos} emptyMsg="Selecciona un chofer y consulta" />
        )}
      </Card>
    </>
  )
}
