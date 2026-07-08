// Controlador de reportes: listado de traslados con filtros.
// Usa SQL dinamico parametrizado para construir consultas segun los filtros recibidos.

import { Response } from 'express'
import { prisma } from '../index'
import { AuthRequest } from '../middlewares/auth'

// GET /api/reportes/traslados — Lista traslados con datos del chofer, cliente y vehiculo.
// Filtros opcionales: inicio, fin (rango de fechas), estado, pagado (true/false).
export async function listarTraslados(req: AuthRequest, res: Response) {
  const { inicio, fin, estado, pagado } = req.query

  let sql = `
    SELECT t.id, t.origen, t.destino, t.costo, t.estado, t.fecha, t.pagado,
           u.nombre AS chofer_nombre, u.apellido AS chofer_apellido,
           c.nombre AS cliente_nombre, c.apellido AS cliente_apellido,
           v.placa
    FROM traslados t
    JOIN choferes ch ON t.chofer_id = ch.id
    JOIN usuarios u ON ch.usuario_id = u.id
    JOIN clientes cl ON t.cliente_id = cl.id
    JOIN usuarios c ON cl.usuario_id = c.id
    LEFT JOIN LATERAL (
      SELECT v2.placa FROM vehiculos v2 WHERE v2.chofer_id = ch.id AND v2.activo = true LIMIT 1
    ) v ON true
    WHERE 1=1
  `

  const params: any[] = []

  if (inicio) {
    params.push(inicio)
    sql += ` AND t.fecha >= $${params.length}::date`
  }
  if (fin) {
    params.push(fin)
    sql += ` AND t.fecha <= $${params.length}::date`
  }
  if (estado) {
    params.push(estado)
    sql += ` AND t.estado = $${params.length}`
  }
  if (pagado !== undefined) {
    params.push(pagado === 'true')
    sql += ` AND t.pagado = $${params.length}`
  }

  sql += ` ORDER BY t.fecha DESC`

  const traslados = await prisma.$queryRawUnsafe(sql, ...params)

  res.json(traslados)
}
