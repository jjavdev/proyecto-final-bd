// Controlador de funcionalidades administrativas.
// Gestiona evaluaciones de choferes, revisiones de vehiculos, pagos y reportes financieros.

import { Response } from 'express'
import { prisma } from '../index'
import { AuthRequest } from '../middlewares/auth'

// POST /api/admin/evaluar-chofer — Crea evaluacion psicologica.
// Si la nota >= 73 activa al chofer para que pueda recibir traslados.
export async function evaluarChofer(req: AuthRequest, res: Response) {
  const { chofer_id, nota } = req.body
  const evaluador_id = req.usuario!.id

  if (nota < 0 || nota > 100) {
    return res.status(400).json({ error: 'Nota debe estar entre 0 y 100' })
  }

  const admin = await prisma.personalAdmin.findUnique({ where: { usuario_id: evaluador_id } })
  if (!admin) return res.status(403).json({ error: 'No autorizado' })

  const aprobado = nota >= 73

  const evaluacion = await prisma.evaluacionPsicologica.create({
    data: {
      chofer_id,
      nota,
      aprobado,
      fecha: new Date(),
      evaluador_id: admin.id
    }
  })

  if (aprobado) {
    await prisma.chofer.update({
      where: { id: chofer_id },
      data: { activo: true }
    })
  }

  res.status(201).json(evaluacion)
}

// POST /api/admin/revisar-vehiculo — Crea revision vehicular.
// Si la calificacion >= 65 activa el vehiculo para usarse en traslados.
export async function revisarVehiculo(req: AuthRequest, res: Response) {
  const { vehiculo_id, calificacion } = req.body
  const evaluador_id = req.usuario!.id

  if (calificacion < 0 || calificacion > 100) {
    return res.status(400).json({ error: 'Calificación debe estar entre 0 y 100' })
  }

  const admin = await prisma.personalAdmin.findUnique({ where: { usuario_id: evaluador_id } })
  if (!admin) return res.status(403).json({ error: 'No autorizado' })

  const apto = calificacion >= 65

  const revision = await prisma.revisionVehicular.create({
    data: {
      vehiculo_id,
      calificacion,
      apto,
      fecha: new Date(),
      evaluador_id: admin.id
    }
  })

  if (apto) {
    await prisma.vehiculo.update({
      where: { id: vehiculo_id },
      data: { activo: true }
    })
  }

  res.status(201).json(revision)
}

// POST /api/admin/pagar-chofer — Registra un pago al chofer en una transaccion.
// Descuenta de saldo_pendiente y suma a saldo_pagado.
export async function pagarChofer(req: AuthRequest, res: Response) {
  const { chofer_id, monto, nro_referencia } = req.body

  const chofer = await prisma.chofer.findUnique({ where: { id: chofer_id } })
  if (!chofer) {
    res.status(404).json({ error: 'Chofer no encontrado' })
    return
  }

  const pendiente = Math.round(Number(chofer.saldo_pendiente) * 100) / 100
  const montoRed = Math.round(Number(monto) * 100) / 100
  if (montoRed < pendiente) {
    res.status(400).json({ error: `El monto ($${montoRed.toFixed(2)}) es menor al saldo pendiente ($${pendiente.toFixed(2)})` })
    return
  }
  if (montoRed > pendiente) {
    res.status(400).json({ error: `El monto ($${montoRed.toFixed(2)}) excede el saldo pendiente ($${pendiente.toFixed(2)})` })
    return
  }

  await prisma.$transaction([
    prisma.$executeRaw`
      INSERT INTO pagos_chofer (chofer_id, monto, fecha, nro_referencia)
      VALUES (${chofer_id}, ${monto}, NOW(), ${nro_referencia})
    `,
    prisma.$executeRaw`
      UPDATE choferes SET saldo_pendiente = GREATEST(0, ROUND((saldo_pendiente - ${monto})::numeric, 2)::real),
                          saldo_pagado = ROUND((saldo_pagado + ${monto})::numeric, 2)::real
      WHERE id = ${chofer_id}
    `,
    prisma.$executeRaw`
      UPDATE traslados SET pagado = true
      WHERE chofer_id = ${chofer_id} AND estado = 'completado' AND pagado = false
    `
  ])

  res.status(201).json({ mensaje: 'Pago registrado' })
}

// GET /api/reportes/ganancias — Ganancias de la empresa agrupadas por dia.
// La empresa se queda con el 30% del costo de cada traslado completado.
export async function ganancias(req: AuthRequest, res: Response) {
  const { inicio, fin } = req.query
  const inicioVal = inicio || null
  const finVal = fin || null

  const ganancias = await prisma.$queryRaw`
    SELECT DATE(t.fecha) AS dia,
           COUNT(*) AS viajes,
           SUM(t.costo) AS total_bruto,
           SUM(t.costo * 0.30) AS ganancia_empresa
    FROM traslados t
    WHERE t.estado = 'completado'
      AND (${inicioVal}::date IS NULL OR t.fecha >= ${inicioVal}::date)
      AND (${finVal}::date IS NULL OR t.fecha <= ${finVal}::date)
    GROUP BY DATE(t.fecha)
    ORDER BY dia
  `

  const resultado = (ganancias as any[]).map((r: any) => ({
    dia: r.dia,
    viajes: Number(r.viajes),
    total_bruto: Number(r.total_bruto),
    ganancia_empresa: Number(r.ganancia_empresa),
  }))
  res.json(resultado)
}

// GET /api/reportes/pagos-chofer — Pagos realizados a un chofer en un periodo.
export async function pagosAChofer(req: AuthRequest, res: Response) {
  const { chofer_id, inicio, fin } = req.query
  const inicioVal = inicio || null
  const finVal = fin || null

  const pagos = await prisma.$queryRaw`
    SELECT p.id, p.monto, p.fecha, p.nro_referencia
    FROM pagos_chofer p
    WHERE p.chofer_id = ${Number(chofer_id)}
      AND (${inicioVal}::date IS NULL OR p.fecha >= ${inicioVal}::date)
      AND (${finVal}::date IS NULL OR p.fecha <= ${finVal}::date)
    ORDER BY p.fecha DESC
  `

  res.json(pagos)
}

// POST /api/admin/bancos — Agrega una nueva entidad bancaria al catalogo.
export async function crearBanco(req: AuthRequest, res: Response) {
  const { nombre } = req.body
  const banco = await prisma.banco.create({ data: { nombre } })
  res.status(201).json(banco)
}

// PUT /api/admin/choferes/:id/banco — Actualiza el banco y numero de cuenta de un chofer.
export async function actualizarBancoChofer(req: AuthRequest, res: Response) {
  const { id } = req.params
  const { banco_id, nro_cuenta } = req.body

  const chofer = await prisma.chofer.findUnique({ where: { id: Number(id) } })
  if (!chofer) return res.status(404).json({ error: 'Chofer no encontrado' })

  const actualizado = await prisma.chofer.update({
    where: { id: Number(id) },
    data: { banco_id, nro_cuenta }
  })

  res.json(actualizado)
}
