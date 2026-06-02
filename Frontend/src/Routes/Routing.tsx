import { BrowserRouter as Router,Routes,Route } from "react-router-dom";
import Login from "../Pages/Log/Login";
function Routing() {
    return (
        <Router>
            <Routes>

                {/* Rutas publicas */}
                <Route path="/" element={<Login />} />

                {/* Rutas privadas */}
                
            </Routes>
        </Router>
    )
}

export default Routing