import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import DashboardEngresado from '../pages/Home/DashboardEngresado/DashboardEngresado';
import DashboardEmpresario from '../pages/Home/DashboardEmpresario/DashboardEmpresario';
import PerfilEngresado from '../pages/Profile/PerfilEngresado/PerfilEngresado';

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Ruta raíz — redirige al login */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Rutas públicas */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        
        {/* Dashboards */}
        <Route path="/DashboardEngresado" element={<DashboardEngresado />} />
        <Route path="/DashboardEmpresario" element={<DashboardEmpresario />} />
        <Route path="/PerfilEngresado" element={<PerfilEngresado />} />

        {/* Dashboard principal — ahora usa el nuevo DashboardEmpresario */}
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
};

export default AppRouter;
