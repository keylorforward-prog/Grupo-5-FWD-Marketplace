import { useState, useMemo, useCallback } from 'react';
import { Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import { dashboardEmpresarioService } from '../../../services/dashboardEmpresarioService';
import FilaCandidato from '../../../components/postulaciones/FilaCandidato';
import AccionesMasivas from '../../../components/postulaciones/AccionesMasivas';
import PerfilEgresadoModal from '../DashboardEmpresario/components/PerfilEgresadoModal';
import DashboardLayout from '../DashboardEmpresario/components/DashboardLayout';
import { useDashboardEmpresarioRequest } from '../DashboardEmpresario/hooks/useDashboardEmpresarioRequest';
import { formatearPostulacion } from '../DashboardEmpresario/utils/dashboardEmpresarioFormatters';

const OPCIONES_POR_PAGINA = [3, 10, 15, 25];

const construirTarjetasEstadistica = (estadisticas) => [
  {
    label: 'TOTAL POSTULADOS',
    value: estadisticas.total,
    iconClass: 'blue',
    filter: null,
  },
  {
    label: 'NUEVOS (HOY)',
    value: estadisticas.nuevos,
    iconClass: 'orange',
    filter: 'nuevo',
  },
  {
    label: 'PENDIENTES',
    value: estadisticas.pendientes,
    bg: 'bg-white',
    textValue: 'text-[#92400e]',
    textLabel: 'text-gray-500',
    border: 'border-gray-200',
    filter: 'pendiente',
  },
  {
    label: 'EN REVISIÓN',
    value: estadisticas.enRevision,
    iconClass: 'purple',
    filter: 'en_revision',
  },
  {
    label: 'ENTREVISTADOS',
    value: estadisticas.entrevistados,
    iconClass: 'green',
    filter: 'entrevistado',
  },
  {
    label: 'ACEPTADOS',
    value: estadisticas.aceptados,
    bg: 'bg-white',
    textValue: 'text-[#047857]',
    textLabel: 'text-gray-500',
    border: 'border-gray-200',
    filter: 'aceptado',
  },
];

const ETIQUETAS_ESTADO = {
  nuevo: 'Nuevos',
  pendiente: 'Pendientes',
  en_revision: 'En revisión',
  entrevistado: 'Entrevistados',
  aceptado: 'Aceptados',
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
    pendientes:    candidatos.filter((c) => c.estado === 'pendiente').length,
    enRevision:    candidatos.filter((c) => c.estado === 'en_revision').length,
    entrevistados: candidatos.filter((c) => c.estado === 'entrevistado').length,
    aceptados:     candidatos.filter((c) => c.estado === 'aceptado').length,
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

  const manejarInvitacion = useCallback(async (id, _date, _time, _msg) => {
    try {
      await dashboardEmpresarioService.actualizarEstadoPostulacion(id, 'PRESSELECCIONADA');
      setCambiosLocales((prev) => ({
        ...prev,
        [id]: { ...(prev[id] ?? {}), estaInvitado: true, status: 'entrevistado' },
      }));
    } catch (err) {
      alert(err.response?.data?.message || 'Error al actualizar la postulacion.');
    }
  }, []);

  const manejarRechazo = useCallback(async (id, mensaje = '') => {
    try {
      await dashboardEmpresarioService.actualizarEstadoPostulacion(id, 'RECHAZADA', mensaje);
      setCambiosLocales((prev) => ({
        ...prev,
        [id]: { ...(prev[id] ?? {}), status: 'rechazado' },
      }));
    } catch (err) {
      alert(err.response?.data?.message || 'Error al rechazar la postulacion.');
    }
  }, []);

  const manejarAceptacion = useCallback(async (id, mensaje = '') => {
    try {
      await dashboardEmpresarioService.actualizarEstadoPostulacion(id, 'ACEPTADO', mensaje);
      setCambiosLocales((prev) => ({
        ...prev,
        [id]: { ...(prev[id] ?? {}), status: 'aceptado', estaInvitado: true },
      }));
    } catch (err) {
      alert(err.response?.data?.message || 'Error al aceptar la postulacion.');
    }
  }, []);

  const manejarVerPerfil = useCallback(async (id, perfil) => {
    try {
      await dashboardEmpresarioService.actualizarEstadoPostulacion(id, 'EN_REVISION');
      setCambiosLocales((prev) => ({
        ...prev,
        [id]: { ...(prev[id] ?? {}), status: 'en_revision' },
      }));
    } catch {
      // If it fails, still open the profile
    }
    setPerfilSeleccionado(perfil);
  }, []);

  const manejarExportacion = useCallback((formato, soloSeleccionados) => {
    const data = soloSeleccionados ? candidatos.filter((c) => idsSeleccionados.has(c.id)) : candidatos;
    alert(`Exportando ${data.length} candidatos en formato ${formato.toUpperCase()}`);
  }, [candidatos, idsSeleccionados]);

  const todaPaginaSeleccionada = paginados.length > 0 && paginados.every((c) => idsSeleccionados.has(c.id));
  const algunaPaginaSeleccionada = paginados.some((c) => idsSeleccionados.has(c.id)) && !todaPaginaSeleccionada;

  return (
    <DashboardLayout activePage="postulaciones">
      <div className="fwd-animar-entrada">
        <div className="de-page-heading">
          <div>
            <h1>Gestión de Postulaciones</h1>
            <p className="de-page-subtitle">
              Revisa perfiles aplicados a <strong>{nombreProyecto}</strong> y coordina entrevistas.
            </p>
          </div>

          <div className="de-heading-actions">
            <button className="de-panel-action" type="button">
              <Filter size={15} />
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

        {loading && <p className="de-data-state">Cargando postulaciones...</p>}
        {error && <p className="de-data-state error">{error}</p>}

        <div className="de-stats-grid de-stats-grid-compact">
          {tarjetasEstadistica.map((card) => {
            const isActive = filtroEstado === card.filter;
            return (
              <button
                key={card.label}
                type="button"
                onClick={() => { setFiltroEstado(isActive ? null : card.filter); setPaginaActual(1); }}
                className={`de-stat-card de-stat-button ${isActive ? 'active' : ''}`}
              >
                <div className={`de-stat-icon ${card.iconClass}`}><Filter size={18} /></div>
                <span className="de-stat-value">{String(card.value).padStart(2, '0')}</span>
                <span className="de-stat-label">{card.label}</span>
              </button>
            );
          })}
        </div>

        <section className="de-panel de-table-panel">
          {filtroEstado && (
            <div className="de-active-filters">
              <span className="de-filter-chip">
                Filtro: {ETIQUETAS_ESTADO[filtroEstado] ?? filtroEstado}
              </span>
              <button
                type="button"
                onClick={() => { setFiltroEstado(null); setPaginaActual(1); }}
                aria-label="Quitar filtro"
              >
                ×
              </button>
            </div>
          )}

          <div className="de-table-wrap">
              <table className="de-table">
                <thead>
                  <tr>
                    <th>
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
                    <th>Stack Principal</th>
                    <th>Carta de Presentación</th>
                    <th className="de-table-actions">Acciones</th>
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
                      alVer={(id) => manejarVerPerfil(id, candidate.perfil)}
                      alInvitar={manejarInvitacion}
                      alRechazar={manejarRechazo}
                      alAceptar={manejarAceptacion}
                    />
                  ))}
                  {!loading && !error && paginados.length === 0 && (
                    <tr>
                      <td className="de-empty-table-cell" colSpan="4">
                        No hay postulaciones para mostrar.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
          </div>

          <div className="de-pagination">
            <div className="de-pagination-summary">
                <p>
                  Mostrando {filtrados.length > 0 ? (paginaActual - 1) * itemsPorPagina + 1 : 0}-{Math.min(paginaActual * itemsPorPagina, filtrados.length)} de {filtrados.length} candidatos
                </p>
                <select
                  value={itemsPorPagina}
                  onChange={(event) => {
                    setItemsPorPagina(Number(event.target.value));
                    setPaginaActual(1);
                  }}
                  className="de-pagination-select"
                  aria-label="Candidatos por página"
                >
                  {OPCIONES_POR_PAGINA.map((option) => (
                    <option key={option} value={option}>
                      {option} por página
                    </option>
                  ))}
                </select>
            </div>

            <div className="de-pagination-pages">
                <button
                  disabled={paginaActual === 1}
                  onClick={() => setPaginaActual((p) => p - 1)}
                  className="de-page-button"
                  aria-label="Página anterior"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                {Array.from({ length: totalPaginas }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setPaginaActual(page)}
                    className={`de-page-button ${page === paginaActual ? 'active' : ''}`}
                  >
                    {page}
                  </button>
                ))}

                <button
                  disabled={paginaActual === totalPaginas}
                  onClick={() => setPaginaActual((p) => p + 1)}
                  className="de-page-button"
                  aria-label="Página siguiente"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
            </div>
          </div>
        </section>
      </div>
      <PerfilEgresadoModal perfil={perfilSeleccionado} onClose={() => setPerfilSeleccionado(null)} />
    </DashboardLayout>
  );
}
