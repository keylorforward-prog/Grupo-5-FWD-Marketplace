import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { adminService } from '../../services/adminService';
import AdminUsuarios from './AdminUsuarios';
import AdminEgresados from './AdminEgresados';
import './AdminProfile.css';
import {
  LayoutDashboard,
  Users,
  Building,
  GraduationCap,
  Settings,
  LogOut,
  Search,
  Bell,
  MoreVertical,
  Clock,
  HelpCircle
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
    proyectosActivos: 0,
    reportesAbiertos: 0
  });

  useEffect(() => {
    const fetchOverview = async () => {
      try {
        const response = await adminService.getOverview();
        if (response.success) {
          setOverviewData(response.data);
        }
      } catch (error) {
        console.error('Error fetching admin overview:', error);
      }
    };
    fetchOverview();
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
              <div className="admin-search">
                <Search size={18} />
                <input type="text" placeholder="Buscar registros..." aria-label="Buscar registros" />
              </div>
              <button className="admin-secondary-button" type="button">
                <Bell size={16} />
                Alertas
              </button>
            </div>
          </div>

          <div className="admin-content">
          {activeMenu === 'dashboard' && (
            <>
              <section className="admin-stats-grid">
                <TarjetaEstadistica title="Total Usuarios" value={overviewData.totalUsuarios} icon={Users} trend="Global" isPositive={true} colorClass="text-accent" />
                <TarjetaEstadistica title="Proyectos Activos" value={overviewData.proyectosActivos} icon={Building} trend="En Progreso" isPositive={true} colorClass="text-magenta" />
                <TarjetaEstadistica title="Verificaciones Pendientes" value={overviewData.verifiPendientes} icon={Clock} trend="Pendientes" isPositive={false} colorClass="text-warning" />
              </section>

              <section className="admin-panel">
                <div className="admin-panel-header">
                  <h3>Actividad Reciente</h3>
                  <button className="admin-text-button" type="button">Ver historial completo</button>
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
                      <tr>
                        <td>
                          <div className="admin-entity-cell">
                          <span className="admin-entity-icon accent">
                            <Building size={14} />
                          </span>
                          <span>TechNova Costa Rica</span>
                          </div>
                        </td>
                        <td>Registro de Empresa</td>
                        <td>Hoy, 10:23 AM</td>
                        <td><InsigniaEstado status="Pendiente" /></td>
                        <td className="admin-table-actions">
                          <button className="admin-row-action" type="button" aria-label="Ver detalles"><MoreVertical size={18} /></button>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <div className="admin-entity-cell">
                          <span className="admin-entity-icon magenta">
                            <GraduationCap size={14} />
                          </span>
                          <span>Carlos Mendoza</span>
                          </div>
                        </td>
                        <td>Actualizacion de Perfil</td>
                        <td>Ayer, 04:15 PM</td>
                        <td><InsigniaEstado status="Completado" /></td>
                        <td className="admin-table-actions">
                          <button className="admin-row-action" type="button" aria-label="Ver detalles"><MoreVertical size={18} /></button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </section>
            </>
          )}

          {activeMenu === 'usuarios' && <AdminUsuarios />}
          {activeMenu === 'egresados' && <AdminEgresados />}
          {activeMenu === 'empresas' && <div className="admin-empty-state">Modulo de empresas proximamente</div>}
          {activeMenu === 'config' && <div className="admin-empty-state">Modulo de configuracion proximamente</div>}
          
        </div>
      </main>
      </div>
    </div>
  );
}
