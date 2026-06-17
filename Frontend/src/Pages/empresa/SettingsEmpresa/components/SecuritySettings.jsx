import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { authService } from '../../../../services/authService';

const SecuritySettings = () => {
  const { t } = useTranslation();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [status, setStatus] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) {
      setStatus({ type: 'error', message: t('securitySettings.emptyFields', 'Ambos campos son requeridos') });
      return;
    }
    
    if (newPassword.length < 6) {
      setStatus({ type: 'error', message: t('securitySettings.minLen', 'La contraseña debe tener al menos 6 caracteres') });
      return;
    }

    setLoading(true);
    setStatus({ type: '', message: '' });

    try {
      const response = await authService.updatePassword({
        currentPassword,
        newPassword
      });

      if (response.success) {
        setStatus({ type: 'success', message: t('securitySettings.success', 'Contraseña actualizada con éxito') });
        setCurrentPassword('');
        setNewPassword('');
      } else {
        setStatus({ type: 'error', message: response.message || t('securitySettings.error', 'Ocurrió un error') });
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || t('securitySettings.error', 'Ocurrió un error al actualizar la contraseña');
      setStatus({ type: 'error', message: errorMsg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="se-card hard-edge-shadow" style={{ marginTop: 'var(--spacing-xl)', backgroundColor: 'var(--color-surface-container-lowest)' }}>
      <h3 className="se-headline-md se-section-title" style={{ margin: '0 0 var(--spacing-md) 0' }}>
        {t('securitySettings.title', 'Seguridad')}
      </h3>
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
        <div className="se-input-group">
          <label className="se-label-bold">{t('securitySettings.currentPassword', 'Contrasena actual')}</label>
          <input
            type="password"
            className="se-input se-body-md"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            disabled={loading}
          />
        </div>

        <div className="se-input-group">
          <label className="se-label-bold">{t('securitySettings.newPassword', 'Nueva contrasena')}</label>
          <input
            type="password"
            className="se-input se-body-md"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            disabled={loading}
          />
        </div>

        {status.message && (
          <p style={{ margin: 0, color: status.type === 'error' ? 'var(--color-vibrant-pink)' : 'var(--color-vibrant-teal)', fontSize: 'var(--text-label-sm)' }}>
            {status.message}
          </p>
        )}

        <div style={{ display: 'flex', justifyContent: 'flex-start', paddingTop: 'var(--spacing-base)' }}>
          <button 
            type="submit" 
            className="se-save-btn se-label-bold hard-edge-shadow" 
            disabled={loading}
          >
            {loading ? t('securitySettings.saving', 'Guardando...') : t('securitySettings.saveChanges', 'Guardar cambios')}
          </button>
        </div>
      </form>
    </section>
  );
};

export default SecuritySettings;
