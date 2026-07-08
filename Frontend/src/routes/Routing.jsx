import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import RutaProtegida from './RutaProtegida';
import { RUTAS } from './rutas';

// ==========================================
// VISTA PRINCIPAL (NUEVA LANDING PAGE)
// ==========================================
const LandingPage = lazy(() => import('../pages/landing/Landing.jsx'));
// Autenticación
const LoginPage = lazy(() => import('../pages/auth/Login/LoginPage'));
const RegisterPage = lazy(() => import('../pages/auth/Registro/RegisterPage'));
const AdminLogin = lazy(() => import('../pages/auth/AdminLogin/AdminLogin'));
const GoogleCallback = lazy(() => import('../pages/auth/GoogleCallback'));
const CompletarPerfil = lazy(() => import('../pages/auth/CompletarPerfil/CompletarPerfil'));
const ForgotPasswordPage = lazy(() => import('../pages/RecuperacionContra/ForgotPasswordPage'));

// Empresa
const DashboardEmpresario = lazy(() => import('../pages/empresa/DashboardEmpresario/DashboardEmpresario'));
const Inicio = lazy(() => import('../pages/empresa/DashboardEmpresario/pages/Inicio/Inicio'));
const ProyectosEmpresario = lazy(() => import('../pages/empresa/DashboardEmpresario/pages/Proyectos/Proyectos'));
const OfertasEmpresario = lazy(() => import('../pages/empresa/DashboardEmpresario/pages/Ofertas/Ofertas'));
const EntregablesEmpresario = lazy(() => import('../pages/empresa/DashboardEmpresario/pages/Entregables/Entregables'));
const MensajesEmpresario = lazy(() => import('../pages/empresa/DashboardEmpresario/pages/Mensajes/Mensajes'));
const TalentoEmpresario = lazy(() => import('../pages/empresa/DashboardEmpresario/pages/Talento/Talento'));
const HistorialEmpresario = lazy(() => import('../pages/empresa/DashboardEmpresario/pages/Historial/Historial'));
const EvaluacionesEmpresario = lazy(() => import('../pages/empresa/DashboardEmpresario/pages/Evaluaciones/Evaluaciones'));
const FacturacionEmpresario = lazy(() => import('../pages/empresa/DashboardEmpresario/pages/Facturacion/Facturacion'));
const NotificacionesEmpresario = lazy(() => import('../pages/empresa/DashboardEmpresario/pages/Notificaciones/Notificaciones'));
const AyudaEmpresario = lazy(() => import('../pages/empresa/DashboardEmpresario/pages/Ayuda/Ayuda'));
const PublicarProyecto = lazy(() => import('../pages/empresa/DashboardEmpresario/pages/PublicarProyecto/PublicarProyecto'));
const CrearProyectoIA = lazy(() => import('../pages/empresa/DashboardEmpresario/pages/CrearProyectoIA/CrearProyectoIA'));
const OfertasEmpleo = lazy(() => import('../pages/empresa/DashboardEmpresario/pages/OfertasEmpleo/OfertasEmpleo'));
const PublicarEmpleo = lazy(() => import('../pages/empresa/DashboardEmpresario/pages/PublicarEmpleo/PublicarEmpleo'));
const ConfiguracionEmpresario = lazy(() => import('../pages/empresa/DashboardEmpresario/pages/Configuracion/Configuracion'));
const PerfilEmpresa = lazy(() => import('../pages/empresa/DashboardEmpresario/pages/Perfil/PerfilEmpresa'));
const GestionPostulaciones = lazy(() => import('../pages/empresa/Postulaciones/GestionPostulaciones'));
const AdminProfile = lazy(() => import('../pages/admin/AdminProfile'));
const SettingsEmpresa = lazy(() => import('../pages/empresa/SettingsEmpresa/SettingsEmpresa'));

// Egresado
import DashboardEgresado from '../pages/egresado/DashboardEgresado/DashboardEgresado';
import InicioEgresado from '../pages/egresado/DashboardEgresado/pages/Inicio/Inicio';
import PostulacionesEgresado from '../pages/egresado/DashboardEgresado/pages/Postulaciones/Postulaciones';
import MisProyectosEgresado from '../pages/egresado/DashboardEgresado/pages/Proyectos/MisProyectos';
import HistorialEgresado from '../pages/egresado/DashboardEgresado/pages/Historial/Historial';
import MensajesEgresado from '../pages/egresado/DashboardEgresado/pages/Mensajes/Mensajes';
import NotificacionesEgresado from '../pages/egresado/DashboardEgresado/pages/Notificaciones/Notificaciones';
import ExplorarProyectos from '../pages/egresado/DashboardEgresado/pages/Explorar/ExplorarProyectos';
import ExplorarEmpleos from '../pages/egresado/DashboardEgresado/pages/ExplorarEmpleos/ExplorarEmpleos';
import DetalleEmpleo from '../pages/egresado/DashboardEgresado/pages/DetalleEmpleo/DetalleEmpleo';
import ProyectoDetalle from '../pages/egresado/DashboardEgresado/pages/ProyectoDetalle/ProyectoDetalle';
import PerfilEgresado from '../pages/egresado/PerfilEgresado/PerfilEgresado';
import ConfiguracionEgresado from '../pages/egresado/ConfiguracionEgresado/ConfiguracionEgresado';
import Soporte from '../pages/egresado/Soporte/Soporte';


// Comunes
const Proximamente = lazy(() => import('../pages/comun/Proximamente'));
const PaginaNoEncontrada = lazy(() => import('../pages/comun/PaginaNoEncontrada'));

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
        <Route
          path={RUTAS.egresadoSoporte}
          element={
            <RutaProtegida rolPermitido="estudiante">
              <Soporte />
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
        >
          <Route index element={<Inicio />} />
          <Route path="perfil" element={<PerfilEmpresa />} />
          <Route path="proyectos" element={<ProyectosEmpresario />} />
          <Route path="empleos" element={<OfertasEmpleo />} />
          <Route path="publicar-empleo" element={<PublicarEmpleo />} />
          <Route path="ofertas" element={<OfertasEmpresario />} />
          <Route path="entregables" element={<EntregablesEmpresario />} />
          <Route path="mensajes" element={<MensajesEmpresario />} />
          <Route path="talento" element={<TalentoEmpresario />} />
          <Route path="historial" element={<HistorialEmpresario />} />
          <Route path="evaluaciones" element={<EvaluacionesEmpresario />} />
          <Route path="facturacion" element={<FacturacionEmpresario />} />
          <Route path="notificaciones" element={<NotificacionesEmpresario />} />
          <Route path="ayuda" element={<AyudaEmpresario />} />
          <Route path="publicar-proyecto" element={<PublicarProyecto />} />
          <Route path="crear-proyecto-ia" element={<CrearProyectoIA />} />
          <Route path="configuracion" element={<ConfiguracionEmpresario />} />
        </Route>

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
