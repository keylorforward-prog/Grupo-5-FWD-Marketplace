import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  ArrowRight,
  Bell,
  Briefcase,
  CheckCircle2,
  ClipboardList,
  Compass,
  FileText,
  FolderOpen,
  Star,
  TrendingUp,
} from 'lucide-react';
import { useAuth } from '../../../../../context/AuthContext';
import { egresadoDashboardService } from '../../../../../services/egresadoDashboardService';
import { useDashboardEgresadoRequest } from '../../hooks/useDashboardEgresadoRequest';
import {
  formatearPostulacion,
  formatearNotificacion,
} from '../../utils/dashboardEgresadoFormatters';

const DATOS_INICIALES = {
  resumen: {},
  postulaciones: [],
  proyectos: [],
  notificaciones: [],
  mensajes: [],
};

const cargarInicio = () => egresadoDashboardService.obtenerInicio();

export default function Inicio() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data, loading, error } = useDashboardEgresadoRequest(cargarInicio, DATOS_INICIALES, []);

  const postulaciones = useMemo(() => data.postulaciones.map(formatearPostulacion), [data.postulaciones]);
  const notificaciones = useMemo(() => data.notificaciones.map(formatearNotificacion), [data.notificaciones]);

  return (
    <>
      <section className="de-hero fwd-animar-entrada">
        <div className="de-hero-content">
          <span className="de-hero-kicker">{t('egresadoDashboardInicio.hero.kicker')}</span>
          <h1 className="de-hero-title">
            {t('egresadoDashboardInicio.hero.title_start')} <span>{user?.nombre || t('egresadoDashboardInicio.hero.title_fallback')}</span>
          </h1>
          <p className="de-hero-subtitle">
            {t('egresadoDashboardInicio.hero.subtitle')}
          </p>
          <div className="de-hero-actions">
            <button className="de-btn-primary" type="button" onClick={() => navigate('/egresado/dashboard/explorar')}>
              <Compass size={16} />
              {t('egresadoDashboardInicio.hero.btnExplore')}
            </button>
          </div>
        </div>
        <div className="de-hero-illustration">
          <div className="de-hero-orb" />
          <img
            src="/Imgs/Comunidad icon-01.png"
            alt="Comunidad FWD"
            className="de-hero-community"
            width="260"
            height="260"
            decoding="async"
          />
        </div>
      </section>

      <section className="de-activity">
        <h2 className="de-activity-title">{t('egresadoDashboardInicio.activity.title')}</h2>
        <div className="de-stats-grid">
          <div className="de-stat-card">
            <div className="de-stat-icon blue"><Star size={20} /></div>
            <span className="de-stat-value">{data.resumen.reputacion ?? '—'}</span>
            <span className="de-stat-label">{t('egresadoDashboardInicio.activity.reputation')}</span>
          </div>
          <div className="de-stat-card">
            <div className="de-stat-icon orange"><FileText size={20} /></div>
            <span className="de-stat-value">{data.resumen.postulacionesActivas ?? 0}</span>
            <span className="de-stat-label">{t('egresadoDashboardInicio.activity.activeApplications')}</span>
          </div>
          <div className="de-stat-card">
            <div className="de-stat-icon green"><FolderOpen size={20} /></div>
            <span className="de-stat-value">{data.resumen.proyectosEnProgreso ?? 0}</span>
            <span className="de-stat-label">{t('egresadoDashboardInicio.activity.projectsInProgress')}</span>
          </div>
          <div className="de-stat-card">
            <div className="de-stat-icon purple"><CheckCircle2 size={20} /></div>
            <span className="de-stat-value">{data.resumen.proyectosCompletados ?? 0}</span>
            <span className="de-stat-label">{t('egresadoDashboardInicio.activity.completedProjects')}</span>
          </div>
          <div className="de-stat-card">
            <div className="de-stat-icon magenta"><TrendingUp size={20} /></div>
            <span className="de-stat-value">{data.resumen.ofertasRecibidas ?? 0}</span>
            <span className="de-stat-label">{t('egresadoDashboardInicio.activity.offersReceived')}</span>
          </div>
        </div>
      </section>

      <div className="de-grid-3">
        <div className="de-panel">
          <div className="de-panel-header">
            <h3 className="de-panel-title">{t('egresadoDashboardInicio.applications.title')}</h3>
            <button className="de-panel-action" type="button" onClick={() => navigate('/egresado/dashboard/postulaciones')}>{t('egresadoDashboardInicio.applications.viewAll')}</button>
          </div>
          {loading && <p className="de-data-state">{t('egresadoDashboardInicio.applications.loading')}</p>}
          {error && <p className="de-data-state error">{error}</p>}
          {!loading && !error && postulaciones.length === 0 && (
            <p className="de-data-state">{t('egresadoDashboardInicio.applications.empty')}</p>
          )}
          {!loading && !error && postulaciones.slice(0, 4).map((p) => (
            <div key={p.id} className="de-offer-item">
              <div className="de-offer-icon-wrap"><Briefcase size={16} /></div>
              <div className="de-offer-info">
                <p className="de-offer-title">{p.titulo}</p>
                <p className="de-offer-sender">{p.estado} · {p.fecha}</p>
              </div>
              <span className={`de-badge ${p.tipoEstado}`}>{p.estado}</span>
            </div>
          ))}
          {postulaciones.length > 0 && (
            <button className="de-panel-footer-link de-link-button" type="button" onClick={() => navigate('/egresado/dashboard/postulaciones')}>
              {t('egresadoDashboardInicio.applications.viewAllBtn')} <ArrowRight size={14} />
            </button>
          )}
        </div>

        <div className="de-panel">
          <div className="de-panel-header">
            <h3 className="de-panel-title">{t('egresadoDashboardInicio.projects.title')}</h3>
            <button className="de-panel-action" type="button" onClick={() => navigate('/egresado/dashboard/proyectos')}>{t('egresadoDashboardInicio.projects.viewAll')}</button>
          </div>
          {loading && <p className="de-data-state">{t('egresadoDashboardInicio.projects.loading')}</p>}
          {!loading && !error && data.proyectos.length === 0 && (
            <p className="de-data-state">{t('egresadoDashboardInicio.projects.empty')}</p>
          )}
          {!loading && !error && data.proyectos.slice(0, 3).map((proyecto) => (
            <div key={proyecto.id_proyecto} className="de-project-item">
              <div className="de-offer-icon-wrap"><ClipboardList size={16} /></div>
              <div className="de-project-info">
                <div className="de-project-name">
                  {proyecto.titulo}
                  <span className={`de-badge ${proyecto.estado === 'EN_PROGRESO' ? 'desarrollo' : 'revision'}`}>
                    {proyecto.estado === 'EN_PROGRESO' ? t('egresadoDashboardInicio.projects.statusInDev') : t('egresadoDashboardInicio.projects.statusInRev')}
                  </span>
                </div>
                <p className="de-project-meta">
                  {proyecto.fecha_fin_estimada
                    ? t('egresadoDashboardInicio.projects.deliveryEst').replace('{{date}}', new Date(proyecto.fecha_fin_estimada).toLocaleDateString())
                    : t('egresadoDashboardInicio.projects.noEstDate')}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="de-panel">
          <div className="de-panel-header">
            <h3 className="de-panel-title">{t('egresadoDashboardInicio.notifications.title')}</h3>
            <button className="de-panel-action" type="button" onClick={() => navigate('/egresado/dashboard/notificaciones')}>{t('egresadoDashboardInicio.notifications.viewAll')}</button>
          </div>
          {loading && <p className="de-data-state">{t('egresadoDashboardInicio.notifications.loading')}</p>}
          {!loading && !error && notificaciones.length === 0 && (
            <p className="de-data-state">{t('egresadoDashboardInicio.notifications.empty')}</p>
          )}
          {!loading && !error && notificaciones.slice(0, 4).map((n) => (
            <div key={n.id} className="de-notif-item">
              <div className={`de-notif-icon ${n.tipoIcono}`}>
                {n.leido ? <CheckCircle2 size={14} /> : <Bell size={14} />}
              </div>
              <div className="de-notif-text">
                <p className="de-notif-desc">{n.texto}</p>
                <p className="de-notif-ago">{n.tiempo}</p>
              </div>
              {!n.leido && <span className="de-message-unread" />}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
