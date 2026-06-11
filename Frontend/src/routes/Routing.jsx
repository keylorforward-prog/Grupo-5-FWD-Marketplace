import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';

// Autenticación
import LoginPage from '../pages/auth/Login/LoginPage';
import RegisterPage from '../pages/auth/Registro/RegisterPage';

// Empresa
import DashboardEmpresario from '../pages/empresa/DashboardEmpresario/DashboardEmpresario';
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
