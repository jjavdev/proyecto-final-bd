// Rutas de traslados: solicitud (cliente), completado y cancelacion (chofer/admin).
// La solicitud asigna un chofer aleatorio y calcula el costo automaticamente.

import { Router } from 'express'
import { z } from 'zod'
import { solicitarTraslado, completarTraslado, cancelarTraslado } from '../controllers/traslado.controller'
import { authenticate, authorize } from '../middlewares/auth'
import { validate } from '../middlewares/validate'

const router = Router()

const trasladoSchema = z.object({
  origen: z.string().min(1),
  destino: z.string().min(1),
  distancia_km: z.number().positive()
})

router.post('/', authenticate, authorize('CLIENTE'), validate(trasladoSchema), solicitarTraslado)
router.put('/:id/completar', authenticate, authorize('CHOFER', 'PERSONAL_ADMIN'), completarTraslado)
router.put('/:id/cancelar', authenticate, authorize('CHOFER', 'PERSONAL_ADMIN'), cancelarTraslado)

export default router
