import { useState, useEffect, FormEvent } from 'react'
import api from '../../services/api'
import Card from '../../components/Card'
import Table from '../../components/Table'

export default function Vehiculos() {
  const [vehiculos, setVehiculos] = useState<any[]>([])
  const [form, setForm] = useState({ placa: '', marca: '', modelo: '', anio: '', color: '' })
  const [msg, setMsg] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

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
    setLoading(true)
    try {
      await api.post('/choferes/vehiculos', { ...form, anio: parseInt(form.anio) })
      setMsg('Vehículo registrado')
      setForm({ placa: '', marca: '', modelo: '', anio: '', color: '' })
      load()
    } catch (err: any) {
      const msg = err.response?.data?.error
      setError(typeof msg === 'string' ? msg : 'Error al registrar')
    } finally {
      setLoading(false)
    }
  }

  const columns = [
    { key: 'placa', label: 'Placa' },
    { key: 'marca', label: 'Marca' },
    { key: 'modelo', label: 'Modelo' },
    { key: 'anio', label: 'Año' },
    { key: 'color', label: 'Color' },
    { key: 'activo', label: 'Activo', render: (v: boolean) => v ? 'Sí' : 'No' },
    {
      key: 'revision_vigente', label: 'Revisión',
      render: (v: boolean, row: any) => {
        if (row.ultima_revision_fecha) {
          const fecha = new Date(row.ultima_revision_fecha).toLocaleDateString()
          const ok = row.ultima_revision_apta && v
          return <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${ok ? 'bg-primary/20 text-primary' : 'bg-error/20 text-error'}`}>{ok ? `Vigente (${fecha})` : `Vencida (${fecha})`}</span>
        }
        return <span className="px-2 py-0.5 rounded-full text-xs bg-surface-container-high text-on-surface-variant">Sin revisión</span>
      },
    },
  ]

  return (
    <>
      <Card title="Registrar Vehículo">
        {msg && <p className="text-primary text-sm text-center mb-4 py-2.5 px-4 bg-primary/10 border border-primary/30 rounded-md">{msg}</p>}
        {error && <p className="text-error text-sm text-center mb-4 py-2.5 px-4 bg-error/10 border border-error/30 rounded-md">{error}</p>}
        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-3 max-w-[500px]">
          <input placeholder="Placa" value={form.placa} onChange={(e) => setForm({ ...form, placa: e.target.value.toUpperCase() })} required className="w-full px-3 py-2.5 bg-surface border border-outline rounded-lg text-on-surface text-sm outline-none focus:border-primary transition-all" />
          <input placeholder="Marca" value={form.marca} onChange={(e) => setForm({ ...form, marca: e.target.value })} required className="w-full px-3 py-2.5 bg-surface border border-outline rounded-lg text-on-surface text-sm outline-none focus:border-primary transition-all" />
          <input placeholder="Modelo" value={form.modelo} onChange={(e) => setForm({ ...form, modelo: e.target.value })} required className="w-full px-3 py-2.5 bg-surface border border-outline rounded-lg text-on-surface text-sm outline-none focus:border-primary transition-all" />
          <input placeholder="Año" type="number" min="2000" max="2030" value={form.anio} onChange={(e) => setForm({ ...form, anio: e.target.value })} required className="w-full px-3 py-2.5 bg-surface border border-outline rounded-lg text-on-surface text-sm outline-none focus:border-primary transition-all" />
          <input placeholder="Color" value={form.color} onChange={(e) => setForm({ ...form, color: e.target.value })} required className="w-full col-span-2 px-3 py-2.5 bg-surface border border-outline rounded-lg text-on-surface text-sm outline-none focus:border-primary transition-all" />
          <button type="submit" className="col-span-2 py-2.5 rounded-lg font-headline font-bold text-sm tracking-widest uppercase text-surface bg-gradient-to-r from-primary to-[#2be088] transition-all duration-300 shadow-lg shadow-primary/20 hover:shadow-primary/40 flex items-center justify-center gap-2 disabled:opacity-60" disabled={loading}>
            {loading && <span className="w-4 h-4 border-2 border-surface border-t-transparent rounded-full animate-spin" />}
            {loading ? 'REGISTRANDO...' : 'Registrar'}
          </button>
        </form>
      </Card>
      <Card title="Mis Vehículos">
        <Table columns={columns} data={vehiculos} emptyMsg="No tienes vehículos registrados" />
      </Card>
    </>
  )
}
