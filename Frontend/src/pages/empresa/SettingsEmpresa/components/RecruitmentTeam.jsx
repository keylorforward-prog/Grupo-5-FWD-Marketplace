import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const STORAGE_KEY = 'empresa_recruitment_team';

const RecruitmentTeam = () => {
  const { t } = useTranslation();
  const [members, setMembers] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [
        { id: 1, nombre: 'Andrea Mendoza', rol: 'seniorRecruiter', online: true },
        { id: 2, nombre: 'Roberto Jiménez', rol: 'technicalSourcer', online: true },
      ];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(members));
  }, [members]);

  const toggleOnline = (id) => {
    setMembers((prev) => prev.map((m) => m.id === id ? { ...m, online: !m.online } : m));
  };

  const getInitials = (name) =>
    name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();

  const rolLabel = (rol) => {
    const map = {
      seniorRecruiter: t('recruitmentTeam.seniorRecruiter'),
      technicalSourcer: t('recruitmentTeam.technicalSourcer'),
    };
    return map[rol] || rol;
  };

  return (
    <section className="se-card se-card-orange hard-edge-shadow" style={{ height: '100%' }}>
      <div className="se-section-header">
        <h3 className="se-headline-md se-section-title" style={{ margin: 0 }}>
          <span className="material-symbols-outlined" style={{ color: 'var(--color-vibrant-orange)' }}>groups</span>
          {t('recruitmentTeam.title')}
        </h3>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-base)' }}>
        {members.map((member) => (
          <div className="se-member-item" key={member.id}>
            <div className="se-member-info" style={{ cursor: 'pointer' }} role="button" tabIndex={0} onClick={() => toggleOnline(member.id)} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleOnline(member.id); } }}>
              <div className="se-member-avatar-wrapper">
                <div className="se-member-avatar"
                  style={{
                    width: '40px', height: '40px', borderRadius: '50%',
                    backgroundColor: `hsl(${member.nombre.split('').reduce((a, c) => a + c.charCodeAt(0), 0) % 360}, 62%, 52%)`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#fff', fontWeight: 'bold', fontSize: '14px',
                  }}
                >
                  {getInitials(member.nombre)}
                </div>
                <div className="se-status-dot" style={{ backgroundColor: member.online ? '#10b981' : '#9ca3af' }}></div>
              </div>
              <div>
                <p className="se-label-bold" style={{ margin: 0, color: 'var(--color-on-surface)' }}>{member.nombre}</p>
                <p className="se-label-sm" style={{ margin: 0, color: 'var(--color-vibrant-orange)' }}>{rolLabel(member.rol)}</p>
              </div>
            </div>
            <span className="material-symbols-outlined se-member-check"
              style={{ color: member.online ? 'var(--color-vibrant-teal)' : '#d1d5db', fontVariationSettings: "'FILL' 1" }}
            >
              {member.online ? 'check_circle' : 'radio_button_unchecked'}
            </span>
          </div>
        ))}
      </div>

      <button className="se-invite-btn se-label-bold" onClick={() => alert('Funcionalidad disponible proximamente.')}>
        <span className="material-symbols-outlined">person_add</span>
        {t('recruitmentTeam.inviteMember')}
      </button>
    </section>
  );
};

export default RecruitmentTeam;
