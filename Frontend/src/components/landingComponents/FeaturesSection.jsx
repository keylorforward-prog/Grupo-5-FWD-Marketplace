import { Monitor, Palette, Users, Rocket } from 'lucide-react';

export default function FeaturesSection() {
  return (
    <section className="features-section">

      <div className="section-title">
        <h2>Diseñado para Impulsar</h2>
        <p>
          Nuestro ecosistema está estructurado para potenciar
          tu crecimiento profesional.
        </p>
      </div>

      <div className="features-grid">

        <div className="feature-card feature-large">
          <div>
            <h3>Proyectos de Impacto Real</h3>

            <p>
              Trabaja en desafíos reales propuestos por empresas.
            </p>
          </div>

          <div className="feature-mini-cards">
            <div className="feature-mini-card feature-mini-blue">
              <span className="feature-mini-icon"><Monitor size={24} /></span>
              <p>Full Stack</p>
            </div>
            <div className="feature-mini-card feature-mini-purple">
              <span className="feature-mini-icon"><Palette size={24} /></span>
              <p>UI/UX</p>
            </div>
            <div className="feature-mini-card feature-mini-pink">
              <span className="feature-mini-icon"><Users size={24} /></span>
              <p>Comunidad</p>
            </div>
            <div className="feature-mini-card feature-mini-yellow">
              <span className="feature-mini-icon"><Rocket size={24} /></span>
              <p>Evolución</p>
            </div>
          </div>
        </div>

        <div className="feature-card pink-card">
          <h3>Perfil Validado</h3>
          <p>
            Certificamos tus habilidades.
          </p>
        </div>

        <div className="feature-card purple-card">
          <h3>Tech Ready</h3>
          <p>
            React, Node.js, Python, AWS y más.
          </p>
        </div>

        <div className="feature-card yellow-card">
          <h3>Conexión Corporativa</h3>
          <p>
            Empresas buscando talento validado.
          </p>
        </div>

      </div>
    </section>
  );
}