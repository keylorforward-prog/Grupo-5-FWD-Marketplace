import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage  from "../Login/Pages/LoginPage";
import GestionPostulaciones from "../Pages/Postulaciones/GestionPostulaciones";
import RegisterPage from "../Registro/pages/RegisterPage";


function Routing() {
    return (
        <Router>
            <Routes>

                {/* Rutas publicas */}
                <Route path="/" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                {/* Rutas privadas */}
                <Route path="/postulaciones" element={<GestionPostulaciones />} />
                
            </Routes>
        </Router>
    )
}

export default Routing