// Middleware de validacion de datos con Zod.
// Valida el body de las peticiones contra un esquema definido.
// Si falla, devuelve 400 con los errores de campo.

import { Request, Response, NextFunction } from 'express'
import { ZodSchema } from 'zod'

export function validate(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body)
    if (!result.success) {
      return res.status(400).json({ error: result.error.flatten().fieldErrors })
    }
    req.body = result.data
    next()
  }
}
