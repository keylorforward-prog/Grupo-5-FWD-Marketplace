import { lazy, Suspense, useMemo, useState } from 'react';
import { CheckCircle2, ChevronLeft, ChevronRight, Eye, Search, X } from 'lucide-react';
import { dashboardEmpresarioService } from '../../../../../services/dashboardEmpresarioService';
import { catalogoTecnologias } from '../../../../../data/proyectosEgresado';
import EstadoDatos from '../../components/EstadoDatos';
import { useDashboardEmpresarioRequest } from '../../hooks/useDashboardEmpresarioRequest';
import { formatearTalento } from '../../utils/dashboardEmpresarioFormatters';
import { useDebounce } from '../../../../../hooks/useDebounce';

const PerfilEgresadoModal = lazy(() => import('../../components/PerfilEgresadoModal'));

export default function Talento() {
  const [perfilSeleccionado, setPerfilSeleccionado] = useState(null);
  const [paginaActual, setPaginaActual] = useState(1);
  const [busqueda, setBusqueda] = useState('');
  const [tecnologia, setTecnologia] = useState('');
  const [sede, setSede] = useState('');
  const [orden, setOrden] = useState('match');
  const itemsPorPagina = 10;
  const busquedaDebounced = useDebounce(busqueda, 350);
  const busquedaLimpia = busquedaDebounced.trim();
  const { data, loading, error } = useDashboardEmpresarioRequest(
    () => dashboardEmpresarioService.obtenerTalentoRecomendado({
      page: paginaActual,
      limit: itemsPorPagina,
      search: busquedaLimpia || undefined,
    }),
    { items: [], meta: { page: 1, limit: itemsPorPagina, total: 0, totalPages: 1 } },
    [paginaActual, busquedaLimpia]
  );
  const items = useMemo(() => (Array.isArray(data) ? data : data.items || []), [data]);
  const meta = useMemo(() => (
    Array.isArray(data)
      ? { page: 1, limit: itemsPorPagina, total: data.length, totalPages: Math.max(1, Math.ceil(data.length / itemsPorPagina)) }
      : data.meta || { page: paginaActual, limit: itemsPorPagina, total: items.length, totalPages: 1 }
  ), [data, items.length, paginaActual]);
  const totalPaginas = Math.max(1, Number(meta.totalPages || 1));
  const talento = useMemo(() => items.map(formatearTalento), [items]);
  const sedesDisponibles = useMemo(() => (
    Array.from(new Set(talento.map((talent) => talent.location).filter(Boolean))).sort((a, b) => a.localeCompare(b, 'es-CR'))
  ), [talento]);
  const talentoFiltrado = useMemo(() => {
    const tecnologiaNormalizada = tecnologia.toLowerCase();
    const filtrado = talento.filter((talent) => {
      const coincideTecnologia = !tecnologiaNormalizada || talent.skills.toLowerCase().includes(tecnologiaNormalizada);
      const coincideSede = !sede || talent.location === sede;
      return coincideTecnologia && coincideSede;
    });

    return [...filtrado].sort((a, b) => {
      if (orden === 'nombre') return a.name.localeCompare(b.name, 'es-CR');
      if (orden === 'proyectos') return b.projects - a.projects;
      if (orden === 'rating') return Number(b.rating) - Number(a.rating);
      return b.match - a.match;
    });
  }, [orden, sede, talento, tecnologia]);
  const paginaInicial = meta.total > 0 ? (paginaActual - 1) * itemsPorPagina + 1 : 0;
  const paginaFinal = Math.min(paginaActual * itemsPorPagina, meta.total || talento.length);
  const paginasVisibles = useMemo(() => {
    const inicio = Math.max(1, Math.min(paginaActual - 2, totalPaginas - 4));
    const fin = Math.min(totalPaginas, inicio + 4);
    return Array.from({ length: fin - inicio + 1 }, (_, index) => inicio + index);
  }, [paginaActual, totalPaginas]);
  const hayFiltros = Boolean(busqueda || tecnologia || sede || orden !== 'match');
  const limpiarFiltros = () => {
    setBusqueda('');
    setTecnologia('');
    setSede('');
    setOrden('match');
    setPaginaActual(1);
  };

  return (
    <>
      <div className="de-page-heading">
        <h1>Talento Recomendado</h1>
        <p className="de-page-subtitle">Mostrando 10 egresados por pagina.</p>
      </div>
      <div className="de-panel">
        <div className="de-talent-toolbar">
          <label className="de-talent-search">
            <Search size={17} />
            <input
              type="search"
              value={busqueda}
              onChange={(event) => {
                setBusqueda(event.target.value);
                setPaginaActual(1);
              }}
              placeholder="Buscar por nombre, correo, tecnologia o sede"
              aria-label="Buscar talento"
            />
            {busqueda && (
              <button
                type="button"
                onClick={() => {
                  setBusqueda('');
                  setPaginaActual(1);
                }}
                aria-label="Limpiar busqueda"
              >
                <X size={15} />
              </button>
            )}
          </label>

          <label className="de-talent-filter">
            <span>Tecnología</span>
            <select value={tecnologia} onChange={(event) => setTecnologia(event.target.value)}>
              <option value="">Todas</option>
              {catalogoTecnologias.map((tech) => (
                <option key={tech} value={tech}>{tech}</option>
              ))}
            </select>
          </label>

          <label className="de-talent-filter">
            <span>Sede</span>
            <select value={sede} onChange={(event) => setSede(event.target.value)}>
              <option value="">Todas</option>
              {sedesDisponibles.map((location) => (
                <option key={location} value={location}>{location}</option>
              ))}
            </select>
          </label>

          <label className="de-talent-filter">
            <span>Ordenar</span>
            <select value={orden} onChange={(event) => setOrden(event.target.value)}>
              <option value="match">Mejor coincidencia</option>
              <option value="rating">Calificación</option>
              <option value="proyectos">Más proyectos</option>
              <option value="nombre">Nombre A-Z</option>
            </select>
          </label>

          <button className="de-panel-action" type="button" onClick={limpiarFiltros} disabled={!hayFiltros}>
            Limpiar
          </button>
        </div>
        <EstadoDatos loading={loading} error={error} empty={!talentoFiltrado.length} emptyText="No hay talento recomendado disponible." />
        {!loading && !error && talentoFiltrado.map((talent) => (
          <div key={talent.id} className="de-talent-item">
            <img src={talent.avatar} alt={talent.name} className="de-talent-avatar" />
            <div className="de-talent-info">
              <div className="de-talent-name">
                {talent.name}
                {talent.verified && <CheckCircle2 size={14} className="de-talent-verified" />}
              </div>
              <p className="de-talent-skills">{talent.skills}</p>
              <p className="de-talent-rating">Calificacion {talent.rating} ({talent.projects} proyectos)</p>
            </div>
            <div className="de-talent-match">
              <span className="de-talent-match-pct">{talent.match}%</span>
              <span className="de-talent-match-label">Coincidencia</span>
              <button className="de-talent-view" type="button" onClick={() => setPerfilSeleccionado(talent)}>
                <Eye size={14} />
                Ver perfil
              </button>
            </div>
          </div>
        ))}
        {!loading && !error && talentoFiltrado.length > 0 && (
          <div className="de-talent-pagination">
            <span>
              Mostrando {paginaInicial}-{paginaFinal} de {meta.total || talentoFiltrado.length}
            </span>
            <div className="de-talent-pagination-controls">
              <button
                type="button"
                disabled={paginaActual <= 1}
                onClick={() => setPaginaActual((page) => Math.max(1, page - 1))}
                aria-label="Pagina anterior"
              >
                <ChevronLeft size={16} />
              </button>
              {paginasVisibles.map((page) => (
                <button
                  key={page}
                  type="button"
                  className={page === paginaActual ? 'active' : ''}
                  onClick={() => setPaginaActual(page)}
                  aria-current={page === paginaActual ? 'page' : undefined}
                >
                  {page}
                </button>
              ))}
              <button
                type="button"
                disabled={paginaActual >= totalPaginas}
                onClick={() => setPaginaActual((page) => Math.min(totalPaginas, page + 1))}
                aria-label="Pagina siguiente"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
      {perfilSeleccionado && (
        <Suspense fallback={null}>
          <PerfilEgresadoModal perfil={perfilSeleccionado} onClose={() => setPerfilSeleccionado(null)} />
        </Suspense>
      )}
    </>
  );
}
