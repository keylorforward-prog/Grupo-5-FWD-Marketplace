import { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import {
  Home,
  FolderOpen,
  FileText,
  Package,
  MessageSquare,
  Users,
  History,
  Star,
  Receipt,
  Settings,
  Plus,
  Sparkles,
  Bell,
  Search,
  ChevronDown,
  ArrowRight,
  CheckCircle2,
  MoreVertical,
  HelpCircle,
  Briefcase,
  ClipboardList,
  TrendingUp,
  UserCheck,
} from 'lucide-react';
import MenuUsuario from '../../../components/MenuUsuario/MenuUsuario';
import { RUTAS } from '../../../routes/rutas';
import './DashboardEmpresario.css';

/* ── Mock Data ─────────────────────────────────────────────────────────── */
const mockProjects = [
  {
    id: 1,
    name: 'Sistema de Inventario',
    status: 'En recepción de ofertas',
    statusType: 'recepcion',
    meta: '15 ofertas recibidas • Cierra en 5 días',
    icon: '📦',
    iconColor: 'blue',
    action: 'Ver Ofertas',
  },
  {
    id: 2,
    name: 'Página Web Restaurante',
    status: 'En desarrollo',
    statusType: 'desarrollo',
    meta: 'Estudiante: Juan Pérez • Inicio: 20 may 2024',
    icon: '🌐',
    iconColor: 'orange',
    action: 'Ver Progreso',
  },
  {
    id: 3,
    name: 'Dashboard de Ventas',
    status: 'Finalizado',
    statusType: 'finalizado',
    meta: 'Finalizado el 12 may 2024 • Calificado',
    icon: '📊',
    iconColor: 'green',
    action: 'Ver Entregables',
  },
];

const mockTalent = [
  {
    id: 1,
    name: 'María González',
    verified: true,
    skills: 'React • Node.js • TypeScript',
    rating: 4.9,
    projects: 28,
    match: 95,
    avatar: 'https://i.pravatar.cc/150?img=11',
  },
  {
    id: 2,
    name: 'Carlos Vargas',
    verified: true,
    skills: 'Python • IA • Machine Learning',
    rating: 4.8,
    projects: 19,
    match: 91,
    avatar: 'https://i.pravatar.cc/150?img=15',
  },
];

const mockOffers = [
  {
    id: 1,
    title: 'App Móvil para Delivery',
    sender: 'Ana López',
    time: 'Hoy',
  },
  {
    id: 2,
    title: 'Dashboard RH',
    sender: 'José Mora',
    time: 'Ayer',
  },
  {
    id: 3,
    title: 'Sitio Web Corporativo',
    sender: 'Laura Ruiz',
    time: 'Ayer',
  },
];

const mockDeliverables = [
  {
    id: 1,
    name: 'Sistema POS - Versión 1.0',
    meta: 'Juan Pérez • Entregable final',
    status: 'Pendiente de revisión',
  },
  {
    id: 2,
    name: 'Dashboard Financiero',
    meta: 'María González • Entregable parcial',
    status: 'Pendiente de revisión',
  },
  {
    id: 3,
    name: 'Landing Page Marketing',
    meta: 'Carlos Vargas • Entregable final',
    status: 'Pendiente de revisión',
  },
];

const mockMessages = [
  {
    id: 1,
    name: 'Juan Pérez',
    preview: 'Ya terminé el módulo de autenticación, adjunto avances del proyecto.',
    time: '10:30 AM',
    unread: true,
    avatar: 'https://i.pravatar.cc/150?img=33',
  },
  {
    id: 2,
    name: 'Ana López',
    preview: 'Tengo una consulta sobre el diseño de la pantalla de inicio.',
    time: 'Ayer',
    unread: false,
    avatar: 'https://i.pravatar.cc/150?img=26',
  },
  {
    id: 3,
    name: 'María González',
    preview: 'Te envié el plan de trabajo actualizado.',
    time: '2 días',
    unread: false,
    avatar: 'https://i.pravatar.cc/150?img=11',
  },
];

const mockNotifications = [
  {
    id: 1,
    text: 'El proyecto "E-commerce" recibió una nueva oferta.',
    time: 'Hace 10 minutos',
    icon: '📩',
    iconType: 'blue',
  },
  {
    id: 2,
    text: 'Entregable final disponible para revisión.',
    time: 'Hace 1 hora',
    icon: '📋',
    iconType: 'green',
  },
  {
    id: 3,
    text: 'Nuevo mensaje de Ana López en el proyecto "App Móvil para Delivery".',
    time: 'Hace 2 horas',
    icon: '💬',
    iconType: 'purple',
  },
  {
    id: 4,
    text: 'El proyecto "Sistema de Inventario" está próximo a cerrar la recepción de ofertas.',
    time: 'Hace 3 horas',
    icon: '⏰',
    iconType: 'orange',
  },
];

/* ── Sidebar Navigation ───────────────────────────────────────────────── */
const sidebarItems = [
  { key: 'inicio', label: 'Inicio', icon: Home },
  { key: 'proyectos', label: 'Mis Proyectos', icon: FolderOpen },
  { key: 'ofertas', label: 'Ofertas Recibidas', icon: FileText },
  { key: 'entregables', label: 'Entregables', icon: Package },
  { key: 'mensajes', label: 'Mensajes', icon: MessageSquare },
  { key: 'talento', label: 'Talento Recomendado', icon: Users },
  { key: 'historial', label: 'Historial de Proyectos', icon: History },
  { key: 'evaluaciones', label: 'Evaluaciones', icon: Star },
  { key: 'facturacion', label: 'Facturación', icon: Receipt },
  { key: 'configuracion', label: 'Configuración', icon: Settings },
];

/* ── Component ─────────────────────────────────────────────────────────── */
const DashboardEmpresario = () => {
  const { user } = useAuth();
  const [activeNav, setActiveNav] = useState('inicio');

  const displayName = user?.nombre || 'David';
  const company = 'TechNova S.A.';

  return (
    <div className="de-shell">
      {/* ── HEADER ──────────────────────────────────────────────────────── */}
      <header className="de-header">
        <div className="de-header-inner">
          <div className="de-header-left">
            <a href="/" className="de-brand" onClick={(e) => { e.preventDefault(); }}>
              <img src="/Imgs/Logotipo/Digital/FWD - Logotipo.svg" alt="FWD Logotipo" className="h-7 w-auto" />
              <span className="de-brand-tagline">Talento que impulsa tu innovación</span>
            </a>

            <nav className="de-nav">
              <a href="#" className="de-nav-link active" onClick={(e) => e.preventDefault()}>
                <Home size={16} />
                Inicio
              </a>
              <a href="#" className="de-nav-link" onClick={(e) => e.preventDefault()}>
                <FolderOpen size={16} />
                Mis Proyectos
              </a>
              <a href="#" className="de-nav-link" onClick={(e) => e.preventDefault()}>
                <Search size={16} />
                Buscar Talento
              </a>
              <a href="#" className="de-nav-link" onClick={(e) => e.preventDefault()}>
                <MessageSquare size={16} />
                Mensajes
                <span className="de-nav-badge">3</span>
              </a>
              <a href="#" className="de-nav-link" onClick={(e) => e.preventDefault()}>
                <Bell size={16} />
                Notificaciones
                <span className="de-nav-badge">5</span>
              </a>
            </nav>
          </div>

          <div className="de-header-right">
            <MenuUsuario
              rutaPerfilCompleto={RUTAS.empresaDashboard}
              items={[
                { id: 'panel', etiqueta: 'Panel de empresa', icono: Briefcase, ruta: RUTAS.empresaDashboard },
                { id: 'postulaciones', etiqueta: 'Postulaciones', icono: FolderOpen, ruta: RUTAS.empresaPostulaciones },
                { id: 'mensajes', etiqueta: 'Mensajes', icono: MessageSquare, ruta: RUTAS.mensajes, badge: '3' },
              ]}
            />
          </div>
        </div>
      </header>

      <div className="de-body">
        {/* ── SIDEBAR ────────────────────────────────────────────────────── */}
        <aside className="de-sidebar">
          <div>
            <nav className="de-sidebar-nav">
              {sidebarItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.key}
                    className={`de-sidebar-link ${activeNav === item.key ? 'active' : ''}`}
                    onClick={() => setActiveNav(item.key)}
                  >
                    <Icon size={18} className="de-sidebar-icon" />
                    {item.label}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Help Card */}
          <div className="de-sidebar-help">
            <p className="de-sidebar-help-title">¿Necesitas ayuda?</p>
            <p className="de-sidebar-help-text">
              Nuestro centro de ayuda está disponible 24/7 para ti.
            </p>
            <a href="#" className="de-sidebar-help-btn" onClick={(e) => e.preventDefault()}>
              <HelpCircle size={14} />
              Ir al Centro de Ayuda
            </a>
          </div>
        </aside>

        {/* ── MAIN ──────────────────────────────────────────────────────── */}
        <main className="de-main">
          {/* ── Hero ──────────────────────────────────────────────────── */}
          <section className="de-hero">
            <div className="de-hero-content">
              <h1 className="de-hero-title">¡Bienvenido, {displayName}! 👋</h1>
              <p className="de-hero-subtitle">¿Qué necesitas desarrollar hoy?</p>
              <p className="de-hero-desc">
                Publica tu proyecto y conecta con el mejor talento de FWD.
              </p>
              <div className="de-hero-actions">
                <button className="de-btn-primary" id="publish-project-btn">
                  <Plus size={16} />
                  Publicar Proyecto
                </button>
                <button className="de-btn-outline" id="create-ai-btn">
                  <Sparkles size={16} />
                  Crear Proyecto con IA
                </button>
              </div>
            </div>
            <div className="de-hero-illustration">
              <div className="de-hero-illus-placeholder">🧑‍💻</div>
            </div>
          </section>

          {/* ── Activity Stats ────────────────────────────────────────── */}
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

          {/* ── Mid Grid: Proyectos / Talento / Ofertas ───────────────── */}
          <div className="de-grid-3">
            {/* — Mis Proyectos Recientes — */}
            <div className="de-panel">
              <div className="de-panel-header">
                <h3 className="de-panel-title">Mis Proyectos Recientes</h3>
                <button className="de-panel-action">Ver todos</button>
              </div>
              {mockProjects.map((p) => (
                <div key={p.id} className="de-project-item">
                  <div className={`de-project-icon-wrap ${p.iconColor}`}>
                    {p.icon}
                  </div>
                  <div className="de-project-info">
                    <div className="de-project-name">
                      {p.name}
                      <span className={`de-badge ${p.statusType}`}>{p.status}</span>
                    </div>
                    <p className="de-project-meta">{p.meta}</p>
                  </div>
                  <div className="de-project-action">
                    <button className="de-project-btn">{p.action}</button>
                    <button className="de-project-menu" aria-label="Más opciones">
                      <MoreVertical size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* — Talento Recomendado por IA — */}
            <div className="de-panel">
              <div className="de-panel-header">
                <h3 className="de-panel-title">Talento Recomendado por IA</h3>
                <button className="de-panel-action">Ver más</button>
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
                    <p className="de-talent-rating">
                      <span className="de-talent-star">★</span>
                      {t.rating} ({t.projects} proyectos)
                    </p>
                  </div>
                  <div className="de-talent-match">
                    <span className="de-talent-match-pct">{t.match}%</span>
                    <span className="de-talent-match-label">Coincidencia</span>
                  </div>
                </div>
              ))}
              <a href="#" className="de-panel-footer-link" onClick={(e) => e.preventDefault()}>
                Ver más candidatos <ArrowRight size={14} />
              </a>
            </div>

            {/* — Ofertas Pendientes — */}
            <div className="de-panel">
              <div className="de-panel-header">
                <h3 className="de-panel-title">
                  Ofertas Pendientes <span className="de-alert-dot" />
                </h3>
                <button className="de-panel-action">Ver todas</button>
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
              <a href="#" className="de-panel-footer-link" onClick={(e) => e.preventDefault()}>
                Revisar todas las ofertas <ArrowRight size={14} />
              </a>
            </div>
          </div>

          {/* ── Bottom Grid: Entregables / Mensajes / Notificaciones ──── */}
          <div className="de-grid-3">
            {/* — Entregables Pendientes — */}
            <div className="de-panel">
              <div className="de-panel-header">
                <h3 className="de-panel-title">Entregables Pendientes</h3>
                <button className="de-panel-action">Ver todos</button>
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
              <a href="#" className="de-panel-footer-link" onClick={(e) => e.preventDefault()}>
                Revisar entregables <ArrowRight size={14} />
              </a>
            </div>

            {/* — Mensajes Recientes — */}
            <div className="de-panel">
              <div className="de-panel-header">
                <h3 className="de-panel-title">Mensajes Recientes</h3>
                <button className="de-panel-action">Ver todos</button>
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
              <a href="#" className="de-panel-footer-link" onClick={(e) => e.preventDefault()}>
                Ir a mensajes <ArrowRight size={14} />
              </a>
            </div>

            {/* — Notificaciones — */}
            <div className="de-panel">
              <div className="de-panel-header">
                <h3 className="de-panel-title">Notificaciones</h3>
                <button className="de-panel-action">Ver todas</button>
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
        </main>
      </div>

      {/* ── Footer ────────────────────────────────────────────────────── */}
      <footer className="de-footer">
        <span className="de-footer-copy">
          © {new Date().getFullYear()} FWD Costa Rica. Todos los derechos reservados.
        </span>
        <div className="de-footer-links">
          <a href="#" className="de-footer-link" onClick={(e) => e.preventDefault()}>Términos y Condiciones</a>
          <a href="#" className="de-footer-link" onClick={(e) => e.preventDefault()}>Política de Privacidad</a>
          <a href="#" className="de-footer-link" onClick={(e) => e.preventDefault()}>Contacto</a>
        </div>
      </footer>
    </div>
  );
};

export default DashboardEmpresario;
