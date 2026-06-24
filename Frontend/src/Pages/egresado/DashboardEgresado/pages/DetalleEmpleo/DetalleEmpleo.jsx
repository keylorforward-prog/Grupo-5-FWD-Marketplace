import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import {
  ArrowLeft, Briefcase, DollarSign, Globe, Building2,
  Send, ExternalLink, Calendar, CheckCircle, X, Mail, Pencil, Trash2,
} from 'lucide-react';
import { egresadoService } from '../../../../../services/egresadoService';
import { egresadoDashboardService } from '../../../../../services/egresadoDashboardService';

const etiquetaModalidad = { remoto: 'egresadoExplorar.components.remoto', hibrido: 'egresadoExplorar.components.hibrido', presencial: 'egresadoExplorar.components.presencial' };

const etiquetaJornada = {
  tiempo_completo: 'Tiempo completo',
  medio_tiempo:    'Medio tiempo',
  por_horas:       'Por horas',
  practica:        'Práctica profesional',
};

const T_NS = 'egresadoEmpleoDetalle';

const formatoSalario = (min, max) => {
  if (min == null && max == null) return '—';
  const fmt = (n) => `$${Number(n).toLocaleString('es-AR')}`;
  if (min != null && max != null && min !== max) return `${fmt(min)} - ${fmt(max)}`;
  if (min != null) return `Desde ${fmt(min)}`;
  return `Hasta ${fmt(max)}`;
};

const ETQ_ESTADO = {
  ENVIADA: 'egresadoPostulaciones.flujoEnviada',
  PENDIENTE: 'egresadoPostulaciones.flujoPendiente',
  EN_REVISION: 'egresadoPostulaciones.flujoRevision',
  PRESELECCIONADA: 'egresadoPostulaciones.flujoPreseleccionada',
  RECHAZADA: 'egresadoPostulaciones.flujoRechazada',
  CONTRATADO: 'egresadoPostulaciones.flujoAceptada',
};



