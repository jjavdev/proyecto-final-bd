import { Response } from 'express'
import { prisma } from '../index'
import { AuthRequest } from '../middlewares/auth'

export async function calificar(req: AuthRequest, res: Response) {
  const { traslado_id, puntuacion, comentario } = req.body
  const usuario_id = req.usuario!.id
  const rol = req.usuario!.rol

  const traslado = await prisma.traslado.findUnique({
    where: { id: traslado_id },
    include: { cliente: true, chofer: true },
  })
  if (!traslado) return res.status(404).json({ error: 'Traslado no encontrado' })
  if (traslado.estado !== 'completado') return res.status(400).json({ error: 'Solo se puede calificar traslados completados' })

  let quienCalifica: string
  let calificadoId: number

  if (rol === 'CLIENTE') {
    const cliente = await prisma.cliente.findUnique({ where: { usuario_id } })
    if (!cliente || cliente.id !== traslado.cliente_id) return res.status(403).json({ error: 'No eres el cliente de este traslado' })
    quienCalifica = 'CLIENTE'
    calificadoId = traslado.chofer.usuario_id
  } else if (rol === 'CHOFER') {
    const chofer = await prisma.chofer.findUnique({ where: { usuario_id } })
    if (!chofer || chofer.id !== traslado.chofer_id) return res.status(403).json({ error: 'No eres el chofer de este traslado' })
    quienCalifica = 'CHOFER'
    calificadoId = traslado.cliente.usuario_id
  } else {
    return res.status(403).json({ error: 'Solo clientes y choferes pueden calificar' })
  }

  const existente = await prisma.calificacion.findUnique({
    where: { traslado_id_quien_califica: { traslado_id, quien_califica: quienCalifica } },
  })
  if (existente) return res.status(400).json({ error: 'Ya calificaste este traslado' })

  const calificacion = await prisma.calificacion.create({
    data: { traslado_id, quien_califica: quienCalifica, calificado_id: calificadoId, puntuacion, comentario },
  })

  res.status(201).json(calificacion)
}

export async function calificacionesPendientes(req: AuthRequest, res: Response) {
  const usuario_id = req.usuario!.id
  const rol = req.usuario!.rol

  if (rol === 'CLIENTE') {
    const cliente = await prisma.cliente.findUnique({ where: { usuario_id } })
    if (!cliente) return res.status(404).json({ error: 'Cliente no encontrado' })

    const pendientes = await prisma.$queryRaw`
      SELECT t.id, t.origen, t.destino, t.fecha, t.costo,
             u.nombre AS chofer_nombre, u.apellido AS chofer_apellido
      FROM traslados t
      JOIN choferes c ON t.chofer_id = c.id
      JOIN usuarios u ON c.usuario_id = u.id
      WHERE t.cliente_id = ${cliente.id}
        AND t.estado = 'completado'
        AND NOT EXISTS (
          SELECT 1 FROM calificaciones cc
          WHERE cc.traslado_id = t.id AND cc.quien_califica = 'CLIENTE'
        )
      ORDER BY t.fecha DESC
    `
    res.json(pendientes)
  } else if (rol === 'CHOFER') {
    const chofer = await prisma.chofer.findUnique({ where: { usuario_id } })
    if (!chofer) return res.status(404).json({ error: 'Chofer no encontrado' })

    const pendientes = await prisma.$queryRaw`
      SELECT t.id, t.origen, t.destino, t.fecha, t.costo,
             u.nombre AS cliente_nombre, u.apellido AS cliente_apellido
      FROM traslados t
      JOIN clientes c ON t.cliente_id = c.id
      JOIN usuarios u ON c.usuario_id = u.id
      WHERE t.chofer_id = ${chofer.id}
        AND t.estado = 'completado'
        AND NOT EXISTS (
          SELECT 1 FROM calificaciones cc
          WHERE cc.traslado_id = t.id AND cc.quien_califica = 'CHOFER'
        )
      ORDER BY t.fecha DESC
    `
    res.json(pendientes)
  } else {
    res.status(403).json({ error: 'Acción no permitida' })
  }
}

export async function misCalificaciones(req: AuthRequest, res: Response) {
  const usuario_id = req.usuario!.id

  const calificaciones = await prisma.$queryRaw`
    SELECT c.id, c.puntuacion, c.comentario, c.creado_en,
           t.origen, t.destino, t.fecha AS traslado_fecha,
           u.nombre AS calificador_nombre, u.apellido AS calificador_apellido
    FROM calificaciones c
    JOIN traslados t ON c.traslado_id = t.id
    JOIN usuarios u ON u.id = (
      CASE WHEN c.quien_califica = 'CLIENTE'
        THEN (SELECT cl.usuario_id FROM clientes cl WHERE cl.id = t.cliente_id)
        ELSE (SELECT ch.usuario_id FROM choferes ch WHERE ch.id = t.chofer_id)
      END
    )
    WHERE c.calificado_id = ${usuario_id}
    ORDER BY c.creado_en DESC
  `

  res.json(calificaciones)
}
