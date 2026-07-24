import { ReactNode, useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate, useLocation } from 'react-router-dom'
import api from '../services/api'
import Box from '@mui/material/Box'
import Drawer from '@mui/material/Drawer'
import List from '@mui/material/List'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import HomeIcon from '@mui/icons-material/Home'
import PersonIcon from '@mui/icons-material/Person'
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet'
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar'
import HistoryIcon from '@mui/icons-material/History'
import ReceiptIcon from '@mui/icons-material/Receipt'
import GarageIcon from '@mui/icons-material/Garage'
import ContactsIcon from '@mui/icons-material/Contacts'
import AccountBalanceIcon from '@mui/icons-material/AccountBalance'
import RouteIcon from '@mui/icons-material/Route'
import StarIcon from '@mui/icons-material/Star'
import RateReviewIcon from '@mui/icons-material/RateReview'
import AssignmentIcon from '@mui/icons-material/Assignment'
import BuildIcon from '@mui/icons-material/Build'
import PaymentsIcon from '@mui/icons-material/Payments'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import ListAltIcon from '@mui/icons-material/ListAlt'
import SavingsIcon from '@mui/icons-material/Savings'
import AssessmentIcon from '@mui/icons-material/Assessment'
import EngineeringIcon from '@mui/icons-material/Engineering'
import GroupIcon from '@mui/icons-material/Group'
import BarChartIcon from '@mui/icons-material/BarChart'
import LogoutIcon from '@mui/icons-material/Logout'

const DRAWER_WIDTH = 280

interface MenuItem {
  label: string
  path: string
  icon: ReactNode
}

const shared: MenuItem[] = [
  { label: 'Inicio', path: '/dashboard', icon: <HomeIcon /> },
  { label: 'Mi Perfil', path: '/dashboard/perfil', icon: <PersonIcon /> },
]

const menuItems: Record<string, MenuItem[]> = {
  ADMIN: [
    ...shared,
    { label: 'Listado Traslados', path: '/dashboard/traslados', icon: <ListAltIcon /> },
    { label: 'Reportes', path: '/dashboard/reportes', icon: <BarChartIcon /> },
  ],
  PERSONAL_ADMIN: [
    ...shared,
    { label: 'Evaluar Chofer', path: '/dashboard/evaluar-chofer', icon: <AssignmentIcon /> },
    { label: 'Revisar Vehículo', path: '/dashboard/revisar-vehiculo', icon: <BuildIcon /> },
    { label: 'Pagar Chofer', path: '/dashboard/pagar-chofer', icon: <PaymentsIcon /> },
    { label: 'Ganancias', path: '/dashboard/ganancias', icon: <TrendingUpIcon /> },
    { label: 'Listado Traslados', path: '/dashboard/traslados', icon: <ListAltIcon /> },
    { label: 'Banco Chofer', path: '/dashboard/banco-chofer', icon: <SavingsIcon /> },
    { label: 'Evaluaciones', path: '/dashboard/evaluaciones-chofer', icon: <AssessmentIcon /> },
    { label: 'Revisiones', path: '/dashboard/revisiones-vehiculo', icon: <EngineeringIcon /> },
    { label: 'Listado Choferes', path: '/dashboard/listado-choferes', icon: <GroupIcon /> },
  ],
  CHOFER: [
    ...shared,
    { label: 'Mis Vehículos', path: '/dashboard/vehiculos', icon: <GarageIcon /> },
    { label: 'Contactos Emergencia', path: '/dashboard/contactos', icon: <ContactsIcon /> },
    { label: 'Datos Bancarios', path: '/dashboard/banco', icon: <AccountBalanceIcon /> },
    { label: 'Mis Viajes', path: '/dashboard/viajes', icon: <RouteIcon /> },
    { label: 'Calificar Cliente', path: '/dashboard/calificar', icon: <StarIcon /> },
    { label: 'Mis Calificaciones', path: '/dashboard/mis-calificaciones', icon: <RateReviewIcon /> },
  ],
  CLIENTE: [
    ...shared,
    { label: 'Recargar Saldo', path: '/dashboard/recargar', icon: <AccountBalanceWalletIcon /> },
    { label: 'Solicitar Viaje', path: '/dashboard/solicitar-viaje', icon: <DirectionsCarIcon /> },
    { label: 'Historial Viajes', path: '/dashboard/historial-viajes', icon: <HistoryIcon /> },
    { label: 'Historial Recargas', path: '/dashboard/historial-recargas', icon: <ReceiptIcon /> },
    { label: 'Calificar Chofer', path: '/dashboard/calificar', icon: <StarIcon /> },
    { label: 'Mis Calificaciones', path: '/dashboard/mis-calificaciones', icon: <RateReviewIcon /> },
  ],
}

