import { useState, useEffect, FormEvent } from 'react'
import api from '../../services/api'
import Card from '../../components/Card'

export default function PagarChofer() {
  const [choferId, setChoferId] = useState('')
  const [monto, setMonto] = useState('')
  const [nroReferencia, setNroReferencia] = useState('')
  const [choferes, setChoferes] = useState<any[]>([])
  const [msg, setMsg] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    api.get('/choferes/listar').then((r) => setChoferes(r.data)).catch(() => {})
  }, [])

  const seleccionado = choferes.find((c: any) => c.id === Number(choferId))

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setMsg(''); setError('')

    const montoNum = Math.round(Number(monto) * 100) / 100
    const pendiente = seleccionado ? Math.round(Number(seleccionado.saldo_pendiente) * 100) / 100 : 0

    if (montoNum < pendiente) {
      setError(`El monto ($${montoNum.toFixed(2)}) es menor al saldo pendiente ($${pendiente.toFixed(2)})`)
      return
    }
    if (montoNum > pendiente) {
      setError(`El monto ($${montoNum.toFixed(2)}) excede el saldo pendiente ($${pendiente.toFixed(2)})`)
      return
    }

    setLoading(true)
    try {
      await api.post('/admin/pagar-chofer', { chofer_id: Number(choferId), monto: montoNum, nro_referencia: nroReferencia })
      setMsg('Pago registrado exitosamente')
      setChoferId(''); setMonto(''); setNroReferencia('')
      api.get('/choferes/listar').then((r) => setChoferes(r.data)).catch(() => {})
    } catch (err: any) {
      const msg = err.response?.data?.error
      setError(typeof msg === 'string' ? msg : 'Error al registrar pago')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card title="Pagar a Chofer">
      {msg && <p className="text-primary text-sm text-center mb-4 py-2.5 px-4 bg-primary/10 border border-primary/30 rounded-md">{msg}</p>}
      {error && <p className="text-error text-sm text-center mb-4 py-2.5 px-4 bg-error/10 border border-error/30 rounded-md">{error}</p>}
      <form onSubmit={handleSubmit} className="flex flex-col gap-3 max-w-[400px]">
        <select value={choferId} onChange={(e) => setChoferId(e.target.value)} required className="w-full px-3 py-2.5 bg-surface border border-outline rounded-lg text-on-surface text-sm outline-none focus:border-primary transition-all">
          <option value="">Seleccionar Chofer</option>
          {choferes.map((c: any) => (
            <option key={c.id} value={c.id}>{c.nombre} {c.apellido} — Saldo pendiente: ${Number(c.saldo_pendiente).toFixed(2)}</option>
          ))}
        </select>
        {seleccionado && (
          <p className="text-xs text-on-surface-variant">
            Banco: {seleccionado.banco || 'N/A'} | Cuenta: {seleccionado.nro_cuenta || 'N/A'} | Saldo pendiente: ${Number(seleccionado.saldo_pendiente).toFixed(2)}
          </p>
        )}
        <input placeholder="Monto a pagar ($)" type="number" step="0.01" min="0.01" max="999999.99" value={monto} onChange={(e) => setMonto(e.target.value)} required className="w-full px-3 py-2.5 bg-surface border border-outline rounded-lg text-on-surface text-sm outline-none focus:border-primary transition-all" />
        <input placeholder="Nro. Referencia (4 dígitos)" type="text" maxLength={4} value={nroReferencia} onChange={(e) => setNroReferencia(e.target.value.replace(/\D/g, '').slice(0, 4))} required className="w-full px-3 py-2.5 bg-surface border border-outline rounded-lg text-on-surface text-sm outline-none focus:border-primary transition-all" />
        <button type="submit" className="w-full py-2.5 rounded-lg font-headline font-bold text-sm tracking-widest uppercase text-surface bg-gradient-to-r from-primary to-[#2be088] hover:from-[#2be088] hover:to-primary transition-all duration-300 shadow-lg shadow-primary/20 hover:shadow-primary/40 flex items-center justify-center gap-2 disabled:opacity-60" disabled={loading}>
          {loading && <span className="w-4 h-4 border-2 border-surface border-t-transparent rounded-full animate-spin" />}
          {loading ? 'REGISTRANDO...' : 'Registrar Pago'}
        </button>
      </form>
    </Card>
  )
}
