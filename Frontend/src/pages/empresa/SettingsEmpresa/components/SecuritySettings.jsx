import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import apiClient from '../../../../services/apiClient';
import { useAuth } from '../../../../context/AuthContext';
import { X } from 'lucide-react';

const SecuritySettings = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [status, setStatus] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);
  
  // 2-step verification state
  const [showModal, setShowModal] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');

  const handleRequestChange = async (e) => {
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
      const response = await apiClient.post(`/perfiles-empresario/perfil/${user?.id || user?.id_usuario}/request-password-change`, {
        currentPassword
      });

      if (response.data.success) {
        setStatus({ type: 'success', message: 'Código enviado a tu correo' });
        setShowModal(true);
      } else {
        setStatus({ type: 'error', message: response.data.message || t('securitySettings.error', 'Ocurrió un error') });
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || t('securitySettings.error', 'Ocurrió un error al solicitar el cambio');
      setStatus({ type: 'error', message: errorMsg });
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmChange = async (e) => {
    e.preventDefault();
    if (!verificationCode) {
      setStatus({ type: 'error', message: 'El código es requerido' });
      return;
    }

    setLoading(true);
    setStatus({ type: '', message: '' });

    try {
      const response = await apiClient.post(`/perfiles-empresario/perfil/${user?.id || user?.id_usuario}/confirm-password-change`, {
        currentPassword,
        newPassword,
        code: verificationCode
      });

      if (response.data.success) {
        setStatus({ type: 'success', message: t('securitySettings.success', 'Contraseña actualizada con éxito') });
        setCurrentPassword('');
        setNewPassword('');
        setVerificationCode('');
        setShowModal(false);
      } else {
        setStatus({ type: 'error', message: response.data.message || t('securitySettings.error', 'Ocurrió un error') });
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || t('securitySettings.error', 'Ocurrió un error al actualizar la contraseña');
      setStatus({ type: 'error', message: errorMsg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <section className="se-card hard-edge-shadow" style={{ marginTop: 'var(--spacing-xl)', backgroundColor: 'var(--color-surface-container-lowest)' }}>
        <h3 className="se-headline-md se-section-title" style={{ margin: '0 0 var(--spacing-md) 0' }}>
          {t('securitySettings.title', 'Seguridad')}
        </h3>
        
        <form onSubmit={handleRequestChange} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
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

          {status.message && !showModal && (
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

      {/* Modal para ingresar código */}
      {showModal && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div className="se-card hard-edge-shadow" style={{ 
            backgroundColor: 'var(--color-surface-container-lowest)',
            padding: 'var(--spacing-lg)',
            width: '90%',
            maxWidth: '400px',
            position: 'relative'
          }}>
            <button 
              onClick={() => setShowModal(false)}
              style={{
                position: 'absolute',
                top: 'var(--spacing-md)',
                right: 'var(--spacing-md)',
                background: 'none',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              <X size={20} color="var(--color-on-surface)" />
            </button>

            <h3 className="se-headline-sm" style={{ marginTop: 0, marginBottom: 'var(--spacing-sm)' }}>Verificar código</h3>
            <p className="se-body-md" style={{ marginBottom: 'var(--spacing-md)', color: 'var(--color-on-surface-variant)' }}>
              Hemos enviado un código de confirmación a tu correo. Por favor, ingrésalo para continuar.
            </p>

            <form onSubmit={handleConfirmChange} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
              <div className="se-input-group">
                <input
                  type="text"
                  className="se-input se-body-md"
                  placeholder="Código de 6 dígitos"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  disabled={loading}
                  maxLength={6}
                />
              </div>

              {status.message && (
                <p style={{ margin: 0, color: status.type === 'error' ? 'var(--color-vibrant-pink)' : 'var(--color-vibrant-teal)', fontSize: 'var(--text-label-sm)' }}>
                  {status.message}
                </p>
              )}

              <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: 'var(--spacing-sm)' }}>
                <button 
                  type="submit" 
                  className="se-save-btn se-label-bold hard-edge-shadow" 
                  disabled={loading}
                >
                  {loading ? 'Verificando...' : 'Confirmar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default SecuritySettings;
