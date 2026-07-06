import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { obtenerRol, rutaDashboardDeRol } from '../../routes/rutas';
import apiClient from '../../services/apiClient';

const GoogleCallback = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const handleGoogleCallback = async () => {
      try {
        const token = searchParams.get('token');

        if (!token) {
          setError('Token no encontrado. Por favor intenta de nuevo.');
          setTimeout(() => {
            navigate('/login', { replace: true });
          }, 2000);
          return;
        }

        // Guarda el token en localStorage
        localStorage.setItem('token', token);

        // Establece el token en el header del apiClient
        apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;

        // Obtiene los datos del usuario autenticado
        const userData = await apiClient.get('/auth/me');

        if (userData.data && userData.data.user) {
          // Guarda el usuario en el contexto
          login(userData.data.user, token);

          // Verifica si el perfil está completo
          if (userData.data.user.perfil_completo === false) {
            navigate('/completar-perfil', { replace: true });
          } else {
            // Redirige al dashboard según el rol
            const rol = obtenerRol(userData.data.user);
            navigate(rutaDashboardDeRol(rol), { replace: true });
          }
        }
      } catch (err) {
        console.error('Error en callback de Google:', err);

        // Limpia el token si hay error
        localStorage.removeItem('token');
        delete apiClient.defaults.headers.common['Authorization'];

        setError('Error al procesar la autenticación con Google');
        setTimeout(() => {
          navigate('/login', { replace: true });
        }, 2000);
      } finally {
        setLoading(false);
      }
    };

    handleGoogleCallback();
  }, [navigate, login, searchParams]);

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: '1rem',
        background: 'linear-gradient(160deg, #7B2FBE 0%, #9D4EDD 100%)',
        color: '#fff',
        fontFamily: 'Inter, sans-serif'
      }}>
        <div style={{
          width: '40px',
          height: '40px',
          border: '3px solid rgba(255,255,255,0.3)',
          borderTopColor: '#fff',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite'
        }}></div>
        <p>Autenticando con Google...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(160deg, #7B2FBE 0%, #9D4EDD 100%)',
        fontFamily: 'Inter, sans-serif'
      }}>
        <div style={{
          background: '#FFFFFF',
          padding: '2rem',
          borderRadius: '1rem',
          textAlign: 'center',
          maxWidth: '400px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.15)'
        }}>
          <h2 style={{ color: '#1A1A1A', marginBottom: '0.5rem' }}>Error</h2>
          <p style={{ color: '#6B7280' }}>{error}</p>
          <p style={{ color: '#9CA3AF', fontSize: '0.9rem', marginTop: '1rem' }}>
            Redirigiendo al inicio de sesión...
          </p>
        </div>
      </div>
    );
  }

  return null;
};

export default GoogleCallback;
