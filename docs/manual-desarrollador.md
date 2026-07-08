# Manual del Desarrollador — Decarrerita

## 1. Visión General

Decarrerita es un sistema web de transporte de pasajeros con 4 roles de usuario. El backend expone una API REST construida con **Node.js + Express + TypeScript**, el frontend es una **SPA en React 19 + Vite**, y la base de datos es **PostgreSQL 16** accedida mediante **Prisma 6 ORM**.

---

## 2. Stack Tecnológico y Justificación

| Tecnología | Propósito |
|-----------|-----------|
| **Node.js + Express** | Servidor HTTP ligero y rápido para APIs REST |
| **TypeScript** | Tipado estático que previene errores en tiempo de compilación |
| **React 19 + Vite** | UI reactiva con recarga rápida en desarrollo |
| **PostgreSQL 16** | BD relacional con soporte para consultas SQL complejas, JOINs, subconsultas, transacciones |
| **Prisma 6** | ORM que abstrae el SQL, pero permite SQL crudo cuando se necesita |
| **JWT + bcryptjs** | Autenticación stateless (sin sesiones en servidor) |
| **Zod** | Validación de esquemas en TypeScript (tipos seguros) |
| **Docker Compose** | Entorno reproducible sin instalar dependencias localmente |

---

## 3. Arquitectura del Sistema

```
┌─────────────┐      HTTP/JSON      ┌──────────────┐      SQL      ┌────────────┐
│  Frontend   │ ──────────────────> │   Backend    │ ───────────> │ PostgreSQL │
│  React 19   │ <────────────────── │  Express +   │ <─────────── │   16       │
│  Vite       │      JSON + JWT     │  Prisma ORM  │   Raw SQL    │            │
└─────────────┘                     └──────────────┘              └────────────┘
       │                                    │
       │                                    │
  Browser/App                          API REST
  localhost:5173                       localhost:3000
```

### Flujo de una petición típica:

```
1. Usuario llena formulario en React
2. React llama a api.ts (Axios)
3. Interceptor de Axios agrega token JWT del localStorage
4. Petición HTTP llega a Express
5. Middleware authenticate verifica el JWT (auth.ts)
6. Middleware authorize verifica el rol (auth.ts)
7. Middleware validate valida el body con Zod (validate.ts)
8. Controlador ejecuta la lógica de negocio
9. Prisma ejecuta SQL (generado o crudo) contra PostgreSQL
10. Respuesta JSON viaja de vuelta al frontend
```

---

## 4. Base de Datos — Modelo Relacional (12 Tablas)

### 4.1 Diagrama de Tablas y Relaciones

```
usuarios (1) ──── (1) choferes (1) ──── (*) vehiculos
                         ├── (*) contactos_emergencia
                         ├── (*) evaluaciones_psicologicas
                         ├── (*) traslados
                         └── (*) pagos_chofer

usuarios (1) ──── (1) clientes (1) ──── (*) recargas_saldo
                               └── (*) traslados

usuarios (1) ──── (1) personal_admin
                         ├── (*) evaluaciones_psicologicas
                         └── (*) revisiones_vehiculares

bancos (1) ──── (*) choferes
         └── (*) recargas_saldo
```

### 4.2 Descripción de Cada Tabla

| Tabla | PK | Descripción |
|-------|----|-------------|
| `usuarios` | id | Base de usuarios: login, datos personales, rol |
| `choferes` | id | Datos bancarios, saldos, activo |
| `contactos_emergencia` | id | Mínimo 2 contactos por chofer |
| `vehiculos` | id | Vehículos registrados, activo |
| `evaluaciones_psicologicas` | id | Evaluaciones: nota, fecha, aprobado |
| `revisiones_vehiculares` | id | Revisiones: calificación, apto, fecha |
| `clientes` | id | Saldo disponible |
| `recargas_saldo` | id | Recargas: monto, referencia, banco |
| `traslados` | id | Origen, destino, costo, estado, pagado |
| `pagos_chofer` | id | Pagos: monto, referencia, fecha |
| `bancos` | id | Catálogo de bancos |
| `personal_admin` | id | Relación con usuario |

---

## 5. Tipos de Consultas SQL Utilizadas

