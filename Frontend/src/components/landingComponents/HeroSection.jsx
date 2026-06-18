import { ArrowRight } from 'lucide-react';
import FwdLogo from '../../assets/fwd-logo.png';

export default function HeroSection() {
  return (
    <section className="hero-section">
      <div className="hero-content">

        <span className="hero-badge">
          FORWARD MOMENTUM ECOSYSTEM
        </span>

        <h1>
          Construye el <span className="pink">Futuro</span>
          <br />
          de tu Carrera <span className="cyan">Hoy.</span>
        </h1>

        <p>
          Conectamos el talento emergente más brillante con
          proyectos reales de la industria.
        </p>

        <div className="hero-buttons">
          <button className="landing-btn landing-btn-purple">
            Explorar Proyectos
            <ArrowRight size={16} />
          </button>

          <button className="landing-btn landing-btn-white">
            Para Empresas
          </button>
        </div>

      </div>

      <div className="hero-logo">
        <img
          src={FwdLogo}
          alt="FWD Marketplace Logo"
          className="hero-logo-img"
        />
      </div>
    </section>
  );
}