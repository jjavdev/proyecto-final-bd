import { Response } from 'express'
import { prisma } from '../index'
import { AuthRequest } from '../middlewares/auth'

export async function recargarSaldo(req: AuthRequest, res: Response) {
  const { monto, banco_id, nro_referencia } = req.body
  const usuario_id = req.usuario!.id

  const cliente = await prisma.cliente.findUnique({ where: { usuario_id } })
  if (!cliente) return res.status(404).json({ error: 'Cliente no encontrado' })

  const recarga = await prisma.recargaSaldo.create({
    data: { cliente_id: cliente.id, monto, banco_id, nro_referencia }
  })

  await prisma.cliente.update({
    where: { id: cliente.id },
    data: { saldo: { increment: monto } }
  })

  res.status(201).json(recarga)
}

export async function historialRecargas(req: AuthRequest, res: Response) {
  const usuario_id = req.usuario!.id
  const cliente = await prisma.cliente.findUnique({ where: { usuario_id } })
  if (!cliente) return res.status(404).json({ error: 'Cliente no encontrado' })

  // SQL crudo para reporte de recargas
  const recargas = await prisma.$queryRaw`
    SELECT r.id, r.monto, r.nro_referencia, r.fecha, b.nombre AS banco
    FROM recargas_saldo r
    JOIN bancos b ON r.banco_id = b.id
    WHERE r.cliente_id = ${cliente.id}
    ORDER BY r.fecha DESC
  `

  res.json(recargas)
}

export async function consultarSaldo(req: AuthRequest, res: Response) {
  const usuario_id = req.usuario!.id
  const cliente = await prisma.cliente.findUnique({
    where: { usuario_id },
    select: { saldo: true }
  })
  if (!cliente) return res.status(404).json({ error: 'Cliente no encontrado' })

  res.json({ saldo: cliente.saldo })
}

export async function historialViajes(req: AuthRequest, res: Response) {
  const usuario_id = req.usuario!.id
  const cliente = await prisma.cliente.findUnique({ where: { usuario_id } })
  if (!cliente) return res.status(404).json({ error: 'Cliente no encontrado' })

  const viajes = await prisma.$queryRaw`
    SELECT t.id, t.origen, t.destino, t.costo, t.estado, t.fecha,
           u.nombre AS chofer_nombre, v.placa, v.marca, v.modelo
    FROM traslados t
    JOIN choferes c ON t.chofer_id = c.id
    JOIN usuarios u ON c.usuario_id = u.id
    JOIN vehiculos v ON v.chofer_id = c.id AND v.activo = true
    WHERE t.cliente_id = ${cliente.id}
    ORDER BY t.fecha DESC
  `

  res.json(viajes)
}
