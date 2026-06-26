import { PrismaClient, Rol } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const password_hash = await bcrypt.hash('123456', 10)

  const admin = await prisma.usuario.upsert({
    where: { email: 'admin@decarrerita.com' },
    update: {},
    create: {
      email: 'admin@decarrerita.com',
      password_hash,
      nombre: 'Admin',
      apellido: 'Sistema',
      cedula: 'V-00000001',
      telefono: '04120000001',
      rol: Rol.ADMIN
    }
  })

  const personal = await prisma.usuario.upsert({
    where: { email: 'personal@decarrerita.com' },
    update: {},
    create: {
      email: 'personal@decarrerita.com',
      password_hash,
      nombre: 'Maria',
      apellido: 'Rodriguez',
      cedula: 'V-12345678',
      telefono: '04120000002',
      rol: Rol.PERSONAL_ADMIN
    }
  })

  await prisma.personalAdmin.upsert({
    where: { usuario_id: personal.id },
    update: {},
    create: { usuario_id: personal.id }
  })

  const banco = await prisma.banco.upsert({
    where: { nombre: 'Banco de Venezuela' },
    update: {},
    create: { nombre: 'Banco de Venezuela' }
  })

  await prisma.banco.upsert({
    where: { nombre: 'Mercantil' },
    update: {},
    create: { nombre: 'Mercantil' }
  })

  await prisma.banco.upsert({
    where: { nombre: 'Provincial' },
    update: {},
    create: { nombre: 'Provincial' }
  })

  const choferU = await prisma.usuario.upsert({
    where: { email: 'chofer1@decarrerita.com' },
    update: {},
    create: {
      email: 'chofer1@decarrerita.com',
      password_hash,
      nombre: 'Carlos',
      apellido: 'Perez',
      cedula: 'V-87654321',
      telefono: '04120000003',
      rol: Rol.CHOFER
    }
  })

  await prisma.chofer.upsert({
    where: { usuario_id: choferU.id },
    update: {},
    create: {
      usuario_id: choferU.id,
      banco_id: banco.id,
      nro_cuenta: '0102-1234-56-7890123'
    }
  })

  const clienteU = await prisma.usuario.upsert({
    where: { email: 'cliente1@decarrerita.com' },
    update: {},
    create: {
      email: 'cliente1@decarrerita.com',
      password_hash,
      nombre: 'Ana',
      apellido: 'Lopez',
      cedula: 'V-11223344',
      telefono: '04120000004',
      rol: Rol.CLIENTE
    }
  })

  await prisma.cliente.upsert({
    where: { usuario_id: clienteU.id },
    update: {},
    create: {
      usuario_id: clienteU.id,
      saldo: 100.0
    }
  })

  console.log('Seed completado exitosamente')
  console.log('Usuarios creados (password: 123456):')
  console.log('  admin@decarrerita.com (ADMIN)')
  console.log('  personal@decarrerita.com (PERSONAL_ADMIN)')
  console.log('  chofer1@decarrerita.com (CHOFER)')
  console.log('  cliente1@decarrerita.com (CLIENTE)')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
