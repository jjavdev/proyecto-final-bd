# Pantallas de Salida de Consultas

## 1. Perfil de Usuario

**Ruta:** `/dashboard/perfil`
**Descripcion:** Muestra los datos personales del usuario autenticado.

**Datos mostrados:**
- Nombre completo, cedula, email, telefono, rol
- Para choferes: saldo pendiente ("Por cobrar") y saldo pagado ("Cobrado")

**Script SQL:**
```sql
SELECT u.nombre, u.apellido, u.cedula, u.email, u.telefono, u.rol,
       ch.saldo_pendiente, ch.saldo_pagado
FROM usuarios u
LEFT JOIN choferes ch ON ch.usuario_id = u.id
WHERE u.id = $1
```

---

## 2. Listado de Traslados

**Ruta:** `/dashboard/traslados` (ADMIN, PERSONAL_ADMIN)
**Descripcion:** Lista todos los traslados con filtros por fecha, estado y estado de pago.

**Columnas:** ID, Origen, Destino, Costo, Estado, Fecha, Chofer, Cliente, Pagado, Placa, Accion

**Filtros:** Inicio, Fin (fechas), Estado (Todos/Pendiente/Completado/Cancelado), Pagado (Todos/Si/No)

**Acciones:** Botones OK (completar) y X (cancelar) para traslados pendientes.

**Script SQL:**
```sql
SELECT t.id, t.origen, t.destino, t.costo, t.estado, t.fecha, t.pagado,
       u.nombre AS chofer_nombre, u.apellido AS chofer_apellido,
       c.nombre AS cliente_nombre, c.apellido AS cliente_apellido,
       v.placa
FROM traslados t
JOIN choferes ch ON t.chofer_id = ch.id
JOIN usuarios u ON ch.usuario_id = u.id
JOIN clientes cl ON t.cliente_id = cl.id
JOIN usuarios c ON cl.usuario_id = c.id
LEFT JOIN LATERAL (
  SELECT v2.placa FROM vehiculos v2
  WHERE v2.chofer_id = ch.id AND v2.activo = true LIMIT 1
) v ON true
WHERE 1=1
  AND ($1::date IS NULL OR t.fecha >= $1::date)
  AND ($2::date IS NULL OR t.fecha <= $2::date)
  AND ($3::text IS NULL OR t.estado = $3)
  AND ($4::boolean IS NULL OR t.pagado = $4)
ORDER BY t.fecha DESC
```

---

## 3. Mis Viajes (Chofer)

**Ruta:** `/dashboard/viajes` (CHOFER)
**Descripcion:** Lista los viajes asignados al chofer autenticado con filtros.

**Columnas:** ID, Origen, Destino, Costo, Estado, Fecha, Cliente, Accion

**Filtros:** Inicio, Fin (fechas), Estado (Todos/Pendiente/Completado/Cancelado)

**Acciones:** Boton "Completar" para viajes pendientes.

**Script SQL:**
```sql
SELECT t.id, t.origen, t.destino, t.costo, t.estado, t.fecha,
       u.nombre AS cliente_nombre, u.apellido AS cliente_apellido
FROM traslados t
JOIN clientes cl ON t.cliente_id = cl.id
JOIN usuarios u ON cl.usuario_id = u.id
WHERE t.chofer_id = $1
  AND ($2::date IS NULL OR t.fecha >= $2::date)
  AND ($3::date IS NULL OR t.fecha <= $3::date)
  AND ($4::text IS NULL OR t.estado = $4)
ORDER BY t.fecha DESC
```

---

## 4. Historial de Viajes (Cliente)

**Ruta:** `/dashboard/historial-viajes` (CLIENTE)
**Descripcion:** Lista los viajes realizados por el cliente con filtros.

**Columnas:** ID, Origen, Destino, Costo, Estado, Fecha, Chofer, Vehiculo

**Filtros:** Inicio, Fin (fechas), Estado (Todos/Pendiente/Completado/Cancelado)

**Script SQL:**
```sql
SELECT t.id, t.origen, t.destino, t.costo, t.estado, t.fecha,
       u.nombre AS chofer_nombre, u.apellido AS chofer_apellido,
       v.placa, v.marca, v.modelo
FROM traslados t
JOIN choferes c ON t.chofer_id = c.id
JOIN usuarios u ON c.usuario_id = u.id
LEFT JOIN LATERAL (
  SELECT v2.placa, v2.marca, v2.modelo FROM vehiculos v2
  WHERE v2.chofer_id = c.id AND v2.activo = true LIMIT 1
) v ON true
WHERE t.cliente_id = $1
  AND ($2::date IS NULL OR t.fecha >= $2::date)
  AND ($3::date IS NULL OR t.fecha <= $3::date)
  AND ($4::text IS NULL OR t.estado = $4)
ORDER BY t.fecha DESC
```

