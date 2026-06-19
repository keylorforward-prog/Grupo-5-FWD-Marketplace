import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, Briefcase, X, SlidersHorizontal } from 'lucide-react';
import { egresadoService } from '../../../../../services/egresadoService';
import TarjetaEmpleo from '../../components/TarjetaEmpleo';

const ITEMS_POR_PAGINA = 6;

const MODALIDADES = [
  { valor: 'remoto', key: 'egresadoExplorar.components.remoto' },
  { valor: 'hibrido', key: 'egresadoExplorar.components.hibrido' },
  { valor: 'presencial', key: 'egresadoExplorar.components.presencial' },
];

function generarRangoPaginas(actual, total) {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  if (actual <= 4) return [1, 2, 3, 4, 5, '...', total];
  if (actual >= total - 3) return [1, '...', total - 4, total - 3, total - 2, total - 1, total];
  return [1, '...', actual - 1, actual, actual + 1, '...', total];
}

function ModalPostular({ oferta, onCerrar, onExito }) {
  const [carta, setCarta]       = useState('');
  const [cvUrl, setCvUrl]       = useState('');
  const [enviando, setEnviando] = useState(false);
  const [error, setError]       = useState('');

  const enviar = async () => {
    setEnviando(true);
    setError('');
    try {
      await egresadoService.postularOfertaEmpleo({
        id_oferta_empleo:   oferta.id,
        carta_presentacion: carta.trim() || null,
        cv_url:             cvUrl.trim() || null,
      });
      onExito(oferta.id);
    } catch (err) {
      setError(err.response?.data?.message || 'No se pudo enviar la postulación. Intentá de nuevo.');
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={(e) => { if (e.target === e.currentTarget) onCerrar(); }}
    >
      <div className="bg-surface rounded-2xl shadow-soft w-full max-w-lg mx-4 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-heading font-bold text-lg text-ink">Postular a {oferta.titulo}</h2>
          <button type="button" onClick={onCerrar} className="text-ink-muted hover:text-ink">
            <X size={20} />
          </button>
        </div>

        <label className="block space-y-1">
          <span className="text-sm font-medium text-ink">Carta de presentación</span>
          <textarea
            className="w-full bg-surface-sunken rounded-xl px-4 py-3 text-sm text-ink outline-none focus:ring-2 focus:ring-primary/30 resize-none"
            rows={5}
            placeholder="Contale al empresario por qué sos el candidato ideal para este puesto..."
            value={carta}
            onChange={(e) => setCarta(e.target.value)}
          />
        </label>

        <label className="block space-y-1">
          <span className="text-sm font-medium text-ink">
            Enlace a tu CV <span className="text-ink-subtle">(opcional)</span>
          </span>
          <input
            type="url"
            className="w-full bg-surface-sunken rounded-xl px-4 py-2.5 text-sm text-ink outline-none focus:ring-2 focus:ring-primary/30"
            placeholder="https://drive.google.com/..."
            value={cvUrl}
            onChange={(e) => setCvUrl(e.target.value)}
          />
        </label>

        {error && (
          <p className="text-sm text-destructive bg-destructive/10 rounded-xl px-4 py-2.5">{error}</p>
        )}

        <div className="flex gap-3 pt-1">
          <button
            type="button"
            onClick={onCerrar}
            className="flex-1 rounded-full py-2.5 text-sm font-medium border border-border text-ink-muted hover:text-ink transition"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={enviar}
            disabled={enviando}
            className="flex-1 rounded-full py-2.5 text-sm font-medium bg-primary text-primary-foreground disabled:opacity-50 hover:opacity-90 transition"
          >
            {enviando ? 'Enviando...' : 'Enviar postulación'}
          </button>
        </div>
      </div>
    </div>
  );
}



export default function ExplorarEmpleos() {
  const { t } = useTranslation();
  const [busqueda, setBusqueda] = useState('');
  const [busquedaReal, setBusquedaReal] = useState('');
  const [modalidad, setModalidad] = useState('');
  const [paginaActual, setPaginaActual] = useState(1);
  const [empleos, setEmpleos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [salarioMin, setSalarioMin] = useState('');
  const [salarioMax, setSalarioMax] = useState('');
  const [ofertaPostulando, setOfertaPostulando] = useState(null);
  const [exitoId, setExitoId] = useState(null);
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

  const manejarExito = useCallback((idOferta) => {
    setEmpleos((prev) => prev.map((e) => e.id === idOferta ? { ...e, ya_postulado: true } : e));
    setExitoId(idOferta);
    setOfertaPostulando(null);
    setTimeout(() => setExitoId(null), 4000);
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
      resultado = resultado.filter((e) => e.salario_max == null || e.salario_max >= Number(salarioMin));
    }
    if (salarioMax) {
      resultado = resultado.filter((e) => e.salario_min == null || e.salario_min <= Number(salarioMax));
    }
    return resultado;
  }, [empleos, busquedaReal, modalidad, salarioMin, salarioMax]);

  const totalPaginas = Math.max(1, Math.ceil(filtradas.length / ITEMS_POR_PAGINA));
  const pagina       = Math.min(paginaActual, totalPaginas);
  const paginaItems  = useMemo(
    () => filtradas.slice((pagina - 1) * ITEMS_POR_PAGINA, pagina * ITEMS_POR_PAGINA),
    [filtradas, pagina]
  );
  const rangoPaginas = generarRangoPaginas(pagina, totalPaginas);
  const hayFiltros = busquedaReal.trim() || modalidad;

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
                  <TarjetaEmpleo
                    key={e.id}
                    empleo={e}
                    onPostular={() => setOfertaPostulando(e)}
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

      {ofertaPostulando && (
        <ModalPostular
          oferta={ofertaPostulando}
          onCerrar={() => setOfertaPostulando(null)}
          onExito={manejarExito}
        />
      )}

      {exitoId && (
        <div className="fixed bottom-6 right-6 z-50 bg-surface border border-border rounded-2xl shadow-soft px-5 py-3 text-sm text-ink">
          Postulación enviada con éxito.
        </div>
      )}
    </div>
  );
}
