import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';

const projects = [
  {
    title: 'Eco-Smart Home AI',
    category: 'AI & IoT',
    author: 'Juan Pérez',
    initials: 'JP',
    avatarColor: '#008FD4',
    techs: ['Python', 'TensorFlow', 'React', 'AWS'],
    rating: 4.9,
    img: '/Imgs/FLECHAS/Flechas-01.png',
    accent: 'card-accent-blue',
  },
  {
    title: 'Nexus FinTech Dashboard',
    category: 'FinTech',
    author: 'Ana García',
    initials: 'AG',
    avatarColor: '#EC008C',
    techs: ['Next.js', 'TypeScript', 'D3.js', 'PostgreSQL'],
    rating: 4.8,
    img: '/Imgs/FLECHAS/Flechas-03.png',
    accent: 'card-accent-magenta',
  },
  {
    title: 'Quantum Health App',
    category: 'HealthTech',
    author: 'Marcos López',
    initials: 'ML',
    avatarColor: '#662D91',
    techs: ['Flutter', 'Firebase', 'Node.js'],
    rating: 4.7,
    img: '/Imgs/FLECHAS/Flechas-05.png',
    accent: 'card-accent-purple',
  },
  {
    title: 'EduConnect CR',
    category: 'EdTech',
    author: 'Carolina Vega',
    initials: 'CV',
    avatarColor: '#20BEC6',
    techs: ['Vue.js', 'Django', 'PostgreSQL'],
    rating: 4.9,
    img: '/Imgs/FLECHAS/Flechas-07.png',
    accent: 'card-accent-cyan',
  },
];

export default function ProjectCarousel() {
  const { t } = useTranslation();

  const scrollCarousel = (direction) => {
    const container = document.getElementById('project-carousel');
    if (!container) return;
    container.scrollBy({ left: direction === 'next' ? 500 : -500, behavior: 'smooth' });
  };

  return (
    <section className="project-carousel-section">
      <div className="project-carousel-header">
        <div className="carousel-header-left">
          <span className="section-kicker">{t('landing.carousel.kicker', 'Proyectos')}</span>
          <h2>{t('landing.carousel.title', 'Proyectos Destacados')}</h2>
          <p>{t('landing.carousel.subtitle', 'Explora las últimas innovaciones de nuestra comunidad tech.')}</p>
        </div>

        <div className="project-carousel-controls">
          <button
            onClick={() => scrollCarousel('prev')}
            aria-label="Anterior"
            className="carousel-btn"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={() => scrollCarousel('next')}
            aria-label="Siguiente"
            className="carousel-btn"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      <div id="project-carousel" className="project-carousel">
        {projects.map((project) => (
          <div key={project.title} className={`project-card ${project.accent}`}>
            {/* Image area with gradient overlay */}
            <div className="project-image">
              <div className="project-image-gradient" />
              <span className="project-category-badge">{project.category}</span>
              <div className="project-overlay">
                <span className="overlay-label">{t('landing.carousel.techsUsed', 'Tecnologías')}</span>
                <div className="project-techs">
                  {project.techs.map((tech) => (
                    <span key={tech} className="tech-tag">{tech}</span>
                  ))}
                </div>
              </div>
            </div>

            <div className="project-content">
              <div className="project-top">
                <h3>{project.title}</h3>
                <div className="project-rating">
                  <Star size={13} fill="currentColor" />
                  <span>{project.rating}</span>
                </div>
              </div>

              <div className="project-author">
                <div
                  className="project-avatar"
                  style={{ background: project.avatarColor }}
                >
                  {project.initials}
                </div>
                <div>
                  <p className="author-name">{project.author}</p>
                  <p className="author-role">Egresado FWD</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="carousel-footer">
        <Link to="/proyectos" className="landing-btn landing-btn-ghost-dark">
          {t('landing.carousel.viewAll', 'Ver todos los proyectos')}
          <ChevronRight size={16} />
        </Link>
      </div>
    </section>
  );
}