import { Router } from 'express'
import { z } from 'zod'
import { calificar, calificacionesPendientes, misCalificaciones } from '../controllers/calificacion.controller'
import { authenticate, authorize } from '../middlewares/auth'
import { validate } from '../middlewares/validate'

const router = Router()

const calificarSchema = z.object({
  traslado_id: z.number().int(),
  puntuacion: z.number().int().min(1).max(5),
  comentario: z.string().max(200).optional(),
})

router.get('/pendientes', authenticate, authorize('CLIENTE', 'CHOFER'), calificacionesPendientes)
router.get('/recibidas', authenticate, authorize('CLIENTE', 'CHOFER'), misCalificaciones)
router.post('/', authenticate, authorize('CLIENTE', 'CHOFER'), validate(calificarSchema), calificar)

export default router
