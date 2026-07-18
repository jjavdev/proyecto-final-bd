// Middleware de validacion de datos con Zod.
// Valida el body de las peticiones contra un esquema definido.
// Si falla, devuelve 400 con los errores de campo.

import { Request, Response, NextFunction } from 'express'
import { ZodSchema } from 'zod'

export function validate(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body)
    if (!result.success) {
      const flat = result.error.flatten()
      const msgs = Object.values(flat.fieldErrors).flat().concat(flat.formErrors)
      return res.status(400).json({ error: msgs.length ? msgs.join('. ') : 'Datos inválidos' })
    }
    req.body = result.data
    next()
  }
}
