import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
      setMensaje('Proyecto actualizado correctamente.');
      cancelarEdicion();
      refrescarPropuestas();
    } catch (err) {
      setMensaje(err.response?.data?.message || 'No se pudo actualizar el proyecto.');
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
      setMensaje(err.response?.data?.message || 'No se pudo cambiar el estado del proyecto.');
    } finally {
      setAccionandoId(null);
    }
  };

  const eliminarProyecto = async (id) => {
    const confirmado = window.confirm('¿Quieres eliminar este proyecto? Esta accion no se puede deshacer.');
    if (!confirmado) return;

    setAccionandoId(id);
    setMensaje('');
    try {
      await dashboardEmpresarioService.eliminarPropuesta(id);
      setMensaje('Proyecto eliminado correctamente.');
      refrescarPropuestas();
    } catch (err) {
      setMensaje(err.response?.data?.message || 'No se pudo eliminar el proyecto.');
    } finally {
      setAccionandoId(null);
    }
  };

  return (
    <DashboardLayout activePage="proyectos">
      <div className="de-page-heading">
        <h1>Mis Proyectos</h1>
        <button className="de-btn-primary" type="button" onClick={() => navigate('/DashboardEmpresario/publicar-proyecto')}>Publicar Proyecto</button>
      </div>
      <div className="de-panel">
        {mensaje && (
          <p className={`de-data-state ${mensaje.includes('No se pudo') ? 'error' : ''}`}>
            {mensaje}
          </p>
        )}
        <EstadoDatos loading={loading} error={error} empty={!proyectos.length} emptyText="Aun no tienes proyectos publicados." />
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
                    <input className="de-form-control" name="titulo" value={formulario.titulo} onChange={cambiarCampo} placeholder="Titulo" />
                    <input className="de-form-control" name="tecnologias_requeridas" value={formulario.tecnologias_requeridas} onChange={cambiarCampo} placeholder="Tecnologias" />
                    <div className="de-project-edit-row">
                      <select className="de-form-control" name="plazo_dias" value={formulario.plazo_dias} onChange={cambiarCampo}>
                        <option value="5">5 dias</option>
                        <option value="15">15 dias</option>
                        <option value="30">30 dias</option>
                      </select>
                      <input className="de-form-control" name="presupuesto_min" value={formulario.presupuesto_min} onChange={cambiarCampo} type="number" min="0" placeholder="Presupuesto min" />
                      <input className="de-form-control" name="presupuesto_max" value={formulario.presupuesto_max} onChange={cambiarCampo} type="number" min="0" placeholder="Presupuesto max" />
                      <input className="de-form-control" name="fecha_limite" value={formulario.fecha_limite} onChange={cambiarCampo} type="date" />
                    </div>
                    <textarea className="de-form-control de-form-textarea" name="descripcion" value={formulario.descripcion} onChange={cambiarCampo} placeholder="Descripcion" />
                    <div className="de-project-edit-actions">
                      <button className="de-btn-primary" type="button" onClick={() => guardarCambios(propuesta.id_propuesta)} disabled={estaOcupado}>
                        <Save size={15} />
                        {estaOcupado ? 'Guardando...' : 'Guardar'}
                      </button>
                      <button className="de-btn-outline" type="button" onClick={cancelarEdicion}>
                        <XCircle size={15} />
                        Cancelar
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
                <button className="de-project-icon-button" type="button" onClick={() => iniciarEdicion(propuesta)} disabled={estaOcupado} aria-label="Editar proyecto">
                  <Edit3 size={16} />
                </button>
                <button
                  className="de-project-icon-button"
                  type="button"
                  onClick={() => cambiarEstado(propuesta.id_propuesta, estaPausado ? 'ACTIVA' : 'PAUSADA')}
                  disabled={estaOcupado || propuesta.estado === 'CERRADA' || propuesta.estado === 'CANCELADA'}
                  aria-label={estaPausado ? 'Activar proyecto' : 'Pausar proyecto'}
                >
                  {estaPausado ? <PlayCircle size={16} /> : <PauseCircle size={16} />}
                </button>
                <button
                  className="de-project-icon-button"
                  type="button"
                  onClick={() => cambiarEstado(propuesta.id_propuesta, 'CERRADA')}
                  disabled={estaOcupado || propuesta.estado === 'CERRADA'}
                  aria-label="Cerrar proyecto"
                >
                  <Check size={16} />
                </button>
                <button className="de-project-icon-button danger" type="button" onClick={() => eliminarProyecto(propuesta.id_propuesta)} disabled={estaOcupado} aria-label="Eliminar proyecto">
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