export default function DetalleEmpleo() {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const rutaVolver = location.state?.desde === 'postulaciones' ? '/egresado/dashboard/postulaciones' : '/egresado/dashboard/explorar-empleos';

  const [empleo, setEmpleo] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [postulacion, setPostulacion] = useState(null);

  const [perfilCvUrl, setPerfilCvUrl] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [carta, setCarta] = useState('');
  const [cvUrl, setCvUrl] = useState('');
  const [pretension, setPretension] = useState('');
  const [originalCarta, setOriginalCarta] = useState('');
  const [originalCvUrl, setOriginalCvUrl] = useState('');
  const [originalPretension, setOriginalPretension] = useState('');
  const [confirmarCancelar, setConfirmarCancelar] = useState(false);
  const [cancelando, setCancelando] = useState(false);

  useEffect(() => {
    let activo = true;
    Promise.all([
      egresadoService.obtenerOfertaEmpleo(id),
      egresadoDashboardService.obtenerPerfil().catch(() => ({ documento_cv: '' })),
    ])
      .then(([empleoData, perfilData]) => {
        if (!activo) return;
        setEmpleo(empleoData);
        setPostulacion(empleoData.postulacion);
        if (perfilData.documento_cv) setPerfilCvUrl(perfilData.documento_cv);
      })
      .catch((err) => { if (activo) setError(err.message); })
      .finally(() => { if (activo) setCargando(false); });
    return () => { activo = false; };
  }, [id]);

  const cvRequerido = false;
  const confirmarPostulacion = async () => {
    if (cvRequerido) return;
    setEnviando(true);
    try {
      const payload = {
        carta_presentacion: carta.trim() || null,
        cv_url: cvUrl.trim() || null,
        pretension_salarial: pretension ? Number(pretension) : null,
      };
      if (modoEdicion && postulacion) {
        await egresadoService.actualizarPostulacionEmpleo(postulacion.id_postulacion_empleo, payload);
      } else {
        await egresadoService.postularOfertaEmpleo({ id_oferta_empleo: empleo.id, ...payload });
      }
      const refrescado = await egresadoService.obtenerOfertaEmpleo(id);
      setEmpleo(refrescado);
      setPostulacion(refrescado.postulacion);
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
      await egresadoService.eliminarPostulacionEmpleo(postulacion.id_postulacion_empleo);
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
    ? carta !== originalCarta || cvUrl !== originalCvUrl || pretension !== originalPretension
    : true;

  const abrirModal = (editando = false) => {
    if (editando && postulacion) {
      setCarta(postulacion.carta_presentacion || '');
      setCvUrl(postulacion.cv_url || '');
      setPretension(postulacion.pretension_salarial ? String(postulacion.pretension_salarial) : '');
      setOriginalCarta(postulacion.carta_presentacion || '');
      setOriginalCvUrl(postulacion.cv_url || '');
      setOriginalPretension(postulacion.pretension_salarial ? String(postulacion.pretension_salarial) : '');
      setModoEdicion(true);
    } else {
      setCarta('');
      setCvUrl(perfilCvUrl);
      setPretension('');
      setModoEdicion(false);
    }
    setMostrarModal(true);
  };

  if (cargando) {
    return (
      <div className="detalle-container">
        <div className="de-data-state">{t(`${T_NS}.loading`)}</div>
      </div>
    );
  }

  if (error && !empleo) {
    return (
      <div className="detalle-container">
        <div className="de-data-state error">{error}</div>
        <button className="detalle-volver" type="button" onClick={() => navigate(rutaVolver)}>
          <ArrowLeft size={16} /> {t(`${T_NS}.volver`)}
        </button>
      </div>
    );
  }
  if (!empleo) return null;

  const empresa = empleo.perfilEmpresario ?? {};
  const usuarioEmpresa = empresa.usuario ?? {};
  const tecnologias = (empleo.tecnologias || []).filter(Boolean);

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
                  {etiquetaModalidad[empleo.modalidad] ? t(etiquetaModalidad[empleo.modalidad]) : empleo.modalidad}
                </span>
                {empleo.tipo_jornada && (
                  <span className="detalle-badge detalle-badgeCategoria">
                    <Briefcase size={13} />
                    {etiquetaJornada[empleo.tipo_jornada] ?? empleo.tipo_jornada}
                  </span>
                )}
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
                <span className="detalle-metaLabel">{t(`${T_NS}.salarioMensual`)}</span>
                <span className="detalle-metaValor">
                  {formatoSalario(empleo.salario_min, empleo.salario_max)}
                </span>
              </div>
            </div>
            <div className="detalle-metaItem">
              <Globe size={16} />
              <div>
                <span className="detalle-metaLabel">{t(`${T_NS}.modalidad`)}</span>
                <span className="detalle-metaValor">{etiquetaModalidad[empleo.modalidad] ? t(etiquetaModalidad[empleo.modalidad]) : empleo.modalidad}</span>
              </div>
            </div>
            <div className="detalle-metaItem">
              <Calendar size={16} />
              <div>
                <span className="detalle-metaLabel">{t(`${T_NS}.publicado`)}</span>
                <span className="detalle-metaValor">
                  {empleo.publicado
                    ? new Date(empleo.publicado).toLocaleDateString()
                    : '—'}
                </span>
              </div>
            </div>
          </div>

          <div className="detalle-seccion">
            <h2 className="detalle-seccionTitulo">{t(`${T_NS}.descripcion`)}</h2>
            <p className="detalle-descripcion">{empleo.descripcion}</p>
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
                <span className={`etiquetaEstadoPostulacion ${(postulacion.estado || 'enviada').toLowerCase()}`}>
                  {t(ETQ_ESTADO[postulacion.estado] || postulacion.estado)}
                </span>
              </div>

              {postulacion.carta_presentacion && (
                <div className="detalle-postulacion-campo">
                  <span className="detalle-postulacion-label">
                    <Mail size={14} /> {t(`${T_NS}.mensajePresentacion`)}
                  </span>
                  <p className="detalle-postulacion-valor">{postulacion.carta_presentacion}</p>
                </div>
              )}

              {postulacion.cv_url && (
                <div className="detalle-postulacion-campo">
                  <span className="detalle-postulacion-label">
                    <DollarSign size={14} /> {t(`${T_NS}.cvAdjunto`)}
                  </span>
                  <a href={postulacion.cv_url} target="_blank" rel="noopener noreferrer" className="detalle-postulacion-valor enlace">
                    {postulacion.cv_url}
                  </a>
                </div>
              )}

              {postulacion.pretension_salarial != null && (
                <div className="detalle-postulacion-campo">
                  <span className="detalle-postulacion-label">
                    <DollarSign size={14} /> {t(`${T_NS}.pretensionLabel`)}
                  </span>
                  <p className="detalle-postulacion-valor">
                    {new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(postulacion.pretension_salarial)}
                  </p>
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
                  <img src={empresa.logo} alt="" className="detalle-empresaLogo" />
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
              <dd>{etiquetaModalidad[empleo.modalidad] ? t(etiquetaModalidad[empleo.modalidad]) : empleo.modalidad}</dd>
              <dt>{t(`${T_NS}.tipoJornada`)}</dt>
              <dd>{(etiquetaJornada[empleo.tipo_jornada] ?? empleo.tipo_jornada) || '—'}</dd>
              <dt>{t(`${T_NS}.salarioMin`)}</dt>
              <dd>{empleo.salario_min != null ? formatoSalario(empleo.salario_min) : '—'}</dd>
              <dt>{t(`${T_NS}.salarioMax`)}</dt>
              <dd>{empleo.salario_max != null ? formatoSalario(empleo.salario_max) : '—'}</dd>
              {empleo.ubicacion && (
                <>
                  <dt>{t(`${T_NS}.ubicacion`)}</dt>
                  <dd>{empleo.ubicacion}</dd>
                </>
              )}
              <dt>{t(`${T_NS}.publicado`)}</dt>
              <dd>{empleo.publicado ? new Date(empleo.publicado).toLocaleDateString() : '—'}</dd>
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
              <Briefcase size={28} />
            </div>
            <h2 className="modal-titulo">
              {modoEdicion ? t(`${T_NS}.editarPostulacion`) : t(`${T_NS}.modalPostularme`)}
            </h2>
            <p className="modal-desc">
              {modoEdicion
                ? t(`${T_NS}.modalEditarMsg`)
                : t(`${T_NS}.modalPostularMsg`)}
            </p>

            <div className="modal-resumen">
              <div className="modal-resumenItem">
                <span className="modal-resumenLabel">{t(`${T_NS}.puesto`)}</span>
                <span className="modal-resumenValor">{empleo.titulo}</span>
              </div>
              <div className="modal-resumenItem">
                <span className="modal-resumenLabel">{t(`${T_NS}.empresa`)}</span>
                <span className="modal-resumenValor">{usuarioEmpresa.nombre || '—'}</span>
              </div>
              <div className="modal-resumenItem">
                <span className="modal-resumenLabel">{t(`${T_NS}.salario`)}</span>
                <span className="modal-resumenValor">{formatoSalario(empleo.salario_min, empleo.salario_max)}</span>
              </div>
              <div className="modal-resumenItem">
                <span className="modal-resumenLabel">{t(`${T_NS}.modalidad`)}</span>
                <span className="modal-resumenValor">{etiquetaModalidad[empleo.modalidad] ? t(etiquetaModalidad[empleo.modalidad]) : empleo.modalidad}</span>
              </div>
            </div>

            <div className="modal-divisor" />

            <div className="modal-form">
              <div className="modal-campo">
                <label className="modal-label">
                  <Mail size={14} /> {t(`${T_NS}.campoCarta`)} <span className="modal-opcional">{t(`${T_NS}.opcional`)}</span>
                </label>
                <textarea
                  className="modal-textarea"
                  placeholder={t(`${T_NS}.cartaPlaceholder`)}
                  rows={3}
                  value={carta}
                  onChange={(e) => setCarta(e.target.value)}
                />
              </div>
              <div className="modal-campo">
                <label className="modal-label">
                  <DollarSign size={14} /> {t(`${T_NS}.campoCv`)}
                </label>
                <input
                  className="modal-input"
                  type="url"
                  placeholder={t(`${T_NS}.cvPlaceholder`)}
                  value={cvUrl}
                  onChange={(e) => setCvUrl(e.target.value)}
                />
                <span className="modal-ayuda">{t(`${T_NS}.cvHint`)}</span>
                {perfilCvUrl && cvUrl !== perfilCvUrl && (
                  <button type="button" className="modal-usarCv" onClick={() => setCvUrl(perfilCvUrl)}>
                    {t(`${T_NS}.usarCvPerfil`)}
                  </button>
                )}
              </div>
              <div className="modal-campo">
                <label className="modal-label">
                  <DollarSign size={14} /> {t(`${T_NS}.campoPretension`)} <span className="modal-opcional">{t(`${T_NS}.opcional`)}</span>
                </label>
                <input
                  className="modal-input"
                  type="number"
                  min="0"
                  max="9999999"
                  step="1000"
                  placeholder={t(`${T_NS}.pretensionPlaceholder`)}
                  value={pretension}
                  onChange={(e) => { const v = e.target.value; if (v.length <= 7) setPretension(v); }}
                />
                <span className="modal-ayuda">{t(`${T_NS}.pretensionHint`)}</span>
              </div>
            </div>

            <div className="modal-acciones">
              <button
                type="button"
                className="modal-btn modal-btn-secondary"
                onClick={() => setMostrarModal(false)}
                disabled={enviando}
              >
                {t(`${T_NS}.cancelar`)}
              </button>
              <button
                type="button"
                className="modal-btn modal-btn-primary"
                onClick={confirmarPostulacion}
                disabled={enviando || cvRequerido || (modoEdicion && !hayCambios)}
              >
                {enviando ? (
                  <>{t(`${T_NS}.guardando`)}</>
                ) : cvRequerido ? (
                  <><Send size={16} /> {t(`${T_NS}.cvRequerido`)}</>
                ) : modoEdicion && !hayCambios ? (
                  <><Send size={16} /> {t(`${T_NS}.sinCambios`)}</>
                ) : (
                  <><Send size={16} /> {modoEdicion ? t(`${T_NS}.guardarCambios`) : t(`${T_NS}.postularmeBtn`)}</>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
