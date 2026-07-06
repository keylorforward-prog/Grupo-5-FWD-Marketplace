import { useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  ArrowRight,
  Briefcase,
  CheckCircle2,
  ClipboardList,
  FileText,
  MoreVertical,
  Package,
  Plus,
  Sparkles,
  TrendingUp,
  UserCheck,
} from 'lucide-react';
import { useAuth } from '../../../../../context/AuthContext';
import { dashboardEmpresarioService } from '../../../../../services/dashboardEmpresarioService';
import DashboardLayout from '../../components/DashboardLayout';
import {
  formatearEntregable,
  formatearMensaje,
  formatearNotificacion,
  formatearOferta,
  formatearPropuesta,
  formatearTalento,
} from '../../utils/dashboardEmpresarioFormatters';
import { useDashboardEmpresarioRequest } from '../../hooks/useDashboardEmpresarioRequest';
import EstadoDatos from '../../components/EstadoDatos';

const DATOS_INICIALES_INICIO = {
  resumen: {},
  propuestas: [],
  talento: [],
  ofertas: [],
  entregables: [],
  mensajes: [],
  notificaciones: [],
};

const cargarInicio = () => dashboardEmpresarioService.obtenerInicio();

export default function Inicio() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data, loading, error } = useDashboardEmpresarioRequest(
    cargarInicio,
    DATOS_INICIALES_INICIO,
    []
  );

  const propuestas = useMemo(() => data.propuestas.map(formatearPropuesta), [data.propuestas]);
  const talento = useMemo(() => data.talento.map(formatearTalento), [data.talento]);
  const ofertas = useMemo(() => data.ofertas.map(formatearOferta), [data.ofertas]);
  const entregables = useMemo(() => data.entregables.map(formatearEntregable), [data.entregables]);
  const mensajes = useMemo(() => data.mensajes.map(formatearMensaje), [data.mensajes]);
  const notificaciones = useMemo(() => data.notificaciones.map(formatearNotificacion), [data.notificaciones]);
  const irAPublicarProyecto = useCallback(() => navigate('/DashboardEmpresario/publicar-proyecto'), [navigate]);
  const irACrearProyectoIA = useCallback(() => navigate('/DashboardEmpresario/crear-proyecto-ia'), [navigate]);

  return (
    <DashboardLayout activePage="inicio">
      <section className="de-hero fwd-animar-entrada">
        <div className="de-hero-content">
          <span className="de-hero-kicker">{t('empresaDashboardInicio.hero.kicker')}</span>
          <h1 className="de-hero-title">
            {t('empresaDashboardInicio.hero.title_start')} <span>{user?.nombre || t('empresaDashboardInicio.hero.title_fallback')}</span>
          </h1>
          <p className="de-hero-subtitle">
            {t('empresaDashboardInicio.hero.subtitle')}
          </p>
          <div className="de-hero-actions">
            <button className="de-btn-primary" type="button" onClick={irAPublicarProyecto}>
              <Plus size={16} />
              {t('empresaDashboardInicio.hero.btnPublish')}
            </button>
            <button className="de-btn-outline" type="button" onClick={irACrearProyectoIA}>
              <Sparkles size={16} />
              {t('empresaDashboardInicio.hero.btnAIPublish')}
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
        <h2 className="de-activity-title">{t('empresaDashboardInicio.activity.title')}</h2>
        <div className="de-stats-grid">
          <div className="de-stat-card">
            <div className="de-stat-icon blue"><Briefcase size={20} /></div>
            <span className="de-stat-value">{data.resumen.proyectosPublicados ?? 0}</span>
            <span className="de-stat-label">{t('empresaDashboardInicio.activity.projectsPublished')}</span>
          </div>
          <div className="de-stat-card">
            <div className="de-stat-icon green"><ClipboardList size={20} /></div>
            <span className="de-stat-value">{data.resumen.proyectosActivos ?? 0}</span>
            <span className="de-stat-label">{t('empresaDashboardInicio.activity.projectsActive')}</span>
          </div>
          <div className="de-stat-card">
            <div className="de-stat-icon orange"><FileText size={20} /></div>
            <span className="de-stat-value">{data.resumen.ofertasRecibidas ?? 0}</span>
            <span className="de-stat-label">{t('empresaDashboardInicio.activity.offersReceived')}</span>
          </div>
          <div className="de-stat-card">
            <div className="de-stat-icon purple"><TrendingUp size={20} /></div>
            <span className="de-stat-value">{data.resumen.proyectosFinalizados ?? 0}</span>
            <span className="de-stat-label">{t('empresaDashboardInicio.activity.projectsFinished')}</span>
          </div>
          <div className="de-stat-card">
            <div className="de-stat-icon magenta"><UserCheck size={20} /></div>
            <span className="de-stat-value">{data.resumen.estudiantesContratados ?? 0}</span>
            <span className="de-stat-label">{t('empresaDashboardInicio.activity.studentsHired')}</span>
          </div>
        </div>
      </section>

      <div className="de-grid-3">
        <div className="de-panel">
          <div className="de-panel-header">
            <h3 className="de-panel-title">{t('empresaDashboardInicio.projects.title')}</h3>
            <button className="de-panel-action" type="button" onClick={() => navigate('/DashboardEmpresario/proyectos')}>{t('empresaDashboardInicio.projects.viewAll')}</button>
          </div>
          <EstadoDatos loading={loading} error={error} empty={!propuestas.length} emptyText={t('empresaDashboardInicio.projects.empty')} />
          {!loading && !error && propuestas.map((p) => (
            <div key={p.id} className="de-project-item">
              <div className={`de-project-icon-wrap ${p.iconColor}`}>
                <img src={p.arrowSrc} alt="Imagen descriptiva" className="de-project-arrow" width="24" height="24" loading="lazy" decoding="async" />
              </div>
              <div className="de-project-info">
                <div className="de-project-name">
                  {p.name}
                  <span className={`de-badge ${p.statusType}`}>{p.status}</span>
                </div>
                <p className="de-project-meta">{p.meta}</p>
              </div>
              <div className="de-project-action">
                <button className="de-project-btn" type="button" onClick={() => navigate('/DashboardEmpresario/ofertas')}>{p.action}</button>
                <button className="de-project-menu" type="button" aria-label="Mas opciones" onClick={() => navigate('/DashboardEmpresario/proyectos')}>
                  <MoreVertical size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="de-panel">
          <div className="de-panel-header">
            <h3 className="de-panel-title">{t('empresaDashboardInicio.talent.title')}</h3>
            <button className="de-panel-action" type="button" onClick={() => navigate('/DashboardEmpresario/talento')}>{t('empresaDashboardInicio.talent.viewMore')}</button>
          </div>
          <EstadoDatos loading={loading} error={error} empty={!talento.length} emptyText={t('empresaDashboardInicio.talent.empty')} />
          {!loading && !error && talento.map((tItem) => (
            <div key={tItem.id} className="de-talent-item">
              <img src={tItem.avatar} alt={tItem.name} className="de-talent-avatar" />
              <div className="de-talent-info">
                <div className="de-talent-name">
                  {tItem.name}
                  {tItem.verified && <CheckCircle2 size={14} className="de-talent-verified" />}
                </div>
                <p className="de-talent-skills">{tItem.skills}</p>
                <p className="de-talent-rating">
                  {t('empresaDashboardInicio.talent.rating')
                    .replace('{{rating}}', tItem.rating)
                    .replace('{{projects}}', tItem.projects)}
                </p>
              </div>
              <div className="de-talent-match">
                <span className="de-talent-match-pct">{tItem.match}%</span>
                <span className="de-talent-match-label">{t('empresaDashboardInicio.talent.match')}</span>
              </div>
            </div>
          ))}
          <button className="de-panel-footer-link de-link-button" type="button" onClick={() => navigate('/DashboardEmpresario/talento')}>
            {t('empresaDashboardInicio.talent.viewMoreBtn')} <ArrowRight size={14} />
          </button>
        </div>

        <div className="de-panel">
          <div className="de-panel-header">
            <h3 className="de-panel-title">{t('empresaDashboardInicio.offers.title')} <span className="de-alert-dot" /></h3>
            <button className="de-panel-action" type="button" onClick={() => navigate('/DashboardEmpresario/ofertas')}>{t('empresaDashboardInicio.offers.viewAll')}</button>
          </div>
          <EstadoDatos loading={loading} error={error} empty={!ofertas.length} emptyText={t('empresaDashboardInicio.offers.empty')} />
          {!loading && !error && ofertas.map((o) => (
            <div key={o.id} className="de-offer-item">
              <div className="de-offer-icon-wrap"><FileText size={16} /></div>
              <div className="de-offer-info">
                <p className="de-offer-title">{o.title}</p>
                <p className="de-offer-sender">{o.sender}</p>
              </div>
              <div className="de-offer-right">
                <span className="de-badge nueva">{t('empresaDashboardInicio.offers.new')}</span>
                <span className="de-offer-time">{o.time}</span>
              </div>
            </div>
          ))}
          <button className="de-panel-footer-link de-link-button" type="button" onClick={() => navigate('/DashboardEmpresario/ofertas')}>
            {t('empresaDashboardInicio.offers.reviewAllBtn')} <ArrowRight size={14} />
          </button>
        </div>
      </div>

      <div className="de-grid-3">
        <div className="de-panel">
          <div className="de-panel-header">
            <h3 className="de-panel-title">{t('empresaDashboardInicio.deliverables.title')}</h3>
            <button className="de-panel-action" type="button" onClick={() => navigate('/DashboardEmpresario/entregables')}>{t('empresaDashboardInicio.deliverables.viewAll')}</button>
          </div>
          <EstadoDatos loading={loading} error={error} empty={!entregables.length} emptyText={t('empresaDashboardInicio.deliverables.empty')} />
          {!loading && !error && entregables.map((d) => (
            <div key={d.id} className="de-deliverable-item">
              <div className="de-deliverable-icon"><Package size={16} /></div>
              <div className="de-deliverable-info">
                <p className="de-deliverable-name">{d.name}</p>
                <p className="de-deliverable-meta">{d.meta}</p>
              </div>
              <span className="de-badge pendiente">{d.status}</span>
            </div>
          ))}
        </div>

        <div className="de-panel">
          <div className="de-panel-header">
            <h3 className="de-panel-title">{t('empresaDashboardInicio.messages.title')}</h3>
            <button className="de-panel-action" type="button" onClick={() => navigate('/DashboardEmpresario/mensajes')}>{t('empresaDashboardInicio.messages.viewAll')}</button>
          </div>
          <EstadoDatos loading={loading} error={error} empty={!mensajes.length} emptyText={t('empresaDashboardInicio.messages.empty')} />
          {!loading && !error && mensajes.map((m) => (
            <div key={m.id} className="de-message-item">
              <img src={m.avatar} alt={m.name} className="de-message-avatar" />
              <div className="de-message-content">
                <p className="de-message-name">{m.name}</p>
                <p className="de-message-preview">{m.preview}</p>
              </div>
              <div className="de-message-right">
                <span className="de-message-time">{m.time}</span>
                {m.unread && <span className="de-message-unread" />}
              </div>
            </div>
          ))}
        </div>

        <div className="de-panel">
          <div className="de-panel-header">
            <h3 className="de-panel-title">{t('empresaDashboardInicio.notifications.title')}</h3>
            <button className="de-panel-action" type="button" onClick={() => navigate('/DashboardEmpresario/notificaciones')}>{t('empresaDashboardInicio.notifications.viewAll')}</button>
          </div>
          <EstadoDatos loading={loading} error={error} empty={!notificaciones.length} emptyText={t('empresaDashboardInicio.notifications.empty')} />
          {!loading && !error && notificaciones.map((n) => (
            <div key={n.id} className="de-notif-item">
              <div className={`de-notif-icon ${n.iconType}`}>{n.icon}</div>
              <div className="de-notif-text">
                <p className="de-notif-desc">{n.text}</p>
                <p className="de-notif-ago">{n.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
