import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "../Pages/LoginPage";
import DashboardEgresado from "../Pages/ProfileEgresado/DashboardEgresado/DashboardEgresado";
import PerfilEgresado from "../Pages/ProfileEgresado/PerfilEgresado/PerfilEgresado";
import SettingsEgresado from "../Pages/ProfileEgresado/SettingsEgresado/SettingsEgresado";

function Routing() {
    return (
        <Router>
            <Routes>

                {/* Rutas publicas */}
                <Route path="/" element={<LoginPage />} />
                <Route path="/DashboardEgresado" element={<DashboardEgresado />} />
                <Route path="/PerfilEgresado" element={<PerfilEgresado />} />
                <Route path="/Configuracion" element={<SettingsEgresado />} />

                {/* Rutas privadas */}
                
            </Routes>
        </Router>
    )
}

export default Routing
