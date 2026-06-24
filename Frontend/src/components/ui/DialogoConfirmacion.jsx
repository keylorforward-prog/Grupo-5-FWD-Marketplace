import { memo, useCallback, useRef, useEffect } from 'react';

function DialogoConfirmacion({
  open,
  title,
  message,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  variant = 'default',
  onConfirm,
  onCancel,
  children,
}) {
  const dialogRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;

    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onCancel?.();
    };

    dialogRef.current?.focus();
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onCancel, open]);

  const detenerPropagacion = useCallback((event) => {
    event.stopPropagation();
  }, []);

  if (!open) return null;

  const isDanger = variant === 'danger';

  return (
    <div className="dialogo-overlay" onClick={onCancel}>
      <div
        ref={dialogRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby="dialogo-confirmacion-title"
        className="dialogo-panel"
        onClick={detenerPropagacion}
      >
        <h3 id="dialogo-confirmacion-title" className="dialogo-title">{title}</h3>
        {children ? children : <p className="dialogo-message">{message}</p>}
        <div className="dialogo-actions">
          <button
            onClick={onCancel}
            className="dialogo-btn dialogo-btn-cancel"
            type="button"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            className={`dialogo-btn ${isDanger ? 'dialogo-btn-danger' : 'dialogo-btn-confirm'}`}
            type="button"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

export default memo(DialogoConfirmacion);
