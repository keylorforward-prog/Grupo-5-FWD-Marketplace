import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const STORAGE_KEY = 'empresa_notif_prefs';

const NotificationPreferences = () => {
  const { t } = useTranslation();
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

  return (
    <section className="se-card se-card-purple hard-edge-shadow" style={{ height: '100%' }}>
      <h3 className="se-headline-md se-section-title">
        <span className="material-symbols-outlined" style={{ color: 'var(--color-vibrant-purple)' }}>settings_suggest</span>
        {t('notificationPreferences.title')}
      </h3>

      <div>
        <div className="se-toggle-item se-toggle-purple">
          <div className="se-toggle-text">
            <span className="se-label-bold" style={{ color: 'var(--color-on-surface)' }}>{t('notificationPreferences.newApplications')}</span>
            <span className="se-label-sm" style={{ color: 'var(--color-on-surface-variant)' }}>{t('notificationPreferences.newApplicationsDesc')}</span>
          </div>
          <label className="se-toggle-label">
            <input type="checkbox" className="se-toggle-input" checked={prefs.newApplications} onChange={() => toggle('newApplications')} />
            <div className="se-toggle-track purple">
              <div className="se-toggle-thumb"></div>
            </div>
          </label>
        </div>

        <div className="se-toggle-item se-toggle-teal">
          <div className="se-toggle-text">
            <span className="se-label-bold" style={{ color: 'var(--color-on-surface)' }}>{t('notificationPreferences.weeklySummary')}</span>
            <span className="se-label-sm" style={{ color: 'var(--color-on-surface-variant)' }}>{t('notificationPreferences.weeklySummaryDesc')}</span>
          </div>
          <label className="se-toggle-label">
            <input type="checkbox" className="se-toggle-input" checked={prefs.weeklySummary} onChange={() => toggle('weeklySummary')} />
            <div className="se-toggle-track teal">
              <div className="se-toggle-thumb"></div>
            </div>
          </label>
        </div>

        <div className="se-toggle-item se-toggle-blue">
          <div className="se-toggle-text">
            <span className="se-label-bold" style={{ color: 'var(--color-on-surface)' }}>{t('notificationPreferences.directMessages')}</span>
            <span className="se-label-sm" style={{ color: 'var(--color-on-surface-variant)' }}>{t('notificationPreferences.directMessagesDesc')}</span>
          </div>
          <label className="se-toggle-label">
            <input type="checkbox" className="se-toggle-input" checked={prefs.directMessages} onChange={() => toggle('directMessages')} />
            <div className="se-toggle-track blue">
              <div className="se-toggle-thumb"></div>
            </div>
          </label>
        </div>
      </div>
    </section>
  );
};

export default NotificationPreferences;
