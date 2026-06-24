import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Check, CheckCircle, ChevronDown, ChevronUp, Clock, Edit3, ExternalLink, Eye, PauseCircle, PlayCircle, Plus, Save, Trash2, XCircle, AlertTriangle, Sparkles } from 'lucide-react';
import { dashboardEmpresarioService } from '../../../../../services/dashboardEmpresarioService';
import ModalResena from '../../../../../components/ModalResena/ModalResena';
import DashboardLayout from '../../components/DashboardLayout';
import EstadoDatos from '../../components/EstadoDatos';
import { useDashboardEmpresarioRequest } from '../../hooks/useDashboardEmpresarioRequest';
import { formatearPropuesta } from '../../utils/dashboardEmpresarioFormatters';

const crearFormulario = (propuesta) => ({
  titulo: propuesta.titulo || '',
  descripcion: propuesta.descripcion || '',
  tecnologias_requeridas: propuesta.tecnologias_requeridas || '',
  plazo_dias: String(propuesta.plazo_dias || 15),
  presupuesto_min: propuesta.presupuesto_min ?? '',
  presupuesto_max: propuesta.presupuesto_max ?? '',
  fecha_limite: propuesta.fecha_limite ? propuesta.fecha_limite.slice(0, 10) : '',
  github_url: propuesta.github_url || '',
});

const CONFIRMAR_TEXTO = 'ELIMINAR';

