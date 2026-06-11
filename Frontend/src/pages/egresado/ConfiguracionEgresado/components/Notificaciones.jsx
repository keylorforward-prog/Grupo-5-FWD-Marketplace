import { useEffect, useState } from 'react';
import { Mail, MessageSquare, Briefcase } from 'lucide-react';

const CLAVE_ALMACENAMIENTO = 'preferenciasNotificacion';

const opcionesNotificacion = [
  {
    id: 'postulaciones',
    icono: Mail,
    titulo: 'Alertas de Postulación',
    descripcion: 'Recibe un correo cuando una empresa vea tu perfil o cambie tu estado.',
    variante: 'azul',
  },
  {
    id: 'mensajes',
    icono: MessageSquare,
    titulo: 'Nuevos Mensajes',
    descripcion: 'Notificaciones push para mensajes directos de recruiters.',
    variante: 'naranja',
  },
  {
    id: 'proyectos',
    icono: Briefcase,
    titulo: 'Nuevos Proyectos',
    descripcion: 'Avísame de proyectos nuevos que coincidan con mis preferencias.',
    variante: 'aqua',
  },
];

const valoresPorDefecto = { postulaciones: true, mensajes: true, proyectos: false };

function Notificaciones() {
  const [preferencias, setPreferencias] = useState(valoresPorDefecto);

  useEffect(() => {
    const guardado = localStorage.getItem(CLAVE_ALMACENAMIENTO);
    if (guardado) setPreferencias({ ...valoresPorDefecto, ...JSON.parse(guardado) });
  }, []);

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
        <h2 className="tituloFormulario">Notificaciones</h2>
      </div>

      {opcionesNotificacion.map(({ id, icono: Icono, titulo, descripcion, variante }) => (
        <div key={id} className="itemNotificacion">
          <div className="infoNotificacion">
            <div className={`iconoNotificacion ${variante}`}>
              <Icono size={18} />
            </div>
            <div className="textoNotificacion">
              <h4>{titulo}</h4>
              <p>{descripcion}</p>
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
