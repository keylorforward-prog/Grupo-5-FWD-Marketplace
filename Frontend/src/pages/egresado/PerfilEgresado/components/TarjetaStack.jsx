import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Book, Plus, X } from 'lucide-react';

function TarjetaStack({ perfilApi }) {
  const { t } = useTranslation();
  const { perfil, agregarTecnologia, quitarTecnologia, catalogoTecnologias } = perfilApi;
  const [agregando, setAgregando] = useState(false);
  const [valor, setValor] = useState('');
  const refInput = useRef(null);

  const iniciarAgregar = () => {
    setAgregando(true);
    setTimeout(() => refInput.current?.focus(), 0);
  };

  const confirmar = () => {
    agregarTecnologia(valor);
    setValor('');
    setAgregando(false);
  };

  const manejarTecla = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      confirmar();
    } else if (e.key === 'Escape') {
      setValor('');
      setAgregando(false);
    }
  };

  return (
    <div className="tarjetaStack">
      <h3 className="tituloTarjetaStack">
        <Book size={20} className="iconoTituloStack" />
        {t('egresadoPerfil.stack.titulo')}
      </h3>

      <div className="contenedorStack">
        {perfil.tecnologias.map((tech) => (
          <span key={tech.nombre} className={`etiquetaStack ${tech.fondo}`}>
            {tech.nombre}
            <button
              type="button"
              className="botonQuitarStack"
              onClick={() => quitarTecnologia(tech.nombre)}
              aria-label={`Quitar ${tech.nombre}`}
            >
              <X size={12} />
            </button>
          </span>
        ))}

        {agregando ? (
          <>
            <input
              ref={refInput}
              type="text"
              value={valor}
              onChange={(e) => setValor(e.target.value)}
              onBlur={confirmar}
              onKeyDown={manejarTecla}
              className="entradaNuevaStack"
              placeholder={t('egresadoPerfil.stack.placeholder')}
              list="sugerenciasStack"
            />
            <datalist id="sugerenciasStack">
              {catalogoTecnologias
                .filter((t) => !perfil.tecnologias.some((p) => p.nombre.toLowerCase() === t.toLowerCase()))
                .map((t) => (
                  <option key={t} value={t} />
                ))}
            </datalist>
          </>
        ) : (
          <button type="button" className="botonAgregarStack" onClick={iniciarAgregar}>
            <Plus size={14} /> {t('egresadoPerfil.stack.agregar')}
          </button>
        )}
      </div>
    </div>
  );
}

export default TarjetaStack;
