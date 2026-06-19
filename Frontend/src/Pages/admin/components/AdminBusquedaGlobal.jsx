import { useEffect, useRef, useState } from 'react';
import { Search } from 'lucide-react';
import { adminService } from '../../../services/adminService';
import { useDebounce } from '../../../hooks/useDebounce';

export default function AdminBusquedaGlobal({ onNavigate }) {
  const [query, setQuery] = useState('');
  const [resultados, setResultados] = useState(null);
  const debounced = useDebounce(query, 300);
  const ref = useRef(null);

  useEffect(() => {
    if (debounced.trim().length < 2) {
      setResultados(null);
      return;
    }

    let activo = true;
    adminService.buscarGlobal(debounced).then((res) => {
      if (activo && res.success) setResultados(res.data);
    });

    return () => {
      activo = false;
    };
  }, [debounced]);

  useEffect(() => {
    const cerrar = (event) => {
      if (ref.current && !ref.current.contains(event.target)) setResultados(null);
    };
    document.addEventListener('mousedown', cerrar);
    return () => document.removeEventListener('mousedown', cerrar);
  }, []);

  const abrir = (menu) => {
    setResultados(null);
    setQuery('');
    onNavigate(menu);
  };

  const grupos = [
    ['usuarios', 'Usuarios', 'usuarios'],
    ['empresas', 'Empresas', 'empresas'],
    ['egresados', 'Egresados', 'egresados'],
    ['reportes', 'Reportes', 'reportes'],
    ['auditoria', 'Auditoría', 'auditoria'],
  ];

  return (
    <div className="admin-global-search" ref={ref}>
      <Search size={16} />
      <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar en admin..." />
      {resultados && (
        <div className="admin-global-results">
          {grupos.map(([key, label, menu]) => (
            <div key={key}>
              <strong>{label}</strong>
              {(resultados[key] || []).length === 0 ? (
                <p>Sin resultados</p>
              ) : resultados[key].map((item) => (
                <button key={`${key}-${item.id_usuario || item.id_reporte || item.id_auditoria}`} type="button" onClick={() => abrir(menu)}>
                  {item.nombre || item.motivo || item.accion || item.correo}
                  <span>{item.correo || item.estado || item.entidad}</span>
                </button>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
