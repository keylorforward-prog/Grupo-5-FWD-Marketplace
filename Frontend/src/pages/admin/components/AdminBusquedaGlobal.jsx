import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Search } from 'lucide-react';
import { adminService } from '../../../services/adminService';
import { useDebounce } from '../../../hooks/useDebounce';

export default function AdminBusquedaGlobal({ onNavigate }) {
  const [query, setQuery] = useState('');
  const [resultados, setResultados] = useState(null);
  const debounced = useDebounce(query, 300);
  const ref = useRef(null);
  const cacheRef = useRef(new Map());
  const requestIdRef = useRef(0);

  useEffect(() => {
    const termino = debounced.trim();
    if (termino.length < 2) {
      return;
    }

    const cacheKey = termino.toLocaleLowerCase('es-CR');
    const cached = cacheRef.current.get(cacheKey);
    if (cached) {
      setResultados(cached);
      return;
    }

    const requestId = requestIdRef.current + 1;
    requestIdRef.current = requestId;
    adminService.buscarGlobal(termino).then((res) => {
      if (requestIdRef.current !== requestId || !res.success) return;
      cacheRef.current.set(cacheKey, res.data);
      if (cacheRef.current.size > 20) {
        cacheRef.current.delete(cacheRef.current.keys().next().value);
      }
      setResultados(res.data);
    });
  }, [debounced]);

  useEffect(() => {
    const cerrar = (event) => {
      if (ref.current && !ref.current.contains(event.target)) setResultados(null);
    };
    document.addEventListener('mousedown', cerrar);
    return () => document.removeEventListener('mousedown', cerrar);
  }, []);

  const abrir = useCallback((menu) => {
    setResultados(null);
    setQuery('');
    onNavigate(menu);
  }, [onNavigate]);

  const manejarBusqueda = (event) => {
    const value = event.target.value;
    setQuery(value);
    if (value.trim().length < 2) setResultados(null);
  };

  const grupos = useMemo(() => [
    ['usuarios', 'Usuarios', 'usuarios'],
    ['empresas', 'Empresas', 'empresas'],
    ['egresados', 'Egresados', 'egresados'],
    ['reportes', 'Reportes', 'reportes'],
    ['auditoria', 'Auditoría', 'auditoria'],
  ], []);

  return (
    <div className="admin-global-search" ref={ref}>
      <Search size={16} />
      <input value={query} onChange={manejarBusqueda} placeholder="Buscar en admin..." />
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
