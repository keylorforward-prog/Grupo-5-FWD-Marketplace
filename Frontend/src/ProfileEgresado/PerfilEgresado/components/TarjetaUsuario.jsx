import React from 'react';
import { Pencil, Globe, Link as LinkIcon } from 'lucide-react';
import ProfileDefaultImage from '../../../../../public/Imgs/ProfileDefaultImage.png';

const TarjetaUsuario = () => {
  return (
    <div className="tarjetaUsuario">
      <div className="contenedorAvatar">
        <img src={ProfileDefaultImage} alt="Foto de perfil" className="imagenPerfil" />
        <button className="botonEditarAvatar">
          <Pencil size={14} />
        </button>
      </div>
      <h2 className="nombreUsuario">Alex Rivera</h2>
      <p className="rolUsuario">Estudiante de Desarrollo de Software</p>
      <div className="enlacesUsuario">
        <button className="botonEnlace">
          <Globe size={16} />
          Portfolio
        </button>
        <button className="botonEnlace">
          <LinkIcon size={16} />
          LinkedIn
        </button>
      </div>
    </div>
  );
};

export default TarjetaUsuario;
