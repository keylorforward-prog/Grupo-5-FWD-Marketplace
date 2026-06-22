import { useRef, useState, useEffect } from 'react';
import { useAuth } from '../../../../context/AuthContext';
import { useTranslation } from 'react-i18next';

const CompanyProfile = () => {
  const { user, login } = useAuth();
  const fileInputRef = useRef(null);
  const [isUploading, setIsUploading] = useState(false);

  const defaultAvatar = "https://lh3.googleusercontent.com/aida-public/AB6AXuDAG8lvLxhVoKXJ-EnxOLfvfYASr2wMcXn-Ep7yClWOqMikPElWKRZh_OXTLJjFqvhZCjVFOZEzXhuzuVl3QokudQL54fU9zfxrFAOa4CjDu4N5NE7Ly9nJADj8tBS-salgE2ixD_lJvt8k0ZbSTQVx69drGoMTbbiWuKOmBYgll0COcnETyaQVryjX0GJ4giSKq7vIZmryVErXyDy4Ny-UaJE74AnKW38ZBhrm0wpf0eEDFQtrHbWvwsw41C4N343pzk040njET2E";
  const avatarUrl = user?.foto_perfil || defaultAvatar;

  const { t } = useTranslation();

  const [formData, setFormData] = useState({
    nombre: '',
    sitio_web: '',
    cedula: '',
    telefono_whatsapp: '',
    sector: '',
    descripcion: ''
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      const userId = user?.id || user?.id_usuario;
      if (!userId) return;
      try {
        const res = await fetch(`/api/perfiles-empresario/perfil/${userId}`);
        const result = await res.json();
        if (result.success && result.data) {
          setFormData({
            nombre: result.data.nombre || '',
            sitio_web: result.data.sitio_web || '',
            cedula: result.data.cedula || '',
            telefono_whatsapp: result.data.telefono_whatsapp || '',
            sector: result.data.sector || '',
            descripcion: result.data.descripcion || ''
          });
        }
      } catch (error) {
        console.error("Error fetching company profile:", error);
      }
    };
    fetchProfile();
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    const userId = user?.id || user?.id_usuario;
    if (!userId) return;
    
    setIsSaving(true);
    try {
      const res = await fetch(`/api/perfiles-empresario/perfil/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const result = await res.json();
      if (result.success) {
        alert('Cambios guardados correctamente');
      } else {
        alert('Error al guardar: ' + result.message);
      }
    } catch (error) {
      console.error("Error saving profile:", error);
      alert('Ocurrió un error al guardar los cambios');
    } finally {
      setIsSaving(false);
    }
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];
    const userId = user?.id || user?.id_usuario;
    if (!file || !userId) return;

    const formData = new FormData();
    formData.append('foto', file);

    try {
      setIsUploading(true);
      const res = await fetch(`/api/usuarios/${userId}/foto-perfil`, {
        method: 'PUT',
        body: formData,
      });
      const data = await res.json();
      if (data.success && data.url) {
        // Update user context with new photo
        login({ ...user, foto_perfil: data.url }, localStorage.getItem('token'));
      }
    } catch (error) {
      console.error("Error uploading profile photo", error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <section className="se-card se-card-teal hard-edge-shadow" style={{ overflow: 'hidden' }}>
      <div className="se-profile-layout">
        
        {/* Company Avatar */}
        <div className="se-avatar-container">
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            accept="image/*" 
            style={{ display: 'none' }} 
          />
          <div className="se-avatar-box" style={{ opacity: isUploading ? 0.5 : 1 }}>
            <img 
              src={avatarUrl} 
              alt="Company Logo" 
              className="se-avatar-img"
            />
          </div>
          <button className="se-edit-avatar-btn" onClick={handleAvatarClick} disabled={isUploading}>
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
              {isUploading ? 'hourglass_empty' : 'edit'}
            </span>
          </button>
        </div>

        {/* Fields Grid */}
        <div className="se-form-container">
          <h3 className="se-headline-md" style={{ margin: '0 0 var(--spacing-sm) 0' }}>{t('companyProfile.title')}</h3>
          
          <div className="se-form-grid">
            <div className="se-input-group">
              <label className="se-label-bold">{t('companyProfile.commercialName')}</label>
              <input type="text" className="se-input se-body-md" name="nombre" value={formData.nombre} onChange={handleInputChange} />
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
              <input type="text" className="se-input se-body-md" name="cedula" value={formData.cedula} onChange={handleInputChange} placeholder={t('companyProfile.legalId')} />
            </div>

            <div className="se-input-group">
              <label className="se-label-bold">{t('companyProfile.contactNumber', 'Número de Contacto')}</label>
              <input type="text" className="se-input se-body-md" name="telefono_whatsapp" value={formData.telefono_whatsapp} onChange={handleInputChange} placeholder={t('companyProfile.contactNumber', 'Número de Contacto')} />
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
