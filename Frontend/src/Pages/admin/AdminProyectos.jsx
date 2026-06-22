import { useCallback, useState, useEffect, memo } from 'react';
import { adminService } from '../../services/adminService';
import { useTranslation } from 'react-i18next';
import {
  AlertTriangle,
  FolderKanban,
  CheckCircle,
  RotateCcw,
  Search,
} from 'lucide-react';
import { useDebounce } from '../../hooks/useDebounce';

const PAGE_SIZE = 25;

const formatearFecha = (fecha) => {
  if (!fecha) return 'Sin fecha';
  const parsed = new Date(fecha);
  if (Number.isNaN(parsed.getTime())) return 'Sin fecha';
  return parsed.toLocaleDateString('es-CR', { day: '2-digit', month: 'short', year: 'numeric' });
};

const estadoClase = (estado) => {
  if (estado === 'ACTIVA') return 'success';
  if (estado === 'CERRADA' || estado === 'CANCELADA') return 'danger';
  return 'warning';
};

const AdminProyectos = memo(function AdminProyectos({ onAdminChange }) {
  const { t } = useTranslation();
  const [proyectos, setProyectos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const [meta, setMeta] = useState({ page: 1, total: 0, hasMore: false });
  const [mensaje, setMensaje] = useState(null);

  const cargarProyectos = useCallback(async ({ page = 1, append = false, mostrarCarga = true } = {}) => {
    if (mostrarCarga) setLoading(true);
    setMensaje(null);

    try {
      const response = await adminService.getProyectos({
        page,
        limit: PAGE_SIZE,
        search: debouncedSearchTerm.trim() || undefined,
      });
      if (response.success) {
        setProyectos((actuales) => (append ? [...actuales, ...response.data] : response.data));
        setMeta(response.meta || { page, total: response.data.length, hasMore: false });
        return true;
      }
    } catch (error) {
      console.error('Error cargando proyectos', error);
      setMensaje({ tipo: 'error', texto: 'Error al cargar los proyectos' });
      return false;
    } finally {
      if (mostrarCarga) setLoading(false);
    }
    return false;
  }, [debouncedSearchTerm]);

  useEffect(() => {
    cargarProyectos({ page: 1 });
  }, [cargarProyectos]);

  return (
    <div className="admin-content animate-in">
      <div className="admin-module-heading" style={{ justifyContent: 'flex-end' }}>
        <div className="admin-action-group">
          <button className="admin-action-button neutral" type="button" onClick={() => cargarProyectos({ page: 1 })}>
            <RotateCcw size={14} />
            {t('admin.dashboard.update')}
          </button>
        </div>
      </div>

      {mensaje && (
        <div className={`admin-config-message ${mensaje.tipo}`}>
          {mensaje.tipo === 'success' ? <CheckCircle size={18} /> : <AlertTriangle size={18} />}
          {mensaje.texto}
        </div>
      )}

      <section className="admin-panel">
        <div className="admin-panel-header">
          <div className="admin-search">
            <Search size={18} />
            <input
              type="text"
              placeholder="Buscar proyecto por título..."
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
          </div>
        </div>

        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Nombre del proyecto</th>
                <th>Nombre del creador</th>
                <th>Estado</th>
                <th>Tecnologías</th>
                <th>Fecha de creación</th>
                <th>Postulaciones</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="6" className="admin-muted-cell">Cargando proyectos...</td></tr>
              ) : proyectos.length === 0 ? (
                <tr>
                  <td colSpan="6">
                    <div className="admin-empty-inline">
                      <FolderKanban size={22} />
                      No se encontraron proyectos.
                    </div>
                  </td>
                </tr>
              ) : (
                proyectos.map((proyecto) => (
                  <tr key={proyecto.id_proyecto}>
                    <td>
                      <div className="admin-user-cell">
                        <span>
                          <strong>{proyecto.titulo}</strong>
                        </span>
                      </div>
                    </td>
                    <td>{proyecto.creador}</td>
                    <td>
                      <span className={`admin-status-pill ${estadoClase(proyecto.estado)}`}>
                        {proyecto.estado}
                      </span>
                    </td>
                    <td>
                      {proyecto.tecnologias && proyecto.tecnologias.length > 0 ? (
                        <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                          {proyecto.tecnologias.map((tech, i) => (
                            <span key={i} className="admin-status-pill neutral" style={{ fontSize: '10px', padding: '2px 6px' }}>
                              {tech}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="admin-muted-cell">Ninguna</span>
                      )}
                    </td>
                    <td className="admin-muted-cell">{formatearFecha(proyecto.fecha_creacion)}</td>
                    <td>
                      <div className="admin-company-metrics">
                        <span>{proyecto.cantidad_egresados} {proyecto.cantidad_egresados === 1 ? 'prototipo' : 'prototipos'}</span>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {!loading && meta.hasMore && (
          <div className="admin-load-more">
            <button className="admin-action-button neutral" type="button" onClick={() => cargarProyectos({ page: meta.page + 1, append: true, mostrarCarga: false })}>
              Cargar más ({proyectos.length}/{meta.total})
            </button>
          </div>
        )}
      </section>
    </div>
  );
});

export default AdminProyectos;
