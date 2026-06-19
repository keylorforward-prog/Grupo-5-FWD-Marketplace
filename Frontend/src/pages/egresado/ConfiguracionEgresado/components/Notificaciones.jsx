import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Mail, MessageSquare, Briefcase } from 'lucide-react';

const CLAVE_ALMACENAMIENTO = 'preferenciasNotificacion';

const opcionesNotificacion = [
  {
    id: 'postulaciones',
    icono: Mail,
    tituloKey: 'alertasPostulacion',
    descKey: 'alertasPostulacionDesc',
    variante: 'azul',
  },
  {
    id: 'mensajes',
    icono: MessageSquare,
    tituloKey: 'nuevosMensajes',
    descKey: 'nuevosMensajesDesc',
    variante: 'naranja',
  },
  {
    id: 'proyectos',
    icono: Briefcase,
    tituloKey: 'nuevosProyectos',
    descKey: 'nuevosProyectosDesc',
    variante: 'aqua',
  },
];

const valoresPorDefecto = { postulaciones: true, mensajes: true, proyectos: false };

function Notificaciones() {
  const { t } = useTranslation();
  const [preferencias, setPreferencias] = useState(() => {
    const guardado = localStorage.getItem(CLAVE_ALMACENAMIENTO);
    return guardado ? { ...valoresPorDefecto, ...JSON.parse(guardado) } : valoresPorDefecto;
  });

  const alternar = (id) => {
    setPreferencias((prev) => {
      const nuevo = { ...prev, [id]: !prev[id] };
      localStorage.setItem(CLAVE_ALMACENAMIENTO, JSON.stringify(nuevo));
      return nuevo;
    });
  };

  return (
    <div id="notificaciones" className="tarjetaFormulario">
      <div className="cabeceraFormulario">
        <h2 className="tituloFormulario">{t('egresadoConfiguracion.notifications.titulo')}</h2>
      </div>

      {opcionesNotificacion.map(({ id, icono: Icono, tituloKey, descKey, variante }) => (
        <div key={id} className="itemNotificacion">
          <div className="infoNotificacion">
            <div className={`iconoNotificacion ${variante}`}>
              <Icono size={18} />
            </div>
            <div className="textoNotificacion">
              <h4>{t(`egresadoConfiguracion.notifications.${tituloKey}`)}</h4>
              <p>{t(`egresadoConfiguracion.notifications.${descKey}`)}</p>
            </div>
          </div>
          <label className="interruptor">
            <input
              type="checkbox"
              checked={preferencias[id]}
              onChange={() => alternar(id)}
            />
            <span className="deslizador"></span>
          </label>
        </div>
      ))}
    </div>
  );
}

export default Notificaciones;
