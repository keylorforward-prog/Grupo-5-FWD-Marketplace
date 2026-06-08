import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "../Pages/Log/Login";
import DashboardEngresado from "../Pages/Home/DashboardEngresado/DashboardEngresado";
import PerfilEngresado from "../Pages/Profile/PerfilEngresado/PerfilEngresado";

function Routing() {
    return (
        <Router>
            <Routes>

                {/* Rutas publicas */}
                <Route path="/" element={<Login />} />
                <Route path="/DashboardEngresado" element={<DashboardEngresado />} />
                <Route path="/PerfilEngresado" element={<PerfilEngresado />} />

                {/* Rutas privadas */}
                
            </Routes>
        </Router>
    )
}

export default Routing