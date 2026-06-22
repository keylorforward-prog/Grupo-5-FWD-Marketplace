import { useCallback, useMemo, useState, useEffect, memo } from 'react';
import { adminService } from '../../services/adminService';
import { useTranslation } from 'react-i18next';
import {
  AlertTriangle,
  Building2,
  Check,
  CheckCircle,
  FileText,
  GraduationCap,
  RotateCcw,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  X,
} from 'lucide-react';
import AdminMotivoModal from './components/AdminMotivoModal';
import { useDebounce } from '../../hooks/useDebounce';

const esUrlDocumento = (valor) => typeof valor === 'string' && /^https?:\/\//i.test(valor);
const esEvidenciaS3Fwd = (valor) => {
  if (!esUrlDocumento(valor)) return false;
  try {
    const url = new URL(valor);
    return url.hostname.includes('.s3.') && url.pathname.startsWith('/titulos_fwd/') && /\.(pdf|png|jpe?g|webp)$/i.test(url.pathname);
  } catch {
    return false;
  }
};

const normalizarTexto = (valor) => (valor || '').toString().trim().toLocaleLowerCase('es-CR');
const compararTexto = (a, b) => normalizarTexto(a).localeCompare(normalizarTexto(b), 'es-CR', { sensitivity: 'base' });
const timestamp = (fecha) => {
  const parsed = new Date(fecha).getTime();
  return Number.isNaN(parsed) ? 0 : parsed;
};

const formatearFecha = (fecha) => {
  if (!fecha) return 'Sin fecha';
  const parsed = new Date(fecha);
  if (Number.isNaN(parsed.getTime())) return 'Sin fecha';
  return parsed.toLocaleDateString('es-CR', { day: '2-digit', month: 'short', year: 'numeric' });
};

const calcularAntiguedad = (fecha) => {
  const registro = timestamp(fecha);
  if (!registro) return 'Sin fecha';
  const dias = Math.max(0, Math.floor((Date.now() - registro) / 86400000));
  if (dias === 0) return 'Hoy';
  if (dias === 1) return '1 día';
  return `${dias} días`;
};

const obtenerIniciales = (nombre, fallback) => {
  if (!nombre) return fallback;
  return nombre
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((parte) => parte[0])
    .join('')
    .toUpperCase();
};

const estadoClase = (estado) => {
  if (estado === 'ACTIVA' || estado === 'VERIFICADO') return 'success';
  if (estado === 'SUSPENDIDA' || estado === 'RECHAZADO') return 'danger';
  return 'warning';
};

const normalizarEgresado = (perfil) => {
  const usuario = perfil.usuario || {};
  const evidenciaValida = esEvidenciaS3Fwd(perfil.titulo_fwd);

  return {
    id: `egresado-${perfil.id_perfil_estudiante}`,
    tipo: 'egresado',
    tipoLabel: 'Egresado',
    icon: GraduationCap,
    idUsuario: perfil.id_usuario,
    nombre: usuario.nombre || 'Egresado FWD',
    correo: usuario.correo,
    cedula: usuario.cedula,
    estado: perfil.estado_verificacion || usuario.estado_cuenta || 'PENDIENTE',
    cuenta: usuario.estado_cuenta || 'PENDIENTE',
    fecha: usuario.fecha_registro,
    fechaActualizacion: perfil.fecha_verificacion || usuario.fecha_registro,
    detalle: 'Verificación de título FWD',
    evidencia: perfil.titulo_fwd,
    evidenciaLabel: 'Título FWD',
    evidenciaValida,
    evidenciaRequerida: true,
    original: perfil,
  };
};

const normalizarEmpresa = (empresa) => ({
  id: `empresa-${empresa.id_usuario}`,
  tipo: 'empresa',
  tipoLabel: 'Empresa',
  icon: Building2,
  idUsuario: empresa.id_usuario,
  nombre: empresa.nombre || 'Empresa',
  correo: empresa.correo,
  cedula: empresa.cedula,
  estado: empresa.estado_cuenta || 'PENDIENTE',
  cuenta: empresa.estado_cuenta || 'PENDIENTE',
  fecha: empresa.fecha_registro,
  fechaActualizacion: empresa.ultimo_acceso || empresa.fecha_registro,
  detalle: empresa.perfil?.sector || empresa.tipo_empresa || 'Perfil empresarial',
  evidencia: empresa.perfil?.cedula_juridica_archivo,
  evidenciaLabel: 'Cédula jurídica',
  evidenciaValida: !empresa.perfil?.cedula_juridica_archivo || esUrlDocumento(empresa.perfil.cedula_juridica_archivo),
  evidenciaRequerida: false,
  sitioWeb: empresa.perfil?.sitio_web,
  original: empresa,
});

