import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  User,
  MapPin,
  FileText,
  Clock,
  Building2,
  CheckCircle2,
  XCircle,
  MessageSquare,
  PlayCircle,
  AlertCircle,
  Files,
} from 'lucide-react';
import { GovernmentLayout } from '../../components/layout/GovernmentLayout';
import { ApplicationStatusBadge } from '../../components/applications/ApplicationStatusBadge';
import { ApplicationStatusTimeline } from '../../components/applications/ApplicationStatusTimeline';
import { useApplications } from '../../context/ApplicationContext';
import { useAuth } from '../../context/AuthContext';

type ActionType = 'moreInfo' | 'approve' | 'reject' | 'complete' | null;

export const GovernmentRequestDetailPage: React.FC = () => {
  const { applicationId } = useParams<{ applicationId: string }>();
  const navigate = useNavigate();
  const { currentGovUser } = useAuth();
  const { getApplicationById, updateStatus, updateApplication } = useApplications();

  const app = applicationId ? getApplicationById(applicationId) : undefined;

  const [activeAction, setActiveAction] = useState<ActionType>(null);
  const [officerRemark, setOfficerRemark] = useState('');
  const [moreInfoMessage, setMoreInfoMessage] = useState('');
  const [moreInfoDoc, setMoreInfoDoc] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  if (!app) {
    return (
      <GovernmentLayout>
        <div className="text-center py-24">
          <p className="text-sm font-semibold text-slate-500">Application not found.</p>
          <button
            type="button"
            onClick={() => navigate('/government/requests')}
            className="mt-3 text-xs text-primaryBlue underline"
          >
            Back to Requests
          </button>
        </div>
      </GovernmentLayout>
    );
  }

  const isReadOnly = currentGovUser?.officialRole === 'Read-Only / Auditor';
  const officerName = currentGovUser?.fullName || 'Officer';

  const submittedDate = new Date(app.submittedAt).toLocaleDateString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
  });

  const canStartReview = app.status === 'Routed' || app.status === 'Submitted';
  const canAct = app.status === 'Under Review' || app.status === 'More Information Required';
  const canComplete = app.status === 'Approved';

  const handleStartReview = async () => {
    setIsProcessing(true);
    try {
      await updateApplication(app.applicationId, {
        assignedOfficerName: officerName,
        assignedOfficerId: currentGovUser?.employeeId || currentGovUser?.id,
      });
      await updateStatus(
        app.applicationId,
        'Under Review',
        `Review started by ${officerName}.`,
        officerName,
        { id: currentGovUser?.employeeId || 'OFFICER', name: officerName }
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAction = async () => {
    setActionError(null);
    if (activeAction === 'moreInfo') {
      if (!moreInfoMessage.trim()) { setActionError('Please enter a message for the citizen.'); return; }
      setIsProcessing(true);
      try {
        await updateApplication(app.applicationId, {
          moreInfoRequest: { message: moreInfoMessage, requestedDocument: moreInfoDoc || undefined, requestedAt: new Date().toISOString() },
          officerRemarks: officerRemark || undefined,
        });
        await updateStatus(
          app.applicationId,
          'More Information Required',
          'Additional information requested from citizen.',
          officerName,
          { id: currentGovUser?.employeeId || 'OFFICER', name: officerName }
        );
        setActiveAction(null); setMoreInfoMessage(''); setMoreInfoDoc(''); setOfficerRemark('');
      } finally { setIsProcessing(false); }
    }

    if (activeAction === 'approve') {
      setIsProcessing(true);
      try {
        await updateApplication(app.applicationId, { officerRemarks: officerRemark || undefined });
        await updateStatus(
          app.applicationId,
          'Approved',
          officerRemark ? `Approved. Remarks: ${officerRemark}` : 'Approved by officer.',
          officerName,
          { id: currentGovUser?.employeeId || 'OFFICER', name: officerName }
        );
        setActiveAction(null); setOfficerRemark('');
      } finally { setIsProcessing(false); }
    }

    if (activeAction === 'reject') {
      if (!rejectionReason.trim()) { setActionError('Please enter a rejection reason.'); return; }
      setIsProcessing(true);
      try {
        await updateApplication(app.applicationId, { officerRemarks: rejectionReason });
        await updateStatus(
          app.applicationId,
          'Rejected',
          `Rejected: ${rejectionReason}`,
          officerName,
          { id: currentGovUser?.employeeId || 'OFFICER', name: officerName }
        );
        setActiveAction(null); setRejectionReason('');
      } finally { setIsProcessing(false); }
    }

    if (activeAction === 'complete') {
      setIsProcessing(true);
      try {
        await updateApplication(app.applicationId, { officerRemarks: officerRemark || undefined });
        await updateStatus(
          app.applicationId,
          'Completed',
          'Marked as completed by officer.',
          officerName,
          { id: currentGovUser?.employeeId || 'OFFICER', name: officerName }
        );
        setActiveAction(null); setOfficerRemark('');
      } finally { setIsProcessing(false); }
    }
  };

  return (
    <GovernmentLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Back nav */}
        <button
          type="button"
          onClick={() => navigate('/government/requests')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-navy"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Requests
        </button>

        {/* Header */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div>
              <p className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">Application</p>
              <p className="text-2xl font-bold font-mono text-navy">{app.applicationId}</p>
              <p className="text-sm font-semibold text-slate-700 mt-1">{app.purposeLabel}</p>
              <p className="text-xs text-slate-400 mt-0.5">Submitted: {submittedDate}</p>
            </div>
            <ApplicationStatusBadge status={app.status} />
          </div>

          {/* Officer Action Buttons */}
          {!isReadOnly && (
            <div className="mt-5 pt-5 border-t border-slate-100 flex flex-wrap gap-2">
              {canStartReview && (
                <button
                  type="button"
                  onClick={handleStartReview}
                  disabled={isProcessing}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-navy text-white text-xs font-semibold rounded-xl hover:bg-navy/90 disabled:opacity-50"
                >
                  <PlayCircle className="w-4 h-4" /> Start Review
                </button>
              )}
              {(canAct) && (
                <>
                  <button
                    type="button"
                    onClick={() => setActiveAction(activeAction === 'moreInfo' ? null : 'moreInfo')}
                    className={`inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl border transition-colors ${
                      activeAction === 'moreInfo' ? 'bg-orange-100 text-orange-700 border-orange-300' : 'bg-white text-slate-700 border-slate-300 hover:border-orange-300'
                    }`}
                  >
                    <MessageSquare className="w-4 h-4" /> Request More Info
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveAction(activeAction === 'approve' ? null : 'approve')}
                    className={`inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl border transition-colors ${
                      activeAction === 'approve' ? 'bg-emerald-100 text-emerald-700 border-emerald-300' : 'bg-white text-slate-700 border-slate-300 hover:border-emerald-300'
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4" /> Approve
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveAction(activeAction === 'reject' ? null : 'reject')}
                    className={`inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl border transition-colors ${
                      activeAction === 'reject' ? 'bg-red-100 text-red-700 border-red-300' : 'bg-white text-slate-700 border-slate-300 hover:border-red-300'
                    }`}
                  >
                    <XCircle className="w-4 h-4" /> Reject
                  </button>
                </>
              )}
              {canComplete && (
                <button
                  type="button"
                  onClick={() => setActiveAction(activeAction === 'complete' ? null : 'complete')}
                  className={`inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl border transition-colors ${
                    activeAction === 'complete' ? 'bg-teal-100 text-teal-700 border-teal-300' : 'bg-white text-slate-700 border-slate-300 hover:border-teal-300'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" /> Mark Completed
                </button>
              )}
            </div>
          )}

          {/* Action Forms */}
          {activeAction && (
            <div className="mt-4 p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
              {activeAction === 'moreInfo' && (
                <>
                  <p className="text-xs font-bold text-navy">Request More Information from Citizen</p>
                  <textarea
                    rows={3}
                    value={moreInfoMessage}
                    onChange={(e) => setMoreInfoMessage(e.target.value)}
                    placeholder="Message to citizen explaining what information is needed..."
                    className="w-full px-3 py-2 text-xs text-navy bg-white border border-slate-300 rounded-xl focus:border-navy focus:ring-2 focus:ring-navy/10 focus:outline-none resize-none"
                  />
                  <input
                    type="text"
                    value={moreInfoDoc}
                    onChange={(e) => setMoreInfoDoc(e.target.value)}
                    placeholder="Requested document (optional)"
                    className="w-full h-9 px-3 text-xs text-navy bg-white border border-slate-300 rounded-xl focus:border-navy focus:ring-2 focus:ring-navy/10 focus:outline-none"
                  />
                </>
              )}
              {activeAction === 'approve' && (
                <>
                  <p className="text-xs font-bold text-navy">Approve Application</p>
                  <textarea
                    rows={2}
                    value={officerRemark}
                    onChange={(e) => setOfficerRemark(e.target.value)}
                    placeholder="Optional approval remarks..."
                    className="w-full px-3 py-2 text-xs text-navy bg-white border border-slate-300 rounded-xl focus:border-navy focus:ring-2 focus:ring-navy/10 focus:outline-none resize-none"
                  />
                </>
              )}
              {activeAction === 'reject' && (
                <>
                  <p className="text-xs font-bold text-navy">Reject Application</p>
                  <textarea
                    rows={3}
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    placeholder="Reason for rejection (required)..."
                    className="w-full px-3 py-2 text-xs text-navy bg-white border border-slate-300 rounded-xl focus:border-navy focus:ring-2 focus:ring-navy/10 focus:outline-none resize-none"
                  />
                </>
              )}
              {activeAction === 'complete' && (
                <>
                  <p className="text-xs font-bold text-navy">Mark as Completed</p>
                  <textarea
                    rows={2}
                    value={officerRemark}
                    onChange={(e) => setOfficerRemark(e.target.value)}
                    placeholder="Optional completion remarks..."
                    className="w-full px-3 py-2 text-xs text-navy bg-white border border-slate-300 rounded-xl focus:border-navy focus:ring-2 focus:ring-navy/10 focus:outline-none resize-none"
                  />
                </>
              )}
              {actionError && <p className="text-xs text-red-500">{actionError}</p>}
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleAction}
                  disabled={isProcessing}
                  className="px-4 py-2 bg-navy text-white text-xs font-semibold rounded-xl hover:bg-navy/90 disabled:opacity-50"
                >
                  {isProcessing ? 'Processing...' : 'Confirm'}
                </button>
                <button
                  type="button"
                  onClick={() => { setActiveAction(null); setActionError(null); }}
                  className="px-4 py-2 bg-slate-100 text-slate-700 text-xs font-semibold rounded-xl hover:bg-slate-200"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2 space-y-5">
            {/* Citizen Details */}
            <DetailCard icon={<User className="w-4 h-4 text-tealAccent" />} title="Citizen Details">
              <DetailRow label="Name" value={app.citizenName} />
              <DetailRow label="Mobile" value={`+91 ${app.citizenMobile}`} />
              {/* NOTE: Do NOT show Aadhaar */}
            </DetailCard>

            {/* Routing */}
            <DetailCard icon={<Building2 className="w-4 h-4 text-tealAccent" />} title="Routing">
              <DetailRow label="Department" value={app.targetDepartment} />
              <DetailRow label="Primary Role" value={app.targetRole} />
              {app.fallbackRoles.length > 0 && <DetailRow label="Fallback Roles" value={app.fallbackRoles.join(', ')} />}
              {app.collaboratingDepartments.length > 0 && <DetailRow label="Collaborating" value={app.collaboratingDepartments.join(', ')} />}
            </DetailCard>

            {/* Location */}
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
                {Object.entries(app.requestDetails).map(([key, val]) =>
                  key !== '_remarks' && val ? (
                    <DetailRow key={key} label={key.replace(/([A-Z])/g, ' $1').trim()} value={val} />
                  ) : null
                )}
                {app.requestDetails['_remarks'] && (
                  <div className="pt-2 mt-2 border-t border-slate-100">
                    <p className="text-[11px] text-slate-400 font-semibold">Remarks</p>
                    <p className="text-xs text-navy mt-0.5">{app.requestDetails['_remarks']}</p>
                  </div>
                )}
              </DetailCard>
            )}

            {/* Submitted Documents */}
            <DetailCard icon={<Files className="w-4 h-4 text-tealAccent" />} title="Submitted Documents">
              {app.documents.filter((d) => d.uploaded).length === 0 ? (
                <p className="text-xs text-slate-400">No documents submitted.</p>
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

            {/* Citizen More Info Response */}
            {app.moreInfoResponse && (
              <DetailCard icon={<MessageSquare className="w-4 h-4 text-tealAccent" />} title="Citizen Response (More Info)">
                <p className="text-xs text-navy">{app.moreInfoResponse.message}</p>
              </DetailCard>
            )}

            {/* Officer Remarks */}
            {app.officerRemarks && (
              <DetailCard icon={<AlertCircle className="w-4 h-4 text-tealAccent" />} title="Officer Remarks">
                <p className="text-xs text-navy">{app.officerRemarks}</p>
              </DetailCard>
            )}
          </div>

          {/* Timeline */}
          <div>
            <DetailCard icon={<Clock className="w-4 h-4 text-tealAccent" />} title="Status Timeline">
              <ApplicationStatusTimeline history={app.statusHistory} />
            </DetailCard>
          </div>
        </div>
      </div>
    </GovernmentLayout>
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
