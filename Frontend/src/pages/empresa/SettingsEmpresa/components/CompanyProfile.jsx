import { useRef, useState, useEffect } from 'react';
import { useAuth } from '../../../../context/AuthContext';
import { useTranslation } from 'react-i18next';
import apiClient from '../../../../services/apiClient';
import {
  MENSAJE_CEDULA_INVALIDA,
  MENSAJE_TELEFONO_INVALIDO,
  esCedulaValida,
  esTelefonoValido,
  formatearCedula,
  formatearTelefono,
} from '../../../../utils/inputMasks';

const CompanyProfile = () => {
  const { user, login } = useAuth();
  const fileInputRef = useRef(null);
  const [isUploading, setIsUploading] = useState(false);
  const [mensaje, setMensaje] = useState(null);

  const { t } = useTranslation();

  const [formData, setFormData] = useState({
    nombre_empresa: '',
    nombre: '',
    sitio_web: '',
    cedula: '',
    telefono_whatsapp: '',
    sector: '',
    descripcion: ''
  });
  const [isSaving, setIsSaving] = useState(false);
  const [cargando, setCargando] = useState(true);

  const initials = user?.nombre
    ? user.nombre.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase()
    : '';
  const avatarHue = user?.nombre
    ? user.nombre.split('').reduce((a, c) => a + c.charCodeAt(0), 0) % 360
    : 0;

  useEffect(() => {
    const fetchProfile = async () => {
      const userId = user?.id || user?.id_usuario;
      if (!userId) return;
      try {
        const res = await apiClient.get(`/perfiles-empresario/perfil/${userId}`);
        const result = res.data;
        if (result.success && result.data) {
          setFormData({
            nombre_empresa: result.data.nombre_empresa || '',
            nombre: result.data.nombre || '',
            sitio_web: result.data.sitio_web || '',
            cedula: formatearCedula(result.data.cedula || ''),
            telefono_whatsapp: formatearTelefono(result.data.telefono_whatsapp || ''),
            sector: result.data.sector || '',
            descripcion: result.data.descripcion || ''
          });
        }
      } catch (error) {
        console.error('Error fetching company profile:', error);
      } finally {
        setCargando(false);
      }
    };
    fetchProfile();
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const valor = name === 'cedula'
      ? formatearCedula(value)
      : name === 'telefono_whatsapp'
        ? formatearTelefono(value)
        : value;
    setFormData(prev => ({ ...prev, [name]: valor }));
  };

  const handleSave = async () => {
    const userId = user?.id || user?.id_usuario;
    if (!userId) return;
    if (formData.cedula && !esCedulaValida(formData.cedula)) {
      setMensaje(MENSAJE_CEDULA_INVALIDA);
      setTimeout(() => setMensaje(null), 3000);
      return;
    }
    if (formData.telefono_whatsapp && !esTelefonoValido(formData.telefono_whatsapp)) {
      setMensaje(MENSAJE_TELEFONO_INVALIDO);
      setTimeout(() => setMensaje(null), 3000);
      return;
    }
    
    setIsSaving(true);
    setMensaje(null);
    try {
      const res = await apiClient.put(`/perfiles-empresario/perfil/${userId}`, formData);
      const result = res.data;
      if (result.success) {
        setMensaje('exito');
      } else {
        setMensaje('error');
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      setMensaje('error');
    } finally {
      setIsSaving(false);
      setTimeout(() => setMensaje(null), 3000);
    }
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];
    const userId = user?.id || user?.id_usuario;
    if (!file || !userId) return;

    const fd = new FormData();
    fd.append('foto', file);

    try {
      setIsUploading(true);
      const res = await apiClient.put(`/usuarios/${userId}/foto-perfil`, fd);
      const data = res.data;
      if (data.success && data.url) {
        login({ ...user, foto_perfil: data.url }, localStorage.getItem('token'));
      }
    } catch (error) {
      console.error('Error uploading profile photo', error);
    } finally {
      setIsUploading(false);
    }
  };

  if (cargando) {
    return (
      <section className="se-card se-card-teal hard-edge-shadow" style={{ padding: '24px' }}>
        <p className="se-body-md">Cargando perfil...</p>
      </section>
    );
  }

  return (
    <section className="se-card se-card-teal hard-edge-shadow" style={{ overflow: 'hidden' }}>
      <div className="se-profile-layout">
        <div className="se-avatar-container">
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            accept="image/*" 
            style={{ display: 'none' }} 
          />
          <div className="se-avatar-box" style={{ opacity: isUploading ? 0.5 : 1 }}>
            {user?.foto_perfil ? (
              <img src={user.foto_perfil} alt="Company Logo" className="se-avatar-img" />
            ) : (
              <div className="se-avatar-img" style={{
                backgroundColor: `hsl(${avatarHue}, 62%, 52%)`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#fff', fontWeight: 'bold', fontSize: '24px',
              }}>
                {initials}
              </div>
            )}
          </div>
          <button className="se-edit-avatar-btn" onClick={handleAvatarClick} disabled={isUploading}>
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
              {isUploading ? 'hourglass_empty' : 'edit'}
            </span>
          </button>
        </div>

        <div className="se-form-container">
          <h3 className="se-headline-md" style={{ margin: '0 0 var(--spacing-sm) 0' }}>{t('companyProfile.title')}</h3>
          
          {mensaje && (
            <p style={{
              margin: '0 0 var(--spacing-sm) 0', padding: '8px 12px', borderRadius: '6px',
              backgroundColor: mensaje === 'exito' ? '#ecfdf5' : '#fef2f2',
              color: mensaje === 'exito' ? '#065f46' : '#991b1b',
              fontSize: 'var(--text-label-sm)', fontWeight: 500,
            }}>
              {mensaje === 'exito' ? 'Cambios guardados correctamente.' : mensaje === 'error' ? 'Error al guardar los cambios.' : mensaje}
            </p>
          )}

          <div className="se-form-grid">
            <div className="se-input-group">
              <label className="se-label-bold">Nombre de la empresa</label>
              <input type="text" className="se-input se-body-md" name="nombre_empresa" value={formData.nombre_empresa} onChange={handleInputChange} placeholder="Nombre de la empresa" />
            </div>
            <div className="se-input-group">
              <label className="se-label-bold">Nombre del representante</label>
              <input type="text" className="se-input se-body-md" name="nombre" value={formData.nombre} onChange={handleInputChange} placeholder="Nombre del representante" />
            </div>
            
            <div className="se-input-group">
              <label className="se-label-bold">{t('companyProfile.website')}</label>
              <div className="se-input-addon-wrapper">
                <span className="se-input-addon se-label-bold">https://</span>
                <input type="text" className="se-input se-body-md" name="sitio_web" value={formData.sitio_web} onChange={handleInputChange} />
              </div>
            </div>
            
            <div className="se-input-group">
              <label className="se-label-bold">{t('companyProfile.legalId')}</label>
              <input type="text" className="se-input se-body-md" name="cedula" value={formData.cedula} onChange={handleInputChange} placeholder="6-0491-0942" inputMode="numeric" maxLength={11} />
            </div>

            <div className="se-input-group">
              <label className="se-label-bold">{t('companyProfile.contactNumber', 'Número de Contacto')}</label>
              <input type="text" className="se-input se-body-md" name="telefono_whatsapp" value={formData.telefono_whatsapp} onChange={handleInputChange} placeholder="7104-1281" inputMode="numeric" maxLength={9} />
            </div>
            
            <div className="se-input-group">
              <label className="se-label-bold">{t('companyProfile.industry')}</label>
              <select className="se-input se-body-md" name="sector" value={formData.sector} onChange={handleInputChange}>
                <option value="">{t('companyProfile.selectOption')}</option>
                <option value="Software Development">{t('companyProfile.softwareDevelopment')}</option>
                <option value="Cloud Computing">{t('companyProfile.cloudComputing')}</option>
                <option value="AI & Data Science">{t('companyProfile.aiDataScience')}</option>
              </select>
            </div>
          </div>
          
          <div className="se-input-group">
            <label className="se-label-bold">{t('companyProfile.shortDescription')}</label>
            <textarea className="se-input se-body-md" rows="3" name="descripcion" value={formData.descripcion} onChange={handleInputChange} placeholder={t('companyProfile.descriptionPlaceholder')}></textarea>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: 'var(--spacing-base)' }}>
            <button className="se-save-btn se-label-bold hard-edge-shadow" onClick={handleSave} disabled={isSaving}>
              {isSaving ? t('companyProfile.saving') : t('companyProfile.saveChanges')}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CompanyProfile;
