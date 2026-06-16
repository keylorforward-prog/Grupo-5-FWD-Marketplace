import React from 'react';
import { Search, Filter } from 'lucide-react';

function SearchBar() {
  return (
    <div className="contenedorBusqueda">
      <div className="barraBusqueda">
        <Search size={20} color="#6b7280" />
        <input type="text" placeholder="Buscar por título, tecnología o habilidad..." className="entradaBusqueda" />
      </div>
      <button className="botonFiltros">
        <Filter size={18} />
        Filtros
      </button>
    </div>
  );
}

export default SearchBar;
