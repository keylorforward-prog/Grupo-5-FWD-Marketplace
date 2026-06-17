import { useCallback, useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import { AlertTriangle, Check, CheckCircle, X, FileText, Clock, ShieldCheck } from 'lucide-react';
import AdminMotivoModal from './components/AdminMotivoModal';

const esUrlDocumento = (valor) => typeof valor === 'string' && /^https?:\/\//i.test(valor);

const formatearFecha = (fecha) => {
  if (!fecha) return 'Sin fecha';
  const parsed = new Date(fecha);
  if (Number.isNaN(parsed.getTime())) return 'Sin fecha';
  return parsed.toLocaleDateString('es-CR', { day: '2-digit', month: 'short', year: 'numeric' });
};

const calcularAntiguedad = (fecha) => {
  if (!fecha) return 'Sin fecha';
  const registro = new Date(fecha).getTime();
  if (Number.isNaN(registro)) return 'Sin fecha';
  const dias = Math.max(0, Math.floor((Date.now() - registro) / 86400000));
  if (dias === 0) return 'Hoy';
  if (dias === 1) return '1 dia';
  return `${dias} dias`;
};

export default function AdminEgresados({ onAdminChange }) {
  const [pendientes, setPendientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mensaje, setMensaje] = useState(null);
  const [modalRechazo, setModalRechazo] = useState({ open: false, egresado: null });
  const [procesandoAccion, setProcesandoAccion] = useState(false);

  const fetchPendientes = useCallback(async () => {
    try {
      setLoading(true);
      const res = await adminService.getEgresadosPendientes();
      if (res.success) {
        setPendientes(res.data);
      }
    } catch (error) {
      console.error('Error cargando egresados pendientes', error);
      setMensaje({ tipo: 'error', texto: 'No se pudo cargar la cola de verificaciones.' });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let cancelado = false;

    adminService.getEgresadosPendientes()
      .then((res) => {
        if (!cancelado && res.success) {
          setPendientes(res.data);
        }
      })
      .catch((error) => {
        console.error('Error cargando egresados pendientes', error);
        if (!cancelado) {
          setMensaje({ tipo: 'error', texto: 'No se pudo cargar la cola de verificaciones.' });
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

  const handleVerify = async (id_usuario, accion, motivo = null) => {
    try {
      const res = await adminService.verifyEstudiante(id_usuario, accion, motivo);
      if (res.success) {
        setMensaje({ tipo: 'success', texto: res.message || 'Verificacion actualizada correctamente.' });
        await fetchPendientes();
        onAdminChange?.();
      }
    } catch (error) {
      console.error('Error verificando estudiante', error);
      setMensaje({ tipo: 'error', texto: error.response?.data?.message || 'Error en la verificacion.' });
    }
  };

  const abrirRechazo = (egresado) => {
    setModalRechazo({ open: true, egresado });
  };

  const confirmarRechazo = async (motivo) => {
    if (!modalRechazo.egresado) return;
    setProcesandoAccion(true);

    try {
      await handleVerify(modalRechazo.egresado.id_usuario, 'RECHAZAR', motivo);
      setModalRechazo({ open: false, egresado: null });
    } finally {
      setProcesandoAccion(false);
    }
  };

  return (
    <div className="admin-content animate-in">
      <div className="admin-module-heading">
        <div>
          <h3>Usuarios pendientes de verificacion</h3>
          <p className="admin-module-subtitle">
            Revisa la evidencia subida a S3 y aprueba solo egresados FWD validos.
          </p>
        </div>
        <span className="admin-status-pill warning">
          <Clock size={12} />
          {pendientes.length} pendientes
        </span>
      </div>

      {mensaje && (
        <div className={`admin-config-message ${mensaje.tipo}`}>
          {mensaje.tipo === 'success' ? <CheckCircle size={18} /> : <AlertTriangle size={18} />}
          {mensaje.texto}
        </div>
      )}

      <section className="admin-panel">
        <div className="admin-panel-header">
          <h3>Cola de revision</h3>
          <span className="admin-review-note">Ordenado por solicitudes mas antiguas</span>
        </div>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Egresado</th>
                <th>Cedula</th>
                <th>Cuenta</th>
                <th>Fecha Solicitud</th>
                <th>Antiguedad</th>
                <th>Evidencia</th>
                <th className="admin-table-actions">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="7" className="admin-muted-cell">Cargando pendientes...</td></tr>
              ) : pendientes.length === 0 ? (
                <tr>
                  <td colSpan="7">
                    <div className="admin-empty-inline">
                      <ShieldCheck size={22} />
                      No hay usuarios pendientes de verificacion. Todo al dia!
                    </div>
                  </td>
                </tr>
              ) : (
                pendientes.map(p => (
                  <tr key={p.id_perfil_estudiante}>
                    <td>
                      <div className="admin-user-cell">
                        <span className="admin-user-avatar">{p.usuario?.nombre?.slice(0, 2).toUpperCase() || 'EG'}</span>
                        <span>
                          {p.usuario?.nombre}
                          <span className="admin-user-email">{p.usuario?.correo}</span>
                        </span>
                      </div>
                    </td>
                    <td className="admin-muted-cell">{p.usuario?.cedula || 'Sin cedula'}</td>
                    <td>
                      <span className={`admin-status-pill ${p.usuario?.estado_cuenta === 'ACTIVA' ? 'success' : 'warning'}`}>
                        {p.usuario?.estado_cuenta || 'PENDIENTE'}
                      </span>
                    </td>
                    <td className="admin-muted-cell">{formatearFecha(p.usuario?.fecha_registro)}</td>
                    <td className="admin-muted-cell">{calcularAntiguedad(p.usuario?.fecha_registro)}</td>
                    <td>
                      {esUrlDocumento(p.titulo_fwd) ? (
                        <a className="admin-link-button" href={p.titulo_fwd} target="_blank" rel="noreferrer">
                          <FileText size={16} /> Ver documento
                        </a>
                      ) : (
                        <span className="admin-muted-cell">{p.titulo_fwd || 'Sin documento'}</span>
                      )}
                    </td>
                    <td className="admin-table-actions">
                      <div className="admin-action-group">
                        <button 
                          onClick={() => handleVerify(p.id_usuario, 'APROBAR')}
                          className="admin-action-button success"
                          type="button"
                        >
                          <Check size={14} /> Aprobar
                        </button>
                        <button 
                          onClick={() => abrirRechazo(p)}
                          className="admin-action-button danger"
                          type="button"
                        >
                          <X size={14} /> Rechazar
                        </button>
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
        open={modalRechazo.open}
        title="Rechazar verificacion"
        description={`Estas por rechazar la verificacion de ${modalRechazo.egresado?.usuario?.nombre || 'este egresado'}. Explica el motivo para que el usuario pueda corregirlo.`}
        label="Motivo de rechazo"
        placeholder="Ej. Documento ilegible, evidencia no corresponde a FWD, datos no coinciden..."
        confirmLabel="Rechazar verificacion"
        loading={procesandoAccion}
        onCancel={() => setModalRechazo({ open: false, egresado: null })}
        onConfirm={confirmarRechazo}
      />
    </div>
  );
}
