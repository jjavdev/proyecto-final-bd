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

  useEffect(() => {
    api.get('/choferes/listar').then((r) => setChoferes(r.data)).catch(() => {})
  }, [])

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setMsg(''); setError('')
    try {
      await api.post('/admin/pagar-chofer', { chofer_id: Number(choferId), monto: Number(monto), nro_referencia: nroReferencia })
      setMsg('Pago registrado exitosamente')
      setChoferId(''); setMonto(''); setNroReferencia('')
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error al registrar pago')
    }
  }

  const seleccionado = choferes.find((c: any) => c.id === Number(choferId))

  return (
    <Card title="Pagar a Chofer">
      {msg && <p style={{ color: 'green' }}>{msg}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 400 }}>
        <select value={choferId} onChange={(e) => setChoferId(e.target.value)} required style={s}>
          <option value="">Seleccionar Chofer</option>
          {choferes.map((c: any) => (
            <option key={c.id} value={c.id}>{c.nombre} {c.apellido} — Saldo pendiente: ${Number(c.saldo_pendiente).toFixed(2)}</option>
          ))}
        </select>
        {seleccionado && (
          <p style={{ fontSize: 12, color: '#888' }}>
            Banco: {seleccionado.banco || 'N/A'} | Cuenta: {seleccionado.nro_cuenta || 'N/A'} | Saldo pendiente: ${Number(seleccionado.saldo_pendiente).toFixed(2)}
          </p>
        )}
        <input placeholder="Monto a pagar ($)" type="number" step="0.01" value={monto} onChange={(e) => setMonto(e.target.value)} required style={s} />
        <input placeholder="Nro. Referencia" value={nroReferencia} onChange={(e) => setNroReferencia(e.target.value)} required style={s} />
        <button type="submit" style={btn}>Registrar Pago</button>
      </form>
    </Card>
  )
}

const s: React.CSSProperties = { padding: '10px 12px', border: '1px solid #ddd', borderRadius: 6, fontSize: 14 }
const btn: React.CSSProperties = { padding: '10px 12px', border: 'none', borderRadius: 6, background: '#1a1a2e', color: '#fff', fontSize: 14, cursor: 'pointer' }
