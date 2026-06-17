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

export default function AdminProfile() {
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
      setOverviewError('No se pudo actualizar el resumen administrativo.');
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
        if (!cancelado) setOverviewError('No se pudo cargar el resumen administrativo.');
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
      title: 'Panel de Administracion',
      subtitle: 'Resumen operativo de usuarios, proyectos y verificaciones.'
    },
    empresas: {
      title: 'Empresas',
      subtitle: 'Gestiona organizaciones, perfiles y accesos empresariales.'
    },
    egresados: {
      title: 'Verificacion de Egresados',
      subtitle: 'Revisa solicitudes pendientes y valida credenciales FWD.'
    },
    usuarios: {
      title: 'Gestion de Usuarios',
      subtitle: 'Busca, revisa y administra cuentas de la plataforma.'
    },
    config: {
      title: 'Configuracion',
      subtitle: 'Ajustes generales del espacio administrativo.'
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
              Dashboard
            </button>
            <button className={`admin-nav-link ${activeMenu === 'usuarios' ? 'active' : ''}`} type="button" onClick={() => setActiveMenu('usuarios')}>
              <Users size={16} />
              Usuarios
            </button>
            <button className={`admin-nav-link ${activeMenu === 'egresados' ? 'active' : ''}`} type="button" onClick={() => setActiveMenu('egresados')}>
              <GraduationCap size={16} />
              Egresados
            </button>
            <button className={`admin-nav-link ${activeMenu === 'empresas' ? 'active' : ''}`} type="button" onClick={() => setActiveMenu('empresas')}>
              <Building size={16} />
              Empresas
            </button>
            <button className={`admin-nav-link ${activeMenu === 'config' ? 'active' : ''}`} type="button" onClick={() => setActiveMenu('config')}>
              <Settings size={16} />
              Configuracion
            </button>
          </nav>

          <div className="admin-topbar-actions">
            <button className="admin-icon-button" type="button" aria-label="Notificaciones" title="Notificaciones">
              <Bell size={20} />
              <span className="admin-notification-dot" aria-hidden="true" />
            </button>
            <button className="admin-profile-pill" type="button" onClick={() => setActiveMenu('config')}>
              <span className="admin-profile-avatar">AD</span>
              <span className="admin-profile-copy">
                <span className="admin-profile-name">Administrador</span>
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
              <p>Admin Workspace</p>
              <span>Centro de control FWD</span>
            </div>

            <nav className="admin-sidebar-nav" aria-label="Secciones de administracion">
              <ElementoBarraLateral icon={LayoutDashboard} label="Dashboard" isActive={activeMenu === 'dashboard'} onClick={() => setActiveMenu('dashboard')} />
              <ElementoBarraLateral icon={Building} label="Empresas" isActive={activeMenu === 'empresas'} onClick={() => setActiveMenu('empresas')} />
              <ElementoBarraLateral icon={GraduationCap} label="Egresados" isActive={activeMenu === 'egresados'} onClick={() => setActiveMenu('egresados')} />
              <ElementoBarraLateral icon={Users} label="Usuarios" isActive={activeMenu === 'usuarios'} onClick={() => setActiveMenu('usuarios')} />
            </nav>
          </div>

          <div className="admin-sidebar-footer">
            <div className="admin-help-card">
              <p className="admin-help-title">Necesitas ayuda?</p>
              <p className="admin-help-text">Consulta lineamientos internos o reporta una incidencia de plataforma.</p>
              <button className="admin-help-link" type="button">
                <HelpCircle size={14} />
                Soporte
              </button>
            </div>
          <ElementoBarraLateral icon={Settings} label="Configuración" isActive={activeMenu === 'config'} onClick={() => setActiveMenu('config')} />
          <button 
            onClick={manejarCerrarSesion}
            className="admin-logout-button"
            type="button"
            disabled={cerrandoSesion}
          >
            <LogOut size={20} /> {cerrandoSesion ? 'Cerrando...' : 'Cerrar Sesion'}
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
                {totalAlertas} alertas
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
                <TarjetaEstadistica title="Total Usuarios" value={overviewLoading ? '...' : overviewData.totalUsuarios} icon={Users} trend="Global" isPositive={true} colorClass="text-accent" />
                <TarjetaEstadistica title="Empresas Pendientes" value={overviewLoading ? '...' : overviewData.empresasPendientes} icon={Building} trend="Revision" isPositive={overviewData.empresasPendientes === 0} colorClass="text-magenta" />
                <TarjetaEstadistica title="Verificaciones Pendientes" value={overviewLoading ? '...' : overviewData.verifiPendientes} icon={Clock} trend="Pendientes" isPositive={overviewData.verifiPendientes === 0} colorClass="text-warning" />
              </section>

              <section className="admin-panel">
                <div className="admin-panel-header">
                  <h3>Actividad Reciente</h3>
                  <button className="admin-text-button" type="button" onClick={() => cargarOverview({ mostrarCarga: true })} disabled={overviewLoading}>
                    <RefreshCw size={15} />
                    Actualizar
                  </button>
                </div>
                
                <div className="admin-table-wrap">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Entidad / Usuario</th>
                        <th>Accion</th>
                        <th>Fecha</th>
                        <th>Estado</th>
                        <th className="admin-table-actions">Detalles</th>
                      </tr>
                    </thead>
                    <tbody>
                      {overviewLoading ? (
                        <tr><td colSpan="5" className="admin-muted-cell">Cargando actividad...</td></tr>
                      ) : overviewData.actividadReciente.length === 0 ? (
                        <tr><td colSpan="5" className="admin-muted-cell">Aun no hay actividad administrativa registrada.</td></tr>
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
                            <td>{new Date(evento.fecha).toLocaleString('es-CR', { dateStyle: 'medium', timeStyle: 'short' })}</td>
                            <td><InsigniaEstado status="Completado" /></td>
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
