import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft, Briefcase, DollarSign, Clock, Tag, Globe, Building2,
  Send, ExternalLink, Calendar, CheckCircle, X, AlertTriangle,
} from 'lucide-react';
import { egresadoService } from '../../../../../services/egresadoService';
import { egresadoDashboardService } from '../../../../../services/egresadoDashboardService';

const etiquetaModalidad = { remoto: 'Remoto', hibrido: 'Híbrido', presencial: 'Presencial' };

const formatoSalario = new Intl.NumberFormat('es-CR', {
  style: 'currency', currency: 'CRC', maximumFractionDigits: 0,
});

export default function DetalleEmpleo() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [empleo, setEmpleo] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [postulado, setPostulado] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [mostrarModal, setMostrarModal] = useState(false);

  useEffect(() => {
    let activo = true;
    egresadoService.obtenerPropuestaPorId(id)
      .then((data) => { if (activo) setEmpleo(data); })
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
        <div className="de-data-state">Cargando empleo...</div>
      </div>
    );
  }

  if (error && !empleo) {
    return (
      <div className="detalle-container">
        <div className="de-data-state error">{error}</div>
        <button className="detalle-volver" type="button" onClick={() => navigate('/egresado/dashboard/explorar-empleos')}>
          <ArrowLeft size={16} /> Volver a empleos
        </button>
      </div>
    );
  }
  if (!empleo) return null;

  const empresa = empleo.perfilEmpresario ?? {};
  const usuarioEmpresa = empresa.usuario ?? {};
  const tecnologias = (typeof empleo.tecnologias_requeridas === 'string' ? empleo.tecnologias_requeridas : '').split(',').map((t) => t.trim()).filter(Boolean);
  const salarioMin = Number(empleo.presupuesto_min) || 0;
  const salarioMax = Number(empleo.presupuesto_max) || salarioMin;

  return (
    <div className="detalle-container fwd-animar-entrada">
      <button className="detalle-volver" type="button" onClick={() => navigate('/egresado/dashboard/explorar-empleos')}>
        <ArrowLeft size={16} /> Volver a empleos
      </button>

      {error && postulado === false && (
        <div className="de-data-state error" style={{ marginBottom: '1rem' }}>{error}</div>
      )}

      <div className="detalle-grid">
        <div className="detalle-main">
          <div className="detalle-header">
            <div className="detalle-icono">
              <span className="detalle-iconoLetra">{empleo.titulo?.charAt(0)}</span>
            </div>
            <div className="detalle-headerInfo">
              <h1 className="detalle-titulo">{empleo.titulo}</h1>
              <p className="de-empresa-nombre">
                <Building2 size={14} />
                {usuarioEmpresa.nombre || 'Empresa'}
              </p>
              <div className="detalle-badges">
                <span className="detalle-badge detalle-badgeModalidad">
                  <Globe size={13} />
                  {etiquetaModalidad[empleo.modalidad] ?? empleo.modalidad}
                </span>
                <span className={`detalle-badge detalle-badgeEstado ${(empleo.estado || '').toLowerCase()}`}>
                  {empleo.estado}
                </span>
              </div>
            </div>
          </div>

          <div className="detalle-metas">
            <div className="detalle-metaItem">
              <DollarSign size={16} />
              <div>
                <span className="detalle-metaLabel">Salario mensual</span>
                <span className="detalle-metaValor">
                  {formatoSalario.format(salarioMin)} – {formatoSalario.format(salarioMax)}
                </span>
              </div>
            </div>
            <div className="detalle-metaItem">
              <Globe size={16} />
              <div>
                <span className="detalle-metaLabel">Modalidad</span>
                <span className="detalle-metaValor">{etiquetaModalidad[empleo.modalidad] ?? empleo.modalidad}</span>
              </div>
            </div>
            <div className="detalle-metaItem">
              <Calendar size={16} />
              <div>
                <span className="detalle-metaLabel">Publicado</span>
                <span className="detalle-metaValor">
                  {empleo.fecha_publicacion
                    ? new Date(empleo.fecha_publicacion).toLocaleDateString('es-CR')
                    : '—'}
                </span>
              </div>
            </div>
          </div>

          <div className="detalle-seccion">
            <h2 className="detalle-seccionTitulo">Descripción del empleo</h2>
            <p className="detalle-descripcion">{empleo.descripcion}</p>
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
              <span>Ya te has postulado a este empleo. La empresa revisará tu solicitud.</span>
            </div>
          ) : (
            <button
              type="button"
              className="detalle-postularBtn"
              onClick={() => setMostrarModal(true)}
            >
              <Send size={16} />
              Postularme a este empleo
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
                {usuarioEmpresa.correo && (
                  <p className="detalle-empresaSector">{usuarioEmpresa.correo}</p>
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
              <h3>Detalles del empleo</h3>
            </div>
            <dl className="detalle-dl">
              <dt>Modalidad</dt>
              <dd>{etiquetaModalidad[empleo.modalidad] ?? empleo.modalidad}</dd>
              <dt>Salario min.</dt>
              <dd>{formatoSalario.format(salarioMin)}</dd>
              <dt>Salario máx.</dt>
              <dd>{formatoSalario.format(salarioMax)}</dd>
              <dt>Plazo entrega</dt>
              <dd>{empleo.plazo_dias} días</dd>
              <dt>Publicado</dt>
              <dd>{empleo.fecha_publicacion ? new Date(empleo.fecha_publicacion).toLocaleDateString('es-CR') : '—'}</dd>
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
              ¿Estás seguro de que deseas postularte a este empleo?
            </p>
            <div className="modal-resumen">
              <div className="modal-resumenItem">
                <span className="modal-resumenLabel">Empleo</span>
                <span className="modal-resumenValor">{empleo.titulo}</span>
              </div>
              <div className="modal-resumenItem">
                <span className="modal-resumenLabel">Empresa</span>
                <span className="modal-resumenValor">{usuarioEmpresa.nombre || '—'}</span>
              </div>
              <div className="modal-resumenItem">
                <span className="modal-resumenLabel">Salario</span>
                <span className="modal-resumenValor">{formatoSalario.format(salarioMin)} – {formatoSalario.format(salarioMax)}</span>
              </div>
              <div className="modal-resumenItem">
                <span className="modal-resumenLabel">Modalidad</span>
                <span className="modal-resumenValor">{etiquetaModalidad[empleo.modalidad] ?? empleo.modalidad}</span>
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
