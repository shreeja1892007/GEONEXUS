import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Fingerprint,
  Lock,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  RotateCw,
  ShieldCheck,
  Clock,
} from 'lucide-react';
import { AuthLayout } from '../../components/layout/AuthLayout';
import { RegistrationStepper } from '../../components/registration/RegistrationStepper';
import { OtpInput } from '../../components/ui/OtpInput';
import { Button } from '../../components/ui/Button';
import { AlertBanner } from '../../components/ui/AlertBanner';
import { useRegistration } from '../../context/RegistrationContext';
import { formatAadhaarInput, formatTimer } from '../../utils/formatters';

export const Step2Aadhaar: React.FC = () => {
  const navigate = useNavigate();
  const {
    formData,
    setFormField,
    aadhaarVerified,
    maskedAadhaarDisplay,
    isOtpSent,
    otpValue,
    setOtpValue,
    timerSeconds,
    isOtpExpired,
    otpError,
    otpNotification,
    sendOtp,
    verifyOtp,
    resendOtp,
  } = useRegistration();

  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [aadhaarInputError, setAadhaarInputError] = useState<string | null>(null);

  // Unformatted raw digits of Aadhaar (for length check)
  const rawAadhaarDigits = (formData.aadhaar || '').replace(/\D/g, '');
  const isAadhaarValid = rawAadhaarDigits.length === 12;
  const canSendOtp = isAadhaarValid && formData.aadhaarConsent && !isSendingOtp;

  const handleAadhaarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatAadhaarInput(e.target.value);
    setFormField('aadhaar', formatted);
    if (aadhaarInputError) setAadhaarInputError(null);
  };

  const handleSendOtp = async () => {
    if (!isAadhaarValid) {
      setAadhaarInputError('Please enter a valid 12-digit Aadhaar number.');
      return;
    }
    if (!formData.aadhaarConsent) {
      setAadhaarInputError('Please check the consent checkbox to continue.');
      return;
    }

    setIsSendingOtp(true);
    // Simulate realistic network delay
    await new Promise((resolve) => setTimeout(resolve, 500));
    await sendOtp();
    setIsSendingOtp(false);
  };

  const handleVerifyOtp = async () => {
    if (otpValue.length !== 6) return;
    setIsVerifying(true);
    await new Promise((resolve) => setTimeout(resolve, 400));
    await verifyOtp(otpValue);
    setIsVerifying(false);
  };

  const handleOtpChange = (code: string) => {
    setOtpValue(code);
    // Auto-verify when all 6 digits entered
    if (code.length === 6 && !isOtpExpired) {
      verifyOtp(code);
    }
  };

  return (
    <AuthLayout>
      <div className="bg-white rounded-card p-6 sm:p-8 border border-slate-200 shadow-card">
        {/* Stepper Progress */}
        <RegistrationStepper currentStep={2} />

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-xl sm:text-2xl font-bold text-navy tracking-tight">
            Verify Your Identity
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Step 2 of 4 — Aadhaar Verification
          </p>
        </div>

        {/* View 1: SUCCESSFUL AADHAAR VERIFICATION STATE */}
        {aadhaarVerified ? (
          <div className="py-6 text-center animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-full bg-[#EAF5EB] border-2 border-[#2E7D32]/30 flex items-center justify-center text-[#2E7D32] mx-auto mb-5 shadow-sm">
              <CheckCircle2 className="w-9 h-9 stroke-[2.5]" />
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-navy tracking-tight">
              Aadhaar Successfully Verified
            </h2>

            <div className="my-5 p-4 bg-slate-50 border border-slate-200 rounded-xl max-w-sm mx-auto text-center">
              <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">
                Aadhaar Number
              </p>
              <p className="text-lg font-mono font-bold text-navy mt-1 tracking-wider">
                {maskedAadhaarDisplay}
              </p>
              <div className="mt-2 inline-flex items-center gap-1 text-[11px] font-semibold text-[#2E7D32]">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>UIDAI Simulated Authentication</span>
              </div>
            </div>

            <p className="text-sm font-medium text-slate-700">
              Identity verification completed.
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Your identity has been authenticated against the National Population Register.
            </p>

            <div className="mt-8 pt-6 border-t border-slate-100 flex justify-end">
              <Button
                variant="primary"
                size="lg"
                onClick={() => navigate('/citizen/register/password')}
                rightIcon={<ArrowRight className="w-4 h-4" />}
                className="w-full sm:w-auto"
              >
                Continue
              </Button>
            </div>
          </div>
        ) : (
          /* View 2: AADHAAR INPUT & SIMULATED OTP FLOW */
          <div className="space-y-5">
            {/* Notifications / Errors */}
            {otpNotification && (
              <AlertBanner
                type="success"
                message={otpNotification}
                className="mb-2"
              />
            )}

            {otpError && (
              <AlertBanner
                type="error"
                message={otpError}
                className="mb-2"
              />
            )}

            {/* Aadhaar Input Section */}
            <div className="space-y-3">
              <div className="w-full flex flex-col gap-1.5">
                <label
                  htmlFor="aadhaar-number"
                  className="text-xs font-semibold text-[#1D2733] flex items-center gap-1"
                >
                  <span>Aadhaar Number</span>
                  <span className="text-[#C53A3A] font-bold">*</span>
                </label>

                <div className="relative flex items-center w-full rounded-xl border border-slate-300 bg-white hover:border-slate-400 focus-within:border-[#246BCE] focus-within:ring-2 focus-within:ring-[#246BCE]/20 transition-all">
                  <div className="pl-3.5 pr-2 text-slate-400">
                    <Fingerprint className="w-5 h-5 text-primaryBlue" />
                  </div>
                  <input
                    id="aadhaar-number"
                    type="text"
                    inputMode="numeric"
                    disabled={isOtpSent}
                    placeholder="XXXX XXXX XXXX"
                    value={formData.aadhaar}
                    onChange={handleAadhaarChange}
                    maxLength={14} // 12 digits + 2 spaces
                    className="w-full h-11 pr-4 text-sm font-mono tracking-wider text-[#1D2733] placeholder:text-slate-400 bg-transparent focus:outline-none disabled:bg-slate-50 disabled:text-slate-500 rounded-xl"
                  />
                </div>
                {aadhaarInputError && (
                  <p className="text-xs text-[#C53A3A] mt-0.5">{aadhaarInputError}</p>
                )}
                <p className="text-[11px] text-slate-500">
                  Enter 12-digit UIDAI Aadhaar number
                </p>
              </div>

              {/* Mandatory Consent Checkbox */}
              <div className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-xl">
                <label className="flex items-start gap-2.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    disabled={isOtpSent}
                    checked={formData.aadhaarConsent}
                    onChange={(e) => setFormField('aadhaarConsent', e.target.checked)}
                    className="w-4 h-4 mt-0.5 rounded border-slate-300 text-primaryBlue focus:ring-primaryBlue shrink-0 disabled:opacity-50"
                  />
                  <span className="text-xs text-slate-700 leading-relaxed">
                    I consent to Aadhaar authentication for identity verification. I understand this is used solely to verify my identity for GeoNexus governance services.
                  </span>
                </label>
              </div>

              {/* Send OTP Button (Only before OTP is sent) */}
              {!isOtpSent && (
                <div className="pt-2 space-y-3">
                  <Button
                    type="button"
                    variant="primary"
                    size="lg"
                    className="w-full"
                    disabled={!canSendOtp}
                    isLoading={isSendingOtp}
                    onClick={handleSendOtp}
                  >
                    Send OTP
                  </Button>

                  <div className="flex items-center justify-center gap-1.5 text-xs text-slate-500">
                    <Lock className="w-3.5 h-3.5 text-tealAccent" />
                    <span>OTP will be sent to the mobile number registered with Aadhaar.</span>
                  </div>
                </div>
              )}
            </div>

            {/* OTP Verification Section (Appears after Send OTP) */}
            {isOtpSent && (
              <div className="pt-4 border-t border-slate-200/80 space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-200">
                <div className="text-center space-y-1">
                  <h3 className="text-sm font-bold text-navy">
                    Enter 6-digit OTP
                  </h3>
                  <p className="text-xs text-slate-500">
                    Sent to Aadhaar-linked mobile ending •••• {formData.mobile.slice(-4) || '4821'}
                  </p>
                </div>

                {/* 6 OTP Boxes */}
                <OtpInput
                  value={otpValue}
                  onChange={handleOtpChange}
                  disabled={isOtpExpired || isVerifying}
                  hasError={!!otpError}
                />

                {/* Countdown Timer */}
                <div className="flex items-center justify-center gap-1.5 text-xs font-mono font-medium text-slate-600">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>OTP valid for:</span>
                  <span className={`font-bold ${timerSeconds <= 20 ? 'text-[#C53A3A]' : 'text-navy'}`}>
                    {formatTimer(timerSeconds)}
                  </span>
                </div>

                {/* Actions: Verify OTP & Resend OTP */}
                <div className="space-y-3 pt-1">
                  <Button
                    type="button"
                    variant="primary"
                    size="lg"
                    className="w-full"
                    disabled={otpValue.length !== 6 || isOtpExpired || isVerifying}
                    isLoading={isVerifying}
                    onClick={handleVerifyOtp}
                  >
                    Verify OTP
                  </Button>

                  <div className="flex items-center justify-center gap-2 text-xs text-slate-600">
                    <span>Didn't receive OTP?</span>
                    <button
                      type="button"
                      onClick={resendOtp}
                      className="font-semibold text-primaryBlue hover:underline inline-flex items-center gap-1 focus:outline-none"
                    >
                      <RotateCw className="w-3 h-3" />
                      <span>Resend OTP</span>
                    </button>
                  </div>
                </div>

                {/* Prototype Demo Hint */}
                <div className="p-3 bg-amber-50/80 border border-amber-200/80 rounded-xl text-center text-xs text-amber-900">
                  <p className="font-medium">
                    <span className="font-bold uppercase tracking-wider text-[10px] bg-amber-200/80 px-1.5 py-0.5 rounded mr-1">
                      Prototype only
                    </span>
                    Demo OTP: <strong className="font-mono text-sm text-navy ml-1">123456</strong>
                  </p>
                  <p className="text-[11px] text-amber-700/80 mt-0.5">
                    For testing purposes only. No actual SMS or UIDAI request is initiated.
                  </p>
                </div>
              </div>
            )}

            {/* Back to Step 1 */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <button
                type="button"
                onClick={() => navigate('/citizen/register/personal')}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-navy transition-colors py-2 px-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Personal Details</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </AuthLayout>
  );
};
