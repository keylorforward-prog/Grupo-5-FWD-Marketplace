
function ProjectCard({ proyecto }) {
  return (
    <div className="tarjetaProyecto">
      <div className="encabezadoTarjeta">
        <div className="iconoProyectoContenedor">
          <img src={proyecto.iconoUrl} alt="Icono" className="iconoProyecto" />
        </div>
        <div className="tituloTarjetaContenedor">
          <h3 className="tituloProyecto">{proyecto.titulo}</h3>
          <span className={`etiquetaEstado ${proyecto.tipoEstado}`}>
            {proyecto.estado}
          </span>
        </div>
      </div>
      
      <p className="descripcionProyecto">{proyecto.descripcion}</p>
      
      <div className="etiquetasTecnologias">
        {proyecto.tecnologias.map((tech, index) => (
          <span key={index} className="etiquetaTecnologia">{tech}</span>
        ))}
      </div>

      <div className="pieTarjeta">
        <div className="infoPie">
          <div className="datoPie">
            <span className="etiquetaDato">Presupuesto</span>
            <span className="valorDato">{proyecto.presupuesto}</span>
          </div>
          <div className="datoPie">
            <span className="etiquetaDato">Entrega</span>
            <span className="valorDato">{proyecto.entrega}</span>
          </div>
        </div>
        <button className="botonDetalle">Ver detalle</button>
      </div>
    </div>
  );
}

export default ProjectCard;
