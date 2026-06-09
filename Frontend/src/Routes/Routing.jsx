import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "../Pages/LoginPage";
import DashboardEngresado from "../Pages/Home/DashboardEngresado/DashboardEngresado";
import PerfilEngresado from "../Pages/Profile/PerfilEngresado/PerfilEngresado";

function Routing() {
    return (
        <Router>
            <Routes>

                {/* Rutas publicas */}
                <Route path="/" element={<LoginPage />} />
                <Route path="/DashboardEngresado" element={<DashboardEngresado />} />
                <Route path="/PerfilEngresado" element={<PerfilEngresado />} />

                {/* Rutas privadas */}
                
            </Routes>
        </Router>
    )
}

export default Routing