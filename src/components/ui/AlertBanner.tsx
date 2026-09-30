import React from 'react';
import { AlertCircle, CheckCircle2, Info, AlertTriangle, X } from 'lucide-react';

interface AlertBannerProps {
  type?: 'success' | 'error' | 'warning' | 'info';
  message: React.ReactNode;
  onClose?: () => void;
  className?: string;
}

export const AlertBanner: React.FC<AlertBannerProps> = ({
  type = 'info',
  message,
  onClose,
  className = '',
}) => {
  const styles = {
    success: {
      container: 'bg-[#EAF5EB] border-[#2E7D32]/30 text-[#1E5622]',
      icon: <CheckCircle2 className="w-4 h-4 text-[#2E7D32] shrink-0" />,
    },
    error: {
      container: 'bg-[#FBEBEB] border-[#C53A3A]/30 text-[#8C1D1D]',
      icon: <AlertCircle className="w-4 h-4 text-[#C53A3A] shrink-0" />,
    },
    warning: {
      container: 'bg-[#FEF6E9] border-[#E99A24]/30 text-[#965A08]',
      icon: <AlertTriangle className="w-4 h-4 text-[#E99A24] shrink-0" />,
    },
    info: {
      container: 'bg-[#EBF2FC] border-[#246BCE]/30 text-[#17488B]',
      icon: <Info className="w-4 h-4 text-[#246BCE] shrink-0" />,
    },
  };

  const current = styles[type];

  return (
    <div
      role="alert"
      className={`flex items-start justify-between gap-2.5 p-3 rounded-xl border text-xs leading-relaxed animate-in fade-in duration-200 ${current.container} ${className}`}
    >
      <div className="flex items-start gap-2.5">
        <div className="mt-0.5">{current.icon}</div>
        <div className="flex-1 font-medium">{message}</div>
      </div>
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="text-current opacity-70 hover:opacity-100 p-0.5 rounded transition-opacity"
          aria-label="Dismiss notification"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
};