El proyecto usa 3 enfoques para ejecutar SQL:

### 5.1 Consultas con Prisma ORM (SQL generado automáticamente)

Usado para operaciones CRUD simples donde no se necesita SQL personalizado.

```typescript
// Ejemplo: buscar un cliente por usuario_id
const cliente = await prisma.cliente.findUnique({ where: { usuario_id } })
// SQL generado: SELECT id, usuario_id, saldo, creado_en FROM clientes WHERE usuario_id = $1

// Ejemplo: crear un banco
const banco = await prisma.banco.create({ data: { nombre } })
// SQL generado: INSERT INTO bancos (nombre) VALUES ($1) RETURNING id, nombre
```

### 5.2 SQL Crudo con Prisma (`$queryRaw`)

Usado cuando se necesitan JOINs, subconsultas o funciones de BD que Prisma no genera.

```typescript
// Ejemplo: historial de recargas con JOIN a bancos
const recargas = await prisma.$queryRaw`
  SELECT r.id, r.monto, r.nro_referencia, r.fecha, b.nombre AS banco
  FROM recargas_saldo r
  JOIN bancos b ON r.banco_id = b.id
  WHERE r.cliente_id = ${cliente.id}
  ORDER BY r.fecha DESC
`
```

**Características**:
- Los parámetros `${variable}` se sanitizan automáticamente (sin riesgo de SQL injection)
- Las consultas son con nombre (`$queryRaw` con template literal)
- Devuelven tipos genéricos, hay que hacer cast: `await prisma.$queryRaw<MiTipo[]>`

### 5.3 SQL Crudo Dinámico (`$queryRawUnsafe`)

Usado cuando los filtros son opcionales y la consulta se construye dinámicamente.

```typescript
// Ejemplo: listar traslados con filtros opcionales
let sql = `SELECT ... FROM traslados t WHERE 1=1`
const params: any[] = []

if (inicio) {
  params.push(inicio)
  sql += ` AND t.fecha >= $${params.length}::date`
}
if (estado) {
  params.push(estado)
  sql += ` AND t.estado = $${params.length}`
}

const traslados = await prisma.$queryRawUnsafe(sql, ...params)
```

**Importante**: Aunque se llame `Unsafe`, no es inseguro si se usan parámetros `$1`, `$2`, etc. Los valores se sanitizan igual. El "unsafe" se refiere a que acepta strings de SQL concatenados, no a que permita SQL injection.

### 5.4 SQL Crudo con `$executeRaw`

Usado para operaciones de escritura (INSERT, UPDATE, DELETE) que necesitan SQL personalizado.

```typescript
// Ejemplo: actualizar saldos en transacción
await prisma.$transaction([
  prisma.$executeRaw`
    INSERT INTO traslados (cliente_id, chofer_id, origen, destino, costo)
    VALUES (${id}, ${choferId}, ${origen}, ${destino}, ${costo})
  `,
  prisma.$executeRaw`
    UPDATE clientes SET saldo = saldo - ${costo} WHERE id = ${id}
  `,
])
```

---

## 6. Consultas Clave del Proyecto (para explicar en la defensa)

### 6.1 Asignación Aleatoria de Chofer

**Ubicación:** `backend/src/controllers/traslado.controller.ts:25-34`

```sql
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
  SELECT t.chofer_id FROM traslados t WHERE t.estado = 'pendiente'
)
ORDER BY RANDOM()
LIMIT 1
```

**Para defender:**
- `ORDER BY RANDOM()` con `LIMIT 1` garantiza asignación aleatoria real
- Las subconsultas con `EXISTS` son más eficientes que `JOIN` porque PostgreSQL deja de evaluar en cuanto encuentra un match
- `NOW() - INTERVAL '1 year'` implementa el requisito de revisión anual
- `NOT IN` con subconsulta filtra choferes que ya tienen un viaje pendiente

### 6.2 Reporte de Ganancias por Período

**Ubicación:** `backend/src/controllers/admin.controller.ts:100-117`

