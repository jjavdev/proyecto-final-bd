# Planteamiento del Problema

## Contexto

Decarrerita es una empresa local dedicada al transporte de pasajeros dentro de la ciudad, haciendo uso de flota liviana. La empresa necesita un sistema en línea para gestionar sus operaciones diarias, incluyendo el registro de choferes y vehículos, la solicitud y asignación de traslados, el procesamiento de pagos y la generación de reportes financieros.

## Requerimientos Funcionales

### Gestión de Usuarios
El sistema debe soportar cuatro tipos de usuarios con diferentes niveles de acceso:
- **Administrador**: Acceso completo a reportes y listado de traslados.
- **Chofer**: Gestión de vehículos, contactos de emergencia, datos bancarios y viajes asignados.
- **Cliente**: Recarga de saldo, solicitud de traslados, historial de viajes y recargas.
- **Personal Administrativo**: Evaluación psicológica de choferes, revisión vehicular, pagos a choferes, gestión de bancos y consulta de ganancias.

### Registro y Evaluación de Choferes
- Los choferes deben registrarse con sus datos personales.
- Deben proporcionar al menos dos contactos de emergencia.
- Deben tener asociada una entidad bancaria y número de cuenta para recibir pagos.
- Para ingresar a la plantilla, el chofer debe aprobar una evaluación psicológica con nota mínima de 73 puntos sobre 100.
- Los choferes pueden registrar múltiples vehículos para realizar traslados.

### Registro y Revisión de Vehículos
- Los vehículos no son propiedad de Decarrerita sino de los choferes.
- Cada vehículo debe pasar una revisión técnica con calificación mínima de 65 sobre 100 para ser considerado apto.
- Las revisiones deben realizarse una vez al año.

### Gestión de Clientes
- Los clientes deben registrarse con sus datos personales.
- Pueden transferir dinero a su saldo, registrando fecha, número de referencia y banco.
- El saldo se descuenta automáticamente al solicitar un traslado.

### Solicitud y Asignación de Traslados
- Los clientes solicitan traslados desde un punto A a un punto B.
- El sistema asigna aleatoriamente un chofer activo con vehículo apto.
- El costo del traslado se descuenta del saldo del cliente.
- El cliente puede ver los datos del chofer y vehículo asignados.

### Distribución de Ingresos
- La empresa retiene el 30% del costo de cada traslado.
- El 70% restante se acredita al saldo pendiente del chofer.
- El personal administrativo puede realizar pagos a los choferes, registrando fecha, referencia y monto.

### Reportes y Consultas
- Todos los usuarios pueden ver sus datos personales.
- Los choferes pueden ver sus viajes asignados y filtrarlos por fecha y estado.
- Los clientes pueden ver su historial de viajes y recargas.
- El personal administrativo puede consultar las ganancias de la empresa por período y los pagos realizados a un chofer específico.

## Decisiones de Diseño

### Algoritmo de Cálculo de Tarifa
Se implementó una tarifa fija calculada como: **$3.00 (base) + $1.50 por kilómetro recorrido**. Esta fórmula fue definida por el equipo de desarrollo para cumplir con el requisito de que el algoritmo de cálculo quede a discreción del equipo.

### Activación por Evaluación
- Los choferes se crean inicialmente con estado `activo = false`.
- Al aprobar la evaluación psicológica (nota >= 73), el sistema activa automáticamente al chofer.
- Los vehículos se crean inicialmente con estado `activo = false`.
- Al aprobar la revisión vehicular (calificación >= 65), el sistema activa automáticamente el vehículo.

### Asignación Aleatoria
La asignación de choferes a traslados se realiza mediante una consulta SQL con `ORDER BY RANDOM() LIMIT 1` para garantizar aleatoriedad real.

### Autenticación y Seguridad
Se implementó autenticación basada en JWT (JSON Web Tokens) con bcrypt para hash de contraseñas y Zod para validación de datos de entrada, previniendo inyección SQL y asegurando la integridad de los datos.

## Requerimientos No Funcionales

- La aplicación debe ser accesible via navegador web.
- El tiempo de respuesta para operaciones comunes debe ser inferior a 2 segundos.
- Las contraseñas deben almacenarse usando hash bcrypt.
- Los datos sensibles deben protegerse mediante autenticación JWT.
- El sistema debe ser desplegable mediante Docker Compose para facilitar su instalación.

## Agregados del Equipo

Los siguientes elementos fueron incorporados por el equipo de desarrollo y no estaban explícitamente detallados en el planteamiento original:

1. **Filtros de búsqueda**: Se agregaron filtros por fecha y estado en las vistas de viajes (chofer, cliente y administrador) y un filtro por estado de pago en el listado de traslados.
2. **Sidebar con saldos**: La interfaz muestra el saldo disponible del cliente o los saldos pendiente/pagado del chofer directamente en el menú lateral.
3. **Dashboard modular**: Se implementó un sistema de routing interno por rol que muestra solo las opciones relevantes para cada tipo de usuario.
4. **Selección dinámica**: Los formularios administrativos utilizan selects poblados con datos reales (choferes, vehículos, bancos) en lugar de requerir IDs manuales.
5. **Cancelación con reembolso**: Al cancelar un traslado, el sistema reembolsa automáticamente el costo al saldo del cliente.
6. **Documentación automática**: Se implementaron herramientas para generar el diagrama E-R y el diccionario de datos automáticamente desde el código.
7. **Migración a Material Design 3 (MUI v6)**: Se reemplazó Bootstrap 5 por Material UI v6 para mejorar la presentación visual y la experiencia de usuario.
8. **Indicador de vigencia de revisión**: En la lista de vehículos se indica la fecha de la última revisión para facilitar el control anual de revisiones técnicas.

9. **Auto-refresh de saldos**: El saldo del cliente y los stats del chofer se actualizan automáticamente en el sidebar después de cada recarga, pago o solicitud de viaje, sin necesidad de recargar la página manualmente.
