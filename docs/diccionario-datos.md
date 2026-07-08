# Diccionario de Datos - Decarrerita
Documento generado automaticamente desde la base de datos.

## usuarios
**Descripcion:** Almacena los datos de inicio de sesion y datos basicos de todos los usuarios del sistema
**Clave Primaria:** id

| Campo | Tipo | Nulo | Defecto | PK | FK | Descripcion |
|-------|------|------|---------|----|----|-------------|
| id | integer | NO | nextval('usuarios_id_seq'::regclass) | X |  | Identificador unico autoincremental |
| email | text | NO | - |  |  | Correo electronico unico del usuario |
| password_hash | text | NO | - |  |  | Hash de la contrasena (bcrypt) |
| nombre | text | NO | - |  |  | Nombre de pila |
| apellido | text | NO | - |  |  | Apellido |
| cedula | text | NO | - |  |  | Numero de cedula de identidad (unico) |
| telefono | text | NO | - |  |  | Numero de telefono de contacto |
| rol | USER-DEFINED | NO | - |  |  | Rol del usuario: ADMIN, CHOFER, CLIENTE o PERSONAL_ADMIN |
| activo | boolean | NO | true |  |  | Indica si el registro esta activo |
| creado_en | timestamp without time zone | NO | CURRENT_TIMESTAMP |  |  | Fecha y hora de creacion del registro |
| actualizado_en | timestamp without time zone | NO | - |  |  | Fecha y hora de la ultima actualizacion |

## choferes
**Descripcion:** Datos especificos de los choferes, incluyendo informacion bancaria y saldos
**Clave Primaria:** id
**Claves Foraneas:** → usuarios.id, → bancos.id

| Campo | Tipo | Nulo | Defecto | PK | FK | Descripcion |
|-------|------|------|---------|----|----|-------------|
| id | integer | NO | nextval('choferes_id_seq'::regclass) | X |  | Identificador unico autoincremental |
| usuario_id | integer | NO | - |  | X | Referencia al usuario en la tabla usuarios |
| banco_id | integer | NO | - |  | X | Referencia al banco en la tabla bancos |
| nro_cuenta | text | NO | - |  |  | Numero de cuenta bancaria del chofer |
| saldo_pendiente | double precision | NO | 0 |  |  | Monto pendiente por cobrar acumulado |
| saldo_pagado | double precision | NO | 0 |  |  | Monto ya cobrado por el chofer |
| activo | boolean | NO | true |  |  | Indica si el registro esta activo |
| creado_en | timestamp without time zone | NO | CURRENT_TIMESTAMP |  |  | Fecha y hora de creacion del registro |

## contactos_emergencia
**Descripcion:** Contactos de emergencia asociados a cada chofer (minimo 2)
**Clave Primaria:** id
**Claves Foraneas:** → choferes.id

| Campo | Tipo | Nulo | Defecto | PK | FK | Descripcion |
|-------|------|------|---------|----|----|-------------|
| id | integer | NO | nextval('contactos_emergencia_id_seq'::regclass) | X |  | Identificador unico autoincremental |
| chofer_id | integer | NO | - |  | X | Referencia al chofer en la tabla choferes |
| nombre | text | NO | - |  |  | Nombre de pila |
| telefono | text | NO | - |  |  | Numero de telefono de contacto |
| parentesco | text | NO | - |  |  | Relacion familiar o de amistad del contacto |

## vehiculos
**Descripcion:** Vehiculos registrados por los choferes para realizar traslados
**Clave Primaria:** id
**Claves Foraneas:** → choferes.id

