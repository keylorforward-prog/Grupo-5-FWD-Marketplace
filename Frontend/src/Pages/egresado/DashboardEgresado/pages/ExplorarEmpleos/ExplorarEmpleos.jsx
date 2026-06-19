import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, Briefcase, X, SlidersHorizontal } from 'lucide-react';
import { egresadoService } from '../../../../../services/egresadoService';
import { egresadoDashboardService } from '../../../../../services/egresadoDashboardService';
import TarjetaEmpleo from '../../components/TarjetaEmpleo';

const ITEMS_POR_PAGINA = 6;
const MODALIDADES = [
  { valor: 'remoto', key: 'egresadoExplorar.components.remoto' },
  { valor: 'hibrido', key: 'egresadoExplorar.components.hibrido' },
  { valor: 'presencial', key: 'egresadoExplorar.components.presencial' },
];

const FILTROS_INICIALES = {
  busqueda: '',
  busquedaReal: '',
  modalidad: '',
  salarioMin: '',
  salarioMax: '',
};

function generarRangoPaginas(actual, total) {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  if (actual <= 4) return [1, 2, 3, 4, 5, '...', total];
  if (actual >= total - 3) return [1, '...', total - 4, total - 3, total - 2, total - 1, total];
  return [1, '...', actual - 1, actual, actual + 1, '...', total];
}