export default function Layout({ children }: { children: ReactNode }) {
  const { usuario, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const items = menuItems[usuario?.rol || ''] || []

  const [saldo, setSaldo] = useState<number | null>(null)
  const [choferStats, setChoferStats] = useState<{ saldo_pendiente: number; saldo_pagado: number } | null>(null)

  useEffect(() => {
    if (usuario?.rol === 'CLIENTE') {
      api.get('/clientes/saldo').then((r) => setSaldo(r.data.saldo)).catch(() => {})
    }
    if (usuario?.rol === 'CHOFER') {
      api.get('/choferes/stats').then((r) => setChoferStats(r.data)).catch(() => {})
    }
  }, [usuario])

  function handleLogout() {
    logout()
    navigate('/login')
  }

  const rolNames: Record<string, string> = {
    ADMIN: 'Administrador',
    CHOFER: 'Chofer',
    CLIENTE: 'Cliente',
    PERSONAL_ADMIN: 'Personal Administrativo',
  }

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <Drawer
        variant="permanent"
        sx={{
          width: DRAWER_WIDTH,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: DRAWER_WIDTH,
            boxSizing: 'border-box',
            display: 'flex',
            flexDirection: 'column',
            p: 3,
          },
        }}
      >
        <Typography
          variant="h4"
          sx={{
            fontFamily: 'Sora, sans-serif',
            fontWeight: 800,
            fontStyle: 'italic',
            color: 'primary.dark',
            letterSpacing: '-0.02em',
            mb: 0.5,
          }}
        >
          Decarrerita
        </Typography>

        <Typography variant="caption" sx={{ color: 'text.secondary', letterSpacing: '0.1em', mb: 0.5 }}>
          {rolNames[usuario?.rol || ''] || usuario?.rol}
        </Typography>

        <Typography variant="caption" sx={{ color: 'text.secondary', opacity: 0.5, mb: 3 }}>
          {usuario?.email}
        </Typography>

        {usuario?.rol === 'CLIENTE' && saldo !== null && (
          <Card variant="outlined" sx={{ mb: 3 }}>
            <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
              <Typography variant="overline" sx={{ color: 'text.secondary', display: 'block' }}>
                Saldo disponible
              </Typography>
              <Typography
                variant="h5"
                sx={{
                  fontFamily: 'Sora, sans-serif',
                  fontWeight: 700,
                  color: 'primary.main',
                }}
              >
                ${saldo.toFixed(2)}
              </Typography>
            </CardContent>
          </Card>
        )}

        {usuario?.rol === 'CHOFER' && choferStats && (
          <Card variant="outlined" sx={{ mb: 3 }}>
            <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
              <Typography variant="overline" sx={{ color: 'text.secondary', display: 'block' }}>
                Por cobrar
              </Typography>
              <Typography
                variant="h6"
                sx={{ fontFamily: 'Sora, sans-serif', fontWeight: 700, color: 'primary.dark' }}
              >
                ${Math.max(0, choferStats.saldo_pendiente).toFixed(2)}
              </Typography>
              <Typography variant="overline" sx={{ color: 'text.secondary', display: 'block', mt: 1 }}>
                Cobrado
              </Typography>
              <Typography
                variant="h5"
                sx={{ fontFamily: 'Sora, sans-serif', fontWeight: 700, color: 'primary.main' }}
              >
                ${choferStats.saldo_pagado.toFixed(2)}
              </Typography>
            </CardContent>
          </Card>
        )}

        <List sx={{ flex: 1, py: 0 }}>
          {items.map((item) => (
            <ListItemButton
              key={item.path}
              selected={location.pathname === item.path}
              onClick={() => navigate(item.path)}
              sx={{
                borderRadius: 1,
                mb: 0.25,
                color: location.pathname === item.path ? 'primary.main' : 'text.secondary',
                '&:hover': { color: 'text.primary' },
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 40,
                  color: location.pathname === item.path ? 'primary.main' : 'text.secondary',
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.label}
                primaryTypographyProps={{
                  variant: 'body2',
                  fontWeight: location.pathname === item.path ? 600 : 400,
                }}
              />
            </ListItemButton>
          ))}
        </List>

        <Divider sx={{ my: 2 }} />

        <Button
          variant="contained"
          color="error"
          fullWidth
          startIcon={<LogoutIcon />}
          onClick={handleLogout}
          sx={{ py: 1.5 }}
        >
          Cerrar Sesión
        </Button>
      </Drawer>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          overflow: 'auto',
        }}
      >
        {children}
      </Box>
    </Box>
  )
}
