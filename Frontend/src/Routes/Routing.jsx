import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// --- Tus Módulos ---
import Login from '../Pages/Login';
import AdminProfile from '../Pages/AdminProfile';

// --- Módulos del Equipo ---
import ProtectedRoute from './ProtectedRoute';
import LoginPage from '../Pages/LoginPage';
import RegisterPage from '../Pages/RegisterPage';
import DashboardPage from '../Pages/DashboardPage';
import GestionPostulaciones from '../Pages/Postulaciones/GestionPostulaciones';
import DashboardEngresado from '../pages/Home/DashboardEngresado/DashboardEngresado';
import DashboardEmpresario from '../pages/Home/DashboardEmpresario/DashboardEmpresario';
import PerfilEngresado from '../pages/Profile/PerfilEngresado/PerfilEngresado';

export default function Routing() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Raíz redirige a tu Login */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        
        {/* Rutas Públicas */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<RegisterPage />} />
        
        {/* Dashboards extra */}
        <Route path="/DashboardEngresado" element={<DashboardEngresado />} />
        <Route path="/DashboardEmpresario" element={<DashboardEmpresario />} />
        <Route path="/PerfilEngresado" element={<PerfilEngresado />} />

        {/* Rutas del Equipo */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardEmpresario />
            </ProtectedRoute>
          }
        />
        <Route path="/postulaciones" element={<GestionPostulaciones />} />
        
        {/* Tu espacio de trabajo (Admin) */}
        <Route path="/admin" element={<AdminProfile />} />
        
        {/* Fallback 404 */}
        <Route path="*" element={
          <div className="flex h-screen w-full items-center justify-center bg-ink-strong text-canvas">
            <h1 className="text-2xl font-bold text-magenta">404 - Ruta no encontrada</h1>
          </div>
        } />
      </Routes>
    </BrowserRouter>
  );
}