export default function ExplorarEmpleos() {
  const { t } = useTranslation();
  const [busqueda, setBusqueda] = useState('');
  const [busquedaReal, setBusquedaReal] = useState('');
  const [modalidad, setModalidad] = useState('');
  const [salarioMin, setSalarioMin] = useState('');
  const [salarioMax, setSalarioMax] = useState('');
  const [paginaActual, setPaginaActual] = useState(1);
  const [empleos, setEmpleos] = useState([]);
  const [idsPostulados, setIdsPostulados] = useState(null);
  const [cargando, setCargando] = useState(true);
  const debounceRef = useRef(null);

  useEffect(() => {
    let activo = true;
    Promise.all([
      egresadoService.listarPropuestas(),
      egresadoDashboardService.obtenerPostulaciones(),
    ])
      .then(([data, postulaciones]) => {
        if (!activo) return;
        setEmpleos(data);
        const ids = new Set((postulaciones || []).map((p) => p.id_propuesta));
        setIdsPostulados(ids);
      })
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

  const limpiarFiltros = useCallback(() => {
    setBusqueda('');
    setBusquedaReal('');
    setModalidad('');
    setSalarioMin('');
    setSalarioMax('');
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
    if (salarioMin) {
      const min = Number(salarioMin);
      if (min > 0) resultado = resultado.filter((e) => (e.presupuestoMax || 0) >= min);
    }
    if (salarioMax) {
      const max = Number(salarioMax);
      if (max > 0) resultado = resultado.filter((e) => (e.presupuestoMin || 0) <= max);
    }
    return resultado;
  }, [empleos, busquedaReal, modalidad, salarioMin, salarioMax]);

  const totalPaginas = Math.max(1, Math.ceil(filtradas.length / ITEMS_POR_PAGINA));
  const pagina = Math.min(paginaActual, totalPaginas);

  const paginaItems = useMemo(
    () => filtradas.slice((pagina - 1) * ITEMS_POR_PAGINA, pagina * ITEMS_POR_PAGINA),
    [filtradas, pagina]
  );

  const rangoPaginas = generarRangoPaginas(pagina, totalPaginas);
  const hayFiltros = busquedaReal.trim() || modalidad || salarioMin || salarioMax;

  return (
    <div className="contenidoPrincipal">
      <section className="seccionHero fwd-animar-entrada">
        <div className="textoHero">
          <span className="kickerHero">{t('egresadoExplorarEmpleos.hero.kicker')}</span>
          <h1 className="tituloHero">
            {t('egresadoExplorarEmpleos.hero.titleStart')} <span className="textoResaltado">{t('egresadoExplorarEmpleos.hero.titleHighlight')}</span>
          </h1>
          <p className="subtituloHero">
            {t('egresadoExplorarEmpleos.hero.subtitle')}
          </p>
          <div className="contenedorBusqueda">
            <div className="barraBusqueda">
              <Search size={18} className="iconoBusqueda" />
              <input
                type="text"
                className="inputBusqueda"
                placeholder={t('egresadoExplorarEmpleos.hero.searchPlaceholder')}
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

      <div className="seccionListado fwd-animar-entrada" style={{ animationDelay: '0.3s' }}>
        <aside className="barraLateralFiltros">
          <div className="encabezadoFiltros">
            <h4 className="tituloFiltros">
              <SlidersHorizontal size={18} />
              {t('egresadoExplorarEmpleos.filters.titulo')}
            </h4>
            <button type="button" className="botonLimpiar" onClick={limpiarFiltros}>
              {t('egresadoExplorarEmpleos.filters.limpiar')}
            </button>
          </div>

          <div className="grupoFiltro">
            <label className="etiquetaFiltro">{t('egresadoExplorarEmpleos.filters.modalidad')}</label>
            <div className="opcionesModalidad">
              {MODALIDADES.map(({ valor, key }) => (
                <label key={valor} className="opcionCheckbox">
                  <input
                    type="checkbox"
                    checked={modalidad === valor}
                    onChange={() => cambiarModalidad(modalidad === valor ? '' : valor)}
                  />
                  <span className="casillaPersonalizada" />
                  {t(key)}
                </label>
              ))}
            </div>
          </div>

          <div className="grupoFiltro">
            <label className="etiquetaFiltro">{t('egresadoExplorarEmpleos.filters.salario')}</label>
            <div className="filaRango">
              <div className="campoRango">
                <span className="prefijoRango">{t('egresadoExplorarEmpleos.filters.min')}</span>
                <input
                  type="number"
                  min={0}
                  className="inputRango"
                  placeholder="0"
                  value={salarioMin}
                  onChange={(e) => { setSalarioMin(e.target.value); setPaginaActual(1); }}
                />
              </div>
              <div className="campoRango">
                <span className="prefijoRango">{t('egresadoExplorarEmpleos.filters.max')}</span>
                <input
                  type="number"
                  min={0}
                  className="inputRango"
                  placeholder="∞"
                  value={salarioMax}
                  onChange={(e) => { setSalarioMax(e.target.value); setPaginaActual(1); }}
                />
              </div>
            </div>
          </div>
        </aside>

        <div className="columnaResultadosEgresado">
          {cargando ? (
            <p className="de-data-state">{t('egresadoExplorarEmpleos.loading')}</p>
          ) : paginaItems.length === 0 ? (
            <div className="estadoVacio">
              <Briefcase size={48} />
              <h4>{hayFiltros ? t('egresadoExplorarEmpleos.sinResultados') : t('egresadoExplorarEmpleos.sinResultadosTitle')}</h4>
              <p>
                {hayFiltros
                  ? t('egresadoExplorarEmpleos.sinResultadosDesc')
                  : t('egresadoExplorarEmpleos.sinResultadosDesc')}
              </p>
              {hayFiltros && (
                <button type="button" className="post-emptyBtn" onClick={limpiarFiltros}>
                  {t('egresadoExplorarEmpleos.limpiarFiltros')}
                </button>
              )}
            </div>
          ) : (
            <div className="contenedorResultados">
              <div className="encabezadoResultados">
                <span className="conteoProyectos">
                  {filtradas.length} {t('egresadoExplorarEmpleos.resultados')}
                </span>
                {hayFiltros && (
                  <button type="button" className="btnLimpiarFiltros" onClick={limpiarFiltros}>
                    <X size={14} />
                    {t('egresadoExplorarEmpleos.limpiarFiltros')}
                  </button>
                )}
              </div>
              <div className="cuadriculaProyectos">
                {paginaItems.map((e) => (
                  <TarjetaEmpleo key={e.id} empleo={e} postulado={idsPostulados?.has(e.id)} />
                ))}
              </div>

              {totalPaginas > 1 && (
                <div className="paginacionResultados">
                  <button
                    type="button"
                    className="botonPagina flecha"
                    disabled={pagina === 1}
                    onClick={() => setPaginaActual(pagina - 1)}
                    aria-label={t('egresadoExplorarEmpleos.paginaAnterior')}
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
                    aria-label={t('egresadoExplorarEmpleos.paginaSiguiente')}
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
