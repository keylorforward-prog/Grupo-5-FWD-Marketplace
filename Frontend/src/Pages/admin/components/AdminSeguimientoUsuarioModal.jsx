import { Activity, FileText, FolderKanban, MessageSquare, ShieldCheck, X } from 'lucide-react';

export default function AdminSeguimientoUsuarioModal({ open, loading, detalle, onClose }) {
  if (!open) return null;
  const usuario = detalle?.usuario;
  const actividad = detalle?.actividad || {};
  const indicadores = [
    ['Proyectos', actividad.proyectosRelacionados || 0, FolderKanban],
    ['Postulaciones', actividad.postulaciones || 0, Activity],
    ['Mensajes', actividad.mensajes || 0, MessageSquare],
    ['Archivos', actividad.archivos || 0, FileText],
    ['Reportes', actividad.reportes || 0, ShieldCheck],
  ];

  return (
    <div className="admin-modal-backdrop" role="presentation" onMouseDown={onClose}>
      <section className="admin-modal admin-followup-modal" role="dialog" aria-modal="true" aria-label="Seguimiento del usuario" onMouseDown={(event) => event.stopPropagation()}>
        <header className="admin-followup-header">
          <div><span>Seguimiento integral</span><h3>{usuario?.nombre || 'Cargando usuario…'}</h3><p>{usuario?.correo || 'Actividad, relaciones y trazabilidad administrativa'}</p></div>
          <button className="admin-modal-close" type="button" onClick={onClose} aria-label="Cerrar"><X size={18} /></button>
        </header>
        {loading ? <div className="admin-followup-empty">Cargando seguimiento…</div> : !detalle ? <div className="admin-followup-empty">No fue posible cargar el seguimiento.</div> : <>
          <div className="admin-followup-metrics">{indicadores.map(([label, value, Icon]) => <div key={label}><Icon size={17} /><span>{label}</span><strong>{value}</strong></div>)}</div>
          <div className="admin-followup-body">
            <h4>Historial reciente</h4>
            {(detalle.auditoria || []).length === 0 ? <p className="admin-muted-cell">Sin eventos registrados.</p> : (detalle.auditoria || []).map((evento) => <article key={evento.id_auditoria}><span><ShieldCheck size={15} /></span><div><strong>{evento.accion}</strong><p>{evento.entidad}{evento.entidad_id ? ` #${evento.entidad_id}` : ''}</p><time>{new Date(evento.fecha).toLocaleString('es-CR')}</time></div></article>)}
          </div>
        </>}
      </section>
    </div>
  );
}
