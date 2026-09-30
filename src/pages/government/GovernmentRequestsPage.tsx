import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ClipboardList,
  Search,
  ArrowRight,
  Inbox,
  MapPin,
  User,
  Calendar,
} from 'lucide-react';
import { GovernmentLayout } from '../../components/layout/GovernmentLayout';
import { ApplicationStatusBadge } from '../../components/applications/ApplicationStatusBadge';
import { useApplications } from '../../context/ApplicationContext';
import { useAuth } from '../../context/AuthContext';
import type { ApplicationStatus } from '../../types/application';

const FILTER_OPTIONS: (ApplicationStatus | 'All')[] = [
  'All', 'Submitted', 'Routed', 'Under Review', 'More Information Required',
  'Approved', 'Rejected', 'Completed',
];

export const GovernmentRequestsPage: React.FC = () => {
  const { currentGovUser } = useAuth();
  const { getApplicationsForGovUser } = useApplications();

  const [filterStatus, setFilterStatus] = useState<ApplicationStatus | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const allApps = currentGovUser ? getApplicationsForGovUser(currentGovUser) : [];

  const filtered = allApps.filter((app) => {
    const statusOk = filterStatus === 'All' || app.status === filterStatus;
    const searchOk =
      !searchQuery ||
      app.applicationId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.purposeLabel.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.citizenName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (app.ulpin || '').toLowerCase().includes(searchQuery.toLowerCase());
    return statusOk && searchOk;
  });

  const sorted = [...filtered].sort(
    (a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
  );

  return (
    <GovernmentLayout>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <ClipboardList className="w-5 h-5 text-tealAccent" />
            <h1 className="text-xl font-bold text-navy">Citizen Requests</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Applications routed to your department and jurisdiction.
          </p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-navy">{allApps.length}</p>
          <p className="text-[11px] text-slate-400">Total in queue</p>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col gap-3 mb-5">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by App ID, Citizen, Purpose, ULPIN..."
            className="w-full h-10 pl-9 pr-3 text-xs text-navy bg-white border border-slate-300 rounded-xl focus:border-navy focus:ring-2 focus:ring-navy/10 focus:outline-none"
          />
        </div>
        <div className="flex gap-1.5 overflow-x-auto pb-1 flex-wrap">
          {FILTER_OPTIONS.map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1.5 text-[11px] font-semibold rounded-lg whitespace-nowrap border transition-colors ${
                filterStatus === st
                  ? 'bg-navy text-white border-navy'
                  : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
              }`}
            >
              {st}
              {st !== 'All' && (
                <span className="ml-1 text-[10px] opacity-70">
                  ({allApps.filter((a) => a.status === st).length})
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Request List */}
      {sorted.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
          <Inbox className="w-14 h-14 text-slate-300" />
          <p className="text-sm font-semibold text-slate-500">
            {allApps.length === 0
              ? 'No citizen requests in your queue.'
              : 'No requests match your filter.'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {sorted.map((app) => {
            const submittedDate = new Date(app.submittedAt).toLocaleDateString('en-IN', {
              day: '2-digit', month: 'short', year: 'numeric',
            });
            return (
              <div
                key={app.applicationId}
                className="bg-white border border-slate-200 rounded-2xl shadow-sm px-5 py-4 hover:shadow-md hover:border-slate-300 transition-all"
              >
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-bold text-navy">{app.purposeLabel}</p>
                      <ApplicationStatusBadge status={app.status} size="sm" />
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">{app.category}</p>
                    <div className="flex flex-wrap items-center gap-3 mt-2 text-[11px] text-slate-400">
                      <span className="flex items-center gap-1">
                        <User className="w-3 h-3" /> {app.citizenName}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> {app.location.district}, {app.location.state}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" /> {submittedDate}
                      </span>
                      {app.ulpin && <span className="font-mono">{app.ulpin}</span>}
                    </div>
                    <p className="font-mono text-[11px] text-primaryBlue mt-1">{app.applicationId}</p>
                  </div>
                  <Link
                    to={`/government/requests/${app.applicationId}`}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-navy text-white text-xs font-semibold rounded-xl hover:bg-navy/90 transition-colors self-start shrink-0"
                  >
                    Open <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </GovernmentLayout>
  );
};
