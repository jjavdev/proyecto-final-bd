import { useState, useEffect, FormEvent } from 'react'
import api from '../../services/api'
import Card from '../../components/Card'

export default function DatosBancarios() {
  const [bancos, setBancos] = useState<any[]>([])
  const [form, setForm] = useState({ banco_id: '', nro_cuenta: '' })
  const [msg, setMsg] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    api.get('/bancos').then((r) => setBancos(r.data)).catch(() => {})
  }, [])

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setMsg(''); setError('')
    try {
      await api.put('/choferes/banco', { banco_id: parseInt(form.banco_id), nro_cuenta: form.nro_cuenta })
      setMsg('Datos bancarios actualizados')
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error al actualizar')
    }
  }

  return (
    <Card title="Datos Bancarios">
      {msg && <p style={{ color: 'green' }}>{msg}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 400 }}>
        <select value={form.banco_id} onChange={(e) => setForm({ ...form, banco_id: e.target.value })} required style={s}>
          <option value="">Seleccionar banco</option>
          {bancos.map((b) => <option key={b.id} value={b.id}>{b.nombre}</option>)}
        </select>
        <input placeholder="Número de Cuenta" value={form.nro_cuenta} onChange={(e) => setForm({ ...form, nro_cuenta: e.target.value })} required style={s} />
        <button type="submit" style={btn}>Actualizar</button>
      </form>
    </Card>
  )
}

const s: React.CSSProperties = { padding: '10px 12px', border: '1px solid #ddd', borderRadius: 6, fontSize: 14 }
const btn: React.CSSProperties = { padding: '10px 12px', border: 'none', borderRadius: 6, background: '#1a1a2e', color: '#fff', fontSize: 14, cursor: 'pointer' }
