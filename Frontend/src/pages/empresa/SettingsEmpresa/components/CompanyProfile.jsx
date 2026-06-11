import React from 'react';

const CompanyProfile = () => {
  return (
    <section className="se-card se-card-teal hard-edge-shadow" style={{ overflow: 'hidden' }}>
      <div className="se-profile-layout">
        
        {/* Company Avatar */}
        <div className="se-avatar-container">
          <div className="se-avatar-box">
            <img 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDAG8lvLxhVoKXJ-EnxOLfvfYASr2wMcXn-Ep7yClWOqMikPElWKRZh_OXTLJjFqvhZCjVFOZEzXhuzuVl3QokudQL54fU9zfxrFAOa4CjDu4N5NE7Ly9nJADj8tBS-salgE2ixD_lJvt8k0ZbSTQVx69drGoMTbbiWuKOmBYgll0COcnETyaQVryjX0GJ4giSKq7vIZmryVErXyDy4Ny-UaJE74AnKW38ZBhrm0wpf0eEDFQtrHbWvwsw41C4N343pzk040njET2E" 
              alt="TechCorp Logo" 
              className="se-avatar-img"
            />
          </div>
          <button className="se-edit-avatar-btn">
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>edit</span>
          </button>
        </div>

        {/* Fields Grid */}
        <div className="se-form-container">
          <h3 className="se-headline-md" style={{ margin: '0 0 var(--spacing-sm) 0' }}>Perfil de la Empresa</h3>
          
          <div className="se-form-grid">
            <div className="se-input-group">
              <label className="se-label-bold">Commercial Name</label>
              <input type="text" className="se-input se-body-md" defaultValue="TechCorp International" />
            </div>
            
            <div className="se-input-group">
              <label className="se-label-bold">Website</label>
              <div className="se-input-addon-wrapper">
                <span className="se-input-addon se-label-bold">https://</span>
                <input type="text" className="se-input se-body-md" defaultValue="techcorp.io" />
              </div>
            </div>
            
            <div className="se-input-group">
              <label className="se-label-bold">Legal ID</label>
              <input type="text" className="se-input se-body-md" placeholder="Tax Identification Number" />
            </div>
            
            <div className="se-input-group">
              <label className="se-label-bold">Industry</label>
              <select className="se-input se-body-md">
                <option value="Software Development">Software Development</option>
                <option value="Cloud Computing">Cloud Computing</option>
                <option value="AI & Data Science">AI & Data Science</option>
              </select>
            </div>
          </div>
          
          <div className="se-input-group">
            <label className="se-label-bold">Short Description</label>
            <textarea className="se-input se-body-md" rows="3" placeholder="Brief overview of TechCorp..."></textarea>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: 'var(--spacing-base)' }}>
            <button className="se-save-btn se-label-bold hard-edge-shadow">
              Guardar cambios
            </button>
          </div>
        </div>

      </div>
    </section>
  );
};

export default CompanyProfile;
