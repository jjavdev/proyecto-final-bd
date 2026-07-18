import { useState, useEffect, FormEvent } from 'react'
import api from '../../services/api'
import Card from '../../components/Card'

export default function EvaluarChofer() {
  const [choferId, setChoferId] = useState('')
  const [nota, setNota] = useState('')
  const [choferes, setChoferes] = useState<any[]>([])
  const [msg, setMsg] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    api.get('/choferes/listar').then((r) => setChoferes(r.data)).catch(() => {})
  }, [])

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setMsg(''); setError('')
    setLoading(true)
    try {
      const res = await api.post('/admin/evaluar-chofer', { chofer_id: Number(choferId), nota: Number(nota) })
      setMsg(`Evaluación registrada. ${res.data.aprobado ? 'Aprobado — Chofer activado para trabajar' : 'Reprobado (mínimo 73)'} (Nota: ${res.data.nota})`)
      setChoferId(''); setNota('')
    } catch (err: any) {
      const msg = err.response?.data?.error
      setError(typeof msg === 'string' ? msg : 'Error al evaluar')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card title="Evaluación Psicológica — Chofer">
      {msg && <p className="text-primary text-sm text-center mb-4 py-2.5 px-4 bg-primary/10 border border-primary/30 rounded-md">{msg}</p>}
      {error && <p className="text-error text-sm text-center mb-4 py-2.5 px-4 bg-error/10 border border-error/30 rounded-md">{error}</p>}
      <form onSubmit={handleSubmit} className="flex flex-col gap-3 max-w-[400px]">
        <select value={choferId} onChange={(e) => setChoferId(e.target.value)} required className="w-full px-3 py-2.5 bg-surface border border-outline rounded-lg text-on-surface text-sm outline-none focus:border-primary transition-all">
          <option value="">Seleccionar Chofer</option>
          {choferes.map((c: any) => (
            <option key={c.id} value={c.id}>{c.nombre} {c.apellido} — {c.cedula}</option>
          ))}
        </select>
        <input placeholder="Nota (0-100)" type="number" min="0" max="100" value={nota} onChange={(e) => setNota(e.target.value)} required className="w-full px-3 py-2.5 bg-surface border border-outline rounded-lg text-on-surface text-sm outline-none focus:border-primary transition-all" />
        <p className="text-xs text-on-surface-variant">Nota mínima aprobatoria: 73</p>
        <button type="submit" className="w-full py-2.5 rounded-lg font-headline font-bold text-sm tracking-widest uppercase text-surface bg-gradient-to-r from-primary to-[#2be088] hover:from-[#2be088] hover:to-primary transition-all duration-300 shadow-lg shadow-primary/20 hover:shadow-primary/40 flex items-center justify-center gap-2 disabled:opacity-60" disabled={loading}>
          {loading && <span className="w-4 h-4 border-2 border-surface border-t-transparent rounded-full animate-spin" />}
          {loading ? 'REGISTRANDO...' : 'Registrar Evaluación'}
        </button>
      </form>
    </Card>
  )
}
