import { Mail, MessageSquare } from 'lucide-react';

const Notifications = () => {
  return (
    <div id="notificaciones" className="form-card">
      <div className="form-header">
        <h2 className="form-title">Notificaciones</h2>
      </div>

      <div className="notification-item">
        <div className="notification-info">
          <div className="notification-icon">
            <Mail size={18} />
          </div>
          <div className="notification-text">
            <h4>Alertas de Postulación</h4>
            <p>Recibe un correo cuando una empresa vea tu perfil.</p>
          </div>
        </div>
        <label className="switch">
          <input type="checkbox" defaultChecked />
          <span className="slider"></span>
        </label>
      </div>

      <div className="notification-item">
        <div className="notification-info">
          <div className="notification-icon" style={{ backgroundColor: '#ffedd5', color: '#ea580c' }}>
            <MessageSquare size={18} />
          </div>
          <div className="notification-text">
            <h4>Nuevos Mensajes</h4>
            <p>Notificaciones push para mensajes directos de recruiters.</p>
          </div>
        </div>
        <label className="switch">
          <input type="checkbox" defaultChecked />
          <span className="slider"></span>
        </label>
      </div>
    </div>
  );
};

export default Notifications;
