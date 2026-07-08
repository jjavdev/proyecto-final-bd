// Controlador de vehiculos: listado e historial de revisiones.

import { Response } from 'express'
import { prisma } from '../index'
import { AuthRequest } from '../middlewares/auth'

// GET /api/vehiculos — Lista todos los vehiculos con datos del chofer asociado.
// Incluye estado de revision: revision_vigente = true si hay revision < 1 año.
export async function listar(_req: AuthRequest, res: Response) {
  const vehiculos = await prisma.$queryRaw`
    SELECT v.id, v.placa, v.marca, v.modelo, v.anio, v.color, v.activo,
           u.nombre AS chofer_nombre, u.apellido AS chofer_apellido,
           (SELECT rv.apto FROM revisiones_vehiculares rv
            WHERE rv.vehiculo_id = v.id
            ORDER BY rv.fecha DESC LIMIT 1
           ) AS ultima_revision_apta,
           (SELECT rv.fecha FROM revisiones_vehiculares rv
            WHERE rv.vehiculo_id = v.id
            ORDER BY rv.fecha DESC LIMIT 1
           ) AS ultima_revision_fecha
    FROM vehiculos v
    JOIN choferes c ON v.chofer_id = c.id
    JOIN usuarios u ON c.usuario_id = u.id
    ORDER BY v.placa
  `
  res.json(vehiculos)
}

// GET /api/vehiculos/:id/revisiones — Historial de revisiones tecnicas de un vehiculo.
export async function revisionesVehiculo(req: AuthRequest, res: Response) {
  const { id } = req.params
  const revisiones = await prisma.$queryRaw`
    SELECT r.id, r.calificacion, r.apto, r.fecha, r.creado_en,
           u.nombre AS evaluador_nombre
    FROM revisiones_vehiculares r
    JOIN personal_admin p ON r.evaluador_id = p.id
    JOIN usuarios u ON p.usuario_id = u.id
    WHERE r.vehiculo_id = ${Number(id)}
    ORDER BY r.fecha DESC
  `
  res.json(revisiones)
}
