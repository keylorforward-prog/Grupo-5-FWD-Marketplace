import { useCallback, useState, useEffect, memo } from 'react';
import { adminService } from '../../services/adminService';
import { useTranslation } from 'react-i18next';
import { AlertTriangle, Check, CheckCircle, X, FileText, Clock, ShieldCheck } from 'lucide-react';
import AdminMotivoModal from './components/AdminMotivoModal';
import AdminExportButton from './components/AdminExportButton';

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

const formatearFecha = (fecha) => {
  if (!fecha) return 'Sin fecha';
  const parsed = new Date(fecha);
  if (Number.isNaN(parsed.getTime())) return 'Sin fecha';
  return parsed.toLocaleDateString('es-CR', { day: '2-digit', month: 'short', year: 'numeric' });
};

const calcularAntiguedad = (fecha, t) => {
  if (!fecha) return t('admin.graduates.noDate');
  const registro = new Date(fecha).getTime();
  if (Number.isNaN(registro)) return t('admin.graduates.noDate');
  const dias = Math.max(0, Math.floor((Date.now() - registro) / 86400000));
  if (dias === 0) return t('admin.graduates.today');
  if (dias === 1) return `1 ${t('admin.graduates.day')}`;
  return `${dias} ${t('admin.graduates.days')}`;
};

const AdminEgresados = memo(function AdminEgresados({ onAdminChange }) {
  const { t } = useTranslation();
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
      setMensaje({ tipo: 'error', texto: t('admin.messages.loadVerificationsError') });
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    fetchPendientes();
  }, [fetchPendientes]);

  const handleVerify = async (id_usuario, accion, motivo = null) => {
    try {
      const res = await adminService.verifyEstudiante(id_usuario, accion, motivo);
      if (res.success) {
        setMensaje({ tipo: 'success', texto: res.message || t('admin.messages.verificationUpdated') });
        await fetchPendientes();
        onAdminChange?.();
      }
    } catch (error) {
      console.error('Error verificando estudiante', error);
      setMensaje({ tipo: 'error', texto: error.response?.data?.message || t('admin.messages.verificationError') });
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
      <div className="admin-module-heading" style={{ justifyContent: 'flex-end' }}>

        <span className="admin-status-pill warning">
          <Clock size={12} />
          {pendientes.length} {t('admin.common.alerts').replace('alertas', 'pendientes')}
        </span>
        <AdminExportButton tipo="egresados" />
      </div>

      {mensaje && (
        <div className={`admin-config-message ${mensaje.tipo}`}>
          {mensaje.tipo === 'success' ? <CheckCircle size={18} /> : <AlertTriangle size={18} />}
          {mensaje.texto}
        </div>
      )}

      <section className="admin-panel">
        <div className="admin-panel-header">
          <h3>{t('admin.graduates.pendingQueue')}</h3>
          <span className="admin-review-note">{t('admin.graduates.sortedByOldest')}</span>
        </div>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>{t('admin.graduates.tableGraduate')}</th>
                <th>{t('admin.graduates.tableId')}</th>
                <th>{t('admin.graduates.tableAccount')}</th>
                <th>{t('admin.graduates.tableRequestDate')}</th>
                <th>{t('admin.graduates.tableSeniority')}</th>
                <th>{t('admin.graduates.tableEvidence')}</th>
                <th className="admin-table-actions">{t('admin.graduates.tableActions')}</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="7" className="admin-muted-cell">{t('admin.graduates.loadingPending')}</td></tr>
              ) : pendientes.length === 0 ? (
                <tr>
                  <td colSpan="7">
                    <div className="admin-empty-inline">
                      <ShieldCheck size={22} />
                      {t('admin.graduates.noPendingUsers')}
                    </div>
                  </td>
                </tr>
              ) : (
                pendientes.map(p => {
                  const evidenciaValida = esEvidenciaS3Fwd(p.titulo_fwd);
                  return (
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
                    <td className="admin-muted-cell">{p.usuario?.cedula || t('admin.graduates.withoutId')}</td>
                    <td>
                      <span className={`admin-status-pill ${p.usuario?.estado_cuenta === 'ACTIVA' ? 'success' : 'warning'}`}>
                        {p.usuario?.estado_cuenta || t('admin.graduates.statusPending')}
                      </span>
                    </td>
                    <td className="admin-muted-cell">{formatearFecha(p.usuario?.fecha_registro)}</td>
                    <td className="admin-muted-cell">{calcularAntiguedad(p.usuario?.fecha_registro, t)}</td>
                    <td>
                      {esUrlDocumento(p.titulo_fwd) ? (
                        <a className="admin-link-button" href={p.titulo_fwd} target="_blank" rel="noreferrer">
                          <FileText size={16} /> {t('admin.graduates.viewDocument')}
                        </a>
                      ) : (
                        <span className="admin-muted-cell">{p.titulo_fwd || t('admin.graduates.withoutDocument')}</span>
                      )}
                      {!evidenciaValida && (
                        <span className="admin-user-email">Evidencia S3 requerida</span>
                      )}
                    </td>
                    <td className="admin-table-actions">
                      <div className="admin-action-group">
                        <button 
                          onClick={() => handleVerify(p.id_usuario, 'APROBAR')}
                          className="admin-action-button success"
                          type="button"
                          disabled={!evidenciaValida}
                          title={!evidenciaValida ? 'Primero revisa una evidencia FWD valida en S3' : undefined}
                        >
                          <Check size={14} /> {t('admin.graduates.approve')}
                        </button>
                        <button 
                          onClick={() => abrirRechazo(p)}
                          className="admin-action-button danger"
                          type="button"
                        >
                          <X size={14} /> {t('admin.graduates.reject')}
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
        title={t('admin.graduates.rejectVerificationTitle')}
        description={t('admin.graduates.rejectVerificationDesc', { name: modalRechazo.egresado?.usuario?.nombre || 'este egresado' })}
        label={t('admin.graduates.rejectReasonLabel')}
        placeholder={t('admin.graduates.rejectReasonPlaceholder')}
        confirmLabel={t('admin.graduates.rejectVerificationConfirm')}
        loading={procesandoAccion}
        onCancel={() => setModalRechazo({ open: false, egresado: null })}
        onConfirm={confirmarRechazo}
      />
    </div>
  );
});

export default AdminEgresados;
