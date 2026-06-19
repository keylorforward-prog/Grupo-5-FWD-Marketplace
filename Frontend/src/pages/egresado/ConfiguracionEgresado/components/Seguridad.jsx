import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Trash2, AlertTriangle, Check, X, Eye, EyeOff } from 'lucide-react';

function Seguridad() {
  const { t } = useTranslation();
  const [modoCambioPassword, setModoCambioPassword] = useState(false);
  const [passwords, setPasswords] = useState({ actual: '', nueva: '', confirmar: '' });
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [errorPassword, setErrorPassword] = useState('');
  const [mensajePassword, setMensajePassword] = useState('');

  const [doble2FAActivo, setDoble2FAActivo] = useState(false);

  const [confirmandoEliminacion, setConfirmandoEliminacion] = useState(false);
  const [textoConfirmacion, setTextoConfirmacion] = useState('');

  const manejarPassword = (e) => {
    const { name, value } = e.target;
    setPasswords((p) => ({ ...p, [name]: value }));
    setErrorPassword('');
  };

  const guardarPassword = () => {
    if (passwords.nueva.length < 8) {
      setErrorPassword('La contraseña debe tener al menos 8 caracteres.');
      return;
    }
    if (passwords.nueva !== passwords.confirmar) {
      setErrorPassword('Las contraseñas no coinciden.');
      return;
    }
    setMensajePassword('Contraseña actualizada correctamente.');
    setPasswords({ actual: '', nueva: '', confirmar: '' });
    setModoCambioPassword(false);
    setTimeout(() => setMensajePassword(''), 3000);
  };

  const confirmarEliminacion = () => {
    if (textoConfirmacion !== 'ELIMINAR') return;
    window.alert('Cuenta marcada para eliminación. Te enviaremos un correo de confirmación.');
    setConfirmandoEliminacion(false);
    setTextoConfirmacion('');
  };

  return (
    <div id="seguridad" className="tarjetaFormulario">
      <div className="cabeceraFormulario">
        <h2 className="tituloFormulario">{t('egresadoConfiguracion.sections.seguridad')}</h2>
        {mensajePassword && (
          <span className="mensajeExito animate-in">{mensajePassword}</span>
        )}
      </div>

      <div className="itemSeguridad">
        <div className="textoSeguridad">
          <h4>{t('egresadoConfiguracion.security.cambiarPassword')}</h4>
          <p>{t('egresadoConfiguracion.security.cambiarPasswordDesc')}</p>
        </div>
        {!modoCambioPassword && (
          <button
            type="button"
            className="botonContorno variantePrimaria"
            onClick={() => setModoCambioPassword(true)}
          >
            {t('egresadoConfiguracion.security.actualizar')}
          </button>
        )}
      </div>

      {modoCambioPassword && (
        <div className="formularioPassword">
          <div className="grupoFormulario">
            <label>{t('egresadoConfiguracion.security.passwordActual')}</label>
            <div className="campoPassword">
              <input
                type={mostrarPassword ? 'text' : 'password'}
                name="actual"
                className="entradaFormulario"
                value={passwords.actual}
                onChange={manejarPassword}
              />
              <button
                type="button"
                className="botonOjoPassword"
                onClick={() => setMostrarPassword((m) => !m)}
                aria-label={mostrarPassword ? t('egresadoConfiguracion.security.ocultar') : t('egresadoConfiguracion.security.mostrar')}
              >
                {mostrarPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div className="filaFormulario">
            <div className="grupoFormulario">
              <label>{t('egresadoConfiguracion.security.nuevaPassword')}</label>
              <input
                type={mostrarPassword ? 'text' : 'password'}
                name="nueva"
                className="entradaFormulario"
                value={passwords.nueva}
                onChange={manejarPassword}
              />
            </div>
            <div className="grupoFormulario">
              <label>{t('egresadoConfiguracion.security.confirmarPassword')}</label>
              <input
                type={mostrarPassword ? 'text' : 'password'}
                name="confirmar"
                className="entradaFormulario"
                value={passwords.confirmar}
                onChange={manejarPassword}
              />
            </div>
          </div>

          {errorPassword && <div className="mensajeError">{errorPassword}</div>}

          <div className="accionesPassword">
            <button
              type="button"
              className="botonContorno"
              onClick={() => {
                setModoCambioPassword(false);
                setPasswords({ actual: '', nueva: '', confirmar: '' });
                setErrorPassword('');
              }}
            >
              {t('egresadoConfiguracion.security.cancelar')}
            </button>
            <button type="button" className="botonPrimario" onClick={guardarPassword}>
              {t('egresadoConfiguracion.security.guardarPassword')}
            </button>
          </div>
        </div>
      )}

      <div className="itemSeguridad">
        <div className="textoSeguridad">
          <h4>
            {t('egresadoConfiguracion.security.dosFA')}
            {doble2FAActivo && <span className="badgeActivo">{t('egresadoConfiguracion.security.activo')}</span>}
          </h4>
          <p>{t('egresadoConfiguracion.security.dosFADesc')}</p>
        </div>
        <button
          type="button"
          className={`botonContorno ${doble2FAActivo ? 'varianteExito' : 'varianteAdvertencia'}`}
          onClick={() => setDoble2FAActivo((d) => !d)}
        >
          {doble2FAActivo ? t('egresadoConfiguracion.security.desactivar') : t('egresadoConfiguracion.security.configurar')}
        </button>
      </div>

      <div className="pieSeguridad">
        <button
          type="button"
          className="botonPeligro"
          onClick={() => setConfirmandoEliminacion(true)}
        >
          <Trash2 size={16} />
          {t('egresadoConfiguracion.security.eliminarCuenta')}
        </button>
      </div>

      {confirmandoEliminacion && (
        <div className="overlayModal" onClick={() => setConfirmandoEliminacion(false)}>
          <div className="modalConfirmacion" onClick={(e) => e.stopPropagation()}>
            <div className="encabezadoModal">
              <div className="iconoModalPeligro">
                <AlertTriangle size={24} />
              </div>
              <h3>{t('egresadoConfiguracion.security.eliminarConfirm')}</h3>
              <p>
                {t('egresadoConfiguracion.security.eliminarDesc')} <code>ELIMINAR</code>
              </p>
            </div>
            <input
              type="text"
              className="entradaFormulario"
              placeholder={t('egresadoConfiguracion.security.escribeEliminar')}
              value={textoConfirmacion}
              onChange={(e) => setTextoConfirmacion(e.target.value)}
              autoFocus
            />
            <div className="accionesModal">
              <button
                type="button"
                className="botonContorno"
                onClick={() => {
                  setConfirmandoEliminacion(false);
                  setTextoConfirmacion('');
                }}
              >
                <X size={14} /> {t('egresadoConfiguracion.security.cancelar')}
              </button>
              <button
                type="button"
                className="botonEliminarConfirmacion"
                disabled={textoConfirmacion !== 'ELIMINAR'}
                onClick={confirmarEliminacion}
              >
                <Check size={14} /> {t('egresadoConfiguracion.security.eliminarBtn')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Seguridad;
