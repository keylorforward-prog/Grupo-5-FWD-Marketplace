import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../../context/AuthContext';
import CampanaNotificaciones from '../../../../components/notificaciones/CampanaNotificaciones';
import {
  Bell,
  Briefcase,
  ChevronDown,
  FileText,
  FolderOpen,
  HelpCircle,
  History,
  Home,
  LogOut,
  MessageSquare,
  Moon,
  Package,
  Receipt,
  Search,
  Settings,
  Star,
  Sun,
  User,
  Users,
} from 'lucide-react';

const navLinks = [
  { label: 'Inicio', icon: Home, path: '/DashboardEmpresario', key: 'inicio' },
  { label: 'Mis Proyectos', icon: FolderOpen, path: '/DashboardEmpresario/proyectos', key: 'proyectos' },
  { label: 'Buscar Talento', icon: Search, path: '/DashboardEmpresario/talento', key: 'talento' },
  { label: 'Mensajes', icon: MessageSquare, path: '/DashboardEmpresario/mensajes', key: 'mensajes' },
  { label: 'Notificaciones', icon: Bell, path: '/DashboardEmpresario/notificaciones', key: 'notificaciones' },
];

const sidebarItems = [
  { key: 'inicio', label: 'Inicio', icon: Home, path: '/DashboardEmpresario' },
  { key: 'proyectos', label: 'Mis Proyectos',    icon: FolderOpen,  path: '/DashboardEmpresario/proyectos' },
  { key: 'empleos',   label: 'Ofertas de Empleo', icon: Briefcase,   path: '/DashboardEmpresario/empleos' },
  { key: 'ofertas',   label: 'Ofertas Recibidas', icon: FileText,    path: '/DashboardEmpresario/ofertas' },
  { key: 'entregables', label: 'Entregables', icon: Package, path: '/DashboardEmpresario/entregables' },
  { key: 'mensajes', label: 'Mensajes', icon: MessageSquare, path: '/DashboardEmpresario/mensajes' },
  { key: 'talento', label: 'Talento Recomendado', icon: Users, path: '/DashboardEmpresario/talento' },
  { key: 'historial', label: 'Historial de Proyectos', icon: History, path: '/DashboardEmpresario/historial' },
  { key: 'evaluaciones', label: 'Evaluaciones', icon: Star, path: '/DashboardEmpresario/evaluaciones' },
  { key: 'facturacion', label: 'Facturacion', icon: Receipt, path: '/DashboardEmpresario/facturacion' },
  { key: 'configuracion', label: 'Configuracion', icon: Settings, path: '/SettingsEmpresa' },
];

