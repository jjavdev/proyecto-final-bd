import { PrismaClient } from '@prisma/client'
import * as fs from 'fs'
import * as path from 'path'

const prisma = new PrismaClient()

interface ColumnInfo {
  table_name: string
  column_name: string
  data_type: string
  is_nullable: string
  column_default: string | null
  is_pk: boolean
  is_fk: boolean
  fk_ref: string | null
  description: string
}

async function main() {
  const tables = [
    { name: 'usuarios', desc: 'Almacena los datos de inicio de sesion y datos basicos de todos los usuarios del sistema' },
    { name: 'choferes', desc: 'Datos especificos de los choferes, incluyendo informacion bancaria y saldos' },
    { name: 'contactos_emergencia', desc: 'Contactos de emergencia asociados a cada chofer (minimo 2)' },
    { name: 'vehiculos', desc: 'Vehiculos registrados por los choferes para realizar traslados' },
    { name: 'evaluaciones_psicologicas', desc: 'Evaluaciones psicologicas realizadas a los choferes postulantes' },
    { name: 'revisiones_vehiculares', desc: 'Revisiones tecnicas realizadas a los vehiculos' },
    { name: 'clientes', desc: 'Datos especificos de los clientes, incluyendo su saldo disponible' },
    { name: 'recargas_saldo', desc: 'Historial de recargas de saldo realizadas por los clientes' },
    { name: 'traslados', desc: 'Registro de todos los traslados solicitados en el sistema' },
    { name: 'pagos_chofer', desc: 'Pagos realizados por el personal administrativo a los choferes' },
    { name: 'bancos', desc: 'Catalogo de entidades bancarias disponibles en el sistema' },
    { name: 'personal_admin', desc: 'Datos del personal administrativo que gestiona el sistema' },
  ]

  const tableNames = tables.map((t) => t.name)

  const info = await prisma.$queryRaw<ColumnInfo[]>`
    SELECT
      c.table_name::text,
      c.column_name::text,
      c.data_type::text,
      c.is_nullable::text,
      c.column_default::text,
      CASE WHEN pk.column_name IS NOT NULL THEN true ELSE false END AS is_pk,
      CASE WHEN fk.column_name IS NOT NULL THEN true ELSE false END AS is_fk,
      fk.ref AS fk_ref
    FROM information_schema.columns c
    LEFT JOIN (
      SELECT ku.table_name, ku.column_name
      FROM information_schema.table_constraints tc
      JOIN information_schema.key_column_usage ku ON tc.constraint_name = ku.constraint_name
      WHERE tc.constraint_type = 'PRIMARY KEY'
    ) pk ON c.table_name = pk.table_name AND c.column_name = pk.column_name
    LEFT JOIN (
      SELECT ku.table_name, ku.column_name,
             '→ ' || ccu.table_name || '.' || ccu.column_name AS ref
      FROM information_schema.table_constraints tc
      JOIN information_schema.key_column_usage ku ON tc.constraint_name = ku.constraint_name
      JOIN information_schema.constraint_column_usage ccu ON tc.constraint_name = ccu.constraint_name
      WHERE tc.constraint_type = 'FOREIGN KEY'
    ) fk ON c.table_name = fk.table_name AND c.column_name = fk.column_name
    WHERE c.table_schema = 'public'
    ORDER BY c.table_name, c.ordinal_position
  `
  const infoFiltered = info.filter((c) => tableNames.includes(c.table_name))

  const descriptions: Record<string, string> = {
    id: 'Identificador unico autoincremental',
    usuario_id: 'Referencia al usuario en la tabla usuarios',
    chofer_id: 'Referencia al chofer en la tabla choferes',
    cliente_id: 'Referencia al cliente en la tabla clientes',
    vehiculo_id: 'Referencia al vehiculo en la tabla vehiculos',
    banco_id: 'Referencia al banco en la tabla bancos',
    evaluador_id: 'Referencia al evaluador (personal_admin)',
    email: 'Correo electronico unico del usuario',
    password_hash: 'Hash de la contrasena (bcrypt)',
    nombre: 'Nombre de pila',
    apellido: 'Apellido',
    cedula: 'Numero de cedula de identidad (unico)',
    telefono: 'Numero de telefono de contacto',
    rol: 'Rol del usuario: ADMIN, CHOFER, CLIENTE o PERSONAL_ADMIN',
    activo: 'Indica si el registro esta activo',
    creado_en: 'Fecha y hora de creacion del registro',
    actualizado_en: 'Fecha y hora de la ultima actualizacion',
    nro_cuenta: 'Numero de cuenta bancaria del chofer',
    saldo_pendiente: 'Monto pendiente por cobrar acumulado',
    saldo_pagado: 'Monto ya cobrado por el chofer',
    parentesco: 'Relacion familiar o de amistad del contacto',
    placa: 'Placa del vehiculo (unico)',
    marca: 'Marca del vehiculo',
    modelo: 'Modelo del vehiculo',
    anio: 'Anio de fabricacion del vehiculo',
    color: 'Color del vehiculo',
    nota: 'Nota obtenida en la evaluacion psicologica (0-100)',
    fecha: 'Fecha en que se realizo la prueba o transaccion',
    aprobado: 'Indica si la evaluacion fue aprobada (nota >= 73)',
    calificacion: 'Calificacion obtenida en la revision vehicular (0-100)',
    apto: 'Indica si el vehiculo fue considerado apto (calificacion >= 65)',
    saldo: 'Saldo disponible del cliente',
    monto: 'Monto de la transaccion',
    nro_referencia: 'Numero de referencia de la transaccion bancaria',
    origen: 'Direccion o punto de origen del traslado',
    destino: 'Direccion o punto de destino del traslado',
    costo: 'Costo total del traslado calculado por la tarifa',
    estado: 'Estado del traslado: pendiente, completado o cancelado',
    pagado: 'Indica si el traslado ha sido pagado al chofer',
  }

  const outputPath = path.resolve(__dirname, '../docs/diccionario-datos.md')
  const lines: string[] = []

  lines.push('# Diccionario de Datos - Decarrerita')
  lines.push()
  lines.push('Documento generado automaticamente desde la base de datos.')
  lines.push()

  for (const table of tables) {
    const cols = infoFiltered.filter((c) => c.table_name === table.name)
    const pk = cols.filter((c) => c.is_pk).map((c) => c.column_name).join(', ')
    const fkCols = cols.filter((c) => c.is_fk)
    const fk = fkCols.map((c) => c.fk_ref).join(', ')

    lines.push(`\n## ${table.name}`)
    lines.push(`**Descripcion:** ${table.desc}`)
    lines.push(`**Clave Primaria:** ${pk}`)
    if (fk) lines.push(`**Claves Foraneas:** ${fk}`)
    lines.push('')
    lines.push('| Campo | Tipo | Nulo | Defecto | PK | FK | Descripcion |')
    lines.push('|-------|------|------|---------|----|----|-------------|')

    for (const col of cols) {
      const desc = descriptions[col.column_name] || ''
      lines.push(
        `| ${col.column_name} | ${col.data_type} | ${col.is_nullable === 'YES' ? 'SI' : 'NO'} | ${col.column_default || '-'} | ${col.is_pk ? 'X' : ''} | ${col.is_fk ? 'X' : ''} | ${desc} |`
      )
    }
  }

  fs.writeFileSync(outputPath, lines.join('\n'), 'utf-8')
  console.log(`Diccionario de datos generado en: ${outputPath}`)

  await prisma.$disconnect()
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
