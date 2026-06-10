import LoginPage from "../Login/Pages/LoginPage";
import RegisterPage from "../Registro/pages/RegisterPage";
import DashboardEngresado from "../Pages/Home/DashboardEngresado/DashboardEngresado";
import PerfilEngresado from "../Pages/Profile/PerfilEngresado/PerfilEngresado";
import GestionPostulaciones from "../Postulaciones/GestionPostulaciones";
import React from 'react';
import ProtectedRoute from './ProtectedRoute';
import DashboardPage from '../Pages/DashboardPage';
import Login from '../Pages/Login';
import AdminProfile from '../Pages/AdminProfile';


export default function Routing() {
    return (
        <BrowserRouter>
            <Routes>
                {/* Raíz redirige a tu Login */}
                <Route path="/" element={<Navigate to="/login" replace />} />

                {/* Rutas Públicas */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/DashboardEngresado" element={<DashboardEngresado />} />
                <Route path="/PerfilEngresado" element={<PerfilEngresado />} />
                {/* Rutas del Equipo */}
                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <DashboardPage />
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
