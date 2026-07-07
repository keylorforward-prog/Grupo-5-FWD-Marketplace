import { useEffect, useMemo, useState } from 'react';
import { Save, UserRound, X } from 'lucide-react';
import {
  MENSAJE_CEDULA_INVALIDA,
  MENSAJE_TELEFONO_INVALIDO,
  esCedulaValida,
  esTelefonoValido,
  formatearCedula,
  formatearTelefono,
} from '../../../utils/inputMasks';

const usuarioInicial = {
  nombre: '',
  cedula: '',
  correo: '',
  rol: 'ESTUDIANTE',
  estado_cuenta: 'PENDIENTE',
  telefono_whatsapp: '',
  foto_perfil: '',
  tipo_empresa: '',
  cargo: '',
  estado_admin: '',
  provider: 'LOCAL',
  avatar_url: '',
  perfil_completo: false,
};

const perfilEstudianteInicial = {
  titulo_fwd: '',
  sede_graduacion: '',
  estado_verificacion: 'PENDIENTE',
  reputacion_total: '',
  descripcion: '',
  telefono_whatsapp: '',
  motivo_rechazo: '',
  metodo_verificacion: '',
  match_automatico: false,
};

const perfilEmpresarioInicial = {
  sector: '',
  descripcion: '',
  logo: '',
  sitio_web: '',
  telefono_whatsapp: '',
  cedula_juridica_archivo: '',
};

const normalizarBooleano = (valor) => valor === true || valor === 'true';

