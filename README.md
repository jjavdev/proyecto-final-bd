# Decarrerita — Sistema de Transporte de Pasajeros

Sistema web para la gestión de traslados de la empresa **Decarrerita**, desarrollado como proyecto final de la materia **Sistemas de Base de Datos I** — Universidad Nacional Experimental de Guayana (UNEG).

---

## Stack Tecnológico

| Capa | Tecnología | Versión |
|------|-----------|---------|
| **Backend** | Node.js + Express + TypeScript | 22 / 4.21 |
| **Frontend** | React 19 + Vite + TypeScript | 6.x |
| **Base de Datos** | PostgreSQL 16 | 16 Alpine |
| **ORM** | Prisma 6 | — |
| **Autenticación** | JWT + bcryptjs | — |
| **Validación** | Zod | — |
| **Containerización** | Docker Compose | — |

---

## Requisitos Mínimos

- **Docker** 24+ y **Docker Compose** 2.20+
- Puertos libres: `5432` (PostgreSQL), `3000` (Backend), `5173` (Frontend)
- ~2 GB de RAM disponibles

---

## Cómo Levantar el Proyecto

### 1. Clonar y entrar al directorio

```bash
cd /ruta/del/proyecto
```

### 2. Iniciar todos los servicios

```bash
docker compose up -d --build
```

Esto levanta 3 contenedores:
- `db` — PostgreSQL en `localhost:5432`
- `backend` — API en `localhost:3000`
- `frontend` — SPA en `localhost:5173`

### 3. Ejecutar migraciones (crear las tablas)

```bash
docker compose exec backend npx prisma migrate dev --name init
```

### 4. Poblar la base de datos con datos de prueba

```bash
docker compose exec backend npx prisma db seed
```

### 5. Acceder al sistema

