import { useTranslation } from 'react-i18next';

const RecruitmentTeam = () => {
  const { t } = useTranslation();
  return (
    <section className="se-card se-card-orange hard-edge-shadow" style={{ height: '100%' }}>
      <div className="se-section-header">
        <h3 className="se-headline-md se-section-title" style={{ margin: 0 }}>
          <span className="material-symbols-outlined" style={{ color: 'var(--color-vibrant-orange)' }}>groups</span>
          {t('recruitmentTeam.title')}
        </h3>
        <button className="se-link-btn se-label-bold">{t('recruitmentTeam.manageTeam')}</button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-base)' }}>
        {/* Member 1 */}
        <div className="se-member-item">
          <div className="se-member-info">
            <div className="se-member-avatar-wrapper">
              <img 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDMOw0LiouL_U0cv8eXkRC4by1PjFWEKrYWtv2x67mi0tJbf_WW9fu8CBb857nVohSGrzl1DqIvtzwsR8WSqXIymeMluRYW_u0MZsj5DBcDr5-HXkTN_iZsF-KW5wXm_zQ178qQoO9LJgvStuPyH8dRQ3z4dvum6CpV4rY8tnAVX-lewLDY_GoAOacH5xCHyYatvVH8MPMbWhJccdKj6ea4oTRVaMLJdDB48fKbaoyhmjCuLFnkKJqfua75Ncy6JAmhH0beukKJ6Vw" 
                alt="Andrea Mendoza" 
                className="se-member-avatar"
              />
              <div className="se-status-dot"></div>
            </div>
            <div>
              <p className="se-label-bold" style={{ margin: 0, color: 'var(--color-on-surface)' }}>Andrea Mendoza</p>
              <p className="se-label-sm" style={{ margin: 0, color: 'var(--color-vibrant-orange)' }}>{t('recruitmentTeam.seniorRecruiter')}</p>
            </div>
          </div>
          <span className="material-symbols-outlined se-member-check" style={{ color: 'var(--color-vibrant-teal)', fontVariationSettings: "'FILL' 1" }}>check_circle</span>
        </div>

        {/* Member 2 */}
        <div className="se-member-item">
          <div className="se-member-info">
            <div className="se-member-avatar-wrapper">
              <img 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuA5ZPNTGRwvkpHjkfrbvyxfrxTqXcqlDo6KDLkx4eMhhkOxrIGWbtf5WMbh1_hTeg0vz624w3syJBEnwGwTpuPejFlksO5Fkp1qvKhLMjhXQp3Q9GE4HB-atLXGHROoeM1nyOakfxqlYvip1Ab10PfJNDeqMvxf8QAS2Dm-B58hx3sVjn3_hCL-UGY16VyvdU0lRBzjFw3lQvCZnSNxR0rKUG8E9XspFZnvlAZ0JzIxrjQh2B3Squ9RqgdEvfmxxOJGrrRSHSya5JQ" 
                alt="Roberto Jiménez" 
                className="se-member-avatar"
              />
              <div className="se-status-dot"></div>
            </div>
            <div>
              <p className="se-label-bold" style={{ margin: 0, color: 'var(--color-on-surface)' }}>Roberto Jiménez</p>
              <p className="se-label-sm" style={{ margin: 0, color: 'var(--color-vibrant-orange)' }}>{t('recruitmentTeam.technicalSourcer')}</p>
            </div>
          </div>
          <span className="material-symbols-outlined se-member-check" style={{ color: 'var(--color-vibrant-teal)', fontVariationSettings: "'FILL' 1" }}>check_circle</span>
        </div>
      </div>

      <button className="se-invite-btn se-label-bold">
        <span className="material-symbols-outlined">person_add</span>
        {t('recruitmentTeam.inviteMember')}
      </button>
    </section>
  );
};

export default RecruitmentTeam;
