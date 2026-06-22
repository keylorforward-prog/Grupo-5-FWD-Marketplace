import { useCallback, useEffect, useMemo, useState } from 'react';
import { Activity, CalendarDays, Eye, Filter, RefreshCw, Search, ShieldCheck, UserRound } from 'lucide-react';
import { adminService } from '../../services/adminService';
import AdminDetalleAuditoriaModal from './components/AdminDetalleAuditoriaModal';
import AdminExportButton from './components/AdminExportButton';
import { useDebounce } from '../../hooks/useDebounce';
import './AdminAuditoria.css';

const PAGE_SIZE = 25;
const fechaLegible = (fecha) => new Date(fecha).toLocaleString('es-CR', { dateStyle: 'medium', timeStyle: 'short' });

export default function AdminAuditoria() {
  const [eventos, setEventos] = useState([]);
  const [meta, setMeta] = useState({ page: 1, total: 0, hasMore: false });
  const [loading, setLoading] = useState(true);
  const [actualizando, setActualizando] = useState(false);
  const [filtros, setFiltros] = useState({ accion: '', usuario: '', entidad: '', severidad: '', desde: '', hasta: '' });
  const filtrosDebounced = useDebounce(filtros, 300);
  const [modal, setModal] = useState({ open: false, evento: null });

  const cargar = useCallback(async ({ page = 1, append = false, silencioso = false } = {}) => {
    if (silencioso) setActualizando(true);
    else setLoading(page === 1);
    try {
      const res = await adminService.getAuditoria({
        page,
        limit: PAGE_SIZE,
        ...Object.fromEntries(Object.entries(filtrosDebounced).filter(([, valor]) => valor)),
      });
      if (res.success) {
        setEventos((actuales) => (append ? [...actuales, ...res.data] : res.data));
        setMeta(res.meta || { page, total: res.data.length, hasMore: false });
      }
    } finally {
      setLoading(false);
      setActualizando(false);
    }
  }, [filtrosDebounced]);

  useEffect(() => {
    const inicio = window.setTimeout(() => cargar({ page: 1 }), 0);
    return () => window.clearTimeout(inicio);
  }, [cargar]);
  useEffect(() => {
    const intervalo = window.setInterval(() => {
      if (document.visibilityState === 'visible') cargar({ page: 1, silencioso: true });
    }, 30000);
    return () => window.clearInterval(intervalo);
  }, [cargar]);

  const resumen = useMemo(() => ({
    total: meta.total,
    alta: eventos.filter((evento) => evento.severidad === 'ALTA').length,
    hoy: eventos.filter((evento) => new Date(evento.fecha).toDateString() === new Date().toDateString()).length,
  }), [eventos, meta.total]);

  const cambiarFiltro = (campo, valor) => setFiltros((actuales) => ({ ...actuales, [campo]: valor }));
  const limpiar = () => setFiltros({ accion: '', usuario: '', entidad: '', severidad: '', desde: '', hasta: '' });

  return (
    <div className="admin-content admin-audit-page animate-in">
      <section className="admin-audit-summary">
        <div><Activity size={18} /><span>Eventos encontrados</span><strong>{resumen.total}</strong></div>
        <div><ShieldCheck size={18} /><span>Alta severidad visibles</span><strong>{resumen.alta}</strong></div>
        <div><CalendarDays size={18} /><span>Actividad de hoy visible</span><strong>{resumen.hoy}</strong></div>
        <button type="button" onClick={() => cargar({ silencioso: true })} disabled={actualizando}>
          <RefreshCw size={17} className={actualizando ? 'is-spinning' : ''} /> Actualizar timeline
        </button>
      </section>

      <section className="admin-panel admin-audit-panel">
        <div className="admin-audit-filter-heading"><Filter size={18} /><div><h3>Timeline de actividad</h3><p>Filtra eventos por actor, entidad, riesgo y rango de fechas.</p></div><AdminExportButton tipo="auditoria" /></div>
        <div className="admin-audit-filters">
          <label className="admin-search"><Search size={17} /><input value={filtros.accion} onChange={(e) => cambiarFiltro('accion', e.target.value)} placeholder="Acción o evento" /></label>
          <label className="admin-search"><UserRound size={17} /><input value={filtros.usuario} onChange={(e) => cambiarFiltro('usuario', e.target.value)} placeholder="Usuario o correo" /></label>
          <select className="admin-filter-select" value={filtros.entidad} onChange={(e) => cambiarFiltro('entidad', e.target.value)} aria-label="Entidad">
            <option value="">Todas las entidades</option><option>Usuario</option><option>PerfilEstudiante</option><option>Propuesta</option><option>Proyecto</option><option>Postulacion</option><option>Mensaje</option><option>Entregable</option><option>Evaluacion</option><option>Reporte</option>
          </select>
          <select className="admin-filter-select" value={filtros.severidad} onChange={(e) => cambiarFiltro('severidad', e.target.value)} aria-label="Severidad">
            <option value="">Toda severidad</option><option value="INFO">Informativa</option><option value="ALTA">Alta</option><option value="CRITICA">Crítica</option>
          </select>
          <label className="admin-date-filter"><span>Desde</span><input type="date" value={filtros.desde} onChange={(e) => cambiarFiltro('desde', e.target.value)} /></label>
          <label className="admin-date-filter"><span>Hasta</span><input type="date" value={filtros.hasta} onChange={(e) => cambiarFiltro('hasta', e.target.value)} /></label>
          <button className="admin-action-button neutral" type="button" onClick={limpiar}>Limpiar</button>
        </div>

        <div className="admin-audit-timeline" aria-live="polite">
          {loading ? <div className="admin-audit-empty">Cargando actividad…</div> : eventos.length === 0 ? <div className="admin-audit-empty">No hay eventos que coincidan con los filtros.</div> : eventos.map((evento) => (
            <article className="admin-audit-event" key={evento.id_auditoria}>
              <span className={`admin-audit-marker ${(evento.severidad || 'INFO').toLowerCase()}`}><ShieldCheck size={16} /></span>
              <div className="admin-audit-event-main">
                <div className="admin-audit-event-title"><strong>{evento.accion}</strong><span className={`admin-audit-severity ${(evento.severidad || 'INFO').toLowerCase()}`}>{evento.severidad || 'INFO'}</span></div>
                <p>{evento.actor?.nombre || 'Sistema'} <span>· {evento.actor?.rol || evento.actor_tipo || 'SISTEMA'} · {evento.entidad}{evento.entidad_id ? ` #${evento.entidad_id}` : ''}</span></p>
                <time>{fechaLegible(evento.fecha)}</time>
              </div>
              <button className="admin-row-action" type="button" aria-label="Ver detalle" onClick={() => setModal({ open: true, evento })}><Eye size={17} /></button>
            </article>
          ))}
        </div>
        {!loading && meta.hasMore && <div className="admin-load-more"><button className="admin-action-button neutral" type="button" onClick={() => cargar({ page: meta.page + 1, append: true })}>Cargar más ({eventos.length}/{meta.total})</button></div>}
      </section>
      <AdminDetalleAuditoriaModal open={modal.open} evento={modal.evento} onCancel={() => setModal({ open: false, evento: null })} />
    </div>
  );
}
