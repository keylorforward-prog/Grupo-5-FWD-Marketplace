import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import RutaProtegida from './RutaProtegida';
import { RUTAS } from './rutas';

// ==========================================
// VISTA PRINCIPAL (NUEVA LANDING PAGE)
// ==========================================
const LandingPage = lazy(() => import('../pages/landing/Landing.jsx'));
// Autenticación
const LoginPage = lazy(() => import('../Pages/auth/Login/LoginPage'));
const RegisterPage = lazy(() => import('../Pages/auth/Registro/RegisterPage'));
const AdminLogin = lazy(() => import('../Pages/auth/AdminLogin/AdminLogin'));
const GoogleCallback = lazy(() => import('../Pages/auth/GoogleCallback'));
const CompletarPerfil = lazy(() => import('../Pages/auth/CompletarPerfil/CompletarPerfil'));
import LandingPage from '../Pages/landing/Landing.jsx';
// Autenticación
import LoginPage from '../Pages/auth/Login/LoginPage';
import RegisterPage from '../Pages/auth/Registro/RegisterPage';
import AdminLogin from '../Pages/auth/AdminLogin/AdminLogin';
import GoogleCallback from '../Pages/auth/GoogleCallback';
import CompletarPerfil from '../Pages/auth/CompletarPerfil/CompletarPerfil';
import ForgotPasswordPage from '../Pages/RecuperacionContra/ForgotPasswordPage';

// Empresa
const DashboardEmpresario = lazy(() => import('../Pages/empresa/DashboardEmpresario/DashboardEmpresario'));
const ProyectosEmpresario = lazy(() => import('../Pages/empresa/DashboardEmpresario/pages/Proyectos/Proyectos'));
const OfertasEmpresario = lazy(() => import('../Pages/empresa/DashboardEmpresario/pages/Ofertas/Ofertas'));
const EntregablesEmpresario = lazy(() => import('../Pages/empresa/DashboardEmpresario/pages/Entregables/Entregables'));
const MensajesEmpresario = lazy(() => import('../Pages/empresa/DashboardEmpresario/pages/Mensajes/Mensajes'));
const TalentoEmpresario = lazy(() => import('../Pages/empresa/DashboardEmpresario/pages/Talento/Talento'));
const HistorialEmpresario = lazy(() => import('../Pages/empresa/DashboardEmpresario/pages/Historial/Historial'));
const EvaluacionesEmpresario = lazy(() => import('../Pages/empresa/DashboardEmpresario/pages/Evaluaciones/Evaluaciones'));
const FacturacionEmpresario = lazy(() => import('../Pages/empresa/DashboardEmpresario/pages/Facturacion/Facturacion'));
const NotificacionesEmpresario = lazy(() => import('../Pages/empresa/DashboardEmpresario/pages/Notificaciones/Notificaciones'));
const AyudaEmpresario = lazy(() => import('../Pages/empresa/DashboardEmpresario/pages/Ayuda/Ayuda'));
const PublicarProyecto = lazy(() => import('../Pages/empresa/DashboardEmpresario/pages/PublicarProyecto/PublicarProyecto'));
const CrearProyectoIA = lazy(() => import('../Pages/empresa/DashboardEmpresario/pages/CrearProyectoIA/CrearProyectoIA'));
const OfertasEmpleo = lazy(() => import('../Pages/empresa/DashboardEmpresario/pages/OfertasEmpleo/OfertasEmpleo'));
const PublicarEmpleo = lazy(() => import('../Pages/empresa/DashboardEmpresario/pages/PublicarEmpleo/PublicarEmpleo'));
const ConfiguracionEmpresario = lazy(() => import('../Pages/empresa/DashboardEmpresario/pages/Configuracion/Configuracion'));
const PerfilEmpresa = lazy(() => import('../Pages/empresa/DashboardEmpresario/pages/Perfil/PerfilEmpresa'));
const GestionPostulaciones = lazy(() => import('../Pages/empresa/Postulaciones/GestionPostulaciones'));
const AdminProfile = lazy(() => import('../Pages/admin/AdminProfile'));
const SettingsEmpresa = lazy(() => import('../Pages/empresa/SettingsEmpresa/SettingsEmpresa'));

