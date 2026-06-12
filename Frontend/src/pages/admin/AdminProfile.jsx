import { useState, useEffect, useMemo } from 'react';
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
  AlertCircle,
  Filter,
  X,
  CheckCircle,
  XCircle,
  Sun,
  Moon
} from 'lucide-react';

import SidebarItem from '../../components/SidebarItem';
import StatCard from '../../components/StatCard';
import StatusBadge from '../../components/StatusBadge';
import DashboardChart from '../../components/DashboardChart';

// IMPORTACIÓN DEL LOGO OFICIAL
import logoFwd from '../../assets/logo-fwd.png';

// ============================================================================
// MOCK API (Contrato de Datos de Producción)
// ============================================================================
const fetchDashboardData = async () => {
  await new Promise((resolve) => setTimeout(resolve, 1500));

  return {
    stats: {
      totalUsuarios: "1,248",
      empresasActivas: "342",
      procesosPendientes: "89"
    },
    chartData: [
      { month: 'Ene', egresados: 45, empresas: 4 },
      { month: 'Feb', egresados: 85, empresas: 12 },
      { month: 'Mar', egresados: 120, empresas: 18 },
      { month: 'Abr', egresados: 190, empresas: 25 },
      { month: 'May', egresados: 260, empresas: 34 },
      { month: 'Jun', egresados: 310, empresas: 40 },
    ],
    recentActivity: [
      { id: 'ACT-001', type: 'empresa', name: 'TechNova Costa Rica', action: 'Registro de Empresa', date: 'Hoy, 10:23 AM', status: 'Pendiente', email: 'contacto@technova.cr', details: 'Solicitud de ingreso a la plataforma como empresa reclutadora del sector TI.' },
      { id: 'ACT-002', type: 'egresado', name: 'Carlos Mendoza', action: 'Actualización de Perfil', date: 'Hoy, 09:15 AM', status: 'Completado', email: 'carlos.men@fwd.cr', details: 'Añadió certificación en React Senior Developer y nivel de inglés B2.' },
      { id: 'ACT-003', type: 'empresa', name: 'Global Solutions', action: 'Nueva Oferta Publicada', date: 'Ayer, 16:30 PM', status: 'Completado', email: 'hr@globalsolutions.com', details: 'Publicación de vacante para Desarrollador Fullstack Junior enfocado en Node.js.' },
      { id: 'ACT-004', type: 'egresado', name: 'Ana Rojas', action: 'Postulación a Vacante', date: 'Ayer, 14:20 PM', status: 'Pendiente', email: 'anarojas@fwd.cr', details: 'Se postuló al puesto de Diseñador UI/UX en TechNova Costa Rica.' },
      { id: 'ACT-005', type: 'empresa', name: 'Innovatech', action: 'Validación de Cuenta', date: '10 Jun, 11:00 AM', status: 'Rechazado', email: 'info@innovatech.cr', details: 'Cédula jurídica no coincide con los registros oficiales del Ministerio de Hacienda.' },
    ]
  };
};

