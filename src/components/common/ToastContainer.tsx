import React from 'react';
import { 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Info, 
  X, 
  Truck, 
  Package, 
  ExternalLink,
  ChevronRight,
  Bell
} from 'lucide-react';
import { ToastNotification } from '../../types';

interface ToastContainerProps {
  toasts: ToastNotification[];
  onDismiss: (id: string) => void;
  queueRemainingCount?: number;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ 
  toasts, 
  onDismiss,
  queueRemainingCount = 0 
}) => {
  if (toasts.length === 0 && queueRemainingCount === 0) return null;

  return (
    <div 
      aria-live="polite"
      aria-atomic="true"
      className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm sm:max-w-md w-full pointer-events-none px-4 sm:px-0"
    >
      {/* Toast items */}
      {toasts.map((toast) => {
        const isSuccess = toast.type === 'success';
        const isError = toast.type === 'error';
        const isWarning = toast.type === 'warning';

        // Select specialized icon for delivery status changes
        const renderStatusIcon = () => {
          if (toast.status === 'out_for_delivery') {
            return <Truck className="w-4 h-4 text-blue-400 animate-bounce" />;
          }
          if (toast.status === 'delivered' || isSuccess) {
            return <CheckCircle2 className="w-4 h-4 text-emerald-400" />;
          }
          if (toast.status === 'failed' || toast.status === 'returned' || isError) {
            return <XCircle className="w-4 h-4 text-rose-400" />;
          }
          if (toast.status === 'preparing' || toast.status === 'confirmed') {
            return <Package className="w-4 h-4 text-amber-400" />;
          }
          if (isWarning) {
            return <AlertTriangle className="w-4 h-4 text-amber-400" />;
          }
          return <Info className="w-4 h-4 text-blue-400" />;
        };

        return (
          <div
            key={toast.id}
            role="alert"
            onClick={() => {
              if (toast.onAction) {
                toast.onAction();
              }
            }}
            className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-2xl border shadow-xl backdrop-blur-md transition-all animate-in fade-in slide-in-from-bottom-3 duration-200 select-none ${
              toast.onAction ? 'cursor-pointer hover:scale-[1.01]' : ''
            } ${
              isSuccess 
                ? 'bg-slate-900/95 text-slate-50 border-emerald-500/50 shadow-emerald-950/20'
                : isError
                  ? 'bg-slate-900/95 text-slate-50 border-rose-500/50 shadow-rose-950/20'
                  : isWarning
                    ? 'bg-slate-900/95 text-slate-50 border-amber-500/50 shadow-amber-950/20'
                    : 'bg-slate-900/95 text-slate-50 border-blue-500/50 shadow-blue-950/20'
            }`}
          >
            {/* Status Icon */}
            <div className="shrink-0 mt-0.5 p-1 rounded-lg bg-white/10">
              {renderStatusIcon()}
            </div>

            {/* Notification Text & Meta */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-xs font-bold leading-tight tracking-tight text-white">
                  {toast.title}
                </span>

                {toast.orderId && (
                  <span className="text-[10px] font-mono font-bold bg-white/15 text-slate-200 px-1.5 py-0.2 rounded-md">
                    {toast.orderId}
                  </span>
                )}
              </div>

              {toast.message && (
                <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">
                  {toast.message}
                </p>
              )}

              {/* Action Link for Merchant */}
              {toast.onAction && (
                <div className="mt-2 flex items-center gap-1 text-[11px] font-bold text-blue-400 hover:text-blue-300 transition-colors">
                  <span>{toast.actionLabel || 'Afficher la fiche commande'}</span>
                  <ChevronRight className="w-3 h-3" />
                </div>
              )}
            </div>

            {/* Dismiss Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDismiss(toast.id);
              }}
              className="shrink-0 p-1 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
              aria-label="Fermer la notification"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}

      {/* Queue Indicator if remaining in backlog */}
      {queueRemainingCount > 0 && (
        <div className="pointer-events-auto bg-slate-900/90 text-slate-300 border border-slate-700/80 px-3 py-1.5 rounded-xl text-[11px] font-medium flex items-center justify-between shadow-md">
          <div className="flex items-center gap-1.5">
            <Bell className="w-3 h-3 text-amber-400 animate-pulse" />
            <span>+<strong>{queueRemainingCount}</strong> notification(s) de livraison en attente...</span>
          </div>
          <span className="text-[10px] text-slate-400 font-mono">File d'attente active</span>
        </div>
      )}
    </div>
  );
};
