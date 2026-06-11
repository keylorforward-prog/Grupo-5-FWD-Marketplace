import React from 'react';

const NotificationPreferences = () => {
  return (
    <section className="se-card se-card-purple hard-edge-shadow" style={{ height: '100%' }}>
      <h3 className="se-headline-md se-section-title">
        <span className="material-symbols-outlined" style={{ color: 'var(--color-vibrant-purple)' }}>settings_suggest</span>
        Preferencias de Notificación
      </h3>

      <div>
        {/* Toggle 1 - Purple */}
        <div className="se-toggle-item se-toggle-purple">
          <div className="se-toggle-text">
            <span className="se-label-bold" style={{ color: 'var(--color-on-surface)' }}>New Applications</span>
            <span className="se-label-sm" style={{ color: 'var(--color-on-surface-variant)' }}>Get notified when someone applies</span>
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
            <span className="se-label-bold" style={{ color: 'var(--color-on-surface)' }}>Weekly Summary</span>
            <span className="se-label-sm" style={{ color: 'var(--color-on-surface-variant)' }}>A recap of your recruitment activity</span>
          </div>
          <label className="se-toggle-label">
            <input type="checkbox" className="se-toggle-input" defaultChecked />
            <div className="se-toggle-track teal">
              <div className="se-toggle-thumb"></div>
            </div>
          </label>
        </div>

        {/* Toggle 3 - Pink */}
        <div className="se-toggle-item se-toggle-pink">
          <div className="se-toggle-text">
            <span className="se-label-bold" style={{ color: 'var(--color-on-surface)' }}>Plan Alerts</span>
            <span className="se-label-sm" style={{ color: 'var(--color-on-surface-variant)' }}>Quota and billing cycle updates</span>
          </div>
          <label className="se-toggle-label">
            <input type="checkbox" className="se-toggle-input" defaultChecked />
            <div className="se-toggle-track pink">
              <div className="se-toggle-thumb"></div>
            </div>
          </label>
        </div>
      </div>
    </section>
  );
};

export default NotificationPreferences;
