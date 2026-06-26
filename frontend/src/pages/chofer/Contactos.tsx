import { useState, FormEvent } from 'react'
import api from '../../services/api'
import Card from '../../components/Card'

export default function Contactos() {
  const [contactos, setContactos] = useState([{ nombre: '', telefono: '', parentesco: '' }])
  const [msg, setMsg] = useState('')
  const [error, setError] = useState('')

  function addContacto() {
    setContactos([...contactos, { nombre: '', telefono: '', parentesco: '' }])
  }

  function update(i: number, field: string, value: string) {
    const c = [...contactos]; (c[i] as any)[field] = value; setContactos(c)
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setMsg(''); setError('')
    try {
      await api.post('/choferes/contactos', { contactos })
      setMsg('Contactos guardados exitosamente')
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error al guardar')
    }
  }

  return (
    <Card title="Contactos de Emergencia (mínimo 2)">
      {msg && <p style={{ color: 'green' }}>{msg}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 500 }}>
        {contactos.map((c, i) => (
          <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <span style={{ fontWeight: 600, minWidth: 20 }}>{i + 1}.</span>
            <input placeholder="Nombre" value={c.nombre} onChange={(e) => update(i, 'nombre', e.target.value)} required style={s} />
            <input placeholder="Teléfono" value={c.telefono} onChange={(e) => update(i, 'telefono', e.target.value)} required style={s} />
            <input placeholder="Parentesco" value={c.parentesco} onChange={(e) => update(i, 'parentesco', e.target.value)} required style={s} />
          </div>
        ))}
        <div style={{ display: 'flex', gap: 8 }}>
          <button type="button" onClick={addContacto} style={{ ...btn, background: '#555' }}>+ Agregar Contacto</button>
          <button type="submit" style={btn}>Guardar Contactos</button>
        </div>
      </form>
    </Card>
  )
}

const s: React.CSSProperties = { padding: '8px 10px', border: '1px solid #ddd', borderRadius: 6, fontSize: 14, flex: 1 }
const btn: React.CSSProperties = { padding: '10px 12px', border: 'none', borderRadius: 6, background: '#1a1a2e', color: '#fff', fontSize: 14, cursor: 'pointer' }
