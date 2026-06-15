import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../../../context/AuthContext';
import { api } from '../../../../services/authService';

const HeaderEmpresa = () => {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  
  const [isDark, setIsDark] = useState(() => document.body.classList.contains('dark-theme'));
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await api.get('/notificaciones/mis-notificaciones');
        if (response.data.success) {
          setNotifications(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };
    fetchNotifications();
  }, []);

  const unreadCount = notifications.filter(n => !n.leido).length;

  const toggleTheme = () => {
    setIsDark((prev) => {
      const next = !prev;
      if (next) {
        document.body.classList.add('dark-theme');
      } else {
        document.body.classList.remove('dark-theme');
      }
      return next;
    });
  };
  
  const defaultAvatar = "https://lh3.googleusercontent.com/aida-public/AB6AXuDCyAeBVTU758T9W0t9G3fdkFAAzMTtUbJCLVy42xIgEsi7SF_RG-_Syzi7lmzQMWbFd6Nox8IcvB2IWEFo_I_Ie1o9eXon1PpEg_dTVl1QCxFUxAojDAZKHnClRyJ5NKPtw6qzihmMCW0bK1afkwxi9CycTamheR--seBnvQRLKiPhs9vPJRbWezZKhLUaTrpkLWNEs-3bS50gyX6CGQjrJ-e8oY4vl4ihX6yL6cWMxrUnIZyyYTYJg0tFTmqQIsA2RhGqO3MxsbU";
  const avatarUrl = user?.foto_perfil || defaultAvatar;
  const userName = user?.nombre || t('header.adminUser');
  const userRole = user?.rol || t('header.administrator');

  const toggleLanguage = () => {
    const nextLang = i18n.language === 'es' ? 'en' : 'es';
    i18n.changeLanguage(nextLang);
  };

  return (
    <header className="se-header">
      <h2 className="se-headline-md" style={{ color: 'var(--color-vibrant-blue)', margin: 0 }}>{t('header.configuration')}</h2>
      
      <div className="se-header-actions">
        {/* Barra de búsqueda eliminada a petición del usuario */}
        
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-base)' }}>
          <button 
            className="se-label-bold" 
            style={{ padding: '4px 8px', borderRadius: '4px', border: '1px solid var(--color-outline-variant)', background: 'transparent', cursor: 'pointer', color: 'var(--color-on-surface-variant)' }}
            onClick={toggleLanguage}
          >
            {i18n.language.toUpperCase()}
          </button>
          <button 
            className="se-icon-btn" 
            style={{ border: '1px solid var(--color-outline-variant)' }}
            onClick={toggleTheme}
            title={isDark ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
          >
            <span className="material-symbols-outlined" style={{ color: 'var(--color-vibrant-yellow)' }}>
              {isDark ? 'light_mode' : 'dark_mode'}
            </span>
          </button>
          <div style={{ position: 'relative' }}>
            <button 
              className="se-icon-btn se-icon-btn-pink"
              onClick={() => setShowNotifications(!showNotifications)}
            >
              <span className="material-symbols-outlined">notifications</span>
              {unreadCount > 0 && (
                <span style={{
                  position: 'absolute',
                  top: '-5px',
                  right: '-5px',
                  backgroundColor: 'var(--color-vibrant-pink)',
                  color: 'white',
                  borderRadius: '50%',
                  width: '18px',
                  height: '18px',
                  fontSize: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 'bold'
                }}>
                  {unreadCount}
                </span>
              )}
            </button>
            {showNotifications && (
              <div style={{
                position: 'absolute',
                top: '100%',
                right: '0',
                marginTop: '8px',
                width: '300px',
                backgroundColor: 'var(--color-surface-container-lowest)',
                border: '1px solid var(--color-outline-variant)',
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                zIndex: 50,
                padding: 'var(--spacing-sm)'
              }}>
                <h4 className="se-label-bold" style={{ margin: '0 0 12px 0', borderBottom: '1px solid var(--color-outline-variant)', paddingBottom: '8px' }}>
                  Notificaciones
                </h4>
                {notifications.length === 0 ? (
                  <p className="se-label-sm" style={{ color: 'var(--color-on-surface-variant)', textAlign: 'center' }}>No tienes notificaciones pendientes.</p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {notifications.map((notif, index) => (
                      <div key={index} style={{ padding: '8px', backgroundColor: notif.leido ? 'transparent' : 'var(--color-surface-container-low)', borderRadius: '4px' }}>
                        <p className="se-label-sm" style={{ margin: '0 0 4px 0', fontWeight: notif.leido ? 'normal' : 'bold' }}>{notif.mensaje}</p>
                        <span style={{ fontSize: '10px', color: 'var(--color-vibrant-blue)' }}>{new Date(notif.fecha).toLocaleDateString()}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
          <div style={{ position: 'relative' }}>
            <button 
              className="se-icon-btn se-icon-btn-teal"
              onClick={() => setShowHelp(!showHelp)}
            >
              <span className="material-symbols-outlined">help</span>
            </button>
            {showHelp && (
              <div style={{
                position: 'absolute',
                top: '100%',
                right: '0',
                marginTop: '8px',
                width: '320px',
                backgroundColor: 'var(--color-surface-container-lowest)',
                border: '1px solid var(--color-outline-variant)',
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                zIndex: 50,
                padding: 'var(--spacing-md)'
              }}>
                <h4 className="se-label-bold" style={{ margin: '0 0 8px 0', color: 'var(--color-vibrant-teal)', borderBottom: '1px solid var(--color-outline-variant)', paddingBottom: '8px' }}>
                  Acerca de esta configuración
                </h4>
                <p className="se-body-md" style={{ margin: '0 0 8px 0', fontSize: '13px', color: 'var(--color-on-surface)' }}>
                  En esta sección de <strong>Perfil Empresario</strong> puedes gestionar todos los detalles de tu compañía y cuenta:
                </p>
                <ul className="se-label-sm" style={{ margin: '0 0 12px 0', paddingLeft: '20px', color: 'var(--color-on-surface-variant)', lineHeight: '1.6' }}>
                  <li><strong>Perfil Empresario:</strong> Actualiza el nombre, sitio web, cédula y sector.</li>
                  <li><strong>Equipo de Reclutamiento:</strong> Gestiona a las personas que te ayudarán a seleccionar talento.</li>
                  <li><strong>Notificaciones:</strong> Configura cómo y cuándo deseas recibir alertas.</li>
                  <li><strong>Seguridad:</strong> Cambia tu contraseña y protege tu cuenta.</li>
                </ul>
              </div>
            )}
          </div>
        </div>
        
        <div className="se-user-profile">
          <div style={{ textAlign: 'right' }}>
            <p className="se-label-bold" style={{ margin: 0, color: 'var(--color-on-surface)' }}>{userName}</p>
            <p style={{ margin: 0, fontSize: '10px', color: 'var(--color-vibrant-blue)', textTransform: 'uppercase', fontWeight: 'bold', letterSpacing: '0.1em' }}>{userRole}</p>
          </div>
          <div className="se-user-avatar" style={{ overflow: 'hidden' }}>
            {user?.foto_perfil ? (
              <img 
                src={avatarUrl} 
                alt="User profile" 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            ) : (
              <img 
                src={avatarUrl} 
                alt="User profile" 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default HeaderEmpresa;
