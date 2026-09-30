import React from 'react';
import type { ApplicationStatus } from '../../types/application';

const STATUS_STYLES: Record<ApplicationStatus, string> = {
  'Submitted': 'bg-blue-50 text-blue-700 border-blue-200',
  'Routed': 'bg-indigo-50 text-indigo-700 border-indigo-200',
  'Under Review': 'bg-amber-50 text-amber-700 border-amber-200',
  'More Information Required': 'bg-orange-50 text-orange-700 border-orange-200',
  'Approved': 'bg-emerald-50 text-emerald-700 border-emerald-200',
  'Rejected': 'bg-red-50 text-red-700 border-red-200',
  'Completed': 'bg-teal-50 text-teal-700 border-teal-200',
};

interface ApplicationStatusBadgeProps {
  status: ApplicationStatus;
  size?: 'sm' | 'md';
}

export const ApplicationStatusBadge: React.FC<ApplicationStatusBadgeProps> = ({ status, size = 'md' }) => {
  const style = STATUS_STYLES[status] || 'bg-slate-50 text-slate-600 border-slate-200';
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full border font-semibold ${
      size === 'sm' ? 'text-[10px]' : 'text-xs'
    } ${style}`}>
      {status}
    </span>
  );
};
