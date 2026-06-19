import { ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import FwdLogo from '../../assets/fwd-logo.png';

export default function HeroSection() {
  const { t } = useTranslation();

  return (
    <section className="hero-section">
      <div className="hero-content">

        <span className="hero-badge">
          {t('landing.hero.badge', 'FORWARD MOMENTUM ECOSYSTEM')}
        </span>

        <h1>
          {t('landing.hero.title1', 'Construye el')} <span className="pink">{t('landing.hero.titlePink', 'Futuro')}</span>
          <br />
          {t('landing.hero.title2', 'de tu Carrera')} <span className="cyan">{t('landing.hero.titleCyan', 'Hoy.')}</span>
        </h1>

        <p>
          {t('landing.hero.description', 'Conectamos el talento emergente más brillante con proyectos reales de la industria.')}
        </p>

        <div className="hero-buttons">
          <button className="landing-btn landing-btn-purple">
            {t('landing.hero.btnExplore', 'Explorar Proyectos')}
            <ArrowRight size={16} />
          </button>

          <button className="landing-btn landing-btn-white">
            {t('landing.hero.btnCompanies', 'Para Empresas')}
          </button>
        </div>

      </div>

      <div className="hero-logo">
        <img
          src={FwdLogo}
          alt="FWD Marketplace Logo"
          className="hero-logo-img"
        />
      </div>
    </section>
  );
}