```sql
SELECT DATE(t.fecha) AS dia,
       COUNT(*) AS viajes,
       SUM(t.costo) AS total_bruto,
       SUM(t.costo * 0.30) AS ganancia_empresa
FROM traslados t
WHERE t.estado = 'completado'
  AND t.fecha >= $1::date
  AND t.fecha <= $2::date
GROUP BY DATE(t.fecha)
ORDER BY dia
```

**Para defender:**
- `DATE()` trunca el timestamp a solo la fecha para agrupar por día
- `SUM(t.costo * 0.30)` calcula el 30% de ganancia directamente en SQL (eficiente)
- `GROUP BY` agrupa los resultados por día para el reporte
- `$1::date` hace cast explícito de string a tipo date de PostgreSQL

### 6.3 Cancelación de Traslado con Reembolso (Transacción)

**Ubicación:** `backend/src/controllers/traslado.controller.ts:123-127`

```sql
-- Las 3 operaciones en una transacción atómica
UPDATE traslados SET estado = 'cancelado' WHERE id = $1
UPDATE clientes SET saldo = saldo + $2 WHERE id = $3
UPDATE choferes SET saldo_pendiente = saldo_pendiente - $4 WHERE id = $5
```

**Para defender:**
- `prisma.$transaction()` ejecuta las 3 operaciones en una sola transacción de PostgreSQL
- Si alguna falla, todas se revierten (ROLLBACK automático)
- Esto garantiza consistencia: nunca se cancela un viaje sin reembolsar al cliente

### 6.4 Evaluación Psicológica con Activación Automática

**Ubicación:** `backend/src/controllers/admin.controller.ts:10-41`

```typescript
const aprobado = nota >= 73

const evaluacion = await prisma.evaluacionPsicologica.create({
  data: { chofer_id, nota, aprobado, fecha: new Date(), evaluador_id: admin.id }
})

if (aprobado) {
  await prisma.chofer.update({
    where: { id: chofer_id },
    data: { activo: true }
  })
}
```

**Para defender:**
- La lógica de activación está en el backend, no en la BD
- Se podría hacer con un TRIGGER en PostgreSQL, pero se optó por hacerlo en la aplicación para mantener la lógica de negocio visible en el código
- La regla de negocio (nota >= 73 activa al chofer) está explícita y es fácil de modificar

### 6.5 Listado de Choferes con Estado de Evaluación

**Ubicación:** `backend/src/controllers/chofer.controller.ts:132-155`

```sql
SELECT c.id, u.nombre, u.apellido, u.cedula, u.email, c.activo,
       b.nombre AS banco, c.nro_cuenta, c.saldo_pendiente, c.saldo_pagado,
       (SELECT e.nota FROM evaluaciones_psicologicas e
        WHERE e.chofer_id = c.id ORDER BY e.fecha DESC LIMIT 1
       ) AS ultima_evaluacion_nota,
       (SELECT e.fecha FROM evaluaciones_psicologicas e
        WHERE e.chofer_id = c.id ORDER BY e.fecha DESC LIMIT 1
       ) AS ultima_evaluacion_fecha
FROM choferes c
JOIN usuarios u ON c.usuario_id = u.id
LEFT JOIN bancos b ON c.banco_id = b.id
ORDER BY u.nombre
```

**Para defender:**
- Usa **subconsultas correlacionadas** en SELECT para traer la última evaluación sin multiplicar filas
- `LEFT JOIN` con bancos permite que choferes sin banco asignado (nunca debería pasar) también aparezcan
- `ORDER BY u.nombre` ordena alfabéticamente

---

## 7. Métodos y Patrones de Diseño

### 7.1 Patrón MVC (Model-View-Controller)

```
backend/src/
├── controllers/    → Lógica de negocio (recibe request, llama a BD, responde)
├── routes/         → Define endpoints y conecta middleware + controllers
├── middlewares/     → Funciones que se ejecutan antes del controller
├── utils/          → Funciones auxiliares (calcularTarifa)
└── index.ts        → Punto de entrada, registra todo
```

### 7.2 Middleware Chain

Cada endpoint pasa por una cadena de middleware:

```
Petición → authenticate → authorize → validate → controller → Respuesta
```

Ejemplo para `POST /api/traslados`:
```
1. authenticate: extrae y verifica JWT → req.usuario
2. authorize('CLIENTE'): verifica que el rol sea CLIENTE
3. validate(schema): valida body contra Zod
4. solicitarTraslado(): ejecuta la lógica
```

