import React from 'react';
import { CheckCircle2, Clock, AlertCircle, XCircle, FileCheck2, RotateCcw, Send } from 'lucide-react';
import type { StatusHistoryEntry, ApplicationStatus } from '../../types/application';

const STATUS_ICONS: Record<ApplicationStatus, React.FC<{ className?: string }>> = {
  'Submitted': Send,
  'Routed': RotateCcw,
  'Under Review': Clock,
  'More Information Required': AlertCircle,
  'Approved': CheckCircle2,
  'Rejected': XCircle,
  'Completed': FileCheck2,
};

const STATUS_COLORS: Record<ApplicationStatus, string> = {
  'Submitted': 'bg-blue-100 text-blue-700',
  'Routed': 'bg-indigo-100 text-indigo-700',
  'Under Review': 'bg-amber-100 text-amber-700',
  'More Information Required': 'bg-orange-100 text-orange-700',
  'Approved': 'bg-emerald-100 text-emerald-700',
  'Rejected': 'bg-red-100 text-red-700',
  'Completed': 'bg-teal-100 text-teal-700',
};

interface ApplicationStatusTimelineProps {
  history: StatusHistoryEntry[];
}

export const ApplicationStatusTimeline: React.FC<ApplicationStatusTimelineProps> = ({ history }) => {
  const sorted = [...history].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

  return (
    <div className="relative space-y-0">
      {sorted.map((entry, idx) => {
        const Icon = STATUS_ICONS[entry.status] || Clock;
        const colorClass = STATUS_COLORS[entry.status] || 'bg-slate-100 text-slate-600';
        const isLast = idx === sorted.length - 1;
        const dt = new Date(entry.timestamp);
        const dateStr = dt.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
        const timeStr = dt.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

        return (
          <div key={idx} className="flex gap-4">
            <div className="flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${colorClass}`}>
                <Icon className="w-4 h-4" />
              </div>
              {!isLast && <div className="w-0.5 h-full bg-slate-200 my-1" />}
            </div>
            <div className={`pb-5 ${isLast ? 'pb-0' : ''}`}>
              <p className="text-xs font-bold text-navy">{entry.status}</p>
              <p className="text-[11px] text-slate-400">{dateStr} {timeStr}</p>
              {entry.note && <p className="text-xs text-slate-500 mt-0.5">{entry.note}</p>}
              {entry.updatedBy && <p className="text-[11px] text-slate-400 mt-0.5">By: {entry.updatedBy}</p>}
            </div>
          </div>
        );
      })}
    </div>
  );
};
