import { dashboardEmpresarioService } from '../../../../../services/dashboardEmpresarioService';
import DashboardLayout from '../../components/DashboardLayout';
import EstadoDatos from '../../components/EstadoDatos';
import { useDashboardEmpresarioRequest } from '../../hooks/useDashboardEmpresarioRequest';
import { formatearMensaje } from '../../utils/dashboardEmpresarioFormatters';

export default function Mensajes() {
  const { data, loading, error } = useDashboardEmpresarioRequest(
    () => dashboardEmpresarioService.obtenerMensajesRecientes(),
    [],
    []
  );
  const mensajes = data.map(formatearMensaje);

  return (
    <DashboardLayout activePage="mensajes">
      <div className="de-page-heading">
        <h1>Mensajes</h1>
      </div>
      <div className="de-panel">
        <EstadoDatos loading={loading} error={error} empty={!mensajes.length} emptyText="No hay mensajes recientes." />
        {!loading && !error && mensajes.map((message) => (
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