export default function DashboardLayout({ activePage, children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuPerfilAbierto, setMenuPerfilAbierto] = useState(false);
  const [cerrandoSesion, setCerrandoSesion] = useState(false);
  const [tema, setTema] = useState(() => {
    if (typeof document === 'undefined') return 'light';
    return document.documentElement.dataset.theme || localStorage.getItem('tema') || 'light';
  });
  const menuPerfilRef = useRef(null);
  const displayName = user?.nombre || 'Empresa';
  const company = user?.empresa || user?.nombre_empresa || user?.nombre || 'Empresa';
  const email = user?.correo || user?.email || 'empresa@fwd.com';
  const avatar = user?.foto_perfil || '/Imgs/Logotipo/Digital/Sintesis/FWD - Sintesis-01.png';

  const profileItems = [
    { key: 'perfil', label: 'Mi Perfil', icon: User, path: '/DashboardEmpresario/perfil' },
    { key: 'proyectos', label: 'Mis proyectos', icon: FolderOpen, path: '/DashboardEmpresario/proyectos' },
    { key: 'configuracion', label: 'Configuración', icon: Settings, path: '/SettingsEmpresa' },
  ];

  useEffect(() => {
    document.documentElement.dataset.theme = tema;
    localStorage.setItem('tema', tema);
  }, [tema]);

  useEffect(() => {
    if (!menuPerfilAbierto) return undefined;

    const manejarClickAfuera = (evento) => {
      if (menuPerfilRef.current && !menuPerfilRef.current.contains(evento.target)) {
        setMenuPerfilAbierto(false);
      }
    };

    const manejarTecla = (evento) => {
      if (evento.key === 'Escape') setMenuPerfilAbierto(false);
    };

    document.addEventListener('mousedown', manejarClickAfuera);
    document.addEventListener('keydown', manejarTecla);

    return () => {
      document.removeEventListener('mousedown', manejarClickAfuera);
      document.removeEventListener('keydown', manejarTecla);
    };
  }, [menuPerfilAbierto]);

  const manejarCerrarSesion = async () => {
    setCerrandoSesion(true);
    try {
      await logout();
    } finally {
      setMenuPerfilAbierto(false);
      setCerrandoSesion(false);
      navigate('/login', { replace: true });
    }
  };

  const navegarDesdeMenuPerfil = (ruta) => {
    setMenuPerfilAbierto(false);
    navigate(ruta);
  };

  const alternarTema = () => setTema((valorActual) => (valorActual === 'light' ? 'dark' : 'light'));

  return (
    <div className="de-shell">
      <header className="de-header">
        <div className="de-header-inner">
          <div className="de-header-left">
            <button className="de-brand de-link-button" type="button" onClick={() => navigate('/DashboardEmpresario')}>
              <img
                className="de-brand-logo"
                src="/Imgs/Logotipo/Digital/FWD - Logotipo-01.jpg"
                alt="FWD"
                width="104"
                height="53"
                decoding="async"
                fetchPriority="high"
              />
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
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="de-header-right">
            <CampanaNotificaciones rutaNotificaciones="/DashboardEmpresario/notificaciones" />

            <div className="de-header-profile-wrapper" ref={menuPerfilRef}>
              <button
                className={`de-header-profile ${menuPerfilAbierto ? 'active' : ''}`}
                type="button"
                onClick={() => setMenuPerfilAbierto((abierto) => !abierto)}
                aria-haspopup="menu"
                aria-expanded={menuPerfilAbierto}
              >
                <img src={avatar} alt="Avatar" className="de-header-avatar" />
                <div className="de-header-profile-info">
                  <span className="de-header-company">{company}</span>
                  <span className="de-header-username">{displayName}</span>
                </div>
                <ChevronDown size={14} className="de-profile-chevron" />
              </button>

              {menuPerfilAbierto && (
                <div className="de-profile-menu" role="menu">
                  <div className="de-profile-menu-header">
                    <div className="de-profile-menu-avatar-wrap">
                      <img src={avatar} alt={displayName} className="de-profile-menu-avatar" />
                      <span className="de-profile-menu-status" aria-label="En línea" />
                    </div>
                    <div className="de-profile-menu-user">
                      <p className="de-profile-menu-name">{displayName}</p>
                      <p className="de-profile-menu-email">{email}</p>
                      <span className="de-profile-menu-role">Empresa</span>
                    </div>
                  </div>

                  <button
                    className="de-profile-menu-primary"
                    type="button"
                    onClick={() => navegarDesdeMenuPerfil('/DashboardEmpresario/perfil')}
                    role="menuitem"
                  >
                    Ver perfil completo
                  </button>

                  <div className="de-profile-menu-separator" />

                  {profileItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.key}
                        className="de-profile-menu-item"
                        type="button"
                        onClick={() => navegarDesdeMenuPerfil(item.path)}
                        role="menuitem"
                      >
                        <span className="de-profile-menu-icon"><Icon size={18} /></span>
                        <span>{item.label}</span>
                      </button>
                    );
                  })}

                  <div className="de-profile-menu-separator" />

                  <button
                    className="de-profile-menu-item"
                    type="button"
                    onClick={alternarTema}
                    role="menuitem"
                  >
                    <span className="de-profile-menu-icon">
                      {tema === 'light' ? <Moon size={18} /> : <Sun size={18} />}
                    </span>
                    <span>Tema {tema === 'light' ? 'oscuro' : 'claro'}</span>
                    <span className="de-profile-menu-switch" data-active={tema === 'dark'}>
                      <span className="de-profile-menu-switch-dot" />
                    </span>
                  </button>

                  <button
                    className="de-profile-menu-item"
                    type="button"
                    onClick={() => navegarDesdeMenuPerfil('/DashboardEmpresario/ayuda')}
                    role="menuitem"
                  >
                    <span className="de-profile-menu-icon"><HelpCircle size={18} /></span>
                    <span>Soporte y ayuda</span>
                  </button>

                  <div className="de-profile-menu-separator" />

                  <button
                    className="de-profile-menu-item danger"
                    type="button"
                    onClick={manejarCerrarSesion}
                    disabled={cerrandoSesion}
                    role="menuitem"
                  >
                    <span className="de-profile-menu-icon"><LogOut size={18} /></span>
                    <span>{cerrandoSesion ? 'Cerrando sesión...' : 'Cerrar sesión'}</span>
                  </button>
                </div>
              )}
            </div>
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

        <main className="de-main fwd-fondo-decorativo">{children}</main>
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
