import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '../comun/LanguageSwitcher';
import ThemeSwitcher from '../comun/ThemeSwitcher';

export default function LandingNavbar() {
  const { t } = useTranslation();

  return (
    <nav className="landing-navbar">
      <div className="landing-navbar-left">
      </div>

      <div className="landing-navbar-logo">
        <span>FWD.</span>
      </div>

      <div className="landing-navbar-right" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>

        <ThemeSwitcher />
        <LanguageSwitcher />
        
        <Link to="/login" className="landing-btn landing-btn-yellow">
          {t('landing.acceder', 'Acceder')}
        </Link>
      </div>
    </nav>
  );
}