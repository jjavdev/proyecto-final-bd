// Rutas de reportes: ganancias de la empresa, pagos a choferes y listado de traslados.
// Accesible por PERSONAL_ADMIN y ADMIN.

import { Router } from 'express'
import { ganancias, pagosAChofer } from '../controllers/admin.controller'
import { listarTraslados } from '../controllers/reporte.controller'
import { authenticate, authorize } from '../middlewares/auth'

const router = Router()

router.get('/ganancias', authenticate, authorize('PERSONAL_ADMIN', 'ADMIN'), ganancias)
router.get('/pagos-chofer', authenticate, authorize('PERSONAL_ADMIN', 'ADMIN'), pagosAChofer)
router.get('/traslados', authenticate, authorize('PERSONAL_ADMIN', 'ADMIN'), listarTraslados)

export default router
