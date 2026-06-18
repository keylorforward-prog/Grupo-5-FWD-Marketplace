import { useState, useMemo, useCallback } from 'react';
import { Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import { dashboardEmpresarioService } from '../../../services/dashboardEmpresarioService';
import Aside from '../../../components/sidebar/Aside';
import FilaCandidato from '../../../components/postulaciones/FilaCandidato';
import AccionesMasivas from '../../../components/postulaciones/AccionesMasivas';
import PerfilEgresadoModal from '../DashboardEmpresario/components/PerfilEgresadoModal';
import { useDashboardEmpresarioRequest } from '../DashboardEmpresario/hooks/useDashboardEmpresarioRequest';
import { formatearPostulacion } from '../DashboardEmpresario/utils/dashboardEmpresarioFormatters';

const OPCIONES_POR_PAGINA = [3, 10, 15, 25];

// Stat card config matching the photo
const construirTarjetasEstadistica = (estadisticas) => [
  {
    label: 'TOTAL POSTULADOS',
    value: estadisticas.total,
    bg: 'bg-[#1868D5]',
    textValue: 'text-white',
    textLabel: 'text-white/80',
    border: 'border-transparent',
    filter: null,
  },
  {
    label: 'NUEVOS (HOY)',
    value: estadisticas.nuevos,
    bg: 'bg-white',
    textValue: 'text-[#B45309]',
    textLabel: 'text-gray-500',
    border: 'border-gray-200',
    filter: 'nuevo',
  },
  {
    label: 'EN REVISIÓN',
    value: estadisticas.enRevision,
    bg: 'bg-white',
    textValue: 'text-[#7C3AED]',
    textLabel: 'text-gray-500',
    border: 'border-gray-200',
    filter: 'en_revision',
  },
  {
    label: 'ENTREVISTADOS',
    value: estadisticas.entrevistados,
    bg: 'bg-white',
    textValue: 'text-gray-900',
    textLabel: 'text-gray-500',
    border: 'border-gray-200',
    filter: 'entrevistado',
  },
];

const ETIQUETAS_ESTADO = {
  nuevo: 'Nuevos',
  en_revision: 'En revisión',
  entrevistado: 'Entrevistados',
};

export default function GestionPostulaciones() {
  const { data, loading, error } = useDashboardEmpresarioRequest(
    () => dashboardEmpresarioService.obtenerPostulaciones(),
    [],
    []
  );
  const [cambiosLocales, setCambiosLocales] = useState({});
  const [idsSeleccionados, setIdsSeleccionados] = useState(new Set());
  const [paginaActual, setPaginaActual] = useState(1);
  const [itemsPorPagina, setItemsPorPagina] = useState(3);
  const [filtroEstado, setFiltroEstado] = useState(null);
  const [perfilSeleccionado, setPerfilSeleccionado] = useState(null);
  const candidatos = useMemo(
    () => data.map(formatearPostulacion).map((c) => ({ ...c, ...cambiosLocales[c.id] })),
    [data, cambiosLocales]
  );
  const nombreProyecto = candidatos.find((c) => c.proyecto)?.proyecto || 'proyecto seleccionado';

  const filtrados = useMemo(
    () => (!filtroEstado ? candidatos : candidatos.filter((c) => c.estado === filtroEstado)),
    [candidatos, filtroEstado]
  );

  const totalPaginas = Math.max(1, Math.ceil(filtrados.length / itemsPorPagina));
  const paginados = useMemo(
    () => filtrados.slice((paginaActual - 1) * itemsPorPagina, paginaActual * itemsPorPagina),
    [filtrados, paginaActual, itemsPorPagina]
  );

  const estadisticas = useMemo(() => ({
    total:         candidatos.length,
    nuevos:        candidatos.filter((c) => c.estado === 'nuevo').length,
    enRevision:    candidatos.filter((c) => c.estado === 'en_revision').length,
    entrevistados: candidatos.filter((c) => c.estado === 'entrevistado').length,
  }), [candidatos]);

  const tarjetasEstadistica = construirTarjetasEstadistica(estadisticas);

  const alternarSeleccion = useCallback((id) => {
    setIdsSeleccionados((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }, []);

  const alternarSeleccionAll = useCallback(() => {
    const pageIds = paginados.map((c) => c.id);
    const allSelected = pageIds.every((id) => idsSeleccionados.has(id));
    setIdsSeleccionados((prev) => {
      const next = new Set(prev);
      pageIds.forEach((id) => (allSelected ? next.delete(id) : next.add(id)));
      return next;
    });
  }, [paginados, idsSeleccionados]);

  const manejarInvitacion = useCallback((id) => {
    setCambiosLocales((prev) => ({
      ...prev,
      [id]: { ...(prev[id] ?? {}), estaInvitado: true, status: 'entrevistado' },
    }));
  }, []);

  const manejarRechazo = useCallback((id) => {
    setCambiosLocales((prev) => ({
      ...prev,
      [id]: { ...(prev[id] ?? {}), status: 'rechazado' },
    }));
  }, []);

  const manejarExportacion = useCallback((formato, soloSeleccionados) => {
    const data = soloSeleccionados ? candidatos.filter((c) => idsSeleccionados.has(c.id)) : candidatos;
    alert(`Exportando ${data.length} candidatos en formato ${formato.toUpperCase()}`);
  }, [candidatos, idsSeleccionados]);

  const todaPaginaSeleccionada = paginados.length > 0 && paginados.every((c) => idsSeleccionados.has(c.id));
  const algunaPaginaSeleccionada = paginados.some((c) => idsSeleccionados.has(c.id)) && !todaPaginaSeleccionada;

  return (
    <div className="flex min-h-screen bg-surface">
      <Aside />

      <main className="flex-1 ml-[260px] max-w-[1200px] mx-auto relative bg-[#F8FAFC]">
        {/* Sticky header */}
        <header className="sticky top-0 z-30 bg-[#F8FAFC] pb-2">
          <div className="px-8 py-5">
            <div className="flex items-start justify-between">
              <div className="max-w-3xl">
                <nav className="text-xs text-gray-500 mb-2 flex items-center gap-1.5 tracking-wide">
                  <span className="hover:text-gray-900 cursor-pointer transition-colors">Proyectos</span>
                  <span className="text-gray-400">/</span>
                  <span className="hover:text-gray-900 cursor-pointer transition-colors">E-commerce Refactor</span>
                  <span className="text-gray-400">/</span>
                  <span className="text-[#1868D5] font-semibold">Postulaciones</span>
                </nav>
                <h1 className="text-2xl font-bold text-gray-900 tracking-tight mb-2">
                  Gestión de Postulaciones
                </h1>
                <p className="text-sm text-gray-500 leading-relaxed">
                  Revisa los perfiles de los juniors que han aplicado a <strong className="text-[#1868D5] font-semibold">"{nombreProyecto}"</strong>.
                  <br />Evalúa sus stacks y cartas de presentación para coordinar entrevistas.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors border border-gray-200 shadow-sm">
                  <Filter className="w-4 h-4 text-gray-500" />
                  Filtrar
                </button>
                <AccionesMasivas
                  cantidadSeleccionada={idsSeleccionados.size}
                  cantidadTotal={candidatos.length}
                  alExportar={manejarExportacion}
                  alLimpiarSeleccion={() => setIdsSeleccionados(new Set())}
                />
              </div>
            </div>
          </div>
        </header>

        <div className="px-8 py-7">
          {loading && (
            <div className="mb-6 rounded-2xl border border-gray-200 bg-white px-5 py-4 text-sm text-gray-500">
              Cargando postulaciones...
            </div>
          )}
          {error && (
            <div className="mb-6 rounded-2xl border border-red-100 bg-red-50 px-5 py-4 text-sm text-red-600">
              {error}
            </div>
          )}
          {/* ── Stat Cards (Staggered Fade-in) ── */}
          <div className="grid grid-cols-4 gap-4 mb-8">
            {tarjetasEstadistica.map((card, i) => {
              const isActive = filtroEstado === card.filter;
              return (
                <button
                  key={card.label}
                  onClick={() => { setFiltroEstado(isActive ? null : card.filter); setPaginaActual(1); }}
                  className={`relative overflow-hidden rounded-3xl p-6 text-left border
                    transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] group
                    animate-slide-up-fade ${card.bg} ${card.border}`}
                  style={{
                    animationDelay: `${i * 90}ms`,
                    boxShadow: isActive ? '0 0 0 2px #1868D5, 0 4px 12px rgba(0,0,0,0.05)' : '0 2px 8px rgba(0,0,0,0.02)'
                  }}
                >
                  <div className="relative z-10">
                    <p className={`text-[10px] font-bold uppercase tracking-wider mb-3 ${card.textLabel}`}>
                      {card.label}
                    </p>
                    <p className={`text-5xl font-bold tabular-nums tracking-tight ${card.textValue}`}>
                      {String(card.value).padStart(2, '0')}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* ── Table Container ── */}
          <div
            className="rounded-3xl overflow-hidden border border-gray-100 bg-white transition-shadow duration-500"
            style={{
              boxShadow: '0 4px 24px -6px rgba(0,0,0,0.03)',
            }}
          >
            {/* Active Filters Toolbar */}
            {filtroEstado && (
              <div className="flex items-center px-6 py-4 border-b border-gray-100/60 bg-gray-50/50">
                  <span className="inline-flex items-center gap-1.5 text-xs text-brand-700
                    bg-brand-50 px-3 py-1.5 rounded-xl font-semibold border border-brand-100
                    animate-elastic-in">
                    Filtro: {ETIQUETAS_ESTADO[filtroEstado] ?? filtroEstado}
                    <button
                      onClick={() => { setFiltroEstado(null); setPaginaActual(1); }}
                      className="text-brand-500 hover:text-brand-700 ml-0.5 transition-colors"
                    >
                      ✕
                    </button>
                  </span>
              </div>
            )}

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100 bg-[#F8FAFC]">
                    <th className="py-4 pl-6 pr-4 text-left text-xs font-semibold text-gray-500 w-1/4">
                      <label className="inline-flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={todaPaginaSeleccionada}
                          onChange={alternarSeleccionAll}
                          aria-label={
                            algunaPaginaSeleccionada || todaPaginaSeleccionada
                              ? 'Deseleccionar candidatos de esta página'
                              : 'Seleccionar candidatos de esta página'
                          }
                          className="h-4 w-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500"
                        />
                        Candidato / Junior
                      </label>
                    </th>
                    <th className="py-4 px-4 text-left text-xs font-semibold text-gray-500 w-1/4">
                      Stack Principal
                    </th>
                    <th className="py-4 px-4 text-left text-xs font-semibold text-gray-500 w-1/3">
                      Carta de Presentación
                    </th>
                    <th className="py-4 pr-6 text-right text-xs font-semibold text-gray-500 w-auto">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {!loading && !error && paginados.map((candidate, i) => (
                    <FilaCandidato
                      key={candidate.id}
                      candidate={candidate}
                      index={i}
                      estaSeleccionado={idsSeleccionados.has(candidate.id)}
                      alSeleccionar={alternarSeleccion}
                      alVer={() => setPerfilSeleccionado(candidate.perfil)}
                      alInvitar={manejarInvitacion}
                      alRechazar={manejarRechazo}
                    />
                  ))}
                  {!loading && !error && paginados.length === 0 && (
                    <tr>
                      <td className="px-6 py-8 text-sm text-gray-500" colSpan="4">
                        No hay postulaciones para mostrar.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between px-6 py-5 border-t border-gray-100 bg-white">
              <div className="flex items-center gap-3">
                <p className="text-xs text-gray-500">
                  Mostrando {filtrados.length > 0 ? (paginaActual - 1) * itemsPorPagina + 1 : 0}-{Math.min(paginaActual * itemsPorPagina, filtrados.length)} de {filtrados.length} candidatos
                </p>
                <select
                  value={itemsPorPagina}
                  onChange={(event) => {
                    setItemsPorPagina(Number(event.target.value));
                    setPaginaActual(1);
                  }}
                  className="rounded-full border border-gray-200 bg-white px-3 py-1 text-xs font-semibold text-gray-600 focus:outline-none focus:ring-2 focus:ring-brand-200"
                  aria-label="Candidatos por página"
                >
                  {OPCIONES_POR_PAGINA.map((option) => (
                    <option key={option} value={option}>
                      {option} por página
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  disabled={paginaActual === 1}
                  onClick={() => setPaginaActual((p) => p - 1)}
                  className="w-8 h-8 rounded-full flex items-center justify-center
                    text-gray-400 hover:bg-gray-100 hover:text-gray-700
                    disabled:opacity-30 disabled:cursor-not-allowed transition-all border border-gray-200"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                {Array.from({ length: totalPaginas }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setPaginaActual(page)}
                    className={`w-8 h-8 rounded-full text-xs font-semibold transition-all duration-200
                      ${page === paginaActual
                        ? 'bg-[#1868D5] text-white shadow-sm'
                        : 'text-gray-600 hover:bg-gray-100 border border-transparent hover:border-gray-200'
                      }`}
                  >
                    {page}
                  </button>
                ))}

                <button
                  disabled={paginaActual === totalPaginas}
                  onClick={() => setPaginaActual((p) => p + 1)}
                  className="w-8 h-8 rounded-full flex items-center justify-center
                    text-gray-400 hover:bg-gray-100 hover:text-gray-700
                    disabled:opacity-30 disabled:cursor-not-allowed transition-all border border-gray-200"
                  aria-label="Página siguiente"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Footer */}
          <footer className="mt-12 pt-6 border-t border-gray-200/60 flex items-center justify-between text-xs text-gray-400">
            <div className="leading-relaxed">
              <span className="font-bold text-gray-600">FWD</span>
              <br />© 2024 Fundación Forward Costa Rica
              <br />Impulsando el talento tecnológico nacional.
            </div>
            <div className="flex gap-6">
              {['Privacidad', 'Términos de Uso', 'LinkedIn', 'Instagram'].map((link) => (
                <a key={link} href="#"
                  className="hover:text-brand-600 transition-colors duration-200 tracking-wide">
                  {link}
                </a>
              ))}
            </div>
          </footer>
        </div>
      </main>
      <PerfilEgresadoModal perfil={perfilSeleccionado} onClose={() => setPerfilSeleccionado(null)} />
    </div>
  );
}
