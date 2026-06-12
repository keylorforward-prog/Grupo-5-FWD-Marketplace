import { ArrowLeft, Construction } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import './Proximamente.css';

function Proximamente({ titulo = 'Próximamente', descripcion = 'Esta sección estará disponible muy pronto.' }) {
  const navegar = useNavigate();

  return (
    <div className="proximamenteContenedor">
      <div className="proximamenteTarjeta">
        <div className="proximamenteIcono">
          <Construction size={36} />
        </div>
        <h1 className="proximamenteTitulo">{titulo}</h1>
        <p className="proximamenteDescripcion">{descripcion}</p>
        <div className="proximamenteAcciones">
          <button type="button" className="proximamenteBotonVolver" onClick={() => navegar(-1)}>
            <ArrowLeft size={16} /> Volver atrás
          </button>
          <Link to="/" className="proximamenteBotonInicio">Ir al inicio</Link>
        </div>
      </div>
    </div>
  );
}

export default Proximamente;
