import { useRef, useState } from 'react';
import { Pencil, Globe, ExternalLink, Check, X, Camera } from 'lucide-react';

function TarjetaUsuario({ perfilApi }) {
  const { perfil, actualizar } = perfilApi;
  const [editando, setEditando] = useState(false);
  const [borrador, setBorrador] = useState({
    nombre: perfil.nombre,
    rol: perfil.rol,
    portfolio: perfil.portfolio,
    linkedin: perfil.linkedin,
  });
  const refArchivo = useRef(null);

  const iniciarEdicion = () => {
    setBorrador({
      nombre: perfil.nombre,
      rol: perfil.rol,
      portfolio: perfil.portfolio,
      linkedin: perfil.linkedin,
    });
    setEditando(true);
  };

  const guardar = () => {
    actualizar(borrador);
    setEditando(false);
  };

  const cancelar = () => setEditando(false);

  const abrirSelectorArchivo = () => refArchivo.current?.click();

  const manejarArchivo = (e) => {
    const archivo = e.target.files?.[0];
    if (!archivo) return;
    const lector = new FileReader();
    lector.onload = (ev) => actualizar({ avatar: ev.target?.result });
    lector.readAsDataURL(archivo);
  };

  return (
    <div className="tarjetaUsuario">
      <div className="contenedorAvatar">
        <img src={perfil.avatar} alt="Foto de perfil" className="imagenPerfil" />
        <button
          type="button"
          className="botonEditarAvatar"
          onClick={abrirSelectorArchivo}
          aria-label="Cambiar foto"
        >
          <Camera size={14} />
        </button>
        <input
          ref={refArchivo}
          type="file"
          accept="image/*"
          hidden
          onChange={manejarArchivo}
        />
      </div>

      {editando ? (
        <div className="formularioPerfilUsuario">
          <input
            className="entradaPerfil"
            value={borrador.nombre}
            onChange={(e) => setBorrador((b) => ({ ...b, nombre: e.target.value }))}
            placeholder="Nombre completo"
          />
          <input
            className="entradaPerfil"
            value={borrador.rol}
            onChange={(e) => setBorrador((b) => ({ ...b, rol: e.target.value }))}
            placeholder="Tu rol o título"
          />
          <input
            className="entradaPerfil"
            value={borrador.portfolio}
            onChange={(e) => setBorrador((b) => ({ ...b, portfolio: e.target.value }))}
            placeholder="URL portfolio"
          />
          <input
            className="entradaPerfil"
            value={borrador.linkedin}
            onChange={(e) => setBorrador((b) => ({ ...b, linkedin: e.target.value }))}
            placeholder="URL LinkedIn"
          />

          <div className="accionesEdicionPerfil">
            <button type="button" className="botonGuardarPerfil" onClick={guardar}>
              <Check size={14} /> Guardar
            </button>
            <button type="button" className="botonCancelarPerfil" onClick={cancelar}>
              <X size={14} /> Cancelar
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="cabeceraPerfilUsuario">
            <div>
              <h2 className="nombrePerfil">{perfil.nombre}</h2>
              <p className="rolPerfil">{perfil.rol}</p>
            </div>
            <button
              type="button"
              className="botonEditarPerfil"
              onClick={iniciarEdicion}
              aria-label="Editar perfil"
            >
              <Pencil size={14} />
            </button>
          </div>

          <div className="enlacesPerfil">
            <a
              href={perfil.portfolio}
              target="_blank"
              rel="noreferrer noopener"
              className="botonEnlacePerfil"
            >
              <Globe size={16} />
              Portfolio
            </a>
            <a
              href={perfil.linkedin}
              target="_blank"
              rel="noreferrer noopener"
              className="botonEnlacePerfil"
            >
              <ExternalLink size={16} />
              LinkedIn
            </a>
          </div>
        </>
      )}
    </div>
  );
}

export default TarjetaUsuario;
