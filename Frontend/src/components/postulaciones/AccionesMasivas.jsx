import { useState, useRef, useEffect } from 'react';
import { Download, FileSpreadsheet, FileText, ChevronDown, X } from 'lucide-react';

export default function AccionesMasivas({ cantidadSeleccionada, cantidadTotal, alExportar, alLimpiarSeleccion }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handle = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, []);

  const manejarExportacion = (format) => {
    alExportar(format, cantidadSeleccionada > 0);
    setOpen(false);
  };

  return (
    <div className="de-bulk-actions">
      {cantidadSeleccionada > 0 && (
        <div className="de-filter-chip">
          <span>
            {cantidadSeleccionada} seleccionado{cantidadSeleccionada > 1 ? 's' : ''}
          </span>
          <button
            type="button"
            onClick={alLimpiarSeleccion}
            aria-label="Limpiar selección"
          >
            <X size={12} />
          </button>
        </div>
      )}

      <div ref={ref} className="de-export-wrapper">
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className={`de-panel-action primary ${open ? 'active' : ''}`}
        >
          <Download size={15} />
          Exportar
          {cantidadSeleccionada > 0 && (
            <span className="de-action-count">
              {cantidadSeleccionada}
            </span>
          )}
          <ChevronDown size={14} className={open ? 'open' : ''} />
        </button>

        {open && (
          <div className="de-export-menu">
            <div className="de-export-menu-header">
              <p>
                {cantidadSeleccionada > 0
                  ? `${cantidadSeleccionada} candidato${cantidadSeleccionada > 1 ? 's' : ''} seleccionado${cantidadSeleccionada > 1 ? 's' : ''}`
                  : `Todos (${cantidadTotal} candidatos)`}
              </p>
            </div>
            <div className="de-export-menu-list">
              {[
                {
                  format: 'csv',
                  icon: FileSpreadsheet,
                  iconColor: 'success',
                  label: 'CSV / Excel',
                  desc: 'Datos tabulares',
                },
                {
                  format: 'pdf',
                  icon: FileText,
                  iconColor: 'danger',
                  label: 'PDF con Cartas',
                  desc: 'Perfiles + cartas de presentación',
                },
              ].map(({ format, icon: Icon, iconColor, label, desc }) => (
                <button
                  key={format}
                  type="button"
                  onClick={() => manejarExportacion(format)}
                  className="de-export-menu-item"
                >
                  <div className={`de-export-menu-icon ${iconColor}`}>
                    <Icon size={16} />
                  </div>
                  <div>
                    <p>{label}</p>
                    <span>{desc}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