// Egresado
const DashboardEgresado = lazy(() => import('../Pages/egresado/DashboardEgresado/DashboardEgresado'));
const InicioEgresado = lazy(() => import('../Pages/egresado/DashboardEgresado/pages/Inicio/Inicio'));
const PostulacionesEgresado = lazy(() => import('../Pages/egresado/DashboardEgresado/pages/Postulaciones/Postulaciones'));
const MisProyectosEgresado = lazy(() => import('../Pages/egresado/DashboardEgresado/pages/Proyectos/MisProyectos'));
const HistorialEgresado = lazy(() => import('../Pages/egresado/DashboardEgresado/pages/Historial/Historial'));
const MensajesEgresado = lazy(() => import('../Pages/egresado/DashboardEgresado/pages/Mensajes/Mensajes'));
const NotificacionesEgresado = lazy(() => import('../Pages/egresado/DashboardEgresado/pages/Notificaciones/Notificaciones'));
const ExplorarProyectos = lazy(() => import('../Pages/egresado/DashboardEgresado/pages/Explorar/ExplorarProyectos'));
const ExplorarEmpleos = lazy(() => import('../Pages/egresado/DashboardEgresado/pages/ExplorarEmpleos/ExplorarEmpleos'));
const DetalleEmpleo = lazy(() => import('../Pages/egresado/DashboardEgresado/pages/DetalleEmpleo/DetalleEmpleo'));
const ProyectoDetalle = lazy(() => import('../Pages/egresado/DashboardEgresado/pages/ProyectoDetalle/ProyectoDetalle'));
const PerfilEgresado = lazy(() => import('../Pages/egresado/PerfilEgresado/PerfilEgresado'));
const ConfiguracionEgresado = lazy(() => import('../Pages/egresado/ConfiguracionEgresado/ConfiguracionEgresado'));


// Comunes
const Proximamente = lazy(() => import('../Pages/comun/Proximamente'));
const PaginaNoEncontrada = lazy(() => import('../Pages/comun/PaginaNoEncontrada'));

function RouteFallback() {
  return (
    <div className="route-loading" role="status" aria-live="polite">
      Cargando...
    </div>
  );
}

