import { useState } from 'react';
import { Eye, X, CheckCircle2, Send, UserCheck, MessageSquare } from 'lucide-react';
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
  alMensajear,
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

        {/* Mensaje */}
        <Tooltip content="Enviar mensaje">
          <button
            type="button"
            onClick={() => alMensajear(idCandidato)}
            aria-label={`Enviar mensaje a ${nombreCandidato}`}
            className="de-project-icon-button"
          >
            <MessageSquare size={17} />
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

        {/* Aceptar → Verde */}
        <Tooltip content={isAceptado ? 'Candidato aceptado' : 'Aceptar candidato'}>
          <button
            onClick={() => !isAceptado && setShowAceptar(true)}
            disabled={isAceptado}
            aria-label={`Aceptar a ${nombreCandidato}`}
            className="de-project-icon-button success"
          >
            <UserCheck size={17} />
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
        <p>
          ¿Estás seguro de que deseas rechazar a <strong>{nombreCandidato}</strong>? Se le notificará al candidato.
        </p>
        <textarea
          value={motivo}
          onChange={(e) => setMotivo(e.target.value)}
          placeholder="Escribe un mensaje para el candidato (opcional)..."
          rows={3}
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
        <p>
          ¿Estás seguro de que deseas aceptar a <strong>{nombreCandidato}</strong>? Se le notificará al candidato.
        </p>
        <textarea
          value={motivo}
          onChange={(e) => setMotivo(e.target.value)}
          placeholder="Escribe un mensaje para el candidato (opcional)..."
          rows={3}
        />
      </DialogoConfirmacion>
    </>
  );
}
