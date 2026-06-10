import { useState, useRef, useEffect } from 'react';
import { Download, FileSpreadsheet, FileText, ChevronDown, X } from 'lucide-react';

export default function BulkActions({ selectedCount, totalCount, onExport, onClearSelection }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handle = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, []);

  const handleExport = (format) => {
    onExport(format, selectedCount > 0);
    setOpen(false);
  };

  return (
    <div className="flex items-center gap-3">
      {/* Selection badge */}
      {selectedCount > 0 && (
        <div className="flex items-center gap-2 pl-3 pr-2 py-1.5 rounded-xl
          bg-accent/8 border border-accent/20 animate-elastic-in">
          <span className="text-xs font-semibold text-accent">
            {selectedCount} seleccionado{selectedCount > 1 ? 's' : ''}
          </span>
          <button
            onClick={onClearSelection}
            className="w-5 h-5 rounded-full flex items-center justify-center
              text-accent/60 hover:text-accent hover:bg-accent/10 transition-all"
            aria-label="Limpiar selección"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* Export button + dropdown */}
      <div ref={ref} className="relative">
        <button
          onClick={() => setOpen(!open)}
          className="group flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white
            rounded-full transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]
            bg-[#0057B7] hover:bg-[#004A9C]"
          style={{
            boxShadow: open ? '0 4px 14px rgba(0,87,183,0.3)' : '0 2px 8px rgba(0,87,183,0.2)',
          }}
        >
          <Download className="w-4 h-4" />
          Exportar
          {selectedCount > 0 && (
            <span className="bg-white/20 px-1.5 py-0.5 rounded-md text-[10px] font-bold">
              {selectedCount}
            </span>
          )}
          <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
        </button>

        {open && (
          <div className="absolute right-0 top-full mt-2.5 w-60 z-50
            bg-white/95 backdrop-blur-md rounded-2xl overflow-hidden
            shadow-2xl shadow-black/12 border border-gray-100/80
            animate-elastic-in"
          >
            <div className="px-4 py-3 border-b border-gray-100/80"
              style={{ background: 'linear-gradient(135deg, rgba(37,99,235,0.04), rgba(124,58,237,0.04))' }}
            >
              <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
                {selectedCount > 0
                  ? `${selectedCount} candidato${selectedCount > 1 ? 's' : ''} seleccionado${selectedCount > 1 ? 's' : ''}`
                  : `Todos (${totalCount} candidatos)`}
              </p>
            </div>
            <div className="py-1.5">
              {[
                {
                  format: 'csv',
                  icon: FileSpreadsheet,
                  iconColor: 'text-emerald-500',
                  label: 'CSV / Excel',
                  desc: 'Datos tabulares',
                },
                {
                  format: 'pdf',
                  icon: FileText,
                  iconColor: 'text-red-500',
                  label: 'PDF con Cartas',
                  desc: 'Perfiles + cartas de presentación',
                },
              ].map(({ format, icon: Icon, iconColor, label, desc }) => (
                <button
                  key={format}
                  onClick={() => handleExport(format)}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm
                    text-gray-700 hover:bg-brand-50/70 hover:text-brand-700
                    transition-colors duration-150 group"
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center
                    bg-gray-50 group-hover:bg-white transition-colors ${iconColor}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-[13px]">{label}</p>
                    <p className="text-[11px] text-gray-400">{desc}</p>
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
