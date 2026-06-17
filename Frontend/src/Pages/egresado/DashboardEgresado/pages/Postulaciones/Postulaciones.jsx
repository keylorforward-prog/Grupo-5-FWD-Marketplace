import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Briefcase, Calendar, DollarSign, SearchX, Clock } from 'lucide-react';
import { egresadoDashboardService } from '../../../../../services/egresadoDashboardService';
import { useDashboardEgresadoRequest } from '../../hooks/useDashboardEgresadoRequest';
import { formatearPostulacion } from '../../utils/dashboardEgresadoFormatters';

const acentos = ['azul', 'aqua', 'naranja', 'morado', 'magenta', 'amarillo'];

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
        <div className="post-headingLeft">
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
        <div className="post-empty">
          <SearchX size={48} />
          <h4>Sin postulaciones</h4>
          <p>Aún no te has postulado a ningún proyecto. ¡Explora y encuentra tu próximo desafío!</p>
          <button className="post-emptyBtn" type="button" onClick={() => navigate('/egresado/dashboard/explorar')}>
            Explorar proyectos
          </button>
        </div>
      )}

      {!loading && !error && postulaciones.length > 0 && (
        <div className="post-list">
          {postulaciones.map((p, i) => (
            <div key={p.id} className={`post-card acento-${acentos[i % acentos.length]}`}>
              <div className="post-cardBody">
                <div className="post-iconWrap">
                  <Briefcase size={20} />
                </div>
                <div className="post-content">
                  <div className="post-header">
                    <h3 className="post-title">{p.titulo}</h3>
                    <span className={`de-badge ${p.tipoEstado}`}>{p.estado}</span>
                  </div>
                  {p.descripcion && (
                    <p className="post-desc">{p.descripcion}</p>
                  )}
                  {p.tecnologias.length > 0 && (
                    <div className="post-techs">
                      {p.tecnologias.map((tech) => (
                        <span key={tech} className="etiquetaTecnologia">{tech}</span>
                      ))}
                    </div>
                  )}
                  <div className="post-meta">
                    <span className="post-metaItem">
                      <Calendar size={13} />
                      {p.fecha}
                    </span>
                    {p.presupuesto && (
                      <span className="post-metaItem">
                        <DollarSign size={13} />
                        ${Number(p.presupuesto).toLocaleString('en-US')}
                      </span>
                    )}
                    {p.mensaje && (
                      <span className="post-metaItem post-mensaje" title={p.mensaje}>
                        <Clock size={13} />
                        Con mensaje
                      </span>
                    )}
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
