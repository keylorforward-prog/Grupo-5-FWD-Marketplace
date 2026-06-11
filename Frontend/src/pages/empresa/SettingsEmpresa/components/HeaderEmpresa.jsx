import React from 'react';

const HeaderEmpresa = () => {
  return (
    <header className="se-header">
      <h2 className="se-headline-md" style={{ color: 'var(--color-vibrant-blue)', margin: 0 }}>Configuración</h2>
      
      <div className="se-header-actions">
        <div className="se-search-bar">
          <span className="material-symbols-outlined" style={{ color: 'var(--color-vibrant-blue)' }}>search</span>
          <input className="se-label-bold" type="text" placeholder="Search..." />
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-base)' }}>
          <button className="se-icon-btn se-icon-btn-pink">
            <span className="material-symbols-outlined">notifications</span>
          </button>
          <button className="se-icon-btn se-icon-btn-teal">
            <span className="material-symbols-outlined">help</span>
          </button>
        </div>
        
        <div className="se-user-profile">
          <div style={{ textAlign: 'right' }}>
            <p className="se-label-bold" style={{ margin: 0, color: 'var(--color-on-surface)' }}>Admin User</p>
            <p style={{ margin: 0, fontSize: '10px', color: 'var(--color-vibrant-blue)', textTransform: 'uppercase', fontWeight: 'bold', letterSpacing: '0.1em' }}>Administrator</p>
          </div>
          <img 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDCyAeBVTU758T9W0t9G3fdkFAAzMTtUbJCLVy42xIgEsi7SF_RG-_Syzi7lmzQMWbFd6Nox8IcvB2IWEFo_I_Ie1o9eXon1PpEg_dTVl1QCxFUxAojDAZKHnClRyJ5NKPtw6qzihmMCW0bK1afkwxi9CycTamheR--seBnvQRLKiPhs9vPJRbWezZKhLUaTrpkLWNEs-3bS50gyX6CGQjrJ-e8oY4vl4ihX6yL6cWMxrUnIZyyYTYJg0tFTmqQIsA2RhGqO3MxsbU" 
            alt="User profile" 
            className="se-user-avatar"
          />
        </div>
      </div>
    </header>
  );
};

export default HeaderEmpresa;
