import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Bookmark, Send, Eye, Clock, DollarSign, Tag, Globe } from 'lucide-react';
import { categoriasProyecto } from '../../../../data/proyectosEgresado';

const FLECHAS = Array.from({ length: 8 }, (_, i) => `/Imgs/FLECHAS/Flechas-${String(i + 1).padStart(2, '0')}.png`);

const indiceFlecha = (id) => {
  if (typeof id === 'number') return id % FLECHAS.length;
  return Array.from(String(id ?? '')).reduce((acc, c) => acc + c.charCodeAt(0), 0) % FLECHAS.length;
};

const etiquetaModalidad = { remoto: 'egresadoExplorar.components.remoto', hibrido: 'egresadoExplorar.components.hibrido', presencial: 'egresadoExplorar.components.presencial' };
const etiquetaCategoria = Object.fromEntries(
  categoriasProyecto.filter((c) => c.valor !== 'todas').map((c) => [c.valor, c.etiqueta])
);

const formatoMoneda = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});

const formatearPresupuesto = (min, max) =>
  `${formatoMoneda.format(min)} – ${formatoMoneda.format(max)}`;

const formatearEntrega = (min, max) => `${min} – ${max} días`;

function TarjetaProyecto({ proyecto, postulado }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [guardado, setGuardado] = useState(false);

  const irAlDetalle = () => {
    navigate(`/egresado/dashboard/proyecto/${proyecto.id}`);
  };

  return (
    <article className={`tarjetaProyecto acento-${proyecto.colorAcento}`}>
      <div className="encabezadoTarjeta">
        <div className={`iconoProyectoContenedor acento-${proyecto.colorAcento}`}>
          {proyecto.empresaLogo ? (
            <img src={proyecto.empresaLogo} alt="Imagen descriptiva" className="iconoProyectoLogo" />
          ) : (
            <img src={FLECHAS[indiceFlecha(proyecto.id)]} alt="Imagen descriptiva" className="iconoProyectoLogo" />
          )}
        </div>
        <div className="tituloTarjetaContenedor">
          {proyecto.empresa && <span className="tp-empresa">{proyecto.empresa}</span>}
          <h3 className="tituloProyecto">{proyecto.titulo}</h3>
          <span className={`etiquetaEstado ${proyecto.tipoEstado}`}>
            {proyecto.estado}
          </span>
        </div>
        <button
          type="button"
          className={`botonGuardar ${guardado ? 'activo' : ''}`}
          onClick={() => setGuardado((g) => !g)}
          aria-label={guardado ? t('egresadoExplorar.components.quitarGuardados') : t('egresadoExplorar.components.guardarProyecto')}
        >
          <Bookmark size={18} fill={guardado ? 'currentColor' : 'none'} />
        </button>
      </div>

      <div className="metasProyecto">
        <span className="metaBadge metaCategoria">
          <Tag size={12} />
          {etiquetaCategoria[proyecto.categoria] ?? proyecto.categoria}
        </span>
        <span className="metaBadge metaModalidad">
          <Globe size={12} />
          {etiquetaModalidad[proyecto.modalidad] ? t(etiquetaModalidad[proyecto.modalidad]) : proyecto.modalidad}
        </span>
      </div>

      <p className="descripcionProyecto">{proyecto.descripcion}</p>

      <div className="etiquetasTecnologias">
        {proyecto.tecnologias.map((tech) => (
          <span key={tech} className="etiquetaTecnologia">{tech}</span>
        ))}
      </div>

      <div className="pieTarjeta">
        <div className="infoPie">
          <div className="datoPie">
            <span className="etiquetaDato">
              <DollarSign size={12} />
              {t('egresadoExplorar.components.presupuesto')}
            </span>
            <span className="valorDato">
              {formatearPresupuesto(proyecto.presupuestoMin, proyecto.presupuestoMax)}
            </span>
          </div>
          <div className="datoPie">
            <span className="etiquetaDato">
              <Clock size={12} />
              {t('egresadoExplorar.components.entrega')}
            </span>
            <span className="valorDato">
              {formatearEntrega(proyecto.diasMin, proyecto.diasMax)}
            </span>
          </div>
        </div>
        <button
          type="button"
          className={`botonDetalle${postulado ? ' postulado' : ''}`}
          onClick={irAlDetalle}
        >
          {postulado ? <Eye size={14} /> : <Send size={14} />}
          {postulado ? t('egresadoExplorar.components.verDetalle') : t('egresadoExplorar.components.postularme')}
        </button>
      </div>
    </article>
  );
}

export default TarjetaProyecto;
