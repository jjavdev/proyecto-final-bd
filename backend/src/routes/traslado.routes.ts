// Rutas de traslados: solicitud (cliente), completado y cancelacion (chofer/admin).
// La solicitud asigna un chofer aleatorio y calcula el costo automaticamente.

import { Router } from 'express'
import { z } from 'zod'
import { solicitarTraslado, completarTraslado, cancelarTraslado } from '../controllers/traslado.controller'
import { authenticate, authorize } from '../middlewares/auth'
import { validate } from '../middlewares/validate'

const router = Router()

const trasladoSchema = z.object({
  origen: z.string().min(1, 'Requerido').max(200),
  destino: z.string().min(1, 'Requerido').max(200),
  distancia_km: z.number().positive('Debe ser positiva').max(999.9, 'Máximo 999.9 km')
}).refine((data) => data.origen !== data.destino, {
  message: 'El origen y destino no pueden ser iguales',
  path: ['destino'],
})

router.post('/', authenticate, authorize('CLIENTE'), validate(trasladoSchema), solicitarTraslado)
router.put('/:id/completar', authenticate, authorize('CHOFER', 'PERSONAL_ADMIN'), completarTraslado)
router.put('/:id/cancelar', authenticate, authorize('CHOFER', 'PERSONAL_ADMIN'), cancelarTraslado)

export default router