| Campo | Tipo | Nulo | Defecto | PK | FK | Descripcion |
|-------|------|------|---------|----|----|-------------|
| id | integer | NO | nextval('vehiculos_id_seq'::regclass) | X |  | Identificador unico autoincremental |
| chofer_id | integer | NO | - |  | X | Referencia al chofer en la tabla choferes |
| placa | text | NO | - |  |  | Placa del vehiculo (unico) |
| marca | text | NO | - |  |  | Marca del vehiculo |
| modelo | text | NO | - |  |  | Modelo del vehiculo |
| anio | integer | NO | - |  |  | Anio de fabricacion del vehiculo |
| color | text | NO | - |  |  | Color del vehiculo |
| activo | boolean | NO | true |  |  | Indica si el registro esta activo |
| creado_en | timestamp without time zone | NO | CURRENT_TIMESTAMP |  |  | Fecha y hora de creacion del registro |

## evaluaciones_psicologicas
**Descripcion:** Evaluaciones psicologicas realizadas a los choferes postulantes
**Clave Primaria:** id
**Claves Foraneas:** → choferes.id, → personal_admin.id

| Campo | Tipo | Nulo | Defecto | PK | FK | Descripcion |
|-------|------|------|---------|----|----|-------------|
| id | integer | NO | nextval('evaluaciones_psicologicas_id_seq'::regclass) | X |  | Identificador unico autoincremental |
| chofer_id | integer | NO | - |  | X | Referencia al chofer en la tabla choferes |
| nota | integer | NO | - |  |  | Nota obtenida en la evaluacion psicologica (0-100) |
| fecha | timestamp without time zone | NO | - |  |  | Fecha en que se realizo la prueba o transaccion |
| aprobado | boolean | NO | - |  |  | Indica si la evaluacion fue aprobada (nota >= 73) |
| evaluador_id | integer | NO | - |  | X | Referencia al evaluador (personal_admin) |
| creado_en | timestamp without time zone | NO | CURRENT_TIMESTAMP |  |  | Fecha y hora de creacion del registro |

## revisiones_vehiculares
**Descripcion:** Revisiones tecnicas realizadas a los vehiculos
**Clave Primaria:** id
**Claves Foraneas:** → vehiculos.id, → personal_admin.id

| Campo | Tipo | Nulo | Defecto | PK | FK | Descripcion |
|-------|------|------|---------|----|----|-------------|
| id | integer | NO | nextval('revisiones_vehiculares_id_seq'::regclass) | X |  | Identificador unico autoincremental |
| vehiculo_id | integer | NO | - |  | X | Referencia al vehiculo en la tabla vehiculos |
| calificacion | integer | NO | - |  |  | Calificacion obtenida en la revision vehicular (0-100) |
| apto | boolean | NO | - |  |  | Indica si el vehiculo fue considerado apto (calificacion >= 65) |
| fecha | timestamp without time zone | NO | - |  |  | Fecha en que se realizo la prueba o transaccion |
| evaluador_id | integer | NO | - |  | X | Referencia al evaluador (personal_admin) |
| creado_en | timestamp without time zone | NO | CURRENT_TIMESTAMP |  |  | Fecha y hora de creacion del registro |

## clientes
**Descripcion:** Datos especificos de los clientes, incluyendo su saldo disponible
**Clave Primaria:** id
**Claves Foraneas:** → usuarios.id

| Campo | Tipo | Nulo | Defecto | PK | FK | Descripcion |
|-------|------|------|---------|----|----|-------------|
| id | integer | NO | nextval('clientes_id_seq'::regclass) | X |  | Identificador unico autoincremental |
| usuario_id | integer | NO | - |  | X | Referencia al usuario en la tabla usuarios |
| saldo | double precision | NO | 0 |  |  | Saldo disponible del cliente |
| creado_en | timestamp without time zone | NO | CURRENT_TIMESTAMP |  |  | Fecha y hora de creacion del registro |

## recargas_saldo
**Descripcion:** Historial de recargas de saldo realizadas por los clientes
**Clave Primaria:** id
**Claves Foraneas:** → clientes.id, → bancos.id

