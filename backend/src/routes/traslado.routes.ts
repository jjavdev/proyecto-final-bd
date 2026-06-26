import { Router } from 'express'
import { z } from 'zod'
import { solicitarTraslado } from '../controllers/traslado.controller'
import { authenticate, authorize } from '../middlewares/auth'
import { validate } from '../middlewares/validate'

const router = Router()

const trasladoSchema = z.object({
  origen: z.string().min(1),
  destino: z.string().min(1),
  distancia_km: z.number().positive()
})

router.post('/', authenticate, authorize('CLIENTE'), validate(trasladoSchema), solicitarTraslado)

export default router