Abre [`http://localhost:5173`](http://localhost:5173) en el navegador.

---

## Usuarios de Prueba (Seed)

Todos los usuarios tienen contraseña: **`123456`**

| Email | Rol | Nombre |
|-------|-----|--------|
| `admin@decarrerita.com` | ADMIN | Admin Sistema |
| `personal@decarrerita.com` | PERSONAL_ADMIN | Maria Rodriguez |
| `chofer1@decarrerita.com` | CHOFER | Carlos Perez |
| `cliente1@decarrerita.com` | CLIENTE | Ana Lopez |

El cliente `cliente1` tiene un saldo inicial de **$100.00**.

---

## Funcionalidades Implementadas

### Módulos del Sistema

| # | Funcionalidad | Rol | Estado |
|---|--------------|-----|--------|
| 1 | Registro e inicio de sesión | Todos | ✅ |
| 2 | Ver Datos Personales (Perfil) | Todos | ✅ |
| 3 | Recargar saldo | Cliente | ✅ |
| 4 | Solicitar traslado (con datos de chofer y vehículo en respuesta) | Cliente | ✅ |
| 5 | Historial de viajes | Cliente | ✅ |
| 6 | Historial de recargas | Cliente | ✅ |
| 7 | Registrar vehículo | Chofer | ✅ |
| 8 | Registrar contactos de emergencia | Chofer | ✅ |
| 9 | Ver viajes asignados (con filtros por fecha y estado) | Chofer | ✅ |
| 10 | Marcar traslado como completado/cancelado | Chofer, Admin | ✅ |
| 11 | Actualizar datos bancarios | Chofer | ✅ |
| 12 | Evaluación psicológica (nota ≥ 73 activa al chofer) | Personal Admin | ✅ |
| 13 | Revisión vehicular (calificación ≥ 65 activa el vehículo) | Personal Admin | ✅ |
| 14 | Pagar a chofer | Personal Admin | ✅ |
| 15 | Asignar banco a chofer | Personal Admin | ✅ |
| 16 | Listar choferes (con evaluaciones) | Personal Admin | ✅ |
| 17 | Listar vehículos (con revisiones) | Personal Admin | ✅ |
| 18 | Historial de evaluaciones de un chofer | Personal Admin | ✅ |
| 19 | Historial de revisiones de un vehículo | Personal Admin | ✅ |
| 20 | Reporte de ganancias por período | Admin, Personal Admin | ✅ |
| 21 | Reporte de pagos a chofer por período | Admin, Personal Admin | ✅ |
| 22 | Listado de traslados (admin) | Admin, Personal Admin | ✅ |
| 23 | Gestión de bancos | Personal Admin | ✅ |

### Detalles de Implementación

- **Solicitar traslado**: Al crear un traslado, la respuesta incluye `chofer: { id, nombre, apellido }` y `vehiculo: { placa, marca, modelo }`. La asignación es aleatoria entre choferes activos con vehículo activo.
- **Filtros de viajes (chofer)**: El endpoint `GET /api/choferes/viajes` acepta `?inicio=&fin=&estado=` para filtrar por rango de fechas y estado del traslado.
- **Marcar completado/cancelado**: Endpoints `PUT /api/traslados/:id/completar` y `PUT /api/traslados/:id/cancelar`. Solo el chofer asignado o admin pueden ejecutar la acción.
- **Activación por evaluación**: El chofer se crea con `activo: false` y se activa automáticamente al aprobar una evaluación psicológica con nota ≥ 73.
- **Activación por revisión**: El vehículo se crea con `activo: false` y se activa automáticamente al aprobar una revisión vehicular con calificación ≥ 65.
- **Cálculo de tarifa**: $3.00 base + $1.50 por kilómetro recorrido.
- **Distribución de ingresos**: 70% para el chofer (saldo pendiente), 30% ganancia de la empresa.

---

## Estructura del Proyecto

```
Proyecto DB/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma       # Modelo relacional (12 tablas)
│   │   └── seed.ts             # Datos de prueba
│   ├── scripts/
│   │   └── diccionario-datos.ts # Genera documentación desde information_schema
│   └── src/
│       ├── controllers/        # Lógica de negocio (MVC)
│       │   ├── admin.controller.ts   # Evaluación, revisión, pagos, bancos
│       │   ├── auth.controller.ts    # Registro, login, perfil
│       │   ├── bancos.controller.ts  # CRUD de bancos
│       │   ├── chofer.controller.ts  # Vehículos, contactos, viajes, banco
│       │   ├── cliente.controller.ts # Recargas, saldo, viajes
│       │   ├── reporte.controller.ts # Ganancias, pagos a chofer
│       │   ├── traslado.controller.ts# Solicitar, completar, cancelar, listar
│       │   └── vehiculo.controller.ts# Listar, historial revisiones
│       ├── middlewares/
│       │   ├── auth.ts          # JWT + roles
│       │   └── validate.ts      # Validación Zod
│       ├── routes/              # Rutas Express
│       ├── utils/
│       │   └── calcularTarifa.ts
│       └── index.ts             # Entry point
├── frontend/
│   └── src/
│       ├── components/
│       │   └── Layout.tsx       # Sidebar con menú dinámico por rol y saldos
│       ├── context/
│       │   └── AuthContext.tsx  # Estado global de autenticación
│       ├── pages/
│       │   ├── Login.tsx, Register.tsx
│       │   ├── Perfil.tsx       # Ver datos personales (todos los roles)
│       │   ├── Dashboard.tsx    # Routing interno por rol
│       │   ├── admin/           # EvaluarChofer, RevisarVehiculo, PagarChofer,
│       │   │                     # Ganancias, Reportes, BancoChofer,
│       │   │                     # EvaluacionesChofer, RevisionesVehiculo,
│       │   │                     # ListadoTraslados
│       │   ├── chofer/          # Vehiculos, Contactos, DatosBancarios,
│       │   │                     # ViajesAsignados
│       │   └── cliente/         # RecargarSaldo, SolicitarViaje,
│       │                         # HistorialViajes, HistorialRecargas
│       └── services/
│           └── api.ts           # Axios + JWT interceptor
├── docs/
│   ├── sql-en-prisma.md         # Guía de SQL crudo con Prisma
│   ├── ERD.md                   # Diagrama Entidad-Relación (generado)
│   └── diccionario-datos.md     # Diccionario de datos (generado)
├── generar-docs.sh              # Script para generar documentación
├── docker-compose.yml
└── README.md
```

---

## Modelo de Datos (12 Tablas)

| Tabla | Descripción |
|-------|-------------|
| `Usuario` | Base de usuarios (login, datos personales, rol) |
| `Chofer` | Datos bancarios del chofer, saldos |
| `ContactoEmergencia` | Mínimo 2 contactos por chofer |
| `Vehiculo` | Vehículos registrados por choferes |
| `EvaluacionPsicologica` | Nota ≥ 73 para aprobar |
| `RevisionVehicular` | Calificación ≥ 65 para apto, vigencia 1 año |
| `Cliente` | Clientes con saldo |
| `RecargaSaldo` | Historial de recargas (fecha, referencia, banco) |
| `Traslado` | Viaje de punto A a B, asignación aleatoria de chofer |
| `PagoChofer` | Pagos realizados al chofer (70% del traslado) |
| `Banco` | Catálogo de bancos |
| `PersonalAdmin` | Personal administrativo (evaluador) |

---

## API REST — Endpoints

### Auth
| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| `POST` | `/api/auth/registro` | — | Registrar usuario |
| `POST` | `/api/auth/login` | — | Iniciar sesión |
| `GET` | `/api/auth/perfil` | JWT | Obtener perfil |

### Cliente
| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| `POST` | `/api/clientes/recargar` | CLIENTE | Recargar saldo |
| `GET` | `/api/clientes/recargas` | CLIENTE | Historial de recargas |
| `GET` | `/api/clientes/saldo` | CLIENTE | Consultar saldo |
| `GET` | `/api/clientes/viajes` | CLIENTE | Historial de viajes |

### Chofer
| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| `POST` | `/api/choferes/vehiculos` | CHOFER | Registrar vehículo |
| `POST` | `/api/choferes/contactos` | CHOFER | Registrar contactos de emergencia |
| `GET` | `/api/choferes/viajes` | CHOFER | Ver viajes asignados (filtros: `?inicio=&fin=&estado=`) |
| `PUT` | `/api/choferes/banco` | CHOFER | Actualizar datos bancarios |

### Traslados
| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| `POST` | `/api/traslados` | CLIENTE | Solicitar traslado (asignación aleatoria + datos chofer/vehículo) |
| `PUT` | `/api/traslados/:id/completar` | CHOFER / ADMIN | Marcar traslado como completado |
| `PUT` | `/api/traslados/:id/cancelar` | CHOFER / ADMIN | Cancelar traslado |

### Vehículos
| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| `GET` | `/api/vehiculos` | PERSONAL_ADMIN | Listar vehículos |
| `GET` | `/api/vehiculos/:id/revisiones` | PERSONAL_ADMIN | Historial de revisiones de un vehículo |

### Personal Administrativo
| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| `POST` | `/api/admin/evaluar-chofer` | PERSONAL_ADMIN | Evaluación psicológica |
| `POST` | `/api/admin/revisar-vehiculo` | PERSONAL_ADMIN | Revisión vehicular |
| `POST` | `/api/admin/pagar-chofer` | PERSONAL_ADMIN | Pagar a chofer |
| `POST` | `/api/admin/bancos` | PERSONAL_ADMIN | Crear banco |
| `GET` | `/api/admin/choferes` | PERSONAL_ADMIN | Listar choferes |
| `GET` | `/api/admin/choferes/:id/evaluaciones` | PERSONAL_ADMIN | Historial evaluaciones de un chofer |
| `PUT` | `/api/admin/choferes/:id/banco` | PERSONAL_ADMIN | Asignar banco a un chofer |
| `GET` | `/api/admin/traslados` | PERSONAL_ADMIN / ADMIN | Listar todos los traslados |

### Reportes
| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| `GET` | `/api/reportes/ganancias?inicio=&fin=` | ADMIN / PERSONAL_ADMIN | Ganancias por período |
| `GET` | `/api/reportes/pagos-chofer?chofer_id=&inicio=&fin=` | ADMIN / PERSONAL_ADMIN | Pagos a chofer por período |

---

## Comandos Útiles

```bash
# Ver logs de los contenedores
docker compose logs -f backend

# Entrar al contenedor del backend
docker compose exec backend sh

# Abrir Prisma Studio (gestor visual de BD)
docker compose exec backend npx prisma studio

# Resetear la base de datos (borra todo + seed)
docker compose exec backend npx prisma migrate reset --force

# Detener los servicios
docker compose down

# Detener y borrar volúmenes (elimina datos)
docker compose down -v
```

---

## SQL Directo con Prisma

El proyecto usa SQL crudo via `prisma.$queryRaw` y `prisma.$executeRaw` para consultas complejas y reportes. Los parámetros se sanitizan automáticamente (sin riesgo de SQL injection).

Ver la guía completa en: [`docs/sql-en-prisma.md`](docs/sql-en-prisma.md)

Ejemplo de uso en el proyecto (`admin.controller.ts`):

```typescript
const ganancias = await prisma.$queryRaw`
  SELECT DATE(t.fecha) AS dia,
         COUNT(*) AS viajes,
         SUM(t.costo) AS total_bruto,
         SUM(t.costo * 0.30) AS ganancia_empresa
  FROM traslados t
  WHERE t.estado = 'completado'
    AND t.fecha >= ${inicio}::date
    AND t.fecha <= ${fin}::date
  GROUP BY DATE(t.fecha)
  ORDER BY dia
`
```

---

## Variable de Entorno

| Variable | Descripción | Valor por defecto |
|----------|-------------|-------------------|
| `DATABASE_URL` | URL de conexión a PostgreSQL | `postgresql://decarrerita:decarrerita123@db:5432/decarrerita` |
| `JWT_SECRET` | Secreto para firmar tokens JWT | — |
| `PORT` | Puerto del backend | `3000` |

---

## Documentación del Proyecto (Informe)

El proyecto incluye los siguientes documentos del informe:

| Documento | Archivo | Descripción |
|-----------|---------|-------------|
| Planteamiento del problema | [`docs/planteamiento-problema.md`](docs/planteamiento-problema.md) | Contexto, requerimientos y decisiones de diseño |
| Carta estructurada del sistema | [`docs/carta-estructurada.md`](docs/carta-estructurada.md) | Diagrama de módulos, jerarquía de componentes y arquitectura |
| Herramientas de desarrollo | `README.md` | Stack tecnológico detallado en la sección correspondiente |
| Modelo Entidad-Relación | [`backend/docs/ERD.md`](backend/docs/ERD.md) | Diagrama E-R en formato Mermaid (generado automáticamente) |
| Modelo Relacional | `backend/prisma/schema.prisma` | Esquema Prisma con 12 tablas, relaciones y restricciones |
| Diccionario de datos | [`docs/diccionario-datos.md`](docs/diccionario-datos.md) | Tablas, campos, tipos, PK y FK (generado automáticamente) |
| Pantallas de formularios | [`docs/pantallas-formularios.md`](docs/pantallas-formularios.md) | Descripción de cada formulario del sistema |
| Pantallas de consultas | [`docs/pantallas-consultas.md`](docs/pantallas-consultas.md) | Salidas de consultas con scripts SQL |
| Manual del desarrollador | [`docs/manual-desarrollador.md`](docs/manual-desarrollador.md) | Guía completa para defender el proyecto |

Adicionalmente, el [`docs/manual-desarrollador.md`](docs/manual-desarrollador.md) contiene explicaciones detalladas de cada consulta SQL, el flujo de autenticación, la lógica de negocio, y respuestas preparadas para preguntas comunes en la defensa.

### Generación Automática

```bash
./generar-docs.sh
```

Esto genera:
- `backend/docs/ERD.md` — Diagrama Entidad-Relación
- `docs/diccionario-datos.md` — Diccionario de datos desde `information_schema`

Ejecución individual:
```bash
# Solo ERD
cd backend && npx prisma generate

# Solo diccionario
cd backend && npm run docs:diccionario
```

---

## Solución de Problemas

**Error: `port is already allocated`**
```bash
# Ver qué está usando el puerto
sudo lsof -i :5432  # o 3000, 5173
# Detener el servicio y reintentar
docker compose down
```

**Error: `ECONNREFUSED` al conectar a la BD**
```bash
# Esperar a que PostgreSQL termine de iniciar y reintentar
docker compose restart backend
```

**Error: `PrismaClientInitializationError`**
```bash
# Re-ejecutar migraciones
docker compose exec backend npx prisma migrate dev --name init
```

**Hot reload no funciona**
Los volúmenes montan `src/` y `prisma/` en vivo, los cambios se reflejan al guardar. Si no, reinicia el contenedor:
```bash
docker compose restart backend
```
