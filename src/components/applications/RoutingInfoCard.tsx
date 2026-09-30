import React from 'react';
import { Building2, UserCheck } from 'lucide-react';
import type { CitizenServiceDefinition } from '../../types/citizenService';

interface RoutingInfoCardProps {
  service: CitizenServiceDefinition;
}

export const RoutingInfoCard: React.FC<RoutingInfoCardProps> = ({ service }) => {
  return (
    <div className="rounded-2xl border border-teal-200 bg-teal-50/70 p-4 mt-4 animate-in fade-in duration-200">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-7 h-7 rounded-lg bg-tealAccent/20 flex items-center justify-center">
          <Building2 className="w-4 h-4 text-tealAccent" />
        </div>
        <h4 className="text-xs font-bold text-navy uppercase tracking-wider">Responsible Authority</h4>
      </div>
      <div className="space-y-2 text-xs">
        <div className="flex items-start gap-2">
          <span className="text-slate-500 w-28 shrink-0">Department:</span>
          <span className="font-semibold text-navy">{service.targetDepartment}</span>
        </div>
        <div className="flex items-start gap-2">
          <span className="text-slate-500 w-28 shrink-0">Handled by:</span>
          <div className="flex items-center gap-1.5">
            <UserCheck className="w-3.5 h-3.5 text-tealAccent" />
            <span className="font-semibold text-navy">{service.primaryRole}</span>
          </div>
        </div>
        {service.fallbackRoles.length > 0 && (
          <div className="flex items-start gap-2">
            <span className="text-slate-500 w-28 shrink-0">Fallback:</span>
            <span className="text-slate-600">{service.fallbackRoles.join(', ')}</span>
          </div>
        )}
        {service.collaboratingDepartments.length > 0 && (
          <div className="flex items-start gap-2">
            <span className="text-slate-500 w-28 shrink-0">Also involves:</span>
            <span className="text-slate-600">{service.collaboratingDepartments.join(', ')}</span>
          </div>
        )}
      </div>
      <div className="mt-3 pt-3 border-t border-teal-200 flex items-center gap-1.5 text-[11px] text-[#2E7D32] font-semibold">
        <span className="font-bold">✓</span>
        <span>This request will be automatically routed to the appropriate department and officer after submission.</span>
      </div>
    </div>
  );
};