---

## 5. Historial de Recargas

**Ruta:** `/dashboard/historial-recargas` (CLIENTE)
**Descripcion:** Muestra el historial de recargas de saldo del cliente.

**Columnas:** ID, Monto, Nro. Referencia, Fecha, Banco

**Script SQL:**
```sql
SELECT r.id, r.monto, r.nro_referencia, r.fecha, b.nombre AS banco
FROM recargas_saldo r
JOIN bancos b ON r.banco_id = b.id
WHERE r.cliente_id = $1
ORDER BY r.fecha DESC
```

---

## 6. Ganancias por Periodo

**Ruta:** `/dashboard/ganancias` (PERSONAL_ADMIN)
**Descripcion:** Reporte de ganancias de la empresa agrupadas por dia.

**Filtros:** Inicio, Fin (fechas)

**Columnas:** Dia, Viajes realizados, Total Bruto, Ganancia Empresa (30%)

**Script SQL:**
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

---

## 7. Reporte de Pagos a Chofer

**Ruta:** `/dashboard/reportes` (ADMIN)
**Descripcion:** Muestra los pagos realizados a un chofer especifico en un periodo.

**Filtros:** Chofer (select), Inicio, Fin (fechas)

**Columnas:** ID Pago, Monto, Fecha, Nro. Referencia

**Script SQL:**
```sql
SELECT p.id, p.monto, p.fecha, p.nro_referencia
FROM pagos_chofer p
WHERE p.chofer_id = $1
  AND p.fecha >= $2::date
  AND p.fecha <= $3::date
ORDER BY p.fecha DESC
```

---

## 8. Evaluaciones de un Chofer

**Ruta:** `/dashboard/evaluaciones-chofer` (PERSONAL_ADMIN)
**Descripcion:** Muestra el historial de evaluaciones psicologicas de un chofer.

**Columnas:** ID, Nota, Aprobado, Fecha, Evaluador

**Script SQL:**
```sql
SELECT e.id, e.nota, e.aprobado, e.fecha, u.nombre AS evaluador_nombre
FROM evaluaciones_psicologicas e
JOIN personal_admin p ON e.evaluador_id = p.id
JOIN usuarios u ON p.usuario_id = u.id
WHERE e.chofer_id = $1
ORDER BY e.fecha DESC
```

---

## 9. Revisiones de un Vehiculo

**Ruta:** `/dashboard/revisiones-vehiculo` (PERSONAL_ADMIN)
**Descripcion:** Muestra el historial de revisiones tecnicas de un vehiculo.

**Columnas:** ID, Calificacion, Apto, Fecha, Evaluador

**Script SQL:**
```sql
SELECT r.id, r.calificacion, r.apto, r.fecha, u.nombre AS evaluador_nombre
FROM revisiones_vehiculares r
JOIN personal_admin p ON r.evaluador_id = p.id
JOIN usuarios u ON p.usuario_id = u.id
WHERE r.vehiculo_id = $1
ORDER BY r.fecha DESC
```

---

## 10. Listado de Choferes

**Ruta:** Usado internamente en selects dinamicos
**Descripcion:** Lista todos los choferes registrados con su estado y datos bancarios.

**Script SQL:**
```sql
SELECT ch.id, u.nombre, u.apellido, u.cedula, ch.activo,
       ch.saldo_pendiente, ch.saldo_pagado,
       b.nombre AS banco, ch.nro_cuenta
FROM choferes ch
JOIN usuarios u ON ch.usuario_id = u.id
JOIN bancos b ON ch.banco_id = b.id
ORDER BY u.nombre
```

---

## 11. Listado de Vehiculos

**Ruta:** Usado internamente en selects dinamicos
**Descripcion:** Lista todos los vehiculos con datos del chofer y estado de revision.

**Columnas:** ID, Placa, Marca, Modelo, Anio, Color, Activo, Chofer, Ultima Revision

**Script SQL:**
```sql
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
```

---

## 12. Saldo del Cliente (Sidebar)

**Ruta:** Se muestra en el sidebar del Layout
**Descripcion:** Consulta el saldo disponible del cliente autenticado.

**Script SQL:**
```sql
SELECT saldo FROM clientes WHERE usuario_id = $1
```

---

## 13. Estadisticas del Chofer (Sidebar)

**Ruta:** Se muestra en el sidebar del Layout
**Descripcion:** Consulta los saldos pendiente y pagado del chofer autenticado.

**Script SQL:**
```sql
SELECT saldo_pendiente, saldo_pagado FROM choferes WHERE usuario_id = $1
```