export default function AdminUsuarioModal({
  open,
  usuario,
  loading = false,
  onCancel,
  onSave,
}) {
  const [formUsuario, setFormUsuario] = useState(usuarioInicial);
  const [formEstudiante, setFormEstudiante] = useState(perfilEstudianteInicial);
  const [formEmpresario, setFormEmpresario] = useState(perfilEmpresarioInicial);

  useEffect(() => {
    if (!usuario) return;

    setFormUsuario({
      ...usuarioInicial,
      nombre: usuario.nombre || '',
      cedula: formatearCedula(usuario.cedula || ''),
      correo: usuario.correo || '',
      rol: usuario.rol || 'ESTUDIANTE',
      estado_cuenta: usuario.estado_cuenta || 'PENDIENTE',
      telefono_whatsapp: formatearTelefono(usuario.telefono_whatsapp || ''),
      foto_perfil: usuario.foto_perfil || '',
      tipo_empresa: usuario.tipo_empresa || '',
      cargo: usuario.cargo || '',
      estado_admin: usuario.estado_admin || '',
      provider: usuario.provider || 'LOCAL',
      avatar_url: usuario.avatar_url || '',
      perfil_completo: Boolean(usuario.perfil_completo),
    });

    setFormEstudiante({
      ...perfilEstudianteInicial,
      ...(usuario.perfilEstudiante || {}),
      titulo_fwd: usuario.perfilEstudiante?.titulo_fwd || '',
      sede_graduacion: usuario.perfilEstudiante?.sede_graduacion || '',
      estado_verificacion: usuario.perfilEstudiante?.estado_verificacion || 'PENDIENTE',
      reputacion_total: usuario.perfilEstudiante?.reputacion_total || '',
      descripcion: usuario.perfilEstudiante?.descripcion || '',
      telefono_whatsapp: formatearTelefono(usuario.perfilEstudiante?.telefono_whatsapp || ''),
      motivo_rechazo: usuario.perfilEstudiante?.motivo_rechazo || '',
      metodo_verificacion: usuario.perfilEstudiante?.metodo_verificacion || '',
      match_automatico: Boolean(usuario.perfilEstudiante?.match_automatico),
    });

    setFormEmpresario({
      ...perfilEmpresarioInicial,
      ...(usuario.perfilEmpresario || {}),
      sector: usuario.perfilEmpresario?.sector || '',
      descripcion: usuario.perfilEmpresario?.descripcion || '',
      logo: usuario.perfilEmpresario?.logo || '',
      sitio_web: usuario.perfilEmpresario?.sitio_web || '',
      telefono_whatsapp: formatearTelefono(usuario.perfilEmpresario?.telefono_whatsapp || ''),
      cedula_juridica_archivo: usuario.perfilEmpresario?.cedula_juridica_archivo || '',
    });
  }, [usuario]);

  const subtitulo = useMemo(() => {
    if (!usuario) return '';
    return `${usuario.correo || 'Sin correo'} · ID ${usuario.id_usuario}`;
  }, [usuario]);

  if (!open || !usuario) return null;

  const cambiarUsuario = (campo, valor) => {
    const normalizado = campo === 'cedula'
      ? formatearCedula(valor)
      : campo === 'telefono_whatsapp'
        ? formatearTelefono(valor)
        : valor;
    setFormUsuario((actual) => ({ ...actual, [campo]: normalizado }));
  };
  const cambiarEstudiante = (campo, valor) => {
    const normalizado = campo === 'telefono_whatsapp' ? formatearTelefono(valor) : valor;
    setFormEstudiante((actual) => ({ ...actual, [campo]: normalizado }));
  };
  const cambiarEmpresario = (campo, valor) => {
    const normalizado = campo === 'telefono_whatsapp' ? formatearTelefono(valor) : valor;
    setFormEmpresario((actual) => ({ ...actual, [campo]: normalizado }));
  };

  const guardar = () => {
    if (formUsuario.cedula && !esCedulaValida(formUsuario.cedula)) {
      window.alert(MENSAJE_CEDULA_INVALIDA);
      return;
    }
    if (formUsuario.telefono_whatsapp && !esTelefonoValido(formUsuario.telefono_whatsapp)) {
      window.alert(MENSAJE_TELEFONO_INVALIDO);
      return;
    }
    if (formUsuario.rol === 'ESTUDIANTE' && formEstudiante.telefono_whatsapp && !esTelefonoValido(formEstudiante.telefono_whatsapp)) {
      window.alert(MENSAJE_TELEFONO_INVALIDO);
      return;
    }
    if (formUsuario.rol === 'EMPRESARIO' && formEmpresario.telefono_whatsapp && !esTelefonoValido(formEmpresario.telefono_whatsapp)) {
      window.alert(MENSAJE_TELEFONO_INVALIDO);
      return;
    }

    const payload = {
      usuario: {
        ...formUsuario,
        perfil_completo: normalizarBooleano(formUsuario.perfil_completo),
      },
      perfilEstudiante: formUsuario.rol === 'ESTUDIANTE' ? {
        ...formEstudiante,
        match_automatico: normalizarBooleano(formEstudiante.match_automatico),
      } : null,
      perfilEmpresario: formUsuario.rol === 'EMPRESARIO' ? formEmpresario : null,
    };

    onSave(usuario.id_usuario, payload);
  };

  return (
    <div className="admin-modal-backdrop" role="presentation" onMouseDown={onCancel}>
      <div className="admin-modal admin-user-edit-modal" role="dialog" aria-modal="true" onMouseDown={(event) => event.stopPropagation()}>
        <div className="admin-modal-header">
          <span className="admin-modal-icon info">
            <UserRound size={20} />
          </span>
          <button className="admin-modal-close" type="button" onClick={onCancel} aria-label="Cerrar">
            <X size={18} />
          </button>
        </div>

        <div className="admin-modal-copy">
          <h3>Información del usuario</h3>
          <p>{subtitulo}</p>
        </div>

        <div className="admin-user-edit-grid">
          <label className="admin-edit-field">
            <span>Nombre</span>
            <input value={formUsuario.nombre} onChange={(event) => cambiarUsuario('nombre', event.target.value)} />
          </label>
          <label className="admin-edit-field">
            <span>Cédula</span>
            <input value={formUsuario.cedula} onChange={(event) => cambiarUsuario('cedula', event.target.value)} inputMode="numeric" maxLength={11} placeholder="6-0491-0942" />
          </label>
          <label className="admin-edit-field">
            <span>Correo</span>
            <input type="email" value={formUsuario.correo} onChange={(event) => cambiarUsuario('correo', event.target.value)} />
          </label>
          <label className="admin-edit-field">
            <span>WhatsApp</span>
            <input value={formUsuario.telefono_whatsapp} onChange={(event) => cambiarUsuario('telefono_whatsapp', event.target.value)} inputMode="numeric" maxLength={9} placeholder="7104-1281" />
          </label>
          <label className="admin-edit-field">
            <span>Rol</span>
            <select value={formUsuario.rol} onChange={(event) => cambiarUsuario('rol', event.target.value)}>
              <option value="ADMIN">ADMIN</option>
              <option value="ESTUDIANTE">ESTUDIANTE</option>
              <option value="EMPRESARIO">EMPRESARIO</option>
            </select>
          </label>
          <label className="admin-edit-field">
            <span>Estado cuenta</span>
            <select value={formUsuario.estado_cuenta} onChange={(event) => cambiarUsuario('estado_cuenta', event.target.value)}>
              <option value="ACTIVA">ACTIVA</option>
              <option value="PENDIENTE">PENDIENTE</option>
              <option value="SUSPENDIDA">SUSPENDIDA</option>
            </select>
          </label>
          <label className="admin-edit-field">
            <span>Tipo empresa</span>
            <input value={formUsuario.tipo_empresa} onChange={(event) => cambiarUsuario('tipo_empresa', event.target.value)} />
          </label>
          <label className="admin-edit-field">
            <span>Cargo admin</span>
            <input value={formUsuario.cargo} onChange={(event) => cambiarUsuario('cargo', event.target.value)} />
          </label>
          <label className="admin-edit-field">
            <span>Estado admin</span>
            <select value={formUsuario.estado_admin || ''} onChange={(event) => cambiarUsuario('estado_admin', event.target.value)}>
              <option value="">Sin estado</option>
              <option value="ACTIVO">ACTIVO</option>
              <option value="INACTIVO">INACTIVO</option>
            </select>
          </label>
          <label className="admin-edit-field">
            <span>Perfil completo</span>
            <select value={String(formUsuario.perfil_completo)} onChange={(event) => cambiarUsuario('perfil_completo', event.target.value)}>
              <option value="true">Sí</option>
              <option value="false">No</option>
            </select>
          </label>
          <label className="admin-edit-field admin-edit-field-wide">
            <span>Foto perfil URL</span>
            <input value={formUsuario.foto_perfil} onChange={(event) => cambiarUsuario('foto_perfil', event.target.value)} />
          </label>
          <label className="admin-edit-field admin-edit-field-wide">
            <span>Avatar URL</span>
            <input value={formUsuario.avatar_url} onChange={(event) => cambiarUsuario('avatar_url', event.target.value)} />
          </label>
        </div>

        {formUsuario.rol === 'ESTUDIANTE' && (
          <section className="admin-edit-section">
            <h4>Perfil egresado FWD</h4>
            <div className="admin-user-edit-grid">
              <label className="admin-edit-field admin-edit-field-wide">
                <span>Título / evidencia FWD</span>
                <input value={formEstudiante.titulo_fwd} onChange={(event) => cambiarEstudiante('titulo_fwd', event.target.value)} />
              </label>
              <label className="admin-edit-field">
                <span>Sede graduación</span>
                <input value={formEstudiante.sede_graduacion} onChange={(event) => cambiarEstudiante('sede_graduacion', event.target.value)} />
              </label>
              <label className="admin-edit-field">
                <span>Estado verificación</span>
                <select value={formEstudiante.estado_verificacion} onChange={(event) => cambiarEstudiante('estado_verificacion', event.target.value)}>
                  <option value="PENDIENTE">PENDIENTE</option>
                  <option value="VERIFICADO">VERIFICADO</option>
                  <option value="RECHAZADO">RECHAZADO</option>
                </select>
              </label>
              <label className="admin-edit-field">
                <span>Reputación</span>
                <input value={formEstudiante.reputacion_total} onChange={(event) => cambiarEstudiante('reputacion_total', event.target.value)} />
              </label>
              <label className="admin-edit-field">
                <span>Método verificación</span>
                <select value={formEstudiante.metodo_verificacion || ''} onChange={(event) => cambiarEstudiante('metodo_verificacion', event.target.value)}>
                  <option value="">Sin método</option>
                  <option value="API">API</option>
                  <option value="MANUAL">MANUAL</option>
                  <option value="DOCUMENTO">DOCUMENTO</option>
                </select>
              </label>
              <label className="admin-edit-field">
                <span>Match automático</span>
                <select value={String(formEstudiante.match_automatico)} onChange={(event) => cambiarEstudiante('match_automatico', event.target.value)}>
                  <option value="true">Sí</option>
                  <option value="false">No</option>
                </select>
              </label>
              <label className="admin-edit-field">
                <span>WhatsApp perfil</span>
                <input value={formEstudiante.telefono_whatsapp} onChange={(event) => cambiarEstudiante('telefono_whatsapp', event.target.value)} inputMode="numeric" maxLength={9} placeholder="7104-1281" />
              </label>
              <label className="admin-edit-field admin-edit-field-wide">
                <span>Motivo rechazo</span>
                <textarea value={formEstudiante.motivo_rechazo} onChange={(event) => cambiarEstudiante('motivo_rechazo', event.target.value)} />
              </label>
              <label className="admin-edit-field admin-edit-field-wide">
                <span>Descripción</span>
                <textarea value={formEstudiante.descripcion} onChange={(event) => cambiarEstudiante('descripcion', event.target.value)} />
              </label>
            </div>
          </section>
        )}

        {formUsuario.rol === 'EMPRESARIO' && (
          <section className="admin-edit-section">
            <h4>Perfil empresa</h4>
            <div className="admin-user-edit-grid">
              <label className="admin-edit-field">
                <span>Sector</span>
                <input value={formEmpresario.sector} onChange={(event) => cambiarEmpresario('sector', event.target.value)} />
              </label>
              <label className="admin-edit-field">
                <span>Sitio web</span>
                <input value={formEmpresario.sitio_web} onChange={(event) => cambiarEmpresario('sitio_web', event.target.value)} />
              </label>
              <label className="admin-edit-field">
                <span>WhatsApp perfil</span>
                <input value={formEmpresario.telefono_whatsapp} onChange={(event) => cambiarEmpresario('telefono_whatsapp', event.target.value)} inputMode="numeric" maxLength={9} placeholder="7104-1281" />
              </label>
              <label className="admin-edit-field admin-edit-field-wide">
                <span>Logo URL</span>
                <input value={formEmpresario.logo} onChange={(event) => cambiarEmpresario('logo', event.target.value)} />
              </label>
              <label className="admin-edit-field admin-edit-field-wide">
                <span>Cédula jurídica archivo</span>
                <input value={formEmpresario.cedula_juridica_archivo} onChange={(event) => cambiarEmpresario('cedula_juridica_archivo', event.target.value)} />
              </label>
              <label className="admin-edit-field admin-edit-field-wide">
                <span>Descripción</span>
                <textarea value={formEmpresario.descripcion} onChange={(event) => cambiarEmpresario('descripcion', event.target.value)} />
              </label>
            </div>
          </section>
        )}

        {usuario.detalleAdmin && (
          <section className="admin-edit-section">
            <h4>Actividad y trazabilidad</h4>
            <div className="admin-kpi-strip">
              <div className="admin-kpi-item">
                <span>Postulaciones</span>
                <strong>{usuario.detalleAdmin.actividad?.postulaciones || 0}</strong>
              </div>
              <div className="admin-kpi-item">
                <span>Ofertas</span>
                <strong>{usuario.detalleAdmin.actividad?.ofertas || 0}</strong>
              </div>
              <div className="admin-kpi-item">
                <span>Reportes</span>
                <strong>{usuario.detalleAdmin.reportes?.length || 0}</strong>
              </div>
              <div className="admin-kpi-item">
                <span>Notificaciones</span>
                <strong>{usuario.detalleAdmin.notificaciones?.length || 0}</strong>
              </div>
            </div>
            <div className="admin-detail-mini-grid">
              <div>
                <h5>Auditoría reciente</h5>
                {(usuario.detalleAdmin.auditoria || []).slice(0, 5).map((evento) => (
                  <p key={evento.id_auditoria} className="admin-user-email">{evento.accion} · {new Date(evento.fecha).toLocaleDateString('es-CR')}</p>
                ))}
              </div>
              <div>
                <h5>Notificaciones recientes</h5>
                {(usuario.detalleAdmin.notificaciones || []).slice(0, 5).map((notificacion) => (
                  <p key={notificacion.id_notificacion} className="admin-user-email">{notificacion.tipo} · {notificacion.mensaje}</p>
                ))}
              </div>
            </div>
          </section>
        )}

        <div className="admin-modal-actions">
          <button className="admin-action-button neutral" type="button" onClick={onCancel} disabled={loading}>
            Cancelar
          </button>
          <button className="admin-action-button success" type="button" onClick={guardar} disabled={loading}>
            <Save size={14} />
            {loading ? 'Guardando...' : 'Guardar cambios'}
          </button>
        </div>
      </div>
    </div>
  );
}
