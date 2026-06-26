import { useState, FormEvent } from 'react'
import api from '../../services/api'
import Card from '../../components/Card'

export default function PagarChofer() {
  const [form, setForm] = useState({ chofer_id: '', monto: '', nro_referencia: '' })
  const [msg, setMsg] = useState('')
  const [error, setError] = useState('')

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setMsg(''); setError('')
    try {
      await api.post('/admin/pagar-chofer', { chofer_id: parseInt(form.chofer_id), monto: parseFloat(form.monto), nro_referencia: form.nro_referencia })
      setMsg('Pago registrado exitosamente')
      setForm({ chofer_id: '', monto: '', nro_referencia: '' })
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error al registrar pago')
    }
  }

  return (
    <Card title="Pagar a Chofer">
      {msg && <p style={{ color: 'green' }}>{msg}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 400 }}>
        <input placeholder="ID del Chofer" type="number" value={form.chofer_id} onChange={(e) => setForm({ ...form, chofer_id: e.target.value })} required style={s} />
        <input placeholder="Monto a pagar ($)" type="number" step="0.01" value={form.monto} onChange={(e) => setForm({ ...form, monto: e.target.value })} required style={s} />
        <input placeholder="Nro. Referencia" value={form.nro_referencia} onChange={(e) => setForm({ ...form, nro_referencia: e.target.value })} required style={s} />
        <button type="submit" style={btn}>Registrar Pago</button>
      </form>
    </Card>
  )
}

const s: React.CSSProperties = { padding: '10px 12px', border: '1px solid #ddd', borderRadius: 6, fontSize: 14 }
const btn: React.CSSProperties = { padding: '10px 12px', border: 'none', borderRadius: 6, background: '#1a1a2e', color: '#fff', fontSize: 14, cursor: 'pointer' }
