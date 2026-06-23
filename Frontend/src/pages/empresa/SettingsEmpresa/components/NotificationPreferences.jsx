<<<<<<< HEAD
import { useState, useEffect } from 'react';
=======
import React, { useState, useEffect } from 'react';
>>>>>>> origin/dev
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../../../context/AuthContext';
import apiClient from '../../../../services/apiClient';

const STORAGE_KEY = 'empresa_notif_prefs';

const NotificationPreferences = () => {
  const { t } = useTranslation();
<<<<<<< HEAD
  const [prefs, setPrefs] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : { newApplications: true, weeklySummary: true, directMessages: true };
    } catch {
      return { newApplications: true, weeklySummary: true, directMessages: true };
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
  }, [prefs]);

  const toggle = (key) => {
    setPrefs((prev) => ({ ...prev, [key]: !prev[key] }));
  };

=======
  const { user } = useAuth();
  
  const [preferences, setPreferences] = useState({
    notif_postulaciones: true,
    notif_resumen_semanal: true,
    notif_mensajes_directos: true
  });
  
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPreferences = async () => {
      if (!user) return;
      const userId = user?.id || user?.id_usuario;
      try {
        const response = await apiClient.get(`/perfiles-empresario/perfil/${userId}`);
        if (response.data.success && response.data.data) {
          setPreferences({
            notif_postulaciones: response.data.data.notif_postulaciones ?? true,
            notif_resumen_semanal: response.data.data.notif_resumen_semanal ?? true,
            notif_mensajes_directos: response.data.data.notif_mensajes_directos ?? true
          });
        }
      } catch (error) {
        console.error("Error fetching notification preferences:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPreferences();
  }, [user]);

  const handleToggle = async (key) => {
    const newValue = !preferences[key];
    setPreferences(prev => ({ ...prev, [key]: newValue }));

    const userId = user?.id || user?.id_usuario;
    if (!userId) return;

    try {
      await apiClient.put(`/perfiles-empresario/perfil/${userId}`, {
        [key]: newValue
      });
    } catch (error) {
      console.error("Error updating preference:", error);
      // Revert if failed
      setPreferences(prev => ({ ...prev, [key]: !newValue }));
    }
  };

  if (loading) return null;

>>>>>>> origin/dev
  return (
    <section className="se-card se-card-purple hard-edge-shadow" style={{ height: '100%' }}>
      <h3 className="se-headline-md se-section-title">
        <span className="material-symbols-outlined" style={{ color: 'var(--color-vibrant-purple)' }}>settings_suggest</span>
        {t('notificationPreferences.title')}
      </h3>

      <div>
<<<<<<< HEAD
=======
        {/* Toggle 1 - Nuevas Postulaciones */}
>>>>>>> origin/dev
        <div className="se-toggle-item se-toggle-purple">
          <div className="se-toggle-text">
            <span className="se-label-bold" style={{ color: 'var(--color-on-surface)' }}>{t('notificationPreferences.newApplications')}</span>
            <span className="se-label-sm" style={{ color: 'var(--color-on-surface-variant)' }}>{t('notificationPreferences.newApplicationsDesc')}</span>
          </div>
          <label className="se-toggle-label">
<<<<<<< HEAD
            <input type="checkbox" className="se-toggle-input" checked={prefs.newApplications} onChange={() => toggle('newApplications')} />
=======
            <input 
              type="checkbox" 
              className="se-toggle-input" 
              checked={preferences.notif_postulaciones} 
              onChange={() => handleToggle('notif_postulaciones')}
            />
>>>>>>> origin/dev
            <div className="se-toggle-track purple">
              <div className="se-toggle-thumb"></div>
            </div>
          </label>
        </div>

<<<<<<< HEAD
=======
        {/* Toggle 2 - Resumen Semanal */}
        {/* NOTA: Actualmente guardamos esta preferencia en la base de datos (notif_resumen_semanal) 
            lista para cuando se implemente a futuro el sistema de correos semanales automatizados (cron jobs). */}
>>>>>>> origin/dev
        <div className="se-toggle-item se-toggle-teal">
          <div className="se-toggle-text">
            <span className="se-label-bold" style={{ color: 'var(--color-on-surface)' }}>{t('notificationPreferences.weeklySummary')}</span>
            <span className="se-label-sm" style={{ color: 'var(--color-on-surface-variant)' }}>{t('notificationPreferences.weeklySummaryDesc')}</span>
          </div>
          <label className="se-toggle-label">
<<<<<<< HEAD
            <input type="checkbox" className="se-toggle-input" checked={prefs.weeklySummary} onChange={() => toggle('weeklySummary')} />
=======
            <input 
              type="checkbox" 
              className="se-toggle-input" 
              checked={preferences.notif_resumen_semanal} 
              onChange={() => handleToggle('notif_resumen_semanal')}
            />
>>>>>>> origin/dev
            <div className="se-toggle-track teal">
              <div className="se-toggle-thumb"></div>
            </div>
          </label>
        </div>

<<<<<<< HEAD
=======
        {/* Toggle 3 - Mensajes Directos */}
>>>>>>> origin/dev
        <div className="se-toggle-item se-toggle-blue">
          <div className="se-toggle-text">
            <span className="se-label-bold" style={{ color: 'var(--color-on-surface)' }}>{t('notificationPreferences.directMessages')}</span>
            <span className="se-label-sm" style={{ color: 'var(--color-on-surface-variant)' }}>{t('notificationPreferences.directMessagesDesc')}</span>
          </div>
          <label className="se-toggle-label">
<<<<<<< HEAD
            <input type="checkbox" className="se-toggle-input" checked={prefs.directMessages} onChange={() => toggle('directMessages')} />
=======
            <input 
              type="checkbox" 
              className="se-toggle-input" 
              checked={preferences.notif_mensajes_directos} 
              onChange={() => handleToggle('notif_mensajes_directos')}
            />
>>>>>>> origin/dev
            <div className="se-toggle-track blue">
              <div className="se-toggle-thumb"></div>
            </div>
          </label>
        </div>
<<<<<<< HEAD
=======

>>>>>>> origin/dev
      </div>
    </section>
  );
};

export default NotificationPreferences;
