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
import LanguageSwitcher from '../../../../components/comun/LanguageSwitcher';
import { useTranslation } from 'react-i18next';

import fwdDarkLogo from '../../../../assets/fwdcrdark.png';

export default function DashboardLayout({ activePage, children }) {
  const { t } = useTranslation();
  const navLinks = [
    { label: t('empresaLayout.nav.inicio'), icon: Home, path: '/DashboardEmpresario', key: 'inicio' },
    { label: t('empresaLayout.nav.proyectos'), icon: FolderOpen, path: '/DashboardEmpresario/proyectos', key: 'proyectos' },
    { label: 'Postulaciones', icon: Users, path: '/empresa/postulaciones', key: 'postulaciones' },
    { label: t('empresaLayout.nav.talento'), icon: Search, path: '/DashboardEmpresario/talento', key: 'talento' },
    { label: t('empresaLayout.nav.mensajes'), icon: MessageSquare, path: '/DashboardEmpresario/mensajes', key: 'mensajes' },
    { label: t('empresaLayout.nav.notificaciones'), icon: Bell, path: '/DashboardEmpresario/notificaciones', key: 'notificaciones' },
  ];

  const sidebarItems = [
    { key: 'inicio', label: t('empresaLayout.sidebar.inicio'), icon: Home, path: '/DashboardEmpresario' },
    { key: 'proyectos', label: t('empresaLayout.sidebar.proyectos'),    icon: FolderOpen,  path: '/DashboardEmpresario/proyectos' },
    { key: 'empleos',   label: t('empresaLayout.sidebar.empleos'), icon: Briefcase,   path: '/DashboardEmpresario/empleos' },
    { key: 'postulaciones', label: 'Postulaciones', icon: Users, path: '/empresa/postulaciones' },
    { key: 'ofertas',   label: t('empresaLayout.sidebar.ofertas'), icon: FileText,    path: '/DashboardEmpresario/ofertas' },
    { key: 'entregables', label: t('empresaLayout.sidebar.entregables'), icon: Package, path: '/DashboardEmpresario/entregables' },
    { key: 'mensajes', label: t('empresaLayout.sidebar.mensajes'), icon: MessageSquare, path: '/DashboardEmpresario/mensajes' },
    { key: 'talento', label: t('empresaLayout.sidebar.talento'), icon: Users, path: '/DashboardEmpresario/talento' },
    { key: 'historial', label: t('empresaLayout.sidebar.historial'), icon: History, path: '/DashboardEmpresario/historial' },
    { key: 'evaluaciones', label: t('empresaLayout.sidebar.evaluaciones'), icon: Star, path: '/DashboardEmpresario/evaluaciones' },
    { key: 'facturacion', label: t('empresaLayout.sidebar.facturacion'), icon: Receipt, path: '/DashboardEmpresario/facturacion' },
    { key: 'configuracion', label: t('empresaLayout.sidebar.configuracion'), icon: Settings, path: '/SettingsEmpresa' },
  ];

  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuPerfilAbierto, setMenuPerfilAbierto] = useState(false);
  const [cerrandoSesion, setCerrandoSesion] = useState(false);
  const [confirmandoCerrarSesion, setConfirmandoCerrarSesion] = useState(false);
  const [tema, setTema] = useState(() => {
    if (typeof document === 'undefined') return 'light';
    return document.documentElement.dataset.theme || localStorage.getItem('tema') || 'light';
  });
  const menuPerfilRef = useRef(null);
  const displayName = user?.nombre_empresa || user?.nombre || 'Empresa';
  const profileRole = t('empresaLayout.profile.role');
  const company = profileRole.toUpperCase();
  const email = user?.correo || user?.email || 'empresa@fwd.com';
  const avatar = user?.foto_perfil || '/Imgs/Logotipo/Digital/Sintesis/FWD - Sintesis-01.png';

  const profileItems = [
    { key: 'perfil', label: t('empresaLayout.profile.perfil'), icon: User, path: '/DashboardEmpresario/perfil' },
    { key: 'proyectos', label: t('empresaLayout.profile.proyectos'), icon: FolderOpen, path: '/DashboardEmpresario/proyectos' },
    { key: 'configuracion', label: t('empresaLayout.profile.configuracion'), icon: Settings, path: '/SettingsEmpresa' },
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

  const ejecutarCierre = async () => {
    setConfirmandoCerrarSesion(false);
    setMenuPerfilAbierto(false);
    setCerrandoSesion(true);
    try {
      await logout();
    } finally {
      setCerrandoSesion(false);
      navigate('/login', { replace: true });
    }
  };

  const manejarCerrarSesion = () => setConfirmandoCerrarSesion(true);

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
                src={tema === 'dark' ? fwdDarkLogo : "/Imgs/Logotipo/Digital/FWD - Logotipo-01.jpg"}
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
            <LanguageSwitcher />
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
                      <span className="de-profile-menu-status" aria-label={t('empresaLayout.profile.online')} />
                    </div>
                    <div className="de-profile-menu-user">
                      <p className="de-profile-menu-name">{displayName}</p>
                      <p className="de-profile-menu-email">{email}</p>
                      <span className="de-profile-menu-role">{profileRole}</span>
                    </div>
                  </div>

                  <button
                    className="de-profile-menu-primary"
                    type="button"
                    onClick={() => navegarDesdeMenuPerfil('/DashboardEmpresario/perfil')}
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
        <aside className="de-sidebar">
          <div className="de-sidebar-profile" onClick={() => setMenuPerfilAbierto((abierto) => !abierto)}>
            <img src={avatar} alt={displayName} className="de-sidebar-avatar" />
            <div className="de-sidebar-profile-info">
              <span className="de-sidebar-name">{displayName}</span>
              <span className="de-sidebar-role">{profileRole}</span>
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

        <main className="de-main fwd-fondo-decorativo">
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

      {confirmandoCerrarSesion && (
        <div className="de-confirm-overlay" onClick={() => setConfirmandoCerrarSesion(false)}>
          <div className="de-confirm-modal" onClick={(e) => e.stopPropagation()}>
            <div className="de-confirm-icon"><LogOut size={28} /></div>
            <p>{t('empresaLayout.profile.confirmTitle')}</p>
            <p className="de-confirm-sub">{t('empresaLayout.profile.confirmDesc')}</p>
            <div className="de-confirm-actions">
              <button className="de-btn-outline" type="button" onClick={() => setConfirmandoCerrarSesion(false)}>
                {t('empresaLayout.profile.cancel')}
              </button>
              <button className="de-btn-primary danger" type="button" onClick={ejecutarCierre} disabled={cerrandoSesion}>
                {cerrandoSesion ? t('empresaLayout.profile.loggingOut') : t('empresaLayout.profile.confirm')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
