// Rutas del chofer: gestion de vehiculos, contactos de emergencia, viajes, datos bancarios y estadisticas.

import { Router } from 'express'
import { z } from 'zod'
import { registrarVehiculo, misVehiculos, contactosEmergencia, misViajes, actualizarBanco, stats, listarChoferes, evaluacionesChofer } from '../controllers/chofer.controller'
import { authenticate, authorize } from '../middlewares/auth'
import { validate } from '../middlewares/validate'

const router = Router()

const vehiculoSchema = z.object({
  placa: z.string().min(6, 'Mínimo 6 caracteres').max(10).regex(/^[A-Z0-9-]+$/, 'Formato inválido (ej: ABC-123)'),
  marca: z.string().min(1, 'Requerido').max(30).regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, 'Solo letras'),
  modelo: z.string().min(1, 'Requerido').max(30),
  anio: z.number().int().min(2000, 'Mínimo 2000').max(2030, 'Máximo 2030'),
  color: z.string().min(1, 'Requerido').max(30).regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, 'Solo letras')
})

const contactoSchema = z.object({
  contactos: z.array(z.object({
    nombre: z.string().min(1, 'Requerido').max(50).regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, 'Solo letras'),
    telefono: z.string().min(10, 'Mínimo 10 dígitos').max(15).regex(/^\+?\d+$/, 'Formato inválido'),
    parentesco: z.string().min(1, 'Requerido').max(50)
  })).min(2, 'Mínimo 2 contactos').max(5, 'Máximo 5 contactos')
})

const bancoSchema = z.object({
  banco_id: z.number().int(),
  nro_cuenta: z.string().min(5, 'Mínimo 5 caracteres').max(30, 'Máximo 30 caracteres').regex(/^\d+$/, 'Solo dígitos')
})

router.get('/vehiculos', authenticate, authorize('CHOFER'), misVehiculos)
router.post('/vehiculos', authenticate, authorize('CHOFER'), validate(vehiculoSchema), registrarVehiculo)
router.post('/contactos', authenticate, authorize('CHOFER'), validate(contactoSchema), contactosEmergencia)
router.get('/viajes', authenticate, authorize('CHOFER'), misViajes)
router.put('/banco', authenticate, authorize('CHOFER'), validate(bancoSchema), actualizarBanco)
router.get('/stats', authenticate, authorize('CHOFER'), stats)
router.get('/listar', authenticate, authorize('PERSONAL_ADMIN', 'ADMIN'), listarChoferes)
router.get('/:id/evaluaciones', authenticate, authorize('PERSONAL_ADMIN', 'CHOFER'), evaluacionesChofer)

export default router
