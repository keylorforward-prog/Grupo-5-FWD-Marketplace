import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {
  HelpCircle, ChevronDown, Mail, MessageSquare, FileText,
  ExternalLink, Search, User, Settings, Send, X, Check,
  LifeBuoy, MessagesSquare,
} from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import DashboardLayout from '../DashboardEgresado/components/DashboardLayout';
import './styles/Soporte.css';

const faqData = [
  { key: 'postulaciones', preguntaKey: 'faq.postulaciones.pregunta', respuestaKey: 'faq.postulaciones.respuesta' },
  { key: 'proyectos', preguntaKey: 'faq.proyectos.pregunta', respuestaKey: 'faq.proyectos.respuesta' },
  { key: 'perfil', preguntaKey: 'faq.perfil.pregunta', respuestaKey: 'faq.perfil.respuesta' },
  { key: 'mensajes', preguntaKey: 'faq.mensajes.pregunta', respuestaKey: 'faq.mensajes.respuesta' },
  { key: 'cuenta', preguntaKey: 'faq.cuenta.pregunta', respuestaKey: 'faq.cuenta.respuesta' },
  { key: 'notificaciones', preguntaKey: 'faq.notificaciones.pregunta', respuestaKey: 'faq.notificaciones.respuesta' },
  { key: 'privacidad', preguntaKey: 'faq.privacidad.pregunta', respuestaKey: 'faq.privacidad.respuesta' },
];

const quickActions = [
  { key: 'perfil', icon: User, path: '/egresado/perfil', color: 'var(--primary)' },
  { key: 'mensajes', icon: MessagesSquare, path: '/egresado/dashboard/mensajes', color: 'var(--accent)' },
  { key: 'configuracion', icon: Settings, path: '/egresado/configuracion', color: 'var(--magenta)' },
];

