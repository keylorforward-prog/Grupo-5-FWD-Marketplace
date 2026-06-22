import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Clock, DollarSign, Eye, Globe, Send } from 'lucide-react';

const FLECHAS = Array.from({ length: 8 }, (_, i) => `/Imgs/FLECHAS/Flechas-${String(i + 1).padStart(2, '0')}.png`);

const indiceFlecha = (id) => {
  if (typeof id === 'number') return id % FLECHAS.length;
  return Array.from(String(id ?? '')).reduce((acc, c) => acc + c.charCodeAt(0), 0) % FLECHAS.length;
};

const formatearSalario = (min, max) => {
  if (min == null && max == null) return '—';
  const fmt = (n) => `$${Number(n).toLocaleString('es-AR')}`;
  if (min != null && max != null && min !== max) return `${fmt(min)} - ${fmt(max)}`;
  if (min != null) return `Desde ${fmt(min)}`;
  return `Hasta ${fmt(max)}`;
};

const etiquetaModalidad = { remoto: 'egresadoExplorar.components.remoto', hibrido: 'egresadoExplorar.components.hibrido', presencial: 'egresadoExplorar.components.presencial' };

const etiquetaJornada = {
  tiempo_completo: 'Tiempo completo',
  medio_tiempo:    'Medio tiempo',
  por_horas:       'Por horas',
  practica:        'Práctica profesional',
};

function TarjetaEmpleo({ empleo, yaPostulado }) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const irAlDetalle = () => navigate(`/egresado/dashboard/empleo/${empleo.id}`);

  return (
    <article className={`tarjetaEmpleo${yaPostulado ? ' postulado' : ''}`}>
      <div className="te-encabezado">
        <div className="te-empresa-info">
          <div className="te-avatar">
            {empleo.empresaLogo ? (
              <img src={empleo.empresaLogo} alt="" className="te-avatar-img" />
            ) : (
              <img src={FLECHAS[indiceFlecha(empleo.id)]} alt="" className="te-avatar-img" />
            )}
          </div>
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
          {etiquetaModalidad[empleo.modalidad] ? t(etiquetaModalidad[empleo.modalidad]) : empleo.modalidad}
        </div>
        <div className="te-meta-item">
          <DollarSign size={14} />
          {formatearSalario(empleo.salario_min, empleo.salario_max)}
        </div>
        <div className="te-meta-item">
          <Clock size={14} />
          {empleo.tipo_jornada ? (etiquetaJornada[empleo.tipo_jornada] ?? empleo.tipo_jornada) : '—'}
        </div>
      </div>

      <button type="button" className={`te-boton${yaPostulado ? ' postulado' : ''}`} onClick={irAlDetalle}>
        {yaPostulado ? <Eye size={14} /> : <Send size={14} />}
        {yaPostulado ? t('egresadoPostulaciones.verEmpleo') : t('egresadoExplorar.components.postularme')}
      </button>
    </article>
  );
}

export default TarjetaEmpleo;
