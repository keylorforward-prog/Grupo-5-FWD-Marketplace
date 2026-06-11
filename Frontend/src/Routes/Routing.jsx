import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "../Pages/LoginPage";
import DashboardEgresado from "../Pages/ProfileEgresado/DashboardEgresado/DashboardEgresado";
import PerfilEgresado from "../Pages/ProfileEgresado/PerfilEgresado/PerfilEgresado";

function Routing() {
    return (
        <BrowserRouter>
            <Routes>
                {/* Raíz redirige a tu Login */}
                <Route path="/" element={<Navigate to="/login" replace />} />

                {/* Rutas Públicas */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/" element={<LoginPage />} />
                <Route path="/DashboardEgresado" element={<DashboardEgresado />} />
                <Route path="/PerfilEgresado" element={<PerfilEgresado />} />

                {/* Rutas privadas */}
                
            </Routes>
        </BrowserRouter>
    );
}
