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

  const btnClass =
    variant === 'danger'
      ? 'bg-red-500 hover:bg-red-600 focus:ring-red-300'
      : 'bg-brand-600 hover:bg-brand-700 focus:ring-brand-300';

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={onCancel}>
      <div
        ref={dialogRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby="dialogo-confirmacion-title"
        aria-describedby="dialogo-confirmacion-message"
        className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm mx-4"
        onClick={detenerPropagacion}
        style={{ animation: 'popIn 0.2s ease-out' }}
      >
        <h3 id="dialogo-confirmacion-title" className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
        <p id="dialogo-confirmacion-message" className="text-sm text-gray-600 mb-6">{message}</p>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
        {children ? children : <p className="text-sm text-gray-600 mb-6">{message}</p>}
        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors focus:outline-none focus:ring-2 ${btnClass}`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

export default memo(DialogoConfirmacion);
