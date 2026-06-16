
function Pagination() {
  return (
    <div className="paginacionResultados">
      <button className="botonPagina flecha">&lt;</button>
      <button className="botonPagina activa">1</button>
      <button className="botonPagina">2</button>
      <button className="botonPagina">3</button>
      <button className="botonPagina">4</button>
      <span className="puntosPaginacion">...</span>
      <button className="botonPagina">9</button>
      <button className="botonPagina flecha">&gt;</button>
    </div>
  );
}

export default Pagination;
