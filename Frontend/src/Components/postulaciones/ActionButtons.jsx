import { useState } from 'react';
import { Eye, CalendarClock, X, CheckCircle2 } from 'lucide-react';
import Tooltip from '../ui/Tooltip';
import Popover from '../ui/Popover';
import ConfirmDialog from '../ui/ConfirmDialog';
import MiniCalendar from './MiniCalendar';

const btnBase = `
  w-8 h-8 flex items-center justify-center flex-shrink-0
  transition-all duration-200 bg-transparent
  hover:scale-110 active:scale-95
`;

export default function ActionButtons({
  candidateId,
  candidateName,
  isInvited,
  status,
  onView,
  onInvite,
  onReject,
}) {
  const [showConfirm, setShowConfirm] = useState(false);
  const isRejected = status === 'rechazado';

  return (
    <>
      <div className="flex items-center gap-1.5">
        {/* Ver perfil → Azul */}
        <Tooltip content="Ver perfil completo">
          <button
            onClick={() => onView(candidateId)}
            aria-label={`Ver perfil de ${candidateName}`}
            className={`${btnBase} text-[#1868D5] hover:text-blue-700`}
          >
            <Eye className="w-5 h-5" />
          </button>
        </Tooltip>

        {/* Agendar → Morado (Arrow) */}
        <Tooltip content={isInvited ? 'Invitación enviada' : 'Agendar entrevista'}>
          <div>
            {isInvited ? (
              <button
                disabled
                aria-label="Invitación ya enviada"
                className={`${btnBase} text-emerald-500 cursor-default`}
              >
                <CheckCircle2 className="w-5 h-5" />
              </button>
            ) : (
              <Popover
                align="right"
                trigger={
                  <button
                    aria-label={`Agendar entrevista con ${candidateName}`}
                    className={`${btnBase} text-[#7C3AED] hover:text-purple-700`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>
                  </button>
                }
              >
                <MiniCalendar
                  candidateName={candidateName}
                  onSchedule={(date, time, msg) => onInvite(candidateId, date, time, msg)}
                  onClose={() => {}}
                />
              </Popover>
            )}
          </div>
        </Tooltip>

        {/* Rechazar → Rojo */}
        <Tooltip content={isRejected ? 'Candidato rechazado' : 'Rechazar candidato'}>
          <button
            onClick={() => !isRejected && setShowConfirm(true)}
            disabled={isRejected}
            aria-label={`Rechazar a ${candidateName}`}
            className={`${btnBase}
              ${isRejected ? 'text-gray-300 cursor-not-allowed' : 'text-[#DC2626] hover:text-red-700'}`}
          >
            <X className="w-5 h-5" />
          </button>
        </Tooltip>
      </div>

      <ConfirmDialog
        open={showConfirm}
        variant="danger"
        title="Rechazar candidato"
        message={`¿Estás seguro de que deseas rechazar a ${candidateName}? Esta acción cambiará su estado a "Rechazado".`}
        confirmLabel="Sí, rechazar"
        cancelLabel="Cancelar"
        onConfirm={() => { onReject(candidateId); setShowConfirm(false); }}
        onCancel={() => setShowConfirm(false)}
      />
    </>
  );
}
