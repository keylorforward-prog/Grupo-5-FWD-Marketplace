import { useNavigate } from 'react-router-dom';
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
import DashboardLayout from '../../components/DashboardLayout';
import {
  mockDeliverables,
  mockMessages,
  mockNotifications,
  mockOffers,
  mockProjects,
  mockTalent,
} from '../../data/dashboardData';

export default function Inicio() {
  const navigate = useNavigate();

  return (
    <DashboardLayout activePage="inicio">
      <section className="de-hero">
        <div className="de-hero-content">
          <h1 className="de-hero-title">Bienvenido, David!</h1>
          <p className="de-hero-subtitle">Que necesitas desarrollar hoy?</p>
          <p className="de-hero-desc">Publica tu proyecto y conecta con el mejor talento de FWD.</p>
          <div className="de-hero-actions">
            <button className="de-btn-primary" type="button" onClick={() => navigate('/DashboardEmpresario/publicar-proyecto')}>
              <Plus size={16} />
              Publicar Proyecto
            </button>
            <button className="de-btn-outline" type="button" onClick={() => navigate('/DashboardEmpresario/crear-proyecto-ia')}>
              <Sparkles size={16} />
              Crear Proyecto con IA
            </button>
          </div>
        </div>
        <div className="de-hero-illustration">
          <div className="de-hero-illus-placeholder">🧑‍💻</div>
        </div>
      </section>

      <section className="de-activity">
        <h2 className="de-activity-title">Resumen de Actividad</h2>
        <div className="de-stats-grid">
          <div className="de-stat-card">
            <div className="de-stat-icon blue"><Briefcase size={20} /></div>
            <span className="de-stat-value">12</span>
            <span className="de-stat-label">Proyectos Publicados</span>
          </div>
          <div className="de-stat-card">
            <div className="de-stat-icon green"><ClipboardList size={20} /></div>
            <span className="de-stat-value">4</span>
            <span className="de-stat-label">Proyectos Activos</span>
          </div>
          <div className="de-stat-card">
            <div className="de-stat-icon orange"><FileText size={20} /></div>
            <span className="de-stat-value">35</span>
            <span className="de-stat-label">Ofertas Recibidas</span>
          </div>
          <div className="de-stat-card">
            <div className="de-stat-icon purple"><TrendingUp size={20} /></div>
            <span className="de-stat-value">8</span>
            <span className="de-stat-label">Proyectos Finalizados</span>
          </div>
          <div className="de-stat-card">
            <div className="de-stat-icon magenta"><UserCheck size={20} /></div>
            <span className="de-stat-value">15</span>
            <span className="de-stat-label">Estudiantes Contratados</span>
          </div>
        </div>
      </section>

      <div className="de-grid-3">
        <div className="de-panel">
          <div className="de-panel-header">
            <h3 className="de-panel-title">Mis Proyectos Recientes</h3>
            <button className="de-panel-action" type="button" onClick={() => navigate('/DashboardEmpresario/proyectos')}>Ver todos</button>
          </div>
          {mockProjects.map((p) => (
            <div key={p.id} className="de-project-item">
              <div className={`de-project-icon-wrap ${p.iconColor}`}>{p.icon}</div>
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
            <h3 className="de-panel-title">Talento Recomendado por IA</h3>
            <button className="de-panel-action" type="button" onClick={() => navigate('/DashboardEmpresario/talento')}>Ver mas</button>
          </div>
          {mockTalent.map((t) => (
            <div key={t.id} className="de-talent-item">
              <img src={t.avatar} alt={t.name} className="de-talent-avatar" />
              <div className="de-talent-info">
                <div className="de-talent-name">
                  {t.name}
                  {t.verified && <CheckCircle2 size={14} className="de-talent-verified" />}
                </div>
                <p className="de-talent-skills">{t.skills}</p>
                <p className="de-talent-rating"><span className="de-talent-star">★</span>{t.rating} ({t.projects} proyectos)</p>
              </div>
              <div className="de-talent-match">
                <span className="de-talent-match-pct">{t.match}%</span>
                <span className="de-talent-match-label">Coincidencia</span>
              </div>
            </div>
          ))}
          <button className="de-panel-footer-link de-link-button" type="button" onClick={() => navigate('/DashboardEmpresario/talento')}>
            Ver mas candidatos <ArrowRight size={14} />
          </button>
        </div>

        <div className="de-panel">
          <div className="de-panel-header">
            <h3 className="de-panel-title">Ofertas Pendientes <span className="de-alert-dot" /></h3>
            <button className="de-panel-action" type="button" onClick={() => navigate('/DashboardEmpresario/ofertas')}>Ver todas</button>
          </div>
          {mockOffers.map((o) => (
            <div key={o.id} className="de-offer-item">
              <div className="de-offer-icon-wrap">📄</div>
              <div className="de-offer-info">
                <p className="de-offer-title">{o.title}</p>
                <p className="de-offer-sender">{o.sender}</p>
              </div>
              <div className="de-offer-right">
                <span className="de-badge nueva">Nueva</span>
                <span className="de-offer-time">{o.time}</span>
              </div>
            </div>
          ))}
          <button className="de-panel-footer-link de-link-button" type="button" onClick={() => navigate('/DashboardEmpresario/ofertas')}>
            Revisar todas las ofertas <ArrowRight size={14} />
          </button>
        </div>
      </div>

      <div className="de-grid-3">
        <div className="de-panel">
          <div className="de-panel-header">
            <h3 className="de-panel-title">Entregables Pendientes</h3>
            <button className="de-panel-action" type="button" onClick={() => navigate('/DashboardEmpresario/entregables')}>Ver todos</button>
          </div>
          {mockDeliverables.map((d) => (
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
            <h3 className="de-panel-title">Mensajes Recientes</h3>
            <button className="de-panel-action" type="button" onClick={() => navigate('/DashboardEmpresario/mensajes')}>Ver todos</button>
          </div>
          {mockMessages.map((m) => (
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
            <h3 className="de-panel-title">Notificaciones</h3>
            <button className="de-panel-action" type="button" onClick={() => navigate('/DashboardEmpresario/notificaciones')}>Ver todas</button>
          </div>
          {mockNotifications.map((n) => (
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
