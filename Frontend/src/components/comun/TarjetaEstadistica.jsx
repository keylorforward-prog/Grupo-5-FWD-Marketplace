
/**
 * Componente de presentación puro (StatCard)
 * Sigue el principio de responsabilidad única al abstraer la visualización de métricas clave.
 * Utiliza composición mediante propiedades para la inyección dinámica de iconos de lucide-react.
 */
export default function TarjetaEstadistica({ title, value, icon: Icono, trend, isPositive, colorClass }) {
  return (
    <div className="bg-[#1e293b] p-6 rounded-2xl border border-border/10 shadow-elevated flex flex-col gap-4 relative overflow-hidden group cursor-pointer hover:border-primary/50 transition-colors">
      <div className="flex items-start justify-between">
        <div className={`p-3 rounded-xl bg-[#0f172a] border border-border/10 ${colorClass}`}>
          <Icono size={24} />
        </div>
        <span className={`px-2 py-1 text-xs font-bold rounded-full ${isPositive ? 'bg-success/20 text-success' : 'bg-warning/20 text-warning'}`}>
          {trend}
        </span>
      </div>
      <div>
        <p className="text-xs font-bold text-ink-muted uppercase tracking-wider mb-1">{title}</p>
        <p className="text-3xl font-extrabold text-canvas group-hover:scale-105 transition-transform origin-left">{value}</p>
      </div>
    </div>
  );
}