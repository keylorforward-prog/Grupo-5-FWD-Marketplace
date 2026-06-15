import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import RutaProtegida from './RutaProtegida';
import RedirectorRaiz from './RedirectorRaiz';
import { RUTAS } from './rutas';

// Autenticación
import LoginPage from '../pages/auth/Login/LoginPage';
import RegisterPage from '../pages/auth/Registro/RegisterPage';
import AdminLogin from '../pages/auth/AdminLogin/AdminLogin';

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
import PerfilEmpresa from '../pages/empresa/DashboardEmpresario/pages/Perfil/PerfilEmpresa';
import GestionPostulaciones from '../pages/empresa/Postulaciones/GestionPostulaciones';

// Egresado
import DashboardEgresado from '../pages/egresado/DashboardEgresado/DashboardEgresado';
import PerfilEgresado from '../pages/egresado/PerfilEgresado/PerfilEgresado';
import ConfiguracionEgresado from '../pages/egresado/ConfiguracionEgresado/ConfiguracionEgresado';

// Admin
import AdminProfile from '../pages/admin/AdminProfile';

// Comunes
import Proximamente from '../pages/comun/Proximamente';
import PaginaNoEncontrada from '../pages/comun/PaginaNoEncontrada';

export default function Routing() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ── Raíz: redirige según sesión ────────────────────────────── */}
        <Route path={RUTAS.raiz} element={<RedirectorRaiz />} />

        {/* ── Públicas: autenticación ────────────────────────────────── */}
        <Route path={RUTAS.login} element={<LoginPage />} />
        
        {/* RUTA OFUSCADA: Acceso exclusivo para administración sin enlaces públicos */}
        <Route path="/fwd-console-access" element={<AdminLogin />} />
        
        <Route path={RUTAS.registro} element={<RegisterPage />} />

        {/* ── Egresado ───────────────────────────────────────────────── */}
        <Route path={RUTAS.egresado} element={<Navigate to={RUTAS.egresadoDashboard} replace />} />
        <Route
          path={RUTAS.egresadoDashboard}
          element={
            <RutaProtegida rolPermitido="estudiante">
              <DashboardEgresado />
            </RutaProtegida>
          }
        />
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
    </BrowserRouter>
  );
}