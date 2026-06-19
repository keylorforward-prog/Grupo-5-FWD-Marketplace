import { useMemo, useState } from 'react';
import { CheckCircle2, ChevronLeft, ChevronRight, Eye, Search, X } from 'lucide-react';
import { dashboardEmpresarioService } from '../../../../../services/dashboardEmpresarioService';
import DashboardLayout from '../../components/DashboardLayout';
import EstadoDatos from '../../components/EstadoDatos';
import PerfilEgresadoModal from '../../components/PerfilEgresadoModal';
import { useDashboardEmpresarioRequest } from '../../hooks/useDashboardEmpresarioRequest';
import { formatearTalento } from '../../utils/dashboardEmpresarioFormatters';
import { useDebounce } from '../../../../../hooks/useDebounce';

export default function Talento() {
  const [perfilSeleccionado, setPerfilSeleccionado] = useState(null);
  const [paginaActual, setPaginaActual] = useState(1);
  const [busqueda, setBusqueda] = useState('');
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
  const paginaInicial = meta.total > 0 ? (paginaActual - 1) * itemsPorPagina + 1 : 0;
  const paginaFinal = Math.min(paginaActual * itemsPorPagina, meta.total || talento.length);
  const paginasVisibles = useMemo(() => {
    const inicio = Math.max(1, Math.min(paginaActual - 2, totalPaginas - 4));
    const fin = Math.min(totalPaginas, inicio + 4);
    return Array.from({ length: fin - inicio + 1 }, (_, index) => inicio + index);
  }, [paginaActual, totalPaginas]);

  return (
    <DashboardLayout activePage="talento">
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
        </div>
        <EstadoDatos loading={loading} error={error} empty={!talento.length} emptyText="No hay talento recomendado disponible." />
        {!loading && !error && talento.map((talent) => (
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
        {!loading && !error && talento.length > 0 && (
          <div className="de-talent-pagination">
            <span>
              Mostrando {paginaInicial}-{paginaFinal} de {meta.total || talento.length}
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
      <PerfilEgresadoModal perfil={perfilSeleccionado} onClose={() => setPerfilSeleccionado(null)} />
    </DashboardLayout>
  );
}
