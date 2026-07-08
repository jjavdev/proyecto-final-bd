# Pantallas de Formularios

## 1. Login

**Ruta:** `/login`
**Descripcion:** Formulario de inicio de sesion para todos los usuarios del sistema.

| Campo | Tipo | Descripcion |
|-------|------|-------------|
| Email | text | Correo electronico del usuario |
| Contrasena | password | Contrasena del usuario |

**Validacion:** Ambos campos son requeridos. El boton "Iniciar Sesion" se deshabilita durante la carga. En caso de error se muestra un mensaje en rojo.

**Script relacionado:** `POST /api/auth/login` → `auth.controller.ts`

---

## 2. Registro

**Ruta:** `/register`
**Descripcion:** Formulario de registro para nuevos usuarios.

| Campo | Tipo | Descripcion |
|-------|------|-------------|
| Nombre | text | Nombre de pila |
| Apellido | text | Apellido |
| Cedula | text | Numero de cedula (unico) |
| Email | email | Correo electronico (unico) |
| Telefono | tel | Numero de telefono |
| Contrasena | password | Contrasena |
| Rol | select | Chofer o Cliente |

**Validacion:** Todos los campos son requeridos. El email debe ser unico. La cedula debe ser unica.

**Script relacionado:** `POST /api/auth/registro` → `auth.controller.ts`

---

## 3. Recargar Saldo

**Ruta:** `/dashboard/recargar` (CLIENTE)
**Descripcion:** Formulario para que el cliente transfiera dinero a su saldo.

| Campo | Tipo | Descripcion |
|-------|------|-------------|
| Monto | number | Monto a recargar |
| Banco | select | Entidad bancaria (cargado desde BD) |
| Nro. Referencia | text | Numero de referencia de la transferencia |

**Validacion:** Monto debe ser positivo. Referencia no debe estar vacia.

**Script relacionado:** `POST /api/clientes/recargar` → `cliente.controller.ts`

---

## 4. Solicitar Viaje

**Ruta:** `/dashboard/solicitar-viaje` (CLIENTE)
**Descripcion:** Formulario para solicitar un traslado.

| Campo | Tipo | Descripcion |
|-------|------|-------------|
| Origen | text | Direccion o punto de origen |
| Destino | text | Direccion o punto de destino |
| Distancia (km) | number | Distancia estimada en kilometros |

**Resultado:** Muestra el costo calculado, nombre del chofer asignado y datos del vehiculo.

**Script relacionado:** `POST /api/traslados` → `traslado.controller.ts`

---

## 5. Registrar Vehiculo

**Ruta:** `/dashboard/vehiculos` (CHOFER)
**Descripcion:** Formulario para que el chofer registre un nuevo vehiculo.

| Campo | Tipo | Descripcion |
|-------|------|-------------|
| Placa | text | Placa del vehiculo (unico) |
| Marca | text | Marca del vehiculo |
| Modelo | text | Modelo del vehiculo |
| Anio | number | Anio de fabricacion |
| Color | text | Color del vehiculo |

**Validacion:** Placa debe ser unica. Anio debe ser numerico.

**Script relacionado:** `POST /api/choferes/vehiculos` → `chofer.controller.ts`

---

## 6. Registrar Contactos de Emergencia

**Ruta:** `/dashboard/contactos` (CHOFER)
**Descripcion:** Formulario para registrar minimo 2 contactos de emergencia.

| Campo | Tipo | Descripcion |
|-------|------|-------------|
| Contacto 1 - Nombre | text | Nombre del contacto |
| Contacto 1 - Telefono | tel | Telefono del contacto |
| Contacto 1 - Parentesco | text | Relacion con el chofer |
| Contacto 2 - Nombre | text | Nombre del contacto |
| Contacto 2 - Telefono | tel | Telefono del contacto |
| Contacto 2 - Parentesco | text | Relacion con el chofer |

**Validacion:** Se requieren exactamente 2 contactos. Todos los campos son requeridos.

**Script relacionado:** `POST /api/choferes/contactos` → `chofer.controller.ts`

---

## 7. Datos Bancarios

**Ruta:** `/dashboard/banco` (CHOFER)
**Descripcion:** Formulario para actualizar la cuenta bancaria del chofer.

| Campo | Tipo | Descripcion |
|-------|------|-------------|
| Banco | select | Entidad bancaria (cargado desde BD) |
| Nro. Cuenta | text | Numero de cuenta bancaria |

**Validacion:** Nro. Cuenta debe tener minimo 5 caracteres.

**Script relacionado:** `PUT /api/choferes/banco` → `chofer.controller.ts`

---

## 8. Evaluar Chofer

**Ruta:** `/dashboard/evaluar-chofer` (PERSONAL_ADMIN)
**Descripcion:** Formulario para realizar evaluacion psicologica a un chofer.

| Campo | Tipo | Descripcion |
|-------|------|-------------|
| Chofer | select | Chofer a evaluar (cargado desde BD) |
| Nota | number | Calificacion (0-100) |

**Validacion:** Nota debe ser entero entre 0 y 100. Si nota >= 73 el chofer se activa automaticamente.

**Script relacionado:** `POST /api/admin/evaluar-chofer` → `admin.controller.ts`

---

## 9. Revisar Vehiculo

**Ruta:** `/dashboard/revisar-vehiculo` (PERSONAL_ADMIN)
**Descripcion:** Formulario para realizar revision tecnica a un vehiculo.

| Campo | Tipo | Descripcion |
|-------|------|-------------|
| Vehiculo | select | Vehiculo a revisar (cargado desde BD) |
| Calificacion | number | Calificacion (0-100) |

**Validacion:** Calificacion debe ser entero entre 0 y 100. Si calificacion >= 65 el vehiculo se activa automaticamente.

**Script relacionado:** `POST /api/admin/revisar-vehiculo` → `admin.controller.ts`

---

## 10. Pagar Chofer

**Ruta:** `/dashboard/pagar-chofer` (PERSONAL_ADMIN)
**Descripcion:** Formulario para realizar pago a un chofer.

| Campo | Tipo | Descripcion |
|-------|------|-------------|
| Chofer | select | Chofer a pagar (cargado desde BD) |
| Monto | number | Monto a pagar |
| Nro. Referencia | text | Numero de referencia del pago |

**Validacion:** Monto debe ser positivo. Referencia no debe estar vacia.

**Script relacionado:** `POST /api/admin/pagar-chofer` → `admin.controller.ts`

---

## 11. Asignar Banco a Chofer

**Ruta:** `/dashboard/banco-chofer` (PERSONAL_ADMIN)
**Descripcion:** Formulario para asignar o cambiar la entidad bancaria de un chofer.

| Campo | Tipo | Descripcion |
|-------|------|-------------|
| Chofer | select | Chofer a modificar (cargado desde BD) |
| Banco | select | Nueva entidad bancaria (cargado desde BD) |
| Nro. Cuenta | text | Nuevo numero de cuenta |

**Validacion:** Nro. Cuenta debe tener minimo 5 caracteres.

**Script relacionado:** `PUT /api/admin/choferes/:id/banco` → `admin.controller.ts`
