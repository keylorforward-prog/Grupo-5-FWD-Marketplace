import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import ecoImg from '../../assets/eco_smart_preview.png';
import nexusImg from '../../assets/nexus_fintech_preview.png';
import quantumImg from '../../assets/quantum_health_preview.png';

export default function ProjectCarousel() {
  const { t } = useTranslation();

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
      image: ecoImg,
    },
    {
      title: 'Nexus FinTech Dashboard',
      category: 'FinTech',
      author: 'Ana García',
      initials: 'AG',
      techs: ['Next.js', 'TypeScript', 'D3.js', 'PostgreSQL'],
      image: nexusImg,
    },
    {
      title: 'Quantum Health App',
      category: 'HealthTech',
      author: 'Marcos López',
      initials: 'ML',
      techs: ['Flutter', 'Firebase', 'Node.js'],
      image: quantumImg,
    },
  ];

  return (
    <section className="project-carousel-section">

      <div className="project-carousel-header">
        <div>
          <h2>{t('landing.carousel.title', 'Proyectos Destacados')}</h2>

          <p>
            {t('landing.carousel.subtitle', 'Explora las últimas innovaciones de nuestra comunidad.')}
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
            <div className="project-image" style={{ overflow: 'hidden' }}>
              <img src={project.image} alt={project.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <div className="project-overlay">
                <span>{t('landing.carousel.techsUsed', 'Technologies Used')}</span>

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