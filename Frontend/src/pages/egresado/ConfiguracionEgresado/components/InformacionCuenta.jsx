import { useState } from 'react';

const ESTADO_INICIAL = {
  nombre: 'Alex Rivera',
  email: 'alex.rivera@fwd.dev',
  bio: 'Desarrollador Junior apasionado por React y el diseño UX. Buscando mi primera oportunidad para impactar el ecosistema tech.',
};

const CLAVE_ALMACENAMIENTO = 'informacionCuenta';

function InformacionCuenta() {
  const [datosFormulario, setDatosFormulario] = useState(() => {
    const datosGuardados = localStorage.getItem(CLAVE_ALMACENAMIENTO);
    return datosGuardados ? JSON.parse(datosGuardados) : ESTADO_INICIAL;
  });
  const [mensajeExito, setMensajeExito] = useState(false);

  const manejarCambio = (e) => {
    const { name, value } = e.target;
    setDatosFormulario((prev) => ({ ...prev, [name]: value }));
  };

  const manejarGuardar = () => {
    localStorage.setItem(CLAVE_ALMACENAMIENTO, JSON.stringify(datosFormulario));
    setMensajeExito(true);
    setTimeout(() => setMensajeExito(false), 3000);
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