export default function AdminProfile() {
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  
  // Control de Tema
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Filtros globales en memoria
  const [statusFilter, setStatusFilter] = useState('Todos');
  const [searchTerm, setSearchTerm] = useState('');

  // Estados del Drawer lateral
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Inyección reactiva de la clase dark en la raíz del DOM
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await fetchDashboardData();
        setDashboardData(data);
      } catch (err) {
        console.error("Error al cargar datos del dashboard:", err);
        setError("No se pudo conectar con el servidor. Por favor, reintente más tarde.");
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const filteredActivity = useMemo(() => {
    if (!dashboardData?.recentActivity) return [];
    
    return dashboardData.recentActivity.filter(item => {
      const matchesStatus = statusFilter === 'Todos' || item.status === statusFilter;
      const normalizedSearch = searchTerm.toLowerCase().trim();
      const matchesSearch = normalizedSearch === '' || 
                            item.name.toLowerCase().includes(normalizedSearch) ||
                            item.action.toLowerCase().includes(normalizedSearch) ||
                            item.id.toLowerCase().includes(normalizedSearch);

      return matchesStatus && matchesSearch;
    });
  }, [dashboardData, statusFilter, searchTerm]);

  const handleUpdateStatus = async (activityId, newStatus) => {
    try {
      setIsProcessing(true);
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setDashboardData(prev => ({
        ...prev,
        recentActivity: prev.recentActivity.map(item => 
          item.id === activityId ? { ...item, status: newStatus } : item
        )
      }));

      setSelectedActivity(prev => prev ? { ...prev, status: newStatus } : null);
    } catch (err) {
      console.error("Error al actualizar estado:", err);
    } finally {
      setIsProcessing(false);
    }
  };

  const renderEntityIcon = (type) => {
    if (type === 'empresa') {
      return (
        <div className={`w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center transition-colors duration-base ${isDarkMode ? 'text-accent' : 'text-primary'}`}>
          <Building size={14} />
        </div>
      );
    }
    return (
      <div className="w-8 h-8 rounded-full bg-magenta/10 flex items-center justify-center text-magenta">
        <GraduationCap size={14} />
      </div>
    );
  };

  return (
    <div className="flex h-screen w-full bg-canvas text-ink-strong font-body overflow-hidden relative transition-colors duration-base ease-in-out">
      
      {/* 1. PANEL LATERAL PRINCIPAL (Sidebar) */}
      <aside className="w-64 bg-surface border-r border-border flex flex-col justify-between shrink-0 h-full z-10 transition-colors duration-base">
        <div className="p-6">
          
          {/* Logo Corporativo Dinámico (Controlado por React) */}
          <div className="mb-10 space-y-2">
            <div className="h-12 w-auto flex items-center">
              <img 
                src={logoFwd} 
                alt="FWD Costa Rica" 
                className={`h-10 w-auto object-contain transition-all duration-base ${isDarkMode ? 'brightness-0 invert' : ''}`} 
              />
            </div>
            <p className="text-xs text-ink-muted font-bold tracking-widest uppercase">Admin Workspace</p>
          </div>

          <nav className="space-y-2">
            <SidebarItem icon={LayoutDashboard} label="Dashboard" isActive={activeMenu === 'dashboard'} onClick={() => setActiveMenu('dashboard')} />
            <SidebarItem icon={Building} label="Empresas" isActive={activeMenu === 'empresas'} onClick={() => setActiveMenu('empresas')} />
            <SidebarItem icon={GraduationCap} label="Egresados" isActive={activeMenu === 'egresados'} onClick={() => setActiveMenu('egresados')} />
            <SidebarItem icon={Users} label="Usuarios" isActive={activeMenu === 'usuarios'} onClick={() => setActiveMenu('usuarios')} />
          </nav>
        </div>

        <div className="p-6 border-t border-border space-y-2">
          <SidebarItem icon={Settings} label="Configuración" isActive={activeMenu === 'config'} onClick={() => setActiveMenu('config')} />
          <button 
            onClick={() => console.log('Ejecutando Logout...')}
            className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-destructive hover:bg-destructive/10 rounded-[var(--radius)] transition-colors"
          >
            <LogOut size={20} /> Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* 2. ÁREA DE CONTENIDO (Main Content) */}
      <main className="flex-1 flex flex-col h-full relative overflow-y-auto">
        
        {/* Barra Superior (Header) */}
        <header className="flex items-center justify-between px-10 py-6 bg-surface/80 backdrop-blur-md sticky top-0 z-20 border-b border-border transition-colors duration-base">
          <div>
            <h2 className="text-2xl font-extrabold font-heading text-ink-strong">Panel de Administración</h2>
            <p className="text-ink-muted text-sm mt-1">Monitoreo de actividad y gestión de accesos institucionales.</p>
          </div>

          <div className="flex items-center gap-6">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted group-focus-within:text-primary transition-colors" size={18} />
              <input
                type="text"
                placeholder="Buscar registros..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                disabled={isLoading}
                className="pl-10 pr-4 py-2 bg-surface-sunken border border-border rounded-full text-sm text-ink-strong focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary w-64 transition-all disabled:opacity-50"
              />
            </div>
            
            {/* INTERRUPTOR DE TEMA INTERACTIVO (Toggle Mode) */}
            <button 
              onClick={() => setIsDarkMode(!isDarkMode)} 
              className="relative text-ink-muted hover:text-ink-strong transition-colors p-2 rounded-full hover:bg-surface-sunken border border-transparent hover:border-border"
              aria-label="Cambiar Tema de Interfaz"
            >
              {isDarkMode ? <Sun size={20} className="text-highlight" /> : <Moon size={20} />}
            </button>

            <button className="relative text-ink-muted hover:text-ink-strong transition-colors">
              <Bell size={22} />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-magenta rounded-full border-2 border-surface"></span>
            </button>

            <button className="h-10 w-10 bg-secondary text-secondary-foreground rounded-full flex items-center justify-center font-bold text-sm shadow-soft hover:shadow-elevated hover:scale-105 transition-all">
              AD
            </button>
          </div>
        </header>

        {/* Cuerpo del Dashboard */}
        <div className="p-10 flex flex-col gap-8">
          
          {error && (
            <div className="bg-destructive/10 border border-destructive/20 text-destructive px-6 py-4 rounded-[var(--radius)] flex items-center gap-3">
              <AlertCircle size={20} />
              <p className="text-sm font-medium">{error}</p>
            </div>
          )}

          {/* Métricas Adaptativas ancladas a la paleta FWD */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {isLoading ? (
              <>
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-32 bg-surface rounded-[var(--radius)] animate-pulse border border-border shadow-soft"></div>
                ))}
              </>
            ) : (
              <>
                <StatCard title="Total Usuarios" value={dashboardData?.stats.totalUsuarios} icon={Users} trend="+12% mensual" isPositive={true} colorClass="text-accent" />
                <StatCard title="Empresas Activas" value={dashboardData?.stats.empresasActivas} icon={Building} trend="+5% mensual" isPositive={true} colorClass={isDarkMode ? "text-accent" : "text-primary"} />
                <StatCard title="Procesos Pendientes" value={dashboardData?.stats.procesosPendientes} icon={Clock} trend="-2% mensual" isPositive={false} colorClass="text-warning" />
              </>
            )}
          </section>

          {/* Gráfico Analítico */}
          <section className="bg-surface border border-border rounded-[var(--radius)] shadow-soft p-6 flex flex-col transition-colors duration-base">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="font-bold font-heading text-ink-strong text-lg">Crecimiento Bilateral Mensual</h3>
                <p className="text-xs text-ink-muted mt-1">Comparativa de Egresados vs Ofertas de Empresas</p>
              </div>
            </div>
            
            <DashboardChart data={dashboardData?.chartData} isLoading={isLoading} />
          </section>

          {/* Tabla de Actividad Reciente */}
          <section className="bg-surface border border-border rounded-[var(--radius)] shadow-soft overflow-hidden flex flex-col transition-colors duration-base">
            <div className="px-6 py-5 border-b border-border flex justify-between items-center bg-surface-sunken">
              <h3 className="font-bold font-heading text-ink-strong">Actividad Reciente</h3>
              
              <div className="flex items-center gap-3">
                <div className="flex items-center bg-surface rounded-lg border border-border px-2 py-1 shadow-soft">
                  <Filter size={14} className="text-ink-muted mr-2" />
                  <select 
                    className="bg-transparent text-sm text-ink-strong outline-none focus:ring-0 cursor-pointer"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    disabled={isLoading}
                  >
                    <option value="Todos">Todos los estados</option>
                    <option value="Pendiente">Pendientes</option>
                    <option value="Completado">Completados</option>
                    <option value="Rechazado">Rechazados</option>
                  </select>
                </div>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-ink-strong">
                <thead className="text-xs text-ink-muted uppercase bg-surface-sunken/50">
                  <tr>
                    <th className="px-6 py-4 font-bold tracking-wider">Entidad / Usuario</th>
                    <th className="px-6 py-4 font-bold tracking-wider">Acción</th>
                    <th className="px-6 py-4 font-bold tracking-wider">Fecha</th>
                    <th className="px-6 py-4 font-bold tracking-wider">Estado</th>
                    <th className="px-6 py-4 text-right font-bold tracking-wider">Detalles</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {isLoading ? (
                    [1, 2, 3].map((i) => (
                      <tr key={`skeleton-${i}`}>
                        <td className="px-6 py-4"><div className="h-6 w-32 bg-surface-sunken rounded animate-pulse"></div></td>
                        <td className="px-6 py-4"><div className="h-6 w-40 bg-surface-sunken rounded animate-pulse"></div></td>
                        <td className="px-6 py-4"><div className="h-6 w-24 bg-surface-sunken rounded animate-pulse"></div></td>
                        <td className="px-6 py-4"><div className="h-6 w-20 bg-surface-sunken rounded animate-pulse"></div></td>
                        <td className="px-6 py-4 flex justify-end"><div className="h-6 w-6 bg-surface-sunken rounded-full animate-pulse"></div></td>
                      </tr>
                    ))
                  ) : filteredActivity.length > 0 ? (
                    filteredActivity.map((item) => (
                      <tr 
                        key={item.id} 
                        className={`hover:bg-surface-sunken transition-colors group cursor-pointer ${selectedActivity?.id === item.id ? 'bg-surface-sunken' : ''}`}
                        onClick={() => setSelectedActivity(item)}
                      >
                        <td className="px-6 py-4 font-medium flex items-center gap-3">
                          {renderEntityIcon(item.type)}
                          {item.name}
                        </td>
                        <td className="px-6 py-4 text-ink-muted group-hover:text-ink-strong transition-colors">{item.action}</td>
                        <td className="px-6 py-4 text-ink-muted">{item.date}</td>
                        <td className="px-6 py-4"><StatusBadge status={item.status} /></td>
                        <td className="px-6 py-4 flex justify-end">
                          <button 
                            className="text-ink-muted hover:text-primary transition-colors p-2 rounded-full hover:bg-primary/10"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedActivity(item);
                            }}
                          >
                            <MoreVertical size={18} />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="px-6 py-8 text-center text-ink-muted">
                        No se encontraron registros que coincidan con tu búsqueda o filtros.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>

        </div>
      </main>

      {/* 3. PANEL LATERAL DE REVISIÓN (Drawer) */}
      <div 
        className={`fixed inset-0 bg-ink-strong/40 backdrop-blur-sm z-40 transition-opacity duration-300 ${selectedActivity ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={() => !isProcessing && setSelectedActivity(null)}
      />

      <div 
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-surface border-l border-border z-50 shadow-elevated flex flex-col transform transition-transform duration-300 ease-out ${selectedActivity ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {selectedActivity && (
          <>
            <div className="p-6 border-b border-border flex justify-between items-center bg-surface sticky top-0">
              <div>
                <span className="text-xs font-bold font-heading tracking-widest text-accent uppercase">{selectedActivity.id}</span>
                <h3 className="text-xl font-extrabold font-heading text-ink-strong mt-1">Detalle de Solicitud</h3>
              </div>
              <button 
                className="text-ink-muted hover:text-ink-strong p-2 rounded-[var(--radius)] hover:bg-surface-sunken transition-colors"
                onClick={() => !isProcessing && setSelectedActivity(null)}
                disabled={isProcessing}
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 p-6 space-y-6 overflow-y-auto">
              <div className="flex items-center gap-4 bg-surface-sunken p-4 rounded-[var(--radius)] border border-border">
                {renderEntityIcon(selectedActivity.type)}
                <div>
                  <h4 className="font-bold text-ink-strong text-base">{selectedActivity.name}</h4>
                  <p className="text-sm text-ink-muted capitalize">Tipo: {selectedActivity.type}</p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold uppercase text-ink-muted tracking-wider block mb-1">Acción Ejecutada</label>
                  <p className="text-sm font-medium text-ink-strong">{selectedActivity.action}</p>
                </div>
                <div>
                  <label className="text-xs font-bold uppercase text-ink-muted tracking-wider block mb-1">Correo Electrónico</label>
                  <p className="text-sm font-medium text-primary break-all">{selectedActivity.email}</p>
                </div>
                <div>
                  <label className="text-xs font-bold uppercase text-ink-muted tracking-wider block mb-1">Fecha de Registro</label>
                  <p className="text-sm font-medium text-ink-strong">{selectedActivity.date}</p>
                </div>
                <div>
                  <label className="text-xs font-bold uppercase text-ink-muted tracking-wider block mb-1">Estado de Gestión</label>
                  <div className="mt-1">
                    <StatusBadge status={selectedActivity.status} />
                  </div>
                </div>
                <div className="pt-2">
                  <label className="text-xs font-bold uppercase text-ink-muted tracking-wider block mb-1">Descripción / Notas</label>
                  <p className="text-sm text-ink-muted bg-surface-sunken p-3 rounded-[var(--radius)] border border-border leading-relaxed">
                    {selectedActivity.details}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-border bg-surface-sunken/50 space-y-3">
              {selectedActivity.status === 'Pendiente' ? (
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => handleUpdateStatus(selectedActivity.id, 'Completado')}
                    disabled={isProcessing}
                    className="flex items-center justify-center gap-2 bg-success text-white px-4 py-3 rounded-[var(--radius)] text-sm font-bold shadow-soft hover:shadow-elevated hover:bg-success/90 transition-all disabled:opacity-50"
                  >
                    <CheckCircle size={16} /> {isProcessing ? 'Procesando...' : 'Aprobar'}
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(selectedActivity.id, 'Rechazado')}
                    disabled={isProcessing}
                    className="flex items-center justify-center gap-2 bg-destructive text-white px-4 py-3 rounded-[var(--radius)] text-sm font-bold shadow-soft hover:shadow-elevated hover:bg-destructive/90 transition-all disabled:opacity-50"
                  >
                    <XCircle size={16} /> {isProcessing ? 'Procesando...' : 'Rechazar'}
                  </button>
                </div>
              ) : (
                <div className="text-center text-xs font-medium text-ink-muted bg-surface py-3 rounded-[var(--radius)] border border-border">
                  Esta solicitud ya fue resuelta bajo el estado de <span className="font-bold">{selectedActivity.status}</span>.
                </div>
              )}
            </div>
          </>
        )}
      </div>

    </div>
  );
}