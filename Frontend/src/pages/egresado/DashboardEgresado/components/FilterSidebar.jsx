import React from 'react';
import { SlidersHorizontal } from 'lucide-react';

function FilterSidebar() {
  return (
    <aside className="barraLateralFiltros">
      <div className="encabezadoFiltros">
        <h4 className="tituloFiltros">
          <SlidersHorizontal size={18} />
          Filtrar resultados
        </h4>
        <button className="botonLimpiar">Limpiar</button>
      </div>

      <div className="grupoFiltro">
        <label className="etiquetaFiltro">Categoría</label>
        <select className="seleccionadorFiltro">
          <option>Todas las categorías</option>
        </select>
      </div>

      <div className="grupoFiltro">
        <label className="etiquetaFiltro">Tecnologías</label>
        <select className="seleccionadorFiltro">
          <option>Todas las tecnologías</option>
        </select>
      </div>

      <div className="grupoFiltro">
        <label className="etiquetaFiltro">Presupuesto (USD)</label>
        <div className="contenedorRango">
          <div className="barraRango">
             <div className="rangoActivo"></div>
             <div className="controladorRango izquierdo"></div>
             <div className="controladorRango derecho"></div>
          </div>
          <div className="valoresRango">
            <span className="cajaValor">$300</span>
            <span className="cajaValor">$5,000+</span>
          </div>
        </div>
      </div>

      <div className="grupoFiltro">
        <label className="etiquetaFiltro">Duración</label>
        <select className="seleccionadorFiltro">
          <option>Cualquier duración</option>
        </select>
      </div>

      <div className="grupoFiltro">
        <label className="etiquetaFiltro">Modalidad</label>
        <div className="opcionesModalidad">
          <label className="opcionCheckbox">
            <input type="checkbox" defaultChecked />
            <span className="casillaPersonalizada"></span>
            Remoto
          </label>
          <label className="opcionCheckbox">
            <input type="checkbox" />
            <span className="casillaPersonalizada"></span>
            Híbrido
          </label>
          <label className="opcionCheckbox">
            <input type="checkbox" />
            <span className="casillaPersonalizada"></span>
            Presencial
          </label>
        </div>
      </div>
    </aside>
  );
}

export default FilterSidebar;
