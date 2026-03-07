interface StatCardProps {
  title: string;
  value: string | number;
  trend: string;
  trendType?: 'positive' | 'neutral';
  icon?: React.ReactNode;
}

export function StatCard({ title, value, trend, trendType = 'positive', icon }: StatCardProps) {
  return (
    <div className="bg-brand-white p-6 rounded-xl border border-brand-primary/10 shadow-sm
     hover:border-brand-accent-hover transition-all duration-300 pointer-events-auto group">
      <div className="flex justify-between items-start mb-4">
        <p className="text-gray-500 text-sm font-medium">{title}</p>
        {icon && <div className="p-2 bg-gray-50 rounded-lg group-hover:bg-brand-accent group-hover:text-brand-primary transition-colors">{icon}</div>}
      </div>
      <div className="flex items-end justify-between">
        <h2 className="text-2xl font-bold text-brand-primary">{value}</h2>
        <span className={`text-xs font-bold ${trendType === 'positive' ? 'text-success' : 'text-brand-accent'
          }`}>
          {trend}
        </span>
      </div>
    </div>
  );
}