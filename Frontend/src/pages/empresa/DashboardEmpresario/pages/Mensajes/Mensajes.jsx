import { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, MessageSquare, Search, SearchX, Mail, MailOpen, Inbox, Send, ChevronLeft, User, Building, Shield } from 'lucide-react';
import { dashboardEmpresarioService } from '../../../../../services/dashboardEmpresarioService';
import { useAuth } from '../../../../../context/AuthContext';
import { useDashboardEmpresarioRequest } from '../../hooks/useDashboardEmpresarioRequest';
import useChatSocket from '../../../../../hooks/useChatSocket';
import '../../../../egresado/DashboardEgresado/styles/DashboardEgresado.css';
import '../../DashboardEmpresario.css';

const ROLE_ICONS = {
  admin: Shield,
  empresa: Building,
  estudiante: User,
};

const T_NS = 'egresadoMensajes';

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

const formatearFechaChat = (fecha, t) => {
  if (!fecha) return '';
  const d = new Date(fecha);
  const hoy = new Date();
  const ayer = new Date(hoy);
  ayer.setDate(ayer.getDate() - 1);

  if (d.toDateString() === hoy.toDateString()) return t(`${T_NS}.hoy`);
  if (d.toDateString() === ayer.toDateString()) return t(`${T_NS}.ayer`);
  return d.toLocaleDateString('es-CR', { day: 'numeric', month: 'short' });
};

const formatearConversacion = (c, userId) => {
  const contactoData = c.contacto || c.postulacion?.perfilEstudiante?.usuario || {};
  const propuesta = c.postulacion?.propuesta ?? {};
  const esPropio = c.id_usuario_emisor === userId;
  return {
    idPostulacion: c.id_postulacion,
    idConversacion: c.id_conversacion,
    proyecto: propuesta.titulo || 'Proyecto',
    ultimoMensaje: c.mensaje || 'Sin mensajes',
    tiempo: formatearFechaRelativa(c.fecha_envio),
    leido: c.leido || esPropio,
    contacto: {
      nombre: contactoData.nombre || 'Estudiante',
      foto_perfil: contactoData.foto_perfil || null,
      rol: contactoData.rol || 'estudiante',
    },
    esPropio,
  };
};

