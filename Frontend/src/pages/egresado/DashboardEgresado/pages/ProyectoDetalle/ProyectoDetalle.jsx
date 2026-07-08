import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import {
  ArrowLeft, DollarSign, Tag, Globe, Building2,
  Send, ExternalLink, Briefcase, Calendar, CheckCircle, X, Mail, Pencil, Trash2,
  Calculator,
} from 'lucide-react';
import { egresadoService } from '../../../../../services/egresadoService';
import { egresadoDashboardService } from '../../../../../services/egresadoDashboardService';
import { categoriasProyecto } from '../../../../../data/proyectosEgresado';
import CalculadoraCotizacion from '../../../../../components/postulaciones/CalculadoraCotizacion';
import { formatUSD, formatCRC, TIPO_CAMBIO_CRC } from '../../../../../utils/calculadoraCotizacion';

const etiquetaModalidad = { remoto: 'egresadoExplorar.components.remoto', hibrido: 'egresadoExplorar.components.hibrido', presencial: 'egresadoExplorar.components.presencial' };
const T_NS = 'egresadoProyectoDetalle';
const etiquetaCategoria = Object.fromEntries(
  categoriasProyecto.filter((c) => c.valor !== 'todas').map((c) => [c.valor, c.etiqueta])
);

const formatoMoneda = new Intl.NumberFormat('en-US', {
  style: 'currency', currency: 'USD', maximumFractionDigits: 0,
});

const ETQ_ESTADO = {
  ENVIADA: 'egresadoPostulaciones.flujoEnviada',
  EN_REVISION: 'egresadoPostulaciones.flujoRevision',
  PRESELECCIONADA: 'egresadoPostulaciones.flujoPreseleccionada',
  RECHAZADA: 'egresadoPostulaciones.flujoRechazada',
  CONTRATADO: 'egresadoPostulaciones.flujoAceptada',
};

