// Rutas administrativas para PERSONAL_ADMIN: evaluaciones, revisiones, pagos, bancos.
// Incluye la actualizacion de datos bancarios de los choferes.

import { Router } from 'express'
import { z } from 'zod'
import {
  evaluarChofer, revisarVehiculo, pagarChofer, crearBanco, actualizarBancoChofer
} from '../controllers/admin.controller'
import { authenticate, authorize } from '../middlewares/auth'
import { validate } from '../middlewares/validate'

const router = Router()

const evaluacionSchema = z.object({
  chofer_id: z.number().int(),
  nota: z.number().int().min(0).max(100)
})

const revisionSchema = z.object({
  vehiculo_id: z.number().int(),
  calificacion: z.number().int().min(0).max(100)
})

const pagoSchema = z.object({
  chofer_id: z.number().int(),
  monto: z.number().positive(),
  nro_referencia: z.string().regex(/^\d{4}$/, 'Debe ser exactamente 4 dígitos numéricos')
})

const bancoSchema = z.object({
  nombre: z.string().min(1, 'Requerido').max(50)
})

const bancoChoferSchema = z.object({
  banco_id: z.number().int(),
  nro_cuenta: z.string().min(5, 'Mínimo 5 caracteres').max(30).regex(/^\d+$/, 'Solo dígitos')
})

router.post('/evaluar-chofer', authenticate, authorize('PERSONAL_ADMIN'), validate(evaluacionSchema), evaluarChofer)
router.post('/revisar-vehiculo', authenticate, authorize('PERSONAL_ADMIN'), validate(revisionSchema), revisarVehiculo)
router.post('/pagar-chofer', authenticate, authorize('PERSONAL_ADMIN'), validate(pagoSchema), pagarChofer)
router.post('/bancos', authenticate, authorize('PERSONAL_ADMIN'), validate(bancoSchema), crearBanco)
router.put('/choferes/:id/banco', authenticate, authorize('PERSONAL_ADMIN'), validate(bancoChoferSchema), actualizarBancoChofer)

export default router
