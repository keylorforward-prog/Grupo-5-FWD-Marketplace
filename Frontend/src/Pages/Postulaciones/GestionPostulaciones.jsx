import { useState, useMemo, useCallback } from 'react';
import { Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import { mockCandidates } from '../../data/mockCandidates';
import Sidebar from '../../components/layout/Sidebar';
import CandidateRow from '../../components/postulaciones/CandidateRow';
import BulkActions from '../../components/postulaciones/BulkActions';

const ITEMS_PER_PAGE_OPTIONS = [3, 10, 15, 25];

// Stat card config matching the photo
const buildStatCards = (stats) => [
  {
    label: 'TOTAL POSTULADOS',
    value: stats.total,
    bg: 'bg-[#1868D5]',
    textValue: 'text-white',
    textLabel: 'text-white/80',
    border: 'border-transparent',
    filter: null,
  },
  {
    label: 'NUEVOS (HOY)',
    value: stats.nuevos,
    bg: 'bg-white',
    textValue: 'text-[#B45309]',
    textLabel: 'text-gray-500',
    border: 'border-gray-200',
    filter: 'nuevo',
  },
  {
    label: 'EN REVISIÓN',
    value: stats.enRevision,
    bg: 'bg-white',
    textValue: 'text-[#7C3AED]',
    textLabel: 'text-gray-500',
    border: 'border-gray-200',
    filter: 'en_revision',
  },
  {
    label: 'ENTREVISTADOS',
    value: stats.entrevistados,
    bg: 'bg-white',
    textValue: 'text-gray-900',
    textLabel: 'text-gray-500',
    border: 'border-gray-200',
    filter: 'entrevistado',
  },
];

const STATUS_LABELS = {
  nuevo: 'Nuevos',
  en_revision: 'En revisión',
  entrevistado: 'Entrevistados',
};

export default function GestionPostulaciones() {
  const [candidates, setCandidates] = useState(mockCandidates);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(3);
  const [statusFilter, setStatusFilter] = useState(null);

  const filtered = useMemo(
    () => (!statusFilter ? candidates : candidates.filter((c) => c.status === statusFilter)),
    [candidates, statusFilter]
  );

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginated = useMemo(
    () => filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage),
    [filtered, currentPage, itemsPerPage]
  );

  const stats = useMemo(() => ({
    total:         candidates.length,
    nuevos:        candidates.filter((c) => c.status === 'nuevo').length,
    enRevision:    candidates.filter((c) => c.status === 'en_revision').length,
    entrevistados: candidates.filter((c) => c.status === 'entrevistado').length,
  }), [candidates]);

  const statCards = buildStatCards(stats);

  const toggleSelect = useCallback((id) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }, []);

  const toggleSelectAll = useCallback(() => {
    const pageIds = paginated.map((c) => c.id);
    const allSelected = pageIds.every((id) => selectedIds.has(id));
    setSelectedIds((prev) => {
      const next = new Set(prev);
      pageIds.forEach((id) => (allSelected ? next.delete(id) : next.add(id)));
      return next;
    });
  }, [paginated, selectedIds]);

  const handleInvite = useCallback((id) => {
    setCandidates((prev) =>
      prev.map((c) => (c.id === id ? { ...c, isInvited: true, status: 'entrevistado' } : c))
    );
  }, []);

  const handleReject = useCallback((id) => {
    setCandidates((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: 'rechazado' } : c))
    );
  }, []);

  const handleAddNote = useCallback((id, note) => {
    setCandidates((prev) =>
      prev.map((c) => (c.id === id ? { ...c, notes: [...c.notes, note] } : c))
    );
  }, []);

  const handleDeleteNote = useCallback((id, index) => {
    setCandidates((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, notes: c.notes.filter((_, i) => i !== index) } : c
      )
    );
  }, []);

  const handleExport = useCallback((format, onlySelected) => {
    const data = onlySelected ? candidates.filter((c) => selectedIds.has(c.id)) : candidates;
    alert(`Exportando ${data.length} candidatos en formato ${format.toUpperCase()}`);
  }, [candidates, selectedIds]);

  const allPageSelected = paginated.length > 0 && paginated.every((c) => selectedIds.has(c.id));
  const somePageSelected = paginated.some((c) => selectedIds.has(c.id)) && !allPageSelected;

  return (
    <div className="flex min-h-screen bg-surface">
      <Sidebar />

      <main className="flex-1 ml-[260px] max-w-[1200px] mx-auto relative bg-[#F8FAFC]">
        {/* Sticky header */}
        <header className="sticky top-0 z-30 bg-[#F8FAFC] pb-2">
          <div className="px-8 py-5">
            <div className="flex items-start justify-between">
              <div className="max-w-3xl">
                <nav className="text-xs text-gray-500 mb-2 flex items-center gap-1.5 tracking-wide">
                  <span className="hover:text-gray-900 cursor-pointer transition-colors">Proyectos</span>
                  <span className="text-gray-400">/</span>
                  <span className="hover:text-gray-900 cursor-pointer transition-colors">E-commerce Refactor</span>
                  <span className="text-gray-400">/</span>
                  <span className="text-[#1868D5] font-semibold">Postulaciones</span>
                </nav>
                <h1 className="text-2xl font-bold text-gray-900 tracking-tight mb-2">
                  Gestión de Postulaciones
                </h1>
                <p className="text-sm text-gray-500 leading-relaxed">
                  Revisa los perfiles de los juniors que han aplicado a <strong className="text-[#1868D5] font-semibold">"E-commerce Refactor (React/Node)"</strong>.
                  <br />Evalúa sus stacks y cartas de presentación para coordinar entrevistas.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors border border-gray-200 shadow-sm">
                  <Filter className="w-4 h-4 text-gray-500" />
                  Filtrar
                </button>
                <BulkActions
                  selectedCount={selectedIds.size}
                  totalCount={candidates.length}
                  onExport={handleExport}
                  onClearSelection={() => setSelectedIds(new Set())}
                />
              </div>
            </div>
          </div>
        </header>

        <div className="px-8 py-7">
          {/* ── Stat Cards (Staggered Fade-in) ── */}
          <div className="grid grid-cols-4 gap-4 mb-8">
            {statCards.map((card, i) => {
              const isActive = statusFilter === card.filter;
              return (
                <button
                  key={card.label}
                  onClick={() => { setStatusFilter(isActive ? null : card.filter); setCurrentPage(1); }}
                  className={`relative overflow-hidden rounded-3xl p-6 text-left border
                    transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] group
                    animate-slide-up-fade ${card.bg} ${card.border}`}
                  style={{
                    animationDelay: `${i * 90}ms`,
                    boxShadow: isActive ? '0 0 0 2px #1868D5, 0 4px 12px rgba(0,0,0,0.05)' : '0 2px 8px rgba(0,0,0,0.02)'
                  }}
                >
                  <div className="relative z-10">
                    <p className={`text-[10px] font-bold uppercase tracking-wider mb-3 ${card.textLabel}`}>
                      {card.label}
                    </p>
                    <p className={`text-5xl font-bold tabular-nums tracking-tight ${card.textValue}`}>
                      {String(card.value).padStart(2, '0')}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* ── Table Container ── */}
          <div
            className="rounded-3xl overflow-hidden border border-gray-100 bg-white transition-shadow duration-500"
            style={{
              boxShadow: '0 4px 24px -6px rgba(0,0,0,0.03)',
            }}
          >
            {/* Active Filters Toolbar */}
            {statusFilter && (
              <div className="flex items-center px-6 py-4 border-b border-gray-100/60 bg-gray-50/50">
                  <span className="inline-flex items-center gap-1.5 text-xs text-brand-700
                    bg-brand-50 px-3 py-1.5 rounded-xl font-semibold border border-brand-100
                    animate-elastic-in">
                    Filtro: {STATUS_LABELS[statusFilter] ?? statusFilter}
                    <button
                      onClick={() => { setStatusFilter(null); setCurrentPage(1); }}
                      className="text-brand-500 hover:text-brand-700 ml-0.5 transition-colors"
                    >
                      ✕
                    </button>
                  </span>
              </div>
            )}

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100 bg-[#F8FAFC]">
                    <th className="py-4 pl-6 pr-4 text-left text-xs font-semibold text-gray-500 w-1/4">
                      <label className="inline-flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={allPageSelected}
                          onChange={toggleSelectAll}
                          aria-label={
                            somePageSelected || allPageSelected
                              ? 'Deseleccionar candidatos de esta página'
                              : 'Seleccionar candidatos de esta página'
                          }
                          className="h-4 w-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500"
                        />
                        Candidato / Junior
                      </label>
                    </th>
                    <th className="py-4 px-4 text-left text-xs font-semibold text-gray-500 w-1/4">
                      Stack Principal
                    </th>
                    <th className="py-4 px-4 text-left text-xs font-semibold text-gray-500 w-1/3">
                      Carta de Presentación
                    </th>
                    <th className="py-4 pr-6 text-right text-xs font-semibold text-gray-500 w-auto">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {paginated.map((candidate, i) => (
                    <CandidateRow
                      key={candidate.id}
                      candidate={candidate}
                      index={i}
                      isSelected={selectedIds.has(candidate.id)}
                      onSelect={toggleSelect}
                      onView={(id) => console.log('View:', id)}
                      onInvite={handleInvite}
                      onReject={handleReject}
                      onAddNote={handleAddNote}
                      onDeleteNote={handleDeleteNote}
                    />
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between px-6 py-5 border-t border-gray-100 bg-white">
              <div className="flex items-center gap-3">
                <p className="text-xs text-gray-500">
                  Mostrando {filtered.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0}-{Math.min(currentPage * itemsPerPage, filtered.length)} de {filtered.length} candidatos
                </p>
                <select
                  value={itemsPerPage}
                  onChange={(event) => {
                    setItemsPerPage(Number(event.target.value));
                    setCurrentPage(1);
                  }}
                  className="rounded-full border border-gray-200 bg-white px-3 py-1 text-xs font-semibold text-gray-600 focus:outline-none focus:ring-2 focus:ring-brand-200"
                  aria-label="Candidatos por página"
                >
                  {ITEMS_PER_PAGE_OPTIONS.map((option) => (
                    <option key={option} value={option}>
                      {option} por página
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => p - 1)}
                  className="w-8 h-8 rounded-full flex items-center justify-center
                    text-gray-400 hover:bg-gray-100 hover:text-gray-700
                    disabled:opacity-30 disabled:cursor-not-allowed transition-all border border-gray-200"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-8 h-8 rounded-full text-xs font-semibold transition-all duration-200
                      ${page === currentPage
                        ? 'bg-[#1868D5] text-white shadow-sm'
                        : 'text-gray-600 hover:bg-gray-100 border border-transparent hover:border-gray-200'
                      }`}
                  >
                    {page}
                  </button>
                ))}

                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => p + 1)}
                  className="w-8 h-8 rounded-full flex items-center justify-center
                    text-gray-400 hover:bg-gray-100 hover:text-gray-700
                    disabled:opacity-30 disabled:cursor-not-allowed transition-all border border-gray-200"
                  aria-label="Página siguiente"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Footer */}
          <footer className="mt-12 pt-6 border-t border-gray-200/60 flex items-center justify-between text-xs text-gray-400">
            <div className="leading-relaxed">
              <span className="font-bold text-gray-600">FWD</span>
              <br />© 2024 Fundación Forward Costa Rica
              <br />Impulsando el talento tecnológico nacional.
            </div>
            <div className="flex gap-6">
              {['Privacidad', 'Términos de Uso', 'LinkedIn', 'Instagram'].map((link) => (
                <a key={link} href="#"
                  className="hover:text-brand-600 transition-colors duration-200 tracking-wide">
                  {link}
                </a>
              ))}
            </div>
          </footer>
        </div>
      </main>
    </div>
  );
}
