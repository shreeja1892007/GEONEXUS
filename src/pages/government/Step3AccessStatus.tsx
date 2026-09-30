import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Clock,
  CheckCircle2,
  XCircle,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  RotateCw,
  UserCheck,
} from 'lucide-react';
import { AuthLayout } from '../../components/layout/AuthLayout';
import { GovernmentRegistrationStepper } from '../../components/government/GovernmentRegistrationStepper';
import { Button } from '../../components/ui/Button';
import { AlertBanner } from '../../components/ui/AlertBanner';
import { useGovernmentRegistration } from '../../context/GovernmentRegistrationContext';

export const Step3AccessStatus: React.FC = () => {
  const navigate = useNavigate();
  const { formData, refreshAccessStatus, resetGovRegistration } = useGovernmentRegistration();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [statusError, setStatusError] = useState<string | null>(null);

  const displayRequestId = formData.requestId || 'Not submitted';
  const displayDepartment = formData.department || 'Department of Land Resources';
  const displayRole = formData.officialRole || 'Land Records Officer';
  const displayEmployeeId = formData.employeeId || 'Not provided';

  useEffect(() => {
    if (!formData.requestId || !formData.employeeId) {
      navigate('/government/register/verification', { replace: true });
      return;
    }

    void refreshAccessStatus().catch((error) => {
      setStatusError(error instanceof Error ? error.message : 'Unable to check request status.');
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (formData.accessStatus !== 'pending' || !formData.requestId) return;

    const timer = window.setInterval(() => {
      void refreshAccessStatus().catch(() => {
        // Keep the current status; manual refresh will surface any error.
      });
    }, 5000);

    return () => window.clearInterval(timer);
  }, [formData.accessStatus, formData.requestId, refreshAccessStatus]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    setStatusError(null);
    try {
      await refreshAccessStatus();
    } catch (error) {
      setStatusError(error instanceof Error ? error.message : 'Unable to check request status.');
    } finally {
      setIsRefreshing(false);
    }
  };

  const startNewApplication = () => {
    resetGovRegistration();
    navigate('/government/register/official-details');
  };

  return (
    <AuthLayout>
      <div className="bg-white rounded-card p-6 sm:p-8 border border-slate-200 shadow-card max-w-2xl mx-auto">
        <GovernmentRegistrationStepper currentStep={3} />

        {statusError && (
          <AlertBanner
            type="error"
            message={statusError}
            onClose={() => setStatusError(null)}
            className="mb-5"
          />
        )}

        {formData.accessStatus === 'rejected' ? (
          <div className="text-center py-4 animate-in fade-in duration-200">
            <div className="w-16 h-16 rounded-full bg-red-50 border-2 border-[#C53A3A]/30 flex items-center justify-center text-[#C53A3A] mx-auto mb-4">
              <XCircle className="w-9 h-9 stroke-[2.5]" />
            </div>

            <h1 className="text-2xl font-bold text-navy tracking-tight">Access Request Rejected</h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              The administrator reviewed and declined this government access request.
            </p>

            <div className="my-6 p-5 bg-red-50/50 border border-red-200 rounded-2xl max-w-md mx-auto text-left space-y-3 text-xs">
              <Row label="Request ID" value={displayRequestId} mono />
              <Row label="Employee ID" value={displayEmployeeId} mono />
              <Row label="Department" value={displayDepartment} />
              <Row label="Requested Role" value={displayRole} />
              <div className="pt-1">
                <span className="text-slate-600 font-medium">Rejection Reason</span>
                <p className="text-[#C53A3A] font-semibold mt-1 p-2 bg-white rounded-lg border border-red-200">
                  {formData.rejectionReason || 'The request did not pass administrator verification.'}
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button
                variant="outline"
                size="md"
                onClick={() => navigate('/government/login')}
                leftIcon={<ArrowLeft className="w-4 h-4" />}
              >
                Return to Login
              </Button>
              <Button variant="secondary" size="md" onClick={startNewApplication}>
                Start New Application
              </Button>
            </div>
          </div>
        ) : formData.accessStatus === 'approved' ? (
          <div className="text-center py-4 animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-full bg-[#EAF5EB] border-2 border-[#2E7D32]/30 flex items-center justify-center text-[#2E7D32] mx-auto mb-4 shadow-sm">
              <CheckCircle2 className="w-9 h-9 stroke-[2.5]" />
            </div>

            <h1 className="text-2xl font-bold text-navy tracking-tight">Government Access Approved</h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-md mx-auto">
              The administrator approved your GeoNexus government access request.
            </p>

            <div className="my-6 p-5 bg-slate-50 border border-slate-200 rounded-2xl max-w-md mx-auto text-left space-y-3 text-xs">
              <Row label="Request ID" value={displayRequestId} mono />
              <Row label="Employee ID" value={displayEmployeeId} mono />
              <Row label="Department" value={displayDepartment} />
              <Row label="Assigned Role" value={displayRole} success />
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Approval Status</span>
                <span className="inline-flex items-center gap-1 font-bold text-[#2E7D32]">
                  <ShieldCheck className="w-3.5 h-3.5" /> Approved
                </span>
              </div>
            </div>

            <Button
              variant="secondary"
              size="lg"
              onClick={() => navigate('/government/register/password')}
              rightIcon={<ArrowRight className="w-4 h-4" />}
              className="w-full sm:w-auto min-w-[220px]"
            >
              Create Password
            </Button>
          </div>
        ) : (
          <div>
            <div className="mb-6">
              <h1 className="text-xl sm:text-2xl font-bold text-navy tracking-tight">Access Request Sent</h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Your request is now waiting in the GeoNexus Admin Dashboard.
              </p>
            </div>

            <div className="p-5 bg-slate-50/90 border border-slate-200 rounded-2xl mb-6 space-y-3 text-xs">
              <Row label="Request ID" value={displayRequestId} mono />
              <Row label="Employee ID" value={displayEmployeeId} mono />
              <Row label="Department" value={displayDepartment} />
              <Row label="Requested Role" value={displayRole} />
              <div className="flex items-center justify-between pt-1">
                <span className="text-slate-500 font-medium">Status</span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#FEF6E9] text-[#965A08] border border-[#E99A24]/30 rounded-full font-bold">
                  <Clock className="w-3.5 h-3.5 text-[#E99A24]" /> Pending Approval
                </span>
              </div>
            </div>

            <div className="p-4 bg-blue-50/50 border border-blue-100 rounded-xl text-xs text-slate-600 leading-relaxed mb-6 flex gap-3">
              <UserCheck className="w-5 h-5 text-primaryBlue shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-navy">Administrator verification required</p>
                <p className="mt-1">
                  An authorised State/System Administrator must approve this request before you can create a password and log in.
                </p>
                <p className="mt-1 text-slate-500">This page checks for approval automatically every few seconds.</p>
              </div>
            </div>

            <div className="flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => navigate('/government/login')}
                className="text-xs font-semibold text-slate-500 hover:text-navy transition-colors py-2 px-1"
              >
                Return to Login
              </button>

              <Button
                variant="outline"
                size="md"
                onClick={handleRefresh}
                isLoading={isRefreshing}
                leftIcon={<RotateCw className="w-3.5 h-3.5" />}
              >
                Check Approval Status
              </Button>
            </div>
          </div>
        )}
      </div>
    </AuthLayout>
  );
};

function Row({
  label,
  value,
  mono = false,
  success = false,
}: {
  label: string;
  value: string;
  mono?: boolean;
  success?: boolean;
}) {
  return (
    <div className="flex justify-between gap-4 pb-2 border-b border-slate-200/70 last:border-0 last:pb-0">
      <span className="text-slate-500 font-medium shrink-0">{label}</span>
      <span
        className={`${mono ? 'font-mono ' : ''}${
          success ? 'text-[#2E7D32]' : 'text-navy'
        } font-semibold text-right`}
      >
        {value}
      </span>
    </div>
  );
}
