import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft, DollarSign, Clock, Tag, Globe, Building2,
  Send, ExternalLink, Briefcase, Calendar, CheckCircle, X, AlertTriangle,
} from 'lucide-react';
import { egresadoService } from '../../../../../services/egresadoService';
import { egresadoDashboardService } from '../../../../../services/egresadoDashboardService';
import { categoriasProyecto } from '../../../../../data/proyectosEgresado';

const etiquetaModalidad = { remoto: 'Remoto', hibrido: 'Híbrido', presencial: 'Presencial' };
const etiquetaCategoria = Object.fromEntries(
  categoriasProyecto.filter((c) => c.valor !== 'todas').map((c) => [c.valor, c.etiqueta])
);

const formatoMoneda = new Intl.NumberFormat('en-US', {
  style: 'currency', currency: 'USD', maximumFractionDigits: 0,
});

export default function ProyectoDetalle() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [proyecto, setProyecto] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [postulado, setPostulado] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [mostrarModal, setMostrarModal] = useState(false);

  useEffect(() => {
    let activo = true;
    egresadoService.obtenerPropuestaPorId(id)
      .then((data) => { if (activo) setProyecto(data); })
      .catch((err) => { if (activo) setError(err.message); })
      .finally(() => { if (activo) setCargando(false); });
    egresadoDashboardService.obtenerPostulaciones()
      .then((data) => {
        if (!activo) return;
        const yaPostulado = (data || []).some(
          (p) => p.id_propuesta === Number(id) || p.propuesta?.id_propuesta === Number(id)
        );
        setPostulado(yaPostulado);
      })
      .catch(() => {});
    return () => { activo = false; };
  }, [id]);

  const confirmarPostulacion = async () => {
    setEnviando(true);
    try {
      await egresadoService.postularse(Number(id));
      setPostulado(true);
      setMostrarModal(false);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setEnviando(false);
    }
  };

  if (cargando) {
    return (
      <div className="detalle-container">
        <div className="de-data-state">Cargando proyecto...</div>
      </div>
    );
  }

  if (error && !proyecto) {
    return (
      <div className="detalle-container">
        <div className="de-data-state error">{error}</div>
        <button className="detalle-volver" type="button" onClick={() => navigate('/egresado/dashboard/explorar')}>
          <ArrowLeft size={16} /> Volver a explorar
        </button>
      </div>
    );
  }
  if (!proyecto) return null;

  const empresa = proyecto.perfil_empresario ?? {};
  const usuarioEmpresa = empresa.usuario ?? {};
  const tecnologias = (proyecto.tecnologias_requeridas || '').split(',').map((t) => t.trim()).filter(Boolean);
  const presupuestoMin = Number(proyecto.presupuesto_min) || 0;
  const presupuestoMax = Number(proyecto.presupuesto_max) || presupuestoMin;

  return (
    <div className="detalle-container">
      <button className="detalle-volver" type="button" onClick={() => navigate('/egresado/dashboard/explorar')}>
        <ArrowLeft size={16} /> Volver a proyectos
      </button>

      {error && postulado === false && (
        <div className="de-data-state error" style={{ marginBottom: '1rem' }}>{error}</div>
      )}

      <div className="detalle-grid">
        <div className="detalle-main">
          <div className="detalle-header">
            <div className="detalle-icono">
              <span className="detalle-iconoLetra">{proyecto.titulo?.charAt(0)}</span>
            </div>
            <div className="detalle-headerInfo">
              <h1 className="detalle-titulo">{proyecto.titulo}</h1>
              <div className="detalle-badges">
                <span className="detalle-badge detalle-badgeCategoria">
                  <Tag size={13} />
                  {etiquetaCategoria[proyecto.categoria] ?? proyecto.categoria}
                </span>
                <span className="detalle-badge detalle-badgeModalidad">
                  <Globe size={13} />
                  {etiquetaModalidad[proyecto.modalidad] ?? proyecto.modalidad}
                </span>
                <span className={`detalle-badge detalle-badgeEstado ${(proyecto.estado || '').toLowerCase()}`}>
                  {proyecto.estado}
                </span>
              </div>
            </div>
          </div>

          <div className="detalle-metas">
            <div className="detalle-metaItem">
              <DollarSign size={16} />
              <div>
                <span className="detalle-metaLabel">Presupuesto</span>
                <span className="detalle-metaValor">
                  {formatoMoneda.format(presupuestoMin)} – {formatoMoneda.format(presupuestoMax)}
                </span>
              </div>
            </div>
            <div className="detalle-metaItem">
              <Clock size={16} />
              <div>
                <span className="detalle-metaLabel">Plazo de entrega</span>
                <span className="detalle-metaValor">{proyecto.plazo_dias} días</span>
              </div>
            </div>
            <div className="detalle-metaItem">
              <Calendar size={16} />
              <div>
                <span className="detalle-metaLabel">Publicado</span>
                <span className="detalle-metaValor">
                  {proyecto.fecha_publicacion
                    ? new Date(proyecto.fecha_publicacion).toLocaleDateString()
                    : '—'}
                </span>
              </div>
            </div>
          </div>

          <div className="detalle-seccion">
            <h2 className="detalle-seccionTitulo">Descripción del proyecto</h2>
            <p className="detalle-descripcion">{proyecto.descripcion}</p>
          </div>

          {tecnologias.length > 0 && (
            <div className="detalle-seccion">
              <h2 className="detalle-seccionTitulo">Tecnologías requeridas</h2>
              <div className="detalle-techs">
                {tecnologias.map((tech) => (
                  <span key={tech} className="etiquetaTecnologia detalle-tech">{tech}</span>
                ))}
              </div>
            </div>
          )}

          {postulado ? (
            <div className="detalle-exito">
              <CheckCircle size={20} />
              <span>Ya te has postulado a este proyecto. La empresa revisará tu solicitud.</span>
            </div>
          ) : (
            <button
              type="button"
              className="detalle-postularBtn"
              onClick={() => setMostrarModal(true)}
            >
              <Send size={16} />
              Postularme a este proyecto
            </button>
          )}
        </div>

        <aside className="detalle-sidebar">
          <div className="detalle-sideCard">
            <div className="detalle-sideHeader">
              <Building2 size={18} />
              <h3>Sobre la empresa</h3>
            </div>
            <div className="detalle-empresaInfo">
              <div className="detalle-empresaAvatar">
                {usuarioEmpresa.nombre?.charAt(0) || 'E'}
              </div>
              <div>
                <h4 className="detalle-empresaNombre">{usuarioEmpresa.nombre || 'Empresa'}</h4>
                {empresa.sector && (
                  <p className="detalle-empresaSector">{empresa.sector}</p>
                )}
              </div>
            </div>
            {empresa.descripcion && (
              <p className="detalle-empresaDesc">{empresa.descripcion}</p>
            )}
            {empresa.sitio_web && (
              <a
                href={empresa.sitio_web}
                target="_blank"
                rel="noopener noreferrer"
                className="detalle-empresaWeb"
              >
                <ExternalLink size={14} /> Sitio web
              </a>
            )}
          </div>

          <div className="detalle-sideCard">
            <div className="detalle-sideHeader">
              <Briefcase size={18} />
              <h3>Detalles</h3>
            </div>
            <dl className="detalle-dl">
              <dt>Modalidad</dt>
              <dd>{etiquetaModalidad[proyecto.modalidad] ?? proyecto.modalidad}</dd>
              <dt>Plazo</dt>
              <dd>{proyecto.plazo_dias} días</dd>
              <dt>Presupuesto min.</dt>
              <dd>{formatoMoneda.format(presupuestoMin)}</dd>
              <dt>Presupuesto máx.</dt>
              <dd>{formatoMoneda.format(presupuestoMax)}</dd>
              <dt>Publicado</dt>
              <dd>{proyecto.fecha_publicacion ? new Date(proyecto.fecha_publicacion).toLocaleDateString() : '—'}</dd>
            </dl>
          </div>
        </aside>
      </div>

      {mostrarModal && (
        <div className="modal-overlay" onClick={() => setMostrarModal(false)}>
          <div className="modal-contenido" onClick={(e) => e.stopPropagation()}>
            <button className="modal-cerrar" type="button" onClick={() => setMostrarModal(false)}>
              <X size={18} />
            </button>
            <div className="modal-icono">
              <AlertTriangle size={28} />
            </div>
            <h2 className="modal-titulo">Confirmar postulación</h2>
            <p className="modal-desc">
              ¿Estás seguro de que deseas postularte a este proyecto?
            </p>
            <div className="modal-resumen">
              <div className="modal-resumenItem">
                <span className="modal-resumenLabel">Proyecto</span>
                <span className="modal-resumenValor">{proyecto.titulo}</span>
              </div>
              <div className="modal-resumenItem">
                <span className="modal-resumenLabel">Empresa</span>
                <span className="modal-resumenValor">{usuarioEmpresa.nombre || '—'}</span>
              </div>
              <div className="modal-resumenItem">
                <span className="modal-resumenLabel">Presupuesto</span>
                <span className="modal-resumenValor">{formatoMoneda.format(presupuestoMin)} – {formatoMoneda.format(presupuestoMax)}</span>
              </div>
              <div className="modal-resumenItem">
                <span className="modal-resumenLabel">Plazo</span>
                <span className="modal-resumenValor">{proyecto.plazo_dias} días</span>
              </div>
            </div>
            <div className="modal-acciones">
              <button
                type="button"
                className="modal-btn modal-btn-secondary"
                onClick={() => setMostrarModal(false)}
                disabled={enviando}
              >
                Cancelar
              </button>
              <button
                type="button"
                className="modal-btn modal-btn-primary"
                onClick={confirmarPostulacion}
                disabled={enviando}
              >
                {enviando ? 'Enviando...' : 'Sí, postularme'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
