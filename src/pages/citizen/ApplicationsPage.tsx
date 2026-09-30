import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FilePlus2, FileText, Inbox, Eye, ArrowRight, Search } from 'lucide-react';
import { CitizenLayout } from '../../components/layout/CitizenLayout';
import { ApplicationStatusBadge } from '../../components/applications/ApplicationStatusBadge';
import { useApplications } from '../../context/ApplicationContext';
import { useAuth } from '../../context/AuthContext';
import type { ApplicationStatus } from '../../types/application';

const ALL_STATUSES: ApplicationStatus[] = [
  'Submitted', 'Routed', 'Under Review', 'More Information Required',
  'Approved', 'Rejected', 'Completed',
];

export const ApplicationsPage: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { getApplicationsForCitizen } = useApplications();

  const [filterStatus, setFilterStatus] = useState<ApplicationStatus | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const allApps = currentUser ? getApplicationsForCitizen(currentUser.id) : [];

  const filtered = allApps.filter((app) => {
    const statusOk = filterStatus === 'All' || app.status === filterStatus;
    const searchOk =
      !searchQuery ||
      app.applicationId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.purposeLabel.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (app.ulpin || '').toLowerCase().includes(searchQuery.toLowerCase());
    return statusOk && searchOk;
  });

  return (
    <CitizenLayout>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl font-bold text-navy">My Applications</h1>
          <p className="text-xs text-slate-500 mt-1">Track land service requests submitted via GeoNexus.</p>
        </div>
        <button
          type="button"
          onClick={() => navigate('/citizen/applications/new')}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-navy hover:bg-navy/90 text-white text-xs font-semibold rounded-xl transition-colors shadow-sm self-start sm:self-auto"
        >
          <FilePlus2 className="w-4 h-4" />
          <span>+ New Application Request</span>
        </button>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Application ID, Purpose..."
            className="w-full h-10 pl-9 pr-3 text-xs text-navy bg-white border border-slate-300 rounded-xl focus:border-navy focus:ring-2 focus:ring-navy/10 focus:outline-none"
          />
        </div>
        <div className="flex gap-1.5 overflow-x-auto pb-1">
          {(['All', ...ALL_STATUSES] as const).map((st) => (
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
            </button>
          ))}
        </div>
      </div>

      {/* Application List */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
          <Inbox className="w-14 h-14 text-slate-300" />
          <div>
            <p className="text-sm font-semibold text-slate-500">
              {allApps.length === 0 ? 'No applications submitted yet.' : 'No applications match your filter.'}
            </p>
            {allApps.length === 0 && (
              <button
                type="button"
                onClick={() => navigate('/citizen/applications/new')}
                className="mt-3 inline-flex items-center gap-2 px-4 py-2 bg-navy text-white text-xs font-semibold rounded-xl"
              >
                <FilePlus2 className="w-4 h-4" />
                Submit Your First Application
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((app) => {
            const submittedDate = new Date(app.submittedAt).toLocaleDateString('en-IN', {
              day: '2-digit', month: 'short', year: 'numeric',
            });
            return (
              <div
                key={app.applicationId}
                className="bg-white border border-slate-200 rounded-2xl shadow-sm px-5 py-4 hover:shadow-md hover:border-slate-300 transition-all"
              >
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-navy/10 flex items-center justify-center shrink-0 mt-0.5">
                      <FileText className="w-4 h-4 text-navy" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-navy">{app.purposeLabel}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{app.targetDepartment}</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        {app.ulpin ? `${app.surveyNumber} · ${app.ulpin} · ` : ''}
                        Submitted {submittedDate}
                      </p>
                      <p className="font-mono text-[11px] text-primaryBlue mt-0.5">{app.applicationId}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <ApplicationStatusBadge status={app.status} />
                    <button
                      type="button"
                      onClick={() => navigate(`/citizen/applications/${app.applicationId}`)}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-primaryBlue hover:underline"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      View
                    </button>
                  </div>
                </div>
                {app.status === 'More Information Required' && app.moreInfoRequest && (
                  <div className="mt-3 p-3 bg-orange-50 border border-orange-200 rounded-xl text-xs">
                    <p className="font-semibold text-orange-700">Additional Information Required</p>
                    <p className="text-orange-600 mt-0.5">{app.moreInfoRequest.message}</p>
                    <button
                      type="button"
                      onClick={() => navigate(`/citizen/applications/${app.applicationId}`)}
                      className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-orange-700 underline"
                    >
                      Respond <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                )}
                {app.officerRemarks && app.status !== 'More Information Required' && (
                  <div className="mt-3 p-3 bg-slate-50 border border-slate-100 rounded-xl text-xs">
                    <span className="font-semibold text-slate-600">Officer Remarks: </span>
                    <span className="text-slate-600">{app.officerRemarks}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </CitizenLayout>
  );
};
