// Rutas del cliente: recarga de saldo, consulta de saldo, historial de recargas y viajes.
// Todas requieren autenticacion y rol CLIENTE.

import { Router } from 'express'
import { z } from 'zod'
import { recargarSaldo, historialRecargas, consultarSaldo, historialViajes, referenciaRecarga } from '../controllers/cliente.controller'
import { authenticate, authorize } from '../middlewares/auth'
import { validate } from '../middlewares/validate'

const router = Router()

const recargaSchema = z.object({
  monto: z.number().positive('Debe ser positivo').max(99999.99, 'Máximo $99,999.99'),
  banco_id: z.number().int('Requerido'),
  nro_referencia: z.string().regex(/^\d{4}$/, 'Debe ser exactamente 4 dígitos numéricos')
})

router.post('/recargar', authenticate, authorize('CLIENTE'), validate(recargaSchema), recargarSaldo)
router.get('/recargas', authenticate, authorize('CLIENTE'), historialRecargas)
router.get('/saldo', authenticate, authorize('CLIENTE'), consultarSaldo)
router.get('/viajes', authenticate, authorize('CLIENTE'), historialViajes)
router.get('/referencia-recarga', authenticate, authorize('CLIENTE'), referenciaRecarga)

export default router
