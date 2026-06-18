import { useCallback, useEffect, useState } from 'react';
import { AlertTriangle, CheckCircle, Search } from 'lucide-react';
import { adminService } from '../../services/adminService';
import AdminExportButton from './components/AdminExportButton';
import { useDebounce } from '../../hooks/useDebounce';

const PAGE_SIZE = 25;

export default function AdminReportes({ onAdminChange }) {
  const [reportes, setReportes] = useState([]);
  const [meta, setMeta] = useState({ page: 1, total: 0, hasMore: false });
  const [estado, setEstado] = useState('PENDIENTE');
  const [search, setSearch] = useState('');
  const searchDebounced = useDebounce(search, 300);
  const [loading, setLoading] = useState(true);
  const [mensaje, setMensaje] = useState(null);
  const [comentarios, setComentarios] = useState({});
  const [seleccionados, setSeleccionados] = useState([]);

  const cargar = useCallback(async ({ page = 1, append = false } = {}) => {
    setLoading(page === 1);
    try {
      const res = await adminService.getReportes({
        page,
        limit: PAGE_SIZE,
        estado,
        search: searchDebounced || undefined,
      });
      if (res.success) {
        setReportes((actuales) => (append ? [...actuales, ...res.data] : res.data));
        setMeta(res.meta || { page, total: res.data.length, hasMore: false });
        if (!append) setSeleccionados([]);
      }
    } catch (error) {
      setMensaje({ tipo: 'error', texto: error.response?.data?.message || 'No se pudieron cargar los reportes.' });
    } finally {
      setLoading(false);
    }
  }, [estado, searchDebounced]);

  useEffect(() => {
    cargar({ page: 1 });
  }, [cargar]);

  const resolver = async (reporte, nuevoEstado) => {
    const comentario = comentarios[reporte.id_reporte]?.trim() || `Marcado como ${nuevoEstado.toLowerCase()}`;
    try {
      const res = await adminService.resolverReporte(reporte.id_reporte, {
        estado: nuevoEstado,
        comentario_admin: comentario,
      });
      if (res.success) {
        setMensaje({ tipo: 'success', texto: res.message });
        await cargar({ page: 1 });
        onAdminChange?.();
      }
    } catch (error) {
      setMensaje({ tipo: 'error', texto: error.response?.data?.message || 'No se pudo resolver el reporte.' });
    }
  };

  const marcarSeleccionadosRevisados = async () => {
    try {
      const res = await adminService.accionesMasivas({
        tipo: 'MARCAR_REPORTES_REVISADOS',
        ids: seleccionados,
        motivo: 'Revision masiva desde admin'
      });
      if (res.success) {
        setMensaje({ tipo: 'success', texto: res.message });
        await cargar({ page: 1 });
        onAdminChange?.();
      }
    } catch (error) {
      setMensaje({ tipo: 'error', texto: error.response?.data?.message || 'No se pudo ejecutar la accion masiva.' });
    }
  };

  return (
    <div className="admin-content animate-in">
      <div className="admin-module-heading">
        <div className="admin-search">
          <Search size={18} />
          <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar reportes..." />
        </div>
        <div className="admin-action-group">
          <select className="admin-filter-select" value={estado} onChange={(event) => setEstado(event.target.value)}>
            <option value="TODOS">Todos</option>
            <option value="PENDIENTE">Pendientes</option>
            <option value="REVISADO">Revisados</option>
            <option value="RESUELTO">Resueltos</option>
          </select>
          <AdminExportButton tipo="reportes" />
        </div>
      </div>

      {mensaje && (
        <div className={`admin-config-message ${mensaje.tipo}`}>
          {mensaje.tipo === 'success' ? <CheckCircle size={18} /> : <AlertTriangle size={18} />}
          {mensaje.texto}
        </div>
      )}

      {seleccionados.length > 0 && (
        <div className="admin-bulk-bar">
          <span>{seleccionados.length} seleccionados</span>
          <button className="admin-action-button neutral" type="button" onClick={() => setSeleccionados([])}>Limpiar</button>
          <button className="admin-action-button success" type="button" onClick={marcarSeleccionadosRevisados}>Marcar revisados</button>
        </div>
      )}

      <section className="admin-panel">
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th></th>
                <th>Reporte</th>
                <th>Usuario</th>
                <th>Estado</th>
                <th>Comentario admin</th>
                <th className="admin-table-actions">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="6" className="admin-muted-cell">Cargando reportes...</td></tr>
              ) : reportes.length === 0 ? (
                <tr><td colSpan="6" className="admin-muted-cell">No hay reportes.</td></tr>
              ) : reportes.map((reporte) => (
                <tr key={reporte.id_reporte}>
                  <td>
                    <input
                      type="checkbox"
                      checked={seleccionados.includes(reporte.id_reporte)}
                      onChange={(event) => setSeleccionados((actuales) => (
                        event.target.checked
                          ? [...actuales, reporte.id_reporte]
                          : actuales.filter((id) => id !== reporte.id_reporte)
                      ))}
                    />
                  </td>
                  <td>
                    <strong>{reporte.tipo} · {reporte.motivo}</strong>
                    <span className="admin-user-email">{reporte.descripcion}</span>
                    <span className="admin-user-email">{new Date(reporte.fecha_reporte).toLocaleString('es-CR')}</span>
                  </td>
                  <td>{reporte.usuario?.nombre || `Usuario ${reporte.id_usuario}`}</td>
                  <td><span className={`admin-status-pill ${reporte.estado === 'RESUELTO' ? 'success' : reporte.estado === 'REVISADO' ? 'warning' : 'danger'}`}>{reporte.estado}</span></td>
                  <td>
                    <input
                      className="admin-inline-input"
                      value={comentarios[reporte.id_reporte] || ''}
                      onChange={(event) => setComentarios((actual) => ({ ...actual, [reporte.id_reporte]: event.target.value }))}
                      placeholder="Comentario de resolución"
                    />
                  </td>
                  <td className="admin-table-actions">
                    <div className="admin-action-group">
                      <button className="admin-action-button neutral" type="button" onClick={() => resolver(reporte, 'REVISADO')}>Revisado</button>
                      <button className="admin-action-button success" type="button" onClick={() => resolver(reporte, 'RESUELTO')}>Resolver</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {!loading && meta.hasMore && (
          <div className="admin-load-more">
            <button className="admin-action-button neutral" type="button" onClick={() => cargar({ page: meta.page + 1, append: true })}>
              Cargar más ({reportes.length}/{meta.total})
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
