import { useState } from 'react';
import { Eye, X, CheckCircle2, Send } from 'lucide-react';
import Tooltip from '../ui/Tooltip';
import Emergente from '../ui/Emergente';
import DialogoConfirmacion from '../ui/DialogoConfirmacion';
import MiniCalendario from './MiniCalendario';

export default function BotonesAccion({
  idCandidato,
  nombreCandidato,
  estaInvitado,
  status,
  alVer,
  alInvitar,
  alRechazar,
}) {
  const [showConfirm, setShowConfirm] = useState(false);
  const isRejected = status === 'rechazado';

  return (
    <>
      <div className="de-row-actions">
        <Tooltip content="Ver perfil completo">
          <button
            type="button"
            onClick={() => alVer(idCandidato)}
            aria-label={`Ver perfil de ${nombreCandidato}`}
            className="de-project-icon-button"
          >
            <Eye size={17} />
          </button>
        </Tooltip>

        <Tooltip content={estaInvitado ? 'Invitación enviada' : 'Agendar entrevista'}>
          <div>
            {estaInvitado ? (
              <button
                type="button"
                disabled
                aria-label="Invitación ya enviada"
                className="de-project-icon-button success"
              >
                <CheckCircle2 size={17} />
              </button>
            ) : (
              <Emergente
                align="right"
                trigger={
                  <button
                    type="button"
                    aria-label={`Agendar entrevista con ${nombreCandidato}`}
                    className="de-project-icon-button"
                  >
                    <Send size={17} />
                  </button>
                }
              >
                <MiniCalendario
                  nombreCandidato={nombreCandidato}
                  onSchedule={(date, time, msg) => alInvitar(idCandidato, date, time, msg)}
                  onClose={() => {}}
                />
              </Emergente>
            )}
          </div>
        </Tooltip>

        <Tooltip content={isRejected ? 'Candidato rechazado' : 'Rechazar candidato'}>
          <button
            type="button"
            onClick={() => !isRejected && setShowConfirm(true)}
            disabled={isRejected}
            aria-label={`Rechazar a ${nombreCandidato}`}
            className="de-project-icon-button danger"
          >
            <X size={17} />
          </button>
        </Tooltip>
      </div>

      <DialogoConfirmacion
        open={showConfirm}
        variant="danger"
        title="Rechazar candidato"
        message={`¿Estás seguro de que deseas rechazar a ${nombreCandidato}? Esta acción cambiará su estado a "Rechazado".`}
        confirmLabel="Sí, rechazar"
        cancelLabel="Cancelar"
        onConfirm={() => { alRechazar(idCandidato); setShowConfirm(false); }}
        onCancel={() => setShowConfirm(false)}
      />
    </>
  );
}
