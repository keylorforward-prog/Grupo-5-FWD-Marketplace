import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MessageSquare, SearchX } from 'lucide-react';
import { egresadoDashboardService } from '../../../../../services/egresadoDashboardService';
import { useDashboardEgresadoRequest } from '../../hooks/useDashboardEgresadoRequest';
import { formatearMensaje } from '../../utils/dashboardEgresadoFormatters';

export default function Mensajes() {
  const navigate = useNavigate();
  const { data, loading, error } = useDashboardEgresadoRequest(
    () => egresadoDashboardService.obtenerMensajesRecientes(),
    [],
    []
  );

  const mensajes = useMemo(() => (data || []).map(formatearMensaje), [data]);

  return (
    <>
      <div className="de-page-heading">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button className="de-project-icon-button" type="button" onClick={() => navigate('/egresado/dashboard')}>
            <ArrowLeft size={18} />
          </button>
          <h1>Mensajes</h1>
        </div>
      </div>

      {loading && <p className="de-data-state">Cargando mensajes...</p>}
      {error && <p className="de-data-state error">{error}</p>}

      {!loading && !error && mensajes.length === 0 && (
        <div className="estadoVacio" style={{ padding: '3rem', textAlign: 'center' }}>
          <SearchX size={48} />
          <h4>Sin mensajes</h4>
          <p>Cuando tengas conversaciones con empresas, aparecerán aquí.</p>
        </div>
      )}

      {!loading && !error && mensajes.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
          {mensajes.map((m) => (
            <div key={m.id} className="de-message-item" style={{ padding: '1rem 0' }}>
              <div className="de-offer-icon-wrap"><MessageSquare size={16} /></div>
              <div className="de-message-content">
                <p className="de-message-name">{m.proyecto}</p>
                <p className="de-message-preview">{m.ultimoMensaje}</p>
              </div>
              <div className="de-message-right">
                <span className="de-message-time">{m.tiempo}</span>
                {!m.leido && <span className="de-message-unread" />}
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
