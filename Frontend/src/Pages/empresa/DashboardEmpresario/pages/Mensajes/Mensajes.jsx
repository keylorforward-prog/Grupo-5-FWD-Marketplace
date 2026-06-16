import DashboardLayout from '../../components/DashboardLayout';
import { mockMessages } from '../../data/dashboardData';

export default function Mensajes() {
  return (
    <DashboardLayout activePage="mensajes">
      <div className="de-page-heading">
        <h1>Mensajes</h1>
      </div>
      <div className="de-panel">
        {mockMessages.map((message) => (
          <div key={message.id} className="de-message-item">
            <img src={message.avatar} alt={message.name} className="de-message-avatar" />
            <div className="de-message-content">
              <p className="de-message-name">{message.name}</p>
              <p className="de-message-preview">{message.preview}</p>
            </div>
            <div className="de-message-right">
              <span className="de-message-time">{message.time}</span>
              {message.unread && <span className="de-message-unread" />}
            </div>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}
