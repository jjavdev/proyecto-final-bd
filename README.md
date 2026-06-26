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

## Estructura del Proyecto

```
Proyecto DB/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma       # Modelo relacional (12 tablas)
│   │   └── seed.ts             # Datos de prueba
│   └── src/
│       ├── controllers/        # Lógica de negocio (MVC)
│       │   ├── admin.controller.ts
│       │   ├── auth.controller.ts
│       │   ├── chofer.controller.ts
│       │   ├── cliente.controller.ts
│       │   └── traslado.controller.ts
│       ├── middlewares/
│       │   ├── auth.ts          # JWT + roles
│       │   └── validate.ts      # Validación Zod
│       ├── routes/              # Rutas Express
│       ├── utils/
│       │   └── calcularTarifa.ts
│       └── index.ts             # Entry point
├── frontend/
│   └── src/
│       ├── context/AuthContext.tsx
│       ├── pages/               # Login, Register, Dashboard
│       └── services/api.ts      # Axios + JWT interceptor
├── docs/
│   └── sql-en-prisma.md         # Guía de SQL crudo con Prisma
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

**Distribución de ingresos por traslado:**
- **70%** para el chofer (`saldo_pendiente`)
- **30%** ganancia de la empresa

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
| `GET` | `/api/choferes/viajes` | CHOFER | Ver viajes asignados |
| `PUT` | `/api/choferes/banco` | CHOFER | Actualizar datos bancarios |

### Traslados
| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| `POST` | `/api/traslados` | CLIENTE | Solicitar traslado (asignación aleatoria) |

### Personal Administrativo
| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| `POST` | `/api/admin/evaluar-chofer` | PERSONAL_ADMIN | Evaluación psicológica |
| `POST` | `/api/admin/revisar-vehiculo` | PERSONAL_ADMIN | Revisión vehicular |
| `POST` | `/api/admin/pagar-chofer` | PERSONAL_ADMIN | Pagar a chofer |
| `POST` | `/api/admin/bancos` | PERSONAL_ADMIN | Crear banco |

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
