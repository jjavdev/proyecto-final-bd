import { Router } from 'express'
import { ganancias, pagosAChofer } from '../controllers/admin.controller'
import { authenticate, authorize } from '../middlewares/auth'

const router = Router()

router.get('/ganancias', authenticate, authorize('PERSONAL_ADMIN', 'ADMIN'), ganancias)
router.get('/pagos-chofer', authenticate, authorize('PERSONAL_ADMIN', 'ADMIN'), pagosAChofer)

export default router
