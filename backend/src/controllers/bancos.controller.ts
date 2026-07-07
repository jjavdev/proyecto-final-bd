// Controlador de bancos: listado del catalogo de entidades bancarias.

import { Response } from 'express'
import { prisma } from '../index'

// GET /api/bancos — Devuelve la lista de bancos ordenada alfabeticamente.
export async function listar(req: any, res: Response) {
  const bancos = await prisma.banco.findMany({ orderBy: { nombre: 'asc' } })
  res.json(bancos)
}
