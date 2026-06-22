import { useState, useEffect, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { adminService } from '../../services/adminService';
import { 
  Briefcase, 
  Search, 
  Filter, 
  ArrowLeft,
  FileText,
  AlertCircle,
  CheckCircle,
  User,
  Clock,
  Paperclip,
  Activity,
  Users,
  ShieldAlert
} from 'lucide-react';
import InsigniaEstado from '../../components/comun/InsigniaEstado';

export default function AdminProyectos({ onAdminChange }) {
  const { t } = useTranslation();
  
  // Listado
  const [proyectos, setProyectos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtroEstado, setFiltroEstado] = useState('TODOS');
  const [busqueda, setBusqueda] = useState('');
  const [meta, setMeta] = useState({ page: 1, limit: 25, total: 0, hasMore: false });

  // Detalle
  const [proyectoSeleccionado, setProyectoSeleccionado] = useState(null);
  const [loadingDetalle, setLoadingDetalle] = useState(false);
  const [tabActiva, setTabActiva] = useState('RESUMEN');
  const [filtroMensaje, setFiltroMensaje] = useState('');
  const [filtroUsuarioMensaje, setFiltroUsuarioMensaje] = useState('TODOS');
  const [fechaMensajeDesde, setFechaMensajeDesde] = useState('');
  const [fechaMensajeHasta, setFechaMensajeHasta] = useState('');

  // Acciones Administrativas
  const [nuevoEstado, setNuevoEstado] = useState('');
  const [notaAdmin, setNotaAdmin] = useState('');
  const [procesandoAccion, setProcesandoAccion] = useState(false);
  const [mensajeLocal, setMensajeLocal] = useState(null);

  const cargarProyectos = useCallback(async (page = 1, reset = false) => {
    try {
      if (reset) {
        setLoading(true);
        setProyectos([]);
      }
      const response = await adminService.getProyectos({
        page,
        limit: meta.limit,
        estado: filtroEstado,
        search: busqueda
      });

      if (response.success) {
        setProyectos(prev => reset ? response.data : [...prev, ...response.data]);
        setMeta(response.meta);
      }
    } catch (error) {
      console.error('Error cargando proyectos:', error);
      setMensajeLocal({ tipo: 'error', texto: t('admin.messages.loadProjectsError', 'Error al cargar proyectos.') });
    } finally {
      setLoading(false);
    }
  }, [filtroEstado, busqueda, meta.limit, t]);

  useEffect(() => {
    const timer = setTimeout(() => {
      cargarProyectos(1, true);
    }, 500);
    return () => clearTimeout(timer);
  }, [filtroEstado, busqueda, cargarProyectos]);

  const cargarDetalle = async (id) => {
    setLoadingDetalle(true);
    setMensajeLocal(null);
    try {
      const response = await adminService.getProyectoDetalle(id);
      if (response.success) {
        setProyectoSeleccionado(response.data);
        setNuevoEstado(response.data.estado);
        setTabActiva('RESUMEN');
        limpiarFiltrosMensajes();
      }
    } catch (error) {
      console.error('Error cargando detalle de proyecto:', error);
      setMensajeLocal({ tipo: 'error', texto: t('admin.messages.loadProjectDetailError', 'Error al cargar el detalle del proyecto.') });
    } finally {
      setLoadingDetalle(false);
    }
  };

  const manejarCambioEstado = async (e) => {
    e.preventDefault();
    if (!nuevoEstado) return;

    setProcesandoAccion(true);
    setMensajeLocal(null);
    try {
      const res = await adminService.updateProyectoEstado(proyectoSeleccionado.id_propuesta, nuevoEstado, notaAdmin);
      if (res.success) {
        setMensajeLocal({ tipo: 'success', texto: t('admin.proyectos.statusUpdated', 'Estado actualizado exitosamente.') });
        setNotaAdmin('');
        // Recargar detalle y listado
        cargarDetalle(proyectoSeleccionado.id_propuesta);
        if (onAdminChange) onAdminChange();
      }
    } catch (error) {
      console.error('Error actualizando estado del proyecto:', error);
      setMensajeLocal({ tipo: 'error', texto: t('admin.proyectos.statusUpdateError', 'Error al actualizar el estado del proyecto.') });
    } finally {
      setProcesandoAccion(false);
    }
  };

  const volverAlListado = () => {
    setProyectoSeleccionado(null);
    setMensajeLocal(null);
    cargarProyectos(1, true);
  };

  const formatearFechaHora = (fecha) => {
    if (!fecha) return 'Sin fecha';
    const parsed = new Date(fecha);
    if (Number.isNaN(parsed.getTime())) return 'Sin fecha';
    return parsed.toLocaleString('es-CR', { dateStyle: 'medium', timeStyle: 'short' });
  };

  const mensajesAdmin = useMemo(() => proyectoSeleccionado?.mensajesAdmin || [], [proyectoSeleccionado]);
  const actividadAdmin = useMemo(() => proyectoSeleccionado?.actividadAdmin || [], [proyectoSeleccionado]);
  const seguimientoUsuarios = useMemo(() => proyectoSeleccionado?.seguimientoUsuarios || [], [proyectoSeleccionado]);

  const usuariosMensaje = useMemo(() => {
    const usuarios = new Map();
    mensajesAdmin.forEach((mensaje) => {
      if (mensaje.usuario?.id_usuario) {
        usuarios.set(mensaje.usuario.id_usuario, mensaje.usuario);
      }
    });
    return Array.from(usuarios.values()).sort((a, b) => (a.nombre || '').localeCompare(b.nombre || '', 'es-CR'));
  }, [mensajesAdmin]);

  const mensajesFiltrados = useMemo(() => {
    const texto = filtroMensaje.trim().toLowerCase();
    const desde = fechaMensajeDesde ? new Date(`${fechaMensajeDesde}T00:00:00`).getTime() : null;
    const hasta = fechaMensajeHasta ? new Date(`${fechaMensajeHasta}T23:59:59`).getTime() : null;

    return mensajesAdmin.filter((mensaje) => {
      const fecha = new Date(mensaje.fecha_envio).getTime();
      const coincideTexto = !texto || [
        mensaje.contenido,
        mensaje.usuario?.nombre,
        mensaje.usuario?.correo,
        mensaje.estado,
      ].some((valor) => String(valor || '').toLowerCase().includes(texto));
      const coincideUsuario = filtroUsuarioMensaje === 'TODOS' || String(mensaje.usuario?.id_usuario) === filtroUsuarioMensaje;
      const coincideDesde = !desde || fecha >= desde;
      const coincideHasta = !hasta || fecha <= hasta;
      return coincideTexto && coincideUsuario && coincideDesde && coincideHasta;
    });
  }, [fechaMensajeDesde, fechaMensajeHasta, filtroMensaje, filtroUsuarioMensaje, mensajesAdmin]);

  const limpiarFiltrosMensajes = () => {
    setFiltroMensaje('');
    setFiltroUsuarioMensaje('TODOS');
    setFechaMensajeDesde('');
    setFechaMensajeHasta('');
  };

  if (proyectoSeleccionado) {
    return (
      <div className="admin-config-section" style={{ animation: 'fadeIn 0.3s ease' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
          <button className="admin-secondary-button" onClick={volverAlListado}>
            <ArrowLeft size={16} /> Volver
          </button>
          <h2 style={{ margin: 0 }}>{proyectoSeleccionado.titulo}</h2>
          <InsigniaEstado status={proyectoSeleccionado.estado} />
        </div>

        <div className="admin-kpi-strip" style={{ marginBottom: '1.5rem' }}>
          <div className="admin-kpi-item">
            <span>Participantes</span>
            <strong>{proyectoSeleccionado.indicadoresAdmin?.totalParticipantes || 0}</strong>
          </div>
          <div className="admin-kpi-item">
            <span>Mensajes</span>
            <strong>{proyectoSeleccionado.indicadoresAdmin?.totalMensajes || 0}</strong>
          </div>
          <div className="admin-kpi-item">
            <span>Actividad 24h</span>
            <strong>{proyectoSeleccionado.indicadoresAdmin?.eventosUltimas24h || 0}</strong>
          </div>
          <div className="admin-kpi-item">
            <span>Reportes pendientes</span>
            <strong>{proyectoSeleccionado.indicadoresAdmin?.reportesPendientes || 0}</strong>
          </div>
        </div>

        {mensajeLocal && (
          <div className={`admin-config-message ${mensajeLocal.tipo}`} style={{ marginBottom: '1.5rem' }}>
            {mensajeLocal.tipo === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
            {mensajeLocal.texto}
          </div>
        )}

        <div className="admin-tabs" style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid var(--border)', marginBottom: '1.5rem', paddingBottom: '0.5rem' }}>
          {['RESUMEN', 'OFERTAS', 'MENSAJES', 'ACTIVIDAD', 'SEGUIMIENTO', 'AUDITORIA'].map(tab => (
            <button
              key={tab}
              className={`admin-nav-link ${tabActiva === tab ? 'active' : ''}`}
              onClick={() => setTabActiva(tab)}
              style={{ padding: '0.5rem 1rem', background: 'none', border: 'none', cursor: 'pointer', fontWeight: tabActiva === tab ? 'bold' : 'normal', color: tabActiva === tab ? 'var(--accent)' : 'inherit' }}
            >
              {t(`admin.proyectos.tabs.${tab.toLowerCase()}`, tab)}
            </button>
          ))}
        </div>

        {tabActiva === 'RESUMEN' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div className="admin-panel" style={{ padding: '1.5rem' }}>
              <h3>{t('admin.proyectos.generalInfo', 'Información General')}</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
                <div><strong>Empresa:</strong> {proyectoSeleccionado.perfilEmpresario?.usuario?.nombre || 'N/A'}</div>
                <div><strong>Contacto:</strong> {proyectoSeleccionado.perfilEmpresario?.usuario?.correo || 'N/A'}</div>
                <div><strong>Presupuesto Min:</strong> ${proyectoSeleccionado.presupuesto_min}</div>
                <div><strong>Presupuesto Max:</strong> ${proyectoSeleccionado.presupuesto_max || 'N/A'}</div>
                <div><strong>Plazo:</strong> {proyectoSeleccionado.plazo_dias} días</div>
                <div><strong>Fecha Publicación:</strong> {new Date(proyectoSeleccionado.fecha_publicacion).toLocaleDateString()}</div>
              </div>
            </div>
            <div className="admin-panel" style={{ padding: '1.5rem' }}>
              <h3>{t('admin.proyectos.requirements', 'Requerimientos')}</h3>
              <p style={{ marginTop: '1rem', whiteSpace: 'pre-wrap', color: 'var(--text-muted)' }}>{proyectoSeleccionado.descripcion}</p>
              
              <h4 style={{ marginTop: '1.5rem' }}>{t('admin.proyectos.technologies', 'Tecnologías')}</h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.5rem' }}>
                {proyectoSeleccionado.tecnologias?.map(t => (
                  <span key={t.id_tecnologia} style={{ padding: '0.25rem 0.5rem', background: 'var(--surface-hover)', borderRadius: '4px', fontSize: '0.85rem' }}>
                    {t.nombre}
                  </span>
                )) || <span className="admin-muted-cell">Ninguna</span>}
              </div>
            </div>
          </div>
        )}

        {tabActiva === 'OFERTAS' && (
          <div className="admin-panel">
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>{t('admin.proyectos.candidate', 'Candidato')}</th>
                    <th>{t('admin.proyectos.amount', 'Monto Ofrecido')}</th>
                    <th>{t('admin.proyectos.date', 'Fecha')}</th>
                    <th>{t('admin.proyectos.status', 'Estado')}</th>
                  </tr>
                </thead>
                <tbody>
                  {proyectoSeleccionado.ofertas?.length === 0 ? (
                    <tr><td colSpan="4" className="admin-muted-cell">{t('admin.proyectos.noOffers', 'No hay ofertas recibidas.')}</td></tr>
                  ) : (
                    proyectoSeleccionado.ofertas?.map(oferta => (
                      <tr key={oferta.id_oferta}>
                        <td>{oferta.perfilEstudiante?.usuario?.nombre || 'Usuario Desconocido'}</td>
                        <td>${oferta.cantidad}</td>
                        <td>{new Date(oferta.fecha_oferta).toLocaleDateString()}</td>
                        <td><InsigniaEstado status={oferta.estado} /></td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tabActiva === 'MENSAJES' && (
          <div className="admin-panel" style={{ padding: '1.5rem' }}>
            <div className="admin-config-message warning" style={{ marginBottom: '1.5rem' }}>
              <ShieldAlert size={16} />
              {t('admin.proyectos.messagesReadOnly', 'Conversación completa en modo solo lectura para auditoría.')}
            </div>

            <div className="admin-queue-filters admin-queue-filters-compact" style={{ padding: 0, borderBottom: 0, marginBottom: '1rem' }}>
              <label className="admin-search admin-filter-field">
                <Search size={16} />
                <input
                  type="search"
                  placeholder="Buscar por mensaje, usuario o estado"
                  value={filtroMensaje}
                  onChange={(event) => setFiltroMensaje(event.target.value)}
                />
              </label>
              <label className="admin-date-filter">
                <span>Usuario</span>
                <select className="admin-filter-select" value={filtroUsuarioMensaje} onChange={(event) => setFiltroUsuarioMensaje(event.target.value)}>
                  <option value="TODOS">Todos</option>
                  {usuariosMensaje.map((usuario) => (
                    <option key={usuario.id_usuario} value={usuario.id_usuario}>{usuario.nombre}</option>
                  ))}
                </select>
              </label>
              <label className="admin-date-filter">
                <span>Desde</span>
                <input type="date" value={fechaMensajeDesde} onChange={(event) => setFechaMensajeDesde(event.target.value)} />
              </label>
              <label className="admin-date-filter">
                <span>Hasta</span>
                <input type="date" value={fechaMensajeHasta} onChange={(event) => setFechaMensajeHasta(event.target.value)} />
              </label>
              <button className="admin-action-button neutral" type="button" onClick={limpiarFiltrosMensajes}>
                Limpiar
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '0.75rem', marginBottom: '1rem' }}>
              <div className="admin-config-card"><strong>{mensajesAdmin.length}</strong><span> mensajes totales</span></div>
              <div className="admin-config-card"><strong>{proyectoSeleccionado.indicadoresAdmin?.mensajesConArchivos || 0}</strong><span> con archivos</span></div>
              <div className="admin-config-card"><strong>{proyectoSeleccionado.indicadoresAdmin?.mensajesUltimas24h || 0}</strong><span> últimas 24h</span></div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '560px', overflowY: 'auto', paddingRight: '1rem' }}>
              {mensajesFiltrados.length === 0 ? (
                <div className="admin-muted-cell" style={{ textAlign: 'center', padding: '2rem' }}>
                  {t('admin.proyectos.noMessages', 'No hay mensajes que coincidan con los filtros.')}
                </div>
              ) : (
                mensajesFiltrados.map(mensaje => (
                  <div key={mensaje.id_mensaje} style={{ background: 'var(--surface)', padding: '1rem', borderRadius: '12px', border: '1px solid var(--border)', borderLeft: mensaje.usuario?.rol === 'EMPRESARIO' ? '4px solid var(--accent)' : '4px solid var(--magenta)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', marginBottom: '0.5rem', fontSize: '0.85rem', color: 'var(--ink-muted)', flexWrap: 'wrap' }}>
                      <strong>{mensaje.usuario?.nombre || 'Usuario'} ({mensaje.usuario?.rol || 'N/A'})</strong>
                      <span><Clock size={13} style={{ display: 'inline', marginRight: 4 }} />{formatearFechaHora(mensaje.fecha_envio)}</span>
                    </div>
                    <p style={{ margin: 0, color: mensaje.eliminado ? 'var(--ink-subtle)' : 'var(--ink-strong)', whiteSpace: 'pre-wrap' }}>
                      {mensaje.eliminado ? 'Mensaje eliminado' : mensaje.contenido}
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.75rem' }}>
                      <InsigniaEstado status={mensaje.estado} />
                      {mensaje.editado && <span className="admin-status-pill warning">Editado</span>}
                      {mensaje.eliminado && <span className="admin-status-pill danger">Eliminado</span>}
                      {mensaje.archivo_url && (
                        <a className="admin-link-button" href={mensaje.archivo_url} target="_blank" rel="noreferrer">
                          <Paperclip size={14} /> Archivo adjunto
                        </a>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {tabActiva === 'ACTIVIDAD' && (
          <div className="admin-panel" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <h3 style={{ margin: 0 }}>Actividad del proyecto</h3>
                <p style={{ margin: '0.25rem 0 0', color: 'var(--ink-muted)' }}>
                  Línea de tiempo de postulaciones, mensajes, ofertas, archivos, reportes y cambios administrativos.
                </p>
              </div>
              <span className="admin-status-pill warning">
                <Activity size={13} /> {actividadAdmin.length} eventos
              </span>
            </div>

            <div style={{ display: 'grid', gap: '0.75rem' }}>
              {actividadAdmin.length === 0 ? (
                <div className="admin-muted-cell" style={{ textAlign: 'center', padding: '2rem' }}>No hay actividad registrada.</div>
              ) : (
                actividadAdmin.map((evento) => (
                  <article key={evento.id} style={{ display: 'grid', gridTemplateColumns: '150px 1fr', gap: '1rem', padding: '1rem', border: '1px solid var(--border)', borderRadius: '12px', background: 'var(--surface)' }}>
                    <div style={{ color: 'var(--ink-muted)', fontSize: '0.82rem', fontWeight: 750 }}>
                      {formatearFechaHora(evento.fecha)}
                    </div>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                        <strong>{evento.titulo}</strong>
                        <span className={`admin-status-pill ${evento.severidad === 'danger' ? 'danger' : evento.severidad === 'warning' ? 'warning' : 'success'}`}>
                          {evento.tipo}
                        </span>
                      </div>
                      <p style={{ margin: '0.4rem 0', color: 'var(--ink)' }}>{evento.detalle}</p>
                      <small style={{ color: 'var(--ink-muted)' }}>
                        Realizado por: {evento.actor}
                        {evento.metadata?.archivo_url && (
                          <> · <a className="admin-link-button" href={evento.metadata.archivo_url} target="_blank" rel="noreferrer"><Paperclip size={13} /> Ver archivo</a></>
                        )}
                      </small>
                    </div>
                  </article>
                ))
              )}
            </div>
          </div>
        )}

        {tabActiva === 'SEGUIMIENTO' && (
          <div className="admin-panel">
            <div className="admin-panel-header">
              <div>
                <h3>Seguimiento de Usuarios</h3>
                <span className="admin-review-note">Empresa y egresados participantes en este proyecto.</span>
              </div>
              <span className="admin-status-pill success">
                <Users size={13} /> {seguimientoUsuarios.length} usuarios
              </span>
            </div>
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Usuario</th>
                    <th>Rol</th>
                    <th>Postulaciones</th>
                    <th>Ofertas</th>
                    <th>Mensajes</th>
                    <th>Archivos</th>
                    <th>Acciones recientes</th>
                  </tr>
                </thead>
                <tbody>
                  {seguimientoUsuarios.length === 0 ? (
                    <tr><td colSpan="7" className="admin-muted-cell">No hay usuarios asociados.</td></tr>
                  ) : seguimientoUsuarios.map((usuario) => (
                    <tr key={usuario.id_usuario}>
                      <td>
                        <div className="admin-user-cell">
                          <span className="admin-user-avatar">{usuario.nombre?.slice(0, 2).toUpperCase() || 'US'}</span>
                          <span>
                            <span className="admin-user-name">{usuario.nombre}</span>
                            <span className="admin-user-email">{usuario.correo}</span>
                          </span>
                        </div>
                      </td>
                      <td><span className="admin-type-pill egresado"><User size={13} /> {usuario.tipo}</span></td>
                      <td className="admin-muted-cell">{usuario.postulaciones}</td>
                      <td className="admin-muted-cell">{usuario.ofertas}</td>
                      <td className="admin-muted-cell">{usuario.mensajes}</td>
                      <td className="admin-muted-cell">{usuario.archivos}</td>
                      <td>
                        <div style={{ display: 'grid', gap: '0.25rem' }}>
                          {usuario.accionesRecientes?.length ? usuario.accionesRecientes.slice(0, 3).map((accion, index) => (
                            <span key={`${usuario.id_usuario}-${accion.tipo}-${index}`} className="admin-user-email">
                              {accion.tipo}: {accion.detalle} · {formatearFechaHora(accion.fecha)}
                            </span>
                          )) : <span className="admin-muted-cell">Sin actividad reciente</span>}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tabActiva === 'AUDITORIA' && (
          <div className="admin-panel" style={{ padding: '1.5rem', maxWidth: '600px' }}>
            <h3>{t('admin.proyectos.adminActions', 'Acciones Administrativas')}</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
              {t('admin.proyectos.adminActionsDesc', 'Cambia el estado de este proyecto si infringe normativas o necesita ser revisado.')}
            </p>

            <form onSubmit={manejarCambioEstado} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="admin-form-group">
                <label className="admin-label">{t('admin.proyectos.newStatus', 'Nuevo Estado')}</label>
                <select 
                  className="admin-input" 
                  value={nuevoEstado} 
                  onChange={(e) => setNuevoEstado(e.target.value)}
                  disabled={procesandoAccion}
                >
                  <option value="ACTIVA">Activa</option>
                  <option value="PAUSADA">En revisión / Pausada</option>
                  <option value="CANCELADA">Cancelada</option>
                  <option value="CERRADA">Cerrada</option>
                </select>
              </div>

              <div className="admin-form-group">
                <label className="admin-label">{t('admin.proyectos.adminNote', 'Nota Administrativa (Auditoría)')}</label>
                <textarea 
                  className="admin-input" 
                  rows="3" 
                  placeholder={t('admin.proyectos.adminNotePlaceholder', 'Motivo del cambio de estado...')}
                  value={notaAdmin}
                  onChange={(e) => setNotaAdmin(e.target.value)}
                  disabled={procesandoAccion}
                  required
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
                <button className="admin-primary-button" type="submit" disabled={procesandoAccion || nuevoEstado === proyectoSeleccionado.estado}>
                  {procesandoAccion ? t('admin.common.saving', 'Guardando...') : t('admin.proyectos.saveChanges', 'Actualizar Estado')}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="admin-config-section" style={{ animation: 'fadeIn 0.3s ease' }}>
      {mensajeLocal && (
        <div className={`admin-config-message ${mensajeLocal.tipo}`} style={{ marginBottom: '1.5rem' }}>
          {mensajeLocal.tipo === 'error' ? <AlertCircle size={16} /> : <CheckCircle size={16} />}
          {mensajeLocal.texto}
        </div>
      )}

      <div className="admin-toolbar" style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <div className="admin-search-wrapper" style={{ flex: 1, minWidth: '250px' }}>
          <Search size={16} className="admin-search-icon" />
          <input
            type="text"
            className="admin-search-input"
            placeholder={t('admin.proyectos.searchPlaceholder', 'Buscar por título o empresa...')}
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>

        <div className="admin-filter-wrapper">
          <Filter size={16} className="admin-filter-icon" />
          <select 
            className="admin-filter-select"
            value={filtroEstado}
            onChange={(e) => setFiltroEstado(e.target.value)}
          >
            <option value="TODOS">{t('admin.proyectos.filterAll', 'Todos los estados')}</option>
            <option value="ACTIVA">{t('admin.proyectos.filterActive', 'Activa')}</option>
            <option value="PAUSADA">{t('admin.proyectos.filterInReview', 'En Revisión / Pausada')}</option>
            <option value="CANCELADA">{t('admin.proyectos.filterCancelled', 'Cancelada')}</option>
            <option value="CERRADA">{t('admin.proyectos.filterClosed', 'Cerrada')}</option>
          </select>
        </div>
      </div>

      <div className="admin-panel">
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>{t('admin.proyectos.tableTitle', 'Título')}</th>
                <th>{t('admin.proyectos.tableCompany', 'Empresa')}</th>
                <th>{t('admin.proyectos.tableStatus', 'Estado')}</th>
                <th>{t('admin.proyectos.tableOffers', 'Ofertas')}</th>
                <th>{t('admin.proyectos.tableDate', 'Fecha')}</th>
                <th className="admin-table-actions">{t('admin.proyectos.tableActions', 'Acciones')}</th>
              </tr>
            </thead>
            <tbody>
              {loading && proyectos.length === 0 ? (
                <tr><td colSpan="6" className="admin-muted-cell">{t('admin.proyectos.loading', 'Cargando proyectos...')}</td></tr>
              ) : proyectos.length === 0 ? (
                <tr><td colSpan="6" className="admin-muted-cell">{t('admin.proyectos.noProjects', 'No se encontraron proyectos.')}</td></tr>
              ) : (
                proyectos.map((proyecto) => (
                  <tr key={proyecto.id_propuesta}>
                    <td>
                      <div className="admin-entity-cell">
                        <span className="admin-entity-icon cyan"><Briefcase size={14} /></span>
                        <span>{proyecto.titulo}</span>
                      </div>
                    </td>
                    <td>{proyecto.perfilEmpresario?.usuario?.nombre || 'Desconocido'}</td>
                    <td><InsigniaEstado status={proyecto.estado} /></td>
                    <td>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', padding: '0.15rem 0.5rem', background: 'var(--surface-hover)', borderRadius: '12px', fontSize: '0.8rem' }}>
                        <FileText size={12} /> {proyecto.cantidad_ofertas || 0}
                      </span>
                    </td>
                    <td>{new Date(proyecto.fecha_publicacion).toLocaleDateString()}</td>
                    <td className="admin-table-actions">
                      <button 
                        className="admin-secondary-button" 
                        type="button" 
                        onClick={() => cargarDetalle(proyecto.id_propuesta)}
                        disabled={loadingDetalle}
                      >
                        {loadingDetalle ? t('admin.common.loading', 'Cargando...') : t('admin.proyectos.viewDetails', 'Supervisar')}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {meta.hasMore && (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1.5rem' }}>
          <button 
            className="admin-secondary-button" 
            onClick={() => cargarProyectos(meta.page + 1)}
            disabled={loading}
          >
            {loading ? t('admin.common.loading', 'Cargando...') : t('admin.proyectos.loadMore', 'Cargar más')}
          </button>
        </div>
      )}
    </div>
  );
}
