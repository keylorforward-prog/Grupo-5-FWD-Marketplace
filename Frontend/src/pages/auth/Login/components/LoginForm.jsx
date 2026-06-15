import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../../../../services/authService';
import { useAuth } from '../../../../context/AuthContext';
import { obtenerRol, rutaDashboardDeRol, RUTAS } from '../../../../routes/rutas';
import "../../AuthPages.css";

const LoginForm = ({ onSwitchMode }) => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      setError('Por favor completa todos los campos.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const data = await authService.login(form);
      if (data.success) {
        login(data.user, data.token);
        const rol = obtenerRol(data.user);
        navigate(rutaDashboardDeRol(rol), { replace: true });
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Error al iniciar sesión. Intenta de nuevo.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-card">
      {/* Card Header */}
      <div className="card-header">
        <h2>Acceder a tu carrera<span className="dot-accent">.</span></h2>
        <p>Bienvenido de nuevo. Ingresa tus credenciales para continuar.</p>
      </div>

      {/* Google Auth */}
      <button
        type="button"
        className="btn-google"
        id="google-login"
        onClick={() => {
          window.location.href = "http://localhost:3000/api/auth/google"
        }}
      >
        <svg className="google-icon" viewBox="0 0 24 24">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18A10.96 10.96 0 0 0 1 12c0 1.77.42 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
        </svg>
        Continuar con Google
      </button>

      {/* Divider */}
      <div className="auth-divider">
        <span>O CON EMAIL</span>
      </div>

      <form onSubmit={handleSubmit} noValidate>
        {/* Error banner */}
        {error && (
          <div className="auth-error" role="alert">
            <span className="error-icon">⚠️</span>
            {error}
          </div>
        )}

        {/* Email */}
        <div className="form-group">
          <label htmlFor="login-email" className="form-label">
            Correo Electrónico
          </label>
          <div className="input-wrapper">
            <input
              id="login-email"
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="nombre@ejemplo.com"
              className="form-input"
              autoComplete="email"
              required
            />
          </div>
        </div>

        {/* Password */}
        <div className="form-group">
          <div className="form-label-row">
            <label htmlFor="login-password" className="form-label">
              Contraseña
            </label>
            <a href="#" className="forgot-link">¿Olvidaste tu contraseña?</a>
          </div>
          <div className="input-wrapper">
            <input
              id="login-password"
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="form-input"
              autoComplete="current-password"
              required
            />
            <button
              type="button"
              className="toggle-password"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
            >
              {showPassword ? '🙈' : '👁️'}
            </button>
          </div>
        </div>

        {/* Remember me */}
        <div className="remember-row">
          <input
            type="checkbox"
            id="remember-me"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
          />
          <label htmlFor="remember-me">Mantener sesión iniciada</label>
        </div>

        {/* Submit */}
        <button
          id="login-submit"
          type="submit"
          className="auth-btn"
          disabled={loading}
        >
          {loading ? (
            <span className="btn-loading">
              <span className="spinner-sm" />
              Iniciando sesión...
            </span>
          ) : (
            'Iniciar Sesión'
          )}
        </button>
      </form>

      {/* Footer */}
      <div className="auth-footer">
        ¿No tienes una cuenta?{' '}
        <Link to={RUTAS.registro}>Regístrate ahora</Link>
      </div>
    </div>
  );
};

export default LoginForm;
