import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ExternalLink, GitBranch, BookOpen, Calendar, User, Link as LinkIcon, Code, Clock, SearchX, Layers } from 'lucide-react';
import { egresadoDashboardService } from '../../../../../services/egresadoDashboardService';
import { useDashboardEgresadoRequest } from '../../hooks/useDashboardEgresadoRequest';
import { formatearHistorial } from '../../utils/dashboardEgresadoFormatters';

const TIPO_CONFIG = {
  GITHUB: { icon: GitBranch, label: 'GitHub', color: '#0969da', bg: '#e8f0fe' },
  PLATAFORMA: { icon: BookOpen, label: 'Plataforma', color: '#7c3aed', bg: '#f3e8ff' },
};

export default function Historial() {
  const navigate = useNavigate();
  const { data, loading, error } = useDashboardEgresadoRequest(
    () => egresadoDashboardService.obtenerHistorial(),
    [],
    []
  );

  const historiales = useMemo(() => (data || []).map(formatearHistorial), [data]);

  const stats = useMemo(() => {
    const total = historiales.length;
    const github = historiales.filter((h) => h.tipo === 'GITHUB').length;
    const plataforma = historiales.filter((h) => h.tipo === 'PLATAFORMA').length;
    return { total, github, plataforma };
  }, [historiales]);

  return (
    <>
      <div className="de-page-heading">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button className="de-project-icon-button" type="button" onClick={() => navigate('/egresado/dashboard')}>
            <ArrowLeft size={18} />
          </button>
          <h1>Historial de Proyectos</h1>
        </div>
        {!loading && !error && (
          <span className="conteoProyectos">{historiales.length} registro{historiales.length !== 1 ? 's' : ''}</span>
        )}
      </div>

      {!loading && !error && historiales.length > 0 && (
        <div className="historial-stats">
          <div className="historial-stat-card" data-type="total">
            <Layers size={22} />
            <div>
              <span className="historial-stat-value">{stats.total}</span>
              <span className="historial-stat-label">Total proyectos</span>
            </div>
          </div>
          <div className="historial-stat-card" data-type="github">
            <GitBranch size={22} />
            <div>
              <span className="historial-stat-value">{stats.github}</span>
              <span className="historial-stat-label">GitHub</span>
            </div>
          </div>
          <div className="historial-stat-card" data-type="plataforma">
            <BookOpen size={22} />
            <div>
              <span className="historial-stat-value">{stats.plataforma}</span>
              <span className="historial-stat-label">Plataforma</span>
            </div>
          </div>
        </div>
      )}

      {loading && (
        <div className="historial-loading">
          {[1, 2, 3].map((i) => (
            <div key={i} className="historial-skeleton" />
          ))}
        </div>
      )}

      {error && <p className="de-data-state error">{error}</p>}

      {!loading && !error && historiales.length === 0 && (
        <div className="estadoVacio" style={{ padding: '3rem', textAlign: 'center' }}>
          <SearchX size={48} />
          <h4>Sin historial</h4>
          <p>Tus proyectos completados aparecerán aquí.</p>
        </div>
      )}

      {!loading && !error && historiales.length > 0 && (
        <div className="historial-timeline">
          {historiales.map((h, idx) => {
            const tipoCfg = TIPO_CONFIG[h.tipo] || TIPO_CONFIG.PLATAFORMA;
            const TipoIcon = tipoCfg.icon;
            return (
              <div key={h.id} className="historial-card" style={{ '--accent-color': tipoCfg.color, '--accent-bg': tipoCfg.bg }}>
                <div className="historial-card-dot" style={{ backgroundColor: tipoCfg.color }}>
                  <TipoIcon size={14} color="#fff" />
                </div>
                <div className="historial-card-body">
                  <div className="historial-card-header">
                    <h3 className="historial-card-title">{h.titulo}</h3>
                    <span className="historial-card-badge" style={{ backgroundColor: tipoCfg.bg, color: tipoCfg.color }}>
                      <TipoIcon size={12} />
                      {tipoCfg.label}
                    </span>
                  </div>

                  {h.descripcion && (
                    <p className="historial-card-desc">{h.descripcion}</p>
                  )}

                  <div className="historial-card-meta">
                    {h.rol && (
                      <span className="historial-card-meta-item">
                        <User size={13} />
                        {h.rol}
                      </span>
                    )}
                    <span className="historial-card-meta-item">
                      <Calendar size={13} />
                      {h.fechaInicio} → {h.fechaFin}
                    </span>
                  </div>

                  {h.tecnologias.length > 0 && (
                    <div className="historial-card-techs">
                      <Code size={13} />
                      {h.tecnologias.map((tech) => (
                        <span key={tech} className="historial-tech-tag">{tech}</span>
                      ))}
                    </div>
                  )}

                  {h.enlace && (
                    <a
                      href={h.enlace}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="historial-card-link"
                    >
                      <LinkIcon size={13} />
                      Ver repositorio
                      <ExternalLink size={12} />
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