export default function ProyectoDetalle() {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const rutaVolver = location.state?.desde === 'postulaciones' ? '/egresado/dashboard/postulaciones' : '/egresado/dashboard/explorar';
  const [proyecto, setProyecto] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [postulacion, setPostulacion] = useState(null);
  const [enviando, setEnviando] = useState(false);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [mensaje, setMensaje] = useState('');
  const [monto, setMonto] = useState('');
  const [aceptaCondiciones, setAceptaCondiciones] = useState(false);
  const [originalMensaje, setOriginalMensaje] = useState('');
  const [originalMonto, setOriginalMonto] = useState('');
  const [confirmarCancelar, setConfirmarCancelar] = useState(false);
  const [cancelando, setCancelando] = useState(false);
  const [resultadoCotizacion, setResultadoCotizacion] = useState(null);

  useEffect(() => {
    let activo = true;
    Promise.all([
      egresadoService.obtenerPropuestaPorId(id),
      egresadoDashboardService.obtenerPostulaciones(),
    ])
      .then(([proyectoData, postulaciones]) => {
        if (!activo) return;
        setProyecto(proyectoData);
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
    if (!aceptaCondiciones) {
      alert('Debés aceptar las condiciones del proyecto para continuar.');
      return;
    }
    if (!resultadoCotizacion) {
      alert('Completá la calculadora de cotización para continuar.');
      return;
    }
    setEnviando(true);
    try {
      const datos = {
        mensaje_presentacion: mensaje.trim() || undefined,
        ...resultadoCotizacion.payloadBackend,
      };

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
      setResultadoCotizacion(null);
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
    ? mensaje !== originalMensaje || resultadoCotizacion !== null
    : true;

  const abrirModal = (editando = false) => {
    if (editando && postulacion) {
      const msg = postulacion.mensaje_presentacion || '';
      setMensaje(msg);
      setAceptaCondiciones(true);
      setOriginalMensaje(msg);
      setOriginalMonto('');
      setModoEdicion(true);
    } else {
      setMensaje('');
      setAceptaCondiciones(false);
      setModoEdicion(false);
    }
    setResultadoCotizacion(null);
    setMostrarModal(true);
  };

  if (cargando) {
    return (
      <div className="detalle-container">
        <div className="de-data-state">{t(`${T_NS}.loading`)}</div>
      </div>
    );
  }

  if (error && !proyecto) {
    return (
      <div className="detalle-container">
        <div className="de-data-state error">{error}</div>
        <button className="detalle-volver" type="button" onClick={() => navigate(rutaVolver)}>
          <ArrowLeft size={16} /> {t(`${T_NS}.volver`)}
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
    <div className="detalle-container fwd-animar-entrada">
      <button className="detalle-volver" type="button" onClick={() => navigate(rutaVolver)}>
        <ArrowLeft size={16} /> {t(`${T_NS}.volver`)}
      </button>

      {error && (
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
              <p className="de-empresa-nombre">
                <Building2 size={14} />
                {usuarioEmpresa.nombre || 'Empresa'}
              </p>
              <div className="detalle-badges">
                <span className="detalle-badge detalle-badgeCategoria">
                  <Tag size={13} />
                  {etiquetaCategoria[proyecto.categoria] ?? proyecto.categoria}
                </span>
                <span className="detalle-badge detalle-badgeModalidad">
                  <Globe size={13} />
                  {etiquetaModalidad[proyecto.modalidad] ? t(etiquetaModalidad[proyecto.modalidad]) : proyecto.modalidad}
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
                <span className="detalle-metaLabel">{t(`${T_NS}.presupuesto`)}</span>
                <span className="detalle-metaValor">
                  {formatoMoneda.format(presupuestoMin)} – {formatoMoneda.format(presupuestoMax)}
                </span>
              </div>
            </div>
            <div className="detalle-metaItem">
              <Globe size={16} />
              <div>
                <span className="detalle-metaLabel">{t(`${T_NS}.modalidad`)}</span>
                <span className="detalle-metaValor">{etiquetaModalidad[proyecto.modalidad] ? t(etiquetaModalidad[proyecto.modalidad]) : proyecto.modalidad}</span>
              </div>
            </div>
            <div className="detalle-metaItem">
              <Calendar size={16} />
              <div>
                <span className="detalle-metaLabel">{t(`${T_NS}.publicado`)}</span>
                <span className="detalle-metaValor">
                  {proyecto.fecha_publicacion
                    ? new Date(proyecto.fecha_publicacion).toLocaleDateString()
                    : '—'}
                </span>
              </div>
            </div>
          </div>

          <div className="detalle-seccion">
            <h2 className="detalle-seccionTitulo">{t(`${T_NS}.descripcion`)}</h2>
            <p className="detalle-descripcion">{proyecto.descripcion}</p>
          </div>

          {tecnologias.length > 0 && (
            <div className="detalle-seccion">
              <h2 className="detalle-seccionTitulo">{t(`${T_NS}.tecnologias`)}</h2>
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
                  <span>{t(`${T_NS}.tuPostulacion`)}</span>
                </div>
                <span className={`etiquetaEstadoPostulacion ${(postulacion.estado || 'ENVIADA').toLowerCase()}`}>
                  {t(ETQ_ESTADO[postulacion.estado] || postulacion.estado)}
                </span>
              </div>

              {postulacion.mensaje_presentacion && (
                <div className="detalle-postulacion-campo">
                  <span className="detalle-postulacion-label">
                    <Mail size={14} /> {t(`${T_NS}.mensajePresentacion`)}
                  </span>
                  <p className="detalle-postulacion-valor">{postulacion.mensaje_presentacion}</p>
                </div>
              )}

              {postulacion.presupuesto_max != null && (
                <div className="detalle-postulacion-campo">
                  <span className="detalle-postulacion-label">
                    <DollarSign size={14} /> {t(`${T_NS}.propuestaEconomica`)}
                  </span>
                  <p className="detalle-postulacion-valor">{formatoMoneda.format(postulacion.presupuesto_max)}</p>
                </div>
              )}

              {/* Cotización detallada guardada */}
              {postulacion.total != null && (
                <div className="detalle-postulacion-cotizacion">
                  <h4><Calculator size={14} /> Cotización enviada</h4>
                  <dl className="cotizacion-dl">
                    {postulacion.tarifa_hora != null && (
                      <><dt>Tarifa / hora</dt><dd>{formatUSD(postulacion.tarifa_hora)}</dd></>
                    )}
                    {postulacion.total_horas != null && (
                      <><dt>Total horas</dt><dd>{postulacion.total_horas} h</dd></>
                    )}
                    {postulacion.subtotal != null && (
                      <><dt>Subtotal (ajustado)</dt><dd>{formatUSD(postulacion.subtotal)}</dd></>
                    )}
                    {postulacion.iva != null && (
                      <><dt>IVA (13%)</dt><dd>{formatUSD(postulacion.iva)}</dd></>
                    )}
                    <><dt><strong>Total propuesto</strong></dt><dd><strong>{formatUSD(postulacion.total)}</strong></dd></>
                    <><dt style={{color:'var(--fwd-text-muted)',fontSize:'0.75rem'}}>Equivalente CRC</dt><dd style={{fontSize:'0.75rem'}}>₡{Math.round(Number(postulacion.total) * TIPO_CAMBIO_CRC).toLocaleString('es-CR')}</dd></>
                  </dl>
                </div>
              )}

              <div className="detalle-postulacion-fecha">
                {t(`${T_NS}.postulasteEl`)} {new Date(postulacion.fecha_postulacion).toLocaleDateString()}
              </div>

              <div className="detalle-postulacion-acciones">
                <button
                  type="button"
                  className="detalle-postulacion-btn editar"
                  onClick={() => abrirModal(true)}
                >
                  <Pencil size={14} /> {t(`${T_NS}.editar`)}
                </button>
                {confirmarCancelar ? (
                  <div className="detalle-postulacion-confirmar">
                    <span>{t(`${T_NS}.cancelarPostulacion`)}</span>
                    <button
                      type="button"
                      className="detalle-postulacion-btn confirmar-si"
                      onClick={cancelarPostulacion}
                      disabled={cancelando}
                    >
                      {cancelando ? t(`${T_NS}.cancelando`) : t(`${T_NS}.siCancelar`)}
                    </button>
                    <button
                      type="button"
                      className="detalle-postulacion-btn confirmar-no"
                      onClick={() => setConfirmarCancelar(false)}
                      disabled={cancelando}
                    >
                      {t(`${T_NS}.no`)}
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    className="detalle-postulacion-btn cancelar"
                    onClick={() => setConfirmarCancelar(true)}
                  >
                    <Trash2 size={14} /> {t(`${T_NS}.btnCancelarPostulacion`)}
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
              {t(`${T_NS}.postularme`)}
            </button>
          )}
        </div>

        <aside className="detalle-sidebar">
          <div className="detalle-sideCard">
            <div className="detalle-sideHeader">
              <Building2 size={18} />
              <h3>{t(`${T_NS}.sobreEmpresa`)}</h3>
            </div>
            <div className="detalle-empresaInfo">
              <div className="detalle-empresaAvatar">
                {empresa.logo ? (
                  <img src={empresa.logo} alt="Imagen descriptiva" className="detalle-empresaLogo" />
                ) : (
                  usuarioEmpresa.nombre?.charAt(0) || 'E'
                )}
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
                <ExternalLink size={14} /> {t(`${T_NS}.sitioWeb`)}
              </a>
            )}
          </div>

          <div className="detalle-sideCard">
            <div className="detalle-sideHeader">
              <Briefcase size={18} />
              <h3>{t(`${T_NS}.detalles`)}</h3>
            </div>
            <dl className="detalle-dl">
              <dt>{t(`${T_NS}.modalidad`)}</dt>
              <dd>{etiquetaModalidad[proyecto.modalidad] ? t(etiquetaModalidad[proyecto.modalidad]) : proyecto.modalidad}</dd>
              <dt>{t(`${T_NS}.presupuestoMin`)}</dt>
              <dd>{formatoMoneda.format(presupuestoMin)}</dd>
              <dt>{t(`${T_NS}.presupuestoMax`)}</dt>
              <dd>{formatoMoneda.format(presupuestoMax)}</dd>
              <dt>{t(`${T_NS}.plazoEntrega`)}</dt>
              <dd>{proyecto.plazo_dias} días</dd>
              <dt>{t(`${T_NS}.publicado`)}</dt>
              <dd>{proyecto.fecha_publicacion ? new Date(proyecto.fecha_publicacion).toLocaleDateString() : '—'}</dd>
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
              {modoEdicion ? 'Editar postulación' : 'Postularte al proyecto'}
            </h2>
            <p className="modal-desc">
              {modoEdicion
                ? 'Actualizá los campos que quieras modificar.'
                : 'Completá los datos para enviar tu propuesta al empresario.'}
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

            <div className="modal-divisor" />

            <div className="modal-form">

              {/* Mensaje de presentación */}
              <div className="modal-campo">
                <label className="modal-label">
                  <Mail size={14} /> Mensaje de presentación <span className="modal-opcional">(opcional)</span>
                </label>
                <textarea
                  className="modal-textarea"
                  placeholder="Contale al empresario por qué te interesa el proyecto, tu experiencia, etc."
                  rows={3}
                  value={mensaje}
                  onChange={(e) => setMensaje(e.target.value)}
                />
              </div>

              {/* Calculadora de cotización */}
              <div className="modal-campo">
                <label className="modal-label">
                  <Calculator size={14} /> Calculadora de cotización
                </label>
                <CalculadoraCotizacion
                  proyecto={proyecto}
                  onResultado={setResultadoCotizacion}
                  initialData={modoEdicion ? {
                    tarifa_hora:     postulacion?.tarifa_hora,
                    desglose_tareas: postulacion?.desglose_tareas,
                    complejidad:     postulacion?.complejidad,
                  } : null}
                />
                {!resultadoCotizacion && (
                  <span className="modal-ayuda" style={{color:'var(--fwd-text-muted)'}}>Completá la calculadora para habilitar el envío.</span>
                )}
              </div>

              {/* Condiciones */}
              <div className="modal-campo">
                <label className="modal-label checkbox-label">
                  <input
                    type="checkbox"
                    checked={aceptaCondiciones}
                    onChange={(e) => setAceptaCondiciones(e.target.checked)}
                    className="modal-checkbox"
                  />
                  <span>Acepto las condiciones del proyecto y me comprometo a cumplir con los plazos y entregables acordados.</span>
                </label>
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
                disabled={enviando || !aceptaCondiciones || !resultadoCotizacion || (modoEdicion && !hayCambios)}
              >
                {enviando ? (
                  <>Guardando...</>
                ) : !resultadoCotizacion ? (
                  <><Calculator size={16} /> Completá la calculadora</>
                ) : modoEdicion && !hayCambios ? (
                  <><Send size={16} /> Sin cambios</>
                ) : (
                  <><Send size={16} /> {modoEdicion ? 'Guardar cambios' : 'Enviar propuesta'}</>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
