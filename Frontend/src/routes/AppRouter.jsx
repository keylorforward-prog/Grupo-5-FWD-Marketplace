import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from '../Login/Pages/LoginPage';
import RegisterPage from '../Registro/pages/RegisterPage';
import DashboardPage from '../Pages/DashboardPage';
import SettingsEgresado from '../ProfileEgresado/SettingsEgresado/SettingsEgresado';


const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Ruta raíz — redirige al login */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Rutas públicas */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />


        {/* Rutas protegidas */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/Configuracion"
          element={
            <ProtectedRoute>
              <SettingsEgresado />
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
