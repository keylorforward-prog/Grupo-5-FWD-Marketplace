import { useState, useRef } from 'react';
import { useAuth } from '../../../../context/AuthContext';

const ESTADO_INICIAL = {
  nombre: 'Alex Rivera',
  email: 'alex.rivera@fwd.dev',
  bio: 'Desarrollador Junior apasionado por React y el diseño UX. Buscando mi primera oportunidad para impactar el ecosistema tech.',
};

const CLAVE_ALMACENAMIENTO = 'informacionCuenta';

function InformacionCuenta() {
  const { user, actualizarUsuario } = useAuth();
  const [datosFormulario, setDatosFormulario] = useState(() => {
    const datosGuardados = localStorage.getItem(CLAVE_ALMACENAMIENTO);
    return datosGuardados ? JSON.parse(datosGuardados) : ESTADO_INICIAL;
  });
  const [mensajeExito, setMensajeExito] = useState(false);
  const [subiendo, setSubiendo] = useState(false);
  const refArchivo = useRef(null);

  const fotoPerfil = user?.foto_perfil || user?.avatar_url || '/Imgs/Logotipo/Digital/Sintesis/FWD - Sintesis-01.png';

  const manejarCambio = (e) => {
    const { name, value } = e.target;
    setDatosFormulario((prev) => ({ ...prev, [name]: value }));
  };

  const manejarGuardar = () => {
    localStorage.setItem(CLAVE_ALMACENAMIENTO, JSON.stringify(datosFormulario));
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
        <h2 className="tituloFormulario">Información de Cuenta</h2>
        <div className="accionesFormulario">
          {mensajeExito && (
            <span className="mensajeExito animate-in">¡Cambios guardados!</span>
          )}
          <button className="botonPrimario" onClick={manejarGuardar}>
            Guardar Cambios
          </button>
        </div>
      </div>

      <div className="filaFormulario filaAvatarFormulario">
        <div className="grupoFormulario grupoAvatar">
          <label>Foto de Perfil</label>
          <div className="contenedorAvatarFormulario">
            <img src={fotoPerfil} alt="Foto de perfil" className="avatarFormulario" />
            <button
              type="button"
              className="botonCambiarAvatar"
              onClick={() => refArchivo.current?.click()}
              disabled={subiendo}
            >
              {subiendo ? 'Subiendo...' : 'Cambiar foto'}
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
          <label>Nombre Completo</label>
          <input
            type="text"
            name="nombre"
            className="entradaFormulario"
            value={datosFormulario.nombre}
            onChange={manejarCambio}
          />
        </div>
        <div className="grupoFormulario">
          <label>Correo Electrónico</label>
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
        <label>Biografía Corta</label>
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
