import { useEffect, useId, useMemo, useRef } from 'react';
import { Award, ExternalLink, Mail, MapPin, Phone, X } from 'lucide-react';
import '../DashboardEmpresario.css';

const AVATAR_DEFECTO = '/Imgs/Logotipo/Digital/Sintesis/FWD - Sintesis-01.png';

const esUrl = (valor) => /^https?:\/\//i.test(valor || '');

const separarLista = (valor) => {
  if (!valor) return [];
  if (Array.isArray(valor)) return valor;
  return String(valor)
    .split(/[,;\n]/)
    .map((item) => item.trim())
    .filter(Boolean);
};

const fechaValida = (valor) => {
  if (!valor) return null;
  const fecha = new Date(valor);
  return Number.isNaN(fecha.getTime()) ? null : fecha;
};

const formatearPeriodo = (proyecto) => {
  const inicio = fechaValida(proyecto.fecha_inicio)?.toLocaleDateString('es-CR') || null;
  const fin = fechaValida(proyecto.fecha_fin)?.toLocaleDateString('es-CR') || null;
  if (inicio && fin) return `${inicio} - ${fin}`;
  if (inicio) return `Desde ${inicio}`;
  if (fin) return `Hasta ${fin}`;
  return proyecto.tipo || 'Proyecto';
};

export default function PerfilEgresadoModal({ perfil, onClose }) {
  const closeButtonRef = useRef(null);
  const tituloId = useId();
  const descripcionId = useId();

  useEffect(() => {
    if (!perfil) return undefined;

    const overflowAnterior = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeButtonRef.current?.focus();

    const cerrarConEscape = (event) => {
      if (event.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', cerrarConEscape);
    return () => {
      document.body.style.overflow = overflowAnterior;
      document.removeEventListener('keydown', cerrarConEscape);
    };
  }, [perfil, onClose]);

  const proyectosOrdenados = useMemo(() => {
    const proyectos = perfil?.historialProyectos || [];
    return [...proyectos].sort((a, b) => {
      const fechaA = fechaValida(a.fecha_fin || a.fecha_inicio || a.fecha_registro)?.getTime() || 0;
      const fechaB = fechaValida(b.fecha_fin || b.fecha_inicio || b.fecha_registro)?.getTime() || 0;
      return fechaB - fechaA;
    });
  }, [perfil]);

  if (!perfil) return null;

  const habilidades = separarLista(perfil.skills || perfil.curriculum?.habilidades);
  const evidenciaFwd = perfil.evidenceFwd || (esUrl(perfil.titleFwd) ? perfil.titleFwd : null);
  const tituloFwd = evidenciaFwd ? 'Evidencia FWD' : perfil.titleFwd || 'Titulo FWD no registrado';
  const correoHref = perfil.email ? `mailto:${perfil.email}` : null;
  const telefonoHref = perfil.phone ? `tel:${String(perfil.phone).replace(/[^\d+]/g, '')}` : null;

  return (
    <div
      className="de-modal-backdrop"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        className="de-graduate-modal de-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby={tituloId}
        aria-describedby={descripcionId}
      >
        <div className="de-modal-header">
          <div className="de-graduate-modal-user">
            <img
              src={perfil.avatar || AVATAR_DEFECTO}
              alt={perfil.name}
              className="de-graduate-modal-avatar"
              onError={(event) => { event.currentTarget.src = AVATAR_DEFECTO; }}
            />
            <div>
              <h3 id={tituloId}>{perfil.name}</h3>
              <p>{tituloFwd}</p>
            </div>
          </div>
          <button ref={closeButtonRef} className="de-modal-close" type="button" onClick={onClose} aria-label="Cerrar perfil">
            <X size={18} />
          </button>
        </div>

        <div id={descripcionId} className="de-graduate-modal-meta">
          <span><MapPin size={15} />{perfil.location}</span>
          {correoHref && <a href={correoHref}><Mail size={15} />{perfil.email}</a>}
          {telefonoHref && <a href={telefonoHref}><Phone size={15} />{perfil.phone}</a>}
        </div>

        <p className="de-graduate-modal-bio">{perfil.bio}</p>

        {evidenciaFwd && (
          <a className="de-graduate-evidence" href={evidenciaFwd} target="_blank" rel="noreferrer">
            <Award size={18} />
            <span>Ver titulo o evidencia FWD</span>
            <ExternalLink size={16} />
          </a>
        )}

        <div className="de-graduate-modal-grid">
          <section>
            <h4>Habilidades</h4>
            <div className="de-graduate-skill-list">
              {habilidades.length ? habilidades.map((habilidad) => (
                <span key={habilidad}>{habilidad}</span>
              )) : <p className="de-graduate-empty">Sin habilidades registradas.</p>}
            </div>
          </section>

          <section>
            <h4>Resumen</h4>
            <dl className="de-graduate-stats">
              <div>
                <dt>Calificacion</dt>
                <dd>{perfil.rating}</dd>
              </div>
              <div>
                <dt>Proyectos</dt>
                <dd>{perfil.projects}</dd>
              </div>
              <div>
                <dt>Coincidencia</dt>
                <dd>{perfil.match}%</dd>
              </div>
            </dl>
          </section>
        </div>

        <section className="de-graduate-projects">
          <div className="de-graduate-section-title">
            <h4>Proyectos realizados</h4>
            <span>{proyectosOrdenados.length}</span>
          </div>
          {proyectosOrdenados.length ? (
            <div className="de-graduate-project-list">
              {proyectosOrdenados.map((proyecto, index) => (
                <article key={proyecto.id_historial_estudiante || `${proyecto.titulo_proyecto}-${index}`} className="de-graduate-project">
                  <div>
                    <strong>{proyecto.titulo_proyecto}</strong>
                    <span>{formatearPeriodo(proyecto)}</span>
                  </div>
                  {proyecto.descripcion && <p>{proyecto.descripcion}</p>}
                  {proyecto.tecnologias && <small>{proyecto.tecnologias}</small>}
                  {esUrl(proyecto.enlace) && (
                    <a href={proyecto.enlace} target="_blank" rel="noreferrer">
                      Abrir enlace <ExternalLink size={13} />
                    </a>
                  )}
                </article>
              ))}
            </div>
          ) : (
            <p className="de-graduate-empty">Este egresado aun no tiene proyectos registrados.</p>
          )}
        </section>
      </section>
    </div>
  );
}
