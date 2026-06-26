import { Response } from 'express'
import { prisma } from '../index'

export async function listar(req: any, res: Response) {
  const bancos = await prisma.banco.findMany({ orderBy: { nombre: 'asc' } })
  res.json(bancos)
}
