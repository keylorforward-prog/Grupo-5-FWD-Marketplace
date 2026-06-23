import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Briefcase, Search, SlidersHorizontal, X } from 'lucide-react';
import { egresadoService } from '../../../../../services/egresadoService';
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

const OPCIONES_ORDEN = [
  { valor: 'recientes', key: 'egresadoExplorarEmpleos.ordenRecientes' },
  { valor: 'salarioDesc', key: 'egresadoExplorarEmpleos.ordenSalarioDesc' },
  { valor: 'salarioAsc', key: 'egresadoExplorarEmpleos.ordenSalarioAsc' },
];

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
  const [tecnologia, setTecnologia] = useState('');
  const [orden, setOrden] = useState('recientes');
  const [paginaActual, setPaginaActual] = useState(1);
  const [empleos, setEmpleos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const debounceRef = useRef(null);

  const cambiarModalidad = useCallback((m) => {
    setModalidad(m);
    setPaginaActual(1);
  }, []);

  useEffect(() => {
    let activo = true;
    egresadoService.listarOfertasEmpleo()
      .then((data) => { if (activo) setEmpleos(data); })
      .catch(() => { if (activo) setEmpleos([]); })
      .finally(() => { if (activo) setCargando(false); });
    return () => { activo = false; };
  }, []);

  const manejarBusqueda = useCallback((valor) => {
    setBusqueda(valor);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => { setBusquedaReal(valor); setPaginaActual(1); }, 300);
  }, []);

  const limpiarFiltros = useCallback(() => {
    setBusqueda('');
    setBusquedaReal('');
    setModalidad('');
    setTecnologia('');
    setSalarioMin('');
    setSalarioMax('');
    setOrden('recientes');
    setPaginaActual(1);
  }, []);

  const listaTecnologias = useMemo(() => {
    const set = new Set();
    empleos.forEach((e) => (e.tecnologias || []).forEach((t) => set.add(t)));
    return [...set].sort();
  }, [empleos]);

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
    if (tecnologia) {
      resultado = resultado.filter((e) => (e.tecnologias || []).includes(tecnologia));
    }
    if (salarioMin) {
      resultado = resultado.filter((e) => e.salario_max == null || e.salario_max >= Number(salarioMin));
    }
    if (salarioMax) {
      resultado = resultado.filter((e) => e.salario_min == null || e.salario_min <= Number(salarioMax));
    }
    if (orden === 'salarioDesc') {
      resultado = [...resultado].sort((a, b) => (b.presupuestoMin || 0) - (a.presupuestoMin || 0));
    } else if (orden === 'salarioAsc') {
      resultado = [...resultado].sort((a, b) => (a.presupuestoMin || 0) - (b.presupuestoMin || 0));
    } else {
      resultado = [...resultado].sort((a, b) => new Date(b.publicado) - new Date(a.publicado));
    }
    return resultado;
  }, [empleos, busquedaReal, modalidad, tecnologia, salarioMin, salarioMax, orden]);

  const totalPaginas = Math.max(1, Math.ceil(filtradas.length / ITEMS_POR_PAGINA));
  const pagina       = Math.min(paginaActual, totalPaginas);
  const paginaItems  = useMemo(
    () => filtradas.slice((pagina - 1) * ITEMS_POR_PAGINA, pagina * ITEMS_POR_PAGINA),
    [filtradas, pagina]
  );
  const rangoPaginas = generarRangoPaginas(pagina, totalPaginas);
  const hayFiltros = busquedaReal.trim() || modalidad || tecnologia || salarioMin || salarioMax;

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
                <button
                  type="button"
                  className="btnLimpiarBusqueda"
                  onClick={() => { setBusqueda(''); setBusquedaReal(''); setPaginaActual(1); }}
                  aria-label="Limpiar búsqueda"
                >
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
            key={m.valor}
            type="button"
            className={`chipModalidad${modalidad === m.valor ? ' activo' : ''}`}
            onClick={() => cambiarModalidad(m.valor)}
          >
            {t(m.key)}
          </button>
        ))}
      </div>

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
            <label className="etiquetaFiltro" htmlFor="filtroTecnologia">{t('egresadoExplorarEmpleos.filters.tecnologias')}</label>
            <select
              id="filtroTecnologia"
              className="seleccionadorFiltro"
              value={tecnologia}
              onChange={(e) => { setTecnologia(e.target.value); setPaginaActual(1); }}
            >
              <option value="">{t('egresadoExplorarEmpleos.filters.todasTecnologias')}</option>
              {listaTecnologias.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
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
                  {t('egresadoExplorarEmpleos.resultados', { count: filtradas.length })}
                </span>
                <div className="ordenarResultados">
                  <label htmlFor="ordenSelect" className="etiquetaOrdenar">
                    {t('egresadoExplorar.grid.ordenarPor')}:
                  </label>
                  <select
                    id="ordenSelect"
                    className="seleccionadorOrdenar"
                    value={orden}
                    onChange={(e) => { setOrden(e.target.value); setPaginaActual(1); }}
                  >
                    {OPCIONES_ORDEN.map((o) => (
                      <option key={o.valor} value={o.valor}>{t(o.key)}</option>
                    ))}
                  </select>
                </div>
                {hayFiltros && (
                  <button type="button" className="btnLimpiarFiltros" onClick={limpiarFiltros}>
                    <X size={14} />
                    {t('egresadoExplorarEmpleos.limpiarFiltros')}
                  </button>
                )}
              </div>

              <div className="cuadriculaProyectos">
                {paginaItems.map((e) => (
                  <TarjetaEmpleo
                    key={e.id}
                    empleo={e}
                    yaPostulado={e.ya_postulado}
                  />
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
