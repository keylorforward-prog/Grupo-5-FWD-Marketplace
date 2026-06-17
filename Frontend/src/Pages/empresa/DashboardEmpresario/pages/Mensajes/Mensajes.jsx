import { useState, useMemo, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MessageSquare, SearchX, Mail, MailOpen, Inbox, Send, ChevronLeft, User, Building, Shield } from 'lucide-react';
import { dashboardEmpresarioService } from '../../../../../services/dashboardEmpresarioService';
import { useAuth } from '../../../../../context/AuthContext';
import DashboardLayout from '../../components/DashboardLayout';
import EstadoDatos from '../../components/EstadoDatos';
import { useDashboardEmpresarioRequest } from '../../hooks/useDashboardEmpresarioRequest';
import { formatearMensaje } from '../../utils/dashboardEmpresarioFormatters';
import '../../../../egresado/DashboardEgresado/styles/DashboardEgresado.css';

const ROLE_ICONS = {
  admin: Shield,
  empresa: Building,
  estudiante: User,
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

const formatearConversacion = (c) => {
  const estudiante = c.postulacion?.perfilEstudiante?.usuario;
  const propuesta = c.postulacion?.propuesta ?? {};
  return {
    idPostulacion: c.id_postulacion,
    idConversacion: c.id_conversacion,
    proyecto: propuesta.titulo || 'Proyecto',
    ultimoMensaje: c.mensaje || 'Sin mensajes',
    tiempo: formatearFechaRelativa(c.fecha_envio),
    leido: c.leido,
    contacto: {
      nombre: estudiante?.nombre || 'Estudiante',
      foto_perfil: estudiante?.foto_perfil || null,
      rol: 'estudiante',
    },
  };
};

function ChatViewEmpresa({ idPostulacion, proyecto, contacto: contactoProp, onBack }) {
  const { user } = useAuth();
  const [mensajes, setMensajes] = useState([]);
  const [contacto, setContacto] = useState(contactoProp);
  const [cargando, setCargando] = useState(true);
  const [enviando, setEnviando] = useState(false);
  const [nuevoMensaje, setNuevoMensaje] = useState('');
  const chatEndRef = useRef(null);
  const chatMessagesRef = useRef(null);

  useEffect(() => {
    let activo = true;
    setCargando(true);
    dashboardEmpresarioService.obtenerConversacion(idPostulacion)
      .then((data) => {
        if (!activo) return;
        setMensajes(data?.mensajes || data || []);
        if (data?.contacto) setContacto(data.contacto);
        dashboardEmpresarioService.marcarLeidos(idPostulacion).catch(() => {});
      })
      .catch(() => {})
      .finally(() => { if (activo) setCargando(false); });
    return () => { activo = false; };
  }, [idPostulacion]);

  useEffect(() => {
    if (chatMessagesRef.current && chatEndRef.current) {
      chatMessagesRef.current.scrollTop = chatEndRef.current.offsetTop - chatMessagesRef.current.offsetTop;
    }
  }, [mensajes]);

  const userId = user?.id_usuario;

  const handleEnviar = async () => {
    const texto = nuevoMensaje.trim();
    if (!texto || enviando) return;
    setEnviando(true);
    try {
      const creado = await dashboardEmpresarioService.enviarMensaje(idPostulacion, texto);
      setMensajes((prev) => [...prev, creado]);
      setNuevoMensaje('');
    } catch {
      alert('Error al enviar el mensaje.');
    } finally {
      setEnviando(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleEnviar();
    }
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

      <div className="chat-messages" ref={chatMessagesRef}>
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
          value={nuevoMensaje}
          onChange={(e) => setNuevoMensaje(e.target.value)}
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
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify([...set])); } catch {}
};

export default function Mensajes() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [conversacionActiva, setConversacionActiva] = useState(null);
  const [leidosLocal, setLeidosLocal] = useState(() => cargarLeidos());

  const { data, loading, error } = useDashboardEmpresarioRequest(
    () => dashboardEmpresarioService.obtenerMensajesRecientes(),
    [],
    []
  );

  const conversaciones = useMemo(() => (data || []).map(formatearConversacion), [data]);

  const stats = useMemo(() => {
    const total = conversaciones.length;
    const noLeidos = conversaciones.filter((c) => !c.leido && !leidosLocal.has(c.idPostulacion)).length;
    const leidos = total - noLeidos;
    return { total, noLeidos, leidos };
  }, [conversaciones, leidosLocal]);

  const conversationActivaData = conversaciones.find(
    (c) => c.idPostulacion === conversacionActiva
  );

  const abrirChat = (id) => {
    setConversacionActiva(id);
    setLeidosLocal((prev) => {
      const nuevo = new Set(prev).add(id);
      guardarLeidos(nuevo);
      return nuevo;
    });
  };

  return (
    <DashboardLayout activePage="mensajes">
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
        <button className="de-project-icon-button" type="button" onClick={() => navigate('/DashboardEmpresario')}>
          <ArrowLeft size={18} />
        </button>
        <h1 style={{ margin: 0 }}>Mensajes</h1>
        {!loading && !error && (
          <span style={{ fontSize: '0.8rem', color: 'var(--ink-subtle)' }}>{conversaciones.length} conversacione{conversaciones.length !== 1 ? 's' : ''}</span>
        )}
      </div>

      {loading && (
        <div className="mensajes-loading">
          {[1, 2, 3].map((i) => (
            <div key={i} className="mensajes-skeleton" />
          ))}
        </div>
      )}

      {error && <EstadoDatos loading={false} error={error} />}

      {!loading && !error && conversaciones.length === 0 && (
        <EstadoDatos loading={false} error={null} empty={true} emptyText="No hay mensajes recientes." />
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
                    className={`mensajes-item${!c.leido && !leidosLocal.has(c.idPostulacion) ? ' unread' : ''}${activa ? ' active' : ''}`}
                    onClick={() => abrirChat(c.idPostulacion)}
                  >
                    <div className={`mensajes-item-avatar${!c.leido && !leidosLocal.has(c.idPostulacion) ? ' unread' : ''}`}>
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
                              Estudiante
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
                    {!c.leido && !leidosLocal.has(c.idPostulacion) && <span className="mensajes-item-dot" />}
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
                <h4>Selecciona una conversación</h4>
                <p>Elige un chat del panel izquierdo para ver los mensajes.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}