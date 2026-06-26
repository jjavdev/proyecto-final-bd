import { Router } from 'express'
import { z } from 'zod'
import { registrarVehiculo, misVehiculos, contactosEmergencia, misViajes, actualizarBanco } from '../controllers/chofer.controller'
import { authenticate, authorize } from '../middlewares/auth'
import { validate } from '../middlewares/validate'

const router = Router()

const vehiculoSchema = z.object({
  placa: z.string().min(6).max(10),
  marca: z.string().min(1),
  modelo: z.string().min(1),
  anio: z.number().int().min(2000).max(2030),
  color: z.string().min(1)
})

const contactoSchema = z.object({
  contactos: z.array(z.object({
    nombre: z.string().min(1),
    telefono: z.string().min(7),
    parentesco: z.string().min(1)
  })).min(2)
})

const bancoSchema = z.object({
  banco_id: z.number().int(),
  nro_cuenta: z.string().min(5)
})

router.get('/vehiculos', authenticate, authorize('CHOFER'), misVehiculos)
router.post('/vehiculos', authenticate, authorize('CHOFER'), validate(vehiculoSchema), registrarVehiculo)
router.post('/contactos', authenticate, authorize('CHOFER'), validate(contactoSchema), contactosEmergencia)
router.get('/viajes', authenticate, authorize('CHOFER'), misViajes)
router.put('/banco', authenticate, authorize('CHOFER'), validate(bancoSchema), actualizarBanco)

export default router
