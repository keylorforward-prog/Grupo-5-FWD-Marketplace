import { createContext, useCallback, useContext, useMemo, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  // Al cargar la app, verifica si el token guardado sigue siendo válido
  useEffect(() => {
    const initAuth = async () => {
      const savedToken = localStorage.getItem('token');
      if (savedToken) {
        try {
          const data = await authService.getMe();
          setUser(data.user);
          setToken(savedToken);
        } catch {
          // Token inválido o expirado
          localStorage.removeItem('token');
          setToken(null);
          setUser(null);
        }
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  const login = useCallback((userData, userToken) => {
    setUser(userData);
    setToken(userToken);
    localStorage.setItem('token', userToken);
  }, []);

  const actualizarUsuario = useCallback((cambios) => {
    setUser((usuarioActual) => (usuarioActual ? { ...usuarioActual, ...cambios } : usuarioActual));
  }, []);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch {
      // El cierre de sesión local debe continuar aunque el backend no responda.
    }
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
  }, []);

  const isAuthenticated = !!token && !!user;
  const contextValue = useMemo(() => ({
    user,
    token,
    login,
    logout,
    actualizarUsuario,
    isAuthenticated,
    loading,
  }), [actualizarUsuario, isAuthenticated, loading, login, logout, token, user]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth debe usarse dentro de AuthProvider');
  return context;
};
