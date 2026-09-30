import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Building2,
  MapPin,
  FileText,
  Clock,
  Send,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { CitizenLayout } from '../../components/layout/CitizenLayout';
import { ApplicationStatusBadge } from '../../components/applications/ApplicationStatusBadge';
import { ApplicationStatusTimeline } from '../../components/applications/ApplicationStatusTimeline';
import { useApplications } from '../../context/ApplicationContext';

export const ApplicationDetailPage: React.FC = () => {
  const { applicationId } = useParams<{ applicationId: string }>();
  const navigate = useNavigate();
  const { getApplicationById, updateApplication, updateStatus } = useApplications();

  const app = applicationId ? getApplicationById(applicationId) : undefined;

  const [moreInfoResponse, setMoreInfoResponse] = useState('');
  const [submittingResponse, setSubmittingResponse] = useState(false);

  if (!app) {
    return (
      <CitizenLayout>
        <div className="text-center py-24">
          <p className="text-sm font-semibold text-slate-500">Application not found.</p>
          <Link to="/citizen/applications" className="mt-3 inline-block text-xs text-primaryBlue underline">
            Back to Applications
          </Link>
        </div>
      </CitizenLayout>
    );
  }

  const submittedDate = new Date(app.submittedAt).toLocaleDateString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
  } as Intl.DateTimeFormatOptions);

  const handleRespondMoreInfo = async () => {
    if (!moreInfoResponse.trim()) return;
    setSubmittingResponse(true);
    try {
      await updateApplication(app.applicationId, {
        moreInfoResponse: {
          message: moreInfoResponse,
          respondedAt: new Date().toISOString(),
        },
        status: 'Under Review',
      });
      await updateStatus(app.applicationId, 'Under Review', 'Citizen provided additional information.');
      setMoreInfoResponse('');
    } finally {
      setSubmittingResponse(false);
    }
  };

  return (
    <CitizenLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Back nav */}
        <button
          type="button"
          onClick={() => navigate('/citizen/applications')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-navy"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Applications
        </button>

        {/* Header card */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div>
              <p className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">Application ID</p>
              <p className="text-2xl font-bold font-mono text-navy">{app.applicationId}</p>
              <p className="text-sm text-slate-600 mt-1">{app.purposeLabel}</p>
              <p className="text-xs text-slate-400 mt-0.5">Submitted: {submittedDate}</p>
            </div>
            <ApplicationStatusBadge status={app.status} size="md" />
          </div>

          {/* More Information Required Alert */}
          {app.status === 'More Information Required' && app.moreInfoRequest && (
            <div className="mt-4 p-4 bg-orange-50 border border-orange-200 rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="w-4 h-4 text-orange-600" />
                <p className="text-xs font-bold text-orange-700">Additional Information Required</p>
              </div>
              <p className="text-xs text-orange-600">{app.moreInfoRequest.message}</p>
              {app.moreInfoRequest.requestedDocument && (
                <p className="text-xs text-orange-600 mt-1">
                  Document requested: <strong>{app.moreInfoRequest.requestedDocument}</strong>
                </p>
              )}

              {!app.moreInfoResponse && (
                <div className="mt-3 space-y-2">
                  <textarea
                    rows={3}
                    value={moreInfoResponse}
                    onChange={(e) => setMoreInfoResponse(e.target.value)}
                    placeholder="Type your response here..."
                    className="w-full px-3 py-2 text-xs text-navy bg-white border border-orange-300 rounded-xl focus:border-orange-400 focus:ring-2 focus:ring-orange-400/20 focus:outline-none resize-none"
                  />
                  <button
                    type="button"
                    onClick={handleRespondMoreInfo}
                    disabled={submittingResponse || !moreInfoResponse.trim()}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-orange-600 text-white text-xs font-semibold rounded-xl disabled:opacity-50"
                  >
                    <Send className="w-3.5 h-3.5" />
                    {submittingResponse ? 'Submitting...' : 'Submit Response'}
                  </button>
                </div>
              )}

              {app.moreInfoResponse && (
                <div className="mt-3 p-3 bg-white border border-orange-200 rounded-xl">
                  <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Your Response</p>
                  <p className="text-xs text-navy mt-1">{app.moreInfoResponse.message}</p>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Left column: Details */}
          <div className="lg:col-span-2 space-y-5">
            {/* Routing */}
            <DetailCard icon={<Building2 className="w-4 h-4 text-tealAccent" />} title="Responsible Authority">
              <DetailRow label="Department" value={app.targetDepartment} />
              <DetailRow label="Officer Role" value={app.targetRole} />
              {app.fallbackRoles.length > 0 && (
                <DetailRow label="Fallback" value={app.fallbackRoles.join(', ')} />
              )}
            </DetailCard>

            {/* Location / Parcel */}
            <DetailCard icon={<MapPin className="w-4 h-4 text-tealAccent" />} title="Parcel / Location">
              {app.ulpin && <DetailRow label="ULPIN" value={app.ulpin} mono />}
              {app.surveyNumber && <DetailRow label="Survey No." value={app.surveyNumber} />}
              <DetailRow label="State" value={app.location.state} />
              <DetailRow label="District" value={app.location.district} />
              {app.location.villageOrWard && <DetailRow label="Village/Ward" value={app.location.villageOrWard} />}
            </DetailCard>

            {/* Request Details */}
            {Object.keys(app.requestDetails).length > 0 && (
              <DetailCard icon={<FileText className="w-4 h-4 text-tealAccent" />} title="Request Details">
                {Object.entries(app.requestDetails).map(([key, val]) => (
                  key !== '_remarks' && val && (
                    <DetailRow key={key} label={key.replace(/([A-Z])/g, ' $1').trim()} value={val} />
                  )
                ))}
                {app.requestDetails['_remarks'] && (
                  <div className="pt-2 mt-2 border-t border-slate-100">
                    <p className="text-[11px] text-slate-400 font-semibold">Additional Remarks</p>
                    <p className="text-xs text-navy mt-0.5">{app.requestDetails['_remarks']}</p>
                  </div>
                )}
              </DetailCard>
            )}

            {/* Documents */}
            <DetailCard icon={<FileText className="w-4 h-4 text-tealAccent" />} title="Documents">
              {app.documents.filter((d) => d.uploaded).length === 0 ? (
                <p className="text-xs text-slate-400">No documents uploaded.</p>
              ) : (
                <ul className="space-y-1.5">
                  {app.documents.filter((d) => d.uploaded).map((d) => (
                    <li key={d.id} className="text-xs text-navy flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                      {d.name} — <span className="font-mono text-slate-500 text-[11px]">{d.fileName}</span>
                    </li>
                  ))}
                </ul>
              )}
            </DetailCard>

            {/* Officer Remarks */}
            {app.officerRemarks && (
              <DetailCard icon={<FileText className="w-4 h-4 text-tealAccent" />} title="Officer Remarks">
                <p className="text-xs text-navy leading-relaxed">{app.officerRemarks}</p>
              </DetailCard>
            )}
          </div>

          {/* Right column: Timeline */}
          <div className="space-y-5">
            <DetailCard icon={<Clock className="w-4 h-4 text-tealAccent" />} title="Status Timeline">
              <ApplicationStatusTimeline history={app.statusHistory} />
            </DetailCard>
          </div>
        </div>
      </div>
    </CitizenLayout>
  );
};

function DetailCard({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-3 bg-slate-50 border-b border-slate-200">
        {icon}
        <h3 className="text-xs font-bold text-navy uppercase tracking-wider">{title}</h3>
      </div>
      <div className="px-4 py-4 space-y-2">{children}</div>
    </div>
  );
}

function DetailRow({ label, value, mono = false }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex items-start gap-2 text-xs">
      <span className="text-slate-400 w-28 shrink-0">{label}:</span>
      <span className={`text-navy font-semibold flex-1 ${mono ? 'font-mono' : ''}`}>{value}</span>
    </div>
  );
}
