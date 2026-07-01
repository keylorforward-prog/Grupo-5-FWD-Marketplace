import { Award, LogIn } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function HeroSection() {
  return (
    <section className="hero-section adelante-hero">
      <div className="hero-stripes" aria-hidden="true" />

      <div className="hero-content">
        <span className="hero-badge">PLATAFORMA DE EMPLEABILIDAD</span>

        <h1>
          <span className="hero-title-highlight">Adelante.</span>{' '}
          Tu camino hacia el empleo empieza aquí.
        </h1>

        <p className="hero-description">
          La plataforma de empleabilidad para egresados de Fundación Forward Costa Rica.
        </p>

        <div className="hero-buttons">
          <Link to="/login" className="landing-btn landing-btn-primary adelante-login-btn">
            <LogIn size={18} />
            Iniciar sesión
          </Link>
        </div>

        <div className="hero-award">
          <span className="hero-award-icon" aria-hidden="true">
            <Award size={20} />
          </span>
          <span>Premio AMCHAM 2025 — Negocios Sostenibles</span>
        </div>
      </div>

      <div className="hero-visual" aria-hidden="true">
        <img
          src="/Imgs/Comunidad icon-01.png"
          alt=""
          className="hero-floating-img"
        />
      </div>
    </section>
  );
}
