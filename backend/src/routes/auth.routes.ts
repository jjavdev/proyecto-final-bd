// Rutas de autenticacion: registro, login y perfil del usuario.
// El registro crea el usuario y su registro especifico segun el rol.
// Login y perfil son accesibles por cualquier usuario autenticado.

import { Router } from 'express'
import { z } from 'zod'
import { registro, login, perfil } from '../controllers/auth.controller'
import { authenticate } from '../middlewares/auth'
import { validate } from '../middlewares/validate'

const router = Router()

const registroSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  nombre: z.string().min(1),
  apellido: z.string().min(1),
  cedula: z.string().min(6),
  telefono: z.string().min(7),
  rol: z.enum(['CLIENTE', 'CHOFER', 'PERSONAL_ADMIN'])
})

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1)
})

router.post('/registro', validate(registroSchema), registro)
router.post('/login', validate(loginSchema), login)
router.get('/perfil', authenticate, perfil)

export default router
