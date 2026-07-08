import { useTranslation } from 'react-i18next';

export default function LandingFooter() {
  const { t } = useTranslation();

  return (
    <footer className="landing-footer">

      <div className="footer-top">
        {/* Brand column */}
        <div className="footer-brand">
          <Link to="/" className="footer-logo-link" aria-label="FWD Marketplace">
            <img
              src="/Imgs/Logotipo/Digital/Sintesis/FWD - Sintesis-01.png"
              alt="FWD Marketplace"
              className="footer-logo"
            />
          </Link>
          <span className="footer-kicker">
            <Sparkles size={14} />
            {t('landing.footer.kicker', 'Forward Momentum Ecosystem')}
          </span>
          <p className="footer-tagline">
            {t('landing.footer.tagline', 'Conectamos talento tech emergente con empresas que construyen productos reales, portafolios verificables y oportunidades de crecimiento.')}
          </p>
        </div>

        <div>
          <h4>{t('landing.footer.platform', 'Plataforma')}</h4>

          <ul>
            <li>{t('landing.projects', 'Proyectos')}</li>
            <li>{t('landing.empresas', 'Empresas')}</li>
            <li>{t('landing.juniors', 'Juniors')}</li>
          </ul>
        </div>

        <div>
          <h4>{t('landing.footer.legal', 'Legal')}</h4>

          <ul>
            <li>{t('landing.footer.privacy', 'Privacidad')}</li>
            <li>{t('landing.footer.terms', 'Términos')}</li>
          </ul>
        </div>

        <div>
          <h4>{t('landing.footer.contact', 'Contacto')}</h4>

          <ul>
            <li>LinkedIn</li>
            <li>Instagram</li>
          </ul>
        </div>

      </div>

    </footer>
  );
}