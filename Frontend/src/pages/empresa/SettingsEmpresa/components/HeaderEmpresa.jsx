import React from 'react';
import { Search, Bell, HelpCircle } from 'lucide-react';

const HeaderEmpresa = () => {
  return (
    <header className="header-empresa">
      <h1 className="header-title">Configuración</h1>
      
      <div className="header-actions">
        <div className="search-bar">
          <Search size={18} className="text-[var(--color-ink-muted)]" />
          <input type="text" placeholder="Search..." />
        </div>
        
        <Bell size={20} className="header-icon" style={{ color: 'var(--color-magenta)' }} />
        <HelpCircle size={20} className="header-icon" style={{ color: 'var(--color-accent)' }} />
        
        <div className="header-user">
          <div className="user-info">
            <span className="user-name">Admin User</span>
            <span className="user-role">Administrator</span>
          </div>
          <div className="user-avatar" style={{ backgroundImage: 'url(/Imgs/ProfileDefaultImage.png)', backgroundSize: 'cover' }}></div>
        </div>
      </div>
    </header>
  );
};

export default HeaderEmpresa;
