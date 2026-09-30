import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, ArrowRight, ShieldCheck } from 'lucide-react';
import { AuthLayout } from '../../components/layout/AuthLayout';
import { RegistrationStepper } from '../../components/registration/RegistrationStepper';
import { Button } from '../../components/ui/Button';
import { useRegistration } from '../../context/RegistrationContext';

export const Step4Success: React.FC = () => {
  const navigate = useNavigate();
  const {
    maskedMobileDisplay,
    maskedAadhaarDisplay,
    resetRegistration,
  } = useRegistration();

  const handleGoToLogin = () => {
    resetRegistration();
    navigate('/citizen/login');
  };

  return (
    <AuthLayout>
      <div className="bg-white rounded-card p-6 sm:p-10 border border-slate-200 shadow-card text-center">
        {/* Stepper Progress */}
        <RegistrationStepper currentStep={4} />

        {/* Celebratory Checkmark */}
        <div className="w-20 h-20 rounded-full bg-[#EAF5EB] border-4 border-[#2E7D32]/20 flex items-center justify-center text-[#2E7D32] mx-auto mb-6 shadow-sm animate-in zoom-in-90 duration-300">
          <CheckCircle2 className="w-11 h-11 stroke-[2.5]" />
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold text-navy tracking-tight">
          Account Created Successfully
        </h1>

        <p className="mt-2 text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
          Your GeoNexus Citizen Account is ready to use.
        </p>

        {/* Verification Summary Card */}
        <div className="my-8 p-5 bg-slate-50/90 border border-slate-200/90 rounded-2xl max-w-md mx-auto text-left space-y-3.5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200/70 text-xs">
            <span className="text-slate-500 font-medium">Registered Mobile</span>
            <span className="font-mono font-bold text-navy text-sm">
              {maskedMobileDisplay}
            </span>
          </div>

          <div className="flex items-center justify-between pb-3 border-b border-slate-200/70 text-xs">
            <span className="text-slate-500 font-medium">Aadhaar Verification</span>
            <span className="inline-flex items-center gap-1 font-semibold text-[#2E7D32]">
              <ShieldCheck className="w-4 h-4" />
              <span>✓ Verified ({maskedAadhaarDisplay})</span>
            </span>
          </div>

          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500 font-medium">Authentication Method</span>
            <span className="text-slate-700 font-medium">Mobile Number + Password</span>
          </div>
        </div>

        {/* Primary Action */}
        <div className="max-w-md mx-auto">
          <Button
            type="button"
            variant="primary"
            size="lg"
            className="w-full"
            onClick={handleGoToLogin}
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            Go to Citizen Login
          </Button>
          <p className="text-[11px] text-slate-400 mt-3">
            Your registered mobile number will be pre-filled on the login screen.
          </p>
        </div>
      </div>
    </AuthLayout>
  );
};
