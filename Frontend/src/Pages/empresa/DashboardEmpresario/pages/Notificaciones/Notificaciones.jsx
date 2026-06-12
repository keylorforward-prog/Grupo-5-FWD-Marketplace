import { dashboardEmpresarioService } from '../../../../../services/dashboardEmpresarioService';
import DashboardLayout from '../../components/DashboardLayout';
import EstadoDatos from '../../components/EstadoDatos';
import { useDashboardEmpresarioRequest } from '../../hooks/useDashboardEmpresarioRequest';
import { formatearNotificacion } from '../../utils/dashboardEmpresarioFormatters';

export default function Notificaciones() {
  const { data, loading, error } = useDashboardEmpresarioRequest(
    () => dashboardEmpresarioService.obtenerNotificaciones(),
    [],
    []
  );
  const notificaciones = data.map(formatearNotificacion);

  return (
    <DashboardLayout activePage="notificaciones">
      <div className="de-page-heading">
        <h1>Notificaciones</h1>
      </div>
      <div className="de-panel">
        <EstadoDatos loading={loading} error={error} empty={!notificaciones.length} emptyText="No hay notificaciones." />
        {!loading && !error && notificaciones.map((notification) => (
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
