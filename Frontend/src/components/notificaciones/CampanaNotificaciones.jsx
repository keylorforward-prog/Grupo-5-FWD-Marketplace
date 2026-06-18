import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, CheckCircle2 } from 'lucide-react';
import { useNotificaciones } from '../../hooks/useNotificaciones';

const formatearFechaRelativa = (fecha) => {
  if (!fecha) return '';

  const valor = new Date(fecha).getTime();
  if (Number.isNaN(valor)) return '';

  const diff = Date.now() - valor;
  const minutos = Math.max(1, Math.floor(diff / 60000));
  if (minutos < 60) return `Hace ${minutos} min`;

  const horas = Math.floor(minutos / 60);
  if (horas < 24) return `Hace ${horas} h`;

  const dias = Math.floor(horas / 24);
  if (dias < 7) return `Hace ${dias} d`;

  return new Date(fecha).toLocaleDateString('es-CR', {
    day: '2-digit',
    month: 'short',
  });
};

export default function CampanaNotificaciones({ rutaNotificaciones }) {
  const navigate = useNavigate();
  const panelRef = useRef(null);
  const [abierta, setAbierta] = useState(false);
  const { notificaciones, noLeidas, loading, cargar, marcarComoLeidas } = useNotificaciones({ limit: 5 });

  const recientes = useMemo(() => notificaciones.slice(0, 5), [notificaciones]);

  useEffect(() => {
    if (!abierta) return undefined;

    const manejarClickAfuera = (evento) => {
      if (panelRef.current && !panelRef.current.contains(evento.target)) {
        setAbierta(false);
      }
    };

    const manejarTecla = (evento) => {
      if (evento.key === 'Escape') setAbierta(false);
    };

    document.addEventListener('mousedown', manejarClickAfuera);
    document.addEventListener('keydown', manejarTecla);

    return () => {
      document.removeEventListener('mousedown', manejarClickAfuera);
      document.removeEventListener('keydown', manejarTecla);
    };
  }, [abierta]);

  const alternarPanel = async () => {
    const siguienteEstado = !abierta;
    setAbierta(siguienteEstado);
    if (siguienteEstado) await cargar();
  };

  const irATodas = () => {
    setAbierta(false);
    navigate(rutaNotificaciones);
  };

  return (
    <div className="de-header-notification-wrapper" ref={panelRef}>
      <button
        className={`de-header-bell de-link-button ${abierta ? 'active' : ''}`}
        type="button"
        onClick={alternarPanel}
        aria-label="Notificaciones"
        aria-haspopup="dialog"
        aria-expanded={abierta}
        title="Notificaciones"
      >
        <Bell size={20} />
        {noLeidas > 0 && (
          <span className="de-header-bell-dot" aria-label={`${noLeidas} notificaciones sin leer`}>
            {noLeidas > 9 ? '9+' : noLeidas}
          </span>
        )}
      </button>

      {abierta && (
        <section className="de-notification-popover" role="dialog" aria-label="Notificaciones recientes">
          <div className="de-notification-popover-header">
            <div>
              <h3>Notificaciones</h3>
              <p>{noLeidas > 0 ? `${noLeidas} sin leer` : 'Todo al día'}</p>
            </div>
            {noLeidas > 0 && (
              <button className="de-notification-text-button" type="button" onClick={marcarComoLeidas}>
                Marcar leídas
              </button>
            )}
          </div>

          <div className="de-notification-popover-list">
            {loading ? (
              <p className="de-notification-empty">Cargando...</p>
            ) : recientes.length === 0 ? (
              <p className="de-notification-empty">No tienes notificaciones.</p>
            ) : (
              recientes.map((notificacion) => (
                <article
                  key={notificacion.id_notificacion}
                  className={`de-notification-preview ${notificacion.leido ? '' : 'unread'}`}
                >
                  <span className="de-notification-preview-icon">
                    {notificacion.leido ? <CheckCircle2 size={14} /> : <Bell size={14} />}
                  </span>
                  <div className="de-notification-preview-body">
                    <p>{notificacion.mensaje}</p>
                    <span>{formatearFechaRelativa(notificacion.fecha)}</span>
                  </div>
                </article>
              ))
            )}
          </div>

          <button className="de-notification-view-all" type="button" onClick={irATodas}>
            Ver todas
          </button>
        </section>
      )}
    </div>
  );
}
