// Controlador de funcionalidades del cliente: recarga de saldo, consultas e historial.

import { Response } from 'express'
import { prisma } from '../index'
import { AuthRequest } from '../middlewares/auth'

// POST /api/clientes/recargar — Recarga saldo del cliente.
// Crea registro en recargas_saldo e incrementa el saldo del cliente.
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

// GET /api/clientes/recargas — Historial de recargas del cliente.
// Incluye el nombre del banco mediante JOIN.
export async function historialRecargas(req: AuthRequest, res: Response) {
  const usuario_id = req.usuario!.id
  const cliente = await prisma.cliente.findUnique({ where: { usuario_id } })
  if (!cliente) return res.status(404).json({ error: 'Cliente no encontrado' })

  const recargas = await prisma.$queryRaw`
    SELECT r.id, r.monto, r.nro_referencia, r.fecha, b.nombre AS banco
    FROM recargas_saldo r
    JOIN bancos b ON r.banco_id = b.id
    WHERE r.cliente_id = ${cliente.id}
    ORDER BY r.fecha DESC
  `

  res.json(recargas)
}

// GET /api/clientes/saldo — Devuelve el saldo disponible del cliente.
export async function consultarSaldo(req: AuthRequest, res: Response) {
  const usuario_id = req.usuario!.id
  const cliente = await prisma.cliente.findUnique({
    where: { usuario_id },
    select: { saldo: true }
  })
  if (!cliente) return res.status(404).json({ error: 'Cliente no encontrado' })

  res.json({ saldo: cliente.saldo })
}

// GET /api/clientes/viajes — Historial de viajes del cliente con filtros opcionales.
// Filtros: inicio, fin (rango de fechas), estado (pendiente/completado/cancelado).
// Muestra datos del chofer y del vehiculo asignado.
export async function historialViajes(req: AuthRequest, res: Response) {
  const usuario_id = req.usuario!.id
  const { inicio, fin, estado } = req.query

  const cliente = await prisma.cliente.findUnique({ where: { usuario_id } })
  if (!cliente) return res.status(404).json({ error: 'Cliente no encontrado' })

  let sql = `
    SELECT t.id, t.origen, t.destino, t.costo, t.estado, t.fecha,
           u.nombre AS chofer_nombre, u.apellido AS chofer_apellido,
           v.placa, v.marca, v.modelo
    FROM traslados t
    JOIN choferes c ON t.chofer_id = c.id
    JOIN usuarios u ON c.usuario_id = u.id
    LEFT JOIN LATERAL (
      SELECT v2.placa, v2.marca, v2.modelo FROM vehiculos v2
      WHERE v2.chofer_id = c.id AND v2.activo = true LIMIT 1
    ) v ON true
    WHERE t.cliente_id = $1
  `

  const params: any[] = [cliente.id]
  let idx = 2

  if (inicio) {
    params.push(inicio)
    sql += ` AND t.fecha >= $${idx}::date`
    idx++
  }
  if (fin) {
    params.push(fin)
    sql += ` AND t.fecha <= $${idx}::date`
    idx++
  }
  if (estado) {
    params.push(estado)
    sql += ` AND t.estado = $${idx}`
    idx++
  }

  sql += ` ORDER BY t.fecha DESC`

  const viajes = await prisma.$queryRawUnsafe(sql, ...params)

  res.json(viajes)
}

// GET /api/clientes/referencia-recarga — Promedio de costo de viajes completados.
// Sirve como referencia para sugerir un monto maximo de recarga al cliente.
export async function referenciaRecarga(_req: AuthRequest, res: Response) {
  const result = await prisma.$queryRaw<{ promedio: number }[]>`
    SELECT COALESCE(AVG(costo), 0) AS promedio
    FROM traslados
    WHERE estado = 'completado'
  `
  const promedio = Number(result[0]?.promedio) || 10
  const sugerido = Math.ceil(promedio * 2 / 5) * 5
  res.json({ promedio: Math.round(promedio * 100) / 100, sugerido })
}
