export default function EstadoDatos({ loading, error, empty, emptyText = 'No hay datos para mostrar.' }) {
  if (loading) return <p className="de-data-state">Cargando datos...</p>;
  if (error) return <p className="de-data-state error">{error}</p>;
  if (empty) return <p className="de-data-state">{emptyText}</p>;
  return null;
}
