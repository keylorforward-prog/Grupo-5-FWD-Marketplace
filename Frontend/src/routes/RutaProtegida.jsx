import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { obtenerRol, rutaDashboardDeRol, RUTAS } from './rutas';

/**
 * Protege rutas que requieren sesión.
 *
 * En desarrollo (sin backend de auth funcionando), permite el acceso aunque
 * no haya sesión — esto facilita iterar el diseño sin tener que loguearse.
 * Cuando el backend esté listo, cambiar `requerirSesion` a true.
 *
 * Props:
 *  - rolPermitido?: 'estudiante' | 'empresa' | 'admin' | array de roles
 */
const REQUERIR_SESION = true;

function RutaProtegida({ children, rolPermitido }) {
  const { isAuthenticated, loading, user } = useAuth();
  const ubicacion = useLocation();

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner" />
      </div>
    );
  }

  if (REQUERIR_SESION && !isAuthenticated) {
    return <Navigate to={RUTAS.login} state={{ desde: ubicacion.pathname }} replace />;
  }

  // Si hay sesión, validar rol; si no hay sesión, dejar pasar (dev).
  if (rolPermitido && isAuthenticated) {
    const rol = obtenerRol(user);
    const permitidos = Array.isArray(rolPermitido) ? rolPermitido : [rolPermitido];
    if (rol && !permitidos.includes(rol)) {
      return <Navigate to={rutaDashboardDeRol(rol)} replace />;
    }
  }

  return children;
}

export default RutaProtegida;
