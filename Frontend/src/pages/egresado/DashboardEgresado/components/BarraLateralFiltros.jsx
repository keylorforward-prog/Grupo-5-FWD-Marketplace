import { SlidersHorizontal } from 'lucide-react';
import {
  categoriasProyecto,
  catalogoTecnologias,
  opcionesDuracion,
} from '../../../../data/proyectosEgresado';

const MODALIDADES = [
  { valor: 'remoto', etiqueta: 'Remoto' },
  { valor: 'hibrido', etiqueta: 'Híbrido' },
  { valor: 'presencial', etiqueta: 'Presencial' },
];

function BarraLateralFiltros({ filtros, onCambio, onLimpiar }) {
  const toggleModalidad = (valor) => {
    const yaActiva = filtros.modalidades.includes(valor);
    onCambio({
      modalidades: yaActiva
        ? filtros.modalidades.filter((m) => m !== valor)
        : [...filtros.modalidades, valor],
    });
  };

  return (
    <aside className="barraLateralFiltros">
      <div className="encabezadoFiltros">
        <h4 className="tituloFiltros">
          <SlidersHorizontal size={18} />
          Filtrar resultados
        </h4>
        <button type="button" className="botonLimpiar" onClick={onLimpiar}>
          Limpiar
        </button>
      </div>

      <div className="grupoFiltro">
        <label className="etiquetaFiltro" htmlFor="filtroCategoria">Categoría</label>
        <select
          id="filtroCategoria"
          className="seleccionadorFiltro"
          value={filtros.categoriaActiva}
          onChange={(e) => onCambio({ categoriaActiva: e.target.value })}
        >
          {categoriasProyecto.map((c) => (
            <option key={c.valor} value={c.valor}>{c.etiqueta}</option>
          ))}
        </select>
      </div>

      <div className="grupoFiltro">
        <label className="etiquetaFiltro" htmlFor="filtroTecnologia">Tecnologías</label>
        <select
          id="filtroTecnologia"
          className="seleccionadorFiltro"
          value={filtros.tecnologia}
          onChange={(e) => onCambio({ tecnologia: e.target.value })}
        >
          <option value="">Todas las tecnologías</option>
          {catalogoTecnologias.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </div>

      <div className="grupoFiltro">
        <label className="etiquetaFiltro">Presupuesto (USD)</label>
        <div className="filaRango">
          <div className="campoRango">
            <span className="prefijoRango">Mín</span>
            <input
              type="number"
              min={0}
              max={filtros.presupuestoMax}
              step={50}
              className="inputRango"
              value={filtros.presupuestoMin}
              onChange={(e) => onCambio({ presupuestoMin: Number(e.target.value) || 0 })}
            />
          </div>
          <div className="campoRango">
            <span className="prefijoRango">Máx</span>
            <input
              type="number"
              min={filtros.presupuestoMin}
              step={50}
              className="inputRango"
              value={filtros.presupuestoMax}
              onChange={(e) => onCambio({ presupuestoMax: Number(e.target.value) || 0 })}
            />
          </div>
        </div>
      </div>

      <div className="grupoFiltro">
        <label className="etiquetaFiltro" htmlFor="filtroDuracion">Duración</label>
        <select
          id="filtroDuracion"
          className="seleccionadorFiltro"
          value={filtros.duracion}
          onChange={(e) => onCambio({ duracion: e.target.value })}
        >
          {opcionesDuracion.map((d) => (
            <option key={d.valor} value={d.valor}>{d.etiqueta}</option>
          ))}
        </select>
      </div>

      <div className="grupoFiltro">
        <label className="etiquetaFiltro">Modalidad</label>
        <div className="opcionesModalidad">
          {MODALIDADES.map(({ valor, etiqueta }) => (
            <label key={valor} className="opcionCheckbox">
              <input
                type="checkbox"
                checked={filtros.modalidades.includes(valor)}
                onChange={() => toggleModalidad(valor)}
              />
              <span className="casillaPersonalizada"></span>
              {etiqueta}
            </label>
          ))}
        </div>
      </div>
    </aside>
  );
}

export default BarraLateralFiltros;
