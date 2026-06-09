import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import DashboardPage from '../pages/DashboardPage';
import DashboardEngresado from '../pages/Home/DashboardEngresado/DashboardEngresado';
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
        
        {/* Rutas migradas de Routing */}
        <Route path="/DashboardEngresado" element={<DashboardEngresado />} />
        <Route path="/PerfilEngresado" element={<PerfilEngresado />} />

        {/* Rutas protegidas */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
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
