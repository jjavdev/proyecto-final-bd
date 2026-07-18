import { useState, useEffect, FormEvent } from 'react'
import api from '../../services/api'
import Card from '../../components/Card'

export default function DatosBancarios() {
  const [bancos, setBancos] = useState<any[]>([])
  const [form, setForm] = useState({ banco_id: '', nro_cuenta: '' })
  const [msg, setMsg] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    api.get('/bancos').then((r) => setBancos(r.data)).catch(() => {})
  }, [])

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setMsg(''); setError('')
    setLoading(true)
    try {
      await api.put('/choferes/banco', { banco_id: parseInt(form.banco_id), nro_cuenta: form.nro_cuenta })
      setMsg('Datos bancarios actualizados')
    } catch (err: any) {
      const msg = err.response?.data?.error
      setError(typeof msg === 'string' ? msg : 'Error al actualizar')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card title="Datos Bancarios">
      {msg && <p className="text-primary text-sm text-center mb-4 py-2.5 px-4 bg-primary/10 border border-primary/30 rounded-md">{msg}</p>}
      {error && <p className="text-error text-sm text-center mb-4 py-2.5 px-4 bg-error/10 border border-error/30 rounded-md">{error}</p>}
      <form onSubmit={handleSubmit} className="flex flex-col gap-3 max-w-[400px]">
        <select value={form.banco_id} onChange={(e) => setForm({ ...form, banco_id: e.target.value })} required className="w-full px-3 py-2.5 bg-surface border border-outline rounded-lg text-on-surface text-sm outline-none focus:border-primary transition-all">
          <option value="">Seleccionar banco</option>
          {bancos.map((b) => <option key={b.id} value={b.id}>{b.nombre}</option>)}
        </select>
        <input placeholder="Número de Cuenta" value={form.nro_cuenta} maxLength={30} onChange={(e) => setForm({ ...form, nro_cuenta: e.target.value.replace(/\D/g, '') })} required className="w-full px-3 py-2.5 bg-surface border border-outline rounded-lg text-on-surface text-sm outline-none focus:border-primary transition-all" />
        <button type="submit" className="w-full py-2.5 rounded-lg font-headline font-bold text-sm tracking-widest uppercase text-surface bg-gradient-to-r from-primary to-[#2be088] transition-all duration-300 shadow-lg shadow-primary/20 hover:shadow-primary/40 flex items-center justify-center gap-2 disabled:opacity-60" disabled={loading}>
          {loading && <span className="w-4 h-4 border-2 border-surface border-t-transparent rounded-full animate-spin" />}
          {loading ? 'ACTUALIZANDO...' : 'Actualizar'}
        </button>
      </form>
    </Card>
  )
}
