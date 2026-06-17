import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Check, Edit3, Eye, PauseCircle, PlayCircle, Save, Trash2, XCircle } from 'lucide-react';
import { dashboardEmpresarioService } from '../../../../../services/dashboardEmpresarioService';
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
});

export default function Proyectos() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [refreshKey, setRefreshKey] = useState(0);
  const [editandoId, setEditandoId] = useState(null);
  const [formulario, setFormulario] = useState({});
  const [accionandoId, setAccionandoId] = useState(null);
  const [mensaje, setMensaje] = useState('');
  const { data: propuestas, loading, error } = useDashboardEmpresarioRequest(
    () => dashboardEmpresarioService.obtenerPropuestas(),
    [],
    [refreshKey]
  );

  const proyectos = propuestas.map(formatearPropuesta);
  const refrescarPropuestas = () => setRefreshKey((key) => key + 1);

  const iniciarEdicion = (propuesta) => {
    setEditandoId(propuesta.id_propuesta);
    setFormulario(crearFormulario(propuesta));
    setMensaje('');
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

  return (
    <DashboardLayout activePage="proyectos">
      <div className="de-page-heading">
        <h1>{t('empresaProyectos.title')}</h1>
        <button className="de-btn-primary" type="button" onClick={() => navigate('/DashboardEmpresario/publicar-proyecto')}>{t('empresaProyectos.btnPublish')}</button>
      </div>
      <div className="de-panel">
        {mensaje && (
          <p className={`de-data-state ${mensaje.includes('No se pudo') || mensaje.includes('Could not') ? 'error' : ''}`}>
            {mensaje}
          </p>
        )}
        <EstadoDatos loading={loading} error={error} empty={!proyectos.length} emptyText={t('empresaProyectos.empty')} />
        {!loading && !error && propuestas.map((propuesta, index) => {
          const p = formatearPropuesta(propuesta, index);
          const estaEditando = editandoId === propuesta.id_propuesta;
          const estaOcupado = accionandoId === propuesta.id_propuesta;
          const estaPausado = propuesta.estado === 'PAUSADA';

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
              </div>
              <div className="de-project-action de-project-action-managed">
                <button className="de-project-btn" type="button" onClick={() => navigate('/DashboardEmpresario/ofertas')}>
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
                <button className="de-project-icon-button danger" type="button" onClick={() => eliminarProyecto(propuesta.id_propuesta)} disabled={estaOcupado} aria-label={t('empresaProyectos.aria.delete')}>
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
