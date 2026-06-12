import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Users, Building, GraduationCap, Settings, LogOut,
  Search, Bell, MoreVertical, Clock, AlertCircle, Filter, X, CheckCircle, XCircle, Sun, Moon
} from 'lucide-react';

import SidebarItem from '../../components/SidebarItem';
import StatCard from '../../components/StatCard';
import StatusBadge from '../../components/StatusBadge';
import DashboardChart from '../../components/DashboardChart';
import logoFwd from '../../assets/logo-fwd.png';

// ============================================================================
// COMPONENTE AUTHGUARD
// ============================================================================
function AuthGuard({ children, user, role }) {
  const navigate = useNavigate();
  useEffect(() => {
    if (!user || role !== 'ADMIN') {
      navigate('/login', { replace: true });
    }
  }, [user, role, navigate]);
  return !user || role !== 'ADMIN' ? null : <>{children}</>;
}

// ============================================================================
// MOCK API
// ============================================================================
const fetchDashboardData = async () => {
  await new Promise((resolve) => setTimeout(resolve, 1500));
  return {
    stats: { totalUsuarios: "1,248", empresasActivas: "342", procesosPendientes: "89" },
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
  
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [statusFilter, setStatusFilter] = useState('Todos');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const currentUser = { id: 1, name: 'Admin' };
  const currentUserRole = 'ADMIN';

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode);
  }, [isDarkMode]);

  useEffect(() => {
    fetchDashboardData().then(data => { setDashboardData(data); setIsLoading(false); }).catch(() => setError("Error"));
  }, []);

  const filteredActivity = useMemo(() => {
    if (!dashboardData?.recentActivity) return [];
    return dashboardData.recentActivity.filter(item => 
      (statusFilter === 'Todos' || item.status === statusFilter) && 
      (item.name.toLowerCase().includes(searchTerm.toLowerCase()) || item.action.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [dashboardData, statusFilter, searchTerm]);

  const handleUpdateStatus = async (activityId, newStatus) => {
    setIsProcessing(true);
    await new Promise(r => setTimeout(r, 1000));
    setDashboardData(prev => ({
        ...prev,
        recentActivity: prev.recentActivity.map(item => item.id === activityId ? { ...item, status: newStatus } : item)
    }));
    setSelectedActivity(prev => prev ? { ...prev, status: newStatus } : null);
    setIsProcessing(false);
  };

  const renderEntityIcon = (type) => (
    <div className={`w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary dark:text-accent`}>
        {type === 'empresa' ? <Building size={14} /> : <GraduationCap size={14} />}
    </div>
  );

  return (
    <AuthGuard user={currentUser} role={currentUserRole}>
      <div className="flex h-screen w-full bg-canvas text-ink-strong font-body overflow-hidden relative transition-colors duration-base">
        
        {/* SIDEBAR COMPLETO */}
        <aside className="w-64 bg-surface border-r border-border flex flex-col justify-between shrink-0 h-full">
          <div className="p-6">
            <div className="mb-10 space-y-2">
              <img src={logoFwd} alt="Logo" className="h-10 w-auto" />
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
            <button onClick={() => console.log('Logout')} className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-destructive hover:bg-destructive/10 rounded-[var(--radius)]">
                <LogOut size={20} /> Cerrar Sesión
            </button>
          </div>
        </aside>

        {/* MAIN CONTENT */}
        <main className="flex-1 flex flex-col overflow-y-auto">
          <header className="flex justify-between items-center px-10 py-6 bg-surface/80 border-b border-border sticky top-0 z-20">
            <h2 className="text-2xl font-bold font-heading">Panel de Administración</h2>
            <div className="flex items-center gap-4">
              <input className="bg-surface-sunken px-4 py-2 rounded-full text-sm w-64" placeholder="Buscar..." onChange={(e) => setSearchTerm(e.target.value)} />
              <button onClick={() => setIsDarkMode(!isDarkMode)} className="p-2 rounded-full hover:bg-surface-sunken">
                  {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>
            </div>
          </header>

          <div className="p-10 flex flex-col gap-8">
            <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
               {isLoading ? <div className="col-span-3 h-32 bg-surface animate-pulse" /> : (
                <>
                  <StatCard title="Total Usuarios" value={dashboardData?.stats.totalUsuarios} icon={Users} trend="+12%" isPositive={true} colorClass="text-accent" />
                  <StatCard title="Empresas Activas" value={dashboardData?.stats.empresasActivas} icon={Building} trend="+5%" isPositive={true} colorClass="text-primary" />
                  <StatCard title="Procesos Pendientes" value={dashboardData?.stats.procesosPendientes} icon={Clock} trend="-2%" isPositive={false} colorClass="text-warning" />
                </>
               )}
            </section>

            <section className="bg-surface border border-border rounded-[var(--radius)] p-6">
                <DashboardChart data={dashboardData?.chartData} isLoading={isLoading} />
            </section>

            <section className="bg-surface border border-border rounded-[var(--radius)] overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="bg-surface-sunken text-ink-muted uppercase text-xs">
                        <tr><th className="px-6 py-4">Entidad</th><th className="px-6 py-4">Acción</th><th className="px-6 py-4">Fecha</th><th className="px-6 py-4">Estado</th></tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {filteredActivity.map(item => (
                            <tr key={item.id} className="hover:bg-surface-sunken cursor-pointer" onClick={() => setSelectedActivity(item)}>
                                <td className="px-6 py-4 flex items-center gap-3">{renderEntityIcon(item.type)}{item.name}</td>
                                <td className="px-6 py-4">{item.action}</td>
                                <td className="px-6 py-4">{item.date}</td>
                                <td className="px-6 py-4"><StatusBadge status={item.status} /></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </section>
          </div>
        </main>

        {/* DRAWER COMPLETO */}
        <div className={`fixed inset-0 bg-ink-strong/40 z-40 transition-opacity ${selectedActivity ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={() => !isProcessing && setSelectedActivity(null)} />
        <div className={`fixed top-0 right-0 h-full w-full max-w-md bg-surface border-l border-border z-50 transform transition-transform ${selectedActivity ? 'translate-x-0' : 'translate-x-full'}`}>
           {selectedActivity && (
             <div className="p-6 flex flex-col h-full">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold font-heading">{selectedActivity.name}</h3>
                    <button onClick={() => setSelectedActivity(null)}><X size={20} /></button>
                </div>
                <div className="flex-1 space-y-4 text-ink-muted">
                    <p><strong>Acción:</strong> {selectedActivity.action}</p>
                    <p><strong>Email:</strong> {selectedActivity.email}</p>
                    <p><strong>Detalle:</strong> {selectedActivity.details}</p>
                </div>
                <div className="flex gap-4 pt-6 border-t border-border">
                    <button onClick={() => handleUpdateStatus(selectedActivity.id, 'Completado')} disabled={isProcessing} className="bg-success flex-1 text-white py-3 rounded-[var(--radius)] font-bold">Aprobar</button>
                    <button onClick={() => handleUpdateStatus(selectedActivity.id, 'Rechazado')} disabled={isProcessing} className="bg-destructive flex-1 text-white py-3 rounded-[var(--radius)] font-bold">Rechazar</button>
                </div>
             </div>
           )}
        </div>
      </div>
    </AuthGuard>
  );
}