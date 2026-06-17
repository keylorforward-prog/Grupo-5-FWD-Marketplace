import { useCallback, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { adminService } from '../../services/adminService';
import AdminUsuarios from './AdminUsuarios';
import AdminEgresados from './AdminEgresados';
import AdminConfiguracion from './AdminConfiguracion';
import AdminEmpresas from './AdminEmpresas';
import './AdminProfile.css';
import {
  LayoutDashboard,
  Users,
  Building,
  GraduationCap,
  Settings,
  LogOut,
  Bell,
  MoreVertical,
  Clock,
  HelpCircle,
  RefreshCw
} from 'lucide-react';

// Importación de módulos aislados (Corregido para coincidir con la carpeta "components" en minúscula)
import ElementoBarraLateral from '../../components/comun/ElementoBarraLateral';
import TarjetaEstadistica from '../../components/comun/TarjetaEstadistica';
import InsigniaEstado from '../../components/comun/InsigniaEstado';
import LanguageSwitcher from '../../components/comun/LanguageSwitcher';
import { useTranslation } from 'react-i18next';

export default function AdminProfile() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const [cerrandoSesion, setCerrandoSesion] = useState(false);
  const [overviewData, setOverviewData] = useState({
    totalUsuarios: 0,
    totalEstudiantes: 0,
    totalEmpresarios: 0,
    verifiPendientes: 0,
    empresasPendientes: 0,
    proyectosActivos: 0,
    reportesAbiertos: 0,
    actividadReciente: []
  });
  const [overviewLoading, setOverviewLoading] = useState(true);
  const [overviewError, setOverviewError] = useState(null);

  const cargarOverview = useCallback(async ({ mostrarCarga = false } = {}) => {
    if (mostrarCarga) setOverviewLoading(true);
    setOverviewError(null);

    try {
      const response = await adminService.getOverview();
      if (response.success) {
        setOverviewData((actual) => ({ ...actual, ...response.data }));
      }
    } catch (error) {
      console.error('Error fetching admin overview:', error);
      setOverviewError(t('admin.profile.dashboard.errorLoading'));
    } finally {
      if (mostrarCarga) setOverviewLoading(false);
    }
  }, []);

  useEffect(() => {
    let cancelado = false;

    adminService.getOverview()
      .then((response) => {
        if (!cancelado && response.success) {
          setOverviewData((actual) => ({ ...actual, ...response.data }));
        }
      })
      .catch((error) => {
        console.error('Error fetching admin overview:', error);
        if (!cancelado) setOverviewError(t('admin.profile.dashboard.errorLoading'));
      })
      .finally(() => {
        if (!cancelado) setOverviewLoading(false);
      });

    return () => {
      cancelado = true;
    };
  }, []);

  const menuTitles = {
    dashboard: {
      title: t('admin.profile.menu.dashboard.title'),
      subtitle: t('admin.profile.menu.dashboard.subtitle')
    },
    empresas: {
      title: t('admin.profile.menu.empresas.title'),
      subtitle: t('admin.profile.menu.empresas.subtitle')
    },
    egresados: {
      title: t('admin.profile.menu.egresados.title'),
      subtitle: t('admin.profile.menu.egresados.subtitle')
    },
    usuarios: {
      title: t('admin.profile.menu.usuarios.title'),
      subtitle: t('admin.profile.menu.usuarios.subtitle')
    },
    config: {
      title: t('admin.profile.menu.config.title'),
      subtitle: t('admin.profile.menu.config.subtitle')
    }
  };

  const manejarCerrarSesion = async () => {
    setCerrandoSesion(true);
    try {
      await logout();
    } finally {
      setCerrandoSesion(false);
      navigate('/login/admin', { replace: true });
    }
  };

  const encabezado = menuTitles[activeMenu] || menuTitles.dashboard;
  const totalAlertas = overviewData.verifiPendientes + overviewData.empresasPendientes + overviewData.reportesAbiertos;

  const irAAlertas = () => {
    if (overviewData.verifiPendientes > 0) {
      setActiveMenu('egresados');
      return;
    }

    if (overviewData.empresasPendientes > 0) {
      setActiveMenu('empresas');
      return;
    }

    setActiveMenu('dashboard');
  };

  return (
    <div className="admin-shell">
      <header className="admin-topbar">
        <div className="admin-topbar-inner">
          <button className="admin-brand" type="button" onClick={() => setActiveMenu('dashboard')}>
            <img
              className="admin-brand-logo"
              src="/Imgs/Logotipo/Digital/FWD - Logotipo-01.jpg"
              alt="FWD"
              width="104"
              height="53"
              decoding="async"
            />
          </button>

          <nav className="admin-nav" aria-label="Navegacion principal de administracion">
            <button className={`admin-nav-link ${activeMenu === 'dashboard' ? 'active' : ''}`} type="button" onClick={() => setActiveMenu('dashboard')}>
              <LayoutDashboard size={16} />
              {t('admin.profile.nav.dashboard')}
            </button>
            <button className={`admin-nav-link ${activeMenu === 'usuarios' ? 'active' : ''}`} type="button" onClick={() => setActiveMenu('usuarios')}>
              <Users size={16} />
              {t('admin.profile.nav.usuarios')}
            </button>
            <button className={`admin-nav-link ${activeMenu === 'egresados' ? 'active' : ''}`} type="button" onClick={() => setActiveMenu('egresados')}>
              <GraduationCap size={16} />
              {t('admin.profile.nav.egresados')}
            </button>
            <button className={`admin-nav-link ${activeMenu === 'empresas' ? 'active' : ''}`} type="button" onClick={() => setActiveMenu('empresas')}>
              <Building size={16} />
              {t('admin.profile.nav.empresas')}
            </button>
            <button className={`admin-nav-link ${activeMenu === 'config' ? 'active' : ''}`} type="button" onClick={() => setActiveMenu('config')}>
              <Settings size={16} />
              {t('admin.profile.nav.config')}
            </button>
          </nav>

          <div className="admin-topbar-actions">
            <LanguageSwitcher />

            <button className="admin-icon-button" type="button" aria-label="Notificaciones" title="Notificaciones">
              <Bell size={20} />
              <span className="admin-notification-dot" aria-hidden="true" />
            </button>
            <button className="admin-profile-pill" type="button" onClick={() => setActiveMenu('config')}>
              <span className="admin-profile-avatar">AD</span>
              <span className="admin-profile-copy">
                <span className="admin-profile-name">{t('admin.profile.topbar.administrator')}</span>
                <span className="admin-profile-role">{t('admin.profile.topbar.workspace')}</span>
              </span>
            </button>
          </div>
        </div>
      </header>

      <div className="admin-body">
        <aside className="admin-sidebar">
          <div>
            <div className="admin-sidebar-heading">
              <p>{t('admin.profile.sidebar.workspace')}</p>
              <span>{t('admin.profile.sidebar.controlCenter')}</span>
            </div>

            <nav className="admin-sidebar-nav" aria-label="Secciones de administracion">
              <ElementoBarraLateral icon={LayoutDashboard} label={t('admin.profile.nav.dashboard')} isActive={activeMenu === 'dashboard'} onClick={() => setActiveMenu('dashboard')} />
              <ElementoBarraLateral icon={Building} label={t('admin.profile.nav.empresas')} isActive={activeMenu === 'empresas'} onClick={() => setActiveMenu('empresas')} />
              <ElementoBarraLateral icon={GraduationCap} label={t('admin.profile.nav.egresados')} isActive={activeMenu === 'egresados'} onClick={() => setActiveMenu('egresados')} />
              <ElementoBarraLateral icon={Users} label={t('admin.profile.nav.usuarios')} isActive={activeMenu === 'usuarios'} onClick={() => setActiveMenu('usuarios')} />
            </nav>
          </div>

          <div className="admin-sidebar-footer">
            <div className="admin-help-card">
              <p className="admin-help-title">{t('admin.profile.sidebar.helpTitle')}</p>
              <p className="admin-help-text">{t('admin.profile.sidebar.helpText')}</p>
              <button className="admin-help-link" type="button">
                <HelpCircle size={14} />
                {t('admin.profile.sidebar.support')}
              </button>
            </div>
          <ElementoBarraLateral icon={Settings} label={t('admin.profile.nav.config')} isActive={activeMenu === 'config'} onClick={() => setActiveMenu('config')} />
          <button 
            onClick={manejarCerrarSesion}
            className="admin-logout-button"
            type="button"
            disabled={cerrandoSesion}
          >
            <LogOut size={20} /> {cerrandoSesion ? t('admin.profile.sidebar.loggingOut') : t('admin.profile.sidebar.logout')}
          </button>
        </div>
      </aside>

        <main className="admin-main fwd-fondo-decorativo">
          <div className="admin-page-heading">
            <div>
              <span className="admin-eyebrow">Administracion</span>
              <h1>{encabezado.title}</h1>
              <p>{encabezado.subtitle}</p>
            </div>

            <div className="admin-heading-actions">
              <button className="admin-secondary-button" type="button" onClick={irAAlertas}>
                <Bell size={16} />
                {totalAlertas} {t('admin.profile.dashboard.alerts')}
              </button>
            </div>
          </div>

          <div className="admin-content">
          {activeMenu === 'dashboard' && (
            <>
              {overviewError && (
                <div className="admin-config-message error">
                  {overviewError}
                </div>
              )}

              <section className="admin-stats-grid">
                <TarjetaEstadistica title={t('admin.profile.dashboard.totalUsers')} value={overviewLoading ? '...' : overviewData.totalUsuarios} icon={Users} trend={t('admin.profile.dashboard.trendGlobal')} isPositive={true} colorClass="text-accent" />
                <TarjetaEstadistica title={t('admin.profile.dashboard.pendingCompanies')} value={overviewLoading ? '...' : overviewData.empresasPendientes} icon={Building} trend={t('admin.profile.dashboard.trendRevision')} isPositive={overviewData.empresasPendientes === 0} colorClass="text-magenta" />
                <TarjetaEstadistica title={t('admin.profile.dashboard.pendingVerifications')} value={overviewLoading ? '...' : overviewData.verifiPendientes} icon={Clock} trend={t('admin.profile.dashboard.trendPending')} isPositive={overviewData.verifiPendientes === 0} colorClass="text-warning" />
              </section>

              <section className="admin-panel">
                <div className="admin-panel-header">
                  <h3>{t('admin.profile.dashboard.recentActivity')}</h3>
                  <button className="admin-text-button" type="button" onClick={() => cargarOverview({ mostrarCarga: true })} disabled={overviewLoading}>
                    <RefreshCw size={15} />
                    {t('admin.profile.dashboard.refresh')}
                  </button>
                </div>
                
                <div className="admin-table-wrap">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>{t('admin.profile.dashboard.table.entity')}</th>
                        <th>{t('admin.profile.dashboard.table.action')}</th>
                        <th>{t('admin.profile.dashboard.table.date')}</th>
                        <th>{t('admin.profile.dashboard.table.status')}</th>
                        <th className="admin-table-actions">{t('admin.profile.dashboard.table.details')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {overviewLoading ? (
                        <tr><td colSpan="5" className="admin-muted-cell">{t('admin.profile.dashboard.loadingActivity')}</td></tr>
                      ) : overviewData.actividadReciente.length === 0 ? (
                        <tr><td colSpan="5" className="admin-muted-cell">{t('admin.profile.dashboard.noActivity')}</td></tr>
                      ) : (
                        overviewData.actividadReciente.map((evento) => (
                          <tr key={evento.id_auditoria}>
                            <td>
                              <div className="admin-entity-cell">
                                <span className="admin-entity-icon accent">
                                  {evento.entidad === 'PerfilEstudiante' ? <GraduationCap size={14} /> : <Building size={14} />}
                                </span>
                                <span>{evento.actor}</span>
                              </div>
                            </td>
                            <td>{evento.accion}</td>
                            <td>{new Date(evento.fecha).toLocaleString(t('es-CR'), { dateStyle: 'medium', timeStyle: 'short' })}</td>
                            <td><InsigniaEstado status={t('admin.profile.dashboard.statusCompleted')} /></td>
                            <td className="admin-table-actions">
                              <button className="admin-row-action" type="button" aria-label="Ver detalles" title={evento.entidad}>
                                <MoreVertical size={18} />
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </section>
            </>
          )}

          {activeMenu === 'usuarios' && <AdminUsuarios onAdminChange={cargarOverview} />}
          {activeMenu === 'egresados' && <AdminEgresados onAdminChange={cargarOverview} />}
          {activeMenu === 'empresas' && <AdminEmpresas onAdminChange={cargarOverview} />}
          {activeMenu === 'config' && <AdminConfiguracion onAdminChange={cargarOverview} />}
          
        </div>
      </main>
      </div>
    </div>
  );
}
