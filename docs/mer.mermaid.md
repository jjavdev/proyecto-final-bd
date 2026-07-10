# Modelo Entidad-Relación — Decarrerita

```mermaid
erDiagram
    usuarios ||--o| choferes : "1:1"
    usuarios ||--o| clientes : "1:1"
    usuarios ||--o| personal_admin : "1:1"

    choferes ||--o{ vehiculos : "1:N"
    choferes ||--o{ contactos_emergencia : "1:N"
    choferes ||--o{ evaluaciones_psicologicas : "1:N"
    choferes ||--o{ traslados : "1:N"
    choferes ||--o{ pagos_chofer : "1:N"
    choferes }o--|| bancos : "N:1"

    clientes ||--o{ recargas_saldo : "1:N"
    clientes ||--o{ traslados : "1:N"

    vehiculos ||--o{ revisiones_vehiculares : "1:N"

    recargas_saldo }o--|| bancos : "N:1"

    personal_admin ||--o{ evaluaciones_psicologicas : "1:N"
    personal_admin ||--o{ revisiones_vehiculares : "1:N"

    usuarios {
        int id PK
        string email UK
        string password_hash
        string nombre
        string apellido
        string cedula UK
        string telefono
        enum rol "ADMIN | CHOFER | CLIENTE | PERSONAL_ADMIN"
        boolean activo
        datetime creado_en
        datetime actualizado_en
    }

    choferes {
        int id PK
        int usuario_id FK "-> usuarios.id"
        int banco_id FK "-> bancos.id"
        string nro_cuenta
        float saldo_pendiente
        float saldo_pagado
        boolean activo
        datetime creado_en
    }

    contactos_emergencia {
        int id PK
        int chofer_id FK "-> choferes.id"
        string nombre
        string telefono
        string parentesco
    }

    vehiculos {
        int id PK
        int chofer_id FK "-> choferes.id"
        string placa UK
        string marca
        string modelo
        int anio
        string color
        boolean activo
        datetime creado_en
    }

    evaluaciones_psicologicas {
        int id PK
        int chofer_id FK "-> choferes.id"
        int nota "0-100"
        datetime fecha
        boolean aprobado "nota >= 73"
        int evaluador_id FK "-> personal_admin.id"
        datetime creado_en
    }

    revisiones_vehiculares {
        int id PK
        int vehiculo_id FK "-> vehiculos.id"
        int calificacion "0-100"
        boolean apto "calif >= 65"
        datetime fecha
        int evaluador_id FK "-> personal_admin.id"
        datetime creado_en
    }

    clientes {
        int id PK
        int usuario_id FK "-> usuarios.id"
        float saldo
        datetime creado_en
    }

    recargas_saldo {
        int id PK
        int cliente_id FK "-> clientes.id"
        float monto
        int banco_id FK "-> bancos.id"
        string nro_referencia
        datetime fecha
    }

    traslados {
        int id PK
        int cliente_id FK "-> clientes.id"
        int chofer_id FK "-> choferes.id"
        string origen
        string destino
        float costo
        string estado "pendiente | completado | cancelado"
        datetime fecha
        boolean pagado
        datetime creado_en
    }

    pagos_chofer {
        int id PK
        int chofer_id FK "-> choferes.id"
        float monto
        datetime fecha
        string nro_referencia
        datetime creado_en
    }

    bancos {
        int id PK
        string nombre UK
    }

    personal_admin {
        int id PK
        int usuario_id FK "-> usuarios.id"
        datetime creado_en
    }
```

## Leyenda

| Símbolo | Significado |
|---------|-------------|
| `||--o{` | 1 a muchos (relación 1:N) |
| `||--o|` | 1 a 1 (relación 1:1) |
| `}o--||` | Muchos a 1 (relación N:1) |
| `PK` | Clave primaria |
| `FK` | Clave foránea |
| `UK` | Unique (único) |
