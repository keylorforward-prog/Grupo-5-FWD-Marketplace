import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Bell, CheckCircle2, SearchX } from 'lucide-react';
import { egresadoDashboardService } from '../../../../../services/egresadoDashboardService';
import { useDashboardEgresadoRequest } from '../../hooks/useDashboardEgresadoRequest';
import { formatearNotificacion } from '../../utils/dashboardEgresadoFormatters';

export default function Notificaciones() {
  const navigate = useNavigate();
  const { data, loading, error } = useDashboardEgresadoRequest(
    () => egresadoDashboardService.obtenerNotificaciones(),
    [],
    []
  );

  const notificaciones = useMemo(() => (data || []).map(formatearNotificacion), [data]);

  return (
    <>
      <div className="de-page-heading">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button className="de-project-icon-button" type="button" onClick={() => navigate('/egresado/dashboard')}>
            <ArrowLeft size={18} />
          </button>
          <h1>Notificaciones</h1>
        </div>
      </div>

      {loading && <p className="de-data-state">Cargando notificaciones...</p>}
      {error && <p className="de-data-state error">{error}</p>}

      {!loading && !error && notificaciones.length === 0 && (
        <div className="estadoVacio" style={{ padding: '3rem', textAlign: 'center' }}>
          <SearchX size={48} />
          <h4>Sin notificaciones</h4>
          <p>No tienes notificaciones nuevas.</p>
        </div>
      )}

      {!loading && !error && notificaciones.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
          {notificaciones.map((n) => (
            <div key={n.id} className="de-notif-item" style={{ padding: '1rem 0' }}>
              <div className={`de-notif-icon ${n.tipoIcono}`}>
                {n.leido ? <CheckCircle2 size={14} /> : <Bell size={14} />}
              </div>
              <div className="de-notif-text">
                <p className={`de-notif-desc ${!n.leido ? '' : ''}`} style={!n.leido ? { fontWeight: 600 } : {}}>
                  {n.texto}
                </p>
                <p className="de-notif-ago">{n.tiempo}</p>
              </div>
              {!n.leido && (
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--destructive, #ef4444)', flexShrink: 0 }} />
              )}
            </div>
          ))}
        </div>
      )}
    </>
  );
}
