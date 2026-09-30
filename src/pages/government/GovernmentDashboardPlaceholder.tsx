import React from 'react';
import {
  Building2,
  ShieldCheck,
  ClipboardList,
  Clock,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { GovernmentLayout } from '../../components/layout/GovernmentLayout';
import { useAuth } from '../../context/AuthContext';
import { useApplications } from '../../context/ApplicationContext';
import { WaterResourcesDashboard } from '../../components/government/water/WaterResourcesDashboard';

export const GovernmentDashboardPlaceholder: React.FC = () => {
  const { currentGovUser } = useAuth();
  const { getApplicationsForGovUser } = useApplications();

  // If logged in as Water Resources Department, render full Water Resources Administration Dashboard
  if (currentGovUser?.department === 'Water Resources Department') {
    return (
      <GovernmentLayout>
        <WaterResourcesDashboard />
      </GovernmentLayout>
    );
  }

  const displayOfficer = currentGovUser?.fullName || 'Government Officer';
  const displayRole = currentGovUser?.officialRole || 'Officer';
  const displayDept = currentGovUser?.department || '';
  const displayDesignation = currentGovUser?.designation || '';
  const displayLocation = currentGovUser
    ? `${currentGovUser.districtOffice}, ${currentGovUser.state}`
    : '';

  const myApps = currentGovUser ? getApplicationsForGovUser(currentGovUser) : [];
  const newCount = myApps.filter((a) => a.status === 'Routed' || a.status === 'Submitted').length;
  const underReviewCount = myApps.filter((a) => a.status === 'Under Review').length;
  const awaitingCitizenCount = myApps.filter((a) => a.status === 'More Information Required').length;
  const approvedCount = myApps.filter((a) => a.status === 'Approved' || a.status === 'Completed').length;

  return (
    <GovernmentLayout>
      {/* Officer profile header */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm mb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-navy text-white flex items-center justify-center shadow-sm">
            <Building2 className="w-7 h-7 text-tealAccent-light" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold text-navy">{displayOfficer}</h1>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-navy/10 text-navy border border-navy/20">
                <ShieldCheck className="w-3 h-3 text-tealAccent" />
                Authorised Official
              </span>
            </div>
            <p className="text-xs font-semibold text-slate-600 mt-0.5">
              {displayDesignation} • <span className="text-tealAccent">{displayRole}</span>
            </p>
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-1">
              <span>Dept: <strong className="text-navy">{displayDept}</strong></span>
              {displayLocation && <span>• {displayLocation}</span>}
            </div>
          </div>
        </div>
      </div>

      {/* Citizen Requests Summary Card */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <SummaryCard
          label="New Requests"
          count={newCount}
          color="text-blue-700 bg-blue-50 border-blue-200"
          icon={<ClipboardList className="w-5 h-5" />}
        />
        <SummaryCard
          label="Under Review"
          count={underReviewCount}
          color="text-amber-700 bg-amber-50 border-amber-200"
          icon={<Clock className="w-5 h-5" />}
        />
        <SummaryCard
          label="Awaiting Citizen"
          count={awaitingCitizenCount}
          color="text-orange-700 bg-orange-50 border-orange-200"
          icon={<AlertCircle className="w-5 h-5" />}
        />
        <SummaryCard
          label="Approved / Completed"
          count={approvedCount}
          color="text-emerald-700 bg-emerald-50 border-emerald-200"
          icon={<CheckCircle2 className="w-5 h-5" />}
        />
      </div>

      {/* Citizen Requests Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <ClipboardList className="w-5 h-5 text-tealAccent" />
            <h2 className="text-base font-bold text-navy">Citizen Requests</h2>
            {newCount > 0 && (
              <span className="px-2 py-0.5 text-[11px] font-bold rounded-full bg-[#C53A3A] text-white">{newCount}</span>
            )}
          </div>
          <Link
            to="/government/requests"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-primaryBlue hover:underline"
          >
            View All <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        {myApps.length === 0 ? (
          <div className="text-center py-10">
            <ClipboardList className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <p className="text-sm font-semibold text-slate-400">No citizen requests in your queue.</p>
            <p className="text-xs text-slate-400 mt-1">Requests routed to your department and jurisdiction will appear here.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {myApps.slice(0, 5).map((app) => (
              <Link
                key={app.applicationId}
                to={`/government/requests/${app.applicationId}`}
                className="flex items-center justify-between gap-4 p-3 rounded-xl border border-slate-200 hover:border-primaryBlue/50 hover:bg-slate-50 transition-all"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-navy truncate">{app.purposeLabel}</p>
                  <p className="text-[11px] text-slate-400">
                    {app.citizenName} · {app.location.district}, {app.location.state}
                  </p>
                  <p className="font-mono text-[11px] text-slate-400">{app.applicationId}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className={`px-2 py-0.5 text-[10px] font-semibold rounded-full border ${
                    app.status === 'Routed' || app.status === 'Submitted'
                      ? 'bg-blue-50 text-blue-700 border-blue-200'
                      : app.status === 'Under Review'
                      ? 'bg-amber-50 text-amber-700 border-amber-200'
                      : 'bg-slate-50 text-slate-600 border-slate-200'
                  }`}>{app.status}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                </div>
              </Link>
            ))}
            {myApps.length > 5 && (
              <Link to="/government/requests" className="block text-center text-xs font-semibold text-primaryBlue hover:underline py-2">
                View all {myApps.length} requests →
              </Link>
            )}
          </div>
        )}
      </div>
    </GovernmentLayout>
  );
};

function SummaryCard({ label, count, color, icon }: { label: string; count: number; color: string; icon: React.ReactNode }) {
  return (
    <div className={`rounded-2xl border p-4 flex items-center gap-3 ${color}`}>
      <div className="opacity-70">{icon}</div>
      <div>
        <p className="text-2xl font-bold">{count}</p>
        <p className="text-xs font-semibold opacity-80">{label}</p>
      </div>
    </div>
  );
}
