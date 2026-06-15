import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Briefcase, SearchX } from 'lucide-react';
import { egresadoDashboardService } from '../../../../../services/egresadoDashboardService';
import { useDashboardEgresadoRequest } from '../../hooks/useDashboardEgresadoRequest';
import { formatearPostulacion } from '../../utils/dashboardEgresadoFormatters';

export default function Postulaciones() {
  const navigate = useNavigate();
  const { data, loading, error } = useDashboardEgresadoRequest(
    () => egresadoDashboardService.obtenerPostulaciones(),
    [],
    []
  );

  const postulaciones = useMemo(() => (data || []).map(formatearPostulacion), [data]);

  return (
    <>
      <div className="de-page-heading">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button className="de-project-icon-button" type="button" onClick={() => navigate('/egresado/dashboard')}>
            <ArrowLeft size={18} />
          </button>
          <h1>Mis Postulaciones</h1>
        </div>
        <span className="conteoProyectos">{postulaciones.length} postulaciones</span>
      </div>

      {loading && <p className="de-data-state">Cargando postulaciones...</p>}
      {error && <p className="de-data-state error">{error}</p>}

      {!loading && !error && postulaciones.length === 0 && (
        <div className="estadoVacio" style={{ padding: '3rem', textAlign: 'center' }}>
          <SearchX size={48} />
          <h4>Sin postulaciones</h4>
          <p>Aún no te has postulado a ningún proyecto. ¡Explora y encuentra tu próximo desafío!</p>
        </div>
      )}

      {!loading && !error && postulaciones.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {postulaciones.map((p) => (
            <div key={p.id} className="de-panel" style={{ cursor: 'default' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                <div className="de-offer-icon-wrap"><Briefcase size={20} /></div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                    <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700 }}>{p.titulo}</h3>
                    <span className={`de-badge ${p.tipoEstado}`}>{p.estado}</span>
                  </div>
                  {p.descripcion && (
                    <p style={{ margin: '0.25rem 0', fontSize: '0.85rem', color: 'var(--ink-muted)', lineHeight: 1.5 }}>
                      {p.descripcion}
                    </p>
                  )}
                  {p.tecnologias.length > 0 && (
                    <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
                      {p.tecnologias.map((tech) => (
                        <span key={tech} className="etiquetaTecnologia" style={{ fontSize: '0.72rem' }}>{tech}</span>
                      ))}
                    </div>
                  )}
                  <p style={{ margin: '0.5rem 0 0', fontSize: '0.78rem', color: 'var(--ink-subtle)' }}>
                    {p.fecha} {p.presupuesto ? `· Presupuesto: $${p.presupuesto}` : ''}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
