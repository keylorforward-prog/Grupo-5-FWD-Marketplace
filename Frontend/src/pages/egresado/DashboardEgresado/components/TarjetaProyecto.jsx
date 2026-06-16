import { useState } from 'react';
import { Bookmark, Send, Clock, DollarSign, Tag, Globe } from 'lucide-react';
import { categoriasProyecto } from '../../../../data/proyectosEgresado';

const etiquetaModalidad = { remoto: 'Remoto', hibrido: 'Híbrido', presencial: 'Presencial' };
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

function TarjetaProyecto({ proyecto }) {
  const [guardado, setGuardado] = useState(false);
  const [postulado, setPostulado] = useState(false);

  const manejarPostularse = () => {
    setPostulado(true);
    window.alert(`✅ Te has postulado a "${proyecto.titulo}" exitosamente.`);
  };

  return (
    <article className={`tarjetaProyecto acento-${proyecto.colorAcento}`}>
      <div className="encabezadoTarjeta">
        <div className={`iconoProyectoContenedor acento-${proyecto.colorAcento}`}>
          <span className="iconoProyectoLetra">
            {proyecto.titulo.charAt(0)}
          </span>
        </div>
        <div className="tituloTarjetaContenedor">
          <h3 className="tituloProyecto">{proyecto.titulo}</h3>
          <span className={`etiquetaEstado ${proyecto.tipoEstado}`}>
            {proyecto.estado}
          </span>
        </div>
        <button
          type="button"
          className={`botonGuardar ${guardado ? 'activo' : ''}`}
          onClick={() => setGuardado((g) => !g)}
          aria-label={guardado ? 'Quitar de guardados' : 'Guardar proyecto'}
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
          {etiquetaModalidad[proyecto.modalidad] ?? proyecto.modalidad}
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
              Presupuesto
            </span>
            <span className="valorDato">
              {formatearPresupuesto(proyecto.presupuestoMin, proyecto.presupuestoMax)}
            </span>
          </div>
          <div className="datoPie">
            <span className="etiquetaDato">
              <Clock size={12} />
              Entrega
            </span>
            <span className="valorDato">
              {formatearEntrega(proyecto.diasMin, proyecto.diasMax)}
            </span>
          </div>
        </div>
        <button
          type="button"
          className={`botonDetalle ${postulado ? 'postulado' : ''}`}
          onClick={manejarPostularse}
          disabled={postulado}
        >
          <Send size={14} />
          {postulado ? 'Postulado ✓' : 'Postularme'}
        </button>
      </div>
    </article>
  );
}

export default TarjetaProyecto;
