
/**
 * Componente de presentación puro (StatCard)
 * Sigue el principio de responsabilidad única al abstraer la visualización de métricas clave.
 * Utiliza composición mediante propiedades para la inyección dinámica de iconos de lucide-react.
 */
export default function TarjetaEstadistica({ title, value, icon: Icono, trend, isPositive, colorClass }) {
  return (
    <div className="admin-stat-card">
      <div className="admin-stat-top">
        <div className={`admin-stat-icon ${colorClass}`}>
          <Icono size={24} />
        </div>
        <span className={`admin-stat-trend ${isPositive ? 'positive' : 'warning'}`}>
          {trend}
        </span>
      </div>
      <div>
        <p className="admin-stat-title">{title}</p>
        <p className="admin-stat-value">{value}</p>
      </div>
    </div>
  );
}
