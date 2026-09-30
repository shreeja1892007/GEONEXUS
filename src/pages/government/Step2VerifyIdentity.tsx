import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Upload,
  FileCheck,
  Lock,
  ArrowRight,
  ArrowLeft,
  Clock,
  RotateCw,
  CheckCircle2,
} from 'lucide-react';
import { AuthLayout } from '../../components/layout/AuthLayout';
import { GovernmentRegistrationStepper } from '../../components/government/GovernmentRegistrationStepper';
import { FormField } from '../../components/ui/FormField';
import { OtpInput } from '../../components/ui/OtpInput';
import { Button } from '../../components/ui/Button';
import { AlertBanner } from '../../components/ui/AlertBanner';
import { useGovernmentRegistration } from '../../context/GovernmentRegistrationContext';
import { maskEmail, maskMobile, formatTimer } from '../../utils/formatters';

export const Step2VerifyIdentity: React.FC = () => {
  const navigate = useNavigate();
  const {
    formData,
    setFormField,
    isOtpSent,
    otpValue,
    setOtpValue,
    timerSeconds,
    isOtpExpired,
    otpError,
    otpNotification,
    officialContactVerified,
    sendGovOtp,
    verifyGovOtp,
    resendGovOtp,
    submitAccessRequest,
  } = useGovernmentRegistration();

  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSubmittingRequest, setIsSubmittingRequest] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Email format validation
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.officialEmail.trim());
  // Mobile: exactly 10 digits
  const cleanMobile = formData.officialMobile.replace(/\D/g, '');
  const isMobileValid = cleanMobile.length === 10;
  // Proof document selected
  const hasProof = !!formData.proofFileName;
  // Authorisation checkbox
  const isAuthorised = formData.confirmAuthorisation;

  const canSendOtp = isEmailValid && isMobileValid && hasProof && isAuthorised && !isSendingOtp;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormField('proofFileName', file.name);
    }
  };

  const handleSendOtp = async () => {
    if (!canSendOtp) return;
    setIsSendingOtp(true);
    await new Promise((resolve) => setTimeout(resolve, 550));
    await sendGovOtp();
    setIsSendingOtp(false);
  };

  const handleVerifyOtp = async () => {
    if (otpValue.length !== 6) return;
    setIsVerifying(true);
    await new Promise((resolve) => setTimeout(resolve, 400));
    await verifyGovOtp(otpValue);
    setIsVerifying(false);
  };

  const handleOtpChange = (code: string) => {
    setOtpValue(code);
    if (code.length === 6 && !isOtpExpired) {
      verifyGovOtp(code);
    }
  };

  const handleSubmitRequest = async () => {
    setIsSubmittingRequest(true);
    setSubmitError(null);
    try {
      await submitAccessRequest();
      navigate('/government/register/status');
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Unable to submit the government access request.');
    } finally {
      setIsSubmittingRequest(false);
    }
  };

  const maskedEmailDisplay = maskEmail(formData.officialEmail);
  const maskedMobileDisplay = maskMobile(formData.officialMobile);

  return (
    <AuthLayout>
      <div className="bg-white rounded-card p-6 sm:p-8 border border-slate-200 shadow-card max-w-2xl mx-auto">
        <GovernmentRegistrationStepper currentStep={2} />

        <div className="mb-6">
          <h1 className="text-xl sm:text-2xl font-bold text-navy tracking-tight">
            Verify Official Identity
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Step 2 of 4 — Verification
          </p>
        </div>

        {/* Compact Summary of Previously Entered Official Details */}
        <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl mb-6 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div>
            <span className="text-slate-400 font-medium text-[11px] uppercase">Official</span>
            <p className="font-bold text-navy truncate">{formData.fullName || 'Not provided'}</p>
          </div>
          <div>
            <span className="text-slate-400 font-medium text-[11px] uppercase">Employee ID</span>
            <p className="font-bold text-navy font-mono">{formData.employeeId || 'DLR-EMP-1042'}</p>
          </div>
          <div className="sm:col-span-2">
            <span className="text-slate-400 font-medium text-[11px] uppercase">Department</span>
            <p className="font-bold text-navy truncate">{formData.department}</p>
          </div>
        </div>

        {/* View A: Contact Verified State */}
        {officialContactVerified ? (
          <div className="py-6 text-center animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-full bg-[#EAF5EB] border-2 border-[#2E7D32]/30 flex items-center justify-center text-[#2E7D32] mx-auto mb-5 shadow-sm">
              <CheckCircle2 className="w-9 h-9 stroke-[2.5]" />
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-navy tracking-tight">
              ✓ Official Contact Verified
            </h2>

            {/* Official Summary Card */}
            <div className="my-6 p-5 bg-slate-50 border border-slate-200 rounded-2xl max-w-md mx-auto text-left space-y-2.5 text-xs">
              <div className="flex justify-between pb-2 border-b border-slate-200/70">
                <span className="text-slate-500 font-medium">Employee ID</span>
                <span className="font-mono font-bold text-navy">{formData.employeeId}</span>
              </div>
              <div className="flex justify-between pb-2 border-b border-slate-200/70">
                <span className="text-slate-500 font-medium">Department</span>
                <span className="font-semibold text-navy text-right max-w-[220px] truncate">{formData.department}</span>
              </div>
              <div className="flex justify-between pb-2 border-b border-slate-200/70">
                <span className="text-slate-500 font-medium">Official Role</span>
                <span className="font-semibold text-tealAccent">{formData.officialRole}</span>
              </div>
              <div className="flex justify-between pb-2 border-b border-slate-200/70">
                <span className="text-slate-500 font-medium">Official Email</span>
                <span className="font-mono font-semibold text-slate-700">{maskedEmailDisplay}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Official Mobile</span>
                <span className="font-mono font-semibold text-slate-700">{maskedMobileDisplay}</span>
              </div>
            </div>

            <p className="text-xs text-slate-500 max-w-sm mx-auto mb-6">
              Your contact credentials have been validated. Submit your application for Department Administrator approval.
            </p>

            {submitError && (
              <AlertBanner
                type="error"
                message={submitError}
                onClose={() => setSubmitError(null)}
                className="mb-5 text-left"
              />
            )}

            <div className="flex justify-center">
              <Button
                variant="secondary"
                size="lg"
                onClick={handleSubmitRequest}
                isLoading={isSubmittingRequest}
                rightIcon={<ArrowRight className="w-4 h-4" />}
                className="w-full sm:w-auto min-w-[220px]"
              >
                Submit Access Request
              </Button>
            </div>
          </div>
        ) : (
          /* View B: Form & OTP Input */
          <div className="space-y-5">
            {/* Notification Banners */}
            {otpNotification && (
              <AlertBanner type="success" message={otpNotification} className="mb-2" />
            )}
            {otpError && (
              <AlertBanner type="error" message={otpError} className="mb-2" />
            )}

            {/* Official Email */}
            <FormField
              label="Official Government Email"
              required
              type="email"
              placeholder="e.g. officer@nic.in or officer@tn.gov.in"
              value={formData.officialEmail}
              disabled={isOtpSent}
              onChange={(e) => setFormField('officialEmail', e.target.value)}
              helperText="Official departmental e-mail address"
            />

            {/* Official Mobile Number */}
            <FormField
              label="Official Mobile Number"
              required
              type="tel"
              inputMode="numeric"
              maxLength={10}
              disabled={isOtpSent}
              prefix={<span className="text-navy font-semibold">+91</span>}
              placeholder="98765 44821"
              value={formData.officialMobile}
              onChange={(e) => {
                const clean = e.target.value.replace(/\D/g, '').slice(0, 10);
                setFormField('officialMobile', clean);
              }}
              helperText="Official mobile number registered with department"
            />

            {/* Upload Proof Document */}
            <div className="w-full flex flex-col gap-1.5">
              <label
                htmlFor="gov-proof-upload"
                className="text-xs font-semibold text-[#1D2733] flex items-center gap-1 select-none"
              >
                <span>Upload Official ID / Authorisation Letter</span>
                <span className="text-[#C53A3A] font-bold">*</span>
              </label>

              <div className="p-4 border-2 border-dashed border-slate-300 rounded-xl bg-slate-50/70 hover:bg-slate-50 hover:border-slate-400 transition-colors text-center">
                <input
                  id="gov-proof-upload"
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  disabled={isOtpSent}
                  onChange={handleFileUpload}
                  className="hidden"
                />

                {formData.proofFileName ? (
                  <div className="flex items-center justify-center gap-2 text-xs text-navy font-semibold">
                    <FileCheck className="w-5 h-5 text-tealAccent" />
                    <span className="truncate max-w-xs">{formData.proofFileName}</span>
                    <label
                      htmlFor="gov-proof-upload"
                      className="ml-2 text-[11px] text-primaryBlue underline cursor-pointer hover:text-primaryBlue-hover"
                    >
                      Change
                    </label>
                  </div>
                ) : (
                  <label
                    htmlFor="gov-proof-upload"
                    className="flex flex-col items-center justify-center cursor-pointer select-none"
                  >
                    <Upload className="w-6 h-6 text-slate-400 mb-1.5" />
                    <span className="text-xs font-semibold text-navy">
                      Click to upload Official Document
                    </span>
                    <span className="text-[11px] text-slate-400 mt-0.5">
                      Accepted file types: PDF, JPG, JPEG, PNG
                    </span>
                  </label>
                )}
              </div>
            </div>

            {/* Mandatory Authorisation Checkbox */}
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
              <label className="flex items-start gap-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  disabled={isOtpSent}
                  checked={formData.confirmAuthorisation}
                  onChange={(e) => setFormField('confirmAuthorisation', e.target.checked)}
                  className="w-4 h-4 mt-0.5 rounded border-slate-300 text-navy focus:ring-navy shrink-0 disabled:opacity-50"
                />
                <span className="text-xs text-slate-700 leading-relaxed">
                  I confirm that the information provided belongs to me and I am authorised by my department to request GeoNexus access.
                </span>
              </label>
            </div>

            {/* Send Verification OTP Button (Before OTP is sent) */}
            {!isOtpSent && (
              <div className="pt-2 space-y-3">
                <Button
                  type="button"
                  variant="secondary"
                  size="lg"
                  className="w-full"
                  disabled={!canSendOtp}
                  isLoading={isSendingOtp}
                  onClick={handleSendOtp}
                >
                  Send Verification OTP
                </Button>

                <div className="flex items-center justify-center gap-1.5 text-xs text-slate-500">
                  <Lock className="w-3.5 h-3.5 text-tealAccent" />
                  <span>Dual-channel OTP will be delivered to official email and mobile.</span>
                </div>
              </div>
            )}

            {/* OTP Verification Section (Appears after Send OTP) */}
            {isOtpSent && (
              <div className="pt-4 border-t border-slate-200/80 space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-200">
                <div className="text-center space-y-1">
                  <h3 className="text-sm font-bold text-navy">
                    Enter 6-digit Verification OTP
                  </h3>
                  <div className="text-xs text-slate-500 space-y-0.5">
                    <p>Official Email: <strong className="text-slate-700 font-mono">{maskedEmailDisplay}</strong></p>
                    <p>Official Mobile: <strong className="text-slate-700 font-mono">{maskedMobileDisplay}</strong></p>
                  </div>
                </div>

                {/* 6 OTP Boxes */}
                <OtpInput
                  value={otpValue}
                  onChange={handleOtpChange}
                  disabled={isOtpExpired || isVerifying}
                  hasError={!!otpError}
                />

                {/* Timer */}
                <div className="flex items-center justify-center gap-1.5 text-xs font-mono font-medium text-slate-600">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>OTP valid for:</span>
                  <span className={`font-bold ${timerSeconds <= 20 ? 'text-[#C53A3A]' : 'text-navy'}`}>
                    {formatTimer(timerSeconds)}
                  </span>
                </div>

                {/* Actions */}
                <div className="space-y-3 pt-1">
                  <Button
                    type="button"
                    variant="secondary"
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
                      onClick={resendGovOtp}
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
                    For prototype testing only. No actual departmental dispatch occurs.
                  </p>
                </div>
              </div>
            )}

            {/* Back button */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <button
                type="button"
                onClick={() => navigate('/government/register/official-details')}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-navy transition-colors py-2 px-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Official Details</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </AuthLayout>
  );
};
