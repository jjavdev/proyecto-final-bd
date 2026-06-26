import { Response } from 'express'
import { prisma } from '../index'
import { AuthRequest } from '../middlewares/auth'
import { calcularTarifa } from '../utils/calcularTarifa'

export async function solicitarTraslado(req: AuthRequest, res: Response) {
  const { origen, destino, distancia_km } = req.body
  const usuario_id = req.usuario!.id

  const cliente = await prisma.cliente.findUnique({ where: { usuario_id } })
  if (!cliente) return res.status(404).json({ error: 'Cliente no encontrado' })

  const costo = calcularTarifa(distancia_km)

  if (cliente.saldo < costo) {
    return res.status(400).json({ error: 'Saldo insuficiente' })
  }

  // Asignar chofer aleatorio disponible
  const choferes = await prisma.$queryRaw<{ id: number }[]>`
    SELECT c.id FROM choferes c
    WHERE c.activo = true
    AND c.id NOT IN (
      SELECT t.chofer_id FROM traslados t
      WHERE t.estado = 'pendiente'
    )
    ORDER BY RANDOM()
    LIMIT 1
  `

  if (!choferes.length) {
    return res.status(400).json({ error: 'No hay choferes disponibles' })
  }

  const chofer_id = choferes[0].id

  const traslado = await prisma.$transaction([
    prisma.$executeRaw`
      INSERT INTO traslados (cliente_id, chofer_id, origen, destino, costo, estado, fecha)
      VALUES (${cliente.id}, ${chofer_id}, ${origen}, ${destino}, ${costo}, 'pendiente', NOW())
    `,
    prisma.$executeRaw`
      UPDATE clientes SET saldo = saldo - ${costo} WHERE id = ${cliente.id}
    `,
    prisma.$executeRaw`
      UPDATE choferes SET saldo_pendiente = saldo_pendiente + ${costo * 0.70} WHERE id = ${chofer_id}
    `
  ])

  res.status(201).json({ mensaje: 'Traslado asignado', chofer_id, costo })
}
