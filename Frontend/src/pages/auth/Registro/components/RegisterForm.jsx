import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { User, Mail, CreditCard, Tag, Smartphone, GraduationCap, Building2, Factory, FileText, Lock, LockKeyhole, Eye, EyeOff, AlertCircle, Clock } from 'lucide-react';
import { authService } from '../../../../services/authService';
import { RUTAS } from '../../../../routes/rutas';
import '../../AuthPages.css';

const RegisterForm = ({ onSwitchMode }) => {
  const { t } = useTranslation();
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
      setError(t('auth.register.errFields'));
      return;
    }
    
    // Validación de formato de cédula: debe contener guion
    if (!cedula.includes('-')) {
      setError(t('auth.register.errCedula'));
      return;
    }
    
    if (password.length < 6) {
      setError(t('auth.register.errPasswordLen'));
      return;
    }
    if (password !== confirmPassword) {
      setError(t('auth.register.errPasswordMatch'));
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
        setTimeout(() => navigate(RUTAS.login), 4000);
      }
    } catch (err) {
      const msg = err.response?.data?.message || t('auth.register.errDefault');
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-card">
      {/* Card Header */}
      <div className="card-header">
        <h2>{t('auth.register.titleStart')}<span className="dot-accent">.</span></h2>
        <p>{t('auth.register.subtitle')}</p>
      </div>

      <form onSubmit={handleSubmit} noValidate>
        {/* Error banner */}
        {error && (
          <div className="auth-error" role="alert">
            <AlertCircle size={16} style={{flexShrink: 0}} />
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
            }}><Clock size={28} color="white" /></div>
            <strong style={{ fontSize: '1.05rem', display: 'block', marginBottom: '0.35rem', color: 'var(--primary)' }}>
              {t('auth.register.successMsg')}
            </strong>
            <span style={{ color: 'var(--ink)' }}>{successMsg}</span>
            <div style={{
              marginTop: '0.75rem', fontSize: '0.82rem', color: 'var(--accent)', fontWeight: 600
            }}>{t('auth.register.redirecting')}</div>
          </div>
        )}

        {/* Nombre */}
        <div className="form-group">
          <label htmlFor="reg-nombre" className="form-label">{t('auth.register.name')}</label>
          <div className="input-wrapper">
            <User size={20} className="input-icon" style={{position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)'}} />
            <input
              id="reg-nombre"
              type="text"
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              placeholder={t('auth.register.namePlaceholder')}
              className="form-input has-icon"
              autoComplete="name"
              required
            />
          </div>
        </div>

        {/* Email */}
        <div className="form-group">
          <label htmlFor="reg-email" className="form-label">{t('auth.login.email')}</label>
          <div className="input-wrapper">
            <Mail size={20} className="input-icon" style={{position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)'}} />
            <input
              id="reg-email"
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder={t('auth.login.emailPlaceholder')}
              className="form-input has-icon"
              autoComplete="email"
              required
            />
          </div>
        </div>

        {/* Cedula */}
        <div className="form-group">
          <label htmlFor="reg-cedula" className="form-label">{t('auth.register.cedula')}<span style={{ color: '#1B6CA8', fontWeight: 500 }}>{t('auth.register.cedulaHint')}</span></label>
          <div className="input-wrapper">
            <CreditCard size={20} className="input-icon" style={{position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)'}} />
            <input
              id="reg-cedula"
              type="text"
              name="cedula"
              value={form.cedula}
              onChange={handleChange}
              placeholder={t('auth.register.cedulaPlaceholder')}
              className="form-input has-icon"
              required
            />
          </div>
        </div>

        {/* Rol */}
        <div className="form-group">
          <label htmlFor="reg-rol" className="form-label"><Tag size={18} style={{display: 'inline-block', marginRight: '0.5em', verticalAlign: 'text-bottom'}} /> {t('auth.register.role')}</label>
          <div className="input-wrapper">
            <select
              id="reg-rol"
              name="rol"
              value={form.rol}
              onChange={handleChange}
              className="form-select"
              required
            >
              <option value="ESTUDIANTE">{t('auth.register.roleStudent')}</option>
              <option value="EMPRESARIO">{t('auth.register.roleCompany')}</option>
            </select>
          </div>
        </div>

        {/* Teléfono (para todos) */}
        <div className="form-group">
          <label htmlFor="reg-telefono" className="form-label">{t('auth.register.phone')}</label>
          <div className="input-wrapper">
            <Smartphone size={20} className="input-icon" style={{position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)'}} />
            <input
              id="reg-telefono"
              type="tel"
              name="telefono_whatsapp"
              value={form.telefono_whatsapp}
              onChange={handleChange}
              placeholder={t('auth.register.phonePlaceholder')}
              className="form-input has-icon"
              required
            />
          </div>
        </div>

        {/* Campos condicionales Estudiante */}
        {form.rol === 'ESTUDIANTE' && (
          <div className="form-group">
            <label htmlFor="reg-titulo" className="form-label">{t('auth.register.fileStudent')}</label>
            <div className="input-wrapper">
              <GraduationCap size={20} className="input-icon" style={{position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)'}} />
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
              <label htmlFor="reg-tipo-empresa" className="form-label">{t('auth.register.companyType')}</label>
              <div className="input-wrapper">
                <Building2 size={20} className="input-icon" style={{position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)'}} />
                <input
                  id="reg-tipo-empresa"
                  type="text"
                  name="tipo_empresa"
                  value={form.tipo_empresa}
                  onChange={handleChange}
                  placeholder={t('auth.register.companyTypePlaceholder')}
                  className="form-input has-icon"
                  required
                />
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="reg-sector" className="form-label">{t('auth.register.sector')}</label>
              <div className="input-wrapper">
                <Factory size={20} className="input-icon" style={{position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)'}} />
                <input
                  id="reg-sector"
                  type="text"
                  name="sector"
                  value={form.sector}
                  onChange={handleChange}
                  placeholder={t('auth.register.sectorPlaceholder')}
                  className="form-input has-icon"
                  required
                />
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="reg-cedula-juridica" className="form-label">
                {t('auth.register.fileCompany')} <span style={{ fontSize: '0.85em', color: '#888' }}>{t('auth.register.optional')}</span>
              </label>
              <div className="input-wrapper">
                <FileText size={20} className="input-icon" style={{position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)'}} />
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
          <label htmlFor="reg-password" className="form-label">{t('auth.login.password')}</label>
          <div className="input-wrapper">
            <Lock size={20} className="input-icon" style={{position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)'}} />
            <input
              id="reg-password"
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder={t('auth.register.passwordPlaceholder')}
              className="form-input has-icon"
              autoComplete="new-password"
              required
            />
            <button
              type="button"
              className="toggle-password"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              style={{background: 'none', border: 'none', cursor: 'pointer', padding: 0}}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

        {/* Confirm Password */}
        <div className="form-group">
          <label htmlFor="reg-confirm" className="form-label">{t('auth.register.confirmPassword')}</label>
          <div className="input-wrapper">
            <LockKeyhole size={20} className="input-icon" style={{position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)'}} />
            <input
              id="reg-confirm"
              type={showPassword ? 'text' : 'password'}
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              placeholder={t('auth.register.confirmPasswordPlaceholder')}
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
              {t('auth.register.loading')}
            </span>
          ) : (
            t('auth.register.submit')
          )}
        </button>
      </form>

      {/* Footer */}
      <div className="auth-footer">
        {t('auth.register.hasAccount')}{' '}
        <Link to={RUTAS.login}>{t('auth.register.loginNow')}</Link>
      </div>
    </div>
  );
};

export default RegisterForm;
