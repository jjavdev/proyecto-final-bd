import { useState, useEffect, FormEvent } from 'react'
import api from '../../services/api'
import Card from '../../components/Card'

export default function BancoChofer() {
  const [choferId, setChoferId] = useState('')
  const [bancoId, setBancoId] = useState('')
  const [nroCuenta, setNroCuenta] = useState('')
  const [choferes, setChoferes] = useState<any[]>([])
  const [bancos, setBancos] = useState<any[]>([])
  const [msg, setMsg] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    api.get('/choferes/listar').then((r) => setChoferes(r.data)).catch(() => {})
    api.get('/bancos').then((r) => setBancos(r.data)).catch(() => {})
  }, [])

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setMsg(''); setError('')
    try {
      await api.put(`/admin/choferes/${choferId}/banco`, {
        banco_id: Number(bancoId),
        nro_cuenta: nroCuenta,
      })
      setMsg(`Banco actualizado para el chofer`)
      setChoferId(''); setBancoId(''); setNroCuenta('')
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error al actualizar')
    }
  }

  return (
    <Card title="Asignar Banco a Chofer">
      {msg && <p style={{ color: 'green' }}>{msg}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 400 }}>
        <select value={choferId} onChange={(e) => setChoferId(e.target.value)} required style={s}>
          <option value="">Seleccionar Chofer</option>
          {choferes.map((c: any) => (
            <option key={c.id} value={c.id}>{c.nombre} {c.apellido} — {c.cedula}</option>
          ))}
        </select>
        <select value={bancoId} onChange={(e) => setBancoId(e.target.value)} required style={s}>
          <option value="">Seleccionar Banco</option>
          {bancos.map((b) => <option key={b.id} value={b.id}>{b.nombre}</option>)}
        </select>
        <input placeholder="Numero de Cuenta" value={nroCuenta} onChange={(e) => setNroCuenta(e.target.value)} required style={s} />
        <button type="submit" style={btn}>Guardar</button>
      </form>
    </Card>
  )
}

const s: React.CSSProperties = { padding: '10px 12px', border: '1px solid #ddd', borderRadius: 6, fontSize: 14 }
const btn: React.CSSProperties = { padding: '10px 12px', border: 'none', borderRadius: 6, background: '#1a1a2e', color: '#fff', fontSize: 14, cursor: 'pointer' }
