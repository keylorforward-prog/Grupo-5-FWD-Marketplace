import { useMemo, Fragment } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Briefcase, Calendar, DollarSign, SearchX, Clock, Eye, Building2 } from 'lucide-react';
import { egresadoDashboardService } from '../../../../../services/egresadoDashboardService';
import { useDashboardEgresadoRequest } from '../../hooks/useDashboardEgresadoRequest';
import { formatearPostulacion } from '../../utils/dashboardEgresadoFormatters';

const acentos = ['azul', 'aqua', 'naranja', 'morado', 'magenta', 'amarillo'];

const TABS = [
  { key: 'proyectos', label: 'Proyectos', icon: Briefcase },
  { key: 'empleos', label: 'Empleos', icon: Building2 },
];

const ORDEN_FLUJO = [
  { key: 'ENVIADA', label: 'Enviada' },
  { key: 'PENDIENTE', label: 'Pendiente' },
  { key: 'EN_REVISION', label: 'En Revisión' },
  { key: 'PRESSELECCIONADA', label: 'Preseleccionada' },
  { key: 'FINAL', label: '' },
];

function FlujoPostulacion({ estadoRaw }) {
  const pasoActual = estadoRaw === 'ENVIADA' ? 0
    : estadoRaw === 'EN_REVISION' ? 2
    : estadoRaw === 'PRESSELECCIONADA' ? 3
    : (estadoRaw === 'CONTRATADO' || estadoRaw === 'RECHAZADA') ? 4
    : -1;
  const esRechazado = estadoRaw === 'RECHAZADA';
  const esAceptado = estadoRaw === 'CONTRATADO';

  return (
    <div className="post-flujo">
      {ORDEN_FLUJO.map((paso, i) => {
        const esUltimo = i === ORDEN_FLUJO.length - 1;
        const label = esUltimo
          ? (esRechazado ? 'Rechazada' : esAceptado ? 'Aceptada' : '—')
          : paso.label;
        const icono = esUltimo
          ? (esRechazado ? '✕' : esAceptado ? '✓' : (ORDEN_FLUJO.length).toString())
          : (i < pasoActual ? '✓' : (i + 1).toString());

        let claseBola = '';
        let claseEtiqueta = '';
        let claseraya = '';

        if (esRechazado) {
          if (i < pasoActual) {
            claseBola = 'completado';
            claseEtiqueta = 'completado';
            claseraya = 'completado';
          } else if (i === pasoActual) {
            claseBola = 'rechazado-final';
            claseEtiqueta = 'rechazado';
            claseraya = 'rechazado-linea';
          }
        } else if (esAceptado) {
          if (i < pasoActual) {
            claseBola = 'completado';
            claseEtiqueta = 'completado';
            claseraya = 'completado';
          } else if (i === pasoActual) {
            claseBola = 'aceptado';
            claseEtiqueta = 'aceptado';
            claseraya = 'completado';
          }
        } else if (pasoActual >= 0) {
          if (i < pasoActual) {
            claseBola = 'completado';
            claseEtiqueta = 'completado';
            claseraya = 'completado';
          } else if (i === pasoActual) {
            claseBola = 'activo';
            claseEtiqueta = 'activo';
            claseraya = 'completado';
          }
        }

        return (
          <Fragment key={paso.key}>
            {i > 0 && <span className={`post-flujo-raya ${claseraya}`} />}
            <div className="post-flujo-paso">
              <span className={`post-flujo-bola ${claseBola}`}>{icono}</span>
              <span className={`post-flujo-etiqueta ${claseEtiqueta}`}>{label}</span>
            </div>
          </Fragment>
        );
      })}
    </div>
  );
}

export default function Postulaciones() {
  const navigate = useNavigate();
  const location = useLocation();
  const tabActivo = location.pathname.includes('/empleos') ? 'empleos' : 'proyectos';

  const { data, loading, error } = useDashboardEgresadoRequest(
    () => egresadoDashboardService.obtenerPostulaciones(),
    [],
    []
  );

  const postulaciones = useMemo(() => (data || []).map(formatearPostulacion), [data]);
  const items = postulaciones;

  return (
    <div className="post-layout fwd-animar-entrada">
      <div className="post-main">
        <div className="post-tabs">
          {TABS.map((t) => {
            const Icon = t.icon;
            return (
              <button
                key={t.key}
                className={`post-tab${tabActivo === t.key ? ' active' : ''}`}
                type="button"
                onClick={() => navigate(`/egresado/dashboard/postulaciones/${t.key}`)}
              >
                <Icon size={16} />
                {t.label}
              </button>
            );
          })}
        </div>

        <div className="de-page-heading">
          <div className="post-headingLeft">
            <button className="de-project-icon-button" type="button" onClick={() => navigate('/egresado/dashboard')}>
              <ArrowLeft size={18} />
            </button>
            <h1>Mis Postulaciones</h1>
          </div>
          <span className="conteoProyectos">{items.length} {tabActivo === 'proyectos' ? 'postulaciones' : 'postulaciones a empleos'}</span>
        </div>

        {loading && <p className="de-data-state">Cargando...</p>}
        {error && <p className="de-data-state error">{error}</p>}

        {!loading && !error && items.length === 0 && tabActivo === 'proyectos' && (
          <div className="post-empty">
            <SearchX size={48} />
            <h4>Sin postulaciones</h4>
            <p>Aún no te has postulado a ningún proyecto. ¡Explora y encuentra tu próximo desafío!</p>
            <button className="post-emptyBtn" type="button" onClick={() => navigate('/egresado/dashboard/explorar')}>
              Explorar proyectos
            </button>
          </div>
        )}

        {!loading && !error && items.length === 0 && tabActivo === 'empleos' && (
          <div className="post-empty">
            <Briefcase size={48} />
            <h4>Sin postulaciones a empleos</h4>
            <p>Aún no te has postulado a ningún empleo. ¡Explora y encuentra tu próximo empleo!</p>
            <button className="post-emptyBtn" type="button" onClick={() => navigate('/egresado/dashboard/explorar-empleos')}>
              Explorar empleos
            </button>
          </div>
        )}

        {!loading && !error && items.length > 0 && tabActivo === 'proyectos' && (
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
                    {p.descripcion && <p className="post-desc">{p.descripcion}</p>}
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
                <FlujoPostulacion estadoRaw={p.estadoRaw} />
                <div className="post-acciones">
                  <button
                    className="post-btnDetalle"
                    type="button"
                    onClick={() => navigate(`/egresado/dashboard/proyecto/${p.idPropuesta}`)}
                  >
                    <Eye size={15} />
                    Ver proyecto
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && !error && items.length > 0 && tabActivo === 'empleos' && (
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
                    <p className="post-empresa">{p.empresa}</p>
                    {p.descripcion && <p className="post-desc">{p.descripcion}</p>}
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
                <FlujoPostulacion estadoRaw={p.estadoRaw} />
                <div className="post-acciones">
                  <button
                    className="post-btnDetalle"
                    type="button"
                    onClick={() => navigate(`/egresado/dashboard/empleo/${p.idPropuesta}`)}
                  >
                    <Eye size={15} />
                    Ver empleo
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
