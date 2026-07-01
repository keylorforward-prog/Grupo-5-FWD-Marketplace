import { Monitor, Palette, Users, Rocket, ShieldCheck, Building2, ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

const features = [
  {
    icon: <Rocket size={28} />,
    title: 'Proyectos de Impacto Real',
    desc: 'Trabaja en desafíos reales propuestos por empresas costarricenses e internacionales. Construye un portafolio que habla por sí solo.',
    color: 'feature-blue',
    tag: 'Egresados',
  },
  {
    icon: <ShieldCheck size={28} />,
    title: 'Perfil Validado',
    desc: 'Certificamos tus habilidades técnicas y blandas. Las empresas confían en perfiles que han pasado por el ecosistema FWD.',
    color: 'feature-magenta',
    tag: 'Credenciales',
  },
  {
    icon: <Building2 size={28} />,
    title: 'Conexión Corporativa',
    desc: 'Más de 150 empresas aliadas buscan activamente talento validado. Tu próxima oportunidad laboral está a un clic.',
    color: 'feature-purple',
    tag: 'Empresas',
  },
  {
    icon: <Users size={28} />,
    title: 'Comunidad Activa',
    desc: 'Forma parte de la red de talento tech más activa de Costa Rica. Mentoría, colaboración y crecimiento profesional constante.',
    color: 'feature-cyan',
    tag: 'Comunidad',
  },
];

export default function FeaturesSection() {
  const { t } = useTranslation();

  return (
    <section className="features-section" id="beneficios">
      <div className="section-label">
        <span>{t('landing.features.label', '¿Por qué FWD?')}</span>
      </div>

      <div className="section-title">
        <h2>
          {t('landing.features.title1', 'Diseñado para')} <span className="text-gradient">{t('landing.features.title2', 'impulsar tu carrera')}</span>
        </h2>
        <p>{t('landing.features.subtitle', 'Un ecosistema completo que conecta talento emergente con oportunidades reales de la industria tech.')}</p>
      </div>

      {/* Main features grid */}
      <div className="features-grid">
        {features.map((f, i) => (
          <div key={i} className={`feature-card ${f.color}`}>
            <div className="feature-card-top">
              <div className="feature-icon-wrap">
                {f.icon}
              </div>
              <span className="feature-tag">{f.tag}</span>
            </div>
            <h3>{f.title}</h3>
            <p>{f.desc}</p>
          </div>
        ))}
      </div>

      {/* How it works strip */}
      <div className="how-it-works" id="como-funciona">
        <div className="hiw-header">
          <h3>{t('landing.hiw.title', 'Cómo funciona')}</h3>
          <p>{t('landing.hiw.sub', 'Tres pasos para transformar tu carrera')}</p>
        </div>
        <div className="hiw-steps">
          <div className="hiw-step">
            <div className="hiw-number">01</div>
            <img src="/Imgs/FLECHAS/Flechas-01.png" alt="" className="hiw-arrow" />
            <h4>{t('landing.hiw.step1', 'Crea tu perfil')}</h4>
            <p>{t('landing.hiw.step1desc', 'Regístrate como egresado o empresa y completa tu perfil profesional.')}</p>
          </div>
          <div className="hiw-connector">
            <img src="/Imgs/FLECHAS/Flechas-03.png" alt="" />
          </div>
          <div className="hiw-step">
            <div className="hiw-number">02</div>
            <img src="/Imgs/FLECHAS/Flechas-05.png" alt="" className="hiw-arrow" />
            <h4>{t('landing.hiw.step2', 'Conecta y aplica')}</h4>
            <p>{t('landing.hiw.step2desc', 'Explora proyectos reales y postúlate a los que encajan con tus habilidades.')}</p>
          </div>
          <div className="hiw-connector">
            <img src="/Imgs/FLECHAS/Flechas-07.png" alt="" />
          </div>
          <div className="hiw-step">
            <div className="hiw-number">03</div>
            <img src="/Imgs/FLECHAS/Flechas-08.png" alt="" className="hiw-arrow" />
            <h4>{t('landing.hiw.step3', 'Crece y valídate')}</h4>
            <p>{t('landing.hiw.step3desc', 'Completa proyectos, obtén certificaciones y construye tu reputación profesional.')}</p>
          </div>
        </div>
        <div className="hiw-cta">
          <Link to="/registro" className="landing-btn landing-btn-primary">
            {t('landing.hiw.cta', 'Comenzar ahora')} <ArrowRight size={16} />
          </Link>
        </div>
      </div>

      {/* Tech pills */}
      <div className="tech-pills-section">
        <p className="tech-pills-label">{t('landing.tech.label', 'Tecnologías en demanda')}</p>
        <div className="tech-pills">
          {['React', 'Node.js', 'Python', 'Flutter', 'TypeScript', 'AWS', 'Next.js', 'PostgreSQL', 'Docker', 'FastAPI', 'Vue.js', 'MongoDB'].map(tech => (
            <span key={tech} className="tech-pill">{tech}</span>
          ))}
        </div>
      </div>
    </section>
  );
}