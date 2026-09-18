import { LucideIcon } from 'lucide-react';

interface KPICardProps {
  title: string;
  value: string | React.ReactNode;
  icon?: LucideIcon;
  trend?: string;
  trendDirection?: 'up' | 'down';
  footer?: React.ReactNode;
}

export default function KPICard({ title, value, icon: Icon, trend, trendDirection, footer }: KPICardProps) {
  return (
    <div className="bg-bg-surface border border-border-subtle rounded-lg p-5 flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xs font-medium text-text-muted uppercase tracking-wider">{title}</h3>
        {Icon && <Icon size={16} className="text-text-muted" />}
      </div>
      <div className="mt-auto">
        <div className="text-3xl font-heading font-bold text-text-main">{value}</div>
        
        <div className="mt-4 flex items-center text-sm">
          {trend && (
            <span className={`flex items-center mr-2 font-mono text-xs ${trendDirection === 'up' ? 'text-status-green' : 'text-status-red'}`}>
              {trendDirection === 'up' ? '↑' : '↓'} {trend}
            </span>
          )}
          {footer && <div className="text-text-muted text-xs flex-1">{footer}</div>}
        </div>
      </div>
    </div>
  );
}
