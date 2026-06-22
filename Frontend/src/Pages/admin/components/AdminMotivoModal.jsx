import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { AnimatePresence, motion } from 'framer-motion';

function AdminMotivoModal({
  open,
  title,
  description,
  label = 'Motivo',
  placeholder = 'Describe brevemente el motivo...',
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  loading = false,
  onCancel,
  onConfirm,
}) {
  const { t } = useTranslation();
  const defaultLabel = t('admin.modal.reason');
  const defaultPlaceholder = t('admin.modal.placeholder');
  const defaultConfirmLabel = t('admin.modal.confirm');
  const defaultCancelLabel = t('admin.modal.cancel');

  const textos = useMemo(() => ({
    label: label === 'Motivo' ? defaultLabel : label,
    placeholder: placeholder === 'Describe brevemente el motivo...' ? defaultPlaceholder : placeholder,
    confirmLabel: confirmLabel === 'Confirmar' ? defaultConfirmLabel : confirmLabel,
    cancelLabel: cancelLabel === 'Cancelar' ? defaultCancelLabel : cancelLabel,
  }), [
    cancelLabel,
    confirmLabel,
    defaultCancelLabel,
    defaultConfirmLabel,
    defaultLabel,
    defaultPlaceholder,
    label,
    placeholder,
  ]);

  const [motivo, setMotivo] = useState('');
  const textareaRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;

    const timer = window.setTimeout(() => textareaRef.current?.focus(), 50);
    const manejarEscape = (event) => {
      if (event.key === 'Escape' && !loading) onCancel();
    };

    document.addEventListener('keydown', manejarEscape);
    return () => {
      window.clearTimeout(timer);
      document.removeEventListener('keydown', manejarEscape);
    };
  }, [loading, onCancel, open]);

  const motivoLimpio = motivo.trim();
  const cancelar = useCallback(() => {
    setMotivo('');
    onCancel();
  }, [onCancel]);

  const confirmar = useCallback(() => {
    onConfirm(motivoLimpio);
  }, [motivoLimpio, onConfirm]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div 
          className="admin-modal-backdrop" 
          role="presentation" 
          onMouseDown={cancelar}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
        >
          <motion.div
            className="admin-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="admin-motivo-title"
            onMouseDown={(event) => event.stopPropagation()}
            initial={{ scale: 0.95, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 10 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          >
        <div className="admin-modal-header">
          <span className="admin-modal-icon danger">
            <AlertTriangle size={20} />
          </span>
          <button className="admin-modal-close" type="button" onClick={cancelar} aria-label={t('admin.modal.close')}>
            <X size={18} />
          </button>
        </div>

        <div className="admin-modal-copy">
          <h3 id="admin-motivo-title">{title}</h3>
          <p>{description}</p>
        </div>

        <label className="admin-modal-field">
          <span>{textos.label}</span>
          <textarea
            ref={textareaRef}
            value={motivo}
            onChange={(event) => setMotivo(event.target.value)}
            placeholder={textos.placeholder}
            rows={4}
            maxLength={500}
          />
        </label>

        <div className="admin-modal-meta">
          <span>{t('admin.modal.auditNote')}</span>
          <span>{motivo.length}/500</span>
        </div>

        <div className="admin-modal-actions">
          <button className="admin-action-button neutral" type="button" onClick={cancelar} disabled={loading}>
            {textos.cancelLabel}
          </button>
          <button
            className="admin-action-button danger"
            type="button"
            onClick={confirmar}
            disabled={loading || !motivoLimpio}
          >
            {loading ? t('admin.modal.processing') : textos.confirmLabel}
          </button>
        </div>
      </motion.div>
    </motion.div>
      )}
    </AnimatePresence>
  );
}

export default memo(AdminMotivoModal);
