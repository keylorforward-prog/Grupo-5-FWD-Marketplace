import { useEffect, useState } from 'react';

export function useDashboardEgresadoRequest(request, initialData, deps = []) {
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let activo = true;

    const cargar = async () => {
      setLoading(true);
      setError('');
      try {
        const resultado = await request();
        if (activo) setData(resultado);
      } catch (err) {
        if (activo) {
          setError(err.response?.data?.message || 'No se pudieron cargar los datos.');
        }
      } finally {
        if (activo) setLoading(false);
      }
    };

    cargar();

    return () => {
      activo = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return { data, loading, error };
}
