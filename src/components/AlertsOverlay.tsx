import { AlertCircle, CheckCircle2, Info, XCircle, X } from 'lucide-react';
import { Alert } from '../types';

interface AlertsOverlayProps {
  alerts: Alert[];
  onRemove: (id: string) => void;
}

export function AlertsOverlay({ alerts, onRemove }: AlertsOverlayProps) {
  return (
    <div className="fixed top-20 right-6 z-[100] flex flex-col gap-3 pointer-events-none">
      {alerts.map((alert) => (
        <div
          key={alert.id}
          className={`pointer-events-auto w-80 p-4 rounded-2xl border shadow-2xl backdrop-blur-xl flex items-start gap-3 ${
              alert.type === 'success' ? 'bg-secondary/10 border-secondary/30' :
              alert.type === 'warning' ? 'bg-tertiary/10 border-tertiary/30' :
              alert.type === 'error' ? 'bg-error/10 border-error/30' :
              'bg-surface-container-highest border-outline/30'
            }`}
          >
            <div className="mt-0.5">
              {alert.type === 'success' && <CheckCircle2 className="w-4 h-4 text-secondary" />}
              {alert.type === 'warning' && <AlertCircle className="w-4 h-4 text-tertiary" />}
              {alert.type === 'error' && <XCircle className="w-4 h-4 text-error" />}
              {alert.type === 'info' && <Info className="w-4 h-4 text-white" />}
            </div>
            
            <div className="flex-1">
              <p className="text-[11px] font-bold text-white leading-tight">{alert.message}</p>
              <span className="text-[8px] font-black text-on-surface-variant uppercase tracking-widest mt-1 block">
                {alert.timestamp}
              </span>
            </div>

            <button 
              onClick={() => onRemove(alert.id)}
              className="p-1 hover:bg-white/5 rounded-lg transition-colors"
            >
              <X className="w-3 h-3 text-on-surface-variant" />
            </button>
          </div>
        ))}
    </div>
  );
}