export default function Proyectos() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [refreshKey, setRefreshKey] = useState(0);
  const [editandoId, setEditandoId] = useState(null);
  const [formulario, setFormulario] = useState({});
  const [accionandoId, setAccionandoId] = useState(null);
  const [mensaje, setMensaje] = useState('');
  const [detalleId, setDetalleId] = useState(null);

  const [eliminarModal, setEliminarModal] = useState({ abierto: false, id: null, nombre: '' });
  const [confirmText, setConfirmText] = useState('');
  const [cerrarConfirm, setCerrarConfirm] = useState({ abierto: false, id: null, nombre: '' });
  const [finalizarConfirm, setFinalizarConfirm] = useState({ abierto: false, idProyecto: null, nombre: '' });
  const [finalizandoId, setFinalizandoId] = useState(null);
  const [yaCalificados, setYaCalificados] = useState({});
  const [modalResena, setModalResena] = useState({ abierto: false, propuesta: null });

  const { data: propuestas, loading, error } = useDashboardEmpresarioRequest(
    () => dashboardEmpresarioService.obtenerPropuestas(),
    [],
    [refreshKey]
  );

  const proyectos = propuestas.map(formatearPropuesta);
  const refrescarPropuestas = () => setRefreshKey((key) => key + 1);

  useEffect(() => {
    const completadas = propuestas.filter((p) => p.proyecto?.estado === 'COMPLETADO');
    if (!completadas.length) return;
    let activo = true;
    Promise.all(
      completadas.map(async (p) => {
        try {
          const r = await dashboardEmpresarioService.obtenerResenaPropia(p.proyecto.id_proyecto, 'EMPRESARIO');
          return [p.proyecto.id_proyecto, !!r?.data];
        } catch {
          return [p.proyecto.id_proyecto, false];
        }
      })
    ).then((pares) => {
      if (activo) setYaCalificados(Object.fromEntries(pares));
    });
    return () => { activo = false; };
  }, [propuestas]);

  const historialPropuestas = propuestas
    .filter((p) => p.estado === 'CERRADA' || p.estado === 'CANCELADA')
    .sort((a, b) => new Date(b.fecha_limite || 0) - new Date(a.fecha_limite || 0))
    .slice(0, 3);

  const historialProyectos = historialPropuestas.map(formatearPropuesta);

  const iniciarEdicion = (propuesta) => {
    setEditandoId(propuesta.id_propuesta);
    setFormulario(crearFormulario(propuesta));
    setMensaje('');
    setDetalleId(null);
  };

  const cancelarEdicion = () => {
    setEditandoId(null);
    setFormulario({});
  };

  const cambiarCampo = (evento) => {
    const { name, value } = evento.target;
    setFormulario((prev) => ({ ...prev, [name]: value }));
  };

  const normalizarPayload = (payload) => ({
    ...payload,
    plazo_dias: Number(payload.plazo_dias),
    presupuesto_min: payload.presupuesto_min === '' ? null : Number(payload.presupuesto_min),
    presupuesto_max: payload.presupuesto_max === '' ? null : Number(payload.presupuesto_max),
    fecha_limite: payload.fecha_limite || null,
  });

  const guardarCambios = async (id) => {
    setAccionandoId(id);
    setMensaje('');
    try {
      await dashboardEmpresarioService.actualizarPropuesta(id, normalizarPayload(formulario));
      setMensaje(t('empresaProyectos.msgUpdateSuccess'));
      cancelarEdicion();
      refrescarPropuestas();
    } catch (err) {
      setMensaje(err.response?.data?.message || t('empresaProyectos.msgUpdateError'));
    } finally {
      setAccionandoId(null);
    }
  };

  const cambiarEstado = async (id, estado) => {
    setAccionandoId(id);
    setMensaje('');
    try {
      await dashboardEmpresarioService.actualizarPropuesta(id, { estado });
      refrescarPropuestas();
    } catch (err) {
      setMensaje(err.response?.data?.message || t('empresaProyectos.msgStatusError'));
    } finally {
      setAccionandoId(null);
    }
  };

  const abrirEliminar = useCallback((id, nombre, tipo = 'proyecto') => {
    setEliminarModal({ abierto: true, id, nombre, tipo });
    setConfirmText('');
  }, []);

  const cerrarEliminar = useCallback(() => {
    setEliminarModal({ abierto: false, id: null, nombre: '', tipo: 'proyecto' });
    setConfirmText('');
  }, []);

  const ejecutarEliminar = useCallback(async () => {
    const { id, tipo } = eliminarModal;
    if (!id) return;
    setAccionandoId(id);
    setMensaje('');
    cerrarEliminar();
    try {
      await dashboardEmpresarioService.eliminarPropuesta(id);
      setMensaje(t('empresaProyectos.msgDeleteSuccess'));
      refrescarPropuestas();
    } catch (err) {
      setMensaje(err.response?.data?.message || t('empresaProyectos.msgDeleteError'));
    } finally {
      setAccionandoId(null);
    }
  }, [eliminarModal, cerrarEliminar, refrescarPropuestas, t]);

  const toggleDetalle = (id) => {
    setDetalleId((prev) => (prev === id ? null : id));
  };

  const toggleHistorialDetalle = (id) => {
    setDetalleId((prev) => (prev === id ? null : id));
  };

  const abrirCerrarConfirm = (id, nombre) => {
    setCerrarConfirm({ abierto: true, id, nombre });
  };

  const cerrarCerrarConfirm = () => {
    setCerrarConfirm({ abierto: false, id: null, nombre: '' });
  };

  const ejecutarCerrar = async () => {
    const { id } = cerrarConfirm;
    if (!id) return;
    cerrarCerrarConfirm();
    await cambiarEstado(id, 'CERRADA');
  };

  const abrirFinalizarConfirm = (idProyecto, nombre) => {
    setFinalizarConfirm({ abierto: true, idProyecto, nombre });
  };

  const cerrarFinalizarConfirm = () => {
    setFinalizarConfirm({ abierto: false, idProyecto: null, nombre: '' });
  };

  const ejecutarFinalizar = async () => {
    const { idProyecto } = finalizarConfirm;
    if (!idProyecto) return;
    cerrarFinalizarConfirm();
    setFinalizandoId(idProyecto);
    setMensaje('');
    try {
      await dashboardEmpresarioService.completarProyecto(idProyecto);
      setMensaje('Proyecto marcado como finalizado.');
      refrescarPropuestas();
    } catch (err) {
      setMensaje(err.response?.data?.message || 'Error al finalizar el proyecto.');
    } finally {
      setFinalizandoId(null);
    }
  };

  const renderDetallePropuesta = (propuesta) => {
    if (detalleId !== propuesta.id_propuesta) return null;
    return (
      <div className="de-project-detail">
        <div className="de-detail-grid">
          {propuesta.descripcion && (
            <div className="de-detail-section">
              <strong>{t('empresaProyectos.detailDesc')}</strong>
              <p>{propuesta.descripcion}</p>
            </div>
          )}
          {propuesta.tecnologias_requeridas && (
            <div className="de-detail-section">
              <strong>{t('empresaProyectos.detailTech')}</strong>
              <p>{propuesta.tecnologias_requeridas}</p>
            </div>
          )}
          <div className="de-detail-row">
            {propuesta.presupuesto_min != null && (
              <span><strong>{t('empresaProyectos.detailBudget')}:</strong> ₡{Number(propuesta.presupuesto_min).toLocaleString()}{propuesta.presupuesto_max != null ? ` - ₡${Number(propuesta.presupuesto_max).toLocaleString()}` : ''}</span>
            )}
            {propuesta.plazo_dias && (
              <span><strong>Plazo:</strong> {propuesta.plazo_dias} días</span>
            )}
          </div>
          {propuesta.fecha_limite && (
            <div className="de-detail-section">
              <strong>{t('empresaProyectos.detailDeadline')}:</strong> {new Date(propuesta.fecha_limite).toLocaleDateString()}
            </div>
          )}
          {propuesta.github_url && (
            <div className="de-detail-section">
              <strong>GitHub</strong>
              <a href={propuesta.github_url.startsWith('http') ? propuesta.github_url : `https://${propuesta.github_url}`} target="_blank" rel="noopener noreferrer" className="de-detail-link">
                {propuesta.github_url} <ExternalLink size={12} />
              </a>
            </div>
          )}
          <div className="de-detail-row">
            <span><strong>{t('empresaProyectos.detailStatus')}:</strong> <span className={`de-badge ${propuesta.estado === 'ACTIVA' ? 'recepcion' : propuesta.estado === 'PAUSADA' ? 'pendiente' : 'finalizado'}`}>{propuesta.estado}</span></span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <DashboardLayout activePage="proyectos">
      <div className="de-page-heading">
        <div>
          <h1>{t('empresaProyectos.title')}</h1>
          <p style={{ color: 'var(--ink-muted)', fontSize: '0.85rem', marginTop: '0.15rem' }}>
            Gestiona tus proyectos activos y el historial de trabajos realizados.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button className="de-btn-primary" type="button" onClick={() => navigate('/DashboardEmpresario/publicar-proyecto')}>
            <Plus size={18} /> {t('empresaProyectos.btnPublish')}
          </button>
          <button className="de-btn-outline" type="button" onClick={() => navigate('/DashboardEmpresario/crear-proyecto-ia')}>
            <Sparkles size={18} /> {t('empresaDashboardInicio.hero.btnAIPublish')}
          </button>
        </div>
      </div>

      {mensaje && (
        <div className={`de-form-message ${mensaje.includes('Error') || mensaje.includes('Could not') ? 'error' : 'success'}`}>
          {mensaje}
        </div>
      )}

      <div className="de-panel">
        <div className="de-panel-header">
          <h3 className="de-panel-title">{t('empresaProyectos.activeTitle') || 'Proyectos activos'}</h3>
        </div>
        <EstadoDatos loading={loading} error={error} empty={!proyectos.length} emptyText={t('empresaProyectos.empty')} />
        {!loading && !error && propuestas.map((propuesta, index) => {
          const p = formatearPropuesta(propuesta, index);
          const estaEditando = editandoId === propuesta.id_propuesta;
          const estaOcupado = accionandoId === propuesta.id_propuesta;
          const estaPausado = propuesta.estado === 'PAUSADA';
          const estaExpandido = detalleId === propuesta.id_propuesta;

          return (
            <div key={p.id} className="de-project-item de-project-item-managed">
              <div className={`de-project-icon-wrap ${p.iconColor}`}>
                <img src={p.arrowSrc} alt="" className="de-project-arrow" width="24" height="24" loading="lazy" decoding="async" />
              </div>
              <div className="de-project-info">
                <div className="de-project-name">
                  {p.name}
                  <span className={`de-badge ${p.statusType}`}>{p.status}</span>
                </div>
                <p className="de-project-meta">{p.meta}</p>
                {estaEditando && (
                  <div className="de-project-edit-form">
                    <input className="de-form-control" name="titulo" value={formulario.titulo} onChange={cambiarCampo} placeholder={t('empresaProyectos.form.title')} />
                    <input className="de-form-control" name="tecnologias_requeridas" value={formulario.tecnologias_requeridas} onChange={cambiarCampo} placeholder={t('empresaProyectos.form.tech')} />
                    <div className="de-project-edit-row">
                      <select className="de-form-control" name="plazo_dias" value={formulario.plazo_dias} onChange={cambiarCampo}>
                        <option value="5">{t('empresaProyectos.form.days5')}</option>
                        <option value="15">{t('empresaProyectos.form.days15')}</option>
                        <option value="30">{t('empresaProyectos.form.days30')}</option>
                      </select>
                      <input className="de-form-control" name="presupuesto_min" value={formulario.presupuesto_min} onChange={cambiarCampo} type="number" min="0" placeholder={t('empresaProyectos.form.budgetMin')} />
                      <input className="de-form-control" name="presupuesto_max" value={formulario.presupuesto_max} onChange={cambiarCampo} type="number" min="0" placeholder={t('empresaProyectos.form.budgetMax')} />
                      <input className="de-form-control" name="fecha_limite" value={formulario.fecha_limite} onChange={cambiarCampo} type="date" />
                    </div>
                    <input className="de-form-control" name="github_url" value={formulario.github_url} onChange={cambiarCampo} placeholder={t('empresaProyectos.form.githubUrl')} />
                    <textarea className="de-form-control de-form-textarea" name="descripcion" value={formulario.descripcion} onChange={cambiarCampo} placeholder={t('empresaProyectos.form.desc')} />
                    <div className="de-project-edit-actions">
                      <button className="de-btn-primary" type="button" onClick={() => guardarCambios(propuesta.id_propuesta)} disabled={estaOcupado}>
                        <Save size={15} />
                        {estaOcupado ? t('empresaProyectos.form.saving') : t('empresaProyectos.form.save')}
                      </button>
                      <button className="de-btn-outline" type="button" onClick={cancelarEdicion}>
                        <XCircle size={15} />
                        {t('empresaProyectos.form.cancel')}
                      </button>
                    </div>
                  </div>
                )}
                {renderDetallePropuesta(propuesta)}
              </div>
              <div className="de-project-action de-project-action-managed">
                <button className="de-project-btn" type="button" onClick={() => navigate(`/DashboardEmpresario/ofertas?id_propuesta=${propuesta.id_propuesta}`)}>
                  <Eye size={14} />
                  {p.action}
                </button>
                <button className="de-project-icon-button" type="button" onClick={() => iniciarEdicion(propuesta)} disabled={estaOcupado} aria-label={t('empresaProyectos.aria.edit')}>
                  <Edit3 size={16} />
                </button>
                <button
                  className="de-project-icon-button"
                  type="button"
                  onClick={() => cambiarEstado(propuesta.id_propuesta, estaPausado ? 'ACTIVA' : 'PAUSADA')}
                  disabled={estaOcupado || propuesta.estado === 'CERRADA' || propuesta.estado === 'CANCELADA'}
                  aria-label={estaPausado ? t('empresaProyectos.aria.activate') : t('empresaProyectos.aria.pause')}
                >
                  {estaPausado ? <PlayCircle size={16} /> : <PauseCircle size={16} />}
                </button>
                <button
                  className="de-project-icon-button"
                  type="button"
                  onClick={() => abrirCerrarConfirm(propuesta.id_propuesta, p.name)}
                  disabled={estaOcupado || propuesta.estado === 'CERRADA' || propuesta.estado === 'CANCELADA'}
                  aria-label={t('empresaProyectos.aria.close')}
                >
                  <Check size={16} />
                </button>
                <button
                  className="de-project-icon-button"
                  type="button"
                  onClick={() => toggleDetalle(propuesta.id_propuesta)}
                  aria-label="Detalles"
                >
                  {estaExpandido ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
                {(propuesta.proyecto?.estado === 'EN_PROGRESO' || propuesta.proyecto?.estado === 'EN_REVISION') && (
                  <button
                    className="de-btn-primary"
                    type="button"
                    style={{ fontSize: '0.8rem', padding: '0.4rem 0.9rem' }}
                    onClick={() => abrirFinalizarConfirm(propuesta.proyecto.id_proyecto, p.name)}
                    disabled={finalizandoId === propuesta.proyecto.id_proyecto}
                    aria-label="Finalizar proyecto"
                  >
                    <CheckCircle size={14} /> Finalizar
                  </button>
                )}
                {propuesta.proyecto?.estado === 'COMPLETADO' && (
                  yaCalificados[propuesta.proyecto.id_proyecto]
                    ? <span style={{ fontSize: '0.78rem', color: 'var(--ink-muted)', whiteSpace: 'nowrap' }}>Ya calificaste</span>
                    : (
                      <button
                        className="de-btn-primary"
                        type="button"
                        style={{ fontSize: '0.8rem', padding: '0.4rem 0.9rem' }}
                        onClick={() => setModalResena({ abierto: true, propuesta })}
                        aria-label="Calificar proyecto"
                      >
                        Calificar
                      </button>
                    )
                )}
                <button className="de-project-icon-button danger" type="button" onClick={() => abrirEliminar(propuesta.id_propuesta, p.name)} disabled={estaOcupado} aria-label={t('empresaProyectos.aria.delete')}>
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="de-panel de-section-gap" style={{ background: 'color-mix(in srgb, var(--primary) 3%, var(--surface))' }}>
        <div className="de-panel-header">
          <h3 className="de-panel-title">
            <Clock size={16} style={{ marginRight: '0.25rem' }} /> {t('empresaProyectos.historyTitle')} ({historialProyectos.length})
          </h3>
        </div>

        <EstadoDatos loading={false} error={null} empty={!historialProyectos.length} emptyText={t('empresaProyectos.historyEmpty')} />

        {historialPropuestas.map((propuesta) => {
          const h = formatearPropuesta(propuesta);
          const expandido = detalleId === propuesta.id_propuesta;

          return (
            <div key={h.id} className="de-project-item de-project-item-managed">
              <div className="de-project-icon-wrap" style={{ background: 'color-mix(in srgb, var(--ink-muted) 10%, transparent)' }}>
                <Clock size={18} style={{ color: 'var(--ink-muted)' }} />
              </div>
              <div className="de-project-info">
                <div className="de-project-name">
                  {h.name}
                  <span className={`de-badge ${h.statusType}`}>{h.status}</span>
                </div>
                <p className="de-project-meta">{h.meta}</p>
                {renderDetallePropuesta(propuesta)}
              </div>
              <div className="de-project-action de-project-action-managed">
                <button
                  className="de-project-icon-button"
                  type="button"
                  onClick={() => toggleHistorialDetalle(propuesta.id_propuesta)}
                  aria-label="Detalles"
                >
                  {expandido ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {cerrarConfirm.abierto && (
        <div className="de-confirm-overlay" onClick={cerrarCerrarConfirm}>
          <div className="de-confirm-modal" onClick={(e) => e.stopPropagation()}>
            <div className="de-confirm-icon">
              <CheckCircle size={32} />
            </div>

            <p>Cerrar proyecto</p>

            <p className="de-confirm-sub">
              ¿Estás seguro de cerrar <strong>{cerrarConfirm.nombre}</strong>? Los estudiantes ya no podrán postularse.
            </p>

            <div className="de-confirm-actions">
              <button className="de-btn-outline" onClick={cerrarCerrarConfirm}>
                Cancelar
              </button>
              <button className="de-btn-primary" onClick={ejecutarCerrar}>
                <Check size={15} /> Sí, cerrar proyecto
              </button>
            </div>
          </div>
        </div>
      )}

      {modalResena.abierto && modalResena.propuesta && (
        <ModalResena
          idProyecto={modalResena.propuesta.proyecto.id_proyecto}
          rolAutor="EMPRESARIO"
          nombreContraparte={
            modalResena.propuesta.postulaciones?.find((p) => p.estado === 'CONTRATADO')
              ?.perfilEstudiante?.usuario?.nombre || 'el egresado'
          }
          onClose={() => setModalResena({ abierto: false, propuesta: null })}
          onExito={() => {
            const id = modalResena.propuesta.proyecto.id_proyecto;
            setModalResena({ abierto: false, propuesta: null });
            setYaCalificados((prev) => ({ ...prev, [id]: true }));
          }}
        />
      )}

      {finalizarConfirm.abierto && (
        <div className="de-confirm-overlay" onClick={cerrarFinalizarConfirm}>
          <div className="de-confirm-modal" onClick={(e) => e.stopPropagation()}>
            <div className="de-confirm-icon">
              <CheckCircle size={32} />
            </div>
            <p>Finalizar proyecto</p>
            <p className="de-confirm-sub">
              ¿Marcar <strong>{finalizarConfirm.nombre}</strong> como finalizado? El proyecto pasará a estado COMPLETADO.
            </p>
            <div className="de-confirm-actions">
              <button className="de-btn-outline" onClick={cerrarFinalizarConfirm}>
                Cancelar
              </button>
              <button className="de-btn-primary" onClick={ejecutarFinalizar}>
                <CheckCircle size={15} /> Sí, finalizar
              </button>
            </div>
          </div>
        </div>
      )}

      {eliminarModal.abierto && (
        <div className="de-confirm-overlay" onClick={cerrarEliminar}>
          <div className="de-confirm-modal" onClick={(e) => e.stopPropagation()}>
            <div className="de-confirm-icon">
              <AlertTriangle size={32} />
            </div>

            <p>Eliminar proyecto</p>

            <p className="de-confirm-sub">
              ¿Estás seguro de eliminar <strong>{eliminarModal.nombre}</strong>? Esta acción no se puede deshacer.
            </p>

            <div style={{ margin: '0.75rem 0 1rem' }}>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--ink-strong)', marginBottom: '0.45rem' }}>
                Escribe <strong style={{ color: '#dc2626' }}>{CONFIRMAR_TEXTO}</strong> para confirmar
              </label>
              <input
                type="text"
                className="de-form-control"
                style={{ textAlign: 'center', fontWeight: 700, letterSpacing: '0.05em' }}
                placeholder={CONFIRMAR_TEXTO}
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && confirmText === CONFIRMAR_TEXTO) {
                    ejecutarEliminar();
                  }
                }}
              />
            </div>

            <div className="de-confirm-actions">
              <button className="de-btn-outline" onClick={cerrarEliminar}>
                Cancelar
              </button>
              <button className="de-btn-primary danger" disabled={confirmText !== CONFIRMAR_TEXTO} onClick={ejecutarEliminar}>
                {accionandoId === eliminarModal.id ? 'Eliminando...' : <><Trash2 size={15} /> Eliminar</>}
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
