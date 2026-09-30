import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  CheckCircle2,
  Clock3,
  RefreshCw,
  ShieldCheck,
  UserCheck,
  XCircle,
  Mail,
  Phone,
  Building2,
  MapPin,
  BadgeCheck,
} from 'lucide-react';
import { GovernmentLayout } from '../../components/layout/GovernmentLayout';
import { AlertBanner } from '../../components/ui/AlertBanner';
import { useAuth } from '../../context/AuthContext';
import {
  listGovernmentAccessRequests,
  reviewGovernmentAccessRequest,
  type GovernmentAccessRequestRecord,
} from '../../services/governmentAccessService';

type Filter = 'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED';

export const AdminGovernmentAccessPage: React.FC = () => {
  const { currentGovUser } = useAuth();
  const [requests, setRequests] = useState<GovernmentAccessRequestRecord[]>([]);
  const [filter, setFilter] = useState<Filter>('PENDING');
  const [loading, setLoading] = useState(true);
  const [reviewingId, setReviewingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [rejecting, setRejecting] = useState<GovernmentAccessRequestRecord | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');

  const loadRequests = useCallback(async () => {
    if (!currentGovUser) return;
    setLoading(true);
    setError(null);
    try {
      const data = await listGovernmentAccessRequests(currentGovUser, 'ALL');
      setRequests(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load access requests.');
    } finally {
      setLoading(false);
    }
  }, [currentGovUser]);

  useEffect(() => {
    void loadRequests();
  }, [loadRequests]);

  const counts = useMemo(
    () => ({
      ALL: requests.length,
      PENDING: requests.filter((r) => r.status === 'PENDING').length,
      APPROVED: requests.filter((r) => r.status === 'APPROVED').length,
      REJECTED: requests.filter((r) => r.status === 'REJECTED').length,
    }),
    [requests]
  );

  const visibleRequests = useMemo(
    () => (filter === 'ALL' ? requests : requests.filter((r) => r.status === filter)),
    [filter, requests]
  );

  const handleApprove = async (request: GovernmentAccessRequestRecord) => {
    if (!currentGovUser) return;
    setReviewingId(request.request_id);
    setError(null);
    setSuccess(null);
    try {
      await reviewGovernmentAccessRequest(currentGovUser, request.request_id, 'APPROVED');
      setSuccess(`${request.full_name} has been approved. The official can now create a password.`);
      await loadRequests();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Approval failed.');
    } finally {
      setReviewingId(null);
    }
  };

  const handleReject = async () => {
    if (!currentGovUser || !rejecting || !rejectionReason.trim()) return;
    setReviewingId(rejecting.request_id);
    setError(null);
    setSuccess(null);
    try {
      await reviewGovernmentAccessRequest(
        currentGovUser,
        rejecting.request_id,
        'REJECTED',
        rejectionReason.trim()
      );
      setSuccess(`${rejecting.full_name}'s access request has been rejected.`);
      setRejecting(null);
      setRejectionReason('');
      await loadRequests();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Rejection failed.');
    } finally {
      setReviewingId(null);
    }
  };

  return (
    <GovernmentLayout>
      <div className="space-y-5">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-navy text-white flex items-center justify-center shrink-0">
              <UserCheck className="w-6 h-6 text-tealAccent-light" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl font-bold text-navy">Government Access Administration</h1>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold uppercase tracking-wide">
                  <ShieldCheck className="w-3 h-3" /> Admin Only
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1 max-w-2xl">
                Review new government-official registrations. Approval is required before an official can create a password and sign in.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => void loadRequests()}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-navy hover:bg-slate-50 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Refresh
          </button>
        </div>

        {error && <AlertBanner type="error" message={error} onClose={() => setError(null)} />}
        {success && <AlertBanner type="success" message={success} onClose={() => setSuccess(null)} />}

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <Stat label="Pending" value={counts.PENDING} icon={<Clock3 className="w-4 h-4" />} />
          <Stat label="Approved" value={counts.APPROVED} icon={<CheckCircle2 className="w-4 h-4" />} />
          <Stat label="Rejected" value={counts.REJECTED} icon={<XCircle className="w-4 h-4" />} />
          <Stat label="Total Requests" value={counts.ALL} icon={<UserCheck className="w-4 h-4" />} />
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-bold text-navy">Official Registration Requests</h2>
              <p className="text-[11px] text-slate-400 mt-0.5">Live approval queue from Supabase</p>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {(['PENDING', 'APPROVED', 'REJECTED', 'ALL'] as Filter[]).map((item) => (
                <button
                  type="button"
                  key={item}
                  onClick={() => setFilter(item)}
                  className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold border transition-colors ${
                    filter === item
                      ? 'bg-navy text-white border-navy'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {item === 'ALL' ? 'All' : item[0] + item.slice(1).toLowerCase()} ({counts[item]})
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="py-16 text-center text-sm text-slate-400">Loading government access requests...</div>
          ) : visibleRequests.length === 0 ? (
            <div className="py-16 text-center">
              <BadgeCheck className="w-10 h-10 text-slate-300 mx-auto mb-3" />
              <p className="text-sm font-semibold text-slate-500">No {filter.toLowerCase()} requests.</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {visibleRequests.map((request) => (
                <RequestCard
                  key={request.id}
                  request={request}
                  busy={reviewingId === request.request_id}
                  onApprove={() => void handleApprove(request)}
                  onReject={() => {
                    setRejecting(request);
                    setRejectionReason('');
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {rejecting && (
        <div className="fixed inset-0 z-50 bg-navy/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-2xl border border-slate-200 shadow-2xl p-6">
            <h3 className="text-lg font-bold text-navy">Reject Government Access</h3>
            <p className="text-xs text-slate-500 mt-1">
              Give a reason for rejecting <strong>{rejecting.full_name}</strong> ({rejecting.employee_id}).
            </p>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              rows={4}
              autoFocus
              placeholder="e.g. Employee details could not be verified."
              className="mt-4 w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy resize-none"
            />
            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setRejecting(null);
                  setRejectionReason('');
                }}
                className="px-4 py-2 text-xs font-semibold rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => void handleReject()}
                disabled={!rejectionReason.trim() || reviewingId === rejecting.request_id}
                className="px-4 py-2 text-xs font-semibold rounded-xl bg-red-600 text-white hover:bg-red-500 disabled:opacity-40"
              >
                Reject Request
              </button>
            </div>
          </div>
        </div>
      )}
    </GovernmentLayout>
  );
};

function Stat({ label, value, icon }: { label: string; value: number; icon: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 flex items-center gap-3">
      <div className="w-9 h-9 rounded-xl bg-slate-100 text-navy flex items-center justify-center">{icon}</div>
      <div>
        <p className="text-xl font-bold text-navy leading-none">{value}</p>
        <p className="text-[11px] text-slate-500 mt-1">{label}</p>
      </div>
    </div>
  );
}

function RequestCard({
  request,
  busy,
  onApprove,
  onReject,
}: {
  request: GovernmentAccessRequestRecord;
  busy: boolean;
  onApprove: () => void;
  onReject: () => void;
}) {
  return (
    <div className="p-4 sm:p-5 hover:bg-slate-50/60 transition-colors">
      <div className="flex flex-col xl:flex-row xl:items-center gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-sm font-bold text-navy">{request.full_name}</h3>
            <StatusBadge status={request.status} />
            <code className="text-[10px] font-mono px-2 py-0.5 bg-slate-100 border border-slate-200 rounded text-slate-600">
              {request.request_id}
            </code>
          </div>

          <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-5 gap-y-2 text-[11px] text-slate-600">
            <Info icon={<BadgeCheck className="w-3.5 h-3.5" />} label="Employee ID" value={request.employee_id} mono />
            <Info icon={<Building2 className="w-3.5 h-3.5" />} label="Department" value={request.department} />
            <Info icon={<ShieldCheck className="w-3.5 h-3.5" />} label="Role" value={request.official_role} />
            <Info icon={<MapPin className="w-3.5 h-3.5" />} label="Office" value={`${request.district_office || '—'}, ${request.state}`} />
            <Info icon={<Mail className="w-3.5 h-3.5" />} label="Email" value={request.official_email} />
            <Info icon={<Phone className="w-3.5 h-3.5" />} label="Mobile" value={request.official_mobile} />
          </div>

          <p className="mt-2 text-[10px] text-slate-400">
            Submitted {new Date(request.submitted_at).toLocaleString()}
            {request.reviewed_by ? ` · Reviewed by ${request.reviewed_by}` : ''}
          </p>
          {request.rejection_reason && (
            <p className="mt-2 text-[11px] text-red-700 bg-red-50 border border-red-100 rounded-lg px-2.5 py-2">
              <strong>Reason:</strong> {request.rejection_reason}
            </p>
          )}
        </div>

        {request.status === 'PENDING' && (
          <div className="flex xl:flex-col gap-2 shrink-0">
            <button
              type="button"
              onClick={onApprove}
              disabled={busy}
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-500 disabled:opacity-50"
            >
              <CheckCircle2 className="w-4 h-4" /> Approve
            </button>
            <button
              type="button"
              onClick={onReject}
              disabled={busy}
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-red-200 text-red-600 text-xs font-semibold hover:bg-red-50 disabled:opacity-50"
            >
              <XCircle className="w-4 h-4" /> Reject
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function Info({ icon, label, value, mono = false }: { icon: React.ReactNode; label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex items-start gap-2 min-w-0">
      <span className="text-slate-400 mt-0.5">{icon}</span>
      <div className="min-w-0">
        <span className="text-slate-400">{label}</span>
        <p className={`${mono ? 'font-mono ' : ''}font-semibold text-slate-700 truncate`} title={value}>{value}</p>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: GovernmentAccessRequestRecord['status'] }) {
  const classes =
    status === 'APPROVED'
      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
      : status === 'REJECTED'
      ? 'bg-red-50 text-red-700 border-red-200'
      : 'bg-amber-50 text-amber-700 border-amber-200';
  return <span className={`px-2 py-0.5 rounded-full border text-[10px] font-bold ${classes}`}>{status}</span>;
}
