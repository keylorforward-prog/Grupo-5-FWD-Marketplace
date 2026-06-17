import { useState, useMemo, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MessageSquare, SearchX, Mail, MailOpen, Inbox, Send, Clock, User, ChevronLeft, Building, Shield } from 'lucide-react';
import { egresadoDashboardService } from '../../../../../services/egresadoDashboardService';
import { useAuth } from '../../../../../context/AuthContext';
import { useDashboardEgresadoRequest } from '../../hooks/useDashboardEgresadoRequest';

const ROLE_ICONS = {
  admin: Shield,
  empresa: Building,
  estudiante: User,
};

const formatearConversacion = (c, userId) => {
  const propuesta = c.postulacion?.propuesta ?? {};
  const contacto = c.contacto || c.emisor || {};
  const esPropio = c.id_usuario_emisor === userId;
  return {
    idPostulacion: c.id_postulacion,
    idConversacion: c.id_conversacion,
    proyecto: propuesta.titulo || 'Proyecto',
    ultimoMensaje: c.mensaje || 'Sin mensajes',
    tiempo: formatearFechaRelativa(c.fecha_envio),
    leido: c.leido || esPropio,
    contacto,
    esPropio,
  };
};

const formatearFechaRelativa = (fecha) => {
  if (!fecha) return '';
  const diff = Date.now() - new Date(fecha).getTime();
  const mins = Math.max(1, Math.round(diff / 60000));
  if (mins < 60) return `${mins} min`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return `${hrs} h`;
  const dias = Math.round(hrs / 24);
  return `${dias} d`;
};

const formatearHora = (fecha) => {
  if (!fecha) return '';
  const d = new Date(fecha);
  return d.toLocaleTimeString('es-CR', { hour: '2-digit', minute: '2-digit' });
};

const formatearFechaChat = (fecha) => {
  if (!fecha) return '';
  const d = new Date(fecha);
  const hoy = new Date();
  const ayer = new Date(hoy);
  ayer.setDate(ayer.getDate() - 1);

  if (d.toDateString() === hoy.toDateString()) return 'Hoy';
  if (d.toDateString() === ayer.toDateString()) return 'Ayer';
  return d.toLocaleDateString('es-CR', { day: 'numeric', month: 'short' });
};

