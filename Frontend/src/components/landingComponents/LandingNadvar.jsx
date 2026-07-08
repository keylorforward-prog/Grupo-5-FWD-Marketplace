import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '../comun/LanguageSwitcher';
import ThemeSwitcher from '../comun/ThemeSwitcher';

export default function LandingNavbar() {
  const { t } = useTranslation();

  return (
    <nav className="landing-navbar">
      <div className="landing-navbar-left">
        <Link to="/proyectos">{t('landing.projects', 'Projects')}</Link>
        <Link to="/juniors">{t('landing.juniors', 'Juniors')}</Link>
      </div>

      <div className="landing-navbar-logo">
        <Link to="/">
          <img
            src="/Imgs/Logotipo/Digital/FWD - Logotipo - Slogan-01 v2.png"
            alt="FWD Marketplace"
            className="navbar-logo-img"
          />
        </Link>
      </div>

      <div className="landing-navbar-right" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <Link to="/empresas">{t('landing.empresas', 'Empresas')}</Link>

        <ThemeSwitcher />
        <LanguageSwitcher />
        
        <Link to="/login" className="landing-btn landing-btn-yellow">
          {t('landing.acceder', 'Acceder')}
        </Link>
      </div>
    </nav>
  );
}