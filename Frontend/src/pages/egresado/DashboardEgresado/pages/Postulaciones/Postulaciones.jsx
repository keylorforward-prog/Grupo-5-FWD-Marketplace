import { useMemo, Fragment } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Briefcase, Calendar, DollarSign, SearchX, Clock, Eye, Building2, FolderOpen, MessageSquare } from 'lucide-react';
import { egresadoDashboardService } from '../../../../../services/egresadoDashboardService';
import { useDashboardEgresadoRequest } from '../../hooks/useDashboardEgresadoRequest';
import { formatearPostulacion, formatearPostulacionEmpleo } from '../../utils/dashboardEgresadoFormatters';

const acentos = ['azul', 'aqua', 'naranja', 'morado', 'magenta', 'amarillo'];

const TABS = [
  { key: 'proyectos', labelKey: 'tabProyectos', icon: Briefcase },
  { key: 'empleos', labelKey: 'tabEmpleos', icon: Building2 },
];

const ORDEN_FLUJO = [
  { key: 'ENVIADA', labelKey: 'flujoEnviada' },
  { key: 'PENDIENTE', labelKey: 'flujoPendiente' },
  { key: 'EN_REVISION', labelKey: 'flujoRevision' },
  { key: 'PRESELECCIONADA', labelKey: 'flujoPreseleccionada' },
  { key: 'FINAL', labelKey: '' },
];

