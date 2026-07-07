// Ruta publica del catalogo de bancos. No requiere autenticacion.

import { Router } from 'express'
import { listar } from '../controllers/bancos.controller'

const router = Router()

router.get('/', listar)

export default router
