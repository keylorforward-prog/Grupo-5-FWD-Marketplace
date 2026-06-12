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
  Filter
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';

import SidebarItem from '../../components/SidebarItem';
import StatCard from '../../components/StatCard';
import StatusBadge from '../../components/StatusBadge';

// ============================================================================
// MOCK API (Contrato de Datos Expandido)
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
      { id: 'ACT-001', type: 'empresa', name: 'TechNova Costa Rica', action: 'Registro de Empresa', date: 'Hoy, 10:23 AM', status: 'Pendiente' },
      { id: 'ACT-002', type: 'egresado', name: 'Carlos Mendoza', action: 'Actualización de Perfil', date: 'Hoy, 09:15 AM', status: 'Completado' },
      { id: 'ACT-003', type: 'empresa', name: 'Global Solutions', action: 'Nueva Oferta Publicada', date: 'Ayer, 16:30 PM', status: 'Completado' },
      { id: 'ACT-004', type: 'egresado', name: 'Ana Rojas', action: 'Postulación a Vacante', date: 'Ayer, 14:20 PM', status: 'Pendiente' },
      { id: 'ACT-005', type: 'empresa', name: 'Innovatech', action: 'Validación de Cuenta', date: '10 Jun, 11:00 AM', status: 'Rechazado' },
    ]
  };
};

