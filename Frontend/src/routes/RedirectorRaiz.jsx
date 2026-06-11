import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { obtenerRol, rutaDashboardDeRol, RUTAS } from './rutas';

/**
 * Decide a dónde mandar al usuario que entra a `/`:
 *  - Sin sesión → /egresado/dashboard (modo dev) o /login (modo producción)
 *  - Con sesión → dashboard según su rol
 */
const REDIRIGIR_LOGIN_SIN_SESION = false; // ⚠️ true en producción

function RedirectorRaiz() {
  const { isAuthenticated, loading, user } = useAuth();

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to={REDIRIGIR_LOGIN_SIN_SESION ? RUTAS.login : RUTAS.egresadoDashboard} replace />;
  }

  const rol = obtenerRol(user);
  return <Navigate to={rutaDashboardDeRol(rol)} replace />;
}

export default RedirectorRaiz;
