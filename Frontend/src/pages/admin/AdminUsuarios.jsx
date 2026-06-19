import { useCallback, useState, useEffect, memo } from 'react';
import { adminService } from '../../services/adminService';
import { useTranslation } from 'react-i18next';
import { Search, AlertTriangle, CheckCircle, Pencil } from 'lucide-react';
import AdminMotivoModal from './components/AdminMotivoModal';
import AdminUsuarioModal from './components/AdminUsuarioModal';
import AdminExportButton from './components/AdminExportButton';
import { useDebounce } from '../../hooks/useDebounce';

const PAGE_SIZE = 25;

const AdminUsuarios = memo(function AdminUsuarios({ onAdminChange }) {
  const { t } = useTranslation();
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const [filtroRol, setFiltroRol] = useState('TODOS');
  const [filtroEstado, setFiltroEstado] = useState('TODOS');
  const [meta, setMeta] = useState({ page: 1, total: 0, hasMore: false });
  const [mensaje, setMensaje] = useState(null);
  const [modalSuspension, setModalSuspension] = useState({ open: false, usuario: null });
  const [modalUsuario, setModalUsuario] = useState({ open: false, usuario: null });
  const [procesandoAccion, setProcesandoAccion] = useState(false);

  const fetchUsuarios = useCallback(async ({ page = 1, append = false, mostrarCarga = true } = {}) => {
    try {
      if (mostrarCarga) setLoading(true);
      const res = await adminService.getUsuarios({
        page,
        limit: PAGE_SIZE,
        search: debouncedSearchTerm.trim() || undefined,
        rol: filtroRol,
        estado: filtroEstado,
      });
      if (res.success) {
        setUsuarios((actuales) => (append ? [...actuales, ...res.data] : res.data));
        setMeta(res.meta || { page, total: res.data.length, hasMore: false });
      }
    } catch (error) {
      console.error('Error cargando usuarios', error);
      setMensaje({ tipo: 'error', texto: t('admin.messages.loadUsersError') });
    } finally {
      if (mostrarCarga) setLoading(false);
    }
  }, [debouncedSearchTerm, filtroEstado, filtroRol, t]);

  useEffect(() => {
    fetchUsuarios({ page: 1 });
  }, [fetchUsuarios]);

  const guardarUsuario = async (idUsuario, payload) => {
    setProcesandoAccion(true);

    try {
      const res = await adminService.updateUsuario(idUsuario, payload);
      if (res.success) {
        setMensaje({ tipo: 'success', texto: res.message || 'Usuario actualizado correctamente.' });
        setModalUsuario({ open: false, usuario: null });
        await fetchUsuarios({ page: 1 });
        onAdminChange?.();
      }
    } catch (error) {
      console.error('Error actualizando usuario', error);
      setMensaje({ tipo: 'error', texto: error.response?.data?.message || 'No se pudo actualizar el usuario.' });
    } finally {
      setProcesandoAccion(false);
    }
  };

  const abrirDetalleUsuario = async (usuario) => {
    setModalUsuario({ open: true, usuario });
    try {
      const res = await adminService.getUsuarioDetalle(usuario.id_usuario);
      if (res.success) {
        setModalUsuario({ open: true, usuario: { ...res.data.usuario, detalleAdmin: res.data } });
      }
    } catch (error) {
      console.error('Error cargando detalle de usuario', error);
    }
  };

  const handleSuspension = async (id, estadoActual, motivo = null) => {
    const accion = estadoActual === 'SUSPENDIDA' ? 'REACTIVAR' : 'SUSPENDER';

    try {
      const res = await adminService.suspendUsuario(id, accion, motivo);
      if (res.success) {
        setMensaje({ tipo: 'success', texto: res.message || t('admin.messages.statusUpdated') });
        await fetchUsuarios({ page: 1 });
        onAdminChange?.();
      }
    } catch (error) {
      console.error('Error cambiando estado del usuario', error);
      setMensaje({ tipo: 'error', texto: error.response?.data?.message || t('admin.messages.statusUpdateError') });
    }
  };

  const abrirSuspension = (usuario) => {
    if (usuario.estado_cuenta === 'SUSPENDIDA') {
      handleSuspension(usuario.id_usuario, usuario.estado_cuenta);
      return;
    }

    setModalSuspension({ open: true, usuario });
  };

  const confirmarSuspension = async (motivo) => {
    if (!modalSuspension.usuario) return;
    setProcesandoAccion(true);

    try {
      const res = await adminService.suspendUsuario(modalSuspension.usuario.id_usuario, 'SUSPENDER', motivo);
      if (res.success) {
        setMensaje({ tipo: 'success', texto: res.message || t('admin.messages.userSuspended') });
        setModalSuspension({ open: false, usuario: null });
        await fetchUsuarios({ page: 1 });
        onAdminChange?.();
      }
    } catch (error) {
      console.error('Error cambiando estado del usuario', error);
      setMensaje({ tipo: 'error', texto: error.response?.data?.message || t('admin.messages.statusUpdateError') });
    } finally {
      setProcesandoAccion(false);
    }
  };

  return (
    <div className="admin-content animate-in">
      <div className="admin-module-heading" style={{ justifyContent: 'flex-end' }}>
        <div className="admin-search">
          <Search size={18} />
          <input
            type="text"
            placeholder={t('admin.users.searchPlaceholder')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="admin-filter-tabs" aria-label="Filtros de usuarios">
          {['TODOS', 'ADMIN', 'ESTUDIANTE', 'EMPRESARIO'].map((rol) => (
            <button key={rol} className={`admin-filter-tab ${filtroRol === rol ? 'active' : ''}`} type="button" onClick={() => setFiltroRol(rol)}>
              {rol}
            </button>
          ))}
          {['TODOS', 'ACTIVA', 'PENDIENTE', 'SUSPENDIDA'].map((estado) => (
            <button key={estado} className={`admin-filter-tab ${filtroEstado === estado ? 'active' : ''}`} type="button" onClick={() => setFiltroEstado(estado)}>
              {estado}
            </button>
          ))}
        </div>
        <AdminExportButton tipo="usuarios" />
      </div>

      {mensaje && (
        <div className={`admin-config-message ${mensaje.tipo}`}>
          {mensaje.tipo === 'success' ? <CheckCircle size={18} /> : <AlertTriangle size={18} />}
          {mensaje.texto}
        </div>
      )}

      <section className="admin-panel">
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>{t('admin.users.tableUser')}</th>
                <th>{t('admin.users.tableRole')}</th>
                <th>{t('admin.users.tableRegistration')}</th>
                <th>{t('admin.users.tableStatus')}</th>
                <th className="admin-table-actions">{t('admin.users.tableActions')}</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="5" className="admin-muted-cell">{t('admin.users.loadingUsers')}</td></tr>
              ) : usuarios.length === 0 ? (
                <tr><td colSpan="5" className="admin-muted-cell">{t('admin.users.noUsersFound')}</td></tr>
              ) : (
                usuarios.map(u => (
                  <tr key={u.id_usuario}>
                    <td>
                      <div className="admin-user-cell">
                        <span className="admin-user-avatar">{u.nombre?.slice(0, 2).toUpperCase() || 'US'}</span>
                        <span>
                          {u.nombre}
                          <span className="admin-user-email">{u.correo}</span>
                        </span>
                      </div>
                    </td>
                    <td className="admin-muted-cell">{u.rol}</td>
                    <td className="admin-muted-cell">{new Date(u.fecha_registro).toLocaleDateString()}</td>
                    <td>
                      <span className={`admin-status-pill ${
                        u.estado_cuenta === 'ACTIVA' ? 'success' : 
                        u.estado_cuenta === 'SUSPENDIDA' ? 'danger' : 
                        'warning'
                      }`}>
                        {u.estado_cuenta}
                      </span>
                    </td>
                    <td className="admin-table-actions">
                      <div className="admin-action-group">
                        <button
                          onClick={() => abrirDetalleUsuario(u)}
                          className="admin-action-button neutral"
                          type="button"
                        >
                          <Pencil size={14} />
                          Ver / editar
                        </button>
                        <button 
                          onClick={() => abrirSuspension(u)}
                          className={`admin-action-button ${u.estado_cuenta === 'SUSPENDIDA' ? 'success' : 'danger'}`}
                          type="button"
                        >
                          {u.estado_cuenta === 'SUSPENDIDA' ? <CheckCircle size={14} /> : <AlertTriangle size={14} />}
                          {u.estado_cuenta === 'SUSPENDIDA' ? t('admin.users.reactivate') : t('admin.users.suspend')}
                        </button>
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
            <button className="admin-action-button neutral" type="button" onClick={() => fetchUsuarios({ page: meta.page + 1, append: true, mostrarCarga: false })}>
              Cargar más ({usuarios.length}/{meta.total})
            </button>
          </div>
        )}
      </section>

      <AdminMotivoModal
        open={modalSuspension.open}
        title={t('admin.users.suspendUserTitle')}
        description={t('admin.users.suspendUserDesc', { name: modalSuspension.usuario?.nombre || 'este usuario' })}
        label={t('admin.users.suspendReasonLabel')}
        placeholder={t('admin.users.suspendReasonPlaceholder')}
        confirmLabel={t('admin.users.suspendUserConfirm')}
        loading={procesandoAccion}
        onCancel={() => setModalSuspension({ open: false, usuario: null })}
        onConfirm={confirmarSuspension}
      />

      <AdminUsuarioModal
        open={modalUsuario.open}
        usuario={modalUsuario.usuario}
        loading={procesandoAccion}
        onCancel={() => setModalUsuario({ open: false, usuario: null })}
        onSave={guardarUsuario}
      />
    </div>
  );
});

export default AdminUsuarios;
