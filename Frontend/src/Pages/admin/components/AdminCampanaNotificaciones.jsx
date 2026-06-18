import { useEffect, useRef, useState } from 'react';
import { Bell } from 'lucide-react';
import { adminService } from '../../../services/adminService';

export default function AdminCampanaNotificaciones({ onNavigate }) {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const ref = useRef(null);

  const cargar = async () => {
    const res = await adminService.getAdminNotificaciones();
    if (res.success) {
      setItems(res.data.items || []);
      setUnreadCount(res.data.unreadCount || 0);
    }
  };

  useEffect(() => {
    cargar();
  }, []);

  useEffect(() => {
    const cerrar = (event) => {
      if (ref.current && !ref.current.contains(event.target)) setOpen(false);
    };
    document.addEventListener('mousedown', cerrar);
    return () => document.removeEventListener('mousedown', cerrar);
  }, []);

  const navegar = (ruta) => {
    setOpen(false);
    onNavigate(ruta || 'dashboard');
  };

  return (
    <div className="admin-notification-wrapper" ref={ref}>
      <button className="admin-icon-button" type="button" aria-label="Notificaciones" title="Notificaciones" onClick={() => setOpen((value) => !value)}>
        <Bell size={20} />
        {unreadCount > 0 && <span className="admin-notification-dot" aria-hidden="true" />}
      </button>
      {open && (
        <div className="admin-notification-panel">
          <h3>Notificaciones admin</h3>
          {items.length === 0 ? <p>No hay alertas.</p> : items.map((item) => (
            <button key={`${item.tipo}-${item.ruta}`} type="button" onClick={() => navegar(item.ruta)}>
              <strong>{item.titulo}</strong>
              <span>{item.mensaje}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
