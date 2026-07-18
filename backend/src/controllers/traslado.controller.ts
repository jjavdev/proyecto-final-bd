// Controlador de traslados: solicitud, asignacion aleatoria, completado y cancelacion.

import { Response } from 'express'
import { prisma } from '../index'
import { AuthRequest } from '../middlewares/auth'
import { calcularTarifa } from '../utils/calcularTarifa'

// POST /api/traslados — Solicita un nuevo traslado.
// Calcula el costo, verifica saldo, asigna chofer aleatorio disponible,
// descuenta el saldo del cliente y acredita el 70% al chofer.
export async function solicitarTraslado(req: AuthRequest, res: Response) {
  const { origen, destino, distancia_km } = req.body
  const usuario_id = req.usuario!.id

  const cliente = await prisma.cliente.findUnique({ where: { usuario_id } })
  if (!cliente) return res.status(404).json({ error: 'Cliente no encontrado' })

  const costo = calcularTarifa(distancia_km)

  if (cliente.saldo < costo) {
    return res.status(400).json({ error: 'Saldo insuficiente' })
  }

  // Selecciona un chofer activo con vehiculo apto y revision vigente (< 1 año)
  const choferes = await prisma.$queryRaw<{ id: number }[]>`
    SELECT c.id FROM choferes c
    WHERE c.activo = true
    AND EXISTS (
      SELECT 1 FROM vehiculos v
      WHERE v.chofer_id = c.id AND v.activo = true
      AND EXISTS (
        SELECT 1 FROM revisiones_vehiculares rv
        WHERE rv.vehiculo_id = v.id
          AND rv.apto = true
          AND rv.fecha >= NOW() - INTERVAL '1 year'
      )
    )
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

  // Transaccion atomica: crea el traslado, descuenta al cliente, acredita al chofer
  await prisma.$transaction([
    prisma.$executeRaw`
      INSERT INTO traslados (cliente_id, chofer_id, origen, destino, costo, estado, fecha)
      VALUES (${cliente.id}, ${chofer_id}, ${origen}, ${destino}, ${costo}, 'pendiente', NOW())
    `,
    prisma.$executeRaw`
      UPDATE clientes SET saldo = saldo - ${costo} WHERE id = ${cliente.id}
    `,
    prisma.$executeRaw`
      UPDATE choferes SET saldo_pendiente = saldo_pendiente + ${Math.round(costo * 70) / 100} WHERE id = ${chofer_id}
    `
  ])

  // Datos del chofer y vehiculo para mostrar al cliente
  const choferData = await prisma.$queryRaw<{ nombre: string; apellido: string; placa: string; marca: string; modelo: string }[]>`
    SELECT u.nombre, u.apellido, v.placa, v.marca, v.modelo
    FROM choferes c
    JOIN usuarios u ON c.usuario_id = u.id
    LEFT JOIN LATERAL (
      SELECT v2.placa, v2.marca, v2.modelo FROM vehiculos v2
      WHERE v2.chofer_id = c.id AND v2.activo = true LIMIT 1
    ) v ON true
    WHERE c.id = ${chofer_id}
  `

  res.status(201).json({
    mensaje: 'Traslado asignado',
    costo,
    chofer: {
      id: chofer_id,
      nombre: choferData[0]?.nombre || '',
      apellido: choferData[0]?.apellido || '',
    },
    vehiculo: {
      placa: choferData[0]?.placa || '',
      marca: choferData[0]?.marca || '',
      modelo: choferData[0]?.modelo || '',
    }
  })
}

// PUT /api/traslados/:id/completar — Marca un traslado como completado.
// CHOFER solo puede completar sus propios traslados. PERSONAL_ADMIN puede completar cualquiera.
export async function completarTraslado(req: AuthRequest, res: Response) {
  const { id } = req.params
  const usuario = req.usuario!

  const traslado = await prisma.traslado.findUnique({ where: { id: Number(id) } })
  if (!traslado) return res.status(404).json({ error: 'Traslado no encontrado' })
  if (traslado.estado !== 'pendiente') return res.status(400).json({ error: 'El traslado no está pendiente' })

  if (usuario.rol === 'CHOFER') {
    const chofer = await prisma.chofer.findUnique({ where: { usuario_id: usuario.id } })
    if (!chofer || chofer.id !== traslado.chofer_id) {
      return res.status(403).json({ error: 'No puedes completar un traslado que no te pertenece' })
    }
  }

  await prisma.$executeRaw`UPDATE traslados SET estado = 'completado' WHERE id = ${Number(id)}`

  res.json({ mensaje: 'Traslado completado' })
}

// PUT /api/traslados/:id/cancelar — Cancela un traslado y reembolsa los saldos.
// Reversa: devuelve el saldo al cliente y descuenta lo pendiente del chofer.
export async function cancelarTraslado(req: AuthRequest, res: Response) {
  const { id } = req.params
  const usuario = req.usuario!

  const traslado = await prisma.traslado.findUnique({ where: { id: Number(id) } })
  if (!traslado) return res.status(404).json({ error: 'Traslado no encontrado' })
  if (traslado.estado !== 'pendiente') return res.status(400).json({ error: 'El traslado no está pendiente' })

  if (usuario.rol === 'CHOFER') {
    const chofer = await prisma.chofer.findUnique({ where: { usuario_id: usuario.id } })
    if (!chofer || chofer.id !== traslado.chofer_id) {
      return res.status(403).json({ error: 'No puedes cancelar un traslado que no te pertenece' })
    }
  }

  await prisma.$transaction([
    prisma.$executeRaw`UPDATE traslados SET estado = 'cancelado' WHERE id = ${Number(id)}`,
    prisma.$executeRaw`UPDATE clientes SET saldo = saldo + ${traslado.costo} WHERE id = ${traslado.cliente_id}`,
    prisma.$executeRaw`UPDATE choferes SET saldo_pendiente = saldo_pendiente - ${Math.round(traslado.costo * 70) / 100} WHERE id = ${traslado.chofer_id}`,
  ])

  res.json({ mensaje: 'Traslado cancelado y saldo reembolsado' })
}
