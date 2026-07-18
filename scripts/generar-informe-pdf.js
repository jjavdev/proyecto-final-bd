const puppeteer = require('puppeteer')
const fs = require('fs')
const path = require('path')

const HTML_PATH = path.resolve(__dirname, '../docs/informe.html')
const PDF_PATH = path.resolve(__dirname, '../docs/informe.pdf')

function imagesToBase64(dir) {
  const images = {}
  const dirPath = path.resolve(__dirname, '../docs', dir)
  if (!fs.existsSync(dirPath)) return images
  fs.readdirSync(dirPath).forEach(f => {
    if (f.endsWith('.png')) {
      const data = fs.readFileSync(path.join(dirPath, f))
      images[f] = `data:image/png;base64,${data.toString('base64')}`
    }
  })
  return images
}

function escHtml(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

function mdToHtml(md) {
  let h = escHtml(md)
  h = h.replace(/^#### (.*$)/gm, '<h4>$1</h4>')
  h = h.replace(/^### (.*$)/gm, '<h3>$1</h3>')
  h = h.replace(/^## (.*$)/gm, '<h2>$1</h2>')
  h = h.replace(/^# (.*$)/gm, '<h1>$1</h1>')
  h = h.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
  h = h.replace(/`([^`]+)`/g, '<code>$1</code>')
  h = h.replace(/```(\w*)\n([\s\S]*?)```/g, '<pre><code>$2</code></pre>')
  h = h.replace(/\|(.+)\|/g, (m) => m.includes('---') ? '' : '<tr>' + m.split('|').filter(c => c.trim()).map(c => '<td>' + c.trim() + '</td>').join('') + '</tr>')
  h = h.replace(/^---$/gm, '<hr>')
  h = h.replace(/\n\n/g, '</p><p>')
  h = h.replace(/^([^<].+)$/gm, (m) => m.startsWith('<') ? m : m)
  return '<div class="doc-section">' + h + '</div>'
}

const screenshots = imagesToBase64('capturas')
const merBase64 = imagesToBase64('.')['Diagrama MER'] || ''

const merImg = merBase64 ? '<img src="' + merBase64 + '" style="max-width:100%">' : '<p>Diagrama no disponible</p>'

function img(name, caption) {
  const d = screenshots[name]
  if (!d) return ''
  return '<div class="screenshot"><img src="' + d + '"><p>' + caption + '</p></div>'
}

const html = '<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><style>' +
'@page { margin: 2.5cm 2cm; }' +
'body { font-family: "Segoe UI", Arial, sans-serif; font-size: 11pt; line-height: 1.6; color: #222; }' +
'.cover { page-break-after: always; text-align: center; padding-top: 200px; }' +
'.cover h1 { font-size: 28pt; color: #1a1a2e; margin-bottom: 10px; }' +
'.cover h2 { font-size: 16pt; color: #555; font-weight: 400; margin-bottom: 40px; }' +
'.cover p { font-size: 12pt; color: #777; }' +
'h1 { font-size: 20pt; color: #1a1a2e; border-bottom: 3px solid #1a1a2e; padding-bottom: 8px; margin-top: 30px; }' +
'h2 { font-size: 16pt; color: #1a1a2e; margin-top: 25px; }' +
'h3 { font-size: 13pt; color: #333; margin-top: 20px; }' +
'table { width: 100%; border-collapse: collapse; margin: 10px 0; font-size: 10pt; }' +
'th { background: #1a1a2e; color: #fff; padding: 8px 10px; text-align: left; }' +
'td { padding: 6px 10px; border-bottom: 1px solid #ddd; }' +
'tr:nth-child(even) td { background: #f5f5f5; }' +
'pre { background: #f0f0f0; padding: 12px; border-radius: 6px; font-size: 9pt; overflow-x: auto; border-left: 4px solid #1a1a2e; white-space: pre-wrap; }' +
'code { background: #f0f0f0; padding: 2px 5px; border-radius: 3px; font-size: 9pt; }' +
'hr { border: none; border-top: 1px solid #ddd; margin: 20px 0; }' +
'.screenshot { page-break-inside: avoid; margin: 15px 0; text-align: center; }' +
'.screenshot img { max-width: 100%; height: auto; border: 1px solid #ddd; border-radius: 4px; }' +
'.screenshot p { font-size: 9pt; color: #666; margin-top: 4px; }' +
'.mer-diagram { page-break-inside: avoid; text-align: center; }' +
'.mer-diagram img { max-width: 100%; }' +
'.toc { page-break-after: always; }' +
'.toc h2 { border: none; }' +
'.toc ul { list-style: none; padding: 0; }' +
'.toc li { padding: 4px 0; font-size: 11pt; }' +
'.page-break { page-break-before: always; }' +
'.section-desc { font-size: 10pt; color: #666; margin-bottom: 15px; }' +
'strong { color: #1a1a2e; }' +
'</style></head><body>'

const cover = '' +
'<div class="cover">' +
'<h1>Decarrerita</h1>' +
'<h2>Sistema de Transporte de Pasajeros</h2>' +
'<p>Proyecto Final &mdash; Sistemas de Base de Datos I</p>' +
'<p>Universidad Nacional Experimental de Guayana (UNEG)</p>' +
'<p>Julio 2026</p>' +
'</div>'

const toc = '' +
'<div class="toc">' +
'<h2>Contenido</h2>' +
'<ul>' +
'<li><strong>a.</strong> Planteamiento del Problema</li>' +
'<li><strong>b.</strong> Carta Estructurada del Sistema</li>' +
'<li><strong>c.</strong> Herramientas de Desarrollo</li>' +
'<li><strong>d.</strong> Modelo Entidad-Relaci&oacute;n</li>' +
'<li><strong>e.</strong> Modelo Relacional</li>' +
'<li><strong>f.</strong> Diccionario de Datos</li>' +
'<li><strong>g.</strong> Pantallas de Formularios</li>' +
'<li><strong>h.</strong> Pantallas de Consultas</li>' +
'</ul>' +
'</div>'

const seccionA = '' +
'<div class="page-break">' +
'<h1>a. Planteamiento del Problema</h1>' +
'<p>Decarrerita es una empresa local dedicada al transporte de pasajeros dentro de la ciudad, haciendo uso de flota liviana. La empresa necesita un sistema en l&iacute;nea para gestionar sus operaciones diarias, incluyendo el registro de choferes y veh&iacute;culos, la solicitud y asignaci&oacute;n de traslados, el procesamiento de pagos y la generaci&oacute;n de reportes financieros.</p>' +

'<h2>Requerimientos Funcionales</h2>' +

'<h3>Gesti&oacute;n de Usuarios</h3>' +
'<p>El sistema soporta cuatro tipos de usuarios:</p>' +
'<table><tr><th>Rol</th><th>Acceso</th></tr>' +
'<tr><td>Administrador</td><td>Reportes y listado de traslados</td></tr>' +
'<tr><td>Chofer</td><td>Veh&iacute;culos, contactos, datos bancarios, viajes asignados</td></tr>' +
'<tr><td>Cliente</td><td>Recarga de saldo, solicitud de traslados, historiales</td></tr>' +
'<tr><td>Personal Administrativo</td><td>Evaluaciones, revisiones, pagos, bancos, ganancias</td></tr>' +
'</table>' +

'<h3>Registro y Evaluaci&oacute;n de Choferes</h3>' +
'<ul>' +
'<li>Los choferes se registran con datos personales y proporcionan al menos dos contactos de emergencia.</li>' +
'<li>Deben tener asociada una entidad bancaria y n&uacute;mero de cuenta para recibir pagos.</li>' +
'<li>Para ingresar a la plantilla, deben aprobar una evaluaci&oacute;n psicol&oacute;gica con nota m&iacute;nima de 73/100.</li>' +
'<li>Pueden registrar m&uacute;ltiples veh&iacute;culos.</li>' +
'</ul>' +

'<h3>Registro y Revisi&oacute;n de Veh&iacute;culos</h3>' +
'<ul>' +
'<li>Los veh&iacute;culos no son propiedad de Decarrerita sino de los choferes.</li>' +
'<li>Cada veh&iacute;culo debe pasar una revisi&oacute;n t&eacute;cnica con calificaci&oacute;n m&iacute;nima de 65/100.</li>' +
'<li>Las revisiones deben realizarse una vez al a&ntilde;o.</li>' +
'</ul>' +

'<h3>Gesti&oacute;n de Clientes</h3>' +
'<ul>' +
'<li>Los clientes se registran con datos personales y pueden transferir dinero a su saldo.</li>' +
'<li>Se registra fecha, n&uacute;mero de referencia y banco de cada recarga.</li>' +
'<li>El saldo se descuenta autom&aacute;ticamente al solicitar un traslado.</li>' +
'</ul>' +

'<h3>Solicitud y Asignaci&oacute;n de Traslados</h3>' +
'<ul>' +
'<li>Los clientes solicitan traslados desde un punto A a un punto B.</li>' +
'<li>El sistema asigna aleatoriamente un chofer activo con veh&iacute;culo apto y revisi&oacute;n vigente.</li>' +
'<li>El costo se descuenta del saldo del cliente y el 70% se acredita al chofer.</li>' +
'<li>El cliente puede ver los datos del chofer y veh&iacute;culo asignados.</li>' +
'</ul>' +

'<h3>Distribuci&oacute;n de Ingresos</h3>' +
'<p>La empresa retiene el 30% del costo de cada traslado. El 70% restante se acredita al saldo pendiente del chofer. El personal administrativo realiza pagos a los choferes registrando fecha, referencia y monto.</p>' +

'<h3>Decisiones de Dise&ntilde;o</h3>' +
'<table><tr><th>Decisi&oacute;n</th><th>Detalle</th></tr>' +
'<tr><td>Algoritmo de tarifa</td><td>$3.00 base + $1.50/km (discrecional del equipo)</td></tr>' +
'<tr><td>Activaci&oacute;n por evaluaci&oacute;n</td><td>Chofer nace inactivo, se activa al aprobar evaluaci&oacute;n (&ge;73)</td></tr>' +
'<tr><td>Activaci&oacute;n por revisi&oacute;n</td><td>Veh&iacute;culo nace inactivo, se activa al aprobar revisi&oacute;n (&ge;65)</td></tr>' +
'<tr><td>Asignaci&oacute;n aleatoria</td><td>ORDER BY RANDOM() LIMIT 1 en SQL</td></tr>' +
'<tr><td>Autenticaci&oacute;n</td><td>JWT + bcrypt + Zod para validaci&oacute;n</td></tr>' +
'<tr><td>Revisi&oacute;n anual</td><td>Filtro WHERE rv.fecha &gt;= NOW() - INTERVAL 1 year</td></tr>' +
'</table>' +

'</div>'

const seccionB = '' +
'<div class="page-break">' +
'<h1>b. Carta Estructurada del Sistema</h1>' +
'<pre>' +
'                         DECARRERITA\n' +
'                Sistema de Transporte de Pasajeros\n' +
'                              |\n' +
'     Auth    Cliente    Chofer    Personal Admin    Admin\n' +
'      |        |          |             |             |\n' +
'  Registro  Recargar   Vehiculos    Evaluar       Traslados\n' +
'  Login     Solicitar  Contactos    Revisar       Reportes\n' +
'  Perfil    Historial  Bancarios    Pagar\n' +
'            Viajes     Viajes       Ganancias\n' +
'            Recargas                Bancos\n' +
'                                    Evaluaciones\n' +
'</pre>' +

'<h2>Arquitectura del Backend</h2>' +
'<pre>' +
'Express Server (:3000)\n' +
'|-- /api/auth       -> registro, login, perfil\n' +
'|-- /api/clientes   -> recargar, recargas, saldo, viajes\n' +
'|-- /api/choferes   -> vehiculos, contactos, viajes, banco\n' +
'|-- /api/traslados  -> solicitar, completar, cancelar\n' +
'|-- /api/admin      -> evaluar, revisar, pagar, bancos, choferes\n' +
'|-- /api/reportes   -> ganancias, pagos-chofer, traslados\n' +
'|-- /api/vehiculos  -> listar, revisiones\n' +
'|-- /api/bancos     -> listar\n' +
'</pre>' +

'<h2>Flujo de una Petici&oacute;n</h2>' +
'<pre>' +
'React -> Axios (agrega JWT) -> Express -> authenticate()\n' +
'  -> authorize(rol) -> validate(Zod) -> Controller\n' +
'  -> Prisma SQL -> PostgreSQL -> JSON Response\n' +
'</pre>' +

'<h2>Middleware Chain</h2>' +
'<pre>' +
'Peticion -> authenticate -> authorize -> validate -> Controller -> Respuesta\n' +
'</pre>' +
'</div>'

const seccionC = '' +
'<div class="page-break">' +
'<h1>c. Herramientas de Desarrollo</h1>' +
'<table>' +
'<tr><th>Capa</th><th>Tecnolog&iacute;a</th><th>Versi&oacute;n</th></tr>' +
'<tr><td>Backend</td><td>Node.js + Express + TypeScript</td><td>22 / 4.21</td></tr>' +
'<tr><td>Frontend</td><td>React 19 + Vite + TypeScript</td><td>6.x</td></tr>' +
'<tr><td>Base de Datos</td><td>PostgreSQL 16 Alpine</td><td>16</td></tr>' +
'<tr><td>ORM</td><td>Prisma</td><td>6</td></tr>' +
'<tr><td>Autenticaci&oacute;n</td><td>JWT + bcryptjs</td><td>-</td></tr>' +
'<tr><td>Validaci&oacute;n</td><td>Zod</td><td>-</td></tr>' +
'<tr><td>UI</td><td>Bootstrap 5 + CSS personalizado</td><td>5.x</td></tr>' +
'<tr><td>Contenedores</td><td>Docker Compose</td><td>-</td></tr>' +
'</table>' +
'</div>'

const seccionD = '' +
'<div class="page-break">' +
'<h1>d. Modelo Entidad-Relaci&oacute;n</h1>' +
'<div class="mer-diagram">' + merImg + '</div>' +
'</div>'

const seccionE = '' +
'<div class="page-break">' +
'<h1>e. Modelo Relacional</h1>' +
'<p>Las 12 tablas definidas en Prisma para PostgreSQL 16.</p>' +

'<h2>Reglas de Negocio</h2>' +
'<table>' +
'<tr><th>Regla</th><th>Implementaci&oacute;n</th></tr>' +
'<tr><td>Evaluaci&oacute;n: nota &ge; 73 aprueba</td><td>Campo <code>aprobado</code> calculado en backend</td></tr>' +
'<tr><td>Revisi&oacute;n: calif. &ge; 65 apto</td><td>Campo <code>apto</code> calculado en backend</td></tr>' +
'<tr><td>Chofer se activa al aprobar</td><td><code>UPDATE choferes SET activo = true</code></td></tr>' +
'<tr><td>Veh&iacute;culo se activa al aprobar</td><td><code>UPDATE vehiculos SET activo = true</code></td></tr>' +
'<tr><td>Asignaci&oacute;n aleatoria</td><td><code>ORDER BY RANDOM() LIMIT 1</code></td></tr>' +
'<tr><td>30% empresa, 70% chofer</td><td><code>costo * 0.30</code> y <code>costo * 0.70</code></td></tr>' +
'<tr><td>Revisi&oacute;n anual</td><td><code>rv.fecha &gt;= NOW() - INTERVAL 1 year</code></td></tr>' +
'<tr><td>Tarifa</td><td><code>$3.00 + distancia_km * $1.50</code></td></tr>' +
'</table>' +

'<h2>Tablas y Relaciones</h2>' +
'<pre>' +
'usuarios (id PK, email UK, password_hash, nombre, apellido, cedula UK, telefono, rol, activo, creado_en, actualizado_en)\n' +
'  |-- 1:1 -- choferes (id PK, usuario_id FK, banco_id FK, nro_cuenta, saldo_pendiente, saldo_pagado, activo, creado_en)\n' +
'  |     |-- 1:N -- vehiculos (id PK, chofer_id FK, placa UK, marca, modelo, anio, color, activo, creado_en)\n' +
'  |     |     |-- 1:N -- revisiones_vehiculares (id PK, vehiculo_id FK, calificacion, apto, fecha, evaluador_id FK)\n' +
'  |     |-- 1:N -- contactos_emergencia (id PK, chofer_id FK, nombre, telefono, parentesco)\n' +
'  |     |-- 1:N -- evaluaciones_psicologicas (id PK, chofer_id FK, nota, fecha, aprobado, evaluador_id FK)\n' +
'  |     |-- 1:N -- traslados (id PK, cliente_id FK, chofer_id FK, origen, destino, costo, estado, fecha, pagado)\n' +
'  |     |-- 1:N -- pagos_chofer (id PK, chofer_id FK, monto, fecha, nro_referencia)\n' +
'  |\n' +
'  |-- 1:1 -- clientes (id PK, usuario_id FK, saldo, creado_en)\n' +
'  |     |-- 1:N -- recargas_saldo (id PK, cliente_id FK, monto, banco_id FK, nro_referencia, fecha)\n' +
'  |     |-- 1:N -- traslados\n' +
'  |\n' +
'  |-- 1:1 -- personal_admin (id PK, usuario_id FK, creado_en)\n' +
'        |-- 1:N -- evaluaciones_psicologicas (via evaluador_id)\n' +
'        |-- 1:N -- revisiones_vehiculares (via evaluador_id)\n' +
'\n' +
'bancos (id PK, nombre UK)\n' +
'  |-- 1:N -- choferes (via banco_id)\n' +
'  |-- 1:N -- recargas_saldo (via banco_id)\n' +
'</pre>' +
'</div>'

const seccionF = '' +
'<div class="page-break">' +
'<h1>f. Diccionario de Datos</h1>' +

'<h2>usuarios</h2>' +
'<p><strong>Descripci&oacute;n:</strong> Almacena los datos de inicio de sesi&oacute;n y datos b&aacute;sicos de todos los usuarios del sistema</p>' +
'<p><strong>Clave Primaria:</strong> id</p>' +
'<table><tr><th>Campo</th><th>Tipo</th><th>Nulo</th><th>PK</th><th>FK</th><th>Descripci&oacute;n</th></tr>' +
'<tr><td>id</td><td>integer</td><td>NO</td><td>X</td><td></td><td>Identificador &uacute;nico autoincremental</td></tr>' +
'<tr><td>email</td><td>text</td><td>NO</td><td></td><td></td><td>Correo electr&oacute;nico &uacute;nico del usuario</td></tr>' +
'<tr><td>password_hash</td><td>text</td><td>NO</td><td></td><td></td><td>Hash de la contrase&ntilde;a (bcrypt)</td></tr>' +
'<tr><td>nombre</td><td>text</td><td>NO</td><td></td><td></td><td>Nombre de pila</td></tr>' +
'<tr><td>apellido</td><td>text</td><td>NO</td><td></td><td></td><td>Apellido</td></tr>' +
'<tr><td>cedula</td><td>text</td><td>NO</td><td></td><td></td><td>N&uacute;mero de c&eacute;dula de identidad (&uacute;nico)</td></tr>' +
'<tr><td>telefono</td><td>text</td><td>NO</td><td></td><td></td><td>N&uacute;mero de tel&eacute;fono de contacto</td></tr>' +
'<tr><td>rol</td><td>Rol</td><td>NO</td><td></td><td></td><td>Rol del usuario: ADMIN, CHOFER, CLIENTE o PERSONAL_ADMIN</td></tr>' +
'<tr><td>activo</td><td>boolean</td><td>NO</td><td></td><td></td><td>Indica si el registro est&aacute; activo</td></tr>' +
'<tr><td>creado_en</td><td>timestamp</td><td>NO</td><td></td><td></td><td>Fecha y hora de creaci&oacute;n del registro</td></tr>' +
'<tr><td>actualizado_en</td><td>timestamp</td><td>NO</td><td></td><td></td><td>Fecha y hora de la &uacute;ltima actualizaci&oacute;n</td></tr>' +
'</table>' +

'<h2>choferes</h2>' +
'<p><strong>Descripci&oacute;n:</strong> Datos espec&iacute;ficos de los choferes, incluyendo informaci&oacute;n bancaria y saldos</p>' +
'<p><strong>Clave Primaria:</strong> id</p>' +
'<p><strong>Claves For&aacute;neas:</strong> usuario_id &rarr; usuarios.id, banco_id &rarr; bancos.id</p>' +
'<table><tr><th>Campo</th><th>Tipo</th><th>Nulo</th><th>PK</th><th>FK</th><th>Descripci&oacute;n</th></tr>' +
'<tr><td>id</td><td>integer</td><td>NO</td><td>X</td><td></td><td>Identificador &uacute;nico autoincremental</td></tr>' +
'<tr><td>usuario_id</td><td>integer</td><td>NO</td><td></td><td>X</td><td>Referencia al usuario en la tabla usuarios</td></tr>' +
'<tr><td>banco_id</td><td>integer</td><td>NO</td><td></td><td>X</td><td>Referencia al banco en la tabla bancos</td></tr>' +
'<tr><td>nro_cuenta</td><td>text</td><td>NO</td><td></td><td></td><td>N&uacute;mero de cuenta bancaria del chofer</td></tr>' +
'<tr><td>saldo_pendiente</td><td>real</td><td>NO</td><td></td><td></td><td>Monto pendiente por cobrar acumulado</td></tr>' +
'<tr><td>saldo_pagado</td><td>real</td><td>NO</td><td></td><td></td><td>Monto ya cobrado por el chofer</td></tr>' +
'<tr><td>activo</td><td>boolean</td><td>NO</td><td></td><td></td><td>Indica si el registro est&aacute; activo</td></tr>' +
'<tr><td>creado_en</td><td>timestamp</td><td>NO</td><td></td><td></td><td>Fecha y hora de creaci&oacute;n del registro</td></tr>' +
'</table>' +

'<h2>contactos_emergencia</h2>' +
'<p><strong>Descripci&oacute;n:</strong> Contactos de emergencia asociados a cada chofer (m&iacute;nimo 2)</p>' +
'<p><strong>Clave Primaria:</strong> id</p>' +
'<table><tr><th>Campo</th><th>Tipo</th><th>Nulo</th><th>PK</th><th>FK</th><th>Descripci&oacute;n</th></tr>' +
'<tr><td>id</td><td>integer</td><td>NO</td><td>X</td><td></td><td>Identificador &uacute;nico autoincremental</td></tr>' +
'<tr><td>chofer_id</td><td>integer</td><td>NO</td><td></td><td>X</td><td>Referencia al chofer en la tabla choferes</td></tr>' +
'<tr><td>nombre</td><td>text</td><td>NO</td><td></td><td></td><td>Nombre del contacto</td></tr>' +
'<tr><td>telefono</td><td>text</td><td>NO</td><td></td><td></td><td>Tel&eacute;fono del contacto</td></tr>' +
'<tr><td>parentesco</td><td>text</td><td>NO</td><td></td><td></td><td>Relaci&oacute;n con el chofer</td></tr>' +
'</table>' +

'<h2>vehiculos</h2>' +
'<p><strong>Descripci&oacute;n:</strong> Veh&iacute;culos registrados por los choferes para realizar traslados</p>' +
'<p><strong>Clave Primaria:</strong> id</p>' +
'<table><tr><th>Campo</th><th>Tipo</th><th>Nulo</th><th>PK</th><th>FK</th><th>Descripci&oacute;n</th></tr>' +
'<tr><td>id</td><td>integer</td><td>NO</td><td>X</td><td></td><td>Identificador &uacute;nico autoincremental</td></tr>' +
'<tr><td>chofer_id</td><td>integer</td><td>NO</td><td></td><td>X</td><td>Referencia al chofer en la tabla choferes</td></tr>' +
'<tr><td>placa</td><td>text</td><td>NO</td><td></td><td></td><td>Placa del veh&iacute;culo (&uacute;nico)</td></tr>' +
'<tr><td>marca</td><td>text</td><td>NO</td><td></td><td></td><td>Marca del veh&iacute;culo</td></tr>' +
'<tr><td>modelo</td><td>text</td><td>NO</td><td></td><td></td><td>Modelo del veh&iacute;culo</td></tr>' +
'<tr><td>anio</td><td>integer</td><td>NO</td><td></td><td></td><td>A&ntilde;o de fabricaci&oacute;n del veh&iacute;culo</td></tr>' +
'<tr><td>color</td><td>text</td><td>NO</td><td></td><td></td><td>Color del veh&iacute;culo</td></tr>' +
'<tr><td>activo</td><td>boolean</td><td>NO</td><td></td><td></td><td>Indica si el registro est&aacute; activo</td></tr>' +
'<tr><td>creado_en</td><td>timestamp</td><td>NO</td><td></td><td></td><td>Fecha y hora de creaci&oacute;n del registro</td></tr>' +
'</table>' +

'<h2>evaluaciones_psicologicas</h2>' +
'<p><strong>Descripci&oacute;n:</strong> Evaluaciones psicol&oacute;gicas realizadas a los choferes postulantes</p>' +
'<p><strong>Clave Primaria:</strong> id</p>' +
'<table><tr><th>Campo</th><th>Tipo</th><th>Nulo</th><th>PK</th><th>FK</th><th>Descripci&oacute;n</th></tr>' +
'<tr><td>id</td><td>integer</td><td>NO</td><td>X</td><td></td><td>Identificador &uacute;nico autoincremental</td></tr>' +
'<tr><td>chofer_id</td><td>integer</td><td>NO</td><td></td><td>X</td><td>Referencia al chofer en la tabla choferes</td></tr>' +
'<tr><td>nota</td><td>integer</td><td>NO</td><td></td><td></td><td>Nota obtenida en la evaluaci&oacute;n psicol&oacute;gica (0-100)</td></tr>' +
'<tr><td>fecha</td><td>timestamp</td><td>NO</td><td></td><td></td><td>Fecha en que se realiz&oacute; la prueba</td></tr>' +
'<tr><td>aprobado</td><td>boolean</td><td>NO</td><td></td><td></td><td>Indica si la evaluaci&oacute;n fue aprobada (nota &ge; 73)</td></tr>' +
'<tr><td>evaluador_id</td><td>integer</td><td>NO</td><td></td><td>X</td><td>Referencia al evaluador (personal_admin)</td></tr>' +
'<tr><td>creado_en</td><td>timestamp</td><td>NO</td><td></td><td></td><td>Fecha y hora de creaci&oacute;n del registro</td></tr>' +
'</table>' +

'<h2>revisiones_vehiculares</h2>' +
'<p><strong>Descripci&oacute;n:</strong> Revisiones t&eacute;cnicas realizadas a los veh&iacute;culos</p>' +
'<p><strong>Clave Primaria:</strong> id</p>' +
'<table><tr><th>Campo</th><th>Tipo</th><th>Nulo</th><th>PK</th><th>FK</th><th>Descripci&oacute;n</th></tr>' +
'<tr><td>id</td><td>integer</td><td>NO</td><td>X</td><td></td><td>Identificador &uacute;nico autoincremental</td></tr>' +
'<tr><td>vehiculo_id</td><td>integer</td><td>NO</td><td></td><td>X</td><td>Referencia al veh&iacute;culo en la tabla vehiculos</td></tr>' +
'<tr><td>calificacion</td><td>integer</td><td>NO</td><td></td><td></td><td>Calificaci&oacute;n obtenida en la revisi&oacute;n vehicular (0-100)</td></tr>' +
'<tr><td>apto</td><td>boolean</td><td>NO</td><td></td><td></td><td>Indica si el veh&iacute;culo fue considerado apto (calif. &ge; 65)</td></tr>' +
'<tr><td>fecha</td><td>timestamp</td><td>NO</td><td></td><td></td><td>Fecha de la revisi&oacute;n</td></tr>' +
'<tr><td>evaluador_id</td><td>integer</td><td>NO</td><td></td><td>X</td><td>Referencia al evaluador (personal_admin)</td></tr>' +
'<tr><td>creado_en</td><td>timestamp</td><td>NO</td><td></td><td></td><td>Fecha y hora de creaci&oacute;n del registro</td></tr>' +
'</table>' +

'<h2>clientes</h2>' +
'<p><strong>Descripci&oacute;n:</strong> Datos espec&iacute;ficos de los clientes, incluyendo su saldo disponible</p>' +
'<p><strong>Clave Primaria:</strong> id</p>' +
'<table><tr><th>Campo</th><th>Tipo</th><th>Nulo</th><th>PK</th><th>FK</th><th>Descripci&oacute;n</th></tr>' +
'<tr><td>id</td><td>integer</td><td>NO</td><td>X</td><td></td><td>Identificador &uacute;nico autoincremental</td></tr>' +
'<tr><td>usuario_id</td><td>integer</td><td>NO</td><td></td><td>X</td><td>Referencia al usuario en la tabla usuarios</td></tr>' +
'<tr><td>saldo</td><td>real</td><td>NO</td><td></td><td></td><td>Saldo disponible del cliente</td></tr>' +
'<tr><td>creado_en</td><td>timestamp</td><td>NO</td><td></td><td></td><td>Fecha y hora de creaci&oacute;n del registro</td></tr>' +
'</table>' +

'<h2>recargas_saldo</h2>' +
'<p><strong>Descripci&oacute;n:</strong> Historial de recargas de saldo realizadas por los clientes</p>' +
'<p><strong>Clave Primaria:</strong> id</p>' +
'<table><tr><th>Campo</th><th>Tipo</th><th>Nulo</th><th>PK</th><th>FK</th><th>Descripci&oacute;n</th></tr>' +
'<tr><td>id</td><td>integer</td><td>NO</td><td>X</td><td></td><td>Identificador &uacute;nico autoincremental</td></tr>' +
'<tr><td>cliente_id</td><td>integer</td><td>NO</td><td></td><td>X</td><td>Referencia al cliente en la tabla clientes</td></tr>' +
'<tr><td>monto</td><td>real</td><td>NO</td><td></td><td></td><td>Monto de la transacci&oacute;n</td></tr>' +
'<tr><td>banco_id</td><td>integer</td><td>NO</td><td></td><td>X</td><td>Referencia al banco en la tabla bancos</td></tr>' +
'<tr><td>nro_referencia</td><td>text</td><td>NO</td><td></td><td></td><td>N&uacute;mero de referencia de la transacci&oacute;n bancaria</td></tr>' +
'<tr><td>fecha</td><td>timestamp</td><td>NO</td><td></td><td></td><td>Fecha de la recarga</td></tr>' +
'</table>' +

'<h2>traslados</h2>' +
'<p><strong>Descripci&oacute;n:</strong> Registro de todos los traslados solicitados en el sistema</p>' +
'<p><strong>Clave Primaria:</strong> id</p>' +
'<table><tr><th>Campo</th><th>Tipo</th><th>Nulo</th><th>PK</th><th>FK</th><th>Descripci&oacute;n</th></tr>' +
'<tr><td>id</td><td>integer</td><td>NO</td><td>X</td><td></td><td>Identificador &uacute;nico autoincremental</td></tr>' +
'<tr><td>cliente_id</td><td>integer</td><td>NO</td><td></td><td>X</td><td>Referencia al cliente en la tabla clientes</td></tr>' +
'<tr><td>chofer_id</td><td>integer</td><td>NO</td><td></td><td>X</td><td>Referencia al chofer en la tabla choferes</td></tr>' +
'<tr><td>origen</td><td>text</td><td>NO</td><td></td><td></td><td>Direcci&oacute;n o punto de origen del traslado</td></tr>' +
'<tr><td>destino</td><td>text</td><td>NO</td><td></td><td></td><td>Direcci&oacute;n o punto de destino del traslado</td></tr>' +
'<tr><td>costo</td><td>real</td><td>NO</td><td></td><td></td><td>Costo total del traslado calculado por la tarifa</td></tr>' +
'<tr><td>estado</td><td>text</td><td>NO</td><td></td><td></td><td>Estado del traslado: pendiente, completado o cancelado</td></tr>' +
'<tr><td>fecha</td><td>timestamp</td><td>NO</td><td></td><td></td><td>Fecha del traslado</td></tr>' +
'<tr><td>pagado</td><td>boolean</td><td>NO</td><td></td><td></td><td>Indica si el traslado ha sido pagado al chofer</td></tr>' +
'<tr><td>creado_en</td><td>timestamp</td><td>NO</td><td></td><td></td><td>Fecha y hora de creaci&oacute;n del registro</td></tr>' +
'</table>' +

'<h2>pagos_chofer</h2>' +
'<p><strong>Descripci&oacute;n:</strong> Pagos realizados por el personal administrativo a los choferes</p>' +
'<p><strong>Clave Primaria:</strong> id</p>' +
'<table><tr><th>Campo</th><th>Tipo</th><th>Nulo</th><th>PK</th><th>FK</th><th>Descripci&oacute;n</th></tr>' +
'<tr><td>id</td><td>integer</td><td>NO</td><td>X</td><td></td><td>Identificador &uacute;nico autoincremental</td></tr>' +
'<tr><td>chofer_id</td><td>integer</td><td>NO</td><td></td><td>X</td><td>Referencia al chofer en la tabla choferes</td></tr>' +
'<tr><td>monto</td><td>real</td><td>NO</td><td></td><td></td><td>Monto del pago</td></tr>' +
'<tr><td>fecha</td><td>timestamp</td><td>NO</td><td></td><td></td><td>Fecha del pago</td></tr>' +
'<tr><td>nro_referencia</td><td>text</td><td>NO</td><td></td><td></td><td>N&uacute;mero de referencia del pago</td></tr>' +
'<tr><td>creado_en</td><td>timestamp</td><td>NO</td><td></td><td></td><td>Fecha y hora de creaci&oacute;n del registro</td></tr>' +
'</table>' +

'<h2>bancos</h2>' +
'<p><strong>Descripci&oacute;n:</strong> Cat&aacute;logo de entidades bancarias disponibles en el sistema</p>' +
'<p><strong>Clave Primaria:</strong> id</p>' +
'<table><tr><th>Campo</th><th>Tipo</th><th>Nulo</th><th>PK</th><th>FK</th><th>Descripci&oacute;n</th></tr>' +
'<tr><td>id</td><td>integer</td><td>NO</td><td>X</td><td></td><td>Identificador &uacute;nico autoincremental</td></tr>' +
'<tr><td>nombre</td><td>text</td><td>NO</td><td></td><td></td><td>Nombre del banco (&uacute;nico)</td></tr>' +
'</table>' +

'<h2>personal_admin</h2>' +
'<p><strong>Descripci&oacute;n:</strong> Datos del personal administrativo que gestiona el sistema</p>' +
'<p><strong>Clave Primaria:</strong> id</p>' +
'<table><tr><th>Campo</th><th>Tipo</th><th>Nulo</th><th>PK</th><th>FK</th><th>Descripci&oacute;n</th></tr>' +
'<tr><td>id</td><td>integer</td><td>NO</td><td>X</td><td></td><td>Identificador &uacute;nico autoincremental</td></tr>' +
'<tr><td>usuario_id</td><td>integer</td><td>NO</td><td></td><td>X</td><td>Referencia al usuario en la tabla usuarios</td></tr>' +
'<tr><td>creado_en</td><td>timestamp</td><td>NO</td><td></td><td></td><td>Fecha y hora de creaci&oacute;n del registro</td></tr>' +
'</table>' +
'</div>'

const seccionG = '' +
'<div class="page-break">' +
'<h1>g. Pantallas de Formularios</h1>' +
'<p class="section-desc">Capturas de pantalla de todos los formularios del sistema con descripci&oacute;n.</p>' +

'<h2>1. Inicio de Sesi&oacute;n</h2>' +
'<p><strong>Ruta:</strong> /login &mdash; <strong>Endpoint:</strong> POST /api/auth/login</p>' +
'<p>Formulario de acceso con email y contrase&ntilde;a para todos los usuarios.</p>' +
img('01-login.png', 'Pantalla de inicio de sesi&oacute;n') +

'<h2>2. Registro</h2>' +
'<p><strong>Ruta:</strong> /register &mdash; <strong>Endpoint:</strong> POST /api/auth/registro</p>' +
'<p>Registro de nuevos usuarios con datos personales y selecci&oacute;n de rol (Chofer o Cliente).</p>' +
img('02-registro.png', 'Pantalla de registro') +

'<h2>3. Perfil de Usuario</h2>' +
'<p><strong>Ruta:</strong> /dashboard/perfil &mdash; <strong>Endpoint:</strong> GET /api/auth/perfil</p>' +
'<p>Muestra los datos personales del usuario autenticado. Para choferes incluye saldos pendiente y pagado.</p>' +
img('03-perfil-admin.png', 'Perfil del administrador') +
img('04-perfil-cliente.png', 'Perfil del cliente con saldo disponible') +
img('08-perfil-chofer.png', 'Perfil del chofer con saldos') +

'<h2>4. Recargar Saldo</h2>' +
'<p><strong>Ruta:</strong> /dashboard/recargar &mdash; <strong>Endpoint:</strong> POST /api/clientes/recargar</p>' +
'<p>Formulario para que el cliente transfiera dinero a su saldo, seleccionando banco y registrando referencia.</p>' +
img('05-recargar-saldo.png', 'Formulario de recarga de saldo') +

'<h2>5. Solicitar Viaje</h2>' +
'<p><strong>Ruta:</strong> /dashboard/solicitar-viaje &mdash; <strong>Endpoint:</strong> POST /api/traslados</p>' +
'<p>Formulario para solicitar un traslado indicando origen, destino y distancia. Muestra el costo y los datos del chofer/veh&iacute;culo asignado.</p>' +
img('06-solicitar-viaje.png', 'Solicitud de traslado') +

'<h2>6. Registrar Veh&iacute;culo</h2>' +
'<p><strong>Ruta:</strong> /dashboard/vehiculos &mdash; <strong>Endpoint:</strong> POST /api/choferes/vehiculos</p>' +
'<p>Formulario para registrar un nuevo veh&iacute;culo con datos de placa, marca, modelo, a&ntilde;o y color.</p>' +
img('09-vehiculos.png', 'Registro y lista de veh&iacute;culos') +

'<h2>7. Viajes Asignados (Chofer)</h2>' +
'<p><strong>Ruta:</strong> /dashboard/viajes &mdash; <strong>Endpoint:</strong> GET /api/choferes/viajes</p>' +
'<p>Lista los viajes asignados al chofer con filtros por fecha y estado. Bot&oacute;n para completar viajes pendientes.</p>' +
img('10-viajes-chofer.png', 'Viajes asignados al chofer') +

'<h2>8. Evaluar Chofer</h2>' +
'<p><strong>Ruta:</strong> /dashboard/evaluar-chofer &mdash; <strong>Endpoint:</strong> POST /api/admin/evaluar-chofer</p>' +
'<p>Formulario para registrar evaluaci&oacute;n psicol&oacute;gica. Si la nota es &ge; 73, el chofer se activa autom&aacute;ticamente.</p>' +
img('12-evaluar-chofer.png', 'Evaluaci&oacute;n psicol&oacute;gica') +

'<h2>9. Revisar Veh&iacute;culo</h2>' +
'<p><strong>Ruta:</strong> /dashboard/revisar-vehiculo &mdash; <strong>Endpoint:</strong> POST /api/admin/revisar-vehiculo</p>' +
'<p>Formulario para registrar revisi&oacute;n vehicular. Si la calificaci&oacute;n es &ge; 65, el veh&iacute;culo se activa autom&aacute;ticamente.</p>' +
img('13-revisar-vehiculo.png', 'Revisi&oacute;n vehicular') +

'<h2>10. Pagar a Chofer</h2>' +
'<p><strong>Ruta:</strong> /dashboard/pagar-chofer &mdash; <strong>Endpoint:</strong> POST /api/admin/pagar-chofer</p>' +
'<p>Formulario para registrar un pago a un chofer con monto y referencia bancaria.</p>' +
img('14-pagar-chofer.png', 'Pago a chofer') +

'<h2>11. Ganancias por Per&iacute;odo</h2>' +
'<p><strong>Ruta:</strong> /dashboard/ganancias &mdash; <strong>Endpoint:</strong> GET /api/reportes/ganancias</p>' +
'<p>Reporte de ganancias de la empresa filtrado por rango de fechas. Muestra total bruto, ganancia (30%) y cantidad de viajes por d&iacute;a.</p>' +
img('15-ganancias.png', 'Reporte de ganancias') +

'<h2>12. Listado de Traslados</h2>' +
'<p><strong>Ruta:</strong> /dashboard/traslados &mdash; <strong>Endpoint:</strong> GET /api/reportes/traslados</p>' +
'<p>Lista todos los traslados con filtros por fecha, estado y estado de pago. Botones para completar o cancelar traslados pendientes.</p>' +
img('16-traslados-admin.png', 'Listado de traslados con filtros') +

'<h2>13. Listado de Choferes</h2>' +
'<p><strong>Ruta:</strong> /dashboard/listado-choferes &mdash; <strong>Endpoint:</strong> GET /api/choferes/listar</p>' +
'<p>Tabla con todos los choferes, sus datos personales, bancarios, saldos y estado de evaluaci&oacute;n/vigencia.</p>' +
img('17-listado-choferes.png', 'Listado de choferes') +

'<h2>14. Reportes (Admin)</h2>' +
'<p><strong>Ruta:</strong> /dashboard/reportes &mdash; <strong>Endpoint:</strong> GET /api/reportes/pagos-chofer</p>' +
'<p>Reporte de pagos realizados a un chofer espec&iacute;fico en un per&iacute;odo de tiempo.</p>' +
img('18-reportes.png', 'Reporte de pagos a chofer') +
'</div>'

const seccionH = '' +
'<div class="page-break">' +
'<h1>h. Pantallas de Consultas</h1>' +
'<p class="section-desc">Listados, reportes y consultas del sistema con sus scripts SQL.</p>' +

'<h2>1. Asignaci&oacute;n Aleatoria de Chofer</h2>' +
'<p><strong>Ubicaci&oacute;n:</strong> POST /api/traslados (solicitar traslado)</p>' +
'<p>Selecciona un chofer aleatorio que cumpla con todos los requisitos: activo, con veh&iacute;culo apto, revisi&oacute;n vigente (&lt; 1 a&ntilde;o) y sin viajes pendientes.</p>' +
'<pre><code>SELECT c.id FROM choferes c\n' +
'WHERE c.activo = true\n' +
'AND EXISTS (\n' +
'  SELECT 1 FROM vehiculos v\n' +
'  WHERE v.chofer_id = c.id AND v.activo = true\n' +
'  AND EXISTS (\n' +
'    SELECT 1 FROM revisiones_vehiculares rv\n' +
'    WHERE rv.vehiculo_id = v.id\n' +
'      AND rv.apto = true\n' +
'      AND rv.fecha &gt;= NOW() - INTERVAL 1 year\n' +
'  )\n' +
')\n' +
'AND c.id NOT IN (\n' +
'  SELECT t.chofer_id FROM traslados t WHERE t.estado = pendiente\n' +
')\n' +
'ORDER BY RANDOM() LIMIT 1</code></pre>' +

'<h2>2. Listado de Traslados con Filtros</h2>' +
'<p><strong>Ruta:</strong> /dashboard/traslados &mdash; GET /api/reportes/traslados</p>' +
'<pre><code>SELECT t.id, t.origen, t.destino, t.costo, t.estado, t.fecha, t.pagado,\n' +
'       u.nombre AS chofer_nombre, u.apellido AS chofer_apellido,\n' +
'       c.nombre AS cliente_nombre, c.apellido AS cliente_apellido,\n' +
'       v.placa\n' +
'FROM traslados t\n' +
'JOIN choferes ch ON t.chofer_id = ch.id\n' +
'JOIN usuarios u ON ch.usuario_id = u.id\n' +
'JOIN clientes cl ON t.cliente_id = cl.id\n' +
'JOIN usuarios c ON cl.usuario_id = c.id\n' +
'LEFT JOIN LATERAL (\n' +
'  SELECT v2.placa FROM vehiculos v2\n' +
'  WHERE v2.chofer_id = ch.id AND v2.activo = true LIMIT 1\n' +
') v ON true\n' +
'WHERE 1=1\n' +
'  AND ($1::date IS NULL OR t.fecha &gt;= $1::date)\n' +
'  AND ($2::date IS NULL OR t.fecha &lt;= $2::date)\n' +
'  AND ($3::text IS NULL OR t.estado = $3)\n' +
'  AND ($4::boolean IS NULL OR t.pagado = $4)\n' +
'ORDER BY t.fecha DESC</code></pre>' +

'<h2>3. Reporte de Ganancias por Per&iacute;odo</h2>' +
'<p><strong>Ruta:</strong> /dashboard/ganancias &mdash; GET /api/reportes/ganancias</p>' +
'<pre><code>SELECT DATE(t.fecha) AS dia,\n' +
'       COUNT(*) AS viajes,\n' +
'       SUM(t.costo) AS total_bruto,\n' +
'       SUM(t.costo * 0.30) AS ganancia_empresa\n' +
'FROM traslados t\n' +
'WHERE t.estado = completado\n' +
'  AND t.fecha &gt;= $1::date\n' +
'  AND t.fecha &lt;= $2::date\n' +
'GROUP BY DATE(t.fecha)\n' +
'ORDER BY dia</code></pre>' +

'<h2>4. Listado de Choferes</h2>' +
'<p><strong>Ruta:</strong> /dashboard/listado-choferes &mdash; GET /api/choferes/listar</p>' +
'<pre><code>SELECT c.id, u.nombre, u.apellido, u.cedula, u.email, c.activo,\n' +
'       b.nombre AS banco, c.nro_cuenta,\n' +
'       c.saldo_pendiente, c.saldo_pagado,\n' +
'       (SELECT e.nota FROM evaluaciones_psicologicas e\n' +
'        WHERE e.chofer_id = c.id ORDER BY e.fecha DESC LIMIT 1\n' +
'       ) AS ultima_evaluacion_nota,\n' +
'       (SELECT e.fecha FROM evaluaciones_psicologicas e\n' +
'        WHERE e.chofer_id = c.id ORDER BY e.fecha DESC LIMIT 1\n' +
'       ) AS ultima_evaluacion_fecha\n' +
'FROM choferes c\n' +
'JOIN usuarios u ON c.usuario_id = u.id\n' +
'LEFT JOIN bancos b ON c.banco_id = b.id\n' +
'ORDER BY u.nombre</code></pre>' +

'<h2>5. Transacci&oacute;n de Cancelaci&oacute;n con Reembolso</h2>' +
'<p><strong>Ubicaci&oacute;n:</strong> PUT /api/traslados/:id/cancelar</p>' +
'<p>Las 3 operaciones se ejecutan en una transacci&oacute;n at&oacute;mica. Si alguna falla, todas se revierten.</p>' +
'<pre><code>UPDATE traslados SET estado = cancelado WHERE id = $1\n' +
'UPDATE clientes SET saldo = saldo + $2 WHERE id = $3\n' +
'UPDATE choferes SET saldo_pendiente = saldo_pendiente - $4 WHERE id = $5</code></pre>' +

'<h2>6. Evaluaciones de un Chofer</h2>' +
'<p><strong>Ruta:</strong> /dashboard/evaluaciones-chofer &mdash; GET /api/choferes/:id/evaluaciones</p>' +
'<pre><code>SELECT e.id, e.nota, e.aprobado, e.fecha, u.nombre AS evaluador_nombre\n' +
'FROM evaluaciones_psicologicas e\n' +
'JOIN personal_admin p ON e.evaluador_id = p.id\n' +
'JOIN usuarios u ON p.usuario_id = u.id\n' +
'WHERE e.chofer_id = $1\n' +
'ORDER BY e.fecha DESC</code></pre>' +

'<h2>7. Revisiones de un Veh&iacute;culo</h2>' +
'<p><strong>Ruta:</strong> /dashboard/revisiones-vehiculo &mdash; GET /api/vehiculos/:id/revisiones</p>' +
'<pre><code>SELECT r.id, r.calificacion, r.apto, r.fecha, u.nombre AS evaluador_nombre\n' +
'FROM revisiones_vehiculares r\n' +
'JOIN personal_admin p ON r.evaluador_id = p.id\n' +
'JOIN usuarios u ON p.usuario_id = u.id\n' +
'WHERE r.vehiculo_id = $1\n' +
'ORDER BY r.fecha DESC</code></pre>' +

'<h2>8. Reporte de Pagos a un Chofer</h2>' +
'<p><strong>Ruta:</strong> /dashboard/reportes &mdash; GET /api/reportes/pagos-chofer</p>' +
'<pre><code>SELECT p.id, p.monto, p.fecha, p.nro_referencia\n' +
'FROM pagos_chofer p\n' +
'WHERE p.chofer_id = $1\n' +
'  AND p.fecha &gt;= $2::date\n' +
'  AND p.fecha &lt;= $3::date\n' +
'ORDER BY p.fecha DESC</code></pre>' +

'<h2>9. Historial de Viajes del Cliente</h2>' +
'<p><strong>Ruta:</strong> /dashboard/historial-viajes &mdash; GET /api/clientes/viajes</p>' +
'<pre><code>SELECT t.id, t.origen, t.destino, t.costo, t.estado, t.fecha,\n' +
'       u.nombre AS chofer_nombre, v.placa, v.marca, v.modelo\n' +
'FROM traslados t\n' +
'JOIN choferes c ON t.chofer_id = c.id\n' +
'JOIN usuarios u ON c.usuario_id = u.id\n' +
'LEFT JOIN LATERAL (\n' +
'  SELECT v2.placa, v2.marca, v2.modelo FROM vehiculos v2\n' +
'  WHERE v2.chofer_id = c.id AND v2.activo = true LIMIT 1\n' +
') v ON true\n' +
'WHERE t.cliente_id = $1\n' +
'  AND ($2::date IS NULL OR t.fecha &gt;= $2::date)\n' +
'  AND ($3::date IS NULL OR t.fecha &lt;= $3::date)\n' +
'  AND ($4::text IS NULL OR t.estado = $4)\n' +
'ORDER BY t.fecha DESC</code></pre>' +
'</div>'

const fullHtml = html + cover + toc + seccionA + seccionB + seccionC + seccionD + seccionE + seccionF + seccionG + seccionH + '</body></html>'

fs.writeFileSync(HTML_PATH, fullHtml, 'utf-8')
console.log('HTML generado en:', HTML_PATH)

async function generatePdf() {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  })
  const page = await browser.newPage()
  await page.goto('file://' + HTML_PATH, { waitUntil: 'networkidle0' })
  await page.pdf({
    path: PDF_PATH,
    format: 'A4',
    printBackground: true,
    margin: { top: '2cm', bottom: '2cm', left: '2cm', right: '2cm' },
  })
  await browser.close()
  console.log('PDF generado en:', PDF_PATH)
  const size = (fs.statSync(PDF_PATH).size / 1024 / 1024).toFixed(2)
  console.log('Tamaño:', size, 'MB')
}

generatePdf().catch(console.error)
