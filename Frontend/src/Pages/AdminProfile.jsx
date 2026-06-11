import { useState } from 'react';
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
  Clock
} from 'lucide-react';

// Importación de módulos aislados (Corregido para coincidir con la carpeta "components" en minúscula)
import SidebarItem from '../components/SidebarItem';
import StatCard from '../components/StatCard';
import StatusBadge from '../components/StatusBadge';

export default function AdminProfile() {
  const [activeMenu, setActiveMenu] = useState('dashboard');

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
          
          {/* Métricas (StatCards) */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard title="Total Usuarios" value="1,248" icon={Users} trend="+12% mensual" isPositive={true} colorClass="text-accent" />
            <StatCard title="Empresas Activas" value="342" icon={Building} trend="+5% mensual" isPositive={true} colorClass="text-magenta" />
            <StatCard title="Procesos Pendientes" value="89" icon={Clock} trend="-2% mensual" isPositive={false} colorClass="text-warning" />
          </section>

          {/* Tabla de Actividad Reciente */}
          <section className="bg-[#1e293b] border border-border/10 rounded-2xl shadow-elevated overflow-hidden flex flex-col">
            <div className="px-6 py-5 border-b border-border/10 flex justify-between items-center bg-[#0f172a]/50">
              <h3 className="font-bold text-canvas">Actividad Reciente</h3>
              <button className="text-sm font-medium text-accent hover:text-canvas transition-colors">Ver historial completo</button>
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
                  <tr className="hover:bg-[#0f172a]/40 transition-colors group cursor-pointer">
                    <td className="px-6 py-4 font-medium flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-accent">
                        <Building size={14} />
                      </div>
                      TechNova Costa Rica
                    </td>
                    <td className="px-6 py-4 text-ink-muted group-hover:text-canvas transition-colors">Registro de Empresa</td>
                    <td className="px-6 py-4 text-ink-muted">Hoy, 10:23 AM</td>
                    <td className="px-6 py-4"><StatusBadge status="Pendiente" /></td>
                    <td className="px-6 py-4 flex justify-end">
                      <button className="text-ink-muted hover:text-accent transition-colors p-2 rounded-full hover:bg-accent/10"><MoreVertical size={18} /></button>
                    </td>
                  </tr>
                  <tr className="hover:bg-[#0f172a]/40 transition-colors group cursor-pointer">
                    <td className="px-6 py-4 font-medium flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-magenta/20 flex items-center justify-center text-magenta">
                        <GraduationCap size={14} />
                      </div>
                      Carlos Mendoza
                    </td>
                    <td className="px-6 py-4 text-ink-muted group-hover:text-canvas transition-colors">Actualización de Perfil</td>
                    <td className="px-6 py-4 text-ink-muted">Ayer, 04:15 PM</td>
                    <td className="px-6 py-4"><StatusBadge status="Completado" /></td>
                    <td className="px-6 py-4 flex justify-end">
                      <button className="text-ink-muted hover:text-accent transition-colors p-2 rounded-full hover:bg-accent/10"><MoreVertical size={18} /></button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

        </div>
      </main>
    </div>
  );
}
