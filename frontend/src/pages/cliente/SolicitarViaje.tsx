import { useState, FormEvent } from 'react'
import api from '../../services/api'

const DISTANCIA_MAX = 999.9

export default function SolicitarViaje() {
  const [form, setForm] = useState({ origen: '', destino: '', distancia_km: '' })
  const [msg, setMsg] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [viaje, setViaje] = useState<any>(null)

  const costoEstimado = form.distancia_km
    ? (parseFloat(form.distancia_km) * 2.5).toFixed(2)
    : '—'

  function validarForm(): string | null {
    if (form.origen.trim().toLowerCase() === form.destino.trim().toLowerCase()) {
      return 'El origen y destino no pueden ser iguales'
    }
    if (parseFloat(form.distancia_km) > DISTANCIA_MAX) {
      return `La distancia máxima permitida es ${DISTANCIA_MAX} km`
    }
    return null
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setMsg(''); setError(''); setViaje(null)

    const errorMsg = validarForm()
    if (errorMsg) {
      setError(errorMsg)
      return
    }

    setLoading(true)
    try {
      const res = await api.post('/traslados', { ...form, distancia_km: parseFloat(form.distancia_km) })
      setViaje(res.data)
      setMsg('¡Viaje solicitado exitosamente!')
      setForm({ origen: '', destino: '', distancia_km: '' })
    } catch (err: any) {
      const msg = err.response?.data?.error
      setError(typeof msg === 'string' ? msg : 'Error al solicitar viaje')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center p-4 min-h-0">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-6">
          <h1 className="font-headline text-2xl font-bold text-on-surface mb-1">Solicitar Viaje</h1>
          <p className="text-on-surface-variant text-sm">Completa los datos para solicitar tu traslado</p>
        </div>

        <div className="grid md:grid-cols-5 gap-5">
          <div className="md:col-span-3 bg-surface-container border border-outline rounded-2xl p-5 md:p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold tracking-[0.08em] uppercase text-on-surface-variant mb-1.5">Origen</label>
                <input
                  placeholder="¿Dónde te recogemos?"
                  value={form.origen}
                  maxLength={200}
                  onChange={(e) => setForm({ ...form, origen: e.target.value })}
                  required
                  className="w-full px-4 py-3 bg-surface border border-outline rounded-xl text-on-surface placeholder-on-surface-variant/50 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all"
                />
              </div>

              <div className="flex items-center gap-2">
                <div className="flex-1 h-px bg-outline/30" />
                <span className="text-on-surface-variant/40 text-xs">↓</span>
                <div className="flex-1 h-px bg-outline/30" />
              </div>

              <div>
                <label className="block text-xs font-semibold tracking-[0.08em] uppercase text-on-surface-variant mb-1.5">Destino</label>
                <input
                  placeholder="¿A dónde vas?"
                  value={form.destino}
                  maxLength={200}
                  onChange={(e) => setForm({ ...form, destino: e.target.value })}
                  required
                  className="w-full px-4 py-3 bg-surface border border-outline rounded-xl text-on-surface placeholder-on-surface-variant/50 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold tracking-[0.08em] uppercase text-on-surface-variant mb-1.5">Distancia (km)</label>
                <input
                  placeholder="0.0"
                  type="number"
                  step="0.1"
                  min="0.1"
                  max={DISTANCIA_MAX}
                  value={form.distancia_km}
                  onChange={(e) => setForm({ ...form, distancia_km: e.target.value })}
                  required
                  className="w-full px-4 py-3 bg-surface border border-outline rounded-xl text-on-surface placeholder-on-surface-variant/50 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl font-headline font-bold text-sm tracking-widest uppercase text-surface
                         bg-gradient-to-r from-primary to-[#2be088] hover:from-[#2be088] hover:to-primary
                         transition-all duration-300 shadow-lg shadow-primary/20 hover:shadow-primary/40
                         flex items-center justify-center gap-2 disabled:opacity-60"
                disabled={loading}
              >
                {loading && <span className="w-4 h-4 border-2 border-surface border-t-transparent rounded-full animate-spin" />}
                {loading ? 'SOLICITANDO...' : 'Solicitar Viaje'}
              </button>
            </form>
          </div>

          <div className="md:col-span-2 space-y-3">
            <div className="bg-surface-container border border-outline rounded-2xl p-5">
              <h3 className="text-xs font-semibold tracking-[0.08em] uppercase text-on-surface-variant mb-1">Costo estimado</h3>
              <p className="font-headline text-2xl font-bold text-primary">
                {costoEstimado === '—' ? (
                  <span className="text-on-surface-variant/50">—</span>
                ) : (
                  <>${costoEstimado}</>
                )}
              </p>
              <p className="text-xs text-on-surface-variant/60 mt-0.5">Tarifa: $2.50/km</p>
            </div>

            <div className="bg-surface-container border border-outline rounded-2xl p-5 space-y-2">
              <h3 className="text-xs font-semibold tracking-[0.08em] uppercase text-on-surface-variant">Ruta</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-primary shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-on-surface font-medium truncate">{form.origen || <span className="text-on-surface-variant/40 italic">Origen</span>}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-px h-4 bg-primary/30 ml-[4.5px] shrink-0" />
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-error shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-on-surface font-medium truncate">{form.destino || <span className="text-on-surface-variant/40 italic">Destino</span>}</p>
                  </div>
                </div>
              </div>
              <p className="text-xs text-on-surface-variant/60">
                {form.distancia_km ? `${form.distancia_km} km` : '— km'}
              </p>
            </div>
          </div>
        </div>

        {msg && (
          <div className="mt-4 bg-primary/10 border border-primary/20 rounded-2xl p-4 text-center">
            <p className="text-primary font-semibold mb-3">{msg}</p>
            {viaje && (
              <div className="grid sm:grid-cols-3 gap-3 text-left">
                <div className="bg-surface-container-high rounded-xl p-3">
                  <p className="text-xs font-semibold tracking-[0.08em] uppercase text-on-surface-variant mb-1">Costo</p>
                  <p className="font-headline text-xl font-bold text-primary">${viaje.costo}</p>
                </div>
                <div className="bg-surface-container-high rounded-xl p-3">
                  <p className="text-xs font-semibold tracking-[0.08em] uppercase text-on-surface-variant mb-1">Chofer</p>
                  <p className="text-sm font-medium text-on-surface">{viaje.chofer.nombre} {viaje.chofer.apellido}</p>
                </div>
                <div className="bg-surface-container-high rounded-xl p-3">
                  <p className="text-xs font-semibold tracking-[0.08em] uppercase text-on-surface-variant mb-1">Vehículo</p>
                  <p className="text-sm font-medium text-on-surface">{viaje.vehiculo.marca} {viaje.vehiculo.modelo}</p>
                  <p className="text-xs text-on-surface-variant/60">{viaje.vehiculo.placa}</p>
                </div>
              </div>
            )}
          </div>
        )}

        {error && (
          <div className="mt-4 bg-error/10 border border-error/20 rounded-2xl p-3 text-center">
            <p className="text-error text-sm">{error}</p>
          </div>
        )}
      </div>
    </div>
  )
}
