// Punto de entrada del backend de Decarrerita.
// Configura Express, middlewares globales y registra todas las rutas del API.
// Exporta la instancia de PrismaClient para que los controladores la usen.

import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { PrismaClient } from '@prisma/client'

dotenv.config()

export const prisma = new PrismaClient()

const app = express()

app.use(cors())
app.use(express.json())

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

import authRoutes from './routes/auth.routes'
import clienteRoutes from './routes/cliente.routes'
import choferRoutes from './routes/chofer.routes'
import adminRoutes from './routes/admin.routes'
import trasladoRoutes from './routes/traslado.routes'
import reporteRoutes from './routes/reporte.routes'
import bancosRoutes from './routes/bancos.routes'
import vehiculoRoutes from './routes/vehiculo.routes'
import calificacionRoutes from './routes/calificacion.routes'

app.use('/api/auth', authRoutes)
app.use('/api/clientes', clienteRoutes)
app.use('/api/choferes', choferRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/traslados', trasladoRoutes)
app.use('/api/reportes', reporteRoutes)
app.use('/api/bancos', bancosRoutes)
app.use('/api/vehiculos', vehiculoRoutes)
app.use('/api/calificaciones', calificacionRoutes)

app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err)
  res.status(err.status || 500).json({ error: err.message || 'Error interno del servidor' })
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Backend corriendo en puerto ${PORT}`)
})
