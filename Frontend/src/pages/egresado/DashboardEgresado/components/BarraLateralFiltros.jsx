import { useTranslation } from 'react-i18next';
import { SlidersHorizontal } from 'lucide-react';
import {
  categoriasProyecto,
  catalogoTecnologias,
  opcionesDuracion,
} from '../../../../data/proyectosEgresado';

const MODALIDADES = [
  { valor: 'remoto', key: 'egresadoExplorar.components.remoto' },
  { valor: 'hibrido', key: 'egresadoExplorar.components.hibrido' },
  { valor: 'presencial', key: 'egresadoExplorar.components.presencial' },
];

function BarraLateralFiltros({ filtros, onCambio, onLimpiar }) {
  const { t } = useTranslation();
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
          {t('egresadoExplorar.filters.titulo')}
        </h4>
        <button type="button" className="botonLimpiar" onClick={onLimpiar}>
          {t('egresadoExplorar.filters.limpiar')}
        </button>
      </div>

      <div className="grupoFiltro">
        <label className="etiquetaFiltro" htmlFor="filtroCategoria">{t('egresadoExplorar.filters.categoria')}</label>
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
        <label className="etiquetaFiltro" htmlFor="filtroTecnologia">{t('egresadoExplorar.filters.tecnologias')}</label>
        <select
          id="filtroTecnologia"
          className="seleccionadorFiltro"
          value={filtros.tecnologia}
          onChange={(e) => onCambio({ tecnologia: e.target.value })}
        >
          <option value="">{t('egresadoExplorar.filters.todasTecnologias')}</option>
          {catalogoTecnologias.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </div>

      <div className="grupoFiltro">
        <label className="etiquetaFiltro">{t('egresadoExplorar.filters.presupuesto')}</label>
        <div className="filaRango">
          <div className="campoRango">
            <span className="prefijoRango">{t('egresadoExplorar.filters.min')}</span>
            <input
              type="number"
              min={0}
              max={filtros.presupuestoMax || 99999}
              step={50}
              className="inputRango"
              value={filtros.presupuestoMin}
              onChange={(e) => onCambio({ presupuestoMin: e.target.value })}
            />
          </div>
          <div className="campoRango">
            <span className="prefijoRango">{t('egresadoExplorar.filters.max')}</span>
            <input
              type="number"
              min={filtros.presupuestoMin || 0}
              max={99999}
              step={50}
              className="inputRango"
              value={filtros.presupuestoMax}
              onChange={(e) => onCambio({ presupuestoMax: e.target.value })}
            />
          </div>
        </div>
      </div>

      <div className="grupoFiltro">
        <label className="etiquetaFiltro" htmlFor="filtroDuracion">{t('egresadoExplorar.filters.duracion')}</label>
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
        <label className="etiquetaFiltro">{t('egresadoExplorar.filters.modalidad')}</label>
        <div className="opcionesModalidad">
          {MODALIDADES.map(({ valor, key }) => (
            <label key={valor} className="opcionCheckbox">
              <input
                type="checkbox"
                checked={filtros.modalidades.includes(valor)}
                onChange={() => toggleModalidad(valor)}
              />
              <span className="casillaPersonalizada"></span>
              {t(key)}
            </label>
          ))}
        </div>
      </div>
    </aside>
  );
}

export default BarraLateralFiltros;
