// Rutas de vehiculos: listado general e historial de revisiones tecnicas.

import { Router } from 'express'
import { listar, revisionesVehiculo } from '../controllers/vehiculo.controller'
import { authenticate, authorize } from '../middlewares/auth'

const router = Router()

router.get('/', authenticate, authorize('PERSONAL_ADMIN', 'ADMIN'), listar)
router.get('/:id/revisiones', authenticate, authorize('PERSONAL_ADMIN'), revisionesVehiculo)

export default router
