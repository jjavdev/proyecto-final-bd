// Dashboard principal con routing interno segun el rol del usuario.
// Cada rol ve solo las rutas que le corresponden.

import { Routes, Route } from 'react-router-dom'
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
import ListadoTraslados from './admin/ListadoTraslados'
import BancoChofer from './admin/BancoChofer'
import EvaluacionesChofer from './admin/EvaluacionesChofer'
import RevisionesVehiculo from './admin/RevisionesVehiculo'
import ListadoChoferes from './admin/ListadoChoferes'
import Perfil from './Perfil'

export default function Dashboard() {
  const { usuario } = useAuth()

  return (
    <Layout>
      <Routes>
        <Route index element={<Home />} />
        <Route path="perfil" element={<Perfil />} />

        {usuario?.rol === 'CLIENTE' && (
          <>
            <Route path="recargar" element={<RecargarSaldo />} />
            <Route path="solicitar-viaje" element={<SolicitarViaje />} />
            <Route path="historial-viajes" element={<HistorialViajes />} />
            <Route path="historial-recargas" element={<HistorialRecargas />} />
          </>
        )}

        {usuario?.rol === 'CHOFER' && (
          <>
            <Route path="vehiculos" element={<Vehiculos />} />
            <Route path="contactos" element={<Contactos />} />
            <Route path="banco" element={<DatosBancarios />} />
            <Route path="viajes" element={<ViajesAsignados />} />
          </>
        )}

        {usuario?.rol === 'PERSONAL_ADMIN' && (
          <>
            <Route path="evaluar-chofer" element={<EvaluarChofer />} />
            <Route path="revisar-vehiculo" element={<RevisarVehiculo />} />
            <Route path="pagar-chofer" element={<PagarChofer />} />
            <Route path="ganancias" element={<Ganancias />} />
            <Route path="traslados" element={<ListadoTraslados />} />
            <Route path="banco-chofer" element={<BancoChofer />} />
            <Route path="evaluaciones-chofer" element={<EvaluacionesChofer />} />
            <Route path="revisiones-vehiculo" element={<RevisionesVehiculo />} />
            <Route path="listado-choferes" element={<ListadoChoferes />} />
          </>
        )}

        {usuario?.rol === 'ADMIN' && (
          <>
            <Route path="reportes" element={<Reportes />} />
            <Route path="traslados" element={<ListadoTraslados />} />
          </>
        )}

        <Route path="*" element={<Home />} />
      </Routes>
    </Layout>
  )
}
