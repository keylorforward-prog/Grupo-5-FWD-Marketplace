import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "../Pages/LoginPage";
import DashboardEngresado from "../Pages/Home/DashboardEngresado/DashboardEngresado";
import PerfilEngresado from "../Pages/Profile/PerfilEngresado/PerfilEngresado";
import GestionPostulaciones from "../Pages/Postulaciones/GestionPostulaciones";

function Routing() {
    return (
        <Router>
            <Routes>

                {/* Rutas publicas */}
                <Route path="/" element={<LoginPage />} />
                <Route path="/DashboardEngresado" element={<DashboardEngresado />} />
                <Route path="/PerfilEngresado" element={<PerfilEngresado />} />

                {/* Rutas privadas */}
                <Route path="/postulaciones" element={<GestionPostulaciones />} />
                
            </Routes>
        </Router>
    )
}

export default Routing