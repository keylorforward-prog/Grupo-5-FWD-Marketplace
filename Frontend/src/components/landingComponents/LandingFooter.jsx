import { useTranslation } from 'react-i18next';

export default function LandingFooter() {
  const { t } = useTranslation();

  return (
    <footer className="landing-footer">

      <div className="footer-grid">

        <div>
          <h3>FWD.</h3>

          <p>
            {t('landing.footer.rights', 'Fundación Forward Costa Rica.')}
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