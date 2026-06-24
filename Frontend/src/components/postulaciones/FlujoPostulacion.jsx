import { Fragment } from 'react';
import { useTranslation } from 'react-i18next';

const ORDEN_FLUJO = [
  { key: 'ENVIADA', labelKey: 'flujoEnviada' },
  { key: 'PENDIENTE', labelKey: 'flujoPendiente' },
  { key: 'EN_REVISION', labelKey: 'flujoRevision' },
  { key: 'PRESELECCIONADA', labelKey: 'flujoPreseleccionada' },
  { key: 'FINAL', labelKey: '' },
];

export default function FlujoPostulacion({ estadoRaw }) {
  const { t } = useTranslation();

  const esAceptado = estadoRaw === 'CONTRATADO';
  const esRechazado = estadoRaw === 'RECHAZADA';

  const pasoActual = estadoRaw === 'ENVIADA' ? 0
    : estadoRaw === 'PENDIENTE' ? 1
    : estadoRaw === 'EN_REVISION' ? 2
    : estadoRaw === 'PRESELECCIONADA' ? 3
    : estadoRaw === 'CONTRATADO' ? 4
    : estadoRaw === 'RECHAZADA' ? 4
    : -1;

  if (pasoActual === -1) return <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>—</span>;

  return (
    <div className="post-flujo post-flujo-compact">
      {ORDEN_FLUJO.map((paso, i) => {
        const esUltimo = i === ORDEN_FLUJO.length - 1;
        const label = esUltimo
          ? (esRechazado ? t('egresadoPostulaciones.flujoRechazada') : esAceptado ? t('egresadoPostulaciones.flujoAceptada') : '—')
          : t(`egresadoPostulaciones.${paso.labelKey}`);
        const icono = esUltimo
          ? (esRechazado ? '✕' : esAceptado ? '✓' : (ORDEN_FLUJO.length).toString())
          : (i < pasoActual ? '✓' : (i + 1).toString());

        let claseBola = '';
        let claseEtiqueta = '';
        let claseRaya = '';

        if (esRechazado) {
          if (i < pasoActual) {
            claseBola = 'completado';
            claseEtiqueta = 'completado';
            claseRaya = 'completado';
          } else if (i === pasoActual) {
            claseBola = 'rechazado-final';
            claseEtiqueta = 'rechazado';
            claseRaya = 'rechazado-linea';
          }
        } else if (esAceptado) {
          if (i < pasoActual) {
            claseBola = 'completado';
            claseEtiqueta = 'completado';
            claseRaya = 'completado';
          } else if (i === pasoActual) {
            claseBola = 'aceptado';
            claseEtiqueta = 'aceptado';
            claseRaya = 'completado';
          }
        } else if (pasoActual >= 0) {
          if (i < pasoActual) {
            claseBola = 'completado';
            claseEtiqueta = 'completado';
            claseRaya = 'completado';
          } else if (i === pasoActual) {
            claseBola = 'activo';
            claseEtiqueta = 'activo';
            claseRaya = 'completado';
          }
        }

        return (
          <Fragment key={paso.key}>
            {i > 0 && <span className={`post-flujo-raya ${claseRaya}`} />}
            <div className="post-flujo-paso">
              <span className={`post-flujo-bola ${claseBola}`}>{icono}</span>
              <span className={`post-flujo-etiqueta ${claseEtiqueta}`}>{label}</span>
            </div>
          </Fragment>
        );
      })}
    </div>
  );
}