function FlujoPostulacion({ estadoRaw }) {
  const { t } = useTranslation();
  const pasoActual = estadoRaw === 'ENVIADA' ? 0
    : estadoRaw === 'PENDIENTE' ? 1
    : estadoRaw === 'EN_REVISION' ? 2
    : estadoRaw === 'PRESELECCIONADA' ? 3
    : estadoRaw === 'CONTRATADO' ? 4
    : estadoRaw === 'RECHAZADA' ? 4
    : -1;
  const esRechazado = estadoRaw === 'RECHAZADA';
  const esAceptado = estadoRaw === 'CONTRATADO';

  return (
    <div className="post-flujo">
      {ORDEN_FLUJO.map((paso, i) => {
        const esUltimo = i === ORDEN_FLUJO.length - 1;
        const label = esUltimo
          ? (esRechazado ? t('egresadoPostulaciones.flujoRechazada') : esAceptado ? t('egresadoPostulaciones.flujoAceptada') : '—')
          : t(`egresadoPostulaciones.${paso.labelKey}`);
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
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const tabActivo = location.pathname.includes('/empleos') ? 'empleos' : 'proyectos';

  const { data: dataProyectos, loading: loadingProyectos, error: errorProyectos } = useDashboardEgresadoRequest(
    () => egresadoDashboardService.obtenerPostulaciones(),
    [],
    []
  );

  const { data: dataEmpleos, loading: loadingEmpleos, error: errorEmpleos } = useDashboardEgresadoRequest(
    () => egresadoDashboardService.obtenerPostulacionesEmpleo(),
    [],
    []
  );

  const postulacionesProyectos = useMemo(() => (dataProyectos || []).map(formatearPostulacion), [dataProyectos]);
  const postulacionesEmpleos = useMemo(() => (dataEmpleos || []).map(formatearPostulacionEmpleo), [dataEmpleos]);

  const loading = tabActivo === 'proyectos' ? loadingProyectos : loadingEmpleos;
  const error = tabActivo === 'proyectos' ? errorProyectos : errorEmpleos;
  const items = tabActivo === 'proyectos' ? postulacionesProyectos : postulacionesEmpleos;

  return (
    <div className="post-layout fwd-animar-entrada">
      <div className="post-main">
        <div className="post-tabs">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.key}
                className={`post-tab${tabActivo === tab.key ? ' active' : ''}`}
                type="button"
                onClick={() => navigate(`/egresado/dashboard/postulaciones/${tab.key}`)}
              >
                <Icon size={16} />
                {t(`egresadoPostulaciones.${tab.labelKey}`)}
              </button>
            );
          })}
        </div>

        <div className="de-page-heading">
          <div className="post-headingLeft">
            <button className="de-project-icon-button" type="button" onClick={() => navigate('/egresado/dashboard')}>
              <ArrowLeft size={18} />
            </button>
            <h1>{t('egresadoPostulaciones.titulo')}</h1>
          </div>
          <span className="conteoProyectos">{tabActivo === 'proyectos' ? t('egresadoPostulaciones.total', { count: items.length }) : t('egresadoPostulaciones.totalEmpleos', { count: items.length })}</span>
        </div>

        {loading && <p className="de-data-state">{t('egresadoPostulaciones.loading')}</p>}
        {error && <p className="de-data-state error">{error}</p>}

        {!loading && !error && items.length === 0 && tabActivo === 'proyectos' && (
          <div className="post-empty">
            <SearchX size={48} />
            <h4>{t('egresadoPostulaciones.sinPostulaciones')}</h4>
            <p>{t('egresadoPostulaciones.sinPostulacionesDesc')}</p>
            <button className="post-emptyBtn" type="button" onClick={() => navigate('/egresado/dashboard/explorar')}>
              {t('egresadoPostulaciones.explorarProyectos')}
            </button>
          </div>
        )}

        {!loading && !error && items.length === 0 && tabActivo === 'empleos' && (
          <div className="post-empty">
            <Briefcase size={48} />
            <h4>{t('egresadoPostulaciones.sinPostulaciones')}</h4>
            <p>{t('egresadoPostulaciones.sinPostulacionesEmpleosDesc')}</p>
            <button className="post-emptyBtn" type="button" onClick={() => navigate('/egresado/dashboard/explorar-empleos')}>
              {t('egresadoPostulaciones.explorarEmpleos')}
            </button>
          </div>
        )}

        {!loading && !error && items.length > 0 && tabActivo === 'proyectos' && (
          <div className="post-list">
            {postulacionesProyectos.map((p, i) => (
              <div key={p.id} className={`post-card acento-${acentos[i % acentos.length]}`}>
                <div className="post-cardBody">
                  <div className="post-iconWrap">
                    <FolderOpen size={20} />
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
                          {t('egresadoPostulaciones.conMensaje')}
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
                    onClick={() => navigate(`/egresado/dashboard/proyecto/${p.idPropuesta}`, { state: { desde: 'postulaciones' } })}
                  >
                    <Eye size={15} />
                    {t('egresadoPostulaciones.verProyecto')}
                  </button>
                  {['EN_REVISION', 'PRESELECCIONADA', 'CONTRATADO'].includes(p.estadoRaw) && (
                    <button
                      className="post-btnDetalle"
                      type="button"
                      onClick={() => navigate('/egresado/dashboard/mensajes', {
                        state: {
                          idPostulacion: p.id,
                          proyecto: p.titulo,
                          contacto: { nombre: p.empresa || 'Empresa', foto_perfil: p.empresaLogo || null, rol: 'empresa' }
                        }
                      })}
                    >
                      <MessageSquare size={15} />
                      {t('egresadoPostulaciones.mensajes', 'Mensajes')}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && !error && items.length > 0 && tabActivo === 'empleos' && (
          <div className="post-list">
            {postulacionesEmpleos.map((p, i) => (
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
                          {t('egresadoPostulaciones.conMensaje')}
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
                    onClick={() => navigate(`/egresado/dashboard/empleo/${p.idOferta}`, { state: { desde: 'postulaciones' } })}
                  >
                    <Eye size={15} />
                    {t('egresadoPostulaciones.verEmpleo')}
                  </button>
                  {['EN_REVISION', 'PRESELECCIONADA', 'CONTRATADO'].includes(p.estadoRaw) && (
                    <button
                      className="post-btnDetalle"
                      type="button"
                      onClick={() => navigate('/egresado/dashboard/mensajes', {
                        state: {
                          idPostulacion: p.id,
                          proyecto: p.titulo,
                          contacto: { nombre: p.empresa || 'Empresa', foto_perfil: p.empresaLogo || null, rol: 'empresa' }
                        }
                      })}
                    >
                      <MessageSquare size={15} />
                      {t('egresadoPostulaciones.mensajes', 'Mensajes')}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
