import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import LoginPage from "../Login/Pages/LoginPage";
import RegisterPage from "../Registro/pages/RegisterPage";
import GestionPostulaciones from "../Postulaciones/GestionPostulaciones";
import DashboardPage from "../Pages/DashboardPage";
import DashboardEgresado from "../ProfileEgresado/DashboardEgresado/DashboardEgresado";
import PerfilEgresado from "../ProfileEgresado/PerfilEgresado/PerfilEgresado";
import SettingsEgresado from "../ProfileEgresado/SettingsEgresado/SettingsEgresado";
function Routing() {
    return (
        <Router>
            <Routes>

                {/* Rutas publicas */}
                <Route path="/" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/dashboardEgresado" element={<DashboardEgresado />} />
                <Route path="/perfilEgresado" element={<PerfilEgresado />} />
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/Configuracion" element={<SettingsEgresado />} />
                {/* Rutas privadas */}
                <Route path="/postulaciones" element={<GestionPostulaciones />} />

            </Routes>
        </Router >
    )
}

export default Routing