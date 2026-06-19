import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { authService } from '../../../services/authService';
import { RUTAS, obtenerRol, rutaDashboardDeRol } from '../../../routes/rutas';
import { Camera, Tag, CreditCard, Smartphone, GraduationCap, Building2, Factory, FileText, AlertCircle, Clock, Link as LinkIcon } from 'lucide-react';
import '../AuthPages.css';
import './CompletarPerfil.css';

const CompletarPerfil = () => {
  const navigate = useNavigate();
  const { user, login } = useAuth();
  const fileInputRef = useRef(null);

  // Default to ESTUDIANTE as it's the most common
  const [form, setForm] = useState({
    rol: 'ESTUDIANTE',
    cedula: '',
    telefono_whatsapp: '',
    linkedin: '',
    titulo_fwd_file: null,
    tipo_empresa: '',
    sector: '',
    cedula_juridica_file: null,
    foto_perfil_file: null
  });

  const [previewImage, setPreviewImage] = useState(user?.avatar_url || user?.foto_perfil || '');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  // Check if profile is already complete
  useEffect(() => {
    if (user && user.perfil_completo) {
      const rol = obtenerRol(user);
      navigate(rutaDashboardDeRol(rol), { replace: true });
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (e.target.name === 'foto_perfil_file') {
      setForm({ ...form, foto_perfil_file: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setForm({ ...form, [e.target.name]: file });
    }
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { rol, cedula, telefono_whatsapp, linkedin, tipo_empresa, sector } = form;

    if (!cedula || !rol) {
      setError('Por favor completa todos los campos obligatorios.');
      return;
    }
    
    // Validación cédula costarricense: formato X-XXXX-XXXX (física) o XX-XXXXXXX-XXX (jurídica)
    const cedulaRegex = /^\d{1,2}-\d{3,4}-\d{3,4}$/;
    if (!cedula.startsWith('GOOGLE_') && !cedula.startsWith('GITHUB_') && !cedulaRegex.test(cedula)) {
      setError('Formato de cédula inválido. Ejemplos: 1-1231-8232 o 12-3456789-123');
      return;
    }

    if (rol === 'EMPRESARIO' && (!tipo_empresa || !sector)) {
      setError('Por favor completa los campos de tipo de empresa y sector.');
      return;
    }

    setLoading(true);
    setError('');
    setSuccessMsg('');

    try {
      const data = await authService.completarPerfil(form);
      if (data.success) {
        setSuccessMsg(data.message);
        
        // Actualizar contexto de auth con nuevo usuario y token
        login(data.user, data.token);
        
        // Redirigir al dashboard según el rol
        setTimeout(() => {
          const rolNormalizado = obtenerRol(data.user);
          navigate(rutaDashboardDeRol(rolNormalizado), { replace: true });
        }, 1500);
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Error al guardar el perfil. Intenta de nuevo.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-split">
      {/* Panel Izquierdo: Branding */}
      <div className="auth-brand-panel">
        <div className="brand-logo-row">
          <div className="brand-logo-circle">
            <img src="/Imgs/IconoFWD.png" alt="FWD Logo" />
          </div>
          <span className="brand-logo-text">FWD Junior</span>
        </div>

        <div className="brand-heading">
          <h1>
            Un último paso,
            <br />
            <span className="text-highlight">completa tu perfil.</span>
          </h1>
        </div>

        <p className="brand-description">
          Necesitamos algunos detalles adicionales para configurar tu cuenta correctamente y darte acceso a todas las funcionalidades.
        </p>

        <div className="brand-social-proof">
          <div className="avatar-group">
            <img src="https://i.pravatar.cc/100?img=1" alt="User 1" />
            <img src="https://i.pravatar.cc/100?img=2" alt="User 2" />
            <img src="https://i.pravatar.cc/100?img=3" alt="User 3" />
            <img src="https://i.pravatar.cc/100?img=4" alt="User 4" />
          </div>
          <span className="social-proof-text">
            Únete a más de <strong>2,000+</strong> profesionales
          </span>
        </div>
      </div>

      {/* Panel Derecho: Formulario */}
      <div className="auth-form-panel">
        <div className="auth-card completar-perfil-card">
          <div className="card-header">
            <h2>Completar Perfil<span className="dot-accent">.</span></h2>
            <p>Agrega los datos faltantes para finalizar tu registro con Google.</p>
          </div>

          {/* Información de Google (Solo lectura) */}
          <div className="google-info-section">
            <div className="profile-photo-wrapper">
              <div 
                className="profile-photo-container"
                onClick={() => fileInputRef.current?.click()}
              >
                {previewImage ? (
                  <img src={previewImage} alt="Foto de perfil" className="profile-photo" />
                ) : (
                  <div className="profile-photo-placeholder">
                    <span>{user?.nombre?.charAt(0) || '?'}</span>
                  </div>
                )}
                <div className="profile-photo-overlay">
                  <Camera size={20} />
                </div>
              </div>
              <input
                type="file"
                ref={fileInputRef}
                name="foto_perfil_file"
                onChange={handleFileChange}
                accept="image/png, image/jpeg, image/jpg"
                style={{ display: 'none' }}
              />
              <span className="photo-help-text">Cambiar foto</span>
            </div>

            <div className="google-readonly-fields">
              <div className="readonly-field">
                <span className="readonly-label">Nombre (Google)</span>
                <span className="readonly-value">{user?.nombre}</span>
              </div>
              <div className="readonly-field">
                <span className="readonly-label">Correo (Google)</span>
                <span className="readonly-value">{user?.email || user?.correo}</span>
              </div>
            </div>
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
                backdropFilter: 'blur(8px)'
              }}>
                <div style={{
                  width: '40px', height: '40px', margin: '0 auto 0.5rem',
                  background: 'var(--primary)',
                  borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}><Clock size={20} color="white" /></div>
                <strong>{successMsg}</strong>
              </div>
            )}

            <div className="form-sections-grid">
              {/* Rol */}
              <div className="form-group">
                <label htmlFor="cp-rol" className="form-label"><Tag size={18} style={{display: 'inline-block', marginRight: '0.5em', verticalAlign: 'text-bottom'}} /> Tipo de cuenta</label>
                <div className="input-wrapper">
                  <select
                    id="cp-rol"
                    name="rol"
                    value={form.rol}
                    onChange={handleChange}
                    className="form-select"
                    required
                  >
                    <option value="ESTUDIANTE">Estudiante FWD</option>
                    <option value="EMPRESARIO">Empresa / Reclutador</option>
                  </select>
                </div>
              </div>

              {/* Cedula */}
              <div className="form-group">
                <label htmlFor="cp-cedula" className="form-label">Cédula <span style={{ color: '#1B6CA8', fontWeight: 500 }}>(incluir guion)</span></label>
                <div className="input-wrapper">
                  <CreditCard size={20} className="input-icon" style={{position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)'}} />
                  <input
                    id="cp-cedula"
                    type="text"
                    name="cedula"
                    value={form.cedula.startsWith('GOOGLE_') ? '' : form.cedula}
                    onChange={handleChange}
                    placeholder="1-2342"
                    className="form-input has-icon"
                    required
                  />
                </div>
              </div>

              {/* Teléfono (para todos) */}
              <div className="form-group">
                <label htmlFor="cp-telefono" className="form-label">Teléfono (WhatsApp)</label>
                <div className="input-wrapper">
                  <Smartphone size={20} className="input-icon" style={{position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)'}} />
                  <input
                    id="cp-telefono"
                    type="tel"
                    name="telefono_whatsapp"
                    value={form.telefono_whatsapp}
                    onChange={handleChange}
                    placeholder="8888-8888"
                    className="form-input has-icon"
                  />
                </div>
              </div>

              {/* LinkedIn */}
              <div className="form-group">
                <label htmlFor="cp-linkedin" className="form-label">Perfil de LinkedIn <span style={{ fontSize: '0.85em', color: '#888' }}>- Opcional</span></label>
                <div className="input-wrapper">
                  <LinkIcon size={20} className="input-icon" style={{position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)'}} />
                  <input
                    id="cp-linkedin"
                    type="url"
                    name="linkedin"
                    value={form.linkedin}
                    onChange={handleChange}
                    placeholder="https://linkedin.com/in/tu-perfil"
                    className="form-input has-icon"
                  />
                </div>
              </div>
            </div>

            <div className="conditional-fields-container">
              {/* Campos condicionales Estudiante */}
              {form.rol === 'ESTUDIANTE' && (
                <div className="form-group slide-in">
                  <label htmlFor="cp-titulo" className="form-label">Título de FWD (PDF o Imagen)</label>
                  <div className="input-wrapper">
                    <GraduationCap size={20} className="input-icon" style={{position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)'}} />
                    <input
                      id="cp-titulo"
                      type="file"
                      name="titulo_fwd_file"
                      onChange={handleFileChange}
                      accept=".pdf, image/png, image/jpeg, image/jpg"
                      className="form-input file-input has-icon"
                    />
                  </div>
                </div>
              )}

              {/* Campos condicionales Empresario */}
              {form.rol === 'EMPRESARIO' && (
                <div className="slide-in">
                  <div className="form-group">
                    <label htmlFor="cp-tipo-empresa" className="form-label">Tipo de Empresa</label>
                    <div className="input-wrapper">
                      <Building2 size={20} className="input-icon" style={{position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)'}} />
                      <input
                        id="cp-tipo-empresa"
                        type="text"
                        name="tipo_empresa"
                        value={form.tipo_empresa}
                        onChange={handleChange}
                        placeholder="Ej. Startup, PyME, Corporación"
                        className="form-input has-icon"
                        required
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label htmlFor="cp-sector" className="form-label">Sector</label>
                    <div className="input-wrapper">
                      <Factory size={20} className="input-icon" style={{position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)'}} />
                      <input
                        id="cp-sector"
                        type="text"
                        name="sector"
                        value={form.sector}
                        onChange={handleChange}
                        placeholder="Ej. Tecnología, Finanzas, Salud"
                        className="form-input has-icon"
                        required
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label htmlFor="cp-cedula-juridica" className="form-label">
                      Cédula Jurídica (PDF o Imagen) <span style={{ fontSize: '0.85em', color: '#888' }}>- Opcional</span>
                    </label>
                    <div className="input-wrapper">
                      <FileText size={20} className="input-icon" style={{position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)'}} />
                      <input
                        id="cp-cedula-juridica"
                        type="file"
                        name="cedula_juridica_file"
                        onChange={handleFileChange}
                        accept=".pdf, image/png, image/jpeg, image/jpg"
                        className="form-input file-input has-icon"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            <button
              id="completar-perfil-submit"
              type="submit"
              className="auth-btn"
              disabled={loading}
              style={{ marginTop: '1.5rem' }}
            >
              {loading ? (
                <span className="btn-loading">
                  <span className="spinner-sm" />
                  Guardando datos...
                </span>
              ) : (
                'Finalizar Registro'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CompletarPerfil;
