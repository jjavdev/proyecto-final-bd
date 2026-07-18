import { useState, useEffect } from 'react'
import api from '../services/api'
import Card from '../components/Card'
import StarRating from '../components/StarRating'
import { useAuth } from '../context/AuthContext'

export default function CalificarViaje() {
  const { usuario } = useAuth()
  const [pendientes, setPendientes] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [enviando, setEnviando] = useState<number | null>(null)
  const [puntajes, setPuntajes] = useState<Record<number, number>>({})
  const [comentarios, setComentarios] = useState<Record<number, string>>({})
  const [msg, setMsg] = useState('')
  const [error, setError] = useState('')

  async function load() {
    setLoading(true)
    try {
      const r = await api.get('/calificaciones/pendientes')
      setPendientes(r.data)
    } catch {} finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])

  async function handleCalificar(id: number) {
    const puntuacion = puntajes[id]
    if (!puntuacion) {
      setError('Selecciona una puntuación')
      return
    }
    setEnviando(id)
    setMsg(''); setError('')
    try {
      await api.post('/calificaciones', { traslado_id: id, puntuacion, comentario: comentarios[id] || undefined })
      setMsg('Calificación enviada')
      setPendientes(pendientes.filter((p) => p.id !== id))
    } catch (err: any) {
      const msg = err.response?.data?.error
      setError(typeof msg === 'string' ? msg : 'Error al calificar')
    } finally {
      setEnviando(null)
    }
  }

  const esCliente = usuario?.rol === 'CLIENTE'
  const nombreCampo = esCliente ? 'chofer_nombre' : 'cliente_nombre'
  const apellidoCampo = esCliente ? 'chofer_apellido' : 'cliente_apellido'

  return (
    <Card title={esCliente ? 'Calificar a mi Chofer' : 'Calificar al Cliente'}>
      {msg && <p className="text-primary text-sm text-center mb-4 py-2.5 px-4 bg-primary/10 border border-primary/30 rounded-md">{msg}</p>}
      {error && <p className="text-error text-sm text-center mb-4 py-2.5 px-4 bg-error/10 border border-error/30 rounded-md">{error}</p>}

      {loading ? (
        <div className="flex items-center justify-center py-8">
          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : pendientes.length === 0 ? (
        <p className="text-center text-on-surface-variant py-8">No tienes viajes pendientes por calificar</p>
      ) : (
        <div className="space-y-4">
          {pendientes.map((v: any) => (
            <div key={v.id} className="bg-surface-container border border-outline rounded-xl p-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="text-sm font-medium text-on-surface">
                    {v.origen} → {v.destino}
                  </p>
                  <p className="text-xs text-on-surface-variant/60">
                    {v[nombreCampo]} {v[apellidoCampo]} · ${Number(v.costo).toFixed(2)} · {new Date(v.fecha).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 mb-2">
                <StarRating value={puntajes[v.id] || 0} onChange={(val) => setPuntajes({ ...puntajes, [v.id]: val })} />
                <span className="text-xs text-on-surface-variant/50">{puntajes[v.id] ? `${puntajes[v.id]}/5` : ''}</span>
              </div>
              <input
                placeholder="Comentario (opcional)"
                value={comentarios[v.id] || ''}
                maxLength={200}
                onChange={(e) => setComentarios({ ...comentarios, [v.id]: e.target.value })}
                className="w-full px-3 py-2 bg-surface border border-outline rounded-lg text-on-surface text-sm outline-none focus:border-primary transition-all mb-3"
              />
              <button
                onClick={() => handleCalificar(v.id)}
                disabled={enviando === v.id}
                className="px-4 py-2 rounded-lg bg-primary text-surface text-sm font-bold hover:brightness-110 transition-all disabled:opacity-50"
              >
                {enviando === v.id ? 'ENVIANDO...' : 'Enviar Calificación'}
              </button>
            </div>
          ))}
        </div>
      )}
    </Card>
  )
}
