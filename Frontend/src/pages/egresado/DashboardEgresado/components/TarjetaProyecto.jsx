import { useState } from 'react';
import { Bookmark, ArrowUpRight, Clock, DollarSign } from 'lucide-react';

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

  const verDetalle = () => {
    window.alert(`Próximamente: detalle de "${proyecto.titulo}"`);
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
        <button type="button" className="botonDetalle" onClick={verDetalle}>
          Ver detalle
          <ArrowUpRight size={14} />
        </button>
      </div>
    </article>
  );
}

export default TarjetaProyecto;
