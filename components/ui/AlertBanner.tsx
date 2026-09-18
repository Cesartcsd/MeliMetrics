import { AlertTriangle, ArrowRight } from 'lucide-react';

interface AlertBannerProps {
  type: 'critical' | 'warning' | 'info';
  title: string;
  message: string;
  actionText?: string;
  onAction?: () => void;
}

export default function AlertBanner({ type, title, message, actionText, onAction }: AlertBannerProps) {
  const getStyles = () => {
    switch (type) {
      case 'critical': return 'bg-status-red/10 border-status-red text-status-red';
      case 'warning': return 'bg-status-amber/10 border-status-amber text-status-amber';
      case 'info': return 'bg-accent-blue/10 border-accent-blue text-accent-blue';
    }
  };

  return (
    <div className={`flex items-center justify-between border-l-4 border-y border-r border-border-subtle p-4 rounded-r-lg mb-6 ${getStyles()}`}>
      <div className="flex items-center">
        <AlertTriangle size={20} className="mr-3 shrink-0" />
        <div>
          <span className="font-bold mr-2">{title}:</span>
          <span className="text-text-main text-sm">{message}</span>
        </div>
      </div>
      {actionText && (
        <button 
          onClick={onAction}
          className="text-accent-blue hover:text-accent-blue-hover text-sm font-medium flex items-center transition-colors shrink-0 cursor-pointer ml-4"
        >
          {actionText}
          <ArrowRight size={16} className="ml-1" />
        </button>
      )}
    </div>
  );
}
