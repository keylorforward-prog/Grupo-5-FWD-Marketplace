import { useMemo } from 'react';
import { useNotificaciones } from '../../../../../hooks/useNotificaciones';
import EstadoDatos from '../../components/EstadoDatos';
import { formatearNotificacion } from '../../utils/dashboardEmpresarioFormatters';

export default function Notificaciones() {
  const { notificaciones: data, loading, error } = useNotificaciones({ marcarAlCargar: true, limit: 50 });
  const notificaciones = useMemo(() => data.map(formatearNotificacion), [data]);

  return (
    <>
      <div className="de-page-heading">
        <h1>Notificaciones</h1>
      </div>
      <div className="de-panel">
        <EstadoDatos loading={loading} error={error} empty={!notificaciones.length} emptyText="No hay notificaciones." />
        {!loading && notificaciones.map((notification) => (
          <div key={notification.id} className="de-notif-item">
            <div className={`de-notif-icon ${notification.iconType}`}>{notification.icon}</div>
            <div className="de-notif-text">
              <p className="de-notif-desc">{notification.text}</p>
              <p className="de-notif-ago">{notification.time}</p>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