const AdminEgresados = memo(function AdminEgresados({ onAdminChange }) {
  const { t } = useTranslation();
  const [egresados, setEgresados] = useState([]);
  const [empresas, setEmpresas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mensaje, setMensaje] = useState(null);
  const [modalRechazo, setModalRechazo] = useState({ open: false, solicitud: null });
  const [procesandoAccion, setProcesandoAccion] = useState(false);
  const [tipoActivo, setTipoActivo] = useState('todos');
  const [filtros, setFiltros] = useState({ busqueda: '', fechaDesde: '', fechaHasta: '' });
  const [orden, setOrden] = useState('oldest');
  const filtrosDebounced = useDebounce(filtros, 220);

  const cargarSolicitudes = useCallback(async () => {
    setLoading(true);
    setMensaje(null);

    try {
      const [resEgresados, resEmpresas] = await Promise.all([
        adminService.getEgresadosPendientes({ page: 1, limit: 100 }),
        adminService.getEmpresas({ estado: 'PENDIENTE', limit: 100 }),
      ]);

      if (resEgresados.success) setEgresados(resEgresados.data || []);
      if (resEmpresas.success) setEmpresas(resEmpresas.data || []);
    } catch (error) {
      console.error('Error cargando verificaciones pendientes', error);
      setMensaje({ tipo: 'error', texto: t('admin.messages.loadVerificationsError') });
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    cargarSolicitudes();
  }, [cargarSolicitudes]);

  const solicitudes = useMemo(() => ([
    ...empresas.map(normalizarEmpresa),
    ...egresados.map(normalizarEgresado),
  ]), [egresados, empresas]);

  const metricas = useMemo(() => ({
    total: solicitudes.length,
    empresas: solicitudes.filter((solicitud) => solicitud.tipo === 'empresa').length,
    egresados: solicitudes.filter((solicitud) => solicitud.tipo === 'egresado').length,
  }), [solicitudes]);

  const cambiarFiltro = (campo, valor) => {
    setFiltros((actuales) => ({ ...actuales, [campo]: valor }));
  };

  const limpiarFiltros = () => {
    setFiltros({ busqueda: '', fechaDesde: '', fechaHasta: '' });
    setTipoActivo('todos');
    setOrden('oldest');
  };

  const solicitudesVisibles = useMemo(() => {
    const texto = normalizarTexto(filtrosDebounced.busqueda);
    const desde = filtrosDebounced.fechaDesde ? new Date(`${filtrosDebounced.fechaDesde}T00:00:00`).getTime() : null;
    const hasta = filtrosDebounced.fechaHasta ? new Date(`${filtrosDebounced.fechaHasta}T23:59:59`).getTime() : null;

    return solicitudes
      .filter((solicitud) => {
        const coincideTipo = tipoActivo === 'todos' || solicitud.tipo === tipoActivo;
        const coincideTexto = !texto || [
          solicitud.nombre,
          solicitud.correo,
          solicitud.cedula,
          solicitud.detalle,
          solicitud.tipoLabel,
        ].some((valor) => normalizarTexto(valor).includes(texto));
        const fecha = timestamp(solicitud.fecha);
        const coincideDesde = !desde || fecha >= desde;
        const coincideHasta = !hasta || fecha <= hasta;
        return coincideTipo && coincideTexto && coincideDesde && coincideHasta;
      })
      .sort((a, b) => {
        switch (orden) {
          case 'newest':
            return timestamp(b.fecha) - timestamp(a.fecha);
          case 'name-asc':
            return compararTexto(a.nombre, b.nombre);
          case 'name-desc':
            return compararTexto(b.nombre, a.nombre);
          case 'type':
            return compararTexto(a.tipoLabel, b.tipoLabel) || compararTexto(a.nombre, b.nombre);
          case 'status':
            return compararTexto(a.estado, b.estado) || timestamp(a.fecha) - timestamp(b.fecha);
          case 'updated':
            return timestamp(b.fechaActualizacion) - timestamp(a.fechaActualizacion);
          case 'oldest':
          default:
            return timestamp(a.fecha) - timestamp(b.fecha);
        }
      });
  }, [filtrosDebounced, orden, solicitudes, tipoActivo]);

  const hayFiltrosActivos = Boolean(
    filtros.busqueda ||
    filtros.fechaDesde ||
    filtros.fechaHasta ||
    tipoActivo !== 'todos' ||
    orden !== 'oldest'
  );

  const aprobarSolicitud = async (solicitud) => {
    try {
      const res = solicitud.tipo === 'empresa'
        ? await adminService.updateEstadoEmpresa(solicitud.idUsuario, 'APROBAR')
        : await adminService.verifyEstudiante(solicitud.idUsuario, 'APROBAR');

      if (res.success) {
        setMensaje({ tipo: 'success', texto: res.message || 'Solicitud aprobada correctamente.' });
        await cargarSolicitudes();
        onAdminChange?.();
      }
    } catch (error) {
      console.error('Error aprobando solicitud', error);
      setMensaje({ tipo: 'error', texto: error.response?.data?.message || 'No se pudo aprobar la solicitud.' });
    }
  };

  const confirmarRechazo = async (motivo) => {
    if (!modalRechazo.solicitud) return;
    setProcesandoAccion(true);

    try {
      const { solicitud } = modalRechazo;
      const res = solicitud.tipo === 'empresa'
        ? await adminService.updateEstadoEmpresa(solicitud.idUsuario, 'SUSPENDER', motivo)
        : await adminService.verifyEstudiante(solicitud.idUsuario, 'RECHAZAR', motivo);

      if (res.success) {
        setMensaje({ tipo: 'success', texto: res.message || 'Solicitud rechazada correctamente.' });
        setModalRechazo({ open: false, solicitud: null });
        await cargarSolicitudes();
        onAdminChange?.();
      }
    } catch (error) {
      console.error('Error rechazando solicitud', error);
      setMensaje({ tipo: 'error', texto: error.response?.data?.message || 'No se pudo rechazar la solicitud.' });
    } finally {
      setProcesandoAccion(false);
    }
  };

  const tabs = [
    { key: 'todos', label: 'Todos', value: metricas.total },
    { key: 'empresa', label: 'Empresas', value: metricas.empresas },
    { key: 'egresado', label: 'Egresados', value: metricas.egresados },
  ];

  return (
    <div className="admin-content admin-verification-page animate-in">
      <section className="admin-kpi-strip">
        <div className="admin-kpi-item">
          <span>Total pendientes</span>
          <strong>{metricas.total}</strong>
        </div>
        <div className="admin-kpi-item">
          <span>Empresas</span>
          <strong>{metricas.empresas}</strong>
        </div>
        <div className="admin-kpi-item">
          <span>Egresados</span>
          <strong>{metricas.egresados}</strong>
        </div>
        <div className="admin-kpi-item">
          <span>Vista activa</span>
          <strong>{solicitudesVisibles.length}</strong>
        </div>
      </section>

      {mensaje && (
        <div className={`admin-config-message ${mensaje.tipo}`}>
          {mensaje.tipo === 'success' ? <CheckCircle size={18} /> : <AlertTriangle size={18} />}
          {mensaje.texto}
        </div>
      )}

      <section className="admin-panel">
        <div className="admin-panel-header">
          <div>
            <h3>Cola de Verificación</h3>
            <span className="admin-review-note">
              {solicitudesVisibles.length} de {solicitudes.length} solicitudes visibles
            </span>
          </div>

          <div className="admin-sort-control">
            <SlidersHorizontal size={16} />
            <select
              className="admin-filter-select"
              value={orden}
              onChange={(event) => setOrden(event.target.value)}
              aria-label="Ordenar verificaciones"
            >
              <option value="oldest">Más antiguos</option>
              <option value="newest">Más recientes</option>
              <option value="name-asc">Nombre (A-Z)</option>
              <option value="name-desc">Nombre (Z-A)</option>
              <option value="type">Tipo de usuario</option>
              <option value="status">Estado</option>
              <option value="updated">Fecha de actualización</option>
            </select>
          </div>
        </div>

        <div className="admin-verification-tabs" aria-label="Filtrar solicitudes por tipo">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              className={`admin-verification-tab ${tipoActivo === tab.key ? 'active' : ''}`}
              type="button"
              onClick={() => setTipoActivo(tab.key)}
            >
              {tab.label}
              <span>{tab.value}</span>
            </button>
          ))}
        </div>

        <div className="admin-queue-filters admin-queue-filters-compact">
          <label className="admin-search admin-filter-field">
            <Search size={18} />
            <input
              type="text"
              placeholder="Buscar por nombre, correo, cédula o detalle"
              value={filtros.busqueda}
              onChange={(event) => cambiarFiltro('busqueda', event.target.value)}
            />
          </label>

          <label className="admin-date-filter">
            <span>Desde</span>
            <input
              type="date"
              value={filtros.fechaDesde}
              onChange={(event) => cambiarFiltro('fechaDesde', event.target.value)}
            />
          </label>

          <label className="admin-date-filter">
            <span>Hasta</span>
            <input
              type="date"
              value={filtros.fechaHasta}
              onChange={(event) => cambiarFiltro('fechaHasta', event.target.value)}
            />
          </label>

          <button className="admin-action-button neutral" type="button" onClick={limpiarFiltros} disabled={!hayFiltrosActivos}>
            <RotateCcw size={14} />
            Limpiar
          </button>
        </div>

        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Solicitud</th>
                <th>Tipo</th>
                <th>Identificación</th>
                <th>Estado</th>
                <th>Fecha solicitud</th>
                <th>Antigüedad</th>
                <th>Evidencia</th>
                <th className="admin-table-actions">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="8" className="admin-muted-cell">Cargando verificaciones...</td></tr>
              ) : solicitudes.length === 0 ? (
                <tr>
                  <td colSpan="8">
                    <div className="admin-empty-inline">
                      <ShieldCheck size={22} />
                      No hay solicitudes pendientes de verificación.
                    </div>
                  </td>
                </tr>
              ) : solicitudesVisibles.length === 0 ? (
                <tr>
                  <td colSpan="8">
                    <div className="admin-empty-inline">
                      <Search size={22} />
                      No hay solicitudes que coincidan con los filtros.
                    </div>
                  </td>
                </tr>
              ) : (
                solicitudesVisibles.map((solicitud) => {
                  const Icon = solicitud.icon;
                  const puedeAprobar = !solicitud.evidenciaRequerida || solicitud.evidenciaValida;

                  return (
                    <tr key={solicitud.id}>
                      <td>
                        <div className="admin-user-cell">
                          <span className="admin-user-avatar">{obtenerIniciales(solicitud.nombre, solicitud.tipo === 'empresa' ? 'EM' : 'EG')}</span>
                          <span>
                            <span className="admin-user-name">{solicitud.nombre}</span>
                            <span className="admin-user-email">{solicitud.correo || 'Sin correo'}</span>
                            <span className="admin-user-email">{solicitud.detalle}</span>
                          </span>
                        </div>
                      </td>
                      <td>
                        <span className={`admin-type-pill ${solicitud.tipo}`}>
                          <Icon size={13} />
                          {solicitud.tipoLabel}
                        </span>
                      </td>
                      <td className="admin-muted-cell">{solicitud.cedula || 'Sin cédula'}</td>
                      <td>
                        <span className={`admin-status-pill ${estadoClase(solicitud.estado)}`}>
                          {solicitud.estado}
                        </span>
                      </td>
                      <td className="admin-muted-cell">{formatearFecha(solicitud.fecha)}</td>
                      <td className="admin-muted-cell">{calcularAntiguedad(solicitud.fecha)}</td>
                      <td>
                        {esUrlDocumento(solicitud.evidencia) ? (
                          <a className="admin-link-button" href={solicitud.evidencia} target="_blank" rel="noreferrer">
                            <FileText size={16} /> {solicitud.evidenciaLabel}
                          </a>
                        ) : (
                          <span className="admin-muted-cell">{solicitud.evidencia || 'Sin evidencia'}</span>
                        )}
                        {solicitud.evidenciaRequerida && !solicitud.evidenciaValida && (
                          <span className="admin-user-email">Evidencia S3 requerida</span>
                        )}
                        {solicitud.sitioWeb && (
                          <a className="admin-user-email" href={solicitud.sitioWeb} target="_blank" rel="noreferrer">
                            Sitio web
                          </a>
                        )}
                      </td>
                      <td className="admin-table-actions">
                        <div className="admin-action-group">
                          <button
                            onClick={() => aprobarSolicitud(solicitud)}
                            className="admin-action-button success"
                            type="button"
                            disabled={!puedeAprobar}
                            title={!puedeAprobar ? 'Primero revisa una evidencia FWD válida en S3' : undefined}
                          >
                            <Check size={14} /> Aprobar
                          </button>
                          <button
                            onClick={() => setModalRechazo({ open: true, solicitud })}
                            className="admin-action-button danger"
                            type="button"
                          >
                            <X size={14} /> Rechazar
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </section>

      <AdminMotivoModal
        open={modalRechazo.open}
        title={`Rechazar ${modalRechazo.solicitud?.tipoLabel?.toLowerCase() || 'solicitud'}`}
        description={`¿Seguro que deseas rechazar la solicitud de ${modalRechazo.solicitud?.nombre || 'este usuario'}?`}
        label="Razón del rechazo"
        placeholder="Describe el motivo..."
        confirmLabel="Confirmar rechazo"
        loading={procesandoAccion}
        onCancel={() => setModalRechazo({ open: false, solicitud: null })}
        onConfirm={confirmarRechazo}
      />
    </div>
  );
});

export default AdminEgresados;