| Campo | Tipo | Nulo | Defecto | PK | FK | Descripcion |
|-------|------|------|---------|----|----|-------------|
| id | integer | NO | nextval('recargas_saldo_id_seq'::regclass) | X |  | Identificador unico autoincremental |
| cliente_id | integer | NO | - |  | X | Referencia al cliente en la tabla clientes |
| monto | double precision | NO | - |  |  | Monto de la transaccion |
| banco_id | integer | NO | - |  | X | Referencia al banco en la tabla bancos |
| nro_referencia | text | NO | - |  |  | Numero de referencia de la transaccion bancaria |
| fecha | timestamp without time zone | NO | CURRENT_TIMESTAMP |  |  | Fecha en que se realizo la prueba o transaccion |

## traslados
**Descripcion:** Registro de todos los traslados solicitados en el sistema
**Clave Primaria:** id
**Claves Foraneas:** → clientes.id, → choferes.id

| Campo | Tipo | Nulo | Defecto | PK | FK | Descripcion |
|-------|------|------|---------|----|----|-------------|
| id | integer | NO | nextval('traslados_id_seq'::regclass) | X |  | Identificador unico autoincremental |
| cliente_id | integer | NO | - |  | X | Referencia al cliente en la tabla clientes |
| chofer_id | integer | NO | - |  | X | Referencia al chofer en la tabla choferes |
| origen | text | NO | - |  |  | Direccion o punto de origen del traslado |
| destino | text | NO | - |  |  | Direccion o punto de destino del traslado |
| costo | double precision | NO | - |  |  | Costo total del traslado calculado por la tarifa |
| estado | text | NO | 'pendiente'::text |  |  | Estado del traslado: pendiente, completado o cancelado |
| fecha | timestamp without time zone | NO | CURRENT_TIMESTAMP |  |  | Fecha en que se realizo la prueba o transaccion |
| pagado | boolean | NO | false |  |  | Indica si el traslado ha sido pagado al chofer |
| creado_en | timestamp without time zone | NO | CURRENT_TIMESTAMP |  |  | Fecha y hora de creacion del registro |

## pagos_chofer
**Descripcion:** Pagos realizados por el personal administrativo a los choferes
**Clave Primaria:** id
**Claves Foraneas:** → choferes.id

| Campo | Tipo | Nulo | Defecto | PK | FK | Descripcion |
|-------|------|------|---------|----|----|-------------|
| id | integer | NO | nextval('pagos_chofer_id_seq'::regclass) | X |  | Identificador unico autoincremental |
| chofer_id | integer | NO | - |  | X | Referencia al chofer en la tabla choferes |
| monto | double precision | NO | - |  |  | Monto de la transaccion |
| fecha | timestamp without time zone | NO | CURRENT_TIMESTAMP |  |  | Fecha en que se realizo la prueba o transaccion |
| nro_referencia | text | NO | - |  |  | Numero de referencia de la transaccion bancaria |
| creado_en | timestamp without time zone | NO | CURRENT_TIMESTAMP |  |  | Fecha y hora de creacion del registro |

## bancos
**Descripcion:** Catalogo de entidades bancarias disponibles en el sistema
**Clave Primaria:** id

| Campo | Tipo | Nulo | Defecto | PK | FK | Descripcion |
|-------|------|------|---------|----|----|-------------|
| id | integer | NO | nextval('bancos_id_seq'::regclass) | X |  | Identificador unico autoincremental |
| nombre | text | NO | - |  |  | Nombre de pila |

## personal_admin
**Descripcion:** Datos del personal administrativo que gestiona el sistema
**Clave Primaria:** id
**Claves Foraneas:** → usuarios.id

| Campo | Tipo | Nulo | Defecto | PK | FK | Descripcion |
|-------|------|------|---------|----|----|-------------|
| id | integer | NO | nextval('personal_admin_id_seq'::regclass) | X |  | Identificador unico autoincremental |
| usuario_id | integer | NO | - |  | X | Referencia al usuario en la tabla usuarios |
| creado_en | timestamp without time zone | NO | CURRENT_TIMESTAMP |  |  | Fecha y hora de creacion del registro |