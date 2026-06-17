import { useMemo, useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import {
  AlertTriangle,
  Building2,
  CheckCircle,
  ExternalLink,
  FileText,
  Power,
  RotateCcw,
  Search,
} from 'lucide-react';
import AdminMotivoModal from './components/AdminMotivoModal';

const esUrlDocumento = (valor) => typeof valor === 'string' && /^https?:\/\//i.test(valor);

const formatearFecha = (fecha) => {
  if (!fecha) return 'Sin fecha';
  const parsed = new Date(fecha);
  if (Number.isNaN(parsed.getTime())) return 'Sin fecha';
  return parsed.toLocaleDateString('es-CR', { day: '2-digit', month: 'short', year: 'numeric' });
};

const obtenerIniciales = (nombre) => {
  if (!nombre) return 'EM';
  return nombre
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((parte) => parte[0])
    .join('')
    .toUpperCase();
};

const estadoClase = (estado) => {
  if (estado === 'ACTIVA') return 'success';
  if (estado === 'SUSPENDIDA') return 'danger';
  return 'warning';
};

export default function AdminEmpresas({ onAdminChange }) {
  const [empresas, setEmpresas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('TODAS');
  const [mensaje, setMensaje] = useState(null);
  const [modalSuspension, setModalSuspension] = useState({ open: false, empresa: null });
  const [procesandoAccion, setProcesandoAccion] = useState(false);

  const cargarEmpresas = async ({ mostrarCarga = true } = {}) => {
    if (mostrarCarga) setLoading(true);
    setMensaje(null);

    try {
      const response = await adminService.getEmpresas();
      if (response.success) {
        setEmpresas(response.data);
        return true;
      }
    } catch (error) {
      console.error('Error cargando empresas', error);
      setMensaje({ tipo: 'error', texto: 'No se pudo cargar el modulo de empresas.' });
      return false;
    } finally {
      if (mostrarCarga) setLoading(false);
    }
    return false;
  };

  useEffect(() => {
    let cancelado = false;

    adminService.getEmpresas()
      .then((response) => {
        if (!cancelado && response.success) {
          setEmpresas(response.data);
        }
      })
      .catch((error) => {
        console.error('Error cargando empresas', error);
        if (!cancelado) {
          setMensaje({ tipo: 'error', texto: 'No se pudo cargar el modulo de empresas.' });
        }
      })
      .finally(() => {
        if (!cancelado) setLoading(false);
      });

    return () => {
      cancelado = true;
    };
  }, []);

  const empresasFiltradas = useMemo(() => {
    const termino = searchTerm.trim().toLowerCase();

    return empresas.filter((empresa) => {
      const coincideEstado = filtroEstado === 'TODAS' || empresa.estado_cuenta === filtroEstado;
      const coincideBusqueda = !termino
        || empresa.nombre?.toLowerCase().includes(termino)
        || empresa.correo?.toLowerCase().includes(termino)
        || empresa.cedula?.toLowerCase().includes(termino)
        || empresa.perfil?.sector?.toLowerCase().includes(termino);

      return coincideEstado && coincideBusqueda;
    });
  }, [empresas, filtroEstado, searchTerm]);

  const metricas = useMemo(() => ({
    total: empresas.length,
    pendientes: empresas.filter((empresa) => empresa.estado_cuenta === 'PENDIENTE').length,
    activas: empresas.filter((empresa) => empresa.estado_cuenta === 'ACTIVA').length,
    suspendidas: empresas.filter((empresa) => empresa.estado_cuenta === 'SUSPENDIDA').length,
  }), [empresas]);

  const cambiarEstado = async (empresa, accion, motivo = null) => {
    try {
      const response = await adminService.updateEstadoEmpresa(empresa.id_usuario, accion, motivo);
      if (response.success) {
        setMensaje({ tipo: 'success', texto: response.message });
        await cargarEmpresas({ mostrarCarga: false });
        onAdminChange?.();
        return true;
      }
    } catch (error) {
      console.error('Error actualizando empresa', error);
      setMensaje({ tipo: 'error', texto: error.response?.data?.message || 'No se pudo actualizar la empresa.' });
      return false;
    }
    return false;
  };

  const abrirSuspension = (empresa) => {
    setModalSuspension({ open: true, empresa });
  };

  const confirmarSuspension = async (motivo) => {
    if (!modalSuspension.empresa) return;
    setProcesandoAccion(true);

    try {
      const actualizado = await cambiarEstado(modalSuspension.empresa, 'SUSPENDER', motivo);
      if (actualizado) {
        setModalSuspension({ open: false, empresa: null });
      }
    } finally {
      setProcesandoAccion(false);
    }
  };

  return (
    <div className="admin-content animate-in">
      <div className="admin-module-heading">
        <div>
          <h3>Gestion de empresas</h3>
          <p className="admin-module-subtitle">
            Revisa perfiles empresariales, documentos legales y actividad de publicacion.
          </p>
        </div>

        <div className="admin-action-group">
          <button className="admin-action-button neutral" type="button" onClick={() => cargarEmpresas()}>
            <RotateCcw size={14} />
            Actualizar
          </button>
        </div>
      </div>

      {mensaje && (
        <div className={`admin-config-message ${mensaje.tipo}`}>
          {mensaje.tipo === 'success' ? <CheckCircle size={18} /> : <AlertTriangle size={18} />}
          {mensaje.texto}
        </div>
      )}

      <section className="admin-kpi-strip">
        <div className="admin-kpi-item">
          <span>Total empresas</span>
          <strong>{metricas.total}</strong>
        </div>
        <div className="admin-kpi-item">
          <span>Pendientes</span>
          <strong>{metricas.pendientes}</strong>
        </div>
        <div className="admin-kpi-item">
          <span>Activas</span>
          <strong>{metricas.activas}</strong>
        </div>
        <div className="admin-kpi-item">
          <span>Suspendidas</span>
          <strong>{metricas.suspendidas}</strong>
        </div>
      </section>

      <section className="admin-panel">
        <div className="admin-panel-header">
          <div className="admin-search">
            <Search size={18} />
            <input
              type="text"
              placeholder="Buscar empresa..."
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
          </div>

          <div className="admin-filter-tabs" aria-label="Filtrar empresas por estado">
            {['TODAS', 'PENDIENTE', 'ACTIVA', 'SUSPENDIDA'].map((estado) => (
              <button
                key={estado}
                className={`admin-filter-tab ${filtroEstado === estado ? 'active' : ''}`}
                type="button"
                onClick={() => setFiltroEstado(estado)}
              >
                {estado}
              </button>
            ))}
          </div>
        </div>

        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Empresa</th>
                <th>Sector</th>
                <th>Estado</th>
                <th>Proyectos</th>
                <th>Registro</th>
                <th>Documento legal</th>
                <th className="admin-table-actions">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="7" className="admin-muted-cell">Cargando empresas...</td></tr>
              ) : empresasFiltradas.length === 0 ? (
                <tr>
                  <td colSpan="7">
                    <div className="admin-empty-inline">
                      <Building2 size={22} />
                      No hay empresas con ese filtro.
                    </div>
                  </td>
                </tr>
              ) : (
                empresasFiltradas.map((empresa) => (
                  <tr key={empresa.id_usuario}>
                    <td>
                      <div className="admin-user-cell">
                        <span className="admin-user-avatar">{obtenerIniciales(empresa.nombre)}</span>
                        <span>
                          {empresa.nombre}
                          <span className="admin-user-email">{empresa.correo}</span>
                          <span className="admin-user-email">{empresa.cedula}</span>
                        </span>
                      </div>
                    </td>
                    <td className="admin-muted-cell">
                      {empresa.perfil?.sector || empresa.tipo_empresa || 'Sin sector'}
                    </td>
                    <td>
                      <span className={`admin-status-pill ${estadoClase(empresa.estado_cuenta)}`}>
                        {empresa.estado_cuenta}
                      </span>
                    </td>
                    <td>
                      <div className="admin-company-metrics">
                        <span>{empresa.metricas?.totalProyectos || 0} total</span>
                        <span>{empresa.metricas?.proyectosActivos || 0} activos</span>
                        <span>{empresa.metricas?.proyectosCerrados || 0} cerrados</span>
                      </div>
                    </td>
                    <td className="admin-muted-cell">{formatearFecha(empresa.fecha_registro)}</td>
                    <td>
                      {esUrlDocumento(empresa.perfil?.cedula_juridica_archivo) ? (
                        <a className="admin-link-button" href={empresa.perfil.cedula_juridica_archivo} target="_blank" rel="noreferrer">
                          <FileText size={16} /> Ver documento
                        </a>
                      ) : (
                        <span className="admin-muted-cell">Sin documento</span>
                      )}
                      {empresa.perfil?.sitio_web && (
                        <a className="admin-link-button admin-link-secondary" href={empresa.perfil.sitio_web} target="_blank" rel="noreferrer">
                          <ExternalLink size={15} /> Sitio
                        </a>
                      )}
                    </td>
                    <td className="admin-table-actions">
                      <div className="admin-action-group">
                        {empresa.estado_cuenta === 'PENDIENTE' && (
                          <button className="admin-action-button success" type="button" onClick={() => cambiarEstado(empresa, 'APROBAR')}>
                            <CheckCircle size={14} />
                            Aprobar
                          </button>
                        )}
                        {empresa.estado_cuenta === 'SUSPENDIDA' ? (
                          <button className="admin-action-button success" type="button" onClick={() => cambiarEstado(empresa, 'REACTIVAR')}>
                            <Power size={14} />
                            Reactivar
                          </button>
                        ) : (
                          <button className="admin-action-button danger" type="button" onClick={() => abrirSuspension(empresa)}>
                            <AlertTriangle size={14} />
                            Suspender
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      <AdminMotivoModal
        open={modalSuspension.open}
        title="Suspender empresa"
        description={`Estas por suspender a ${modalSuspension.empresa?.nombre || 'esta empresa'}. Indica el motivo para dejar trazabilidad administrativa.`}
        label="Motivo de suspension"
        placeholder="Ej. Documento legal invalido, comportamiento abusivo, incumplimiento de condiciones..."
        confirmLabel="Suspender empresa"
        loading={procesandoAccion}
        onCancel={() => setModalSuspension({ open: false, empresa: null })}
        onConfirm={confirmarSuspension}
      />
    </div>
  );
}
