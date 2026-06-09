import { LayoutDashboard, Compass, FolderKanban, MessageCircle, Settings, HelpCircle, LogOut } from 'lucide-react';

interface SidebarProps {
  activeItem?: string;
}

const navItems = [
  { icon: Compass,         label: 'Explorar',         path: '/explorar',     badge: 0 },
  { icon: FolderKanban,   label: 'Mis Proyectos',    path: '/proyectos',    badge: 0 },
  { icon: MessageCircle,  label: 'Mensajes',          path: '/mensajes',     badge: 0 },
  { icon: Settings,        label: 'Configuración',    path: '/configuracion', badge: 0 },
];

const bottomItems = [
  { icon: HelpCircle, label: 'Soporte', path: '/soporte', badge: 0 },
  { icon: LogOut, label: 'Cerrar Sesión', path: '/logout', badge: 0 },
];

export default function Sidebar({ activeItem = 'Mis Proyectos' }: SidebarProps) {
  return (
    <aside className="w-64 h-screen flex flex-col fixed left-0 top-0 z-40 bg-[#F8FAFC] border-r border-gray-200">
      
      {/* Logo */}
      <div className="px-6 py-6 pb-4">
        <div>
          <h1 className="text-lg font-bold text-brand-800 tracking-tight">FWD Projects</h1>
          <p className="text-xs text-gray-400">Fundación Forward</p>
        </div>
      </div>

      {/* User Profile Area */}
      <div className="px-4 mb-6">
        <a href="/panel" className="flex items-center gap-3 px-2 py-2 rounded-xl hover:bg-gray-100 transition-colors">
          <img src="https://i.pravatar.cc/150?u=admin" alt="Admin" className="w-10 h-10 rounded-full object-cover shadow-sm" />
          <div>
            <h2 className="text-sm font-bold text-gray-900 tracking-tight leading-tight">Panel de Talento</h2>
            <p className="text-[10px] font-bold text-brand-600 uppercase tracking-wider">EMPRESA PREMIUM</p>
          </div>
        </a>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeItem === item.label;
          return (
            <a
              key={item.label}
              href={item.path}
              className={`group flex items-center gap-3 px-3 py-2.5 rounded-full text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-[#1868D5] text-white shadow-md shadow-blue-500/20'
                  : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-gray-600'}`} />
              <span className="flex-1">{item.label}</span>
            </a>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="px-4 pb-6 space-y-1">
        {bottomItems.map((item) => {
          const Icon = item.icon;
          return (
            <a key={item.label} href={item.path}
              className="flex items-center gap-3 px-3 py-2.5 rounded-full text-sm font-medium text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-all duration-200"
            >
              <Icon className="w-5 h-5 text-gray-400" />
              <span>{item.label}</span>
            </a>
          );
        })}
      </div>
    </aside>
  );
}
