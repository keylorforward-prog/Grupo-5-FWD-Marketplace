import { useTranslation } from 'react-i18next';

export default function CTASection() {
  const { t } = useTranslation();

  return (
    <section className="cta-section">

      <div className="cta-card">

        <h2>{t('landing.cta.title', '¿Listo para dar el siguiente paso?')}</h2>

        <p>
          {t('landing.cta.subtitle', 'Únete a la mayor red de talento tech en Costa Rica.')}
        </p>

        <div className="cta-buttons">

          <button className="landing-btn landing-btn-yellow">
            {t('landing.cta.btnRegister', 'Registrarse Gratis')}
          </button>

          <button className="landing-btn landing-btn-outline">
            {t('landing.cta.btnProjects', 'Ver Proyectos')}
          </button>

        </div>

      </div>

    </section>
  );
}