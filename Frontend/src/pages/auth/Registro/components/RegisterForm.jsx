import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../../../../services/authService';
import '../../AuthPages.css';

const RegisterForm = ({ onSwitchMode }) => {
  const navigate = useNavigate();

  const [form, setForm] = useState({ nombre: '', email: '', password: '', confirmPassword: '', cedula: '', rol: 'ESTUDIANTE', telefono_whatsapp: '', titulo_fwd_file: null, tipo_empresa: '', sector: '', cedula_juridica_file: null });
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
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
    setSuccessMsg('');

    try {
      const data = await authService.register({ nombre, email, password, cedula, rol, telefono_whatsapp, titulo_fwd_file, tipo_empresa, sector, cedula_juridica_file });
      if (data.success && data.pendingApproval) {
        setSuccessMsg(data.message);
        // Redirigir al login después de 4 segundos
        setTimeout(() => navigate('/'), 4000);
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Error al registrarse. Intenta de nuevo.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-card">
      {/* Card Header */}
      <div className="card-header">
        <h2>Crear tu cuenta<span className="dot-accent">.</span></h2>
        <p>Completa tus datos para unirte a la plataforma.</p>
      </div>

      <form onSubmit={handleSubmit} noValidate>
        {/* Error banner */}
        {error && (
          <div className="auth-error" role="alert">
            <span className="error-icon">⚠️</span>
            {error}
          </div>
        )}

        {/* Success banner */}
        {successMsg && (
          <div className="auth-success" role="status" style={{
            background: 'linear-gradient(135deg, color-mix(in srgb, var(--primary) 10%, transparent), color-mix(in srgb, var(--accent) 10%, transparent))',
            border: '1px solid color-mix(in srgb, var(--primary) 35%, transparent)',
            color: 'var(--primary)',
            padding: '1.25rem',
            borderRadius: 'var(--radius)',
            marginBottom: '1rem',
            fontSize: '0.95rem',
            lineHeight: '1.6',
            textAlign: 'center',
            backdropFilter: 'blur(8px)',
            boxShadow: '0 4px 12px color-mix(in srgb, var(--primary) 8%, transparent)'
          }}>
            <div style={{
              width: '48px', height: '48px', margin: '0 auto 0.75rem',
              background: 'linear-gradient(135deg, var(--highlight), var(--warning))',
              borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1.4rem', boxShadow: '0 2px 8px color-mix(in srgb, var(--highlight) 35%, transparent)'
            }}>⏳</div>
            <strong style={{ fontSize: '1.05rem', display: 'block', marginBottom: '0.35rem', color: 'var(--primary)' }}>
              Cuenta creada exitosamente
            </strong>
            <span style={{ color: 'var(--ink)' }}>{successMsg}</span>
            <div style={{
              marginTop: '0.75rem', fontSize: '0.82rem', color: 'var(--accent)', fontWeight: 600
            }}>Redirigiendo al inicio de sesión...</div>
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
              className="form-input has-icon"
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
              className="form-input has-icon"
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
              className="form-input has-icon"
              required
            />
          </div>
        </div>

        {/* Rol */}
        <div className="form-group">
          <label htmlFor="reg-rol" className="form-label">🏷️ Tipo de cuenta</label>
          <div className="input-wrapper">
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
              className="form-input has-icon"
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
                className="form-input file-input has-icon"
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
                  className="form-input has-icon"
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
                  className="form-input has-icon"
                  required
                />
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="reg-cedula-juridica" className="form-label">
                Cédula Jurídica (PDF o Imagen) <span style={{ fontSize: '0.85em', color: '#888' }}>- Opcional</span>
              </label>
              <div className="input-wrapper">
                <span className="input-icon">📄</span>
                <input
                  id="reg-cedula-juridica"
                  type="file"
                  name="cedula_juridica_file"
                  onChange={handleFileChange}
                  accept=".pdf, image/*"
                  className="form-input file-input has-icon"
                />
              </div>
            </div>
          </>
        )}

        {/* Password */}
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
              className="form-input has-icon"
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
              className="form-input has-icon"
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

      {/* Footer */}
      <div className="auth-footer">
        ¿Ya tienes cuenta?{' '}
        <button type="button" className="switch-mode-btn" onClick={onSwitchMode}>Iniciar sesión</button>
      </div>
    </div>
  );
};

export default RegisterForm;
