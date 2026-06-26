# Inyección de SQL Directo en Prisma

Prisma permite ejecutar SQL crudo sin perder las ventajas del ORM.

## Métodos principales

### `$queryRaw` — Consultas SELECT

```typescript
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

// SELECT con SQL puro
const traslados = await prisma.$queryRaw`
  SELECT t.*, c.nombre AS chofer, cl.nombre AS cliente
  FROM traslados t
  JOIN choferes c ON t.chofer_id = c.id
  JOIN clientes cl ON t.cliente_id = cl.id
  WHERE t.fecha BETWEEN ${fechaInicio} AND ${fechaFin}
  ORDER BY t.fecha DESC
`

// Con agregaciones
const ganancias = await prisma.$queryRaw`
  SELECT
    DATE(t.fecha) AS dia,
    COUNT(*) AS viajes,
    SUM(t.costo) AS total_bruto,
    SUM(t.costo * 0.30) AS ganancia_empresa,
    SUM(t.costo * 0.70) AS ganancia_chofer
  FROM traslados t
  WHERE t.estado = 'completado'
    AND t.fecha >= ${inicioMes}
  GROUP BY DATE(t.fecha)
  ORDER BY dia
`

// Subconsultas
const choferesActivos = await prisma.$queryRaw`
  SELECT ch.*, u.nombre,
    (SELECT COUNT(*) FROM traslados t WHERE t.chofer_id = ch.id AND t.fecha >= NOW() - INTERVAL '7 days') AS viajes_semana
  FROM choferes ch
  JOIN usuarios u ON ch.usuario_id = u.id
  WHERE ch.activo = true
`
```

### `$executeRaw` — INSERT, UPDATE, DELETE

```typescript
// INSERT
await prisma.$executeRaw`
  INSERT INTO recargas_saldo (cliente_id, monto, banco_id, nro_referencia, fecha)
  VALUES (${clienteId}, ${monto}, ${bancoId}, ${referencia}, NOW())
`

// UPDATE
await prisma.$executeRaw`
  UPDATE clientes SET saldo = saldo + ${monto} WHERE id = ${clienteId}
`

// DELETE
await prisma.$executeRaw`
  DELETE FROM contactos_emergencia WHERE chofer_id = ${choferId}
`
```

### Transacciones con SQL crudo

```typescript
const [traslado] = await prisma.$transaction([
  prisma.$executeRaw`
    INSERT INTO traslados (cliente_id, chofer_id, origen, destino, costo, estado, fecha)
    VALUES (${clienteId}, ${choferId}, ${origen}, ${destino}, ${costo}, 'pendiente', NOW())
  `,
  prisma.$executeRaw`
    UPDATE clientes SET saldo = saldo - ${costo} WHERE id = ${clienteId}
  `,
  prisma.$executeRaw`
    UPDATE choferes SET saldo_pendiente = saldo_pendiente + ${costo * 0.70} WHERE id = ${choferId}
  `
])
```

## Seguridad — SQL Injection

**Los parámetros `${}` son sanitizados automáticamente por Prisma.** Nunca concatenes strings:

```typescript
// ❌ PELIGRO — SQL injection
await prisma.$queryRawUnsafe(`SELECT * FROM usuarios WHERE email = '${email}'`)

// ✅ SEGURO
await prisma.$queryRaw`SELECT * FROM usuarios WHERE email = ${email}`
```

## Cuándo usar SQL crudo vs ORM

| Situación | Recomendación |
|-----------|--------------|
| CRUD simple (findById, create, update) | Prisma ORM (`prisma.user.findMany()`) |
| Reportes con GROUP BY, JOINs complejos | `$queryRaw` |
| Operaciones masivas (bulk update/delete) | `$executeRaw` |
| Funciones de ventana, CTEs, SQL nativo | `$queryRaw` |
| Migraciones y schema | Prisma Migrate |

## Ejemplo práctico para la defensa

```typescript
// Misma consulta en ORM vs SQL crudo

// ORM
const viajes = await prisma.traslado.findMany({
  where: { cliente_id: id, fecha: { gte: inicio } },
  include: { chofer: { include: { usuario: true } } },
  orderBy: { fecha: 'desc' }
})

// SQL crudo (equivalente)
const viajes = await prisma.$queryRaw`
  SELECT t.*, u.nombre AS chofer_nombre, u.telefono AS chofer_telefono
  FROM traslados t
  JOIN choferes c ON t.chofer_id = c.id
  JOIN usuarios u ON c.usuario_id = u.id
  WHERE t.cliente_id = ${id} AND t.fecha >= ${inicio}
  ORDER BY t.fecha DESC
`
```

Ambos funcionan. En la defensa puedes mostrar SQL crudo para las consultas complejas y ORM para el CRUD.