function Soporte() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [faqAbierto, setFaqAbierto] = useState(null);
  const [busqueda, setBusqueda] = useState('');
  const [formularioAbierto, setFormularioAbierto] = useState(false);
  const [formEnviado, setFormEnviado] = useState(false);
  const [form, setForm] = useState({ nombre: '', email: '', asunto: '', mensaje: '' });
  const [formError, setFormError] = useState('');

  const alternarFaq = (key) => {
    setFaqAbierto((prev) => (prev === key ? null : key));
  };

  const expandirTodo = () => {
    if (faqAbierto === '__todas') {
      setFaqAbierto(null);
    } else {
      setFaqAbierto('__todas');
    }
  };
  const todoExpandido = faqAbierto === '__todas';

  const faqFiltradas = faqData.filter((item) => {
    if (!busqueda.trim()) return true;
    const q = busqueda.toLowerCase();
    const pregunta = t(`egresadoSoporte.${item.preguntaKey}`).toLowerCase();
    const respuesta = t(`egresadoSoporte.${item.respuestaKey}`).toLowerCase();
    return pregunta.includes(q) || respuesta.includes(q);
  });

  const abrirFormulario = () => {
    setForm({
      nombre: user?.nombre || '',
      email: user?.correo || user?.email || '',
      asunto: '',
      mensaje: '',
    });
    setFormError('');
    setFormEnviado(false);
    setFormularioAbierto(true);
  };

  const manejarForm = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setFormError('');
  };

  const enviarFormulario = () => {
    if (!form.nombre.trim() || !form.email.trim() || !form.asunto.trim() || !form.mensaje.trim()) {
      setFormError('Por favor completa todos los campos.');
      return;
    }
    const mailtoLink = `mailto:soporte@fwd.com?subject=${encodeURIComponent(form.asunto)}&body=${encodeURIComponent(
      `Nombre: ${form.nombre}\nEmail: ${form.email}\n\n${form.mensaje}`
    )}`;
    window.open(mailtoLink, '_blank');
    setFormEnviado(true);
    setTimeout(() => {
      setFormularioAbierto(false);
      setFormEnviado(false);
    }, 2500);
  };

  return (
    <DashboardLayout>
      <div className="soporte-page">
        <div className="soporte-header">
          <span className="soporte-kicker">{t('egresadoSoporte.kicker')}</span>
          <h1 className="soporte-titulo">
            {t('egresadoSoporte.titulo')}<span className="soporte-punto">.</span>
          </h1>
          <p className="soporte-subtitulo">{t('egresadoSoporte.subtitulo')}</p>
        </div>

        <div className="soporte-busqueda">
          <Search size={18} className="soporte-busqueda-icono" />
          <input
            type="text"
            className="soporte-busqueda-input"
            placeholder={t('egresadoSoporte.buscarPlaceholder')}
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>

        <div className="soporte-acciones-rapidas">
          <h3 className="soporte-acciones-titulo">{t('egresadoSoporte.accionesRapidas.titulo')}</h3>
          <div className="soporte-acciones-grid">
            {quickActions.map((accion) => {
              const Icono = accion.icon;
              return (
                <button
                  key={accion.key}
                  className="soporte-accion"
                  type="button"
                  onClick={() => navigate(accion.path)}
                >
                  <span className="soporte-accion-icono" style={{ background: `color-mix(in srgb, ${accion.color} 14%, transparent)`, color: accion.color }}>
                    <Icono size={18} />
                  </span>
                  <span className="soporte-accion-label">{t(`egresadoSoporte.accionesRapidas.${accion.key}`)}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="soporte-canales">
          <button className="soporte-canal" type="button" onClick={abrirFormulario}>
            <div className="soporte-canal-icono" style={{ background: 'color-mix(in srgb, var(--primary) 14%, transparent)', color: 'var(--primary)' }}>
              <Mail size={20} />
            </div>
            <div className="soporte-canal-info">
              <h4>{t('egresadoSoporte.canales.correo.titulo')}</h4>
              <p>{t('egresadoSoporte.canales.correo.desc')}</p>
            </div>
            <ExternalLink size={16} className="soporte-canal-flecha" />
          </button>

          <button className="soporte-canal" type="button" onClick={() => navigate('/egresado/dashboard/mensajes')}>
            <div className="soporte-canal-icono" style={{ background: 'color-mix(in srgb, var(--accent) 14%, transparent)', color: 'var(--accent)' }}>
              <MessageSquare size={20} />
            </div>
            <div className="soporte-canal-info">
              <h4>{t('egresadoSoporte.canales.chat.titulo')}</h4>
              <p>{t('egresadoSoporte.canales.chat.desc')}</p>
            </div>
            <ExternalLink size={16} className="soporte-canal-flecha" />
          </button>

          <button className="soporte-canal" type="button" onClick={() => navigate('/terminos')}>
            <div className="soporte-canal-icono" style={{ background: 'color-mix(in srgb, var(--magenta) 14%, transparent)', color: 'var(--magenta)' }}>
              <FileText size={20} />
            </div>
            <div className="soporte-canal-info">
              <h4>{t('egresadoSoporte.canales.terminos.titulo')}</h4>
              <p>{t('egresadoSoporte.canales.terminos.desc')}</p>
            </div>
            <ExternalLink size={16} className="soporte-canal-flecha" />
          </button>
        </div>

        <div className="soporte-faq">
          <div className="soporte-faq-cabecera">
            <h2 className="soporte-faq-titulo">
              <HelpCircle size={18} />
              {t('egresadoSoporte.faq.titulo')}
            </h2>
            <button className="soporte-faq-toggle-all" type="button" onClick={expandirTodo}>
              {todoExpandido ? t('egresadoSoporte.faq.colapsarTodo') : t('egresadoSoporte.faq.expandirTodo')}
            </button>
          </div>

          {faqFiltradas.length === 0 ? (
            <div className="soporte-faq-vacio">
              <LifeBuoy size={32} />
              <p>{t('egresadoSoporte.faq.sinResultados')}</p>
            </div>
          ) : (
            <div className="soporte-faq-lista">
              {faqFiltradas.map((item) => {
                const abierto = todoExpandido || faqAbierto === item.key;
                return (
                  <div key={item.key} className={`soporte-faq-item ${abierto ? 'abierto' : ''}`}>
                    <button
                      className="soporte-faq-pregunta"
                      type="button"
                      onClick={() => alternarFaq(item.key)}
                    >
                      <span>{t(`egresadoSoporte.${item.preguntaKey}`)}</span>
                      <ChevronDown size={16} className={`soporte-faq-chevron ${abierto ? 'rotado' : ''}`} />
                    </button>
                    {abierto && (
                      <div className="soporte-faq-respuesta">
                        <p>{t(`egresadoSoporte.${item.respuestaKey}`)}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="soporte-pie">
          <p>{t('egresadoSoporte.pie.texto')}</p>
          <div className="soporte-pie-enlaces">
            <button className="soporte-pie-link" type="button" onClick={() => navigate('/terminos')}>
              {t('empresaLayout.footer.terms')}
            </button>
            <button className="soporte-pie-link" type="button" onClick={() => navigate('/privacidad')}>
              {t('empresaLayout.footer.privacy')}
            </button>
            <button className="soporte-pie-link" type="button" onClick={() => navigate('/contacto')}>
              {t('empresaLayout.footer.contact')}
            </button>
          </div>
        </div>
      </div>

      {formularioAbierto && (
        <div className="soporte-modal-overlay" onClick={() => { if (!formEnviado) setFormularioAbierto(false); }}>
          <div className="soporte-modal" onClick={(e) => e.stopPropagation()}>
            {formEnviado ? (
              <div className="soporte-modal-exito">
                <div className="soporte-modal-exito-icono">
                  <Check size={32} />
                </div>
                <h3>{t('egresadoSoporte.formulario.exito')}</h3>
                <p>{t('egresadoSoporte.formulario.exitoDesc')}</p>
              </div>
            ) : (
              <>
                <div className="soporte-modal-cabecera">
                  <h3>{t('egresadoSoporte.formulario.titulo')}</h3>
                  <button className="soporte-modal-cerrar" type="button" onClick={() => setFormularioAbierto(false)}>
                    <X size={18} />
                  </button>
                </div>
                <div className="soporte-modal-cuerpo">
                  <div className="soporte-modal-campo">
                    <label>{t('egresadoSoporte.formulario.nombre')}</label>
                    <input
                      type="text"
                      name="nombre"
                      className="soporte-modal-input"
                      value={form.nombre}
                      onChange={manejarForm}
                      placeholder={t('egresadoSoporte.formulario.nombrePlaceholder')}
                    />
                  </div>
                  <div className="soporte-modal-campo">
                    <label>{t('egresadoSoporte.formulario.email')}</label>
                    <input
                      type="email"
                      name="email"
                      className="soporte-modal-input"
                      value={form.email}
                      onChange={manejarForm}
                      placeholder={t('egresadoSoporte.formulario.emailPlaceholder')}
                    />
                  </div>
                  <div className="soporte-modal-campo">
                    <label>{t('egresadoSoporte.formulario.asunto')}</label>
                    <input
                      type="text"
                      name="asunto"
                      className="soporte-modal-input"
                      value={form.asunto}
                      onChange={manejarForm}
                      placeholder={t('egresadoSoporte.formulario.asuntoPlaceholder')}
                    />
                  </div>
                  <div className="soporte-modal-campo">
                    <label>{t('egresadoSoporte.formulario.mensaje')}</label>
                    <textarea
                      name="mensaje"
                      className="soporte-modal-textarea"
                      value={form.mensaje}
                      onChange={manejarForm}
                      placeholder={t('egresadoSoporte.formulario.mensajePlaceholder')}
                      rows={4}
                    />
                  </div>
                  {formError && <div className="soporte-modal-error">{formError}</div>}
                </div>
                <div className="soporte-modal-acciones">
                  <button className="soporte-modal-btn secundario" type="button" onClick={() => setFormularioAbierto(false)}>
                    {t('egresadoSoporte.formulario.cancelar')}
                  </button>
                  <button className="soporte-modal-btn primario" type="button" onClick={enviarFormulario}>
                    <Send size={14} />
                    {t('egresadoSoporte.formulario.enviar')}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

export default Soporte;
