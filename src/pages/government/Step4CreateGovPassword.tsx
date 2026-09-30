import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, ArrowRight, ArrowLeft } from 'lucide-react';
import { AuthLayout } from '../../components/layout/AuthLayout';
import { GovernmentRegistrationStepper } from '../../components/government/GovernmentRegistrationStepper';
import { PasswordField } from '../../components/ui/PasswordField';
import { PasswordStrength } from '../../components/ui/PasswordStrength';
import { Button } from '../../components/ui/Button';
import { useGovernmentRegistration } from '../../context/GovernmentRegistrationContext';
import { useAuth } from '../../context/AuthContext';
import { evaluatePassword } from '../../utils/formatters';

export const Step4CreateGovPassword: React.FC = () => {
  const navigate = useNavigate();
  const { formData, setFormField } = useGovernmentRegistration();
  const { registerGovUser } = useAuth();

  const [password, setPassword] = useState(formData.password || '');
  const [confirmPassword, setConfirmPassword] = useState(formData.confirmPassword || '');
  const [touchedConfirm, setTouchedConfirm] = useState(false);
  const [isActivating, setIsActivating] = useState(false);

  // STRICT ROUTE GUARD: Redirect back to request status page if NOT approved
  useEffect(() => {
    if (formData.accessStatus !== 'approved') {
      navigate('/government/register/status', { replace: true });
    }
  }, [formData.accessStatus, navigate]);

  if (formData.accessStatus !== 'approved') {
    return null;
  }

  const criteria = evaluatePassword(password);
  const passwordsMatch = password.length > 0 && password === confirmPassword;
  const showMismatchError = touchedConfirm && confirmPassword.length > 0 && !passwordsMatch;

  const canActivateAccount = criteria.allValid && passwordsMatch && !isActivating;

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

  const handleActivateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouchedConfirm(true);

    if (!canActivateAccount) return;

    setIsActivating(true);
    // Simulate credential cryptographic provisioning
    await new Promise((resolve) => setTimeout(resolve, 750));

    registerGovUser({
      fullName: formData.fullName || 'Official User',
      employeeId: formData.employeeId || 'DLR-EMP-1042',
      department: formData.department || 'Department of Land Resources',
      designation: formData.designation || 'Revenue Officer',
      officialRole: formData.officialRole || 'Land Records Officer',
      state: formData.state || 'Delhi (NCT)',
      districtOffice: formData.districtOffice || 'HQ Office',
      officialEmail: formData.officialEmail || 'officer@gov.in',
      officialMobile: formData.officialMobile || '9876544821',
      password: password,
    });

    setIsActivating(false);
    navigate('/government/register/success');
  };

  return (
    <AuthLayout>
      <div className="bg-white rounded-card p-6 sm:p-8 border border-slate-200 shadow-card max-w-2xl mx-auto">
        <GovernmentRegistrationStepper currentStep={4} />

        <div className="mb-6">
          <h1 className="text-xl sm:text-2xl font-bold text-navy tracking-tight">
            Secure Your Government Account
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Step 4 of 4 — Create Password
          </p>
        </div>

        {/* Read-Only Approved Official Information */}
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl mb-6 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div>
            <span className="text-slate-400 font-medium uppercase text-[10px]">Employee ID</span>
            <p className="font-mono font-bold text-navy text-sm mt-0.5">
              {formData.employeeId || 'DLR-EMP-1042'}
            </p>
          </div>
          <div>
            <span className="text-slate-400 font-medium uppercase text-[10px]">Department</span>
            <p className="font-semibold text-navy mt-0.5 truncate">
              {formData.department || 'Department of Land Resources'}
            </p>
          </div>
          <div>
            <span className="text-slate-400 font-medium uppercase text-[10px]">Assigned Role</span>
            <div className="flex items-center gap-1 font-semibold text-[#2E7D32] mt-0.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{formData.officialRole || 'Land Records Officer'}</span>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleActivateAccount} className="space-y-4" noValidate>
          {/* Create Password */}
          <div>
            <PasswordField
              label="Create Password"
              required
              placeholder="Create a strong departmental password"
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
              onClick={() => navigate('/government/register/status')}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-navy transition-colors py-2 px-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Status</span>
            </button>

            <Button
              type="submit"
              variant="secondary"
              size="lg"
              disabled={!canActivateAccount}
              isLoading={isActivating}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Activate Account
            </Button>
          </div>
        </form>
      </div>
    </AuthLayout>
  );
};

