import React from 'react';
import { Book } from 'lucide-react';

const TarjetaStack = () => {
  return (
    <div className="tarjetaStack">
      <h3 className="tituloTarjeta">
        <Book size={20} className="iconoTitulo" />
        Aprendiendo
      </h3>
      <div className="contenedorEtiquetas">
        <span className="etiquetaTecnologia fondoAzulClaro">React.js</span>
        <span className="etiquetaTecnologia fondoAzulMedio">Node.js</span>
        <span className="etiquetaTecnologia fondoAzulOscuro">HTML & CSS</span>
        <span className="etiquetaTecnologia fondoMorado">JavaScript</span>
        <span className="etiquetaTecnologia fondoNaranja">PostgreSQL</span>
        <span className="etiquetaTecnologia fondoMoradoClaro">Git</span>
      </div>
    </div>
  );
};

export default TarjetaStack;
