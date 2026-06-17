import { useEffect, useRef, useState } from 'react';
import { AlertTriangle, X } from 'lucide-react';

export default function AdminMotivoModal({
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

  if (!open) return null;

  const motivoLimpio = motivo.trim();
  const cancelar = () => {
    setMotivo('');
    onCancel();
  };

  const confirmar = () => {
    onConfirm(motivoLimpio);
  };

  return (
    <div className="admin-modal-backdrop" role="presentation" onMouseDown={cancelar}>
      <div
        className="admin-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="admin-motivo-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="admin-modal-header">
          <span className="admin-modal-icon danger">
            <AlertTriangle size={20} />
          </span>
          <button className="admin-modal-close" type="button" onClick={cancelar} aria-label="Cerrar">
            <X size={18} />
          </button>
        </div>

        <div className="admin-modal-copy">
          <h3 id="admin-motivo-title">{title}</h3>
          <p>{description}</p>
        </div>

        <label className="admin-modal-field">
          <span>{label}</span>
          <textarea
            ref={textareaRef}
            value={motivo}
            onChange={(event) => setMotivo(event.target.value)}
            placeholder={placeholder}
            rows={4}
            maxLength={500}
          />
        </label>

        <div className="admin-modal-meta">
          <span>Este motivo quedara registrado en auditoria.</span>
          <span>{motivo.length}/500</span>
        </div>

        <div className="admin-modal-actions">
          <button className="admin-action-button neutral" type="button" onClick={cancelar} disabled={loading}>
            {cancelLabel}
          </button>
          <button
            className="admin-action-button danger"
            type="button"
            onClick={confirmar}
            disabled={loading || !motivoLimpio}
          >
            {loading ? 'Procesando...' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
