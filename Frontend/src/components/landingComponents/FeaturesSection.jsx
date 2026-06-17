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

          <img
            src="/Imgs/team.jpg"
            alt="Equipo"
          />
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