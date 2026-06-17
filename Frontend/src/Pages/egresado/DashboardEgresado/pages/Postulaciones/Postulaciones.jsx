import { useMemo, Fragment } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Briefcase, Calendar, DollarSign, SearchX, Clock, Building2, Eye } from 'lucide-react';
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

function FlujoEmpleo({ estado }) {
  const estadoKey = (estado || 'PENDIENTE').toLowerCase();
  const aceptado = estadoKey === 'aceptada';
  const rechazado = estadoKey === 'rechazada';

  const ORDEN_EMPLEO = [
    { key: 'RECIBIDA', label: 'Recibida' },
    { key: 'PENDIENTE', label: 'Pendiente' },
    { key: 'EN_REVISION', label: 'En Revisión' },
    { key: 'PRESELECCIONADA', label: 'Preseleccionada' },
    { key: 'FINAL', label: '' },
  ];

  const pasoActual = (estadoKey === 'pendiente' || estadoKey === 'recibida') ? 0
    : aceptado ? 4
    : rechazado ? 4
    : -1;

  return (
    <div className="post-flujo">
      {ORDEN_EMPLEO.map((paso, i) => {
        const esUltimo = i === ORDEN_EMPLEO.length - 1;
        const label = esUltimo
          ? (rechazado ? 'Rechazada' : aceptado ? 'Aceptada' : '—')
          : paso.label;
        const icono = esUltimo
          ? (rechazado ? '✕' : aceptado ? '✓' : (ORDEN_EMPLEO.length).toString())
          : (i < pasoActual ? '✓' : (i + 1).toString());

        let claseBola = '';
        let claseEtiqueta = '';
        let claseraya = '';

        if (rechazado) {
          if (i < pasoActual) {
            claseBola = 'completado';
            claseEtiqueta = 'completado';
            claseraya = 'completado';
          } else if (i === pasoActual) {
            claseBola = 'rechazado-final';
            claseEtiqueta = 'rechazado';
            claseraya = 'rechazado-linea';
          }
        } else if (aceptado) {
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

const formatearOferta = (o) => {
  const propuesta = o.propuestaRef || {};
  const empresa = propuesta.perfilEmpresario?.usuario;
  return {
    id: o.id_oferta,
    titulo: propuesta.titulo || 'Oferta de empleo',
    descripcion: o.propuesta || propuesta.descripcion || '',
    empresa: empresa?.nombre || 'Empresa',
    estado: o.estado || 'PENDIENTE',
    tipoEstado: (o.estado || '').toLowerCase() === 'aceptada' ? 'activo' : 'pendiente',
    fecha: o.fecha_oferta ? new Date(o.fecha_oferta).toLocaleDateString('es-CR') : '—',
    cantidad: o.cantidad,
  };
};

export default function Postulaciones() {
  const navigate = useNavigate();
  const location = useLocation();
  const tabActivo = location.pathname.includes('/empleos') ? 'empleos' : 'proyectos';

  const { data: postData, loading: postLoading, error: postError } = useDashboardEgresadoRequest(
    () => egresadoDashboardService.obtenerPostulaciones(),
    [],
    []
  );

  const { data: ofertasData, loading: ofertasLoading, error: ofertasError } = useDashboardEgresadoRequest(
    () => egresadoDashboardService.obtenerOfertas(),
    [],
    []
  );

  const postulaciones = useMemo(() => (postData || []).map(formatearPostulacion), [postData]);
  const ofertas = useMemo(() => (ofertasData || []).map(formatearOferta), [ofertasData]);

  const loading = tabActivo === 'proyectos' ? postLoading : ofertasLoading;
  const error = tabActivo === 'proyectos' ? postError : ofertasError;
  const items = tabActivo === 'proyectos' ? postulaciones : ofertas;

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
          <span className="conteoProyectos">{items.length} {tabActivo === 'proyectos' ? 'postulaciones' : 'ofertas'}</span>
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
            <Building2 size={48} />
            <h4>Sin ofertas de empleo</h4>
            <p>Aún no has recibido ofertas de empleo. Las empresas te contactarán cuando tengan una oportunidad para ti.</p>
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
            {ofertas.map((o, i) => (
              <div key={o.id} className={`post-card acento-${acentos[i % acentos.length]}`}>
                <div className="post-cardBody">
                  <div className="post-iconWrap">
                    <Building2 size={20} />
                  </div>
                  <div className="post-content">
                    <div className="post-header">
                      <h3 className="post-title">{o.titulo}</h3>
                      <span className={`de-badge ${o.tipoEstado}`}>{o.estado}</span>
                    </div>
                    <p className="post-empresa">{o.empresa}</p>
                    {o.descripcion && <p className="post-desc">{o.descripcion}</p>}
                    <div className="post-meta">
                      <span className="post-metaItem">
                        <Calendar size={13} />
                        {o.fecha}
                      </span>
                      {o.cantidad && (
                        <span className="post-metaItem">
                          <DollarSign size={13} />
                          ₡{Number(o.cantidad).toLocaleString()}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <FlujoEmpleo estado={o.estado} />
                <div className="post-acciones">
                  <button
                    className="post-btnDetalle"
                    type="button"
                    onClick={() => navigate(`/egresado/dashboard/empleo/${o.id}`)}
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
