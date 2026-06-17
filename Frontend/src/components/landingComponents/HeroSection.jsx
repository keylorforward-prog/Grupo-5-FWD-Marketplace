import { ArrowRight } from 'lucide-react';

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

      <div className="hero-cards">

        <div className="hero-card hero-card-blue">
          <h3>Desarrollo</h3>
          <p>Proyectos Full Stack, Mobile e IA.</p>
        </div>

        <div className="hero-card hero-card-purple">
          <h3>UI/UX Design</h3>
        </div>

        <div className="hero-card hero-card-lavender">
          <h3>Comunidad</h3>
        </div>

        <div className="hero-card hero-card-yellow">
          <h3>Evolución</h3>
          <p>Certificaciones validadas.</p>
        </div>

      </div>
    </section>
  );
}