function ChatViewEmpresa({ idPostulacion, proyecto, contacto: contactoProp, onBack }) {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [mensajes, setMensajes] = useState([]);
  const [contacto, setContacto] = useState(contactoProp);
  const [cargando, setCargando] = useState(true);
  const [enviando, setEnviando] = useState(false);
  const [nuevoMensaje, setNuevoMensaje] = useState('');
  const chatEndRef = useRef(null);
  const chatMessagesRef = useRef(null);
  const userId = user?.id_usuario;

  // Socket.io
  const onNewMessage = useCallback((msg) => {
    setMensajes((prev) => {
      if (prev.some((m) => m.id_conversacion === msg.id_conversacion)) return prev;
      return [...prev, msg];
    });
  }, []);

  const onMessagesRead = useCallback((data) => {
    setMensajes((prev) => prev.map((m) => {
      if (m.id_usuario_emisor !== userId && (!data.id_mensaje || m.id_conversacion === data.id_mensaje)) {
        return { ...m, leido: true };
      }
      return m;
    }));
  }, [userId]);

  const { sendMessage, startTyping, stopTyping, markRead, typingUser } = useChatSocket({
    idPostulacion,
    onNewMessage,
    onMessagesRead,
    userId,
  });

  // Cargar mensajes históricos via REST
  useEffect(() => {
    let activo = true;
    setCargando(true);
    dashboardEmpresarioService.obtenerConversacion(idPostulacion)
      .then((data) => {
        if (!activo) return;
        setMensajes(data?.mensajes || data || []);
        if (data?.contacto) setContacto(data.contacto);
        dashboardEmpresarioService.marcarLeidos(idPostulacion).catch(() => {});
        markRead();
      })
      .catch(() => {})
      .finally(() => { if (activo) setCargando(false); });
    return () => { activo = false; };
  }, [idPostulacion, markRead]);

  useEffect(() => {
    if (chatMessagesRef.current && chatEndRef.current) {
      chatMessagesRef.current.scrollTop = chatEndRef.current.offsetTop - chatMessagesRef.current.offsetTop;
    }
  }, [mensajes]);

  const handleEnviar = async () => {
    const texto = nuevoMensaje.trim();
    if (!texto || enviando) return;
    setEnviando(true);
    stopTyping();
    // Intentar socket primero, fallback a REST
    if (sendMessage) {
      sendMessage(texto, (resp) => {
        if (resp?.success) {
          setMensajes((prev) => [...prev, resp.data]);
          setNuevoMensaje('');
          setEnviando(false);
        } else {
          // Fallback REST
          dashboardEmpresarioService.enviarMensaje(idPostulacion, texto)
            .then((creado) => {
              setMensajes((prev) => [...prev, creado]);
              setNuevoMensaje('');
            })
            .catch(() => alert(t(`${T_NS}.errorEnvio`)))
            .finally(() => setEnviando(false));
        }
      });
    } else {
      try {
        const creado = await dashboardEmpresarioService.enviarMensaje(idPostulacion, texto);
        setMensajes((prev) => [...prev, creado]);
        setNuevoMensaje('');
      } catch {
        alert(t(`${T_NS}.errorEnvio`));
      } finally {
        setEnviando(false);
      }
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleEnviar();
    }
  };

  const handleInputChange = (e) => {
    setNuevoMensaje(e.target.value);
    if (e.target.value) startTyping();
    else stopTyping();
  };

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
    <div className="chat-view fwd-animar-entrada">
      <div className="chat-header">
        <button className="chat-back-btn" type="button" onClick={onBack}>
          <ChevronLeft size={20} />
        </button>
        <div className="chat-header-avatar">
          {contacto?.foto_perfil ? (
            <img src={contacto.foto_perfil} alt="Imagen descriptiva" className="chat-header-avatar-img" />
          ) : (
            <span className="chat-header-avatar-inicial">{(contacto?.nombre || '?')[0]}</span>
          )}
        </div>
        <div className="chat-header-info">
          <span className="chat-header-name">{contacto?.nombre || proyecto}</span>
          <span className="chat-header-status">{proyecto}</span>
        </div>
      </div>

      <div className="chat-messages" ref={chatMessagesRef}>
        {cargando && (
          <div className="chat-loading">
            {[1, 2, 3].map((i) => <div key={i} className="chat-skeleton" />)}
          </div>
        )}

        {!cargando && mensajes.length === 0 && (
          <div className="chat-empty">
            <MessageSquare size={32} />
            <p>{t(`${T_NS}.sinMensajesChat`)}</p>
          </div>
        )}

        {!cargando && Object.entries(agruparPorFecha).map(([fecha, msgs]) => (
          <div key={fecha}>
            <div className="chat-date-separator">
              <span>{formatearFechaChat(msgs[0].fecha_envio, t)}</span>
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
        {typingUser && (
          <div className="chat-typing">
            <span className="chat-typing-dots"><span /> <span /> <span /></span>
            <span className="chat-typing-text">{typingUser} está escribiendo...</span>
          </div>
        )}
      </div>

      <div className="chat-input-bar">
        <input
          className="chat-input"
          type="text"
          placeholder={t(`${T_NS}.escribeMensaje`)}
          value={nuevoMensaje}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          disabled={enviando}
        />
        <button className="chat-send-btn" type="button" onClick={handleEnviar} disabled={enviando || !nuevoMensaje.trim()}>
          <Send size={18} />
        </button>
      </div>
    </div>
  );
}

const STORAGE_KEY = 'fwd_leidos_local_empresa';

const cargarLeidos = () => {
  try {
    return new Set(JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'));
  } catch { return new Set(); }
};

const guardarLeidos = (set) => {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify([...set])); } catch (err) { console.error('Error saving read messages to localStorage:', err); }
};

export default function Mensajes() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [conversacionActiva, setConversacionActiva] = useState(location.state?.idPostulacion || null);
  const [chatNuevoParams] = useState(location.state || null);
  const [leidosLocal, setLeidosLocal] = useState(() => cargarLeidos());
  const [busqueda, setBusqueda] = useState('');
  const userId = user?.id_usuario;

  const { data, loading, error } = useDashboardEmpresarioRequest(
    () => dashboardEmpresarioService.obtenerMensajesRecientes(),
    [],
    []
  );

  const conversaciones = useMemo(
    () => (data || []).map((c) => formatearConversacion(c, userId)),
    [data, userId]
  );

  const termino = busqueda.toLowerCase().trim();
  const conversacionesFiltradas = useMemo(
    () => termino
    ? conversaciones.filter((c) =>
        (c.contacto?.nombre || '').toLowerCase().includes(termino) ||
        (c.contacto?.cedula || '').toLowerCase().includes(termino)
      )
      : conversaciones,
    [conversaciones, termino]
  );

  const stats = useMemo(() => {
    const total = conversacionesFiltradas.length;
    const noLeidos = conversacionesFiltradas.filter((c) => !c.leido && !c.esPropio && !leidosLocal.has(c.idPostulacion)).length;
    const leidos = total - noLeidos;
    return { total, noLeidos, leidos };
  }, [conversacionesFiltradas, leidosLocal]);

  const conversationActivaData = conversaciones.find(
    (c) => c.idPostulacion === conversacionActiva
  ) || (chatNuevoParams?.idPostulacion === conversacionActiva ? {
    proyecto: chatNuevoParams.proyecto,
    contacto: chatNuevoParams.contacto
  } : null);

  const abrirChat = (id) => {
    setConversacionActiva(id);
    setLeidosLocal((prev) => {
      const nuevo = new Set(prev).add(id);
      guardarLeidos(nuevo);
      return nuevo;
    });
  };

  return (
      <div style={{ padding: '1.5rem 2rem', flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <div className="de-page-heading" style={{ borderBottom: 'none', paddingBottom: 0, marginBottom: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button className="de-project-icon-button" type="button" onClick={() => navigate('/DashboardEmpresario')}>
            <ArrowLeft size={18} />
          </button>
          <h1>{t(`${T_NS}.titulo`)}</h1>
        </div>
        {!loading && !error && (
          <span className="conteoProyectos">{t(`${T_NS}.total`, { count: conversacionesFiltradas.length })}</span>
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
          <h4>{t(`${T_NS}.sinMensajes`)}</h4>
          <p>{t(`${T_NS}.sinMensajesDesc`)}</p>
        </div>
      )}

      {!loading && !error && conversaciones.length > 0 && (
        <div className="mensajes-flex">
          <div className="mensajes-sidebar">
            <div className="mensajes-sidebar-header">
              <Inbox size={16} />
              <span>{t(`${T_NS}.conversaciones`)}</span>
              <span className="mensajes-sidebar-count">{stats.total}</span>
            </div>
            <div className="mensajes-sidebar-busqueda">
              <Search size={14} />
              <input
                type="text"
                className="mensajes-buscar-input"
                placeholder={t(`${T_NS}.buscarPlaceholder`)}
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
              />
              {busqueda && (
                <button
                  type="button"
                  className="mensajes-buscar-limpiar"
                  onClick={() => setBusqueda('')}
                  aria-label="Limpiar búsqueda"
                >
                  &times;
                </button>
              )}
            </div>
            {termino && conversacionesFiltradas.length === 0 && (
              <div className="mensajes-sidebar-empty-busqueda">
                <SearchX size={24} />
                <p>{t(`${T_NS}.sinResultados`, { termino: busqueda })}</p>
              </div>
            )}
            <div className="mensajes-sidebar-list">
              {conversacionesFiltradas.map((c) => {
                const RoleIcon = ROLE_ICONS[c.contacto?.rol] || User;
                const inicial = (c.contacto?.nombre || '?')[0].toUpperCase();
                const activa = c.idPostulacion === conversacionActiva;
                return (
                  <div
                    key={c.idPostulacion}
                    className={`mensajes-item${!c.leido && !c.esPropio && !leidosLocal.has(c.idPostulacion) ? ' unread' : ''}${activa ? ' active' : ''}`}
                    onClick={() => abrirChat(c.idPostulacion)}
                  >
                    <div className={`mensajes-item-avatar${!c.leido && !c.esPropio && !leidosLocal.has(c.idPostulacion) ? ' unread' : ''}`}>
                      {c.contacto?.foto_perfil ? (
                        <img src={c.contacto.foto_perfil} alt="Imagen descriptiva" className="mensajes-avatar-img" />
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
                              {c.contacto.rol === 'estudiante' ? t(`${T_NS}.egresado`) : c.contacto.rol === 'empresa' ? t(`${T_NS}.empresa`) : t(`${T_NS}.admin`)}
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
                    {!c.leido && !c.esPropio && !leidosLocal.has(c.idPostulacion) && <span className="mensajes-item-dot" />}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mensajes-chat-panel">
            {conversacionActiva && conversationActivaData ? (
              <ChatViewEmpresa
                idPostulacion={conversacionActiva}
                proyecto={conversationActivaData.proyecto}
                contacto={conversationActivaData.contacto}
                onBack={() => setConversacionActiva(null)}
              />
            ) : (
              <div className="mensajes-chat-empty">
                <MessageSquare size={48} />
                <h4>{t(`${T_NS}.seleccionaConversacion`)}</h4>
                <p>{t(`${T_NS}.seleccionaDesc`)}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
