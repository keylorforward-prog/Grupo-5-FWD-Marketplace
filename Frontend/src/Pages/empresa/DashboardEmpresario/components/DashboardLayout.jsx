import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../../context/AuthContext';
import {
  Bell,
  ChevronDown,
  FileText,
  FolderOpen,
  HelpCircle,
  History,
  Home,
  MessageSquare,
  Package,
  Receipt,
  Search,
  Settings,
  Star,
  Users,
} from 'lucide-react';

const navLinks = [
  { label: 'Inicio', icon: Home, path: '/DashboardEmpresario', key: 'inicio' },
  { label: 'Mis Proyectos', icon: FolderOpen, path: '/DashboardEmpresario/proyectos', key: 'proyectos' },
  { label: 'Buscar Talento', icon: Search, path: '/DashboardEmpresario/talento', key: 'talento' },
  { label: 'Mensajes', icon: MessageSquare, path: '/DashboardEmpresario/mensajes', key: 'mensajes', badge: 3 },
  { label: 'Notificaciones', icon: Bell, path: '/DashboardEmpresario/notificaciones', key: 'notificaciones', badge: 5 },
];

const sidebarItems = [
  { key: 'inicio', label: 'Inicio', icon: Home, path: '/DashboardEmpresario' },
  { key: 'proyectos', label: 'Mis Proyectos', icon: FolderOpen, path: '/DashboardEmpresario/proyectos' },
  { key: 'ofertas', label: 'Ofertas Recibidas', icon: FileText, path: '/DashboardEmpresario/ofertas' },
  { key: 'entregables', label: 'Entregables', icon: Package, path: '/DashboardEmpresario/entregables' },
  { key: 'mensajes', label: 'Mensajes', icon: MessageSquare, path: '/DashboardEmpresario/mensajes' },
  { key: 'talento', label: 'Talento Recomendado', icon: Users, path: '/DashboardEmpresario/talento' },
  { key: 'historial', label: 'Historial de Proyectos', icon: History, path: '/DashboardEmpresario/historial' },
  { key: 'evaluaciones', label: 'Evaluaciones', icon: Star, path: '/DashboardEmpresario/evaluaciones' },
  { key: 'facturacion', label: 'Facturacion', icon: Receipt, path: '/DashboardEmpresario/facturacion' },
  { key: 'configuracion', label: 'Configuracion', icon: Settings, path: '/DashboardEmpresario/configuracion' },
];

export default function DashboardLayout({ activePage, children }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const displayName = user?.nombre || 'David';
  const company = 'TechNova S.A.';

  return (
    <div className="de-shell">
      <header className="de-header">
        <div className="de-header-inner">
          <div className="de-header-left">
            <button className="de-brand de-link-button" type="button" onClick={() => navigate('/DashboardEmpresario')}>
              <span className="de-brand-logo">FWD</span>
              <span className="de-brand-tagline">Talento que impulsa tu innovacion</span>
            </button>

            <nav className="de-nav">
              {navLinks.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.key}
                    className={`de-nav-link de-link-button ${activePage === item.key ? 'active' : ''}`}
                    type="button"
                    onClick={() => navigate(item.path)}
                  >
                    <Icon size={16} />
                    {item.label}
                    {item.badge && <span className="de-nav-badge">{item.badge}</span>}
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="de-header-right">
            <button className="de-header-profile" type="button" onClick={() => navigate('/admin')}>
              <img src="https://i.pravatar.cc/100?img=68" alt="Avatar" className="de-header-avatar" />
              <div className="de-header-profile-info">
                <span className="de-header-company">{company}</span>
                <span className="de-header-username">{displayName}</span>
              </div>
              <ChevronDown size={14} className="de-profile-chevron" />
            </button>
          </div>
        </div>
      </header>

      <div className="de-body">
        <aside className="de-sidebar">
          <div>
            <nav className="de-sidebar-nav">
              {sidebarItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.key}
                    className={`de-sidebar-link ${activePage === item.key ? 'active' : ''}`}
                    type="button"
                    onClick={() => navigate(item.path)}
                  >
                    <Icon size={18} className="de-sidebar-icon" />
                    {item.label}
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="de-sidebar-help">
            <p className="de-sidebar-help-title">Necesitas ayuda?</p>
            <p className="de-sidebar-help-text">Nuestro centro de ayuda esta disponible 24/7 para ti.</p>
            <button className="de-sidebar-help-btn" type="button" onClick={() => navigate('/DashboardEmpresario/ayuda')}>
              <HelpCircle size={14} />
              Ir al Centro de Ayuda
            </button>
          </div>
        </aside>

        <main className="de-main">{children}</main>
      </div>

      <footer className="de-footer">
        <span className="de-footer-copy">
          © {new Date().getFullYear()} FWD Costa Rica. Todos los derechos reservados.
        </span>
        <div className="de-footer-links">
          <button className="de-footer-link de-link-button" type="button" onClick={() => navigate('/DashboardEmpresario/ayuda')}>Terminos y Condiciones</button>
          <button className="de-footer-link de-link-button" type="button" onClick={() => navigate('/DashboardEmpresario/ayuda')}>Politica de Privacidad</button>
          <button className="de-footer-link de-link-button" type="button" onClick={() => navigate('/DashboardEmpresario/ayuda')}>Contacto</button>
        </div>
      </footer>
    </div>
  );
}
