import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../../context/AuthContext';
import {
  Bell,
  ChevronDown,
  Compass,
  FileText,
  FolderOpen,
  HelpCircle,
  History,
  Home,
  LogOut,
  MessageSquare,
  Moon,
  Settings,
  Sun,
  User,
} from 'lucide-react';
import LanguageSwitcher from '../../../../components/comun/LanguageSwitcher';
import { useTranslation } from 'react-i18next';
import { RUTAS } from '../../../../routes/rutas';
import '../../../../Pages/empresa/DashboardEmpresario/DashboardEmpresario.css';
import '../styles/DashboardEgresado.css';

export default function DashboardLayout({ children }) {
  const { t } = useTranslation();

  const sidebarItems = [
    { key: 'inicio', label: t('egresadoLayout.sidebar.inicio'), icon: Home, path: '/egresado/dashboard' },
    { key: 'explorar', label: t('egresadoLayout.sidebar.explorar'), icon: Compass, path: '/egresado/dashboard/explorar' },
    { key: 'postulaciones', label: t('egresadoLayout.sidebar.postulaciones'), icon: FileText, path: '/egresado/dashboard/postulaciones' },
    { key: 'proyectos', label: t('egresadoLayout.sidebar.proyectos'), icon: FolderOpen, path: '/egresado/dashboard/proyectos' },
    { key: 'historial', label: t('egresadoLayout.sidebar.historial'), icon: History, path: '/egresado/dashboard/historial' },
    { key: 'mensajes', label: t('egresadoLayout.sidebar.mensajes'), icon: MessageSquare, path: '/egresado/dashboard/mensajes' },
    { key: 'notificaciones', label: t('egresadoLayout.sidebar.notificaciones'), icon: Bell, path: '/egresado/dashboard/notificaciones' },
    { key: 'perfil', label: t('egresadoLayout.sidebar.perfil'), icon: User, path: RUTAS.egresadoPerfil },
    { key: 'configuracion', label: t('egresadoLayout.sidebar.configuracion'), icon: Settings, path: RUTAS.egresadoConfiguracion },
  ];

  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuPerfilAbierto, setMenuPerfilAbierto] = useState(false);
  const [cerrandoSesion, setCerrandoSesion] = useState(false);
  const [tema, setTema] = useState(() => {
    if (typeof document === 'undefined') return 'light';
    return document.documentElement.dataset.theme || localStorage.getItem('tema') || 'light';
  });
  const menuPerfilRef = useRef(null);

  const rutaActual = location.pathname;
  const activePage = sidebarItems.find((item) => {
    if (item.path === '/egresado/dashboard') return rutaActual === '/egresado/dashboard';
    return rutaActual.startsWith(item.path);
  })?.key || 'inicio';

  const perfilEgresadoCache = (() => {
    try { return JSON.parse(localStorage.getItem('perfilEgresado')); }
    catch { return null; }
  })();
  const displayName = user?.nombre || perfilEgresadoCache?.nombre || t('egresadoLayout.profile.role');
  const tituloFwd = user?.titulo_fwd || user?.rol || 'ESTUDIANTE';
  const email = user?.correo || user?.email || 'egresado@fwd.com';
  const avatar = user?.foto_perfil || perfilEgresadoCache?.avatar || '/Imgs/Logotipo/Digital/Sintesis/FWD - Sintesis-01.png';

  const profileItems = [
    { key: 'perfil', label: t('egresadoLayout.profile.perfil'), icon: User, path: RUTAS.egresadoPerfil },
    { key: 'configuracion', label: t('egresadoLayout.profile.configuracion'), icon: Settings, path: RUTAS.egresadoConfiguracion },
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
            <button className="de-brand de-link-button" type="button" onClick={() => navigate('/egresado/dashboard')}>
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
          </div>

          <div className="de-header-right">
            <LanguageSwitcher />

            <button
              className="de-header-bell de-link-button"
              type="button"
              onClick={() => navigate('/egresado/dashboard/notificaciones')}
              aria-label="Notificaciones"
              title="Notificaciones"
            >
              <Bell size={20} />
              <span className="de-header-bell-dot" aria-hidden="true" />
            </button>

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
                  <span className="de-header-company">{displayName}</span>
                  <span className="de-header-username">{tituloFwd}</span>
                </div>
                <ChevronDown size={14} className="de-profile-chevron" />
              </button>

              {menuPerfilAbierto && (
                <div className="de-profile-menu" role="menu">
                  <div className="de-profile-menu-header">
                    <div className="de-profile-menu-avatar-wrap">
                      <img src={avatar} alt={displayName} className="de-profile-menu-avatar" />
                      <span className="de-profile-menu-status" aria-label={t('empresaLayout.profile.online')} />
                    </div>
                    <div className="de-profile-menu-user">
                      <p className="de-profile-menu-name">{displayName}</p>
                      <p className="de-profile-menu-email">{email}</p>
                      <span className="de-profile-menu-role">{t('egresadoLayout.profile.role')}</span>
                    </div>
                  </div>

                  <button
                    className="de-profile-menu-primary"
                    type="button"
                    onClick={() => navegarDesdeMenuPerfil(RUTAS.egresadoPerfil)}
                    role="menuitem"
                  >
                    {t('empresaLayout.profile.fullProfile')}
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
                    <span>{tema === 'light' ? t('empresaLayout.profile.themeDark') : t('empresaLayout.profile.themeLight')}</span>
                    <span className="de-profile-menu-switch" data-active={tema === 'dark'}>
                      <span className="de-profile-menu-switch-dot" />
                    </span>
                  </button>

                  <button
                    className="de-profile-menu-item"
                    type="button"
                    onClick={() => navegarDesdeMenuPerfil('/soporte')}
                    role="menuitem"
                  >
                    <span className="de-profile-menu-icon"><HelpCircle size={18} /></span>
                    <span>{t('empresaLayout.profile.support')}</span>
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
                    <span>{cerrandoSesion ? t('empresaLayout.profile.loggingOut') : t('empresaLayout.profile.logout')}</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="de-body">
        {!rutaActual.startsWith('/egresado/dashboard/proyecto/') && (
          <aside className="de-sidebar">
            <div className="de-sidebar-profile" onClick={() => setMenuPerfilAbierto((abierto) => !abierto)}>
              <img src={avatar} alt={displayName} className="de-sidebar-avatar" />
              <div className="de-sidebar-profile-info">
                <span className="de-sidebar-name">{displayName}</span>
                <span className="de-sidebar-role">{tituloFwd}</span>
              </div>
            </div>
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
              <p className="de-sidebar-help-title">{t('empresaLayout.help.title')}</p>
              <p className="de-sidebar-help-text">{t('empresaLayout.help.text')}</p>
              <button className="de-sidebar-help-btn" type="button" onClick={() => navigate('/soporte')}>
                <HelpCircle size={14} />
                {t('empresaLayout.help.button')}
              </button>
            </div>
          </aside>
        )}

        <main className={`de-main fwd-fondo-decorativo${rutaActual.startsWith('/egresado/dashboard/proyecto/') ? ' de-main--full' : ''}`}>
          <div className="de-main-content">{children}</div>
          <footer className="de-footer">
            <span className="de-footer-copy">
              {t('empresaLayout.footer.copy').replace('{{year}}', new Date().getFullYear())}
            </span>
            <div className="de-footer-links">
              <button className="de-footer-link de-link-button" type="button" onClick={() => navigate('/terminos')}>{t('empresaLayout.footer.terms')}</button>
              <button className="de-footer-link de-link-button" type="button" onClick={() => navigate('/privacidad')}>{t('empresaLayout.footer.privacy')}</button>
              <button className="de-footer-link de-link-button" type="button" onClick={() => navigate('/contacto')}>{t('empresaLayout.footer.contact')}</button>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
}
