import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, ArrowRight, ShieldCheck } from 'lucide-react';
import { AuthLayout } from '../../components/layout/AuthLayout';
import { Button } from '../../components/ui/Button';
import { useGovernmentRegistration } from '../../context/GovernmentRegistrationContext';

export const Step5GovAccountSuccess: React.FC = () => {
  const navigate = useNavigate();
  const { formData, resetGovRegistration } = useGovernmentRegistration();

  const handleGoToLogin = () => {
    resetGovRegistration();
    navigate('/government/login');
  };

  const displayEmployeeId = formData.employeeId || 'DLR-EMP-1042';
  const displayDepartment = formData.department || 'Department of Land Resources';
  const displayRole = formData.officialRole || 'Land Records Officer';

  return (
    <AuthLayout>
      <div className="bg-white rounded-card p-6 sm:p-10 border border-slate-200 shadow-card text-center max-w-lg mx-auto">
        {/* Large Celebratory Checkmark */}
        <div className="w-20 h-20 rounded-full bg-[#EAF5EB] border-4 border-[#2E7D32]/20 flex items-center justify-center text-[#2E7D32] mx-auto mb-6 shadow-sm animate-in zoom-in-90 duration-300">
          <CheckCircle2 className="w-11 h-11 stroke-[2.5]" />
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-tealAccent-light text-tealAccent text-xs font-semibold mb-3">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>NIC Digital Government Identity</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold text-navy tracking-tight">
          Government Account Activated
        </h1>

        <p className="mt-2 text-xs sm:text-sm text-slate-600 max-w-sm mx-auto leading-relaxed">
          Your departmental credentials have been provisioned and your GeoNexus official access is now active.
        </p>

        {/* Official Summary Card */}
        <div className="my-7 p-5 bg-slate-50 border border-slate-200 rounded-2xl text-left space-y-3 text-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200/70">
            <span className="text-slate-500 font-medium">Employee ID</span>
            <span className="font-mono font-bold text-navy text-sm">
              {displayEmployeeId}
            </span>
          </div>

          <div className="flex items-center justify-between pb-3 border-b border-slate-200/70">
            <span className="text-slate-500 font-medium">Department</span>
            <span className="font-semibold text-navy text-right max-w-[220px] truncate">
              {displayDepartment}
            </span>
          </div>

          <div className="flex items-center justify-between pb-3 border-b border-slate-200/70">
            <span className="text-slate-500 font-medium">Assigned Role</span>
            <span className="font-semibold text-[#2E7D32]">
              {displayRole}
            </span>
          </div>

          <div className="flex items-center justify-between text-[11px]">
            <span className="text-slate-500 font-medium">Login Identifier</span>
            <span className="text-slate-700 font-medium">Department + Employee ID</span>
          </div>
        </div>

        {/* Go to Login Button */}
        <div>
          <Button
            type="button"
            variant="secondary"
            size="lg"
            className="w-full"
            onClick={handleGoToLogin}
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            Go to Government Login
          </Button>
          <p className="text-[11px] text-slate-400 mt-3">
            Department and Employee ID will be pre-filled on the login screen.
          </p>
        </div>
      </div>
    </AuthLayout>
  );
};
