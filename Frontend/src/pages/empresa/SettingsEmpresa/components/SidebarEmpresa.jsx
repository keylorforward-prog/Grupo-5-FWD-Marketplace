import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../../../context/AuthContext';
import { useTranslation } from 'react-i18next';

const SidebarEmpresa = () => {
  const { user } = useAuth();
  const { t } = useTranslation();

  return (
    <aside className="se-sidebar">
      <div className="se-sidebar-header">
        <div className="se-sidebar-logo" style={{ overflow: 'hidden' }}>
          {user?.foto_perfil ? (
            <img 
              src={user.foto_perfil} 
              alt="Company Logo" 
              style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
            />
          ) : (
            <span className="material-symbols-outlined se-headline-md" style={{ fontVariationSettings: "'FILL' 1" }}>pentagon</span>
          )}
        </div>
        <div>
          <h1 className="se-headline-md" style={{ color: 'var(--color-vibrant-blue)', margin: 0 }}>FWD Talent</h1>
          <p className="se-label-sm" style={{ color: 'var(--color-on-surface-variant)', margin: 0 }}>{t('sidebar.recruitmentSuite')}</p>
        </div>
      </div>
      
      <nav className="se-nav-menu">
        <NavLink to="#" className={({isActive}) => `se-nav-item se-nav-item-blue se-label-bold ${isActive ? 'active' : ''}`}>
          <span className="material-symbols-outlined">explore</span>
          <span>{t('sidebar.explore')}</span>
        </NavLink>
        
        <NavLink to="/DashboardEmpresario" className={({isActive}) => `se-nav-item se-nav-item-purple se-label-bold ${isActive ? 'active' : ''}`}>
          <span className="material-symbols-outlined">dashboard</span>
          <span>{t('sidebar.dashboard')}</span>
        </NavLink>
        
        <NavLink to="#" className={({isActive}) => `se-nav-item se-nav-item-pink se-label-bold ${isActive ? 'active' : ''}`}>
          <span className="material-symbols-outlined">description</span>
          <span>{t('sidebar.applications')}</span>
        </NavLink>
        
        <NavLink to="#" className={({isActive}) => `se-nav-item se-nav-item-teal se-label-bold ${isActive ? 'active' : ''}`}>
          <span className="material-symbols-outlined">mail</span>
          <span>{t('sidebar.messages')}</span>
        </NavLink>
        
        <NavLink to="#" className={({isActive}) => `se-nav-item se-nav-item-orange se-label-bold ${isActive ? 'active' : ''}`}>
          <span className="material-symbols-outlined">person</span>
          <span>{t('sidebar.profile')}</span>
        </NavLink>
        
      </nav>
      
      <div style={{ marginTop: 'auto' }}>
        <button className="se-post-job-btn se-label-bold hard-edge-shadow">
          <span className="material-symbols-outlined">add</span>
          {t('sidebar.postJob')}
        </button>
      </div>
    </aside>
  );
};

export default SidebarEmpresa;
