import { Response } from 'express'
import { prisma } from '../index'
import { AuthRequest } from '../middlewares/auth'

export async function evaluarChofer(req: AuthRequest, res: Response) {
  const { chofer_id, nota } = req.body
  const evaluador_id = req.usuario!.id

  if (nota < 0 || nota > 100) {
    return res.status(400).json({ error: 'Nota debe estar entre 0 y 100' })
  }

  const admin = await prisma.personalAdmin.findUnique({ where: { usuario_id: evaluador_id } })
  if (!admin) return res.status(403).json({ error: 'No autorizado' })

  const evaluacion = await prisma.evaluacionPsicologica.create({
    data: {
      chofer_id,
      nota,
      aprobado: nota >= 73,
      fecha: new Date(),
      evaluador_id: admin.id
    }
  })

  res.status(201).json(evaluacion)
}

export async function revisarVehiculo(req: AuthRequest, res: Response) {
  const { vehiculo_id, calificacion } = req.body
  const evaluador_id = req.usuario!.id

  if (calificacion < 0 || calificacion > 100) {
    return res.status(400).json({ error: 'Calificación debe estar entre 0 y 100' })
  }

  const admin = await prisma.personalAdmin.findUnique({ where: { usuario_id: evaluador_id } })
  if (!admin) return res.status(403).json({ error: 'No autorizado' })

  const revision = await prisma.revisionVehicular.create({
    data: {
      vehiculo_id,
      calificacion,
      apto: calificacion >= 65,
      fecha: new Date(),
      evaluador_id: admin.id
    }
  })

  res.status(201).json(revision)
}

export async function pagarChofer(req: AuthRequest, res: Response) {
  const { chofer_id, monto, nro_referencia } = req.body

  await prisma.$transaction([
    prisma.$executeRaw`
      INSERT INTO pagos_chofer (chofer_id, monto, fecha, nro_referencia)
      VALUES (${chofer_id}, ${monto}, NOW(), ${nro_referencia})
    `,
    prisma.$executeRaw`
      UPDATE choferes SET saldo_pendiente = saldo_pendiente - ${monto},
                          saldo_pagado = saldo_pagado + ${monto}
      WHERE id = ${chofer_id}
    `
  ])

  res.status(201).json({ mensaje: 'Pago registrado' })
}

export async function ganancias(req: AuthRequest, res: Response) {
  const { inicio, fin } = req.query

  const ganancias = await prisma.$queryRaw`
    SELECT DATE(t.fecha) AS dia,
           COUNT(*) AS viajes,
           SUM(t.costo) AS total_bruto,
           SUM(t.costo * 0.30) AS ganancia_empresa
    FROM traslados t
    WHERE t.estado = 'completado'
      AND t.fecha >= ${inicio}::date
      AND t.fecha <= ${fin}::date
    GROUP BY DATE(t.fecha)
    ORDER BY dia
  `

  res.json(ganancias)
}

export async function pagosAChofer(req: AuthRequest, res: Response) {
  const { chofer_id, inicio, fin } = req.query

  const pagos = await prisma.$queryRaw`
    SELECT p.id, p.monto, p.fecha, p.nro_referencia
    FROM pagos_chofer p
    WHERE p.chofer_id = ${Number(chofer_id)}
      AND p.fecha >= ${inicio}::date
      AND p.fecha <= ${fin}::date
    ORDER BY p.fecha DESC
  `

  res.json(pagos)
}

export async function crearBanco(req: AuthRequest, res: Response) {
  const { nombre } = req.body
  const banco = await prisma.banco.create({ data: { nombre } })
  res.status(201).json(banco)
}
