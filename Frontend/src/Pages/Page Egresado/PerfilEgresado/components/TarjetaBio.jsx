import { Pencil } from 'lucide-react';

const TarjetaBio = () => {
  return (
    <div className="tarjetaBio">
      <div className="encabezadoBio">
        <h3 className="tituloBio">Bio</h3>
        <button className="botonEditarTexto">
          <Pencil size={14} />
          Editar
        </button>
      </div>
      <p className="textoBio">
        Soy un estudiante apasionado por la tecnología y la creación de productos digitales, actualmente cursando mis estudios en Desarrollo de Software. Disfruto aprendiendo nuevas tecnologías como React y Node.js en mi tiempo libre. Estoy buscando mi primera oportunidad como practicante o desarrollador Junior para aportar mi energía y seguir creciendo profesionalmente en un entorno colaborativo.
      </p>
    </div>
  );
};

export default TarjetaBio;
