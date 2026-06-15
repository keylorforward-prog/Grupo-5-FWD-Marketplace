import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ExternalLink, History as HistoryIcon, SearchX } from 'lucide-react';
import { egresadoDashboardService } from '../../../../../services/egresadoDashboardService';
import { useDashboardEgresadoRequest } from '../../hooks/useDashboardEgresadoRequest';
import { formatearHistorial } from '../../utils/dashboardEgresadoFormatters';

export default function Historial() {
  const navigate = useNavigate();
  const { data, loading, error } = useDashboardEgresadoRequest(
    () => egresadoDashboardService.obtenerHistorial(),
    [],
    []
  );

  const historiales = useMemo(() => (data || []).map(formatearHistorial), [data]);

  return (
    <>
      <div className="de-page-heading">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button className="de-project-icon-button" type="button" onClick={() => navigate('/egresado/dashboard')}>
            <ArrowLeft size={18} />
          </button>
          <h1>Historial de Proyectos</h1>
        </div>
        <span className="conteoProyectos">{historiales.length} registros</span>
      </div>

      {loading && <p className="de-data-state">Cargando historial...</p>}
      {error && <p className="de-data-state error">{error}</p>}

      {!loading && !error && historiales.length === 0 && (
        <div className="estadoVacio" style={{ padding: '3rem', textAlign: 'center' }}>
          <SearchX size={48} />
          <h4>Sin historial</h4>
          <p>Tus proyectos completados aparecerán aquí.</p>
        </div>
      )}

      {!loading && !error && historiales.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {historiales.map((h) => (
            <div key={h.id} className="de-panel" style={{ cursor: 'default' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                <div className="de-offer-icon-wrap"><HistoryIcon size={20} /></div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                    <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700 }}>{h.titulo}</h3>
                    <span className={`de-badge ${h.tipo === 'GITHUB' ? 'recepcion' : 'finalizado'}`}>{h.tipo}</span>
                  </div>
                  {h.descripcion && (
                    <p style={{ margin: '0.25rem 0', fontSize: '0.85rem', color: 'var(--ink-muted)' }}>{h.descripcion}</p>
                  )}
                  <div style={{ display: 'flex', gap: '1.5rem', marginTop: '0.5rem', fontSize: '0.78rem', color: 'var(--ink-subtle)' }}>
                    {h.rol && <span>Rol: {h.rol}</span>}
                    <span>{h.fechaInicio} → {h.fechaFin}</span>
                  </div>
                  {h.tecnologias.length > 0 && (
                    <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
                      {h.tecnologias.map((tech) => (
                        <span key={tech} className="etiquetaTecnologia" style={{ fontSize: '0.72rem' }}>{tech}</span>
                      ))}
                    </div>
                  )}
                  {h.enlace && (
                    <a
                      href={h.enlace}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', marginTop: '0.5rem', fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 600, textDecoration: 'none' }}
                    >
                      <ExternalLink size={14} /> Ver proyecto
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
