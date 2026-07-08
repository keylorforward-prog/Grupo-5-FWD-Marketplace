import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Menu, X } from 'lucide-react';
import LanguageSwitcher from '../comun/LanguageSwitcher';
import ThemeSwitcher from '../comun/ThemeSwitcher';

export default function LandingNavbar() {
  const { t } = useTranslation();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="landing-navbar">
      <div className="landing-navbar-logo">
        <Link to="/">
          <img
            src="/Imgs/Logotipo/Digital/FWD - Logotipo-01.jpg"
            alt="FWD Marketplace"
            className="navbar-logo-img"
          />
        </Link>
      </div>

      <button
        className="landing-hamburger"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle menu"
      >
        {menuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      <div className={`landing-navbar-links ${menuOpen ? 'landing-navbar-links-open' : ''}`}>
        <div className="landing-navbar-left">
          <Link to="/#como-funciona" onClick={() => setMenuOpen(false)}>{t('landing.howItWorks', 'Cómo funciona')}</Link>
          <Link to="/#beneficios" onClick={() => setMenuOpen(false)}>{t('landing.benefits', 'Beneficios')}</Link>
        </div>

        <div className="landing-navbar-right">
          <Link to="/empresas" onClick={() => setMenuOpen(false)}>{t('landing.empresas', 'Empresas')}</Link>
          <ThemeSwitcher />
          <LanguageSwitcher />
          <Link to="/login" className="landing-btn landing-btn-primary" onClick={() => setMenuOpen(false)}>
            {t('landing.acceder', 'Iniciar sesión')}
          </Link>
        </div>
      </div>
    </nav>
  );
}
