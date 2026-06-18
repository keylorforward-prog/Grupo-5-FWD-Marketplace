import { useCallback, useMemo, useState, useEffect, memo } from 'react';
import { adminService } from '../../services/adminService';
import { useTranslation } from 'react-i18next';
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
import AdminExportButton from './components/AdminExportButton';
import { useDebounce } from '../../hooks/useDebounce';

const PAGE_SIZE = 25;

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

const AdminEmpresas = memo(function AdminEmpresas({ onAdminChange }) {
  const { t } = useTranslation();
  const [empresas, setEmpresas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const [filtroEstado, setFiltroEstado] = useState('TODAS');
  const [meta, setMeta] = useState({ page: 1, total: 0, hasMore: false });
  const [mensaje, setMensaje] = useState(null);
  const [modalSuspension, setModalSuspension] = useState({ open: false, empresa: null });
  const [procesandoAccion, setProcesandoAccion] = useState(false);

  const cargarEmpresas = useCallback(async ({ page = 1, append = false, mostrarCarga = true } = {}) => {
    if (mostrarCarga) setLoading(true);
    setMensaje(null);

    try {
      const response = await adminService.getEmpresas({
        page,
        limit: PAGE_SIZE,
        search: debouncedSearchTerm.trim() || undefined,
        estado: filtroEstado,
      });
      if (response.success) {
        setEmpresas((actuales) => (append ? [...actuales, ...response.data] : response.data));
        setMeta(response.meta || { page, total: response.data.length, hasMore: false });
        return true;
      }
    } catch (error) {
      console.error('Error cargando empresas', error);
      setMensaje({ tipo: 'error', texto: t('admin.messages.loadCompaniesError') });
      return false;
    } finally {
      if (mostrarCarga) setLoading(false);
    }
    return false;
  }, [debouncedSearchTerm, filtroEstado, t]);

  useEffect(() => {
    cargarEmpresas({ page: 1 });
  }, [cargarEmpresas]);

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
        await cargarEmpresas({ page: 1, mostrarCarga: false });
        onAdminChange?.();
        return true;
      }
    } catch (error) {
      console.error('Error actualizando empresa', error);
      setMensaje({ tipo: 'error', texto: error.response?.data?.message || t('admin.messages.companyUpdateError') });
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
      <div className="admin-module-heading" style={{ justifyContent: 'flex-end' }}>


        <div className="admin-action-group">
          <button className="admin-action-button neutral" type="button" onClick={() => cargarEmpresas({ page: 1 })}>
            <RotateCcw size={14} />
            {t('admin.dashboard.update')}
          </button>
          <AdminExportButton tipo="empresas" />
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
          <span>{t('admin.companies.totalCompanies')}</span>
          <strong>{metricas.total}</strong>
        </div>
        <div className="admin-kpi-item">
          <span>{t('admin.companies.pending')}</span>
          <strong>{metricas.pendientes}</strong>
        </div>
        <div className="admin-kpi-item">
          <span>{t('admin.companies.active')}</span>
          <strong>{metricas.activas}</strong>
        </div>
        <div className="admin-kpi-item">
          <span>{t('admin.companies.suspended')}</span>
          <strong>{metricas.suspendidas}</strong>
        </div>
      </section>

      <section className="admin-panel">
        <div className="admin-panel-header">
          <div className="admin-search">
            <Search size={18} />
            <input
              type="text"
              placeholder={t('admin.companies.searchPlaceholder')}
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
                {estado === 'TODAS' ? t('admin.companies.filterAll') : 
                 estado === 'PENDIENTE' ? t('admin.companies.filterPending') : 
                 estado === 'ACTIVA' ? t('admin.companies.filterActive') : 
                 t('admin.companies.filterSuspended')}
              </button>
            ))}
          </div>
        </div>

        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>{t('admin.companies.tableCompany')}</th>
                <th>{t('admin.companies.tableSector')}</th>
                <th>{t('admin.companies.tableStatus')}</th>
                <th>{t('admin.companies.tableProjects')}</th>
                <th>{t('admin.companies.tableRegistration')}</th>
                <th>{t('admin.companies.tableLegalDocument')}</th>
                <th className="admin-table-actions">{t('admin.companies.tableActions')}</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="7" className="admin-muted-cell">{t('admin.companies.loadingCompanies')}</td></tr>
              ) : empresas.length === 0 ? (
                <tr>
                  <td colSpan="7">
                    <div className="admin-empty-inline">
                      <Building2 size={22} />
                      {t('admin.companies.noCompaniesFound')}
                    </div>
                  </td>
                </tr>
              ) : (
                empresas.map((empresa) => (
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
                      {empresa.perfil?.sector || empresa.tipo_empresa || t('admin.companies.withoutSector')}
                    </td>
                    <td>
                      <span className={`admin-status-pill ${estadoClase(empresa.estado_cuenta)}`}>
                        {empresa.estado_cuenta}
                      </span>
                    </td>
                    <td>
                      <div className="admin-company-metrics">
                        <span>{empresa.metricas?.totalProyectos || 0} {t('admin.companies.total')}</span>
                        <span>{empresa.metricas?.proyectosActivos || 0} {t('admin.companies.activePlural')}</span>
                        <span>{empresa.metricas?.proyectosCerrados || 0} {t('admin.companies.closed')}</span>
                      </div>
                    </td>
                    <td className="admin-muted-cell">{formatearFecha(empresa.fecha_registro)}</td>
                    <td>
                      {esUrlDocumento(empresa.perfil?.cedula_juridica_archivo) ? (
                        <a className="admin-link-button" href={empresa.perfil.cedula_juridica_archivo} target="_blank" rel="noreferrer">
                          <FileText size={16} /> {t('admin.companies.viewDocument')}
                        </a>
                      ) : (
                        <span className="admin-muted-cell">{t('admin.companies.withoutDocument')}</span>
                      )}
                      {empresa.perfil?.sitio_web && (
                        <a className="admin-link-button admin-link-secondary" href={empresa.perfil.sitio_web} target="_blank" rel="noreferrer">
                          <ExternalLink size={15} /> {t('admin.companies.site')}
                        </a>
                      )}
                    </td>
                    <td className="admin-table-actions">
                      <div className="admin-action-group">
                        {empresa.estado_cuenta === 'PENDIENTE' && (
                          <button className="admin-action-button success" type="button" onClick={() => cambiarEstado(empresa, 'APROBAR')}>
                            <CheckCircle size={14} />
                            {t('admin.companies.approve')}
                          </button>
                        )}
                        {empresa.estado_cuenta === 'SUSPENDIDA' ? (
                          <button className="admin-action-button success" type="button" onClick={() => cambiarEstado(empresa, 'REACTIVAR')}>
                            <Power size={14} />
                            {t('admin.companies.reactivate')}
                          </button>
                        ) : (
                          <button className="admin-action-button danger" type="button" onClick={() => abrirSuspension(empresa)}>
                            <AlertTriangle size={14} />
                            {t('admin.companies.suspend')}
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
        {!loading && meta.hasMore && (
          <div className="admin-load-more">
            <button className="admin-action-button neutral" type="button" onClick={() => cargarEmpresas({ page: meta.page + 1, append: true, mostrarCarga: false })}>
              Cargar más ({empresas.length}/{meta.total})
            </button>
          </div>
        )}
      </section>

      <AdminMotivoModal
        open={modalSuspension.open}
        title={t('admin.companies.suspendCompanyTitle')}
        description={t('admin.companies.suspendCompanyDesc', { name: modalSuspension.empresa?.nombre || 'esta empresa' })}
        label={t('admin.companies.suspendReasonLabel')}
        placeholder={t('admin.companies.suspendReasonPlaceholder')}
        confirmLabel={t('admin.companies.suspendCompanyConfirm')}
        loading={procesandoAccion}
        onCancel={() => setModalSuspension({ open: false, empresa: null })}
        onConfirm={confirmarSuspension}
      />
    </div>
  );
});

export default AdminEmpresas;
