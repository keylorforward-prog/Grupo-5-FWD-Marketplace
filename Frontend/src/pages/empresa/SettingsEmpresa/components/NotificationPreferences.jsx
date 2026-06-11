import React, { useState } from 'react';
import { Settings } from 'lucide-react';

const NotificationPreferences = () => {
  const [notifications, setNotifications] = useState({
    newApplications: true,
    weeklySummary: true,
    planAlerts: true
  });

  const toggle = (key) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="form-card flex-1">
      <div className="form-header">
        <h2 className="form-title">
          <Settings size={20} className="text-[var(--color-secondary)]" />
          Preferencias de Notificación
        </h2>
      </div>

      <div className="notification-list">
        <div className="notification-item">
          <div className="notification-info">
            <h4>New Applications</h4>
            <p>Get notified when someone applies</p>
          </div>
          <label className="switch">
            <input type="checkbox" checked={notifications.newApplications} onChange={() => toggle('newApplications')} />
            <span className="slider purple"></span>
          </label>
        </div>

        <div className="notification-item">
          <div className="notification-info">
            <h4>Weekly Summary</h4>
            <p>A recap of your recruitment activity</p>
          </div>
          <label className="switch">
            <input type="checkbox" checked={notifications.weeklySummary} onChange={() => toggle('weeklySummary')} />
            <span className="slider cyan"></span>
          </label>
        </div>

        <div className="notification-item highlight">
          <div className="notification-info">
            <h4>Plan Alerts</h4>
            <p>Quota and billing cycle updates</p>
          </div>
          <label className="switch">
            <input type="checkbox" checked={notifications.planAlerts} onChange={() => toggle('planAlerts')} />
            <span className="slider pink"></span>
          </label>
        </div>
      </div>
    </div>
  );
};

export default NotificationPreferences;
