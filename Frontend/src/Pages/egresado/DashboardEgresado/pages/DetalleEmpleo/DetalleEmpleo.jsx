import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft, Briefcase, DollarSign, Globe, Building2,
  Send, ExternalLink, Calendar, CheckCircle, X, Mail, Pencil, Trash2,
} from 'lucide-react';
import { egresadoService } from '../../../../../services/egresadoService';
import { egresadoDashboardService } from '../../../../../services/egresadoDashboardService';

const etiquetaModalidad = { remoto: 'Remoto', hibrido: 'Híbrido', presencial: 'Presencial' };

const formatoSalario = new Intl.NumberFormat('es-CR', {
  style: 'currency', currency: 'CRC', maximumFractionDigits: 0,
});

const etiquetaEstadoPostulacion = {
  ENVIADA: 'Enviada',
  EN_REVISION: 'En revisión',
  PRESELECCIONADA: 'Preseleccionada',
  RECHAZADA: 'Rechazada',
  CONTRATADO: 'Contratado',
};

export default function DetalleEmpleo() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [empleo, setEmpleo] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [postulacion, setPostulacion] = useState(null);
  const [enviando, setEnviando] = useState(false);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [mensaje, setMensaje] = useState('');
  const [presupuesto, setPresupuesto] = useState('');
  const [originalMensaje, setOriginalMensaje] = useState('');
  const [originalPresupuesto, setOriginalPresupuesto] = useState('');
  const [confirmarCancelar, setConfirmarCancelar] = useState(false);
  const [cancelando, setCancelando] = useState(false);

  useEffect(() => {
    let activo = true;
    Promise.all([
      egresadoService.obtenerPropuestaPorId(id),
      egresadoDashboardService.obtenerPostulaciones(),
    ])
      .then(([empleoData, postulaciones]) => {
        if (!activo) return;
        setEmpleo(empleoData);
        const match = (postulaciones || []).find(
          (p) => p.id_propuesta === Number(id) || p.propuesta?.id_propuesta === Number(id)
        );
        if (match) setPostulacion(match);
      })
      .catch((err) => { if (activo) setError(err.message); })
      .finally(() => { if (activo) setCargando(false); });
    return () => { activo = false; };
  }, [id]);

  const confirmarPostulacion = async () => {
    setEnviando(true);
    try {
      const datos = {};
      if (mensaje.trim()) datos.mensaje_presentacion = mensaje.trim();
      if (presupuesto) datos.presupuesto_max = Number(presupuesto);

      if (modoEdicion && postulacion) {
        const resp = await egresadoService.actualizarPostulacion(postulacion.id_postulacion, datos);
        const updated = resp?.data ?? resp;
        setPostulacion((prev) => ({ ...prev, ...updated }));
      } else {
        const resp = await egresadoService.postularse(Number(id), datos);
        const created = resp?.data ?? resp;
        setPostulacion((prev) => ({ ...prev, ...created, id_postulacion: created.id_postulacion }));
      }
      setMostrarModal(false);
      setModoEdicion(false);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setEnviando(false);
    }
  };

  const cancelarPostulacion = async () => {
    if (!postulacion) return;
    setCancelando(true);
    try {
      await egresadoService.eliminarPostulacion(postulacion.id_postulacion);
      setPostulacion(null);
      setConfirmarCancelar(false);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setCancelando(false);
    }
  };

  const hayCambios = modoEdicion
    ? mensaje !== originalMensaje || presupuesto !== originalPresupuesto
    : true;

  const abrirModal = (editando = false) => {
    if (editando && postulacion) {
      const msg = postulacion.mensaje_presentacion || '';
      const pre = postulacion.presupuesto_max ? String(postulacion.presupuesto_max) : '';
      setMensaje(msg);
      setPresupuesto(pre);
      setOriginalMensaje(msg);
      setOriginalPresupuesto(pre);
      setModoEdicion(true);
    } else {
      setMensaje('');
      setPresupuesto('');
      setModoEdicion(false);
    }
    setMostrarModal(true);
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

      {error && (
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

          {postulacion ? (
            <div className="detalle-postulacion-card">
              <div className="detalle-postulacion-header">
                <div className="detalle-postulacion-titulo">
                  <CheckCircle size={18} />
                  <span>Tu postulación</span>
                </div>
                <span className={`etiquetaEstadoPostulacion ${(postulacion.estado || 'ENVIADA').toLowerCase()}`}>
                  {etiquetaEstadoPostulacion[postulacion.estado] || postulacion.estado}
                </span>
              </div>

              {postulacion.mensaje_presentacion && (
                <div className="detalle-postulacion-campo">
                  <span className="detalle-postulacion-label">
                    <Mail size={14} /> Mensaje de presentación
                  </span>
                  <p className="detalle-postulacion-valor">{postulacion.mensaje_presentacion}</p>
                </div>
              )}

              {postulacion.presupuesto_max != null && (
                <div className="detalle-postulacion-campo">
                  <span className="detalle-postulacion-label">
                    <DollarSign size={14} /> Expectativa salarial
                  </span>
                  <p className="detalle-postulacion-valor">{formatoSalario.format(postulacion.presupuesto_max)}</p>
                </div>
              )}

              <div className="detalle-postulacion-fecha">
                Postulaste el {new Date(postulacion.fecha_postulacion).toLocaleDateString('es-CR')}
              </div>

              <div className="detalle-postulacion-acciones">
                <button
                  type="button"
                  className="detalle-postulacion-btn editar"
                  onClick={() => abrirModal(true)}
                >
                  <Pencil size={14} /> Editar
                </button>
                {confirmarCancelar ? (
                  <div className="detalle-postulacion-confirmar">
                    <span>¿Cancelar postulación?</span>
                    <button
                      type="button"
                      className="detalle-postulacion-btn confirmar-si"
                      onClick={cancelarPostulacion}
                      disabled={cancelando}
                    >
                      {cancelando ? 'Cancelando...' : 'Sí, cancelar'}
                    </button>
                    <button
                      type="button"
                      className="detalle-postulacion-btn confirmar-no"
                      onClick={() => setConfirmarCancelar(false)}
                      disabled={cancelando}
                    >
                      No
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    className="detalle-postulacion-btn cancelar"
                    onClick={() => setConfirmarCancelar(true)}
                  >
                    <Trash2 size={14} /> Cancelar postulación
                  </button>
                )}
              </div>
            </div>
          ) : (
            <button
              type="button"
              className="detalle-postularBtn"
              onClick={() => abrirModal(false)}
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
          <div className="modal-contenido modal-postular" onClick={(e) => e.stopPropagation()}>
            <button className="modal-cerrar" type="button" onClick={() => setMostrarModal(false)}>
              <X size={18} />
            </button>
            <div className="modal-icono">
              <Send size={28} />
            </div>
            <h2 className="modal-titulo">
              {modoEdicion ? 'Editar postulación' : 'Postularme a este empleo'}
            </h2>
            <p className="modal-desc">
              {modoEdicion
                ? 'Actualiza tu mensaje de presentación o tu expectativa salarial.'
                : 'Cuéntale a la empresa por qué eres el candidato ideal y cuáles son tus expectativas salariales.'}
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

            <div className="modal-divisor" />

            <div className="modal-form">
              <div className="modal-campo">
                <label className="modal-label">
                  <Mail size={14} /> Mensaje de presentación <span className="modal-opcional">(opcional)</span>
                </label>
                <textarea
                  className="modal-textarea"
                  placeholder="Ej: Tengo experiencia en React y Node.js, me apasiona el desarrollo web..."
                  rows={4}
                  value={mensaje}
                  onChange={(e) => setMensaje(e.target.value)}
                />
              </div>
              <div className="modal-campo">
                <label className="modal-label">
                  <DollarSign size={14} /> Expectativa salarial <span className="modal-opcional">(opcional)</span>
                </label>
                <input
                  className="modal-input"
                  type="number"
                  min="0"
                  max="9999999"
                  step="100000"
                  placeholder="Ej: 80000"
                  value={presupuesto}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val.length <= 7) setPresupuesto(val);
                  }}
                />
                <span className="modal-ayuda">¿Cuál es tu expectativa salarial mensual en CRC? (máx. 7 dígitos)</span>
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
                disabled={enviando || (modoEdicion && !hayCambios)}
              >
                {enviando ? (
                  <>Guardando...</>
                ) : modoEdicion && !hayCambios ? (
                  <><Send size={16} /> Sin cambios</>
                ) : (
                  <><Send size={16} /> {modoEdicion ? 'Guardar cambios' : 'Postularme'}</>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
