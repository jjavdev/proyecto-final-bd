import { Response } from 'express'
import { prisma } from '../index'
import { AuthRequest } from '../middlewares/auth'

export async function registrarVehiculo(req: AuthRequest, res: Response) {
  const { placa, marca, modelo, anio, color } = req.body
  const usuario_id = req.usuario!.id

  const chofer = await prisma.chofer.findUnique({ where: { usuario_id } })
  if (!chofer) return res.status(404).json({ error: 'Chofer no encontrado' })

  const vehiculo = await prisma.vehiculo.create({
    data: { chofer_id: chofer.id, placa, marca, modelo, anio, color }
  })

  res.status(201).json(vehiculo)
}

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

export async function misViajes(req: AuthRequest, res: Response) {
  const usuario_id = req.usuario!.id
  const chofer = await prisma.chofer.findUnique({ where: { usuario_id } })
  if (!chofer) return res.status(404).json({ error: 'Chofer no encontrado' })

  const viajes = await prisma.$queryRaw`
    SELECT t.id, t.origen, t.destino, t.costo, t.estado, t.fecha,
           cl.nombre AS cliente_nombre, cl.apellido AS cliente_apellido
    FROM traslados t
    JOIN usuarios cl ON cl.id = (SELECT c.usuario_id FROM clientes c WHERE c.id = t.cliente_id)
    WHERE t.chofer_id = ${chofer.id}
    ORDER BY t.fecha DESC
  `

  res.json(viajes)
}

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

export async function actualizarBanco(req: AuthRequest, res: Response) {
  const { banco_id, nro_cuenta } = req.body
  const usuario_id = req.usuario!.id

  const chofer = await prisma.chofer.update({
    where: { usuario_id },
    data: { banco_id, nro_cuenta }
  })

  res.json(chofer)
}
