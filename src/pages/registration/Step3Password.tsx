import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, ArrowRight, ArrowLeft } from 'lucide-react';
import { AuthLayout } from '../../components/layout/AuthLayout';
import { RegistrationStepper } from '../../components/registration/RegistrationStepper';
import { PasswordField } from '../../components/ui/PasswordField';
import { PasswordStrength } from '../../components/ui/PasswordStrength';
import { Button } from '../../components/ui/Button';
import { useRegistration } from '../../context/RegistrationContext';
import { useAuth } from '../../context/AuthContext';
import { evaluatePassword } from '../../utils/formatters';

export const Step3Password: React.FC = () => {
  const navigate = useNavigate();
  const {
    formData,
    setFormField,
    aadhaarVerified,
    maskedAadhaarDisplay,
    maskedMobileDisplay,
  } = useRegistration();
  const { registerUser } = useAuth();

  const [password, setPassword] = useState(formData.password || '');
  const [confirmPassword, setConfirmPassword] = useState(formData.confirmPassword || '');
  const [touchedConfirm, setTouchedConfirm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // STRICT ROUTE GUARD: Redirect back to Aadhaar step if not verified
  useEffect(() => {
    if (!aadhaarVerified) {
      navigate('/citizen/register/aadhaar', { replace: true });
    }
  }, [aadhaarVerified, navigate]);

  if (!aadhaarVerified) {
    return null;
  }

  const criteria = evaluatePassword(password);
  const passwordsMatch = password.length > 0 && password === confirmPassword;
  const showMismatchError = touchedConfirm && confirmPassword.length > 0 && !passwordsMatch;

  const canCreateAccount = criteria.allValid && passwordsMatch && !isSubmitting;

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setPassword(val);
    setFormField('password', val);
  };

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setConfirmPassword(val);
    setFormField('confirmPassword', val);
  };

  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouchedConfirm(true);

    if (!canCreateAccount) return;

    setIsSubmitting(true);
    // Simulate realistic account provisioning
    await new Promise((resolve) => setTimeout(resolve, 700));

    registerUser({
      fullName: formData.fullName,
      mobile: formData.mobile, // 10 digits as citizen login credential
      password: password,
      email: formData.email || undefined,
      maskedAadhaar: maskedAadhaarDisplay,
      isMinor: formData.isMinor,
      guardian: formData.isMinor ? formData.guardian : undefined,
    });

    setIsSubmitting(false);
    navigate('/citizen/register/success');
  };

  return (
    <AuthLayout>
      <div className="bg-white rounded-card p-6 sm:p-8 border border-slate-200 shadow-card">
        {/* Stepper Progress */}
        <RegistrationStepper currentStep={3} />

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-xl sm:text-2xl font-bold text-navy tracking-tight">
            Secure Your Account
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Step 3 of 4 — Create Password
          </p>
        </div>

        {/* Verified Citizen Identity Banner */}
        <div className="p-3.5 bg-slate-50 border border-slate-200/90 rounded-xl mb-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 text-xs">
          <div>
            <span className="text-slate-500 font-medium">Mobile Number: </span>
            <strong className="text-navy font-mono">{maskedMobileDisplay}</strong>
          </div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#EAF5EB] text-[#2E7D32] border border-[#2E7D32]/20 rounded-full font-semibold">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>✓ Verified Aadhaar ({maskedAadhaarDisplay.slice(-4)})</span>
          </div>
        </div>

        {/* Password Form */}
        <form onSubmit={handleCreateAccount} className="space-y-4" noValidate>
          {/* Create Password */}
          <div>
            <PasswordField
              label="Create Password"
              required
              placeholder="Create a strong password"
              value={password}
              onChange={handlePasswordChange}
              autoFocus
            />

            {/* Dynamic Checklist & Strength Bar */}
            <PasswordStrength password={password} />
          </div>

          {/* Confirm Password */}
          <div>
            <PasswordField
              label="Confirm Password"
              required
              placeholder="Re-enter your password"
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              onBlur={() => setTouchedConfirm(true)}
              error={showMismatchError ? 'Passwords do not match.' : undefined}
            />
            {touchedConfirm && passwordsMatch && (
              <p className="text-xs text-[#2E7D32] flex items-center gap-1 mt-1 font-medium animate-in fade-in">
                <span>✓ Passwords match</span>
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-4">
            <button
              type="button"
              onClick={() => navigate('/citizen/register/aadhaar')}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-navy transition-colors py-2 px-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              disabled={!canCreateAccount}
              isLoading={isSubmitting}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Create Account
            </Button>
          </div>
        </form>
      </div>
    </AuthLayout>
  );
};
