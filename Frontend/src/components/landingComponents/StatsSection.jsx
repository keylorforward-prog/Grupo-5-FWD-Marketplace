import { useTranslation } from 'react-i18next';

export default function StatsSection() {
  const { t } = useTranslation();

  return (
    <section className="stats-section">

      <div className="stat-item">
        <h3>150+</h3>
        <span>{t('landing.stats.companies', 'EMPRESAS ALIADAS')}</span>
      </div>

      {/* Logos strip */}
      <div className="partners-strip">
        <p className="partners-label">{t('landing.partners', 'Con la confianza de empresas líderes')}</p>
      </div>

      <div className="stat-item">
        <h3>500+</h3>
        <span>{t('landing.stats.projects', 'PROYECTOS EJECUTADOS')}</span>
      </div>

      <div className="stat-item">
        <h3>$2M+</h3>
        <span>{t('landing.stats.talent', 'TALENTO MOVILIZADO')}</span>
      </div>

    </section>
  );
}