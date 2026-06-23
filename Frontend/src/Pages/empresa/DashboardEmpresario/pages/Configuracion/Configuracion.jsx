import { useState, useEffect, useCallback } from 'react';
import { dashboardEmpresarioService } from '../../../../../services/dashboardEmpresarioService';
import EstadoDatos from '../../components/EstadoDatos';
import DashboardLayout from '../../components/DashboardLayout';

const ESTADO_INICIAL = {
  nombre_empresa: '',
  nombre: '',
  correo: '',
  sector: '',
  sitio_web: '',
  telefono_whatsapp: '',
  descripcion: '',
  notif_correo: true,
  notif_talento: true,
  notif_entregables: true,
};

export default function Configuracion() {
  const [form, setForm] = useState(ESTADO_INICIAL);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState(null);

  const [passActual, setPassActual] = useState('');
  const [passNueva, setPassNueva] = useState('');
  const [guardandoPass, setGuardandoPass] = useState(false);

  useEffect(() => {
    let activo = true;
    setLoading(true);
    dashboardEmpresarioService.obtenerPerfil()
      .then((perfil) => {
        if (!activo) return;
        const usuario = perfil.usuario ?? {};
        setForm((prev) => ({
          ...prev,
          nombre_empresa: perfil.nombre_empresa || '',
          nombre: usuario.nombre || '',
          correo: usuario.correo || '',
          sector: perfil.sector || '',
          sitio_web: perfil.sitio_web || '',
          telefono_whatsapp: perfil.telefono_whatsapp || '',
          descripcion: perfil.descripcion || '',
        }));
      })
      .catch((err) => {
        if (activo) setError('Error al cargar perfil.');
      })
      .finally(() => {
        if (activo) setLoading(false);
      });
    return () => { activo = false; };
  }, []);

  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  }, []);

  const handleGuardar = useCallback(async () => {
    setGuardando(true);
    setMensaje(null);
    try {
      await dashboardEmpresarioService.actualizarPerfil({
        nombre_empresa: form.nombre_empresa,
        nombre: form.nombre,
        correo: form.correo,
        sector: form.sector,
        sitio_web: form.sitio_web,
        telefono_whatsapp: form.telefono_whatsapp,
        descripcion: form.descripcion,
      });
      setMensaje({ tipo: 'exito', texto: 'Cambios guardados correctamente.' });
    } catch (err) {
      setMensaje({ tipo: 'error', texto: err.response?.data?.message || 'Error al guardar cambios.' });
    } finally {
      setGuardando(false);
    }
  }, [form]);

  const handleGuardarPass = useCallback(async () => {
    if (!passActual || !passNueva) {
      setMensaje({ tipo: 'error', texto: 'Completa ambos campos de contraseña.' });
      return;
    }
    setGuardandoPass(true);
    setMensaje(null);
    try {
      const { authService } = await import('../../../../../services/authService');
      await authService.updatePassword({ currentPassword: passActual, newPassword: passNueva });
      setMensaje({ tipo: 'exito', texto: 'Contraseña actualizada correctamente.' });
      setPassActual('');
      setPassNueva('');
    } catch (err) {
      setMensaje({ tipo: 'error', texto: err.response?.data?.message || 'Error al actualizar contraseña.' });
    } finally {
      setGuardandoPass(false);
    }
  }, [passActual, passNueva]);

  if (loading) {
    return (
      <DashboardLayout activePage="configuracion">
        <EstadoDatos loading={true} />
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout activePage="configuracion">
        <EstadoDatos error={error} />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout activePage="configuracion">
      <div className="de-page-heading">
        <h1>Configuracion</h1>
      </div>

      {mensaje && (
        <div className={`de-mensaje ${mensaje.tipo === 'exito' ? 'de-mensaje-exito' : 'de-mensaje-error'}`}
          style={{
            padding: '12px 16px', borderRadius: '8px', marginBottom: '16px',
            backgroundColor: mensaje.tipo === 'exito' ? '#ecfdf5' : '#fef2f2',
            color: mensaje.tipo === 'exito' ? '#065f46' : '#991b1b',
            fontSize: '14px', fontWeight: 500,
          }}
        >
          {mensaje.texto}
        </div>
      )}

      <div className="de-grid-3">
        <section className="de-panel">
          <div className="de-panel-header">
            <h3 className="de-panel-title">Empresa</h3>
          </div>
          <div className="de-form-grid">
            <input className="de-form-control" name="nombre_empresa" value={form.nombre_empresa} onChange={handleChange} placeholder="Nombre de la empresa" aria-label="Nombre de la empresa" />
            <input className="de-form-control" name="nombre" value={form.nombre} onChange={handleChange} placeholder="Nombre del representante" aria-label="Nombre del representante" />
            <input className="de-form-control" name="correo" value={form.correo} onChange={handleChange} placeholder="Correo de empresa" aria-label="Correo de empresa" type="email" />
            <input className="de-form-control" name="sector" value={form.sector} onChange={handleChange} placeholder="Sector" aria-label="Sector" />
            <input className="de-form-control" name="sitio_web" value={form.sitio_web} onChange={handleChange} placeholder="Sitio web" aria-label="Sitio web" />
            <input className="de-form-control" name="telefono_whatsapp" value={form.telefono_whatsapp} onChange={handleChange} placeholder="WhatsApp (0000-0000)" aria-label="WhatsApp" />
            <textarea
              className="de-form-control de-form-textarea"
              name="descripcion"
              value={form.descripcion}
              onChange={handleChange}
              placeholder="Descripcion de empresa"
              aria-label="Descripcion de empresa"
            />
            <button className="de-btn-primary" type="button" onClick={handleGuardar} disabled={guardando}>
              {guardando ? 'Guardando...' : 'Guardar cambios'}
            </button>
          </div>
        </section>

        <section className="de-panel">
          <div className="de-panel-header">
            <h3 className="de-panel-title">Preferencias</h3>
          </div>
          <div className="de-form-grid">
            <label className="de-setting-row">
              <span>Recibir postulaciones por correo</span>
              <input type="checkbox" name="notif_correo" checked={form.notif_correo} onChange={handleChange} />
            </label>
            <label className="de-setting-row">
              <span>Mostrar talento recomendado</span>
              <input type="checkbox" name="notif_talento" checked={form.notif_talento} onChange={handleChange} />
            </label>
            <label className="de-setting-row">
              <span>Alertas de entregables pendientes</span>
              <input type="checkbox" name="notif_entregables" checked={form.notif_entregables} onChange={handleChange} />
            </label>
          </div>
        </section>

        <section className="de-panel">
          <div className="de-panel-header">
            <h3 className="de-panel-title">Seguridad</h3>
          </div>
          <div className="de-form-grid">
            <input className="de-form-control" type="password" placeholder="Contrasena actual" value={passActual} onChange={(e) => setPassActual(e.target.value)} />
            <input className="de-form-control" type="password" placeholder="Nueva contrasena" value={passNueva} onChange={(e) => setPassNueva(e.target.value)} />
            <button className="de-btn-primary" type="button" onClick={handleGuardarPass} disabled={guardandoPass}>
              {guardandoPass ? 'Actualizando...' : 'Cambiar contrasena'}
            </button>
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
}
