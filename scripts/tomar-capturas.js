// Script para tomar capturas de pantalla automaticas del sistema Decarrerita.
// Uso: FRONTEND_URL=http://localhost:5174 node scripts/tomar-capturas.js

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5174';
const OUTPUT_DIR = path.resolve(__dirname, '../docs/capturas');

const users = {
  cliente:  { email: 'cliente1@decarrerita.com',  password: '123456' },
  chofer:   { email: 'chofer1@decarrerita.com',   password: '123456' },
  personal: { email: 'personal@decarrerita.com',  password: '123456' },
  admin:    { email: 'admin@decarrerita.com',      password: '123456' },
};

const screenshots = [
  { file: '01-login.png',       desc: 'Pantalla de inicio de sesion',               url: '/login',                          user: null },
  { file: '02-registro.png',    desc: 'Pantalla de registro de usuario',            url: '/register',                       user: null },
  { file: '03-perfil-admin.png',desc: 'Datos personales del administrador',         url: '/dashboard/perfil',               user: 'admin' },
  { file: '04-perfil-cliente.png',desc: 'Datos personales del cliente',              url: '/dashboard/perfil',               user: 'cliente' },
  { file: '05-recargar-saldo.png',desc: 'Formulario de recarga de saldo',           url: '/dashboard/recargar',             user: 'cliente' },
  { file: '06-solicitar-viaje.png',desc: 'Solicitud de traslado',                   url: '/dashboard/solicitar-viaje',      user: 'cliente' },
  { file: '07-historial-viajes.png',desc: 'Historial de viajes del cliente',         url: '/dashboard/historial-viajes',     user: 'cliente' },
  { file: '08-perfil-chofer.png',desc: 'Datos personales del chofer con saldos',    url: '/dashboard/perfil',               user: 'chofer' },
  { file: '09-vehiculos.png',   desc: 'Registro y lista de vehiculos del chofer',  url: '/dashboard/vehiculos',            user: 'chofer' },
  { file: '10-viajes-chofer.png',desc: 'Viajes asignados al chofer',                url: '/dashboard/viajes',               user: 'chofer' },
  { file: '11-perfil-personal.png',desc: 'Datos del personal administrativo',       url: '/dashboard/perfil',               user: 'personal' },
  { file: '12-evaluar-chofer.png',desc: 'Formulario de evaluacion psicologica',     url: '/dashboard/evaluar-chofer',       user: 'personal' },
  { file: '13-revisar-vehiculo.png',desc: 'Formulario de revision vehicular',       url: '/dashboard/revisar-vehiculo',     user: 'personal' },
  { file: '14-pagar-chofer.png',desc: 'Formulario de pago a chofer',                url: '/dashboard/pagar-chofer',         user: 'personal' },
  { file: '15-ganancias.png',   desc: 'Reporte de ganancias por periodo',           url: '/dashboard/ganancias',            user: 'personal' },
  { file: '16-traslados-admin.png',desc: 'Listado de traslados con filtros',         url: '/dashboard/traslados',            user: 'personal' },
  { file: '17-listado-choferes.png',desc: 'Listado de choferes',                     url: '/dashboard/listado-choferes',     user: 'personal' },
  { file: '18-reportes.png',    desc: 'Reportes del administrador',                 url: '/dashboard/reportes',             user: 'admin' },
];

async function login(page, email, password) {
  await page.goto(`${FRONTEND_URL}/login`, { waitUntil: 'networkidle0' });
  await new Promise((r) => setTimeout(r, 500));
  const inputs = await page.$$('input');
  await inputs[0].click({ clickCount: 3 });
  await inputs[0].type(email, { delay: 15 });
  await inputs[1].click({ clickCount: 3 });
  await inputs[1].type(password, { delay: 15 });
  await page.evaluate(() => {
    document.querySelector('form')?.requestSubmit();
  });
  await new Promise((r) => setTimeout(r, 2000));
}

async function main() {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  let lastUser = null;
  const page = await browser.newPage();
  page.setViewport({ width: 1280, height: 800 });

  console.log(`Generando ${screenshots.length} capturas en ${OUTPUT_DIR}...\n`);

  for (const s of screenshots) {
    try {
      if (s.user !== lastUser) {
        if (s.user) {
          const u = users[s.user];
          console.log(`  Login como: ${u.email}`);
          await login(page, u.email, u.password);
        }
        lastUser = s.user;
      }

      await page.goto(`${FRONTEND_URL}${s.url}`, { waitUntil: 'networkidle0', timeout: 15000 });
      await new Promise((r) => setTimeout(r, 1500));

      await page.screenshot({ path: path.join(OUTPUT_DIR, s.file), fullPage: true });
      console.log(`  OK  ${s.file} — ${s.desc}`);
    } catch (err) {
      console.error(`  ERR ${s.file} — ${err.message}`);
    }
  }

  await browser.close();
  console.log(`\n✅ Capturas guardadas en: ${OUTPUT_DIR}`);
  console.log(`   Total: ${screenshots.length} capturas`);
}

main().catch(console.error);
