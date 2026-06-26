import { useState, useEffect, FormEvent } from 'react'
import api from '../../services/api'
import Card from '../../components/Card'
import Table from '../../components/Table'

export default function Vehiculos() {
  const [vehiculos, setVehiculos] = useState([])
  const [form, setForm] = useState({ placa: '', marca: '', modelo: '', anio: '', color: '' })
  const [msg, setMsg] = useState('')
  const [error, setError] = useState('')

  async function load() {
    try {
      const r = await api.get('/choferes/vehiculos')
      setVehiculos(r.data)
    } catch {}
  }

  useEffect(() => { load() }, [])

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setMsg(''); setError('')
    try {
      await api.post('/choferes/vehiculos', { ...form, anio: parseInt(form.anio) })
      setMsg('Vehículo registrado')
      setForm({ placa: '', marca: '', modelo: '', anio: '', color: '' })
      load()
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error al registrar')
    }
  }

  const columns = [
    { key: 'placa', label: 'Placa' },
    { key: 'marca', label: 'Marca' },
    { key: 'modelo', label: 'Modelo' },
    { key: 'anio', label: 'Año' },
    { key: 'color', label: 'Color' },
    { key: 'activo', label: 'Activo', render: (v: boolean) => v ? 'Sí' : 'No' },
  ]

  return (
    <>
      <Card title="Registrar Vehículo">
        {msg && <p style={{ color: 'green' }}>{msg}</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 400 }}>
          <input placeholder="Placa" value={form.placa} onChange={(e) => setForm({ ...form, placa: e.target.value })} required style={s} />
          <input placeholder="Marca" value={form.marca} onChange={(e) => setForm({ ...form, marca: e.target.value })} required style={s} />
          <input placeholder="Modelo" value={form.modelo} onChange={(e) => setForm({ ...form, modelo: e.target.value })} required style={s} />
          <input placeholder="Año" type="number" value={form.anio} onChange={(e) => setForm({ ...form, anio: e.target.value })} required style={s} />
          <input placeholder="Color" value={form.color} onChange={(e) => setForm({ ...form, color: e.target.value })} required style={s} />
          <button type="submit" style={btn}>Registrar</button>
        </form>
      </Card>
      <Card title="Mis Vehículos">
        <Table columns={columns} data={vehiculos} emptyMsg="No tienes vehículos registrados" />
      </Card>
    </>
  )
}

const s: React.CSSProperties = { padding: '10px 12px', border: '1px solid #ddd', borderRadius: 6, fontSize: 14 }
const btn: React.CSSProperties = { padding: '10px 12px', border: 'none', borderRadius: 6, background: '#1a1a2e', color: '#fff', fontSize: 14, cursor: 'pointer' }
