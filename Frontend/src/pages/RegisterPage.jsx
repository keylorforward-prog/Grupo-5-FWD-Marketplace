import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { useAuth } from '../context/AuthContext';
import './AuthPages.css';

const RegisterPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({ nombre: '', email: '', password: '', confirmPassword: '', cedula: '', rol: 'ESTUDIANTE', telefono_whatsapp: '', titulo_fwd_file: null, tipo_empresa: '', sector: '', cedula_juridica_file: null });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  const handleFileChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.files[0] });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { nombre, email, password, confirmPassword, cedula, rol, telefono_whatsapp, titulo_fwd_file, tipo_empresa, sector, cedula_juridica_file } = form;

    if (!nombre || !email || !password || !confirmPassword || !cedula || !rol) {
      setError('Por favor completa todos los campos.');
      return;
    }
    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const data = await authService.register({ nombre, email, password, cedula, rol, telefono_whatsapp, titulo_fwd_file, tipo_empresa, sector, cedula_juridica_file });
      if (data.success) {
        // Guardar token en localStorage para interceptors futuros
        localStorage.setItem('token', data.token);
        login(data.user, data.token);
        navigate('/dashboard');
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Error al registrarse. Intenta de nuevo.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-bg">
      <div className="orb orb-1" />
      <div className="orb orb-2" />
      <div className="orb orb-3" />

      <div className="auth-container">
        <div className="auth-header">
          <div className="auth-logo">
            <span className="logo-icon">🛒</span>
          </div>
          <h1 className="auth-title">FWD Marketplace</h1>
          <p className="auth-subtitle">Crea tu cuenta gratis</p>
        </div>

        <div className="auth-card">
          <form onSubmit={handleSubmit} noValidate>
            {error && (
              <div className="auth-error" role="alert">
                <span className="error-icon">⚠️</span>
                {error}
              </div>
            )}

            {/* Nombre */}
            <div className="form-group">
              <label htmlFor="reg-nombre" className="form-label">Nombre completo</label>
              <div className="input-wrapper">
                <span className="input-icon">👤</span>
                <input
                  id="reg-nombre"
                  type="text"
                  name="nombre"
                  value={form.nombre}
                  onChange={handleChange}
                  placeholder="Juan Pérez"
                  className="form-input"
                  autoComplete="name"
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div className="form-group">
              <label htmlFor="reg-email" className="form-label">Correo electrónico</label>
              <div className="input-wrapper">
                <span className="input-icon">✉️</span>
                <input
                  id="reg-email"
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="tu@correo.com"
                  className="form-input"
                  autoComplete="email"
                  required
                />
              </div>
            </div>

            {/* Cedula */}
            <div className="form-group">
              <label htmlFor="reg-cedula" className="form-label">Cédula</label>
              <div className="input-wrapper">
                <span className="input-icon">🆔</span>
                <input
                  id="reg-cedula"
                  type="text"
                  name="cedula"
                  value={form.cedula}
                  onChange={handleChange}
                  placeholder="1‑2345‑6789"
                  className="form-input"
                  required
                />
              </div>
            </div>

            {/* Rol */}
            <div className="form-group">
              <label htmlFor="reg-rol" className="form-label">Tipo de cuenta</label>
              <div className="input-wrapper">
                <span className="input-icon">🏷️</span>
                <select
                  id="reg-rol"
                  name="rol"
                  value={form.rol}
                  onChange={handleChange}
                  className="form-select"
                  required
                >
                  <option value="ESTUDIANTE">Estudiante</option>
                  <option value="EMPRESARIO">Empresario</option>
                  <option value="ADMIN">Admin</option>
                </select>
              </div>
            </div>

            {/* Teléfono (para todos) */}
            <div className="form-group">
              <label htmlFor="reg-telefono" className="form-label">Teléfono (WhatsApp)</label>
              <div className="input-wrapper">
                <span className="input-icon">📱</span>
                <input
                  id="reg-telefono"
                  type="tel"
                  name="telefono_whatsapp"
                  value={form.telefono_whatsapp}
                  onChange={handleChange}
                  placeholder="8888-8888"
                  className="form-input"
                  required
                />
              </div>
            </div>

            {/* Campos condicionales Estudiante */}
            {form.rol === 'ESTUDIANTE' && (
              <div className="form-group">
                <label htmlFor="reg-titulo" className="form-label">Título de FWD (PDF o Imagen)</label>
                <div className="input-wrapper">
                  <span className="input-icon">🎓</span>
                  <input
                    id="reg-titulo"
                    type="file"
                    name="titulo_fwd_file"
                    onChange={handleFileChange}
                    accept=".pdf, image/*"
                    className="form-input file-input"
                  />
                </div>
              </div>
            )}

            {/* Campos condicionales Empresario */}
            {form.rol === 'EMPRESARIO' && (
              <>
                <div className="form-group">
                  <label htmlFor="reg-tipo-empresa" className="form-label">Tipo de Empresa</label>
                  <div className="input-wrapper">
                    <span className="input-icon">🏢</span>
                    <input
                      id="reg-tipo-empresa"
                      type="text"
                      name="tipo_empresa"
                      value={form.tipo_empresa}
                      onChange={handleChange}
                      placeholder="Ej. Startup, PyME, etc."
                      className="form-input"
                      required
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="reg-sector" className="form-label">Sector</label>
                  <div className="input-wrapper">
                    <span className="input-icon">🏭</span>
                    <input
                      id="reg-sector"
                      type="text"
                      name="sector"
                      value={form.sector}
                      onChange={handleChange}
                      placeholder="Tecnología, Finanzas, Salud"
                      className="form-input"
                      required
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="reg-cedula-juridica" className="form-label">
                    Cédula Jurídica (PDF o Imagen) <span style={{fontSize: '0.85em', color: '#888'}}>- Opcional</span>
                  </label>
                  <div className="input-wrapper">
                    <span className="input-icon">📄</span>
                    <input
                      id="reg-cedula-juridica"
                      type="file"
                      name="cedula_juridica_file"
                      onChange={handleFileChange}
                      accept=".pdf, image/*"
                      className="form-input file-input"
                    />
                  </div>
                </div>
              </>
            )}
            <div className="form-group">
              <label htmlFor="reg-password" className="form-label">Contraseña</label>
              <div className="input-wrapper">
                <span className="input-icon">🔒</span>
                <input
                  id="reg-password"
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Mínimo 6 caracteres"
                  className="form-input"
                  autoComplete="new-password"
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

            {/* Confirm Password */}
            <div className="form-group">
              <label htmlFor="reg-confirm" className="form-label">Confirmar contraseña</label>
              <div className="input-wrapper">
                <span className="input-icon">🔐</span>
                <input
                  id="reg-confirm"
                  type={showPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  placeholder="Repite tu contraseña"
                  className="form-input"
                  autoComplete="new-password"
                  required
                />
              </div>
            </div>

            <button
              id="register-submit"
              type="submit"
              className="auth-btn"
              disabled={loading}
            >
              {loading ? (
                <span className="btn-loading">
                  <span className="spinner-sm" />
                  Creando cuenta...
                </span>
              ) : (
                'Crear Cuenta'
              )}
            </button>
          </form>

          <div className="auth-divider">
            <span>¿Ya tienes cuenta?</span>
          </div>

          <Link to="/login" className="auth-link-btn">
            Iniciar sesión
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