function ChatView({ idPostulacion, proyecto, contacto: contactoProp, onBack }) {
  const { user } = useAuth();
  const [mensajes, setMensajes] = useState([]);
  const [contacto, setContacto] = useState(contactoProp);
  const [cargando, setCargando] = useState(true);
  const chatEndRef = useRef(null);

  useEffect(() => {
    let activo = true;
    setCargando(true);
    egresadoDashboardService.obtenerConversacion(idPostulacion)
      .then((data) => {
        if (!activo) return;
        setMensajes(data?.mensajes || data || []);
        if (data?.contacto) setContacto(data.contacto);
      })
      .catch(() => {})
      .finally(() => { if (activo) setCargando(false); });
    return () => { activo = false; };
  }, [idPostulacion]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [mensajes]);

  const userId = user?.id_usuario;

  const agruparPorFecha = useMemo(() => {
    const grupos = {};
    mensajes.forEach((m) => {
      const key = new Date(m.fecha_envio).toDateString();
      if (!grupos[key]) grupos[key] = [];
      grupos[key].push(m);
    });
    return grupos;
  }, [mensajes]);

  return (
    <div className="chat-view">
      <div className="chat-header">
        <button className="chat-back-btn" type="button" onClick={onBack}>
          <ChevronLeft size={20} />
        </button>
        <div className="chat-header-avatar">
          {contacto?.foto_perfil ? (
            <img src={contacto.foto_perfil} alt="" className="chat-header-avatar-img" />
          ) : (
            <span className="chat-header-avatar-inicial">{(contacto?.nombre || '?')[0]}</span>
          )}
        </div>
        <div className="chat-header-info">
          <span className="chat-header-name">{contacto?.nombre || proyecto}</span>
          <span className="chat-header-status">{proyecto}</span>
        </div>
      </div>

      <div className="chat-messages">
        {cargando && (
          <div className="chat-loading">
            {[1, 2, 3].map((i) => <div key={i} className="chat-skeleton" />)}
          </div>
        )}

        {!cargando && mensajes.length === 0 && (
          <div className="chat-empty">
            <MessageSquare size={32} />
            <p>No hay mensajes aún</p>
          </div>
        )}

        {!cargando && Object.entries(agruparPorFecha).map(([fecha, msgs]) => (
          <div key={fecha}>
            <div className="chat-date-separator">
              <span>{formatearFechaChat(msgs[0].fecha_envio)}</span>
            </div>
            {msgs.map((m) => {
              const esPropio = m.id_usuario_emisor === userId;
              return (
                <div key={m.id_conversacion} className={`chat-bubble-wrap ${esPropio ? 'own' : 'other'}`}>
                  <div className={`chat-bubble ${esPropio ? 'own' : 'other'}`}>
                    <p className="chat-bubble-text">{m.mensaje}</p>
                    <span className="chat-bubble-time">
                      {formatearHora(m.fecha_envio)}
                      {esPropio && (
                        <span className={`chat-bubble-check ${m.leido ? 'read' : ''}`}>
                          {m.leido ? '✓✓' : '✓'}
                        </span>
                      )}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      <div className="chat-input-bar">
        <input
          className="chat-input"
          type="text"
          placeholder="Escribe un mensaje..."
          disabled
        />
        <button className="chat-send-btn" type="button" disabled>
          <Send size={18} />
        </button>
      </div>
    </div>
  );
}

export default function Mensajes() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [conversacionActiva, setConversacionActiva] = useState(null);
  const userId = user?.id_usuario;

  const { data, loading, error } = useDashboardEgresadoRequest(
    () => egresadoDashboardService.obtenerMensajesRecientes(),
    [],
    []
  );

  const conversaciones = useMemo(() => (data || []).map((c) => formatearConversacion(c, userId)), [data, userId]);

  const stats = useMemo(() => {
    const total = conversaciones.length;
    const noLeidos = conversaciones.filter((c) => !c.leido && !c.esPropio).length;
    const leidos = total - noLeidos;
    return { total, noLeidos, leidos };
  }, [conversaciones]);

  const conversationActivaData = conversaciones.find(
    (c) => c.idPostulacion === conversacionActiva
  );

  return (
    <div className="mensajes-page">
      <div className="de-page-heading">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button className="de-project-icon-button" type="button" onClick={() => navigate('/egresado/dashboard')}>
            <ArrowLeft size={18} />
          </button>
          <h1>Mensajes</h1>
        </div>
        {!loading && !error && (
          <span className="conteoProyectos">{conversaciones.length} conversacione{conversaciones.length !== 1 ? 's' : ''}</span>
        )}
      </div>

      {loading && (
        <div className="mensajes-loading">
          {[1, 2, 3].map((i) => (
            <div key={i} className="mensajes-skeleton" />
          ))}
        </div>
      )}

      {error && <p className="de-data-state error">{error}</p>}

      {!loading && !error && conversaciones.length === 0 && (
        <div className="mensajes-empty">
          <SearchX size={48} />
          <h4>Sin mensajes</h4>
          <p>Cuando tengas conversaciones con empresas, aparecerán aquí.</p>
        </div>
      )}

      {!loading && !error && conversaciones.length > 0 && (
        <div className="mensajes-flex">
          <div className="mensajes-sidebar">
            <div className="mensajes-sidebar-header">
              <Inbox size={16} />
              <span>Conversaciones</span>
              <span className="mensajes-sidebar-count">{stats.total}</span>
            </div>
            <div className="mensajes-sidebar-stats">
              <div className="mensajes-sidebar-stat" data-type="unread">
                <Mail size={13} />
                {stats.noLeidos} no leídos
              </div>
              <div className="mensajes-sidebar-stat" data-type="read">
                <MailOpen size={13} />
                {stats.leidos} leídos
              </div>
            </div>
            <div className="mensajes-sidebar-list">
              {conversaciones.map((c) => {
                const RoleIcon = ROLE_ICONS[c.contacto?.rol] || User;
                const inicial = (c.contacto?.nombre || '?')[0].toUpperCase();
                const activa = c.idPostulacion === conversacionActiva;
                return (
                  <div
                    key={c.idPostulacion}
                    className={`mensajes-item${!c.leido && !c.esPropio ? ' unread' : ''}${activa ? ' active' : ''}`}
                    onClick={() => setConversacionActiva(c.idPostulacion)}
                  >
                    <div className={`mensajes-item-avatar${!c.leido && !c.esPropio ? ' unread' : ''}`}>
                      {c.contacto?.foto_perfil ? (
                        <img src={c.contacto.foto_perfil} alt="" className="mensajes-avatar-img" />
                      ) : (
                        <span className="mensajes-avatar-inicial">{inicial}</span>
                      )}
                    </div>
                    <div className="mensajes-item-body">
                      <div className="mensajes-item-top">
                        <div className="mensajes-item-name-row">
                          <span className="mensajes-item-name">{c.contacto?.nombre || 'Usuario'}</span>
                          {c.contacto?.rol && (
                            <span className="mensajes-item-role-badge" data-rol={c.contacto.rol}>
                              <RoleIcon size={10} />
                              {c.contacto.rol === 'estudiante' ? 'Egresado' : c.contacto.rol === 'empresa' ? 'Empresa' : 'Admin'}
                            </span>
                          )}
                        </div>
                        <span className="mensajes-item-time">{c.tiempo}</span>
                      </div>
                      <div className="mensajes-item-project-wrap">
                        <span className="mensajes-item-project">{c.proyecto}</span>
                        <span className="mensajes-item-project-sep">·</span>
                        <p className="mensajes-item-preview">{c.ultimoMensaje}</p>
                      </div>
                    </div>
                    {!c.leido && !c.esPropio && <span className="mensajes-item-dot" />}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mensajes-chat-panel">
            {conversacionActiva && conversationActivaData ? (
              <ChatView
                idPostulacion={conversacionActiva}
                proyecto={conversationActivaData.proyecto}
                contacto={conversationActivaData.contacto}
                onBack={() => setConversacionActiva(null)}
              />
            ) : (
              <div className="mensajes-chat-empty">
                <MessageSquare size={48} />
                <h4>Selecciona una conversación</h4>
                <p>Elige un chat del panel izquierdo para ver los mensajes.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
