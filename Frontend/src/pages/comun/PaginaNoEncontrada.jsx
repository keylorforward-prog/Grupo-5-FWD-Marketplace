import { ArrowLeft, Compass } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import './Proximamente.css';

function PaginaNoEncontrada() {
  const navegar = useNavigate();

  return (
    <div className="proximamenteContenedor">
      <div className="proximamenteTarjeta">
        <div className="proximamenteIcono variante404">
          <Compass size={36} />
        </div>
        <h1 className="proximamenteTitulo">404</h1>
        <p className="proximamenteDescripcion">
          La página que buscas no existe o fue movida.
        </p>
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

export default PaginaNoEncontrada;
