import { useState, useEffect, useRef } from 'react';
import { Star, X, Plus } from 'lucide-react';

const ESTADO_INICIAL = {
  rol: 'frontend',
  salario: '$ 35000',
  tecnologias: ['React.js', 'Tailwind CSS', 'Node.js'],
};

const CLAVE_ALMACENAMIENTO = 'preferenciasProfesionales';

function PreferenciasProfesionales() {
  const [datosFormulario, setDatosFormulario] = useState(ESTADO_INICIAL);
  const [mensajeExito, setMensajeExito] = useState(false);
  const [estaAgregandoTecnologia, setEstaAgregandoTecnologia] = useState(false);
  const [nuevaTecnologia, setNuevaTecnologia] = useState('');
  const refEntrada = useRef(null);

  useEffect(() => {
    const datosGuardados = localStorage.getItem(CLAVE_ALMACENAMIENTO);
    if (datosGuardados) setDatosFormulario(JSON.parse(datosGuardados));
  }, []);

  const manejarCambio = (e) => {
    const { name, value } = e.target;
    setDatosFormulario((prev) => ({ ...prev, [name]: value }));
  };

  const eliminarTecnologia = (tecnologiaAEliminar) => {
    setDatosFormulario((prev) => ({
      ...prev,
      tecnologias: prev.tecnologias.filter((tech) => tech !== tecnologiaAEliminar),
    }));
  };

  const iniciarAgregarTecnologia = () => {
    setEstaAgregandoTecnologia(true);
    setTimeout(() => refEntrada.current?.focus(), 0);
  };

  const confirmarNuevaTecnologia = () => {
    const valor = nuevaTecnologia.trim();
    if (valor && !datosFormulario.tecnologias.includes(valor)) {
      setDatosFormulario((prev) => ({
        ...prev,
        tecnologias: [...prev.tecnologias, valor],
      }));
    }
    setNuevaTecnologia('');
    setEstaAgregandoTecnologia(false);
  };

  const manejarTeclaPresionada = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      confirmarNuevaTecnologia();
    } else if (e.key === 'Escape') {
      setNuevaTecnologia('');
      setEstaAgregandoTecnologia(false);
    }
  };

  const manejarGuardar = () => {
    localStorage.setItem(CLAVE_ALMACENAMIENTO, JSON.stringify(datosFormulario));
    setMensajeExito(true);
    setTimeout(() => setMensajeExito(false), 3000);
  };

  return (
    <div id="preferencias" className="tarjetaFormulario">
      <div className="cabeceraFormulario">
        <h2 className="tituloFormulario">
          <Star size={18} className="iconoTituloFormulario" />
          Preferencias Profesionales
        </h2>
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
          <label>Interés de Rol</label>
          <select
            name="rol"
            className="seleccionFormulario"
            value={datosFormulario.rol}
            onChange={manejarCambio}
          >
            <option value="frontend">Frontend Developer</option>
            <option value="backend">Backend Developer</option>
            <option value="fullstack">Fullstack Developer</option>
          </select>
        </div>
        <div className="grupoFormulario">
          <label>Expectativa Salarial (Anual)</label>
          <input
            type="text"
            name="salario"
            className="entradaFormulario"
            value={datosFormulario.salario}
            onChange={manejarCambio}
          />
        </div>
      </div>

      <div className="grupoFormulario">
        <label>Tecnologías Principales</label>
        <div className="contenedorEtiquetasConfiguracion">
          {datosFormulario.tecnologias.map((tech) => (
            <div className="etiquetaConfiguracion" key={tech}>
              {tech}
              <button type="button" onClick={() => eliminarTecnologia(tech)}>
                <X size={14} />
              </button>
            </div>
          ))}

          {estaAgregandoTecnologia ? (
            <input
              ref={refEntrada}
              type="text"
              value={nuevaTecnologia}
              onChange={(e) => setNuevaTecnologia(e.target.value)}
              onBlur={confirmarNuevaTecnologia}
              onKeyDown={manejarTeclaPresionada}
              className="entradaNuevaTecnologia"
              placeholder="Nueva tech..."
            />
          ) : (
            <button
              type="button"
              className="etiquetaAgregar"
              onClick={iniciarAgregarTecnologia}
            >
              <Plus size={14} /> Añadir
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default PreferenciasProfesionales;
