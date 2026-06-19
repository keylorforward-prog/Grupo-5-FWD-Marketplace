import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Building2, Clock, DollarSign, Globe, Send, Eye } from 'lucide-react';

const etiquetaModalidad = { remoto: 'egresadoExplorar.components.remoto', hibrido: 'egresadoExplorar.components.hibrido', presencial: 'egresadoExplorar.components.presencial' };

const formatearSalario = (min, max) => {
  const fmt = new Intl.NumberFormat('es-CR', { style: 'currency', currency: 'CRC', maximumFractionDigits: 0 });
  return `${fmt.format(min)} – ${fmt.format(max)}`;
};

function TarjetaEmpleo({ empleo, postulado }) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const irAlDetalle = () => {
    navigate(`/egresado/dashboard/empleo/${empleo.id}`);
  };

  return (
    <article className={`tarjetaEmpleo${postulado ? ' postulado' : ''}`} onClick={irAlDetalle} role="button" tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter') irAlDetalle(); }}
    >
      <div className="te-encabezado">
        <div className="te-empresa-info">
          <div className="te-avatar">
            {empleo.empresa?.charAt(0) || 'E'}
          </div>
          <div>
            <p className="te-empresa">{empleo.empresa || 'Empresa'}</p>
            <h3 className="te-titulo">{empleo.titulo}</h3>
          </div>
        </div>
        <div className="te-badges">
          {postulado && (
            <span className="te-badge-postulado">Postulado</span>
          )}
          <span className={`te-estado te-estado--${empleo.tipoEstado}`}>{empleo.estado}</span>
        </div>
      </div>

      <p className="te-descripcion">{empleo.descripcion}</p>

      <div className="te-techs">
        {empleo.tecnologias?.map((t) => (
          <span key={t} className="etiquetaTecnologia">{t}</span>
        ))}
      </div>

      <div className="te-meta">
        <div className="te-meta-item">
          <Globe size={14} />
          {etiquetaModalidad[empleo.modalidad] ? t(etiquetaModalidad[empleo.modalidad]) : empleo.modalidad}
        </div>
        <div className="te-meta-item">
          <DollarSign size={14} />
          {empleo.presupuestoMin != null ? formatearSalario(empleo.presupuestoMin, empleo.presupuestoMax) : '—'}
        </div>
        <div className="te-meta-item">
          <Clock size={14} />
          {empleo.publicado || '—'}
        </div>
      </div>

      <button type="button" className={`te-boton${postulado ? ' postulado' : ''}`} onClick={(e) => { e.stopPropagation(); irAlDetalle(); }}>
        {postulado ? <Eye size={14} /> : <Send size={14} />}
        {postulado ? t('egresadoPostulaciones.verEmpleo') : t('egresadoPostulaciones.verEmpleo')}
      </button>
    </article>
  );
}

export default TarjetaEmpleo;
