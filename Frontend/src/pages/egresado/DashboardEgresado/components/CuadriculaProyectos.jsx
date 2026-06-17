import { ChevronLeft, ChevronRight, SearchX } from 'lucide-react';
import TarjetaProyecto from './TarjetaProyecto';

function generarRangoPaginas(actual, total) {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  if (actual <= 4) return [1, 2, 3, 4, 5, '...', total];
  if (actual >= total - 3) return [1, '...', total - 4, total - 3, total - 2, total - 1, total];
  return [1, '...', actual - 1, actual, actual + 1, '...', total];
}

function CuadriculaProyectos({
  proyectos,
  total,
  orden,
  onOrdenCambio,
  opcionesOrden,
  paginaActual,
  totalPaginas,
  onPaginaCambio,
  idsPostulados,
}) {
  const rangoPaginas = generarRangoPaginas(paginaActual, totalPaginas);

  return (
    <div className="contenedorResultados">
      <div className="encabezadoResultados">
        <span className="conteoProyectos">
          {total} {total === 1 ? 'proyecto encontrado' : 'proyectos encontrados'}
        </span>
        <div className="ordenarResultados">
          <label htmlFor="ordenSelect" className="etiquetaOrdenar">Ordenar por:</label>
          <select
            id="ordenSelect"
            className="seleccionadorOrdenar"
            value={orden}
            onChange={(e) => onOrdenCambio(e.target.value)}
          >
            {opcionesOrden.map((o) => (
              <option key={o.valor} value={o.valor}>{o.etiqueta}</option>
            ))}
          </select>
        </div>
      </div>

      {proyectos.length === 0 ? (
        <div className="estadoVacio">
          <SearchX size={48} />
          <h4>No encontramos proyectos</h4>
          <p>Prueba ajustar los filtros o limpiar la búsqueda.</p>
        </div>
      ) : (
        <div className="cuadriculaProyectos">
          {proyectos.map((proyecto) => (
            <TarjetaProyecto key={proyecto.id} proyecto={proyecto} postulado={idsPostulados?.has(proyecto.id)} />
          ))}
        </div>
      )}

      {totalPaginas > 1 && (
        <div className="paginacionResultados">
          <button
            type="button"
            className="botonPagina flecha"
            disabled={paginaActual === 1}
            onClick={() => onPaginaCambio(paginaActual - 1)}
            aria-label="Página anterior"
          >
            <ChevronLeft size={16} />
          </button>

          {rangoPaginas.map((p, i) =>
            p === '...' ? (
              <span key={`puntos-${i}`} className="puntosPaginacion">…</span>
            ) : (
              <button
                key={p}
                type="button"
                className={`botonPagina ${p === paginaActual ? 'activa' : ''}`}
                onClick={() => onPaginaCambio(p)}
              >
                {p}
              </button>
            )
          )}

          <button
            type="button"
            className="botonPagina flecha"
            disabled={paginaActual === totalPaginas}
            onClick={() => onPaginaCambio(paginaActual + 1)}
            aria-label="Página siguiente"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
}

export default CuadriculaProyectos;
