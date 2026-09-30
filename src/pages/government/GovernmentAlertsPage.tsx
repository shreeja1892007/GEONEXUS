import React, { useState } from 'react';
import {
  AlertTriangle,
  MapPin,
} from 'lucide-react';
import { GovernmentLayout } from '../../components/layout/GovernmentLayout';
import { useAuth } from '../../context/AuthContext';
import { WATER_RESOURCE_ALERTS, type WaterAlert } from '../../data/waterResourcesData';

export const GovernmentAlertsPage: React.FC = () => {
  const { currentGovUser } = useAuth();

  const departmentName = currentGovUser?.department || 'Department of Land Resources';
  const officerRole = currentGovUser?.officialRole || 'Government Officer';
  const districtName = currentGovUser?.districtOffice || 'Chennai District';

  const [severityFilter, setSeverityFilter] = useState<'ALL' | 'HIGH' | 'MEDIUM' | 'LOW'>('ALL');

  const isWater = departmentName === 'Water Resources Department';

  const departmentAlerts: WaterAlert[] = isWater
    ? WATER_RESOURCE_ALERTS
    : [
        { id: 'ALT-201', severity: 'HIGH', alert: 'Unauthorised construction in setback area', location: 'Survey 54/2B, Block 4', status: 'Needs Action' },
        { id: 'ALT-202', severity: 'HIGH', alert: 'Boundary dispute reported on registration', location: 'Ward 12, Plot 14', status: 'Investigation' },
        { id: 'ALT-203', severity: 'MEDIUM', alert: 'High mutation pending backlog', location: 'Revenue Division 2', status: 'Assigned' },
        { id: 'ALT-204', severity: 'LOW', alert: 'Property tax assessment update recommended', location: 'Zone 5', status: 'Monitoring' },
      ];

  const filteredAlerts = severityFilter === 'ALL'
    ? departmentAlerts
    : departmentAlerts.filter((a) => a.severity === severityFilter);

  return (
    <GovernmentLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-red-600 text-white flex items-center justify-center shrink-0 shadow-sm">
              <AlertTriangle className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-navy">DEPARTMENT ALERTS</h1>
              <p className="text-xs font-semibold text-slate-600 mt-0.5">
                {departmentName} • {officerRole} ({districtName})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200">
            {(['ALL', 'HIGH', 'MEDIUM', 'LOW'] as const).map((sev) => (
              <button
                key={sev}
                type="button"
                onClick={() => setSeverityFilter(sev)}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                  severityFilter === sev ? 'bg-navy text-white shadow-xs' : 'text-slate-600 hover:text-navy'
                }`}
              >
                {sev}
              </button>
            ))}
          </div>
        </div>

        {/* Alerts Table Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b pb-3 border-slate-100">
            <span className="text-xs font-bold text-navy uppercase tracking-wider">
              {filteredAlerts.length} Active System Alerts
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-500 border-b border-slate-200">
                  <th className="py-2.5 px-3 font-semibold">Alert ID</th>
                  <th className="py-2.5 px-3 font-semibold">Severity</th>
                  <th className="py-2.5 px-3 font-semibold">Alert Description</th>
                  <th className="py-2.5 px-3 font-semibold">Location</th>
                  <th className="py-2.5 px-3 font-semibold">Status</th>
                  <th className="py-2.5 px-3 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredAlerts.map((alt) => (
                  <tr key={alt.id} className="hover:bg-slate-50">
                    <td className="py-3 px-3 font-mono font-bold text-slate-500">{alt.id}</td>
                    <td className="py-3 px-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        alt.severity === 'HIGH' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                      }`}>
                        {alt.severity}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-semibold text-navy">{alt.alert}</td>
                    <td className="py-3 px-3 text-slate-500 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      {alt.location}
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 text-[10px] font-semibold rounded bg-slate-100 text-slate-700 border border-slate-200">
                        {alt.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        type="button"
                        onClick={() => alert(`Investigating alert ${alt.id}: ${alt.alert}`)}
                        className="px-3 py-1 bg-navy text-white text-[11px] font-semibold rounded-lg hover:bg-navy/90"
                      >
                        Action Alert
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </GovernmentLayout>
  );
};

