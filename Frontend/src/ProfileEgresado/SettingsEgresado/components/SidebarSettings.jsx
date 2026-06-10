import React from 'react';
import { Compass, LayoutDashboard, FileText, MessageSquare, User, Settings } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import ProfileDefaultImage from '../../../../../../public/Imgs/ProfileDefaultImage.png';

const SidebarSettings = () => {
  const location = useLocation();

  const navItems = [
    { name: 'Explorar', icon: Compass, path: '#' },
    { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { name: 'Mis Postulaciones', icon: FileText, path: '#' },
    { name: 'Mensajes', icon: MessageSquare, path: '#' },
    { name: 'Mi Perfil', icon: User, path: '/PerfilEgresado' },
    { name: 'Configuración', icon: Settings, path: '/Configuracion' },
  ];

  return (
    <aside className="settings-sidebar">
      <div className="sidebar-header">
        <div className="sidebar-brand">FWD Talent.</div>
        <div className="sidebar-role">JUNIOR DEVELOPER</div>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path || (item.path === '/Configuracion' && location.pathname.includes('/Configuracion'));
          return (
            <Link key={item.name} to={item.path} className={`sidebar-link ${isActive ? 'active' : ''}`}>
              <Icon size={18} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-user">
          <img src={ProfileDefaultImage} alt="Alex Rivera" />
          <div className="sidebar-user-info">
            <span className="sidebar-user-name">Alex Rivera</span>
            <Link to="/PerfilEgresado" className="sidebar-user-link">Ver Portafolio</Link>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default SidebarSettings;
