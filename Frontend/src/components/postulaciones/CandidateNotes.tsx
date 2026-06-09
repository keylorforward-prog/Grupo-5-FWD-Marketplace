import { useState } from 'react';
import { StickyNote, X, Send } from 'lucide-react';

interface CandidateNotesProps {
  notes: string[];
  onAddNote: (note: string) => void;
  onDeleteNote: (index: number) => void;
}

export default function CandidateNotes({ notes, onAddNote, onDeleteNote }: CandidateNotesProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [draft, setDraft] = useState('');

  const handleSubmit = () => {
    const trimmed = draft.trim();
    if (trimmed) { onAddNote(trimmed); setDraft(''); }
  };

  return (
    <div className="relative">
      {/* Bubble trigger */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Notas internas del candidato"
        className={`relative w-8 h-8 rounded-full flex items-center justify-center
          transition-all duration-200
          ${isOpen
            ? 'text-amber-600 shadow-md shadow-amber-200/60'
            : notes.length > 0
              ? 'text-amber-500 hover:shadow-md hover:shadow-amber-200/50'
              : 'text-gray-300 hover:text-amber-400'
          }`}
        style={isOpen || notes.length > 0
          ? { background: 'linear-gradient(135deg, #fef3c7, #fde68a)' }
          : { background: '#f1f5f9' }
        }
      >
        <StickyNote className="w-3.5 h-3.5" />
        {notes.length > 0 && (
          <span className="absolute -top-1 -right-1 w-4 h-4
            text-white text-[9px] font-bold rounded-full flex items-center justify-center
            shadow-md shadow-amber-400/40"
            style={{ background: 'linear-gradient(135deg, #f59e0b, #f97316)' }}
          >
            {notes.length}
          </span>
        )}
      </button>

      {/* Elastic popover */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2.5 w-72 z-50
          bg-white/96 backdrop-blur-md rounded-2xl overflow-hidden
          shadow-2xl shadow-black/10 border border-amber-100/60
          animate-elastic-in"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-amber-100/60"
            style={{ background: 'linear-gradient(135deg, rgba(254,243,199,0.6), rgba(255,237,213,0.4))' }}
          >
            <p className="text-xs font-semibold text-amber-800 flex items-center gap-1.5">
              <StickyNote className="w-3.5 h-3.5" />
              Notas internas
            </p>
            <button onClick={() => setIsOpen(false)}
              className="text-amber-400 hover:text-amber-700 transition-colors p-0.5 rounded-md hover:bg-amber-100/60"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Notes list */}
          <div className="max-h-44 overflow-y-auto p-3 space-y-2">
            {notes.length === 0 ? (
              <p className="text-xs text-gray-400 italic text-center py-3">
                Sin notas aún — sé el primero en agregar una
              </p>
            ) : (
              notes.map((note, i) => (
                <div key={i}
                  className="group flex items-start gap-2 p-2.5 rounded-xl
                    bg-gray-50/80 hover:bg-amber-50/70 border border-transparent
                    hover:border-amber-100/60 transition-all duration-150"
                >
                  <p className="text-xs text-gray-700 flex-1 leading-relaxed">{note}</p>
                  <button
                    onClick={() => onDeleteNote(i)}
                    className="opacity-0 group-hover:opacity-100 p-0.5 rounded-md
                      text-gray-300 hover:text-red-400 hover:bg-red-50 transition-all"
                    aria-label="Eliminar nota"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Input */}
          <div className="p-3 border-t border-gray-100/60 flex gap-2">
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
              placeholder="Agregar nota privada..."
              className="flex-1 text-xs border border-gray-200/70 rounded-xl px-3 py-2
                focus:outline-none focus:ring-2 focus:ring-amber-300/60 focus:border-transparent
                bg-gray-50/60 placeholder-gray-400 transition-all"
            />
            <button
              onClick={handleSubmit}
              disabled={!draft.trim()}
              className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0
                text-white transition-all duration-200
                disabled:opacity-40 disabled:cursor-not-allowed hover:scale-105 active:scale-95"
              style={{ background: 'linear-gradient(135deg, #f59e0b, #f97316)' }}
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
