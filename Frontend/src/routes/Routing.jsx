import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import RutaProtegida from './RutaProtegida';
import RedirectorRaiz from './RedirectorRaiz';
import { RUTAS } from './rutas';

// Autenticación
import LoginPage from '../pages/auth/Login/LoginPage';
import RegisterPage from '../pages/auth/Registro/RegisterPage';
import AdminLogin from '../pages/auth/AdminLogin/AdminLogin';

// Egresado
import DashboardEgresado from '../pages/egresado/DashboardEgresado/DashboardEgresado';
import PerfilEgresado from '../pages/egresado/PerfilEgresado/PerfilEgresado';
import ConfiguracionEgresado from '../pages/egresado/ConfiguracionEgresado/ConfiguracionEgresado';

// Empresa
import DashboardEmpresario from '../pages/empresa/DashboardEmpresario/DashboardEmpresario';
import GestionPostulaciones from '../pages/empresa/Postulaciones/GestionPostulaciones';

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
        <Route path={RUTAS.loginAdmin} element={<AdminLogin />} />
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
        <Route
          path={RUTAS.empresaDashboard}
          element={
            <RutaProtegida rolPermitido="empresa">
              <DashboardEmpresario />
            </RutaProtegida>
          }
        />
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
