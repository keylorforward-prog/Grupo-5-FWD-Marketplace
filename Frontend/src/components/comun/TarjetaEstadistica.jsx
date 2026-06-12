export default function TarjetaEstadistica({ title, value, icon: Icon, trend, isPositive, colorClass }) {
  return (
    <div className="bg-surface border border-border p-6 rounded-[var(--radius)] shadow-soft transition-all duration-base hover:shadow-elevated hover:scale-[1.02] flex flex-col justify-between">
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-xs font-bold font-heading uppercase tracking-wider text-ink-muted mb-1">
            {title}
          </p>
          <h4 className="text-2xl font-bold font-heading text-ink-strong">
            {value}
          </h4>
        </div>
        <div className={`p-3 rounded-[var(--radius)] bg-surface-sunken ${colorClass}`}>
          <Icon size={20} />
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <span className={`text-xs font-bold px-2 py-1 rounded-full ${isPositive ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive'}`}>
          {trend}
        </span>
        <span className="text-xs text-ink-subtle">vs. mes anterior</span>
      </div>
    </div>
  );
}