import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "../Pages/Log/Login";
import GestionPostulaciones from "../Pages/Postulaciones/GestionPostulaciones";

function Routing() {
    return (
        <Router>
            <Routes>

                {/* Rutas publicas */}
                <Route path="/" element={<Login />} />

                {/* Rutas privadas */}
                <Route path="/postulaciones" element={<GestionPostulaciones />} />
                
            </Routes>
        </Router>
    )
}

export default Routing