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
      
      <nav className="se-nav-menu" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <NavLink to="/DashboardEmpresa" className="se-nav-item" style={{ color: 'var(--color-on-surface-variant)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '12px', padding: '8px' }}>
          <span className="material-symbols-outlined">home</span>
          <span className="se-label-bold">Inicio</span>
        </NavLink>
        
        <NavLink to="#" className="se-nav-item" style={{ color: 'var(--color-on-surface-variant)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '12px', padding: '8px' }}>
          <span className="material-symbols-outlined">folder</span>
          <span className="se-label-bold">Mis Proyectos</span>
        </NavLink>
        
        <NavLink to="#" className="se-nav-item" style={{ color: 'var(--color-on-surface-variant)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '12px', padding: '8px' }}>
          <span className="material-symbols-outlined">description</span>
          <span className="se-label-bold">Ofertas Recibidas</span>
        </NavLink>
        
        <NavLink to="#" className="se-nav-item" style={{ color: 'var(--color-on-surface-variant)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '12px', padding: '8px' }}>
          <span className="material-symbols-outlined">inventory_2</span>
          <span className="se-label-bold">Entregables</span>
        </NavLink>
        
        <NavLink to="#" className="se-nav-item" style={{ color: 'var(--color-on-surface-variant)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '12px', padding: '8px' }}>
          <span className="material-symbols-outlined">chat_bubble</span>
          <span className="se-label-bold">Mensajes</span>
        </NavLink>

        <NavLink to="#" className="se-nav-item" style={{ color: 'var(--color-on-surface-variant)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '12px', padding: '8px' }}>
          <span className="material-symbols-outlined">groups</span>
          <span className="se-label-bold">Talento Recomendado</span>
        </NavLink>

        <NavLink to="#" className="se-nav-item" style={{ color: 'var(--color-on-surface-variant)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '12px', padding: '8px' }}>
          <span className="material-symbols-outlined">history</span>
          <span className="se-label-bold">Historial de Proyectos</span>
        </NavLink>

        <NavLink to="#" className="se-nav-item" style={{ color: 'var(--color-on-surface-variant)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '12px', padding: '8px' }}>
          <span className="material-symbols-outlined">star</span>
          <span className="se-label-bold">Evaluaciones</span>
        </NavLink>

        <NavLink to="#" className="se-nav-item" style={{ color: 'var(--color-on-surface-variant)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '12px', padding: '8px' }}>
          <span className="material-symbols-outlined">request_quote</span>
          <span className="se-label-bold">Facturacion</span>
        </NavLink>

        <NavLink to="/SettingsEmpresa" className="se-nav-item active" style={{ backgroundColor: 'var(--color-vibrant-teal)', color: '#fff', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', borderRadius: '24px' }}>
          <span className="material-symbols-outlined">settings</span>
          <span className="se-label-bold">Configuracion</span>
        </NavLink>
      </nav>
      
      <div style={{ marginTop: 'auto', padding: '16px', border: '1px solid var(--color-vibrant-teal)', borderRadius: '12px', backgroundColor: 'transparent' }}>
        <p className="se-label-bold" style={{ margin: '0 0 8px 0', color: 'var(--color-on-surface)' }}>¿Necesitas ayuda?</p>
        <p className="se-label-sm" style={{ margin: '0 0 16px 0', color: 'var(--color-on-surface-variant)', lineHeight: '1.4' }}>
          Nuestro centro de ayuda está disponible 24/7 para ti.
        </p>
        <button style={{ 
          width: '100%', 
          padding: '8px', 
          background: 'transparent', 
          border: '1px solid var(--color-vibrant-teal)', 
          color: 'var(--color-vibrant-teal)', 
          borderRadius: '20px', 
          cursor: 'pointer', 
          fontWeight: 'bold',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '6px'
        }}>
          <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>help</span>
          Ir al Centro de Ayuda
        </button>
      </div>
    </aside>
  );
};

export default SidebarEmpresa;
