import { useState, useEffect, FormEvent } from 'react'
import api from '../../services/api'
import Card from '../../components/Card'

export default function RecargarSaldo() {
  const [form, setForm] = useState({ monto: '', banco_id: '', nro_referencia: '' })
  const [bancos, setBancos] = useState<any[]>([])
  const [referencia, setReferencia] = useState<{ promedio: number; sugerido: number } | null>(null)
  const [msg, setMsg] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    api.get('/bancos').then((r) => setBancos(r.data)).catch(() => {})
    api.get('/clientes/referencia-recarga').then((r) => setReferencia(r.data)).catch(() => {})
  }, [])

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setMsg(''); setError('')
    setLoading(true)
    try {
      await api.post('/clientes/recargar', { ...form, monto: parseFloat(form.monto), banco_id: parseInt(form.banco_id) })
      setMsg('Saldo recargado exitosamente')
      setForm({ monto: '', banco_id: '', nro_referencia: '' })
    } catch (err: any) {
      const msg = err.response?.data?.error
      setError(typeof msg === 'string' ? msg : 'Error al recargar')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card title="Recargar Saldo">
      {msg && <p className="text-primary text-sm text-center mb-4 py-2.5 px-4 bg-primary/10 border border-primary/30 rounded-md">{msg}</p>}
      {error && <p className="text-error text-sm text-center mb-4 py-2.5 px-4 bg-error/10 border border-error/30 rounded-md">{error}</p>}
      <form onSubmit={handleSubmit} className="flex flex-col gap-3 max-w-[400px]">
        <input
          placeholder="Monto ($)"
          type="number"
          step="0.01"
          min="0.01"
          max="99999.99"
          value={form.monto}
          onChange={(e) => setForm({ ...form, monto: e.target.value })}
          className="w-full px-3 py-2.5 bg-surface border border-outline rounded-lg text-on-surface text-sm outline-none focus:border-primary transition-all"
          required
        />
        {referencia && (
          <p className="text-xs text-on-surface-variant/70 -mt-1">
            Costo promedio por viaje: <span className="text-primary font-semibold">${referencia.promedio.toFixed(2)}</span>
            {' · '}Sugerido: <span className="text-primary font-semibold">${referencia.sugerido.toFixed(2)}</span>
          </p>
        )}
        <select
          value={form.banco_id}
          onChange={(e) => setForm({ ...form, banco_id: e.target.value })}
          className="w-full px-3 py-2.5 bg-surface border border-outline rounded-lg text-on-surface text-sm outline-none focus:border-primary transition-all"
          required
        >
          <option value="">Seleccionar banco</option>
          {bancos.map((b) => <option key={b.id} value={b.id}>{b.nombre}</option>)}
        </select>
        <input
          placeholder="Nro. Referencia (4 dígitos)"
          type="text"
          maxLength={4}
          value={form.nro_referencia}
          onChange={(e) => setForm({ ...form, nro_referencia: e.target.value.replace(/\D/g, '').slice(0, 4) })}
          className="w-full px-3 py-2.5 bg-surface border border-outline rounded-lg text-on-surface text-sm outline-none focus:border-primary transition-all"
          required
        />
        <button
          type="submit"
          className="w-full py-2.5 rounded-lg font-headline font-bold text-sm tracking-widest uppercase text-surface bg-gradient-to-r from-primary to-[#2be088] transition-all duration-300 shadow-lg shadow-primary/20 hover:shadow-primary/40 flex items-center justify-center gap-2 disabled:opacity-60"
          disabled={loading}
        >
          {loading && <span className="w-4 h-4 border-2 border-surface border-t-transparent rounded-full animate-spin" />}
          {loading ? 'RECARGANDO...' : 'Recargar'}
        </button>
      </form>
    </Card>
  )
}
