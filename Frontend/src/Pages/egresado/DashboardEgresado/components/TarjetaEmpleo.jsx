import { useNavigate } from 'react-router-dom';
import { Clock, Globe, Send } from 'lucide-react';

const etiquetaModalidad = { remoto: 'Remoto', hibrido: 'Híbrido', presencial: 'Presencial' };

const etiquetaJornada = {
  tiempo_completo: 'Tiempo completo',
  medio_tiempo:    'Medio tiempo',
  por_horas:       'Por horas',
  practica:        'Práctica profesional',
};

function formatearSalario(min, max) {
  if (min == null && max == null) return 'A convenir';
  const fmt = new Intl.NumberFormat('es-CR', { maximumFractionDigits: 0 });
  if (min != null && max != null) return `₡${fmt.format(min)} – ₡${fmt.format(max)}`;
  if (min != null) return `Desde ₡${fmt.format(min)}`;
  return `Hasta ₡${fmt.format(max)}`;
}

function TarjetaEmpleo({ empleo, onPostular, yaPostulado }) {
  const navigate = useNavigate();

  const irAlDetalle = () => navigate(`/egresado/dashboard/empleo/${empleo.id}`);

  const manejarPostular = (e) => {
    e.stopPropagation();
    if (!yaPostulado && onPostular) onPostular(empleo);
  };

  return (
    <article
      className={`tarjetaEmpleo${yaPostulado ? ' postulado' : ''}`}
      onClick={irAlDetalle}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter') irAlDetalle(); }}
    >
      <div className="te-encabezado">
        <div className="te-empresa-info">
          <div className="te-avatar">{empleo.empresa?.charAt(0) || 'E'}</div>
          <div>
            <p className="te-empresa">{empleo.empresa || 'Empresa'}</p>
            <h3 className="te-titulo">{empleo.titulo}</h3>
          </div>
        </div>
        <div className="te-badges">
          {yaPostulado && <span className="te-badge-postulado">Postulado</span>}
          {empleo.tipo_jornada && (
            <span className={`te-estado te-estado--activo`}>
              {etiquetaJornada[empleo.tipo_jornada] ?? empleo.tipo_jornada}
            </span>
          )}
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
          {empleo.ubicacion
            ? `${etiquetaModalidad[empleo.modalidad] ?? empleo.modalidad} · ${empleo.ubicacion}`
            : (etiquetaModalidad[empleo.modalidad] ?? empleo.modalidad)}
        </div>
        <div className="te-meta-item">
          <Clock size={14} />
          {formatearSalario(empleo.salario_min, empleo.salario_max)}
        </div>
      </div>

      <button
        type="button"
        className={`te-boton${yaPostulado ? ' postulado' : ''}`}
        onClick={manejarPostular}
        disabled={yaPostulado}
      >
        <Send size={14} />
        {yaPostulado ? 'Ya postulaste' : 'Postular'}
      </button>
    </article>
  );
}

export default TarjetaEmpleo;
