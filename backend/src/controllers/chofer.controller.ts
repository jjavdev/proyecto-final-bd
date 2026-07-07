// Controlador de funcionalidades del chofer: vehiculos, contactos, viajes y datos bancarios.

import { Response } from 'express'
import { prisma } from '../index'
import { AuthRequest } from '../middlewares/auth'

// POST /api/choferes/vehiculos — Registra un nuevo vehiculo para el chofer.
// El vehiculo nace con activo=false hasta que pase la revision tecnica.
export async function registrarVehiculo(req: AuthRequest, res: Response) {
  const { placa, marca, modelo, anio, color } = req.body
  const usuario_id = req.usuario!.id

  const chofer = await prisma.chofer.findUnique({ where: { usuario_id } })
  if (!chofer) return res.status(404).json({ error: 'Chofer no encontrado' })

  const vehiculo = await prisma.vehiculo.create({
    data: { chofer_id: chofer.id, placa, marca, modelo, anio, color, activo: false }
  })

  res.status(201).json(vehiculo)
}

// POST /api/choferes/contactos — Guarda los contactos de emergencia (minimo 2).
// Reemplaza todos los contactos existentes (borra y crea de nuevo).
export async function contactosEmergencia(req: AuthRequest, res: Response) {
  const { contactos } = req.body
  const usuario_id = req.usuario!.id

  const chofer = await prisma.chofer.findUnique({ where: { usuario_id } })
  if (!chofer) return res.status(404).json({ error: 'Chofer no encontrado' })

  await prisma.contactoEmergencia.deleteMany({ where: { chofer_id: chofer.id } })

  const creados = await Promise.all(
    contactos.map((c: { nombre: string; telefono: string; parentesco: string }) =>
      prisma.contactoEmergencia.create({
        data: { chofer_id: chofer.id, ...c }
      })
    )
  )

  res.status(201).json(creados)
}

// GET /api/choferes/viajes — Viajes asignados al chofer con filtros opcionales.
// Query params: inicio, fin (fechas), estado (pendiente/completado/cancelado).
export async function misViajes(req: AuthRequest, res: Response) {
  const usuario_id = req.usuario!.id
  const chofer = await prisma.chofer.findUnique({ where: { usuario_id } })
  if (!chofer) return res.status(404).json({ error: 'Chofer no encontrado' })

  const { inicio, fin, estado } = req.query

  let sql = `
    SELECT t.id, t.origen, t.destino, t.costo, t.estado, t.fecha,
           cl.nombre AS cliente_nombre, cl.apellido AS cliente_apellido
    FROM traslados t
    JOIN usuarios cl ON cl.id = (SELECT c.usuario_id FROM clientes c WHERE c.id = t.cliente_id)
    WHERE t.chofer_id = $1
  `

  const params: any[] = [chofer.id]
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

// GET /api/choferes/vehiculos — Lista los vehiculos registrados por el chofer.
export async function misVehiculos(req: AuthRequest, res: Response) {
  const usuario_id = req.usuario!.id
  const chofer = await prisma.chofer.findUnique({ where: { usuario_id } })
  if (!chofer) return res.status(404).json({ error: 'Chofer no encontrado' })

  const vehiculos = await prisma.vehiculo.findMany({
    where: { chofer_id: chofer.id },
    orderBy: { creado_en: 'desc' }
  })

  res.json(vehiculos)
}

// PUT /api/choferes/banco — Actualiza el banco y numero de cuenta del chofer.
export async function actualizarBanco(req: AuthRequest, res: Response) {
  const { banco_id, nro_cuenta } = req.body
  const usuario_id = req.usuario!.id

  const chofer = await prisma.chofer.update({
    where: { usuario_id },
    data: { banco_id, nro_cuenta }
  })

  res.json(chofer)
}

// GET /api/choferes/:id/evaluaciones — Historial de evaluaciones psicologicas de un chofer.
export async function evaluacionesChofer(req: AuthRequest, res: Response) {
  const { id } = req.params
  const evaluaciones = await prisma.$queryRaw`
    SELECT e.id, e.nota, e.aprobado, e.fecha, e.creado_en,
           u.nombre AS evaluador_nombre
    FROM evaluaciones_psicologicas e
    JOIN personal_admin p ON e.evaluador_id = p.id
    JOIN usuarios u ON p.usuario_id = u.id
    WHERE e.chofer_id = ${Number(id)}
    ORDER BY e.fecha DESC
  `
  res.json(evaluaciones)
}

// GET /api/choferes/listar — Lista todos los choferes con datos personales y financieros.
// Solo accesible por PERSONAL_ADMIN y ADMIN.
export async function listarChoferes(_req: AuthRequest, res: Response) {
  const choferes = await prisma.$queryRaw`
    SELECT c.id, u.nombre, u.apellido, u.cedula, u.email, c.activo,
           b.nombre AS banco, c.nro_cuenta, c.saldo_pendiente, c.saldo_pagado
    FROM choferes c
    JOIN usuarios u ON c.usuario_id = u.id
    LEFT JOIN bancos b ON c.banco_id = b.id
    ORDER BY u.nombre
  `
  res.json(choferes)
}

// GET /api/choferes/stats — Saldos pendiente y pagado del chofer autenticado.
export async function stats(req: AuthRequest, res: Response) {
  const usuario_id = req.usuario!.id

  const chofer = await prisma.chofer.findUnique({
    where: { usuario_id },
    select: { saldo_pendiente: true, saldo_pagado: true }
  })
  if (!chofer) return res.status(404).json({ error: 'Chofer no encontrado' })

  res.json(chofer)
}
