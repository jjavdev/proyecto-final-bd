// Controlador de autenticacion: registro, inicio de sesion y perfil.

import { Response } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { prisma } from '../index'
import { AuthRequest } from '../middlewares/auth'

// POST /api/auth/registro — Crea usuario + registro especifico segun el rol.
// CHOFER nace con activo=false hasta que pase la evaluacion psicologica.
export async function registro(req: AuthRequest, res: Response) {
  const { email, password, nombre, apellido, cedula, telefono, rol } = req.body

  const existe = await prisma.usuario.findUnique({ where: { email } })
  if (existe) return res.status(400).json({ error: 'Email ya registrado' })

  const password_hash = await bcrypt.hash(password, 10)

  const usuario = await prisma.usuario.create({
    data: { email, password_hash, nombre, apellido, cedula, telefono, rol }
  })

  if (rol === 'CHOFER') {
    await prisma.chofer.create({
      data: { usuario_id: usuario.id, banco_id: 1, nro_cuenta: '', activo: false }
    })
  } else if (rol === 'CLIENTE') {
    await prisma.cliente.create({ data: { usuario_id: usuario.id } })
  } else if (rol === 'PERSONAL_ADMIN') {
    await prisma.personalAdmin.create({ data: { usuario_id: usuario.id } })
  }

  const token = jwt.sign({ id: usuario.id, rol: usuario.rol }, process.env.JWT_SECRET!, { expiresIn: '7d' })

  res.status(201).json({ token, usuario: { id: usuario.id, email: usuario.email, nombre: usuario.nombre, rol: usuario.rol } })
}

// POST /api/auth/login — Valida credenciales y devuelve JWT.
export async function login(req: AuthRequest, res: Response) {
  const { email, password } = req.body

  const usuario = await prisma.usuario.findUnique({ where: { email } })
  if (!usuario) return res.status(401).json({ error: 'Credenciales inválidas' })

  const valido = await bcrypt.compare(password, usuario.password_hash)
  if (!valido) return res.status(401).json({ error: 'Credenciales inválidas' })

  const token = jwt.sign({ id: usuario.id, rol: usuario.rol }, process.env.JWT_SECRET!, { expiresIn: '7d' })

  res.json({ token, usuario: { id: usuario.id, email: usuario.email, nombre: usuario.nombre, rol: usuario.rol } })
}

// GET /api/auth/perfil — Devuelve los datos del usuario autenticado.
export async function perfil(req: AuthRequest, res: Response) {
  const usuario = await prisma.usuario.findUnique({
    where: { id: req.usuario!.id },
    select: { id: true, email: true, nombre: true, apellido: true, cedula: true, telefono: true, rol: true }
  })
  res.json(usuario)
}
