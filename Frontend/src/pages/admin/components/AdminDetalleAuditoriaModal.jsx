import { useEffect } from 'react';
import { X, Info } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { AnimatePresence, motion } from 'framer-motion';

export default function AdminDetalleAuditoriaModal({ open, evento, onCancel }) {
  const { t } = useTranslation();

  useEffect(() => {
    if (!open) return undefined;

    const manejarEscape = (e) => {
      if (e.key === 'Escape') onCancel();
    };

    document.addEventListener('keydown', manejarEscape);
    return () => document.removeEventListener('keydown', manejarEscape);
  }, [onCancel, open]);

  return (
    <AnimatePresence>
      {open && evento && (
        <motion.div 
          className="admin-modal-backdrop" 
          role="presentation" 
          onMouseDown={onCancel}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
        >
          <motion.div
            className="admin-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="admin-auditoria-title"
            onMouseDown={(e) => e.stopPropagation()}
            style={{ maxWidth: '600px' }}
            initial={{ scale: 0.95, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 10 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          >
        <div className="admin-modal-header">
          <span className="admin-modal-icon accent">
            <Info size={20} />
          </span>
          <button className="admin-modal-close" type="button" onClick={onCancel} aria-label={t('admin.modal.close') || 'Cerrar'}>
            <X size={18} />
          </button>
        </div>

        <div className="admin-modal-copy">
          <h3 id="admin-auditoria-title">{t('admin.dashboard.auditDetailTitle')}</h3>
          <p>{t('admin.dashboard.auditDetailDesc')}</p>
        </div>

        <div className="admin-modal-details" style={{ marginTop: '20px', fontSize: '14px', lineHeight: '1.5' }}>
          <div style={{ marginBottom: '12px' }}>
            <strong>{t('admin.dashboard.auditEventId')}:</strong> {evento.id_auditoria}
          </div>
          <div style={{ marginBottom: '12px' }}>
            <strong>{t('admin.dashboard.auditDateTime')}:</strong> {new Date(evento.fecha).toLocaleString('es-CR')}
          </div>
          <div style={{ marginBottom: '12px' }}>
            <strong>{t('admin.dashboard.auditActor')}:</strong> {evento.actor} {evento.actor_correo && `(${evento.actor_correo})`}
          </div>
          <div style={{ marginBottom: '12px' }}>
            <strong>{t('admin.dashboard.auditAction')}:</strong> {evento.accion}
          </div>
          <div style={{ marginBottom: '12px' }}>
            <strong>{t('admin.dashboard.auditEntity')}:</strong> {evento.entidad}
          </div>
          <div style={{ marginTop: '20px' }}>
            <strong>{t('admin.dashboard.auditMetadata')}:</strong>
            <div style={{
              background: 'var(--fwd-color-fondo)', 
              padding: '12px', 
              borderRadius: '6px', 
              marginTop: '8px',
              border: '1px solid var(--fwd-color-borde)',
              color: 'var(--fwd-color-texto)'
            }}>
              {!evento.metadata || Object.keys(evento.metadata).length === 0 ? (
                <span>{t('admin.dashboard.auditNoMetadata')}</span>
              ) : (
                <ul style={{ margin: 0, paddingLeft: '20px' }}>
                  {Object.entries(evento.metadata).map(([key, value]) => {
                    const formatValue = (val) => {
                      if (Array.isArray(val)) return val.join(', ');
                      if (typeof val === 'object' && val !== null) return JSON.stringify(val);
                      if (val === null || val === undefined) return 'N/A';
                      return String(val);
                    };
                    const formatKey = (k) => {
                      const labels = {
                        id_usuario: 'ID Usuario',
                        estado_anterior: 'Estado Anterior',
                        nuevo_estado: 'Nuevo Estado',
                        motivo: 'Motivo',
                        claves: 'Claves Actualizadas'
                      };
                      return labels[k] || k.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
                    };

                    return (
                      <li key={key} style={{ marginBottom: '6px' }}>
                        <strong style={{ opacity: 0.8 }}>{formatKey(key)}:</strong> {formatValue(value)}
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </div>
        </div>

        <div className="admin-modal-actions" style={{ marginTop: '24px' }}>
          <button className="admin-action-button neutral" type="button" onClick={onCancel}>
            {t('admin.modal.close') || 'Cerrar'}
          </button>
        </div>
      </motion.div>
    </motion.div>
    )}
    </AnimatePresence>
  );
}
