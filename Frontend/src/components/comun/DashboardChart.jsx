import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';

export default function DashboardChart({ data, isLoading }) {
  if (isLoading) {
    return (
      <div className="h-[300px] w-full bg-surface-sunken rounded-[var(--radius)] animate-pulse flex items-center justify-center border border-border">
        <span className="text-ink-muted text-sm font-medium">Cargando métricas...</span>
      </div>
    );
  }

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
          <XAxis 
            dataKey="month" 
            stroke="var(--ink-muted)" 
            tick={{ fill: 'var(--ink-muted)', fontSize: 12 }} 
            axisLine={false} 
            tickLine={false} 
          />
          <YAxis 
            stroke="var(--ink-muted)" 
            tick={{ fill: 'var(--ink-muted)', fontSize: 12 }} 
            axisLine={false} 
            tickLine={false} 
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'var(--surface)', 
              borderColor: 'var(--border-strong)', 
              borderRadius: '1rem', 
              color: 'var(--ink-strong)',
              boxShadow: 'var(--shadow-elevated)'
            }} 
            itemStyle={{ fontWeight: 'bold' }} 
          />
          <Legend wrapperStyle={{ paddingTop: '20px' }} />
          <Line 
            type="monotone" 
            dataKey="egresados" 
            name="Nuevos Egresados" 
            stroke="var(--accent)" 
            strokeWidth={3} 
            dot={{ r: 4, strokeWidth: 2, fill: 'var(--surface)' }} 
            activeDot={{ r: 6, stroke: 'var(--accent)', strokeWidth: 2, fill: 'var(--surface)' }} 
          />
          <Line 
            type="monotone" 
            dataKey="empresas" 
            name="Nuevas Empresas" 
            stroke="var(--secondary)" 
            strokeWidth={3} 
            dot={{ r: 4, strokeWidth: 2, fill: 'var(--surface)' }} 
            activeDot={{ r: 6, stroke: 'var(--secondary)', strokeWidth: 2, fill: 'var(--surface)' }} 
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}