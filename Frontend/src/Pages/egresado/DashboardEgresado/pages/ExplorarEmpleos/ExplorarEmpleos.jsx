import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Search, Briefcase, X } from 'lucide-react';
import { egresadoService } from '../../../../../services/egresadoService';
import TarjetaEmpleo from '../../components/TarjetaEmpleo';

const ITEMS_POR_PAGINA = 6;
const MODALIDADES = [
  { key: '', label: 'Todas' },
  { key: 'remoto', label: 'Remoto' },
  { key: 'hibrido', label: 'Híbrido' },
  { key: 'presencial', label: 'Presencial' },
];

function generarRangoPaginas(actual, total) {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  if (actual <= 4) return [1, 2, 3, 4, 5, '...', total];
  if (actual >= total - 3) return [1, '...', total - 4, total - 3, total - 2, total - 1, total];
  return [1, '...', actual - 1, actual, actual + 1, '...', total];
}

export default function ExplorarEmpleos() {
  const [busqueda, setBusqueda] = useState('');
  const [busquedaReal, setBusquedaReal] = useState('');
  const [modalidad, setModalidad] = useState('');
  const [paginaActual, setPaginaActual] = useState(1);
  const [empleos, setEmpleos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const debounceRef = useRef(null);

  useEffect(() => {
    let activo = true;
    egresadoService.listarPropuestas()
      .then((data) => { if (activo) setEmpleos(data); })
      .catch(() => { if (activo) setEmpleos([]); })
      .finally(() => { if (activo) setCargando(false); });
    return () => { activo = false; };
  }, []);

  const manejarBusqueda = useCallback((valor) => {
    setBusqueda(valor);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setBusquedaReal(valor);
      setPaginaActual(1);
    }, 300);
  }, []);

  const limpiarBusqueda = useCallback(() => {
    setBusqueda('');
    setBusquedaReal('');
    setPaginaActual(1);
  }, []);

  const cambiarModalidad = useCallback((m) => {
    setModalidad(m);
    setPaginaActual(1);
  }, []);

  const filtradas = useMemo(() => {
    let resultado = empleos;
    const q = busquedaReal.trim().toLowerCase();
    if (q) {
      resultado = resultado.filter(
        (e) =>
          e.titulo?.toLowerCase().includes(q) ||
          e.descripcion?.toLowerCase().includes(q) ||
          e.empresa?.toLowerCase().includes(q) ||
          e.tecnologias?.some((t) => t.toLowerCase().includes(q))
      );
    }
    if (modalidad) {
      resultado = resultado.filter((e) => e.modalidad === modalidad);
    }
    return resultado;
  }, [empleos, busquedaReal, modalidad]);

  const totalPaginas = Math.max(1, Math.ceil(filtradas.length / ITEMS_POR_PAGINA));
  const pagina = Math.min(paginaActual, totalPaginas);

  const paginaItems = useMemo(
    () => filtradas.slice((pagina - 1) * ITEMS_POR_PAGINA, pagina * ITEMS_POR_PAGINA),
    [filtradas, pagina]
  );

  const rangoPaginas = generarRangoPaginas(pagina, totalPaginas);
  const hayFiltros = busquedaReal.trim() || modalidad;

  return (
    <div className="contenidoPrincipal">
      <section className="seccionHero fwd-animar-entrada">
        <div className="textoHero">
          <span className="kickerHero">Explorar Empleos</span>
          <h1 className="tituloHero">
            Encuentra tu <span className="textoResaltado">próximo empleo</span>
          </h1>
          <p className="subtituloHero">
            Oportunidades laborales para impulsar tu carrera profesional. Conecta con empresas que buscan talento como el tuyo.
          </p>
          <div className="contenedorBusqueda">
            <div className="barraBusqueda">
              <Search size={18} className="iconoBusqueda" />
              <input
                type="text"
                className="inputBusqueda"
                placeholder="Buscar empleos por título, empresa, tecnología..."
                value={busqueda}
                onChange={(e) => manejarBusqueda(e.target.value)}
              />
              {busqueda && (
                <button type="button" className="btnLimpiarBusqueda" onClick={limpiarBusqueda} aria-label="Limpiar búsqueda">
                  <X size={16} />
                </button>
              )}
            </div>
          </div>
        </div>
        <div className="ilustracionHero">
          <div className="orbeHero" />
          <img
            src="/Imgs/Comunidad icon-01.png"
            alt="Comunidad FWD"
            className="ilustracionComunidad"
            width="260"
            height="260"
            decoding="async"
          />
        </div>
      </section>

      <div className="filtrosModalidad fwd-animar-entrada" style={{ animationDelay: '0.15s' }}>
        {MODALIDADES.map((m) => (
          <button
            key={m.key}
            type="button"
            className={`chipModalidad${modalidad === m.key ? ' activo' : ''}`}
            onClick={() => cambiarModalidad(m.key)}
          >
            {m.label}
          </button>
        ))}
      </div>

      <div className="seccionListado fwd-animar-entrada" style={{ animationDelay: '0.3s' }}>
        <div className="columnaResultadosEgresado">
          {cargando ? (
            <p className="de-data-state">Cargando oportunidades...</p>
          ) : paginaItems.length === 0 ? (
            <div className="estadoVacio">
              <Briefcase size={48} />
              <h4>{hayFiltros ? 'Sin resultados' : 'No encontramos empleos'}</h4>
              <p>
                {hayFiltros
                  ? 'Intenta con otros términos de búsqueda o quita los filtros.'
                  : 'Prueba ajustar la búsqueda o vuelve más tarde.'}
              </p>
              {hayFiltros && (
                <button type="button" className="post-emptyBtn" onClick={() => { limpiarBusqueda(); setModalidad(''); }}>
                  Limpiar filtros
                </button>
              )}
            </div>
          ) : (
            <div className="contenedorResultados">
              <div className="encabezadoResultados">
                <span className="conteoProyectos">
                  {filtradas.length} {filtradas.length === 1 ? 'oportunidad' : 'oportunidades'}
                  {hayFiltros && ' encontradas'}
                </span>
                {hayFiltros && (
                  <button type="button" className="btnLimpiarFiltros" onClick={() => { limpiarBusqueda(); setModalidad(''); }}>
                    <X size={14} />
                    Limpiar filtros
                  </button>
                )}
              </div>
              <div className="cuadriculaProyectos">
                {paginaItems.map((e) => (
                  <TarjetaEmpleo key={e.id} empleo={e} />
                ))}
              </div>

              {totalPaginas > 1 && (
                <div className="paginacionResultados">
                  <button
                    type="button"
                    className="botonPagina flecha"
                    disabled={pagina === 1}
                    onClick={() => setPaginaActual(pagina - 1)}
                    aria-label="Página anterior"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6" /></svg>
                  </button>

                  {rangoPaginas.map((p, i) =>
                    p === '...' ? (
                      <span key={`puntos-${i}`} className="puntosPaginacion">…</span>
                    ) : (
                      <button
                        key={p}
                        type="button"
                        className={`botonPagina ${p === pagina ? 'activa' : ''}`}
                        onClick={() => setPaginaActual(p)}
                      >
                        {p}
                      </button>
                    )
                  )}

                  <button
                    type="button"
                    className="botonPagina flecha"
                    disabled={pagina === totalPaginas}
                    onClick={() => setPaginaActual(pagina + 1)}
                    aria-label="Página siguiente"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6" /></svg>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
