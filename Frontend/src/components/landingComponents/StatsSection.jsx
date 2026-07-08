import { useTranslation } from 'react-i18next';
import { TrendingUp, Award, Briefcase, DollarSign } from 'lucide-react';

const stats = [
  { icon: <Briefcase size={24} />, value: '150+', label: 'Empresas aliadas', color: 'stat-blue' },
  { icon: <TrendingUp size={24} />,  value: '85%',  label: 'Tasa de empleabilidad', color: 'stat-magenta' },
  { icon: <Award size={24} />,       value: '500+', label: 'Proyectos ejecutados', color: 'stat-purple' },
  { icon: <DollarSign size={24} />,  value: '$2M+', label: 'Talento movilizado', color: 'stat-cyan' },
];

export default function StatsSection() {
  const { t } = useTranslation();

  return (
    <section className="stats-section">
      <div className="stats-bg-pattern" />
      <div className="stats-inner">
        {stats.map((s, i) => (
          <div key={i} className={`stat-item ${s.color}`}>
            <div className="stat-icon">{s.icon}</div>
            <h3>{s.value}</h3>
            <span>{t(`landing.stats.${i}`, s.label)}</span>
          </div>
        ))}
      </div>

      {/* Logos strip */}
      <div className="partners-strip">
        <p className="partners-label">{t('landing.partners', 'Con la confianza de empresas líderes')}</p>
        <div className="partners-logos">
          <img src="/Imgs/Logotipo/Digital/FWD - Logotipo-01.jpg" alt="FWD" className="partner-logo" />
          <img src="/Imgs/Logotipo/Digital/FWD - Logotipo-01.jpg" alt="FWD" className="partner-logo partner-logo-wide" />
        </div>
      </div>
    </section>
  );
}
