import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';

// Autenticación
import LoginPage from '../pages/auth/Login/LoginPage';
import RegisterPage from '../pages/auth/Registro/RegisterPage';

// Empresa
import DashboardEmpresario from '../pages/empresa/DashboardEmpresario/DashboardEmpresario';
import ProyectosEmpresario from '../pages/empresa/DashboardEmpresario/pages/Proyectos/Proyectos';
import OfertasEmpresario from '../pages/empresa/DashboardEmpresario/pages/Ofertas/Ofertas';
import EntregablesEmpresario from '../pages/empresa/DashboardEmpresario/pages/Entregables/Entregables';
import MensajesEmpresario from '../pages/empresa/DashboardEmpresario/pages/Mensajes/Mensajes';
import TalentoEmpresario from '../pages/empresa/DashboardEmpresario/pages/Talento/Talento';
import HistorialEmpresario from '../pages/empresa/DashboardEmpresario/pages/Historial/Historial';
import EvaluacionesEmpresario from '../pages/empresa/DashboardEmpresario/pages/Evaluaciones/Evaluaciones';
import FacturacionEmpresario from '../pages/empresa/DashboardEmpresario/pages/Facturacion/Facturacion';
import NotificacionesEmpresario from '../pages/empresa/DashboardEmpresario/pages/Notificaciones/Notificaciones';
import AyudaEmpresario from '../pages/empresa/DashboardEmpresario/pages/Ayuda/Ayuda';
import PublicarProyecto from '../pages/empresa/DashboardEmpresario/pages/PublicarProyecto/PublicarProyecto';
import CrearProyectoIA from '../pages/empresa/DashboardEmpresario/pages/CrearProyectoIA/CrearProyectoIA';
import ConfiguracionEmpresario from '../pages/empresa/DashboardEmpresario/pages/Configuracion/Configuracion';
import GestionPostulaciones from '../pages/empresa/Postulaciones/GestionPostulaciones';
import AdminProfile from '../pages/admin/AdminProfile';

// Egresado
import DashboardEgresado from '../pages/egresado/DashboardEgresado/DashboardEgresado';
import PerfilEgresado from '../pages/egresado/PerfilEgresado/PerfilEgresado';
import SettingsEgresado from '../pages/egresado/SettingsEgresado/SettingsEgresado';

export default function Routing() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Raíz → Login */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Rutas Públicas */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Dashboard Empresa */}
        <Route path="/DashboardEmpresario" element={<DashboardEmpresario />} />
        <Route path="/DashboardEmpresario/proyectos" element={<ProyectosEmpresario />} />
        <Route path="/DashboardEmpresario/ofertas" element={<OfertasEmpresario />} />
        <Route path="/DashboardEmpresario/entregables" element={<EntregablesEmpresario />} />
        <Route path="/DashboardEmpresario/mensajes" element={<MensajesEmpresario />} />
        <Route path="/DashboardEmpresario/talento" element={<TalentoEmpresario />} />
        <Route path="/DashboardEmpresario/historial" element={<HistorialEmpresario />} />
        <Route path="/DashboardEmpresario/evaluaciones" element={<EvaluacionesEmpresario />} />
        <Route path="/DashboardEmpresario/facturacion" element={<FacturacionEmpresario />} />
        <Route path="/DashboardEmpresario/notificaciones" element={<NotificacionesEmpresario />} />
        <Route path="/DashboardEmpresario/ayuda" element={<AyudaEmpresario />} />
        <Route path="/DashboardEmpresario/publicar-proyecto" element={<PublicarProyecto />} />
        <Route path="/DashboardEmpresario/crear-proyecto-ia" element={<CrearProyectoIA />} />
        <Route path="/DashboardEmpresario/configuracion" element={<ConfiguracionEmpresario />} />
        <Route path="/postulaciones" element={<GestionPostulaciones />} />
        <Route path="/admin" element={<AdminProfile />} />

        {/* Dashboard Egresado */}
        <Route path="/DashboardEgresado" element={<DashboardEgresado />} />
        <Route path="/PerfilEgresado" element={<PerfilEgresado />} />
        <Route path="/Configuracion" element={<SettingsEgresado />} />

        {/* Rutas Protegidas */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardEmpresario />
            </ProtectedRoute>
          }
        />

        {/* 404 */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
