import { useCallback, useMemo, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import { adminService } from '../../services/adminService';
import { Suspense, lazy } from 'react';

const AdminUsuarios = lazy(() => import('./AdminUsuarios'));
const AdminEgresados = lazy(() => import('./AdminEgresados'));
const AdminConfiguracion = lazy(() => import('./AdminConfiguracion'));
const AdminEmpresas = lazy(() => import('./AdminEmpresas'));
const AdminProyectos = lazy(() => import('./AdminProyectos'));
const AdminReportes = lazy(() => import('./AdminReportes'));
const AdminAuditoria = lazy(() => import('./AdminAuditoria'));
const AdminSistema = lazy(() => import('./AdminSistema'));
import AdminDetalleAuditoriaModal from './components/AdminDetalleAuditoriaModal';
import AdminBusquedaGlobal from './components/AdminBusquedaGlobal';
import AdminCampanaNotificaciones from './components/AdminCampanaNotificaciones';
import './AdminProfile.css';
import {
  LayoutDashboard,
  Users,
  Building,
  FolderKanban,
  GraduationCap,
  Settings,
  LogOut,
  Bell,
  MoreVertical,
  Clock,
  HelpCircle,
  RefreshCw,
  ShieldAlert,
  ClipboardList,
  Activity
} from 'lucide-react';

// Importación de módulos aislados (Corregido para coincidir con la carpeta "components" en minúscula)
import ElementoBarraLateral from '../../components/comun/ElementoBarraLateral';
import TarjetaEstadistica from '../../components/comun/TarjetaEstadistica';
import InsigniaEstado from '../../components/comun/InsigniaEstado';
import LanguageSwitcher from '../../components/comun/LanguageSwitcher';

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
  const [modalAuditoria, setModalAuditoria] = useState({ open: false, evento: null });

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
      setOverviewError(t('admin.messages.loadOverviewError'));
    } finally {
      if (mostrarCarga) setOverviewLoading(false);
    }
  }, [t]);

  useEffect(() => {
    cargarOverview({ mostrarCarga: true });
  }, [cargarOverview]);

  const menuTitles = useMemo(() => ({
    dashboard: {
      title: t('admin.dashboard.title'),
      subtitle: t('admin.dashboard.subtitle')
    },
    empresas: {
      title: t('admin.companies.menuTitle'),
      subtitle: t('admin.companies.subtitle')
    },
    proyectos: {
      title: 'Proyectos',
      subtitle: 'Visualiza y gestiona los proyectos publicados por las empresas.'
    },
    egresados: {
      title: t('admin.graduates.menuTitle'),
      subtitle: t('admin.graduates.subtitle')
    },
    usuarios: {
      title: t('admin.users.menuTitle'),
      subtitle: t('admin.users.subtitle')
    },
    reportes: {
      title: 'Reportes y denuncias',
      subtitle: 'Revisa denuncias, resuelve casos y deja trazabilidad.'
    },
    auditoria: {
      title: 'Auditoría completa',
      subtitle: 'Consulta acciones sensibles, actores y metadata.'
    },
    sistema: {
      title: 'Salud del sistema',
      subtitle: 'Estado de API, base de datos, S3 y variables críticas.'
    },
    config: {
      title: t('admin.config.menuTitle'),
      subtitle: t('admin.config.subtitle')
    }
  }), [t]);

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
  const totalAlertas = useMemo(
    () => overviewData.verifiPendientes + overviewData.empresasPendientes + overviewData.reportesAbiertos,
    [overviewData.empresasPendientes, overviewData.reportesAbiertos, overviewData.verifiPendientes]
  );

  const irAAlertas = useCallback(() => {
    if (overviewData.verifiPendientes > 0) {
      setActiveMenu('egresados');
      return;
    }

    if (overviewData.empresasPendientes > 0) {
      setActiveMenu('empresas');
      return;
    }

    setActiveMenu('dashboard');
  }, [overviewData.verifiPendientes, overviewData.empresasPendientes]);

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
              {t('sidebar.dashboard')}
            </button>
            <button className={`admin-nav-link ${activeMenu === 'usuarios' ? 'active' : ''}`} type="button" onClick={() => setActiveMenu('usuarios')}>
              <Users size={16} />
              {t('admin.users.tableUser')}s
            </button>
            <button className={`admin-nav-link ${activeMenu === 'egresados' ? 'active' : ''}`} type="button" onClick={() => setActiveMenu('egresados')}>
              <GraduationCap size={16} />
              {t('admin.graduates.tableGraduate')}s
            </button>
            <button className={`admin-nav-link ${activeMenu === 'empresas' ? 'active' : ''}`} type="button" onClick={() => setActiveMenu('empresas')}>
              <Building size={16} />
              {t('admin.companies.menuTitle')}
            </button>
            <button className={`admin-nav-link ${activeMenu === 'config' ? 'active' : ''}`} type="button" onClick={() => setActiveMenu('config')}>
              <Settings size={16} />
              {t('admin.config.menuTitle')}
            </button>
          </nav>

          <div className="admin-topbar-actions">
            <AdminBusquedaGlobal onNavigate={setActiveMenu} />
            <AdminCampanaNotificaciones onNavigate={setActiveMenu} />
            <button className="admin-profile-pill" type="button" onClick={() => setActiveMenu('config')}>
              <span className="admin-profile-avatar">AD</span>
              <span className="admin-profile-copy">
                <span className="admin-profile-name">{t('header.administrator')}</span>
                <span className="admin-profile-role">FWD Workspace</span>
              </span>
            </button>
          </div>
        </div>
      </header>

      <div className="admin-body">
        <aside className="admin-sidebar">
          <div>
            <div className="admin-sidebar-heading">
              <p>{t('admin.common.adminWorkspace')}</p>
              <span>{t('admin.common.fwdControlCenter')}</span>
            </div>

            <nav className="admin-sidebar-nav" aria-label="Secciones de administracion">
              <ElementoBarraLateral icon={LayoutDashboard} label={t('sidebar.dashboard')} isActive={activeMenu === 'dashboard'} onClick={() => setActiveMenu('dashboard')} />
              <ElementoBarraLateral icon={Building} label={t('admin.companies.menuTitle')} isActive={activeMenu === 'empresas'} onClick={() => setActiveMenu('empresas')} />
              <ElementoBarraLateral icon={FolderKanban} label="Proyectos" isActive={activeMenu === 'proyectos'} onClick={() => setActiveMenu('proyectos')} />
              <ElementoBarraLateral icon={GraduationCap} label={t('admin.graduates.tableGraduate') + 's'} isActive={activeMenu === 'egresados'} onClick={() => setActiveMenu('egresados')} />
              <ElementoBarraLateral icon={Users} label={t('admin.users.tableUser') + 's'} isActive={activeMenu === 'usuarios'} onClick={() => setActiveMenu('usuarios')} />
              <ElementoBarraLateral icon={ShieldAlert} label="Reportes" isActive={activeMenu === 'reportes'} onClick={() => setActiveMenu('reportes')} />
              <ElementoBarraLateral icon={ClipboardList} label="Auditoría" isActive={activeMenu === 'auditoria'} onClick={() => setActiveMenu('auditoria')} />
              <ElementoBarraLateral icon={Activity} label="Sistema" isActive={activeMenu === 'sistema'} onClick={() => setActiveMenu('sistema')} />
            </nav>
          </div>

          <div className="admin-sidebar-footer">
            <div className="admin-help-card">
              <p className="admin-help-title">{t('admin.common.needHelp')}</p>
              <p className="admin-help-text">{t('admin.common.helpText')}</p>
              <button className="admin-help-link" type="button">
                <HelpCircle size={14} />
                {t('admin.common.support')}
              </button>
            </div>
          <ElementoBarraLateral icon={Settings} label={t('admin.config.menuTitle')} isActive={activeMenu === 'config'} onClick={() => setActiveMenu('config')} />
          <button 
            onClick={manejarCerrarSesion}
            className="admin-logout-button"
            type="button"
            disabled={cerrandoSesion}
          >
            <LogOut size={20} /> {cerrandoSesion ? t('admin.common.loggingOut') : t('admin.common.logout')}
          </button>
        </div>
      </aside>

        <main className="admin-main fwd-fondo-decorativo">
          <div className="admin-page-heading">
            <div>
              <span className="admin-eyebrow">{t('admin.common.administration')}</span>
              <h1>{encabezado.title}</h1>
              <p>{encabezado.subtitle}</p>
            </div>

            <div className="admin-heading-actions">
              <button className="admin-secondary-button" type="button" onClick={irAAlertas}>
                <Bell size={16} />
                {totalAlertas} {t('admin.common.alerts')}
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
                <TarjetaEstadistica title={t('admin.dashboard.totalUsers')} value={overviewLoading ? '...' : overviewData.totalUsuarios} icon={Users} trend="Global" isPositive={true} colorClass="text-accent" />
                <TarjetaEstadistica title={t('admin.dashboard.pendingCompanies')} value={overviewLoading ? '...' : overviewData.empresasPendientes} icon={Building} trend="Revision" isPositive={overviewData.empresasPendientes === 0} colorClass="text-magenta" />
                <TarjetaEstadistica title={t('admin.dashboard.pendingVerifications')} value={overviewLoading ? '...' : overviewData.verifiPendientes} icon={Clock} trend="Pendientes" isPositive={overviewData.verifiPendientes === 0} colorClass="text-warning" />
              </section>

              <section className="admin-panel">
                <div className="admin-panel-header">
                  <h3>{t('admin.dashboard.recentActivity')}</h3>
                  <button className="admin-text-button" type="button" onClick={() => cargarOverview({ mostrarCarga: true })} disabled={overviewLoading}>
                    <RefreshCw size={15} />
                    {t('admin.dashboard.update')}
                  </button>
                </div>
                
                <div className="admin-table-wrap">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>{t('admin.dashboard.entityUser')}</th>
                        <th>{t('admin.dashboard.action')}</th>
                        <th>{t('admin.dashboard.date')}</th>
                        <th>{t('admin.dashboard.status')}</th>
                        <th className="admin-table-actions">{t('admin.dashboard.details')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {overviewLoading ? (
                        <tr><td colSpan="5" className="admin-muted-cell">{t('admin.dashboard.loadingActivity')}</td></tr>
                      ) : overviewData.actividadReciente.length === 0 ? (
                        <tr><td colSpan="5" className="admin-muted-cell">{t('admin.dashboard.noActivity')}</td></tr>
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
                              <button 
                                className="admin-row-action" 
                                type="button" 
                                aria-label="Ver detalles" 
                                title={evento.entidad}
                                onClick={() => setModalAuditoria({ open: true, evento })}
                              >
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

          <Suspense fallback={
            <div className="admin-empty-state" style={{ minHeight: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span className="admin-muted-cell">{t('admin.common.loading', 'Cargando módulo...')}</span>
            </div>
          }>
            {activeMenu === 'usuarios' && <AdminUsuarios onAdminChange={cargarOverview} />}
            {activeMenu === 'egresados' && <AdminEgresados onAdminChange={cargarOverview} />}
            {activeMenu === 'empresas' && <AdminEmpresas onAdminChange={cargarOverview} />}
            {activeMenu === 'proyectos' && <AdminProyectos onAdminChange={cargarOverview} />}
            {activeMenu === 'reportes' && <AdminReportes onAdminChange={cargarOverview} />}
            {activeMenu === 'auditoria' && <AdminAuditoria />}
            {activeMenu === 'sistema' && <AdminSistema />}
            {activeMenu === 'config' && <AdminConfiguracion onAdminChange={cargarOverview} />}
          </Suspense>
          
        </div>
      </main>
      </div>

      <AdminDetalleAuditoriaModal
        open={modalAuditoria.open}
        evento={modalAuditoria.evento}
        onCancel={() => setModalAuditoria({ open: false, evento: null })}
      />
    </div>
  );
}
