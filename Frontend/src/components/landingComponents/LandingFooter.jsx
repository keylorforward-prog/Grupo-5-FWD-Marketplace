import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { ArrowUpRight, BriefcaseBusiness, Camera, Mail, MapPin, Sparkles } from 'lucide-react';

export default function LandingFooter() {
  const { t } = useTranslation();

  return (
    <footer className="landing-footer">
      <div className="footer-brand-band" aria-hidden="true">
        <span />
        <span />
        <span />
        <span />
      </div>

      <div className="footer-top">
        {/* Brand column */}
        <div className="footer-brand">
          <Link to="/" className="footer-logo-link" aria-label="FWD Marketplace">
            <img
              src="/Imgs/Logotipo/Digital/FWD - Logotipo - Slogan.svg"
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
          <div className="footer-location">
            <MapPin size={16} />
            {t('landing.footer.location', 'San José, Costa Rica · impacto regional')}
          </div>
          <div className="footer-socials">
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" aria-label="LinkedIn">
              <BriefcaseBusiness size={18} />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram">
              <Camera size={18} />
            </a>
            <a href="mailto:hola@fwdmarketplace.cr" aria-label="Email">
              <Mail size={18} />
            </a>
          </div>
        </div>

        <div className="footer-col footer-identity">
          <h4>{t('landing.footer.identity', 'Identidad FWD')}</h4>
          <ul>
            <li><span>{t('landing.footer.identityOne', 'Talento que avanza')}</span></li>
            <li><span>{t('landing.footer.identityTwo', 'Proyectos con validación real')}</span></li>
            <li><span>{t('landing.footer.identityThree', 'Comunidad tecnológica inclusiva')}</span></li>
            <li><span>{t('landing.footer.identityFour', 'Aprendizaje conectado al mercado')}</span></li>
          </ul>
        </div>

        {/* Links */}
        <div className="footer-col">
          <h4>{t('landing.footer.platform', 'Plataforma')}</h4>
          <ul>
            <li><Link to="/proyectos">{t('landing.projects', 'Proyectos')}</Link></li>
            <li><Link to="/empresas">{t('landing.empresas', 'Empresas')}</Link></li>
            <li><Link to="/juniors">{t('landing.juniors', 'Juniors')}</Link></li>
            <li><Link to="/comunidad">{t('landing.footer.community', 'Comunidad')}</Link></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>{t('landing.footer.company', 'Fundación')}</h4>
          <ul>
            <li><Link to="/nosotros">{t('landing.footer.about', 'Sobre FWD')}</Link></li>
            <li><Link to="/blog">{t('landing.footer.blog', 'Blog')}</Link></li>
            <li><Link to="/soporte">{t('landing.footer.support', 'Soporte')}</Link></li>
            <li>
              <a href="mailto:hola@fwdmarketplace.cr">
                {t('landing.footer.contact', 'Contacto')} <ArrowUpRight size={14} />
              </a>
            </li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>{t('landing.footer.legal', 'Legal')}</h4>
          <ul>
            <li><Link to="/privacidad">{t('landing.footer.privacy', 'Privacidad')}</Link></li>
            <li><Link to="/terminos">{t('landing.footer.terms', 'Términos')}</Link></li>
            <li><Link to="/cookies">{t('landing.footer.cookies', 'Cookies')}</Link></li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>
          © {new Date().getFullYear()} <strong>{t('landing.footer.rights', 'Fundación Forward Costa Rica.')}</strong> {t('landing.footer.reserved', 'Todos los derechos reservados.')}
        </p>
        <div className="footer-bottom-badges">
          <span className="footer-badge footer-badge-cr">{t('landing.footer.madeIn', 'Hecho en Costa Rica')}</span>
          <span className="footer-badge footer-badge-tech">{t('landing.footer.techForGood', 'Tech for Good')}</span>
        </div>
      </div>
    </footer>
  );
}
