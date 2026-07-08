# Carta Estructurada del Sistema

## Diagrama de Módulos del Sistema Decarrerita

```
┌─────────────────────────────────────────────────────────────────────┐
│                        DECARRERITA                                   │
│                   Sistema de Transporte de Pasajeros                 │
└─────────────────────────────────────────────────────────────────────┘
                                    │
          ┌──────────┬──────────────┼──────────────┬──────────────┐
          ▼          ▼              ▼              ▼              ▼
   ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────────┐ ┌──────────┐
   │  Auth    │ │ Cliente  │ │  Chofer  │ │Personal Admin│ │  Admin   │
   └──────────┘ └──────────┘ └──────────┘ └──────────────┘ └──────────┘
         │            │            │              │              │
         │            │            │              │              │
    ┌────┴─────┐  ┌───┴────┐  ┌───┴─────┐   ┌────┴─────┐   ┌───┴───┐
    │ Registro │  │Recargar│  │Vehiculos│   │Evaluar   │   │Trasla- │
    │  Login   │  │ Saldo  │  │         │   │ Chofer   │   │  dos   │
    │  Perfil  │  │        │  │Contactos│   │          │   │        │
    └──────────┘  │Solicit.│  │Emergenc.│   │Revisar   │   │Reportes│
                  │ Viaje  │  │         │   │Vehiculo  │   └────────┘
                  │        │  │Datos    │   │          │
                  │Historial│  │Bancarios│   │Pagar     │
                  │ Viajes  │  │         │   │ Chofer   │
                  │        │  │Viajes   │   │          │
                  │Historial│  │Asignados│   │Ganancias │
                  │Recargas│  │         │   │          │
                  └────────┘  └─────────┘   │Bancos    │
                                            │          │
                                            │Evaluacio-│
                                            │nes/Revis.│
                                            └──────────┘
```

## Jerarquía de Componentes del Frontend

```
App (BrowserRouter)
├── Login
├── Register
└── Dashboard
    └── Layout (Sidebar dinámico)
        ├── Perfil
        ├── Módulo Cliente
        │   ├── RecargarSaldo
        │   ├── SolicitarViaje
        │   ├── HistorialViajes (con filtros)
        │   └── HistorialRecargas
        ├── Módulo Chofer
        │   ├── Vehiculos
        │   ├── Contactos
        │   ├── DatosBancarios
        │   └── ViajesAsignados (con filtros)
        ├── Módulo Personal Admin
        │   ├── EvaluarChofer
        │   ├── RevisarVehiculo
        │   ├── PagarChofer
        │   ├── Ganancias
        │   ├── BancoChofer
        │   ├── EvaluacionesChofer
        │   ├── RevisionesVehiculo
        │   └── ListadoTraslados (con filtros)
        └── Módulo Admin
            ├── ListadoTraslados (con filtros)
            └── Reportes
```

## Arquitectura del Backend (API REST)

```
Express Server (:3000)
├── Middlewares Globales
│   ├── cors()
│   └── express.json()
│
├── /api/auth
│   ├── POST /registro → auth.controller.registro
│   ├── POST /login    → auth.controller.login
│   └── GET  /perfil   → auth.controller.perfil
│
├── /api/clientes [JWT, CLIENTE]
│   ├── POST /recargar          → recargarSaldo
│   ├── GET  /recargas          → historialRecargas
│   ├── GET  /saldo             → consultarSaldo
│   └── GET  /viajes            → historialViajes
│
├── /api/choferes [JWT, CHOFER]
│   ├── GET  /vehiculos         → listarVehiculos
│   ├── POST /vehiculos         → registrarVehiculo
│   ├── POST /contactos         → registrarContactos
│   ├── GET  /viajes            → viajesAsignados
│   ├── PUT  /banco             → actualizarBanco
│   ├── GET  /stats             → estadisticas
│   └── GET  /listar            → listarChoferes
│
├── /api/traslados [JWT]
│   ├── POST /                 → solicitarTraslado [CLIENTE]
│   ├── PUT  /:id/completar     → completarTraslado [CHOFER, ADMIN]
│   └── PUT  /:id/cancelar      → cancelarTraslado [CHOFER, ADMIN]
│
├── /api/admin [JWT, PERSONAL_ADMIN]
│   ├── POST /evaluar-chofer     → evaluarChofer
│   ├── POST /revisar-vehiculo   → revisarVehiculo
│   ├── POST /pagar-chofer       → pagarChofer
│   ├── POST /bancos             → crearBanco
│   ├── GET  /choferes           → listarChoferes
│   ├── GET  /choferes/:id/evaluaciones → evaluacionesChofer
│   ├── PUT  /choferes/:id/banco → actualizarBancoChofer
│   └── GET  /traslados          → listarTraslados
│
├── /api/reportes [JWT, ADMIN/PERSONAL_ADMIN]
│   ├── GET /ganancias           → ganancias
│   ├── GET /pagos-chofer        → pagosChofer
│   └── GET /traslados           → listarTraslados
│
├── /api/bancos [JWT]
│   └── GET /                    → listarBancos
│
├── /api/vehiculos [JWT, PERSONAL_ADMIN]
│   ├── GET /                    → listar
│   └── GET /:id/revisiones      → revisionesVehiculo
│
└── GET /health                  → Health check
```

## Modelo de Datos (12 Tablas)

```
Base de Datos: decarrerita (PostgreSQL 16)
│
├── usuarios              → Tabla base de usuarios (4 roles)
├── choferes              → Datos bancarios y saldos
├── contactos_emergencia  → Contactos de emergencia (min 2)
├── vehiculos             → Vehículos registrados
├── evaluaciones_psicologicas → Evaluaciones psicológicas
├── revisiones_vehiculares    → Revisiones técnicas
├── clientes              → Clientes con saldo
├── recargas_saldo        → Historial de recargas
├── traslados             → Traslados solicitados
├── pagos_chofer          → Pagos a choferes
├── bancos                → Catálogo de bancos
└── personal_admin        → Personal administrativo
```

## Tecnologías Utilizadas

| Capa | Tecnología | Versión |
|------|-----------|---------|
| Backend | Node.js + Express + TypeScript | 22 / 4.21 |
| Frontend | React 19 + Vite + TypeScript | 6.x |
| Base de Datos | PostgreSQL | 16 Alpine |
| ORM | Prisma | 6 |
| Autenticación | JWT + bcryptjs | — |
| Validación | Zod | — |
| UI | Bootstrap 5 | 5.x |
| Containerización | Docker Compose | — |
