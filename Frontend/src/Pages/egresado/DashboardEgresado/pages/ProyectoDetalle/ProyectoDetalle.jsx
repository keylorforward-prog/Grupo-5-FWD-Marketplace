import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft, DollarSign, Tag, Globe, Building2,
  Send, ExternalLink, Briefcase, Calendar, CheckCircle, X, Mail, Pencil, Trash2, Plus,
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

const etiquetaEstadoPostulacion = {
  ENVIADA: 'Enviada',
  EN_REVISION: 'En revisión',
  PRESELECCIONADA: 'Preseleccionada',
  RECHAZADA: 'Rechazada',
  CONTRATADO: 'Contratado',
};

export default function ProyectoDetalle() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [proyecto, setProyecto] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [postulacion, setPostulacion] = useState(null);
  const [enviando, setEnviando] = useState(false);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [mensaje, setMensaje] = useState('');
  const [tarifaHora, setTarifaHora] = useState(4000);
  const [tareas, setTareas] = useState([{ nombre: '', horas: '' }]);
  const [originalMensaje, setOriginalMensaje] = useState('');
  const [originalTarifaHora, setOriginalTarifaHora] = useState(4000);
  const [originalTareas, setOriginalTareas] = useState([{ nombre: '', horas: '' }]);
  const [errorCotizacion, setErrorCotizacion] = useState('');
  const [confirmarCancelar, setConfirmarCancelar] = useState(false);
  const [cancelando, setCancelando] = useState(false);

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
    const tareasValidas = tareas.filter((t) => t.nombre.trim() && Number(t.horas) > 0);
    if (tareasValidas.length === 0) {
      setErrorCotizacion('Agregá al menos una tarea con nombre y horas estimadas.');
      return;
    }
    if (!tarifaHora || tarifaHora <= 0) {
      setErrorCotizacion('La tarifa por hora debe ser mayor a 0.');
      return;
    }
    setErrorCotizacion('');
    setEnviando(true);
    try {
      const datos = {
        mensaje_presentacion: mensaje.trim() || undefined,
        presupuesto_max: total,
        desglose_tareas: tareasValidas,
        tarifa_hora: tarifaHora,
        total_horas: totalHoras,
        subtotal,
        iva,
        total,
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

  const totalHoras = tareas.reduce((sum, t) => sum + (Number(t.horas) || 0), 0);
  const subtotal   = totalHoras * tarifaHora;
  const iva        = parseFloat((subtotal * 0.13).toFixed(2));
  const total      = parseFloat((subtotal + iva).toFixed(2));

  const agregarTarea = () =>
    setTareas((prev) => [...prev, { nombre: '', horas: '' }]);
  const eliminarTarea = (i) =>
    setTareas((prev) => prev.filter((_, idx) => idx !== i));
  const actualizarTarea = (i, campo, valor) =>
    setTareas((prev) => prev.map((t, idx) => (idx === i ? { ...t, [campo]: valor } : t)));

  const hayCambios = modoEdicion
    ? mensaje !== originalMensaje ||
      tarifaHora !== originalTarifaHora ||
      JSON.stringify(tareas) !== JSON.stringify(originalTareas)
    : true;

  const abrirModal = (editando = false) => {
    if (editando && postulacion) {
      const msg = postulacion.mensaje_presentacion || '';
      const tf  = postulacion.tarifa_hora ? Number(postulacion.tarifa_hora) : 4000;
      const tr  = postulacion.desglose_tareas?.length
        ? postulacion.desglose_tareas
        : [{ nombre: '', horas: '' }];
      setMensaje(msg);
      setTarifaHora(tf);
      setTareas(tr);
      setOriginalMensaje(msg);
      setOriginalTarifaHora(tf);
      setOriginalTareas(tr);
      setModoEdicion(true);
    } else {
      setMensaje('');
      setTarifaHora(4000);
      setTareas([{ nombre: '', horas: '' }]);
      setModoEdicion(false);
    }
    setErrorCotizacion('');
    setMostrarModal(true);
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
    <div className="detalle-container fwd-animar-entrada">
      <button className="detalle-volver" type="button" onClick={() => navigate('/egresado/dashboard/explorar')}>
        <ArrowLeft size={16} /> Volver a proyectos
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
              <Globe size={16} />
              <div>
                <span className="detalle-metaLabel">Modalidad</span>
                <span className="detalle-metaValor">{etiquetaModalidad[proyecto.modalidad] ?? proyecto.modalidad}</span>
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
                    <DollarSign size={14} /> Tu propuesta económica
                  </span>
                  <p className="detalle-postulacion-valor">{formatoMoneda.format(postulacion.presupuesto_max)}</p>
                </div>
              )}

              <div className="detalle-postulacion-fecha">
                Postulaste el {new Date(postulacion.fecha_postulacion).toLocaleDateString()}
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
              <h3>Detalles del proyecto</h3>
            </div>
            <dl className="detalle-dl">
              <dt>Modalidad</dt>
              <dd>{etiquetaModalidad[proyecto.modalidad] ?? proyecto.modalidad}</dd>
              <dt>Presupuesto min.</dt>
              <dd>{formatoMoneda.format(presupuestoMin)}</dd>
              <dt>Presupuesto máx.</dt>
              <dd>{formatoMoneda.format(presupuestoMax)}</dd>
              <dt>Plazo entrega</dt>
              <dd>{proyecto.plazo_dias} días</dd>
              <dt>Publicado</dt>
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
              {modoEdicion ? 'Editar postulación' : 'Postularme a este proyecto'}
            </h2>
            <p className="modal-desc">
              {modoEdicion
                ? 'Actualiza tu mensaje de presentación o tu propuesta económica.'
                : 'Cuéntale a la empresa por qué eres el candidato ideal y cuáles son tus expectativas.'}
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

              {/* Tarifa por hora */}
              <div className="modal-campo">
                <label className="modal-label">
                  <DollarSign size={14} /> Tu tarifa por hora (₡)
                </label>
                <input
                  className="modal-input"
                  type="number"
                  min="1"
                  step="100"
                  value={tarifaHora}
                  onChange={(e) => setTarifaHora(Number(e.target.value))}
                />
                <span className="modal-ayuda">Lo que cobrás por hora de trabajo</span>
              </div>

              {/* Tabla de tareas */}
              <div className="modal-campo">
                <label className="modal-label">
                  <Briefcase size={14} /> Desglose de tareas
                </label>
                <div className="modal-tareas">
                  {tareas.map((tarea, i) => (
                    <div key={i} className="modal-tarea-fila">
                      <input
                        className="modal-input modal-tarea-nombre"
                        type="text"
                        placeholder="Nombre de la tarea"
                        value={tarea.nombre}
                        onChange={(e) => actualizarTarea(i, 'nombre', e.target.value)}
                      />
                      <input
                        className="modal-input modal-tarea-horas"
                        type="number"
                        min="0"
                        step="1"
                        placeholder="Horas"
                        value={tarea.horas}
                        onChange={(e) => actualizarTarea(i, 'horas', e.target.value)}
                      />
                      <span className="modal-tarea-costo">
                        ₡{((Number(tarea.horas) || 0) * tarifaHora).toLocaleString('es-CR')}
                      </span>
                      <button
                        type="button"
                        className="modal-tarea-eliminar"
                        onClick={() => eliminarTarea(i)}
                        disabled={tareas.length === 1}
                        aria-label="Eliminar tarea"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
                <button type="button" className="modal-tarea-agregar" onClick={agregarTarea}>
                  <Plus size={14} /> Agregar tarea
                </button>
              </div>

              {/* Resumen de cotización */}
              {total > 0 && (
                <div className="modal-cotizacion-resumen">
                  <div className="modal-cotizacion-fila">
                    <span>Total de horas</span>
                    <span>{totalHoras} h</span>
                  </div>
                  <div className="modal-cotizacion-fila">
                    <span>Subtotal</span>
                    <span>₡{subtotal.toLocaleString('es-CR')}</span>
                  </div>
                  <div className="modal-cotizacion-fila">
                    <span>IVA (13 %)</span>
                    <span>₡{iva.toLocaleString('es-CR')}</span>
                  </div>
                  <div className="modal-cotizacion-fila modal-cotizacion-total">
                    <span>Total</span>
                    <span>₡{total.toLocaleString('es-CR')}</span>
                  </div>

                  {presupuestoMin > 0 && (
                    <p className={`modal-presupuesto-alerta ${
                      total >= presupuestoMin && total <= presupuestoMax
                        ? 'modal-presupuesto-alerta--dentro'
                        : total > presupuestoMax
                          ? 'modal-presupuesto-alerta--supera'
                          : 'modal-presupuesto-alerta--bajo'
                    }`}>
                      {total >= presupuestoMin && total <= presupuestoMax
                        ? 'Tu cotización está dentro del presupuesto'
                        : total > presupuestoMax
                          ? `Tu cotización supera el presupuesto máximo (₡${presupuestoMax.toLocaleString('es-CR')})`
                          : 'Tu cotización está por debajo del mínimo esperado'}
                    </p>
                  )}
                </div>
              )}

              {/* Error de validación */}
              {errorCotizacion && (
                <p className="modal-error-cotizacion">{errorCotizacion}</p>
              )}

              {/* Mensaje de presentación */}
              <div className="modal-campo">
                <label className="modal-label">
                  <Mail size={14} /> Mensaje de presentación <span className="modal-opcional">(opcional)</span>
                </label>
                <textarea
                  className="modal-textarea"
                  placeholder="Ej: Tengo experiencia en React y Node.js, he trabajado en proyectos similares..."
                  rows={3}
                  value={mensaje}
                  onChange={(e) => setMensaje(e.target.value)}
                />
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
