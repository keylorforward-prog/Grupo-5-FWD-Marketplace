import React from 'react';
import { useTranslation } from 'react-i18next';

const DangerZone = () => {
  const { t } = useTranslation();
  return (
    <section className="se-card se-card-pink hard-edge-shadow" style={{ marginTop: 'var(--spacing-xl)' }}>
      <div className="se-danger-layout">
        <div>
          <h3 className="se-headline-md se-section-title" style={{ color: 'var(--color-vibrant-pink)', margin: 0 }}>
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>dangerous</span>
            {t('dangerZone.title')}
          </h3>
          <p className="se-body-md se-danger-text" style={{ color: 'var(--color-on-surface-variant)' }}>
            {t('dangerZone.warning')}
          </p>
        </div>
        <button className="se-danger-btn se-label-bold">
          {t('dangerZone.deactivate')}
        </button>
      </div>
    </section>
  );
};

export default DangerZone;
