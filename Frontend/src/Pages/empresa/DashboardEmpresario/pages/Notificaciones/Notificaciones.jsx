import DashboardLayout from '../../components/DashboardLayout';
import { mockNotifications } from '../../data/dashboardData';

export default function Notificaciones() {
  return (
    <DashboardLayout activePage="notificaciones">
      <div className="de-page-heading">
        <h1>Notificaciones</h1>
      </div>
      <div className="de-panel">
        {mockNotifications.map((notification) => (
          <div key={notification.id} className="de-notif-item">
            <div className={`de-notif-icon ${notification.iconType}`}>{notification.icon}</div>
            <div className="de-notif-text">
              <p className="de-notif-desc">{notification.text}</p>
              <p className="de-notif-ago">{notification.time}</p>
            </div>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}
