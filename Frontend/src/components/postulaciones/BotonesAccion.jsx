import { useState } from 'react';
import { Eye, X, CheckCircle2, UserCheck } from 'lucide-react';
import Tooltip from '../ui/Tooltip';
import Emergente from '../ui/Emergente';
import MiniCalendario from './MiniCalendario';
import DialogoConfirmacion from '../ui/DialogoConfirmacion';

export default function BotonesAccion({
  idCandidato,
  nombreCandidato,
  estaInvitado,
  status,
  alVer,
  alInvitar,
  alRechazar,
  alAceptar,
}) {
  const [showRechazar, setShowRechazar] = useState(false);
  const [showAceptar, setShowAceptar] = useState(false);
  const [motivo, setMotivo] = useState('');
  const isRejected = status === 'rechazado';
  const isAceptado = status === 'aceptado';

  const handleRechazar = () => {
    alRechazar(idCandidato, motivo);
    setShowRechazar(false);
    setMotivo('');
  };

  const handleAceptar = () => {
    alAceptar(idCandidato, motivo);
    setShowAceptar(false);
    setMotivo('');
  };

  return (
    <>
      <div className="de-row-actions">
      <div className="flex items-center gap-1.5">
        {/* Ver perfil → Azul (also sets EN_REVISION) */}
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

        {/* Invitar → Morado */}
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
        {/* Aceptar → Verde */}
        <Tooltip content={isAceptado ? 'Candidato aceptado' : 'Aceptar candidato'}>
          <button
            onClick={() => !isAceptado && setShowAceptar(true)}
            disabled={isAceptado}
            aria-label={`Aceptar a ${nombreCandidato}`}
            className={`${btnBase}
              ${isAceptado ? 'text-emerald-300 cursor-not-allowed' : 'text-emerald-600 hover:text-emerald-700'}`}
          >
            <UserCheck className="w-5 h-5" />
          </button>
        </Tooltip>

        {/* Rechazar → Rojo */}
        <Tooltip content={isRejected ? 'Candidato rechazado' : 'Rechazar candidato'}>
          <button
            onClick={() => !isRejected && setShowRechazar(true)}
            disabled={isRejected}
            aria-label={`Rechazar a ${nombreCandidato}`}
            className="de-project-icon-button danger"
          >
            <X size={17} />
          </button>
        </Tooltip>
      </div>

      {/* Reject dialog with message */}
      <DialogoConfirmacion
        open={showRechazar}
        variant="danger"
        title="Rechazar candidato"
        confirmLabel="Sí, rechazar"
        cancelLabel="Cancelar"
        onConfirm={handleRechazar}
        onCancel={() => { setShowRechazar(false); setMotivo(''); }}
      >
        <p className="text-sm text-gray-600 mb-3">
          ¿Estás seguro de que deseas rechazar a <strong>{nombreCandidato}</strong>? Se le notificará al candidato.
        </p>
        <textarea
          value={motivo}
          onChange={(e) => setMotivo(e.target.value)}
          placeholder="Escribe un mensaje para el candidato (opcional)..."
          rows={3}
          className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-200 resize-none mb-4"
        />
      </DialogoConfirmacion>

      {/* Accept dialog with message */}
      <DialogoConfirmacion
        open={showAceptar}
        variant="default"
        title="Aceptar candidato"
        confirmLabel="Sí, aceptar"
        cancelLabel="Cancelar"
        onConfirm={handleAceptar}
        onCancel={() => { setShowAceptar(false); setMotivo(''); }}
      >
        <p className="text-sm text-gray-600 mb-3">
          ¿Estás seguro de que deseas aceptar a <strong>{nombreCandidato}</strong>? Se le notificará al candidato.
        </p>
        <textarea
          value={motivo}
          onChange={(e) => setMotivo(e.target.value)}
          placeholder="Escribe un mensaje para el candidato (opcional)..."
          rows={3}
          className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-200 resize-none mb-4"
        />
      </DialogoConfirmacion>
    </>
  );
}
