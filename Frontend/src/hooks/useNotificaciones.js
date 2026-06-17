import { useCallback, useEffect, useState } from 'react';
import { notificacionService } from '../services/notificacionService';

export function useNotificaciones({ marcarAlCargar = false, limit = 10 } = {}) {
  const [notificaciones, setNotificaciones] = useState([]);
  const [noLeidas, setNoLeidas] = useState(0);
  const [loading, setLoading] = useState(false);

  const cargar = useCallback(async () => {
    setLoading(true);
    try {
      const respuesta = await notificacionService.obtenerMias(limit);
      setNotificaciones(respuesta.data || []);
      setNoLeidas(Number(respuesta.unreadCount || 0));
    } catch (error) {
      console.error('Error cargando notificaciones', error);
      setNotificaciones([]);
      setNoLeidas(0);
    } finally {
      setLoading(false);
    }
  }, [limit]);

  const marcarComoLeidas = useCallback(async () => {
    try {
      await notificacionService.marcarMiasComoLeidas();
      setNoLeidas(0);
      setNotificaciones((actuales) => actuales.map((notificacion) => ({ ...notificacion, leido: true })));
    } catch (error) {
      console.error('Error marcando notificaciones como leidas', error);
    }
  }, []);

  useEffect(() => {
    let activo = true;

    const iniciar = async () => {
      setLoading(true);
      try {
        const respuesta = await notificacionService.obtenerMias(limit);
        if (!activo) return;

        const data = respuesta.data || [];
        setNotificaciones(data);
        setNoLeidas(Number(respuesta.unreadCount || 0));

        if (marcarAlCargar && data.some((notificacion) => !notificacion.leido)) {
          await notificacionService.marcarMiasComoLeidas();
          if (!activo) return;
          setNoLeidas(0);
          setNotificaciones(data.map((notificacion) => ({ ...notificacion, leido: true })));
        }
      } catch (error) {
        if (!activo) return;
        console.error('Error cargando notificaciones', error);
        setNotificaciones([]);
        setNoLeidas(0);
      } finally {
        if (activo) setLoading(false);
      }
    };

    iniciar();

    return () => {
      activo = false;
    };
  }, [limit, marcarAlCargar]);

  return { notificaciones, noLeidas, loading, cargar, marcarComoLeidas };
}
