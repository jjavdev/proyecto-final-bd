import { useState, useEffect, FormEvent } from 'react'
import api from '../../services/api'
import Card from '../../components/Card'

export default function RecargarSaldo() {
  const [form, setForm] = useState({ monto: '', banco_id: '', nro_referencia: '' })
  const [bancos, setBancos] = useState<any[]>([])
  const [msg, setMsg] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    api.get('/bancos').then((r) => setBancos(r.data)).catch(() => {})
  }, [])

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setMsg(''); setError('')
    try {
      await api.post('/clientes/recargar', { ...form, monto: parseFloat(form.monto), banco_id: parseInt(form.banco_id) })
      setMsg('Saldo recargado exitosamente')
      setForm({ monto: '', banco_id: '', nro_referencia: '' })
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error al recargar')
    }
  }

  return (
    <Card title="Recargar Saldo">
      {msg && <p style={{ color: 'green' }}>{msg}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 400 }}>
        <input placeholder="Monto ($)" type="number" step="0.01" value={form.monto} onChange={(e) => setForm({ ...form, monto: e.target.value })} required style={inputStyle} />
        <select value={form.banco_id} onChange={(e) => setForm({ ...form, banco_id: e.target.value })} required style={inputStyle}>
          <option value="">Seleccionar banco</option>
          {bancos.map((b) => <option key={b.id} value={b.id}>{b.nombre}</option>)}
        </select>
        <input placeholder="Nro. Referencia" value={form.nro_referencia} onChange={(e) => setForm({ ...form, nro_referencia: e.target.value })} required style={inputStyle} />
        <button type="submit" style={btnStyle}>Recargar</button>
      </form>
    </Card>
  )
}

const inputStyle: React.CSSProperties = { padding: '10px 12px', border: '1px solid #ddd', borderRadius: 6, fontSize: 14 }
const btnStyle: React.CSSProperties = { padding: '10px 12px', border: 'none', borderRadius: 6, background: '#1a1a2e', color: '#fff', fontSize: 14, cursor: 'pointer' }
