import { useCallback, useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import { Search, AlertTriangle, CheckCircle } from 'lucide-react';
import AdminMotivoModal from './components/AdminMotivoModal';

export default function AdminUsuarios({ onAdminChange }) {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [mensaje, setMensaje] = useState(null);
  const [modalSuspension, setModalSuspension] = useState({ open: false, usuario: null });
  const [procesandoAccion, setProcesandoAccion] = useState(false);

  const fetchUsuarios = useCallback(async () => {
    try {
      setLoading(true);
      const res = await adminService.getUsuarios();
      if (res.success) {
        setUsuarios(res.data);
      }
    } catch (error) {
      console.error('Error cargando usuarios', error);
      setMensaje({ tipo: 'error', texto: 'No se pudo cargar la lista de usuarios.' });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let cancelado = false;

    adminService.getUsuarios()
      .then((res) => {
        if (!cancelado && res.success) {
          setUsuarios(res.data);
        }
      })
      .catch((error) => {
        console.error('Error cargando usuarios', error);
        if (!cancelado) {
          setMensaje({ tipo: 'error', texto: 'No se pudo cargar la lista de usuarios.' });
        }
      })
      .finally(() => {
        if (!cancelado) {
          setLoading(false);
        }
      });

    return () => {
      cancelado = true;
    };
  }, []);

  const handleSuspension = async (id, estadoActual, motivo = null) => {
    const accion = estadoActual === 'SUSPENDIDA' ? 'REACTIVAR' : 'SUSPENDER';

    try {
      const res = await adminService.suspendUsuario(id, accion, motivo);
      if (res.success) {
        setMensaje({ tipo: 'success', texto: res.message || 'Estado actualizado correctamente.' });
        await fetchUsuarios();
        onAdminChange?.();
      }
    } catch (error) {
      console.error('Error cambiando estado del usuario', error);
      setMensaje({ tipo: 'error', texto: error.response?.data?.message || 'Error cambiando estado.' });
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
        setMensaje({ tipo: 'success', texto: res.message || 'Usuario suspendido correctamente.' });
        setModalSuspension({ open: false, usuario: null });
        await fetchUsuarios();
        onAdminChange?.();
      }
    } catch (error) {
      console.error('Error cambiando estado del usuario', error);
      setMensaje({ tipo: 'error', texto: error.response?.data?.message || 'Error cambiando estado.' });
    } finally {
      setProcesandoAccion(false);
    }
  };

  const filteredUsuarios = usuarios.filter(u =>
    u.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.correo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.rol?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="admin-content animate-in">
      <div className="admin-module-heading">
        <h3>Gestion de Usuarios</h3>
        <div className="admin-search">
          <Search size={18} />
          <input
            type="text"
            placeholder="Buscar usuario..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
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
                <th>Usuario</th>
                <th>Rol</th>
                <th>Registro</th>
                <th>Estado</th>
                <th className="admin-table-actions">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="5" className="admin-muted-cell">Cargando usuarios...</td></tr>
              ) : filteredUsuarios.length === 0 ? (
                <tr><td colSpan="5" className="admin-muted-cell">No se encontraron usuarios.</td></tr>
              ) : (
                filteredUsuarios.map(u => (
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
                      <button 
                        onClick={() => abrirSuspension(u)}
                        className={`admin-action-button ${u.estado_cuenta === 'SUSPENDIDA' ? 'success' : 'danger'}`}
                        type="button"
                      >
                        {u.estado_cuenta === 'SUSPENDIDA' ? <CheckCircle size={14} /> : <AlertTriangle size={14} />}
                        {u.estado_cuenta === 'SUSPENDIDA' ? 'Reactivar' : 'Suspender'}
                      </button>
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
        title="Suspender usuario"
        description={`Estas por suspender a ${modalSuspension.usuario?.nombre || 'este usuario'}. Indica el motivo para que quede trazado en auditoria.`}
        label="Motivo de suspension"
        placeholder="Ej. Incumplimiento de politicas, actividad sospechosa, informacion falsa..."
        confirmLabel="Suspender usuario"
        loading={procesandoAccion}
        onCancel={() => setModalSuspension({ open: false, usuario: null })}
        onConfirm={confirmarSuspension}
      />
    </div>
  );
}
