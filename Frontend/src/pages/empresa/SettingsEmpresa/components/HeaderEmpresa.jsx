import React from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../../../context/AuthContext';

const HeaderEmpresa = () => {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  
  const defaultAvatar = "https://lh3.googleusercontent.com/aida-public/AB6AXuDCyAeBVTU758T9W0t9G3fdkFAAzMTtUbJCLVy42xIgEsi7SF_RG-_Syzi7lmzQMWbFd6Nox8IcvB2IWEFo_I_Ie1o9eXon1PpEg_dTVl1QCxFUxAojDAZKHnClRyJ5NKPtw6qzihmMCW0bK1afkwxi9CycTamheR--seBnvQRLKiPhs9vPJRbWezZKhLUaTrpkLWNEs-3bS50gyX6CGQjrJ-e8oY4vl4ihX6yL6cWMxrUnIZyyYTYJg0tFTmqQIsA2RhGqO3MxsbU";
  const avatarUrl = user?.foto_perfil || defaultAvatar;
  const userName = user?.nombre || t('header.adminUser');
  const userRole = user?.rol || t('header.administrator');

  const toggleLanguage = () => {
    const nextLang = i18n.language === 'es' ? 'en' : 'es';
    i18n.changeLanguage(nextLang);
  };

  return (
    <header className="se-header">
      <h2 className="se-headline-md" style={{ color: 'var(--color-vibrant-blue)', margin: 0 }}>{t('header.configuration')}</h2>
      
      <div className="se-header-actions">
        <div className="se-search-bar">
          <span className="material-symbols-outlined" style={{ color: 'var(--color-vibrant-blue)' }}>search</span>
          <input className="se-label-bold" type="text" placeholder={t('header.search')} />
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-base)' }}>
          <button 
            className="se-label-bold" 
            style={{ padding: '4px 8px', borderRadius: '4px', border: '1px solid var(--color-outline-variant)', background: 'transparent', cursor: 'pointer', color: 'var(--color-on-surface-variant)' }}
            onClick={toggleLanguage}
          >
            {i18n.language.toUpperCase()}
          </button>
          <button className="se-icon-btn se-icon-btn-pink">
            <span className="material-symbols-outlined">notifications</span>
          </button>
          <button className="se-icon-btn se-icon-btn-teal">
            <span className="material-symbols-outlined">help</span>
          </button>
        </div>
        
        <div className="se-user-profile">
          <div style={{ textAlign: 'right' }}>
            <p className="se-label-bold" style={{ margin: 0, color: 'var(--color-on-surface)' }}>{userName}</p>
            <p style={{ margin: 0, fontSize: '10px', color: 'var(--color-vibrant-blue)', textTransform: 'uppercase', fontWeight: 'bold', letterSpacing: '0.1em' }}>{userRole}</p>
          </div>
          <div className="se-user-avatar" style={{ overflow: 'hidden' }}>
            {user?.foto_perfil ? (
              <img 
                src={avatarUrl} 
                alt="User profile" 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            ) : (
              <img 
                src={avatarUrl} 
                alt="User profile" 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default HeaderEmpresa;
