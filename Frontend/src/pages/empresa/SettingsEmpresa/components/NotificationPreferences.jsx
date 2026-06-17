import { useTranslation } from 'react-i18next';

const NotificationPreferences = () => {
  const { t } = useTranslation();
  return (
    <section className="se-card se-card-purple hard-edge-shadow" style={{ height: '100%' }}>
      <h3 className="se-headline-md se-section-title">
        <span className="material-symbols-outlined" style={{ color: 'var(--color-vibrant-purple)' }}>settings_suggest</span>
        {t('notificationPreferences.title')}
      </h3>

      <div>
        {/* Toggle 1 - Purple */}
        <div className="se-toggle-item se-toggle-purple">
          <div className="se-toggle-text">
            <span className="se-label-bold" style={{ color: 'var(--color-on-surface)' }}>{t('notificationPreferences.newApplications')}</span>
            <span className="se-label-sm" style={{ color: 'var(--color-on-surface-variant)' }}>{t('notificationPreferences.newApplicationsDesc')}</span>
          </div>
          <label className="se-toggle-label">
            <input type="checkbox" className="se-toggle-input" defaultChecked />
            <div className="se-toggle-track purple">
              <div className="se-toggle-thumb"></div>
            </div>
          </label>
        </div>

        {/* Toggle 2 - Teal */}
        <div className="se-toggle-item se-toggle-teal">
          <div className="se-toggle-text">
            <span className="se-label-bold" style={{ color: 'var(--color-on-surface)' }}>{t('notificationPreferences.weeklySummary')}</span>
            <span className="se-label-sm" style={{ color: 'var(--color-on-surface-variant)' }}>{t('notificationPreferences.weeklySummaryDesc')}</span>
          </div>
          <label className="se-toggle-label">
            <input type="checkbox" className="se-toggle-input" defaultChecked />
            <div className="se-toggle-track teal">
              <div className="se-toggle-thumb"></div>
            </div>
          </label>
        </div>

        {/* Toggle 3 - Blue (Mensajes al DM) */}
        <div className="se-toggle-item se-toggle-blue">
          <div className="se-toggle-text">
            <span className="se-label-bold" style={{ color: 'var(--color-on-surface)' }}>{t('notificationPreferences.directMessages')}</span>
            <span className="se-label-sm" style={{ color: 'var(--color-on-surface-variant)' }}>{t('notificationPreferences.directMessagesDesc')}</span>
          </div>
          <label className="se-toggle-label">
            <input type="checkbox" className="se-toggle-input" defaultChecked />
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
