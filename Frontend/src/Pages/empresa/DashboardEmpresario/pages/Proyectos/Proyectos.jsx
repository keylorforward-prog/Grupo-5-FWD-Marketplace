import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Check, ChevronDown, ChevronUp, Edit3, Eye, ExternalLink, PauseCircle, PlayCircle, Plus, Save, Trash2, X, XCircle } from 'lucide-react';
import { dashboardEmpresarioService } from '../../../../../services/dashboardEmpresarioService';
import DashboardLayout from '../../components/DashboardLayout';
import EstadoDatos from '../../components/EstadoDatos';
import { useDashboardEmpresarioRequest } from '../../hooks/useDashboardEmpresarioRequest';
import { formatearPropuesta, formatearHistorial } from '../../utils/dashboardEmpresarioFormatters';

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

const historialVacio = () => ({
  titulo_proyecto: '',
  descripcion: '',
  tecnologias_usadas: '',
  enlace: '',
  fecha_inicio: '',
  fecha_fin: '',
});

export default function Proyectos() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [refreshKey, setRefreshKey] = useState(0);
  const [editandoId, setEditandoId] = useState(null);
  const [formulario, setFormulario] = useState({});
  const [accionandoId, setAccionandoId] = useState(null);
  const [mensaje, setMensaje] = useState('');
  const [detalleId, setDetalleId] = useState(null);

  const [historial, setHistorial] = useState([]);
  const [historialLoading, setHistorialLoading] = useState(true);
  const [historialEditId, setHistorialEditId] = useState(null);
  const [historialForm, setHistorialForm] = useState(null);
  const [historialDetalleId, setHistorialDetalleId] = useState(null);
  const [historialConfirmId, setHistorialConfirmId] = useState(null);
  const [historialSaving, setHistorialSaving] = useState(false);

  const { data: propuestas, loading, error } = useDashboardEmpresarioRequest(
    () => dashboardEmpresarioService.obtenerPropuestas(),
    [],
    [refreshKey]
  );

  const proyectos = propuestas.map(formatearPropuesta);
  const refrescarPropuestas = () => setRefreshKey((key) => key + 1);

  useEffect(() => {
    setHistorialLoading(true);
    dashboardEmpresarioService.obtenerHistorial()
      .then((data) => setHistorial(Array.isArray(data) ? data : []))
      .catch(() => setHistorial([]))
      .finally(() => setHistorialLoading(false));
  }, [refreshKey]);

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

  const eliminarProyecto = async (id) => {
    const confirmado = window.confirm(t('empresaProyectos.msgDeleteConfirm'));
    if (!confirmado) return;
    setAccionandoId(id);
    setMensaje('');
    try {
      await dashboardEmpresarioService.eliminarPropuesta(id);
      setMensaje(t('empresaProyectos.msgDeleteSuccess'));
      refrescarPropuestas();
    } catch (err) {
      setMensaje(err.response?.data?.message || t('empresaProyectos.msgDeleteError'));
    } finally {
      setAccionandoId(null);
    }
  };

  const toggleDetalle = (id) => {
    setDetalleId((prev) => (prev === id ? null : id));
  };

  const iniciarHistorialEdit = (item) => {
    setHistorialEditId(item.id_historial_empresa);
    setHistorialForm({
      titulo_proyecto: item.titulo_proyecto || '',
      descripcion: item.descripcion || '',
      tecnologias_usadas: item.tecnologias_usadas || '',
      enlace: item.enlace || '',
      fecha_inicio: item.fecha_inicio ? item.fecha_inicio.slice(0, 10) : '',
      fecha_fin: item.fecha_fin ? item.fecha_fin.slice(0, 10) : '',
    });
    setHistorialDetalleId(null);
  };

  const iniciarHistorialNuevo = () => {
    setHistorialEditId('nuevo');
    setHistorialForm(historialVacio());
  };

  const cancelarHistorialEdit = () => {
    setHistorialEditId(null);
    setHistorialForm(null);
  };

  const cambiarHistorialCampo = (e) => {
    const { name, value } = e.target;
    setHistorialForm((prev) => ({ ...prev, [name]: value }));
  };

  const guardarHistorial = async () => {
    if (!historialForm?.titulo_proyecto?.trim()) return;
    setHistorialSaving(true);
    try {
      if (historialEditId === 'nuevo') {
        const creado = await dashboardEmpresarioService.crearHistorial(historialForm);
        setHistorial((prev) => [creado, ...prev]);
      } else {
        const actualizado = await dashboardEmpresarioService.actualizarHistorial(historialEditId, historialForm);
        setHistorial((prev) => prev.map((h) => (h.id_historial_empresa === historialEditId ? actualizado : h)));
      }
      cancelarHistorialEdit();
      setMensaje(t('empresaProyectos.historySaved'));
    } catch {
      setMensaje('Error al guardar el historial.');
    } finally {
      setHistorialSaving(false);
    }
  };

  const eliminarHistorialItem = async (id) => {
    setHistorialSaving(true);
    try {
      await dashboardEmpresarioService.eliminarHistorial(id);
      setHistorial((prev) => prev.filter((h) => h.id_historial_empresa !== id));
      setHistorialConfirmId(null);
      setMensaje(t('empresaProyectos.historyDeleted'));
    } catch {
      setMensaje('Error al eliminar.');
    } finally {
      setHistorialSaving(false);
    }
  };

  const toggleHistorialDetalle = (id) => {
    setHistorialDetalleId((prev) => (prev === id ? null : id));
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

  const renderDetalleHistorial = (item) => {
    if (historialDetalleId !== item.id_historial_empresa) return null;
    return (
      <div className="de-project-detail">
        <div className="de-detail-grid">
          {item.descripcion && (
            <div className="de-detail-section">
              <strong>{t('empresaProyectos.detailDesc')}</strong>
              <p>{item.descripcion}</p>
            </div>
          )}
          {item.tecnologias_usadas && (
            <div className="de-detail-section">
              <strong>{t('empresaProyectos.detailTech')}</strong>
              <p>{item.tecnologias_usadas}</p>
            </div>
          )}
          {(item.fecha_inicio || item.fecha_fin) && (
            <div className="de-detail-row">
              {item.fecha_inicio && <span><strong>{t('empresaProyectos.historyForm.startDate')}:</strong> {new Date(item.fecha_inicio).toLocaleDateString()}</span>}
              {item.fecha_fin && <span><strong>{t('empresaProyectos.historyForm.endDate')}:</strong> {new Date(item.fecha_fin).toLocaleDateString()}</span>}
            </div>
          )}
          {item.enlace && (
            <div className="de-detail-section">
              <strong>URL:</strong>{' '}
              <a href={item.enlace.startsWith('http') ? item.enlace : `https://${item.enlace}`} target="_blank" rel="noopener noreferrer" className="de-detail-link">
                {item.enlace} <ExternalLink size={12} />
              </a>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <DashboardLayout activePage="proyectos">
      <div className="de-page-heading">
        <h1>{t('empresaProyectos.title')}</h1>
        <button className="de-btn-primary" type="button" onClick={() => navigate('/DashboardEmpresario/publicar-proyecto')}>{t('empresaProyectos.btnPublish')}</button>
      </div>

      {mensaje && (
        <p className={`de-data-state ${mensaje.includes('Error') || mensaje.includes('Could not') ? 'error' : ''}`}>
          {mensaje}
        </p>
      )}

      <div className="de-panel">
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
                  onClick={() => cambiarEstado(propuesta.id_propuesta, 'CERRADA')}
                  disabled={estaOcupado || propuesta.estado === 'CERRADA'}
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
                <button className="de-project-icon-button danger" type="button" onClick={() => eliminarProyecto(propuesta.id_propuesta)} disabled={estaOcupado} aria-label={t('empresaProyectos.aria.delete')}>
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="de-panel de-panel-history" style={{ marginTop: '24px' }}>
        <div className="de-page-heading" style={{ marginBottom: '16px' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>{t('empresaProyectos.historyTitle')}</h2>
          <button className="de-btn-primary" type="button" onClick={iniciarHistorialNuevo}>
            <Plus size={15} /> {t('empresaProyectos.historyAdd')}
          </button>
        </div>

        <EstadoDatos loading={historialLoading} error={null} empty={!historial.length && !historialEditId} emptyText={t('empresaProyectos.historyEmpty')} />

        {historialEditId === 'nuevo' && (
          <div className="de-project-item de-project-item-managed" style={{ opacity: 0.9 }}>
            <div className="de-project-icon-wrap blue">
              <Plus size={20} />
            </div>
            <div className="de-project-info">
              <div className="de-project-edit-form">
                <input className="de-form-control" name="titulo_proyecto" value={historialForm.titulo_proyecto} onChange={cambiarHistorialCampo} placeholder={t('empresaProyectos.historyForm.title')} autoFocus />
                <textarea className="de-form-control de-form-textarea" name="descripcion" value={historialForm.descripcion} onChange={cambiarHistorialCampo} placeholder={t('empresaProyectos.historyForm.desc')} rows={2} />
                <input className="de-form-control" name="tecnologias_usadas" value={historialForm.tecnologias_usadas} onChange={cambiarHistorialCampo} placeholder={t('empresaProyectos.historyForm.techPlaceholder')} />
                <input className="de-form-control" name="enlace" value={historialForm.enlace} onChange={cambiarHistorialCampo} placeholder={t('empresaProyectos.historyForm.link')} />
                <div className="de-project-edit-row">
                  <input className="de-form-control" name="fecha_inicio" value={historialForm.fecha_inicio} onChange={cambiarHistorialCampo} type="date" placeholder={t('empresaProyectos.historyForm.startDate')} />
                  <input className="de-form-control" name="fecha_fin" value={historialForm.fecha_fin} onChange={cambiarHistorialCampo} type="date" placeholder={t('empresaProyectos.historyForm.endDate')} />
                </div>
                <div className="de-project-edit-actions">
                  <button className="de-btn-primary" type="button" onClick={guardarHistorial} disabled={historialSaving || !historialForm?.titulo_proyecto?.trim()}>
                    <Save size={15} />
                    {historialSaving ? t('empresaProyectos.historyForm.saving') : t('empresaProyectos.historyForm.save')}
                  </button>
                  <button className="de-btn-outline" type="button" onClick={cancelarHistorialEdit}>
                    <X size={15} />
                    {t('empresaProyectos.historyForm.cancel')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {!historialLoading && historial.map((item, index) => {
          const h = formatearHistorial(item, index);
          const enEdicion = historialEditId === item.id_historial_empresa;
          const enConfirmacion = historialConfirmId === item.id_historial_empresa;
          const expandido = historialDetalleId === item.id_historial_empresa;

          return (
            <div key={h.id} className="de-project-item de-project-item-managed">
              <div className={`de-project-icon-wrap ${h.iconColor}`}>
                <img src={h.arrowSrc} alt="" className="de-project-arrow" width="24" height="24" loading="lazy" decoding="async" />
              </div>
              <div className="de-project-info">
                <div className="de-project-name">
                  {h.name}
                  <span className={`de-badge ${h.statusType}`}>{h.status}</span>
                </div>
                <p className="de-project-meta">{h.meta}</p>

                {enEdicion && (
                  <div className="de-project-edit-form">
                    <input className="de-form-control" name="titulo_proyecto" value={historialForm.titulo_proyecto} onChange={cambiarHistorialCampo} placeholder={t('empresaProyectos.historyForm.title')} autoFocus />
                    <textarea className="de-form-control de-form-textarea" name="descripcion" value={historialForm.descripcion} onChange={cambiarHistorialCampo} placeholder={t('empresaProyectos.historyForm.desc')} rows={2} />
                    <input className="de-form-control" name="tecnologias_usadas" value={historialForm.tecnologias_usadas} onChange={cambiarHistorialCampo} placeholder={t('empresaProyectos.historyForm.techPlaceholder')} />
                    <input className="de-form-control" name="enlace" value={historialForm.enlace} onChange={cambiarHistorialCampo} placeholder={t('empresaProyectos.historyForm.link')} />
                    <div className="de-project-edit-row">
                      <input className="de-form-control" name="fecha_inicio" value={historialForm.fecha_inicio} onChange={cambiarHistorialCampo} type="date" />
                      <input className="de-form-control" name="fecha_fin" value={historialForm.fecha_fin} onChange={cambiarHistorialCampo} type="date" />
                    </div>
                    <div className="de-project-edit-actions">
                      <button className="de-btn-primary" type="button" onClick={guardarHistorial} disabled={historialSaving || !historialForm?.titulo_proyecto?.trim()}>
                        <Save size={15} />
                        {historialSaving ? t('empresaProyectos.historyForm.saving') : t('empresaProyectos.historyForm.save')}
                      </button>
                      <button className="de-btn-outline" type="button" onClick={cancelarHistorialEdit}>
                        <XCircle size={15} />
                        {t('empresaProyectos.historyForm.cancel')}
                      </button>
                    </div>
                  </div>
                )}

                {enConfirmacion && (
                  <div className="de-project-edit-form" style={{ border: 'none', padding: 0 }}>
                    <p>{t('empresaProyectos.historyDeleteConfirm')}</p>
                    <div className="de-project-edit-actions">
                      <button className="de-btn-primary" type="button" onClick={() => eliminarHistorialItem(item.id_historial_empresa)} disabled={historialSaving} style={{ background: '#dc2626' }}>
                        <Trash2 size={15} /> Sí, eliminar
                      </button>
                      <button className="de-btn-outline" type="button" onClick={() => setHistorialConfirmId(null)}>
                        <X size={15} /> Cancelar
                      </button>
                    </div>
                  </div>
                )}

                {renderDetalleHistorial(item)}
              </div>
              <div className="de-project-action de-project-action-managed">
                <button className="de-project-icon-button" type="button" onClick={() => iniciarHistorialEdit(item)} disabled={historialSaving} aria-label={t('empresaProyectos.aria.edit')}>
                  <Edit3 size={16} />
                </button>
                <button
                  className="de-project-icon-button"
                  type="button"
                  onClick={() => toggleHistorialDetalle(item.id_historial_empresa)}
                  aria-label="Detalles"
                >
                  {expandido ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
                <button className="de-project-icon-button danger" type="button" onClick={() => setHistorialConfirmId(item.id_historial_empresa)} disabled={historialSaving} aria-label={t('empresaProyectos.aria.delete')}>
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </DashboardLayout>
  );
}
