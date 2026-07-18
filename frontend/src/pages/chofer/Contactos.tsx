import { useState, FormEvent } from 'react'
import api from '../../services/api'
import Card from '../../components/Card'

export default function Contactos() {
  const [contactos, setContactos] = useState([{ nombre: '', telefono: '', parentesco: '' }])
  const [msg, setMsg] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function addContacto() {
    if (contactos.length >= 5) return
    setContactos([...contactos, { nombre: '', telefono: '', parentesco: '' }])
  }

  function update(i: number, field: string, value: string) {
    const c = [...contactos]; (c[i] as any)[field] = value; setContactos(c)
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setMsg(''); setError('')
    setLoading(true)
    try {
      await api.post('/choferes/contactos', { contactos })
      setMsg('Contactos guardados exitosamente')
    } catch (err: any) {
      const msg = err.response?.data?.error
      setError(typeof msg === 'string' ? msg : 'Error al guardar')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card title="Contactos de Emergencia (mínimo 2)">
      {msg && <p className="text-primary text-sm text-center mb-4 py-2.5 px-4 bg-primary/10 border border-primary/30 rounded-md">{msg}</p>}
      {error && <p className="text-error text-sm text-center mb-4 py-2.5 px-4 bg-error/10 border border-error/30 rounded-md">{error}</p>}
      <form onSubmit={handleSubmit} className="flex flex-col gap-3 max-w-[600px]">
        {contactos.map((c, i) => (
          <div key={i} className="flex gap-2 items-center">
            <span className="font-bold text-on-surface-variant min-w-[20px] text-sm">{i + 1}.</span>
            <input placeholder="Nombre" value={c.nombre} onChange={(e) => update(i, 'nombre', e.target.value)} required className="flex-1 px-3 py-2 bg-surface border border-outline rounded-lg text-on-surface text-sm outline-none focus:border-primary transition-all" />
            <input placeholder="Teléfono" value={c.telefono} onChange={(e) => update(i, 'telefono', e.target.value.replace(/\D/g, ''))} required className="flex-1 px-3 py-2 bg-surface border border-outline rounded-lg text-on-surface text-sm outline-none focus:border-primary transition-all" />
            <input placeholder="Parentesco" value={c.parentesco} onChange={(e) => update(i, 'parentesco', e.target.value)} required className="flex-1 px-3 py-2 bg-surface border border-outline rounded-lg text-on-surface text-sm outline-none focus:border-primary transition-all" />
          </div>
        ))}
        <div className="flex gap-2">
          <button type="button" onClick={addContacto} disabled={contactos.length >= 5} className="px-4 py-2 rounded-lg bg-surface border border-outline text-on-surface text-sm hover:bg-surface-container transition-all disabled:opacity-50">+ Agregar Contacto</button>
          <button type="submit" className="px-4 py-2 rounded-lg bg-surface-container-high text-on-surface text-sm font-medium border border-outline hover:bg-surface-container transition-all flex items-center gap-2 disabled:opacity-50" disabled={loading}>
            {loading && <span className="w-4 h-4 border-2 border-on-surface border-t-transparent rounded-full animate-spin" />}
            {loading ? 'GUARDANDO...' : 'Guardar Contactos'}
          </button>
        </div>
      </form>
    </Card>
  )
}