### 7.3 Autenticación JWT (Stateless)

```
Login → servidor verifica email+password → genera JWT → cliente almacena en localStorage
                                                                    ↓
                           Cada petición → header Authorization: Bearer <token>
                                                                    ↓
                           authenticate() → jwt.verify() → req.usuario = { id, rol }
```

**Ventaja**: No se necesita almacenar sesiones en servidor. Escalable horizontalmente.

### 7.4 Validación con Zod

```typescript
const trasladoSchema = z.object({
  origen: z.string().min(1),
  destino: z.string().min(1),
  distancia_km: z.number().positive()
})
```

Zod valida tipos, longitudes, rangos, y los errores se devuelven automáticamente como JSON.

### 7.5 Transacciones de Base de Datos

Usamos `prisma.$transaction()` para operaciones que deben ser atómicas:

```typescript
await prisma.$transaction([
  prisma.$executeRaw`INSERT INTO traslados ...`,
  prisma.$executeRaw`UPDATE clientes SET saldo = saldo - $1 ...`,
  prisma.$executeRaw`UPDATE choferes SET saldo_pendiente = saldo_pendiente + $1 ...`
])
```

Si alguna operación falla, PostgreSQL revierte todas (ROLLBACK).

---

## 8. Lógica de Negocio Clave

### 8.1 Cálculo de Tarifa

```typescript
TARIFA_BASE = $3.00
COSTO_POR_KM = $1.50
Tarifa = $3.00 + (distancia_km × $1.50)
```

### 8.2 Distribución de Ingresos

```
Costo del traslado = $X
  ├── 70% → saldo_pendiente del chofer
  └── 30% → ganancia de la empresa
```

### 8.3 Reglas de Activación

| Entidad | Se crea como | Se activa cuando |
|---------|-------------|-------------------|
| Chofer | `activo = false` | Evaluación psicológica con nota ≥ 73 |
| Vehículo | `activo = false` | Revisión vehicular con calificación ≥ 65 |

### 8.4 Ciclo de Vida de un Traslado

```
pendiente → completado (chofer o admin marca como completado)
pendiente → cancelado (chofer o admin cancela, se reembolsa al cliente)
```

---

## 9. SQL en el Frontend vs Backend

**Importante para la defensa:** Todo el SQL se ejecuta exclusivamente en el backend. El frontend nunca ejecuta SQL. El frontend solo hace peticiones HTTP (GET, POST, PUT) y recibe JSON.

```
Frontend (React)                  Backend (Express)              PostgreSQL
─────────────────                ─────────────────             ──────────
api.get('/clientes/saldo')  →    consultarSaldo()        →    SELECT saldo FROM clientes ...
                              ←   { saldo: 100.00 }      ←    [fila]
```

---

## 10. Respuestas Rápidas para la Defensa

### ¿Por qué usaron SQL crudo si ya tienen Prisma?

> "Prisma genera SQL para operaciones simples (INSERT, SELECT por ID), pero para consultas complejas como reportes con agrupación, subconsultas correlacionadas, o asignación aleatoria con `ORDER BY RANDOM()`, es más eficiente y expresivo escribir SQL directamente."

### ¿Cómo evitan la inyección SQL?

> "Prisma sanitiza automáticamente los parámetros en `$queryRaw` y `$executeRaw`. Usamos parámetros posicionales `$1`, `$2`, etc. — nunca concatenamos valores directamente en el string SQL."

### ¿Por qué no usaron triggers o funciones almacenadas?

> "Preferimos mantener la lógica de negocio en la capa de aplicación (TypeScript) para que sea fácil de leer, modificar y testear. La BD se usa exclusivamente para almacenar datos y ejecutar consultas."

### ¿Cómo manejan la concurrencia?

> "Usamos `prisma.$transaction()` que ejecuta múltiples operaciones en una sola transacción atómica de PostgreSQL. Si dos clientes solicitan un traslado simultáneamente, la transacción garantiza que solo uno recibe la asignación."

### ¿Qué hace `ORDER BY RANDOM()`?

