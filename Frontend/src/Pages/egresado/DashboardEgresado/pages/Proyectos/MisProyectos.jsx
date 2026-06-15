import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, FolderOpen, Package, SearchX } from 'lucide-react';
import { egresadoDashboardService } from '../../../../../services/egresadoDashboardService';
import { useDashboardEgresadoRequest } from '../../hooks/useDashboardEgresadoRequest';
import { formatearProyecto } from '../../utils/dashboardEgresadoFormatters';

export default function MisProyectos() {
  const navigate = useNavigate();
  const { data, loading, error } = useDashboardEgresadoRequest(
    () => egresadoDashboardService.obtenerProyectos(),
    [],
    []
  );

  const proyectos = useMemo(() => (data || []).map(formatearProyecto), [data]);

  return (
    <>
      <div className="de-page-heading">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button className="de-project-icon-button" type="button" onClick={() => navigate('/egresado/dashboard')}>
            <ArrowLeft size={18} />
          </button>
          <h1>Mis Proyectos</h1>
        </div>
        <span className="conteoProyectos">{proyectos.length} proyectos</span>
      </div>

      {loading && <p className="de-data-state">Cargando proyectos...</p>}
      {error && <p className="de-data-state error">{error}</p>}

      {!loading && !error && proyectos.length === 0 && (
        <div className="estadoVacio" style={{ padding: '3rem', textAlign: 'center' }}>
          <SearchX size={48} />
          <h4>Sin proyectos activos</h4>
          <p>Cuando una empresa te contrate, tus proyectos aparecerán aquí.</p>
        </div>
      )}

      {!loading && !error && proyectos.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {proyectos.map((p) => (
            <div key={p.id} className="de-panel" style={{ cursor: 'default' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                <div className="de-offer-icon-wrap"><FolderOpen size={20} /></div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                    <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700 }}>{p.titulo}</h3>
                    <span className={`de-badge ${p.tipoEstado}`}>{p.estado}</span>
                  </div>
                  <p style={{ margin: '0.25rem 0', fontSize: '0.85rem', color: 'var(--ink-muted)', lineHeight: 1.5 }}>
                    {p.descripcion}
                  </p>
                  <div style={{ display: 'flex', gap: '1.5rem', marginTop: '0.5rem', fontSize: '0.78rem', color: 'var(--ink-subtle)' }}>
                    <span><Package size={12} style={{ marginRight: '0.25rem' }} /> Entregables: {p.entregablesAprobados}/{p.entregablesCount}</span>
                    <span>Inicio: {p.fechaInicio}</span>
                    <span>Fin estimado: {p.fechaFin}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
