import React from 'react';
import { Sliders, Check, X, RotateCcw } from 'lucide-react';
import type { GovernmentAccessStatus } from '../../types/auth';

interface PrototypeAdminControlProps {
  currentStatus: GovernmentAccessStatus;
  onApprove: () => void;
  onReject: (reason?: string) => void;
  onReset?: () => void;
}

export const PrototypeAdminControl: React.FC<PrototypeAdminControlProps> = ({
  currentStatus,
  onApprove,
  onReject,
  onReset,
}) => {
  return (
    <div className="mt-8 p-4 sm:p-5 bg-slate-900 text-slate-100 rounded-2xl border-2 border-dashed border-tealAccent/50 shadow-lg relative overflow-hidden">
      {/* Visual Accent Badge */}
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-700/80">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-tealAccent/20 text-tealAccent-light rounded-lg">
            <Sliders className="w-4 h-4 text-tealAccent" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-widest text-tealAccent-light">
              Prototype Administration Control
            </span>
            <p className="text-[11px] text-slate-400">
              Simulate Department Administrator action for demonstration
            </p>
          </div>
        </div>

        <span
          className={`px-2.5 py-1 text-[10px] font-bold rounded-full uppercase tracking-wider ${
            currentStatus === 'approved'
              ? 'bg-[#2E7D32]/30 text-emerald-300 border border-[#2E7D32]/50'
              : currentStatus === 'rejected'
              ? 'bg-[#C53A3A]/30 text-red-300 border border-[#C53A3A]/50'
              : 'bg-[#E99A24]/30 text-amber-300 border border-[#E99A24]/50'
          }`}
        >
          Live: {currentStatus}
        </span>
      </div>

      <p className="text-xs text-slate-300 leading-relaxed mb-4">
        In production, requests are reviewed securely via internal NIC e-Office workflows. Use these demo controls to test the approval and rejection journeys.
      </p>

      {/* Control Buttons */}
      <div className="flex flex-wrap items-center gap-2.5">
        <button
          type="button"
          onClick={onApprove}
          disabled={currentStatus === 'approved'}
          className="flex-1 min-w-[150px] inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-semibold rounded-xl transition-all shadow-sm active:scale-95"
        >
          <Check className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>Simulate Department Approval</span>
        </button>

        <button
          type="button"
          onClick={() => onReject('Employee details could not be verified.')}
          disabled={currentStatus === 'rejected'}
          className="flex-1 min-w-[150px] inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 bg-rose-700 hover:bg-rose-600 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-semibold rounded-xl transition-all shadow-sm active:scale-95"
        >
          <X className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>Simulate Department Rejection</span>
        </button>

        {onReset && currentStatus !== 'pending' && (
          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center justify-center gap-1 px-3 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium rounded-xl transition-all border border-slate-700"
            title="Reset to Pending Approval"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset</span>
          </button>
        )}
      </div>
    </div>
  );
};
