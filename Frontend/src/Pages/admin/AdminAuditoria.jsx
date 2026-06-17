import { useCallback, useEffect, useState } from 'react';
import { Eye, Search, ShieldCheck } from 'lucide-react';
import { adminService } from '../../services/adminService';
import AdminDetalleAuditoriaModal from './components/AdminDetalleAuditoriaModal';
import AdminExportButton from './components/AdminExportButton';
import { useDebounce } from '../../hooks/useDebounce';

const PAGE_SIZE = 25;

export default function AdminAuditoria() {
  const [eventos, setEventos] = useState([]);
  const [meta, setMeta] = useState({ page: 1, total: 0, hasMore: false });
  const [loading, setLoading] = useState(true);
  const [accion, setAccion] = useState('');
  const accionDebounced = useDebounce(accion, 300);
  const [entidad, setEntidad] = useState('');
  const [modal, setModal] = useState({ open: false, evento: null });

  const cargar = useCallback(async ({ page = 1, append = false } = {}) => {
    setLoading(page === 1);
    try {
      const res = await adminService.getAuditoria({
        page,
        limit: PAGE_SIZE,
        accion: accionDebounced || undefined,
        entidad: entidad || undefined,
      });
      if (res.success) {
        setEventos((actuales) => (append ? [...actuales, ...res.data] : res.data));
        setMeta(res.meta || { page, total: res.data.length, hasMore: false });
      }
    } finally {
      setLoading(false);
    }
  }, [accionDebounced, entidad]);

  useEffect(() => {
    cargar({ page: 1 });
  }, [cargar]);

  return (
    <div className="admin-content animate-in">
      <div className="admin-module-heading">
        <div className="admin-search">
          <Search size={18} />
          <input value={accion} onChange={(event) => setAccion(event.target.value)} placeholder="Buscar acción..." />
        </div>
        <div className="admin-action-group">
          <select className="admin-filter-select" value={entidad} onChange={(event) => setEntidad(event.target.value)}>
            <option value="">Todas las entidades</option>
            <option value="Usuario">Usuario</option>
            <option value="PerfilEstudiante">PerfilEstudiante</option>
            <option value="Reporte">Reporte</option>
            <option value="Configuracion">Configuracion</option>
          </select>
          <AdminExportButton tipo="auditoria" />
        </div>
      </div>

      <section className="admin-panel">
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Actor</th>
                <th>Acción</th>
                <th>Entidad</th>
                <th>Fecha</th>
                <th className="admin-table-actions">Detalle</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="5" className="admin-muted-cell">Cargando auditoría...</td></tr>
              ) : eventos.length === 0 ? (
                <tr><td colSpan="5" className="admin-muted-cell">No hay eventos.</td></tr>
              ) : eventos.map((evento) => (
                <tr key={evento.id_auditoria}>
                  <td>
                    <div className="admin-user-cell">
                      <span className="admin-user-avatar"><ShieldCheck size={14} /></span>
                      <span>{evento.actor?.nombre || 'Sistema'}<span className="admin-user-email">{evento.actor?.correo || 'Sin actor'}</span></span>
                    </div>
                  </td>
                  <td>{evento.accion}</td>
                  <td className="admin-muted-cell">{evento.entidad}</td>
                  <td className="admin-muted-cell">{new Date(evento.fecha).toLocaleString('es-CR')}</td>
                  <td className="admin-table-actions">
                    <button className="admin-row-action" type="button" onClick={() => setModal({ open: true, evento })}>
                      <Eye size={17} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {!loading && meta.hasMore && (
          <div className="admin-load-more">
            <button className="admin-action-button neutral" type="button" onClick={() => cargar({ page: meta.page + 1, append: true })}>
              Cargar más ({eventos.length}/{meta.total})
            </button>
          </div>
        )}
      </section>

      <AdminDetalleAuditoriaModal open={modal.open} evento={modal.evento} onCancel={() => setModal({ open: false, evento: null })} />
    </div>
  );
}
