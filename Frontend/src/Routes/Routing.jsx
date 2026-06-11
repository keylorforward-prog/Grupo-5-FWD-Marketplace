import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';

// Autenticación
import LoginPage from '../pages/Login/Pages/LoginPage';
import RegisterPage from '../pages/Registro/pages/RegisterPage';

// Empresa
import DashboardEmpresario from '../pages/Home/DashboardEmpresario/DashboardEmpresario';
import ProyectosEmpresario from '../pages/Home/DashboardEmpresario/pages/Proyectos/Proyectos';
import OfertasEmpresario from '../pages/Home/DashboardEmpresario/pages/Ofertas/Ofertas';
import EntregablesEmpresario from '../pages/Home/DashboardEmpresario/pages/Entregables/Entregables';
import MensajesEmpresario from '../pages/Home/DashboardEmpresario/pages/Mensajes/Mensajes';
import TalentoEmpresario from '../pages/Home/DashboardEmpresario/pages/Talento/Talento';
import HistorialEmpresario from '../pages/Home/DashboardEmpresario/pages/Historial/Historial';
import EvaluacionesEmpresario from '../pages/Home/DashboardEmpresario/pages/Evaluaciones/Evaluaciones';
import FacturacionEmpresario from '../pages/Home/DashboardEmpresario/pages/Facturacion/Facturacion';
import NotificacionesEmpresario from '../pages/Home/DashboardEmpresario/pages/Notificaciones/Notificaciones';
import AyudaEmpresario from '../pages/Home/DashboardEmpresario/pages/Ayuda/Ayuda';
import PublicarProyecto from '../pages/Home/DashboardEmpresario/pages/PublicarProyecto/PublicarProyecto';
import CrearProyectoIA from '../pages/Home/DashboardEmpresario/pages/CrearProyectoIA/CrearProyectoIA';
import ConfiguracionEmpresario from '../pages/Home/DashboardEmpresario/pages/Configuracion/Configuracion';
import GestionPostulaciones from '../pages/Postulaciones/GestionPostulaciones';
import AdminProfile from '../pages/AdminProfile';

// Egresado (nuevo módulo)
import DashboardEgresado from '../pages/Page Egresado/DashboardEgresado/DashboardEgresado';
import PerfilEgresado from '../pages/Page Egresado/PerfilEgresado/PerfilEgresado';
import SettingsEgresado from '../pages/Page Egresado/SettingsEgresado/SettingsEgresado';

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
