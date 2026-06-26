import { useState, FormEvent } from 'react'
import api from '../../services/api'
import Card from '../../components/Card'

export default function EvaluarChofer() {
  const [form, setForm] = useState({ chofer_id: '', nota: '' })
  const [msg, setMsg] = useState('')
  const [error, setError] = useState('')

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setMsg(''); setError('')
    try {
      const res = await api.post('/admin/evaluar-chofer', { chofer_id: parseInt(form.chofer_id), nota: parseInt(form.nota) })
      setMsg(`Evaluación registrada. ${res.data.aprobado ? 'Aprobado' : 'Reprobado'} (Nota: ${res.data.nota})`)
      setForm({ chofer_id: '', nota: '' })
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error al evaluar')
    }
  }

  return (
    <Card title="Evaluación Psicológica — Chofer">
      {msg && <p style={{ color: 'green' }}>{msg}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 400 }}>
        <input placeholder="ID del Chofer" type="number" value={form.chofer_id} onChange={(e) => setForm({ ...form, chofer_id: e.target.value })} required style={s} />
        <input placeholder="Nota (0-100)" type="number" min="0" max="100" value={form.nota} onChange={(e) => setForm({ ...form, nota: e.target.value })} required style={s} />
        <p style={{ fontSize: 12, color: '#888' }}>Nota mínima aprobatoria: 73</p>
        <button type="submit" style={btn}>Registrar Evaluación</button>
      </form>
    </Card>
  )
}

const s: React.CSSProperties = { padding: '10px 12px', border: '1px solid #ddd', borderRadius: 6, fontSize: 14 }
const btn: React.CSSProperties = { padding: '10px 12px', border: 'none', borderRadius: 6, background: '#1a1a2e', color: '#fff', fontSize: 14, cursor: 'pointer' }