> "`ORDER BY RANDOM()` asigna un número aleatorio a cada fila y ordena por ese número. Combinado con `LIMIT 1`, selecciona una fila al azar. Es la forma más simple y directa de implementar asignación aleatoria en PostgreSQL."

---

## 11. Prisma: ORM vs SQL Crudo — Cuándo Usar Cada Uno

| Situación | Enfoque | Ejemplo |
|-----------|---------|---------|
| CRUD simple (1 tabla) | Prisma ORM | `prisma.banco.create()`, `prisma.usuario.findUnique()` |
| JOIN entre 2-3 tablas | Prisma ORM con `include` | `prisma.chofer.findUnique({ include: { usuario: true } })` |
| JOINs complejos con subconsultas | SQL crudo `$queryRaw` | Reporte de ganancias con GROUP BY |
| Filtros dinámicos opcionales | SQL crudo `$queryRawUnsafe` | Listado de traslados con filtros |
| Operaciones atómicas múltiples | SQL crudo `$executeRaw` en transacción | Cancelar traslado + reembolso |
| Funciones de BD (RANDOM, DATE, NOW) | SQL crudo | `ORDER BY RANDOM()`, `DATE(t.fecha)` |

---

## 12. Comandos Útiles para la Defensa

```bash
# Ver estructura de la BD (Prisma Studio)
docker compose exec backend npx prisma studio

# Ver logs de SQL que Prisma ejecuta
docker compose logs -f backend

# Ejecutar SQL directo en PostgreSQL
docker compose exec db psql -U decarrerita -d decarrerita

# Ejemplo de consulta directa:
docker compose exec db psql -U decarrerita -d decarrerita -c "
  SELECT COUNT(*), estado FROM traslados GROUP BY estado;
"

# Regenerar diagrama E-R
docker compose exec backend npx prisma generate

# Script de capturas de pantalla
FRONTEND_URL=http://localhost:5174 node scripts/tomar-capturas.js
```

---

## 13. Posibles Preguntas del Profesor y Respuestas

**P: ¿Cuál es la diferencia entre `$queryRaw` y `$queryRawUnsafe`?**

> "`$queryRaw` usa template literals con parámetros `${}` que Prisma tipa y sanitiza automáticamente. `$queryRawUnsafe` acepta un string de SQL construido dinámicamente con parámetros posicionales `$1`, `$2`. Ambos sanitizan los valores, pero `Unsafe` permite construir SQL condicionalmente (ej: agregar filtros `WHERE` según qué parámetros lleguen)."

**P: ¿Por qué el chofer se crea con `activo = false`?**

> "Porque el PDF especifica que para ingresar a la plantilla, el chofer debe aprobar una evaluación psicológica. Creamos al chofer al registrarse, pero permanece inactivo hasta que el personal administrativo registre una evaluación con nota ≥ 73, momento en que el sistema lo activa automáticamente."

**P: ¿Cómo funciona la asignación aleatoria de choferes?**

> "Primero filtramos choferes activos que tengan un vehículo activo con revisión vigente (menos de 1 año) y que no tengan viajes pendientes. Luego usamos `ORDER BY RANDOM() LIMIT 1` para seleccionar uno al azar. Todo en una sola consulta SQL."

**P: ¿Qué pasa si se cae el servidor a mitad de una transacción?**

> "PostgreSQL garantiza que las transacciones son atómicas. Si el servidor se cae durante una transacción, PostgreSQL hace ROLLBACK automático al reiniciar. El estado de la BD queda como si la operación nunca hubiera comenzado."

**P: ¿Cómo se calcula la tarifa?**

> "Usamos una fórmula definida por el equipo: $3.00 de tarifa base más $1.50 por cada kilómetro de distancia. El resultado se redondea a 2 decimales. El algoritmo está en `backend/src/utils/calcularTarifa.ts`."

**P: ¿Qué ventajas tiene TypeScript sobre JavaScript en este proyecto?**

> "TypeScript nos permite detectar errores en tiempo de compilación (ej: pasar un string donde se espera un número), autocompletado en el IDE, y documentación viva de tipos. En las consultas SQL con Prisma, el tipado evita errores como olvidar un campo en el SELECT."
