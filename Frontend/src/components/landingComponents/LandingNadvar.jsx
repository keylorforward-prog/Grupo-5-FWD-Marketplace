import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '../comun/LanguageSwitcher';
import ThemeSwitcher from '../comun/ThemeSwitcher';

export default function LandingNavbar() {
  const { t } = useTranslation();

  return (
    <nav className="landing-navbar">
      <div className="landing-navbar-left">
        <Link to="/#como-funciona">{t('landing.howItWorks', 'Cómo funciona')}</Link>
        <Link to="/#beneficios">{t('landing.benefits', 'Beneficios')}</Link>
      </div>

      <div className="landing-navbar-logo">
        <Link to="/">
          <img
            src="/Imgs/Logotipo/Digital/FWD - Logotipo-01.jpg"
            alt="FWD Marketplace"
            className="navbar-logo-img"
          />
        </Link>
      </div>

      <div className="landing-navbar-right">
        <Link to="/empresas">{t('landing.empresas', 'Empresas')}</Link>
        <ThemeSwitcher />
        <LanguageSwitcher />
        <Link to="/login" className="landing-btn landing-btn-primary">
          {t('landing.acceder', 'Iniciar sesión')}
        </Link>
      </div>
    </nav>
  );
}
