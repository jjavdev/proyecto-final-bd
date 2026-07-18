// Rutas de autenticacion: registro, login y perfil del usuario.
// El registro crea el usuario y su registro especifico segun el rol.
// Login y perfil son accesibles por cualquier usuario autenticado.

import { Router } from 'express'
import { z } from 'zod'
import rateLimit from 'express-rate-limit'
import { registro, login, perfil } from '../controllers/auth.controller'
import { authenticate } from '../middlewares/auth'
import { validate } from '../middlewares/validate'

const router = Router()

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { error: 'Demasiados intentos de inicio de sesión. Intenta de nuevo en 15 minutos.' },
  standardHeaders: true,
  legacyHeaders: false,
})

const registroSchema = z.object({
  email: z.string().email('Correo electrónico inválido').max(100),
  password: z.string().min(6, 'Mínimo 6 caracteres').max(50),
  nombre: z.string().min(1, 'Requerido').max(50).regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, 'Solo letras permitidas'),
  apellido: z.string().min(1, 'Requerido').max(50).regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, 'Solo letras permitidas'),
  cedula: z.string().min(7, 'Mínimo 7 dígitos').max(10).regex(/^\d+$/, 'Solo dígitos'),
  telefono: z.string().min(10, 'Mínimo 10 dígitos').max(15).regex(/^\+?\d+$/, 'Formato inválido (ej: +58412XXXXXXX)'),
  rol: z.enum(['CLIENTE', 'CHOFER', 'PERSONAL_ADMIN'])
})

const loginSchema = z.object({
  email: z.string().email('Correo electrónico inválido'),
  password: z.string().min(1, 'Contraseña requerida')
})

router.post('/registro', validate(registroSchema), registro)
router.post('/login', loginLimiter, validate(loginSchema), login)
router.get('/perfil', authenticate, perfil)

export default router
