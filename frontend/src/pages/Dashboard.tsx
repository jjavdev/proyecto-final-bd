import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Layout from '../components/Layout'
import Home from './Home'

import RecargarSaldo from './cliente/RecargarSaldo'
import SolicitarViaje from './cliente/SolicitarViaje'
import HistorialViajes from './cliente/HistorialViajes'
import HistorialRecargas from './cliente/HistorialRecargas'

import Vehiculos from './chofer/Vehiculos'
import Contactos from './chofer/Contactos'
import DatosBancarios from './chofer/DatosBancarios'
import ViajesAsignados from './chofer/ViajesAsignados'

import EvaluarChofer from './admin/EvaluarChofer'
import RevisarVehiculo from './admin/RevisarVehiculo'
import PagarChofer from './admin/PagarChofer'
import Ganancias from './admin/Ganancias'
import Reportes from './admin/Reportes'

export default function Dashboard() {
  const { usuario } = useAuth()

  return (
    <Layout>
      <Routes>
        <Route index element={<Home />} />

        {/* CLIENTE */}
        {usuario?.rol === 'CLIENTE' && (
          <>
            <Route path="recargar" element={<RecargarSaldo />} />
            <Route path="solicitar-viaje" element={<SolicitarViaje />} />
            <Route path="historial-viajes" element={<HistorialViajes />} />
            <Route path="historial-recargas" element={<HistorialRecargas />} />
          </>
        )}

        {/* CHOFER */}
        {usuario?.rol === 'CHOFER' && (
          <>
            <Route path="vehiculos" element={<Vehiculos />} />
            <Route path="contactos" element={<Contactos />} />
            <Route path="banco" element={<DatosBancarios />} />
            <Route path="viajes" element={<ViajesAsignados />} />
          </>
        )}

        {/* PERSONAL_ADMIN */}
        {usuario?.rol === 'PERSONAL_ADMIN' && (
          <>
            <Route path="evaluar-chofer" element={<EvaluarChofer />} />
            <Route path="revisar-vehiculo" element={<RevisarVehiculo />} />
            <Route path="pagar-chofer" element={<PagarChofer />} />
            <Route path="ganancias" element={<Ganancias />} />
          </>
        )}

        {/* ADMIN */}
        {usuario?.rol === 'ADMIN' && (
          <>
            <Route path="reportes" element={<Reportes />} />
          </>
        )}

        <Route path="*" element={<Home />} />
      </Routes>
    </Layout>
  )
}
