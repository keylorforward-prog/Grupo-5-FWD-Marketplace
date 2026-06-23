import { useTranslation } from 'react-i18next';

const PASOS = ['ENVIADA', 'PENDIENTE', 'EN_REVISION', 'PRESSELECCIONADA'];

export default function FlujoPostulacion({ estadoRaw }) {
  const { t } = useTranslation();

  const esAceptado = estadoRaw === 'ACEPTADO' || estadoRaw === 'CONTRATADO';
  const esRechazado = estadoRaw === 'RECHAZADA';

  const pasoActual = estadoRaw === 'ENVIADA' ? 0
    : estadoRaw === 'PENDIENTE' ? 1
    : estadoRaw === 'EN_REVISION' ? 2
    : (estadoRaw === 'PRESSELECCIONADA' || estadoRaw === 'PRESELECCIONADA') ? 3
    : (esAceptado || esRechazado) ? 4
    : -1;

  if (pasoActual === -1) return <span className="text-xs text-gray-400">-</span>;

  return (
    <div className="post-flujo post-flujo-compact">
      {PASOS.map((key, i) => {
        let claseBola = '';
        if (esRechazado) {
          claseBola = i < pasoActual ? 'completado' : (i === 3 ? 'rechazado-final' : '');
        } else if (esAceptado) {
          claseBola = i < pasoActual ? 'completado' : (i === 3 ? 'aceptado' : '');
        } else {
          claseBola = i < pasoActual ? 'completado' : (i === pasoActual ? 'activo' : '');
        }
        return (
          <div className="post-flujo-paso" key={key}>
            <span
              className={`post-flujo-bola ${claseBola}`}
              title={t(`egresadoPostulaciones.flujo${key.charAt(0) + key.slice(1).toLowerCase()}`)}
            />
          </div>
        );
      })}
      <div className="post-flujo-paso">
        <span
          className={`post-flujo-bola ${esRechazado ? 'rechazado-final' : esAceptado ? 'aceptado' : ''}`}
          title={t(esRechazado ? 'egresadoPostulaciones.flujoRechazada' : esAceptado ? 'egresadoPostulaciones.flujoAceptada' : '')}
        />
      </div>
    </div>
  );
}
