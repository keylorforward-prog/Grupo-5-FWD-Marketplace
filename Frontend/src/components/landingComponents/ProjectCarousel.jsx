import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function ProjectCarousel() {
  const scrollCarousel = (direction) => {
    const container = document.getElementById('project-carousel');

    if (!container) return;

    container.scrollBy({
      left: direction === 'next' ? 480 : -480,
      behavior: 'smooth',
    });
  };

  const projects = [
    {
      title: 'Eco-Smart Home AI',
      category: 'AI & IoT',
      author: 'Juan Pérez',
      initials: 'JP',
      techs: ['Python', 'TensorFlow', 'React', 'AWS'],
    },
    {
      title: 'Nexus FinTech Dashboard',
      category: 'FinTech',
      author: 'Ana García',
      initials: 'AG',
      techs: ['Next.js', 'TypeScript', 'D3.js', 'PostgreSQL'],
    },
    {
      title: 'Quantum Health App',
      category: 'HealthTech',
      author: 'Marcos López',
      initials: 'ML',
      techs: ['Flutter', 'Firebase', 'Node.js'],
    },
  ];

  return (
    <section className="project-carousel-section">

      <div className="project-carousel-header">
        <div>
          <h2>Proyectos Destacados</h2>

          <p>
            Explora las últimas innovaciones de nuestra comunidad.
          </p>
        </div>

        <div className="project-carousel-controls">
          <button onClick={() => scrollCarousel('prev')}>
            <ChevronLeft size={20} />
          </button>

          <button onClick={() => scrollCarousel('next')}>
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      <div
        id="project-carousel"
        className="project-carousel"
      >
        {projects.map((project) => (
          <div
            key={project.title}
            className="project-card"
          >
            <div className="project-image">
              <div className="project-overlay">
                <span>Technologies Used</span>

                <div className="project-techs">
                  {project.techs.map((tech) => (
                    <span key={tech}>{tech}</span>
                  ))}
                </div>
              </div>
            </div>

            <div className="project-content">

              <div className="project-top">
                <h3>{project.title}</h3>

                <span className="project-category">
                  {project.category}
                </span>
              </div>

              <div className="project-author">
                <div className="project-avatar">
                  {project.initials}
                </div>

                <p>{project.author}</p>
              </div>

            </div>
          </div>
        ))}
      </div>

    </section>
  );
}