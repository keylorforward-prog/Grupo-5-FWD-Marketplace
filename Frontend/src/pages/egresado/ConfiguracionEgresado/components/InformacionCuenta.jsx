import { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../../../context/AuthContext';

function InformacionCuenta() {
  const { t } = useTranslation();
  const { user, actualizarUsuario } = useAuth();
  const [datosFormulario, setDatosFormulario] = useState(() => ({
    nombre: user?.nombre || '',
    email: user?.correo || user?.email || '',
    bio: '',
  }));
  const [mensajeExito, setMensajeExito] = useState(false);
  const [subiendo, setSubiendo] = useState(false);
  const refArchivo = useRef(null);

  const fotoPerfil = user?.foto_perfil || user?.avatar_url || '/Imgs/Logotipo/Digital/Sintesis/FWD - Sintesis-01.png';

  const manejarCambio = (e) => {
    const { name, value } = e.target;
    setDatosFormulario((prev) => ({ ...prev, [name]: value }));
  };

  const manejarGuardar = () => {
    if (datosFormulario.nombre && user) {
      actualizarUsuario({ nombre: datosFormulario.nombre });
    }
    setMensajeExito(true);
    setTimeout(() => setMensajeExito(false), 3000);
  };

  const manejarFoto = async (e) => {
    const archivo = e.target.files?.[0];
    if (!archivo) return;
    const userId = user?.id || user?.id_usuario;
    if (!userId) return;
    setSubiendo(true);
    try {
      const formData = new FormData();
      formData.append('foto', archivo);
      const res = await fetch(`/api/usuarios/${userId}/foto-perfil`, {
        method: 'PUT',
        body: formData,
      });
      const data = await res.json();
      if (data.success && data.url) {
        actualizarUsuario({ foto_perfil: data.url });
      }
    } catch (error) {
      console.error('Error al subir foto', error);
    } finally {
      setSubiendo(false);
    }
  };

  return (
    <div id="cuenta" className="tarjetaFormulario">
      <div className="cabeceraFormulario">
        <h2 className="tituloFormulario">{t('egresadoConfiguracion.accountInfo.titulo')}</h2>
        <div className="accionesFormulario">
          {mensajeExito && (
            <span className="mensajeExito animate-in">{t('egresadoConfiguracion.accountInfo.guardado')}</span>
          )}
          <button className="botonPrimario" onClick={manejarGuardar}>
            {t('egresadoConfiguracion.accountInfo.guardarCambios')}
          </button>
        </div>
      </div>

      <div className="filaFormulario filaAvatarFormulario">
        <div className="grupoFormulario grupoAvatar">
          <label>{t('egresadoConfiguracion.accountInfo.fotoPerfil')}</label>
          <div className="contenedorAvatarFormulario">
            <img src={fotoPerfil} alt="Foto de perfil" className="avatarFormulario" />
            <button
              type="button"
              className="botonCambiarAvatar"
              onClick={() => refArchivo.current?.click()}
              disabled={subiendo}
            >
              {subiendo ? t('egresadoConfiguracion.accountInfo.subiendo') : t('egresadoConfiguracion.accountInfo.cambiarFoto')}
            </button>
            <input
              ref={refArchivo}
              type="file"
              accept="image/*"
              hidden
              onChange={manejarFoto}
            />
          </div>
        </div>
      </div>

      <div className="filaFormulario">
        <div className="grupoFormulario">
          <label>{t('egresadoConfiguracion.accountInfo.nombreCompleto')}</label>
          <input
            type="text"
            name="nombre"
            className="entradaFormulario"
            value={datosFormulario.nombre}
            onChange={manejarCambio}
          />
        </div>
        <div className="grupoFormulario">
          <label>{t('egresadoConfiguracion.accountInfo.correo')}</label>
          <input
            type="email"
            name="email"
            className="entradaFormulario"
            value={datosFormulario.email}
            onChange={manejarCambio}
          />
        </div>
      </div>

      <div className="grupoFormulario">
        <label>{t('egresadoConfiguracion.accountInfo.biografia')}</label>
        <textarea
          className="areaTextoFormulario"
          name="bio"
          value={datosFormulario.bio}
          onChange={manejarCambio}
        />
      </div>
    </div>
  );
}

export default InformacionCuenta;
