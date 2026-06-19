import { Monitor, Palette, Users, Rocket } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function FeaturesSection() {
  const { t } = useTranslation();

  return (
    <section className="features-section">

      <div className="section-title">
        <h2>{t('landing.features.title', 'Diseñado para Impulsar')}</h2>
        <p>
          {t('landing.features.subtitle', 'Nuestro ecosistema está estructurado para potenciar tu crecimiento profesional.')}
        </p>
      </div>

      <div className="features-grid">

        <div className="feature-card feature-large">
          <div>
            <h3>{t('landing.features.f1_title', 'Proyectos de Impacto Real')}</h3>

            <p>
              {t('landing.features.f1_desc', 'Trabaja en desafíos reales propuestos por empresas.')}
            </p>
          </div>

          <div className="feature-mini-cards">
            <div className="feature-mini-card feature-mini-blue">
              <span className="feature-mini-icon"><Monitor size={24} /></span>
              <p>{t('landing.features.fs', 'Full Stack')}</p>
            </div>
            <div className="feature-mini-card feature-mini-purple">
              <span className="feature-mini-icon"><Palette size={24} /></span>
              <p>{t('landing.features.uiux', 'UI/UX')}</p>
            </div>
            <div className="feature-mini-card feature-mini-pink">
              <span className="feature-mini-icon"><Users size={24} /></span>
              <p>{t('landing.features.community', 'Comunidad')}</p>
            </div>
            <div className="feature-mini-card feature-mini-yellow">
              <span className="feature-mini-icon"><Rocket size={24} /></span>
              <p>{t('landing.features.evolution', 'Evolución')}</p>
            </div>
          </div>
        </div>

        <div className="feature-card pink-card">
          <h3>{t('landing.features.f2_title', 'Perfil Validado')}</h3>
          <p>
            {t('landing.features.f2_desc', 'Certificamos tus habilidades.')}
          </p>
        </div>

        <div className="feature-card purple-card">
          <h3>{t('landing.features.f3_title', 'Tech Ready')}</h3>
          <p>
            {t('landing.features.f3_desc', 'React, Node.js, Python, AWS y más.')}
          </p>
        </div>

        <div className="feature-card yellow-card">
          <h3>{t('landing.features.f4_title', 'Conexión Corporativa')}</h3>
          <p>
            {t('landing.features.f4_desc', 'Empresas buscando talento validado.')}
          </p>
        </div>

      </div>
    </section>
  );
}