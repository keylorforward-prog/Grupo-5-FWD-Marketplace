import React from 'react';
import { NavLink } from 'react-router-dom';

const SidebarEmpresa = () => {
  return (
    <aside className="se-sidebar">
      <div className="se-sidebar-header">
        <div className="se-sidebar-logo">
          <span className="material-symbols-outlined se-headline-md" style={{ fontVariationSettings: "'FILL' 1" }}>pentagon</span>
        </div>
        <div>
          <h1 className="se-headline-md" style={{ color: 'var(--color-vibrant-blue)', margin: 0 }}>FWD Talent</h1>
          <p className="se-label-sm" style={{ color: 'var(--color-on-surface-variant)', margin: 0 }}>Recruitment Suite</p>
        </div>
      </div>
      
      <nav className="se-nav-menu">
        <NavLink to="#" className={({isActive}) => `se-nav-item se-nav-item-blue se-label-bold ${isActive ? 'active' : ''}`}>
          <span className="material-symbols-outlined">explore</span>
          <span>Explore</span>
        </NavLink>
        
        <NavLink to="#" className={({isActive}) => `se-nav-item se-nav-item-purple se-label-bold ${isActive ? 'active' : ''}`}>
          <span className="material-symbols-outlined">dashboard</span>
          <span>Dashboard</span>
        </NavLink>
        
        <NavLink to="#" className={({isActive}) => `se-nav-item se-nav-item-pink se-label-bold ${isActive ? 'active' : ''}`}>
          <span className="material-symbols-outlined">description</span>
          <span>Applications</span>
        </NavLink>
        
        <NavLink to="#" className={({isActive}) => `se-nav-item se-nav-item-teal se-label-bold ${isActive ? 'active' : ''}`}>
          <span className="material-symbols-outlined">mail</span>
          <span>Messages</span>
        </NavLink>
        
        <NavLink to="#" className={({isActive}) => `se-nav-item se-nav-item-orange se-label-bold ${isActive ? 'active' : ''}`}>
          <span className="material-symbols-outlined">person</span>
          <span>Profile</span>
        </NavLink>
        
        <NavLink to="/empresa/settings" className="se-nav-item se-nav-item-purple se-label-bold active">
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>settings</span>
          <span>Settings</span>
        </NavLink>
      </nav>
      
      <div style={{ marginTop: 'auto' }}>
        <button className="se-post-job-btn se-label-bold hard-edge-shadow">
          <span className="material-symbols-outlined">add</span>
          Post a Job
        </button>
      </div>
    </aside>
  );
};

export default SidebarEmpresa;