export default function Routing() {
  return (
    <BrowserRouter>
      <Suspense fallback={<RouteFallback />}>
        <Routes>
        {/* ── Raíz: Apunta directamente a tu nueva Landing Page ────────────────────────────── */}
        <Route path={RUTAS.raiz} element={<LandingPage />} />

        {/* ── Públicas: autenticación ────────────────────────────────── */}
        <Route path={RUTAS.loginAdmin} element={<AdminLogin />} />
        <Route path={RUTAS.login} element={<LoginPage />} />
        <Route path={RUTAS.registro} element={<RegisterPage />} />
        <Route path={RUTAS.recuperarContrasena} element={<ForgotPasswordPage />} />
        <Route path={RUTAS.googleCallback} element={<GoogleCallback />} />
        <Route path={RUTAS.completarPerfil} element={
          <RutaProtegida>
            <CompletarPerfil />
          </RutaProtegida>
        } />

        {/* Dashboard Empresa */}
        <Route path="/DashboardEmpresario" element={<DashboardEmpresario />} />
        <Route path="/postulaciones" element={<GestionPostulaciones />} />
        <Route path="/SettingsEmpresa" element={<SettingsEmpresa />} />

        {/* Dashboard Egresado */}
        <Route path="/DashboardEgresado" element={<DashboardEgresado />} />
        <Route path="/PerfilEgresado" element={<PerfilEgresado />} />

        {/* Rutas Protegidas */}
        {/* ── Egresado ───────────────────────────────────────────────── */}
        <Route path={RUTAS.egresado} element={<Navigate to={RUTAS.egresadoDashboard} replace />} />
        <Route
          path={RUTAS.egresadoDashboard}
          element={
            <RutaProtegida rolPermitido="estudiante">
              <DashboardEgresado />
            </RutaProtegida>
          }
        >
          <Route index element={<InicioEgresado />} />
          <Route path="explorar" element={<ExplorarProyectos />} />
          <Route path="explorar-empleos" element={<ExplorarEmpleos />} />
          <Route path="empleo/:id" element={<DetalleEmpleo />} />
          <Route path="proyecto/:id" element={<ProyectoDetalle />} />
          <Route path="postulaciones" element={<Navigate to="proyectos" replace />} />
          <Route path="postulaciones/proyectos" element={<PostulacionesEgresado />} />
          <Route path="postulaciones/empleos" element={<PostulacionesEgresado />} />
          <Route path="proyectos" element={<MisProyectosEgresado />} />
          <Route path="historial" element={<HistorialEgresado />} />
          <Route path="mensajes" element={<MensajesEgresado />} />
          <Route path="notificaciones" element={<NotificacionesEgresado />} />
        </Route>

        <Route
          path={RUTAS.egresadoPerfil}
          element={
            <RutaProtegida rolPermitido="estudiante">
              <PerfilEgresado />
            </RutaProtegida>
          }
        />
        <Route
          path={RUTAS.egresadoConfiguracion}
          element={
            <RutaProtegida rolPermitido="estudiante">
              <ConfiguracionEgresado />
            </RutaProtegida>
          }
        />

        {/* ── Empresa ────────────────────────────────────────────────── */}
        <Route path={RUTAS.empresa} element={<Navigate to={RUTAS.empresaDashboard} replace />} />
        <Route path="/empresa/dashboard" element={<Navigate to={RUTAS.empresaDashboard} replace />} />
        <Route
          path={RUTAS.empresaDashboard}
          element={
            <RutaProtegida rolPermitido="empresa">
              <DashboardEmpresario />
            </RutaProtegida>
          }
        />

        {/* Subrutas de Empresa Dashboard */}
        <Route path="/DashboardEmpresario/perfil" element={<RutaProtegida rolPermitido="empresa"><PerfilEmpresa /></RutaProtegida>} />
        <Route path="/DashboardEmpresario/proyectos" element={<RutaProtegida rolPermitido="empresa"><ProyectosEmpresario /></RutaProtegida>} />
        <Route path="/DashboardEmpresario/empleos" element={<RutaProtegida rolPermitido="empresa"><OfertasEmpleo /></RutaProtegida>} />
        <Route path="/DashboardEmpresario/publicar-empleo" element={<RutaProtegida rolPermitido="empresa"><PublicarEmpleo /></RutaProtegida>} />
        <Route path="/DashboardEmpresario/ofertas" element={<RutaProtegida rolPermitido="empresa"><OfertasEmpresario /></RutaProtegida>} />
        <Route path="/DashboardEmpresario/entregables" element={<RutaProtegida rolPermitido="empresa"><EntregablesEmpresario /></RutaProtegida>} />
        <Route path="/DashboardEmpresario/mensajes" element={<RutaProtegida rolPermitido="empresa"><MensajesEmpresario /></RutaProtegida>} />
        <Route path="/DashboardEmpresario/talento" element={<RutaProtegida rolPermitido="empresa"><TalentoEmpresario /></RutaProtegida>} />
        <Route path="/DashboardEmpresario/historial" element={<RutaProtegida rolPermitido="empresa"><HistorialEmpresario /></RutaProtegida>} />
        <Route path="/DashboardEmpresario/evaluaciones" element={<RutaProtegida rolPermitido="empresa"><EvaluacionesEmpresario /></RutaProtegida>} />
        <Route path="/DashboardEmpresario/facturacion" element={<RutaProtegida rolPermitido="empresa"><FacturacionEmpresario /></RutaProtegida>} />
        <Route path="/DashboardEmpresario/notificaciones" element={<RutaProtegida rolPermitido="empresa"><NotificacionesEmpresario /></RutaProtegida>} />
        <Route path="/DashboardEmpresario/ayuda" element={<RutaProtegida rolPermitido="empresa"><AyudaEmpresario /></RutaProtegida>} />
        <Route path="/DashboardEmpresario/publicar-proyecto" element={<RutaProtegida rolPermitido="empresa"><PublicarProyecto /></RutaProtegida>} />
        <Route path="/DashboardEmpresario/crear-proyecto-ia" element={<RutaProtegida rolPermitido="empresa"><CrearProyectoIA /></RutaProtegida>} />
        <Route path="/DashboardEmpresario/configuracion" element={<RutaProtegida rolPermitido="empresa"><ConfiguracionEmpresario /></RutaProtegida>} />

        <Route
          path={RUTAS.empresaPostulaciones}
          element={
            <RutaProtegida rolPermitido="empresa">
              <GestionPostulaciones />
            </RutaProtegida>
          }
        />

        {/* ── Admin ──────────────────────────────────────────────────── */}
        <Route
          path={RUTAS.admin}
          element={
            <RutaProtegida rolPermitido="admin">
              <AdminProfile />
            </RutaProtegida>
          }
        />
        <Route path="/Admin" element={<Navigate to={RUTAS.admin} replace />} />

        {/* ── Compartidas: placeholders ──────────────────────────────── */}
        <Route
          path={RUTAS.soporte}
          element={
            <Proximamente
              titulo="Centro de Soporte"
              descripcion="Pronto encontrarás aquí guías, FAQs y contacto directo con el equipo de FWD."
            />
          }
        />
        <Route
          path={RUTAS.mensajes}
          element={
            <Proximamente
              titulo="Mensajes"
              descripcion="Estamos preparando el chat para que puedas hablar con empresas y mentores."
            />
          }
        />

        {/* ── 404 ────────────────────────────────────────────────────── */}
        <Route path="*" element={<PaginaNoEncontrada />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
