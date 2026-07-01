import { ArrowRight, Briefcase, Users, Star } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

export default function HeroSection() {
  const { t } = useTranslation();

  return (
    <section className="hero-section">
      {/* Background decorative blobs */}
      <div className="hero-blob hero-blob-1" />
      <div className="hero-blob hero-blob-2" />
      <div className="hero-blob hero-blob-3" />

      {/* Left content */}
      <div className="hero-content">
        <span className="hero-badge">
          <span className="hero-badge-dot" />
          {t('landing.hero.badge', 'FORWARD MOMENTUM ECOSYSTEM')}
        </span>

        <h1>
          {t('landing.hero.title1', 'Conecta tu')}{' '}
          <span className="hero-gradient-text">{t('landing.hero.titleHighlight', 'talento')}</span>
          <br />
          {t('landing.hero.title2', 'con proyectos')}{' '}
          <span className="hero-accent-text">{t('landing.hero.titleAccent', 'reales.')}</span>
        </h1>

        <p className="hero-description">
          {t('landing.hero.description', 'La plataforma de Costa Rica que conecta egresados tech con empresas que necesitan talento validado y proyectos de impacto.')}
        </p>

        <div className="hero-buttons">
          <Link to="/registro" className="landing-btn landing-btn-primary">
            {t('landing.hero.btnExplore', 'Explorar Proyectos')}
            <ArrowRight size={16} />
          </Link>
          <Link to="/empresas" className="landing-btn landing-btn-ghost">
            {t('landing.hero.btnCompanies', 'Para Empresas')}
          </Link>
        </div>

        {/* Social proof badges */}
        <div className="hero-social-proof">
          <div className="proof-badge">
            <Users size={14} />
            <span>500+ egresados</span>
          </div>
          <div className="proof-badge">
            <Briefcase size={14} />
            <span>150+ empresas</span>
          </div>
          <div className="proof-badge">
            <Star size={14} />
            <span>85% empleabilidad</span>
          </div>
        </div>
      </div>

      {/* Right — visual with real image */}
      <div className="hero-visual">
        <div className="hero-img-wrapper">
          <img
            src="/Imgs/Comunidad icon-01.png"
            alt="FWD Community"
            className="hero-main-img"
          />

          {/* Floating cards */}
          <div className="hero-float-card hero-float-card-1">
            <span className="float-card-icon">🚀</span>
            <div>
              <p className="float-card-title">Proyecto activo</p>
              <p className="float-card-sub">E-Commerce App</p>
            </div>
          </div>

          <div className="hero-float-card hero-float-card-2">
            <span className="float-card-icon">✅</span>
            <div>
              <p className="float-card-title">Perfil validado</p>
              <p className="float-card-sub">Full Stack Dev</p>
            </div>
          </div>

          <div className="hero-float-card hero-float-card-3">
            <div className="float-avatars">
              <div className="float-avatar" style={{ background: 'var(--primary)' }}>JR</div>
              <div className="float-avatar" style={{ background: 'var(--magenta)' }}>AM</div>
              <div className="float-avatar" style={{ background: 'var(--secondary)' }}>CP</div>
            </div>
            <span>+97 este mes</span>
          </div>
        </div>
      </div>
    </section>
  );
}