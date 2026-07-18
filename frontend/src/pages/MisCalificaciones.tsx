import { useState, useEffect } from 'react'
import api from '../services/api'
import Card from '../components/Card'
import StarRating from '../components/StarRating'

export default function MisCalificaciones() {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/calificaciones/recibidas')
      .then((r) => setData(r.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return (
    <Card title="Calificaciones Recibidas">
      {loading ? (
        <div className="flex items-center justify-center py-8">
          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : data.length === 0 ? (
        <p className="text-center text-on-surface-variant py-8">Aún no tienes calificaciones</p>
      ) : (
        <div className="space-y-3">
          {data.map((c: any) => (
            <div key={c.id} className="bg-surface-container border border-outline rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <StarRating value={c.puntuacion} readonly size="sm" />
                <span className="text-xs text-on-surface-variant/60">{new Date(c.creado_en).toLocaleDateString()}</span>
              </div>
              <p className="text-sm text-on-surface font-medium">{c.origen} → {c.destino}</p>
              <p className="text-xs text-on-surface-variant/60 mb-1">
                Calificado por: {c.calificador_nombre} {c.calificador_apellido}
              </p>
              {c.comentario && (
                <p className="text-sm text-on-surface-variant italic mt-1">"{c.comentario}"</p>
              )}
            </div>
          ))}
        </div>
      )}
    </Card>
  )
}
