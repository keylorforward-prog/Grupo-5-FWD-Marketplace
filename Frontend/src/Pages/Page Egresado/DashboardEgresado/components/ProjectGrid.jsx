import ProjectCard from './ProjectCard';
import Pagination from './Pagination';

function ProjectGrid({ proyectos }) {
  return (
    <div className="contenedorResultados">
      <div className="encabezadoResultados">
        <span className="conteoProyectos">{proyectos.length} proyectos encontrados</span>
        <div className="ordenarResultados">
          <span className="etiquetaOrdenar">Ordenar por:</span>
          <select className="seleccionadorOrdenar">
            <option>Más recientes</option>
          </select>
        </div>
      </div>

      <div className="cuadriculaProyectos">
        {proyectos.map((proyecto) => (
          <ProjectCard key={proyecto.id} proyecto={proyecto} />
        ))}
      </div>

      <Pagination />
    </div>
  );
}

export default ProjectGrid;