export default function AdminProfile() {
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  
  // Estado para el filtro de la tabla
  const [statusFilter, setStatusFilter] = useState('Todos');

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

  // Filtrado optimizado en el cliente O(N)
  const filteredActivity = useMemo(() => {
    if (!dashboardData?.recentActivity) return [];
    if (statusFilter === 'Todos') return dashboardData.recentActivity;
    return dashboardData.recentActivity.filter(item => item.status === statusFilter);
  }, [dashboardData, statusFilter]);

  // Helper para renderizar iconos dinámicamente según la entidad
  const renderEntityIcon = (type) => {
    if (type === 'empresa') {
      return (
        <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-accent">
          <Building size={14} />
        </div>
      );
    }
    return (
      <div className="w-8 h-8 rounded-full bg-magenta/20 flex items-center justify-center text-magenta">
        <GraduationCap size={14} />
      </div>
    );
  };

  return (
    <div className="flex h-screen w-full bg-ink-strong text-canvas font-body overflow-hidden">
      
      {/* 1. PANEL LATERAL (Sidebar) */}
      <aside className="w-64 bg-[#0f172a] border-r border-border/10 flex flex-col justify-between shrink-0 h-full z-10">
        <div className="p-6">
          <div className="mb-10 space-y-1">
            <h1 className="font-heading text-3xl font-extrabold tracking-tight text-canvas cursor-pointer">
              FWD<span className="text-secondary">.</span>
            </h1>
            <p className="text-xs text-ink-muted font-bold tracking-widest uppercase">Admin Workspace</p>
          </div>

          <nav className="space-y-2">
            <SidebarItem icon={LayoutDashboard} label="Dashboard" isActive={activeMenu === 'dashboard'} onClick={() => setActiveMenu('dashboard')} />
            <SidebarItem icon={Building} label="Empresas" isActive={activeMenu === 'empresas'} onClick={() => setActiveMenu('empresas')} />
            <SidebarItem icon={GraduationCap} label="Egresados" isActive={activeMenu === 'egresados'} onClick={() => setActiveMenu('egresados')} />
            <SidebarItem icon={Users} label="Usuarios" isActive={activeMenu === 'usuarios'} onClick={() => setActiveMenu('usuarios')} />
          </nav>
        </div>

        <div className="p-6 border-t border-border/10 space-y-2">
          <SidebarItem icon={Settings} label="Configuración" isActive={activeMenu === 'config'} onClick={() => setActiveMenu('config')} />
          <button 
            onClick={() => console.log('Ejecutando Logout...')}
            className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-destructive hover:bg-destructive/10 rounded-xl transition-colors"
          >
            <LogOut size={20} /> Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* 2. ÁREA DE CONTENIDO (Main Content) */}
      <main className="flex-1 flex flex-col h-full relative overflow-y-auto">
        
        {/* Barra Superior (Header) */}
        <header className="flex items-center justify-between px-10 py-6 bg-[#0f172a]/50 backdrop-blur-md sticky top-0 z-20 border-b border-border/5">
          <div>
            <h2 className="text-2xl font-extrabold text-canvas">Panel de Administración</h2>
            <p className="text-ink-muted text-sm mt-1">Bienvenido, administrador. Resumen del día.</p>
          </div>

          <div className="flex items-center gap-6">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted group-focus-within:text-accent transition-colors" size={18} />
              <input
                type="text"
                placeholder="Buscar registros..."
                className="pl-10 pr-4 py-2 bg-[#1e293b] border border-border/20 rounded-full text-sm text-canvas focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent w-64 transition-all"
              />
            </div>
            
            <button className="relative text-ink-muted hover:text-canvas transition-colors">
              <Bell size={22} />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-magenta rounded-full border-2 border-[#0f172a]"></span>
            </button>

            <button className="h-10 w-10 bg-secondary text-canvas rounded-full flex items-center justify-center font-bold text-sm shadow-soft hover:scale-105 transition-transform border border-secondary/50">
              AD
            </button>
          </div>
        </header>

        {/* Cuerpo del Dashboard */}
        <div className="p-10 flex flex-col gap-8">
          
          {error && (
            <div className="bg-destructive/10 border border-destructive/20 text-destructive px-6 py-4 rounded-xl flex items-center gap-3">
              <AlertCircle size={20} />
              <p className="text-sm font-medium">{error}</p>
            </div>
          )}

          {/* Métricas (StatCards) */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {isLoading ? (
              <>
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-32 bg-[#1e293b] rounded-2xl animate-pulse border border-border/5"></div>
                ))}
              </>
            ) : (
              <>
                <StatCard title="Total Usuarios" value={dashboardData?.stats.totalUsuarios} icon={Users} trend="+12% mensual" isPositive={true} colorClass="text-accent" />
                <StatCard title="Empresas Activas" value={dashboardData?.stats.empresasActivas} icon={Building} trend="+5% mensual" isPositive={true} colorClass="text-magenta" />
                <StatCard title="Procesos Pendientes" value={dashboardData?.stats.procesosPendientes} icon={Clock} trend="-2% mensual" isPositive={false} colorClass="text-warning" />
              </>
            )}
          </section>

          {/* Gráfico Analítico */}
          <section className="bg-[#1e293b] border border-border/10 rounded-2xl shadow-elevated p-6 flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="font-bold text-canvas text-lg">Crecimiento Bilateral Mensual</h3>
                <p className="text-xs text-ink-muted mt-1">Comparativa de Egresados vs Ofertas de Empresas</p>
              </div>
            </div>

            {isLoading ? (
              <div className="h-[300px] w-full bg-[#0f172a]/50 rounded-xl animate-pulse flex items-center justify-center">
                <span className="text-ink-muted text-sm font-medium">Cargando métricas...</span>
              </div>
            ) : (
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={dashboardData?.chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                    <XAxis dataKey="month" stroke="#94a3b8" tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} />
                    <YAxis stroke="#94a3b8" tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '0.75rem', color: '#fff' }} itemStyle={{ fontWeight: 'bold' }} />
                    <Legend wrapperStyle={{ paddingTop: '20px' }} />
                    <Line type="monotone" dataKey="egresados" name="Nuevos Egresados" stroke="#20bec6" strokeWidth={3} dot={{ r: 4, strokeWidth: 2, fill: '#1e293b' }} activeDot={{ r: 6, stroke: '#20bec6', strokeWidth: 2, fill: '#fff' }} />
                    <Line type="monotone" dataKey="empresas" name="Nuevas Empresas" stroke="#662d91" strokeWidth={3} dot={{ r: 4, strokeWidth: 2, fill: '#1e293b' }} activeDot={{ r: 6, stroke: '#662d91', strokeWidth: 2, fill: '#fff' }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
          </section>

          {/* Tabla de Actividad Reciente */}
          <section className="bg-[#1e293b] border border-border/10 rounded-2xl shadow-elevated overflow-hidden flex flex-col">
            <div className="px-6 py-5 border-b border-border/10 flex justify-between items-center bg-[#0f172a]/50">
              <h3 className="font-bold text-canvas">Actividad Reciente</h3>
              
              {/* Controles de Filtro */}
              <div className="flex items-center gap-3">
                <div className="flex items-center bg-[#1e293b] rounded-lg border border-border/20 px-2 py-1">
                  <Filter size={14} className="text-ink-muted mr-2" />
                  <select 
                    className="bg-transparent text-sm text-canvas outline-none focus:ring-0 cursor-pointer"
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
              <table className="w-full text-sm text-left text-canvas">
                <thead className="text-xs text-ink-muted uppercase bg-[#0f172a]/80">
                  <tr>
                    <th className="px-6 py-4 font-bold tracking-wider">Entidad / Usuario</th>
                    <th className="px-6 py-4 font-bold tracking-wider">Acción</th>
                    <th className="px-6 py-4 font-bold tracking-wider">Fecha</th>
                    <th className="px-6 py-4 font-bold tracking-wider">Estado</th>
                    <th className="px-6 py-4 text-right font-bold tracking-wider">Detalles</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/10">
                  {isLoading ? (
                    // Skeletons de la tabla
                    [1, 2, 3].map((i) => (
                      <tr key={`skeleton-${i}`}>
                        <td className="px-6 py-4"><div className="h-6 w-32 bg-[#0f172a] rounded animate-pulse"></div></td>
                        <td className="px-6 py-4"><div className="h-6 w-40 bg-[#0f172a] rounded animate-pulse"></div></td>
                        <td className="px-6 py-4"><div className="h-6 w-24 bg-[#0f172a] rounded animate-pulse"></div></td>
                        <td className="px-6 py-4"><div className="h-6 w-20 bg-[#0f172a] rounded animate-pulse"></div></td>
                        <td className="px-6 py-4 flex justify-end"><div className="h-6 w-6 bg-[#0f172a] rounded-full animate-pulse"></div></td>
                      </tr>
                    ))
                  ) : filteredActivity.length > 0 ? (
                    // Renderizado Dinámico
                    filteredActivity.map((item) => (
                      <tr key={item.id} className="hover:bg-[#0f172a]/40 transition-colors group cursor-pointer">
                        <td className="px-6 py-4 font-medium flex items-center gap-3">
                          {renderEntityIcon(item.type)}
                          {item.name}
                        </td>
                        <td className="px-6 py-4 text-ink-muted group-hover:text-canvas transition-colors">{item.action}</td>
                        <td className="px-6 py-4 text-ink-muted">{item.date}</td>
                        <td className="px-6 py-4"><StatusBadge status={item.status} /></td>
                        <td className="px-6 py-4 flex justify-end">
                          <button 
                            className="text-ink-muted hover:text-accent transition-colors p-2 rounded-full hover:bg-accent/10"
                            onClick={(e) => {
                              e.stopPropagation();
                              console.log(`Abriendo detalles de ${item.id}`);
                            }}
                          >
                            <MoreVertical size={18} />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    // Estado vacío (Cuando el filtro no encuentra nada)
                    <tr>
                      <td colSpan="5" className="px-6 py-8 text-center text-ink-muted">
                        No se encontraron registros para el estado "{statusFilter}".
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>

        </div>
      </main>
    </div>
  );
}