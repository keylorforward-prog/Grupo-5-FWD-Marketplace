import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { ArrowRight, UserPlus, Building2 } from 'lucide-react';

export default function CTASection() {
  const { t } = useTranslation();

  return (
    <section className="cta-section">
      <div className="cta-card">
        {/* Decorative shapes */}
        <div className="cta-shape cta-shape-1" />
        <div className="cta-shape cta-shape-2" />
        <div className="cta-shape cta-shape-3" />

        {/* FWD Logo watermark */}
        <img
          src="/Imgs/Comunidad icon-01.png"
          alt="Imagen descriptiva"
          className="cta-watermark"
          aria-hidden="true"
        />

        <div className="cta-content">
          <span className="cta-badge">
            🇨🇷 La plataforma #1 de Costa Rica
          </span>

          <h2>{t('landing.cta.title', '¿Listo para dar el siguiente paso?')}</h2>

          <p>{t('landing.cta.subtitle', 'Únete a la mayor red de talento tech en Costa Rica. Egresados y empresas que crean el futuro juntos.')}</p>

          <div className="cta-buttons">
            <Link to="/registro" className="landing-btn cta-btn-white">
              <UserPlus size={18} />
              {t('landing.cta.btnRegister', 'Soy egresado')}
              <ArrowRight size={16} />
            </Link>
            <Link to="/empresas/registro" className="landing-btn cta-btn-outline">
              <Building2 size={18} />
              {t('landing.cta.btnCompany', 'Soy empresa')}
            </Link>
          </div>

          {/* Testimonial mini */}
          <div className="cta-testimonial">
            <div className="cta-avatars">
              <div className="cta-avatar" style={{ background: '#008FD4' }}>LG</div>
              <div className="cta-avatar" style={{ background: '#EC008C' }}>MA</div>
              <div className="cta-avatar" style={{ background: '#662D91' }}>CR</div>
              <div className="cta-avatar" style={{ background: '#20BEC6' }}>PV</div>
            </div>
            <p>
              <strong>+500 egresados</strong> ya están construyendo su futuro con FWD
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
