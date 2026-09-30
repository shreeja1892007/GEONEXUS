import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Shield, Lock } from 'lucide-react';
import { AuthLayout } from '../components/layout/AuthLayout';
import { FormField } from '../components/ui/FormField';
import { PasswordField } from '../components/ui/PasswordField';
import { Button } from '../components/ui/Button';
import { AlertBanner } from '../components/ui/AlertBanner';
import { useAuth } from '../context/AuthContext';

export const CitizenLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, prefillMobile } = useAuth();

  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(
    (location.state as { toast?: string })?.toast || null
  );
  const [forgotPasswordModal, setForgotPasswordModal] = useState(false);

  // Prefill mobile if available from registration completion
  useEffect(() => {
    if (prefillMobile) {
      setMobile(prefillMobile);
    }
  }, [prefillMobile]);

  const handleMobileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 10);
    setMobile(val);
    if (errorMessage) setErrorMessage(null);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    if (errorMessage) setErrorMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!mobile || mobile.length !== 10) {
      setErrorMessage('Please enter a valid 10-digit mobile number.');
      return;
    }

    if (!password) {
      setErrorMessage('Please enter your password.');
      return;
    }

    setIsLoading(true);
    const result = await login(mobile, password);
    setIsLoading(false);

    if (result.success) {
      navigate('/citizen/dashboard', {
        state: {
          showLoginToast: true,
          toastTitle: 'Login successful',
          toastMessage: 'Welcome to GeoNexus',
        },
      });
    } else {
      // Generic message: does not reveal which credential was incorrect
      setErrorMessage(result.message || 'Incorrect mobile number or password.');
    }
  };

  return (
    <AuthLayout>
      <div className="bg-white rounded-card p-6 sm:p-8 border border-slate-200 shadow-card">
        {/* Card Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-primaryBlue mx-auto mb-3">
            <Shield className="w-6 h-6 text-primaryBlue" />
          </div>
          <h1 className="text-2xl font-bold text-navy tracking-tight">
            Citizen Login
          </h1>
          <p className="text-xs sm:text-sm text-[#657281] mt-1">
            Secure access to your GeoNexus account
          </p>
        </div>

        {/* Success Banner (e.g. from logout) */}
        {successMessage && (
          <AlertBanner
            type="success"
            message={successMessage}
            onClose={() => setSuccessMessage(null)}
            className="mb-5"
          />
        )}

        {/* Generic Error Banner */}
        {errorMessage && (
          <AlertBanner
            type="error"
            message={errorMessage}
            onClose={() => setErrorMessage(null)}
            className="mb-5"
          />
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          {/* Mobile Number */}
          <FormField
            label="Mobile Number"
            required
            type="tel"
            inputMode="numeric"
            placeholder="98765 43210"
            prefix={<span className="text-navy font-semibold">+91</span>}
            maxLength={10}
            value={mobile}
            onChange={handleMobileChange}
            helperText="Enter 10-digit registered Indian mobile number"
            autoFocus={!mobile}
          />

          {/* Password */}
          <PasswordField
            label="Password"
            required
            placeholder="Enter your account password"
            value={password}
            onChange={handlePasswordChange}
            autoFocus={!!mobile}
          />

          {/* Remember me & Forgot Password */}
          <div className="flex items-center justify-between text-xs pt-1">
            <label className="flex items-center gap-2 cursor-pointer select-none text-slate-600">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded border-slate-300 text-primaryBlue focus:ring-primaryBlue"
              />
              <span>Remember me</span>
            </label>

            <button
              type="button"
              onClick={() => setForgotPasswordModal(true)}
              className="text-primaryBlue font-semibold hover:underline"
            >
              Forgot Password?
            </button>
          </div>

          {/* Primary Login Button */}
          <div className="pt-2">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              isLoading={isLoading}
            >
              Login
            </Button>
          </div>
        </form>

        {/* Registration Redirection */}
        <div className="mt-6 pt-5 border-t border-slate-100 text-center">
          <p className="text-xs text-slate-500 mb-2">New to GeoNexus?</p>
          <Link
            to="/citizen/register"
            className="inline-flex items-center justify-center w-full py-2.5 px-4 text-xs font-semibold text-primaryBlue bg-primaryBlue-light hover:bg-blue-100/80 border border-primaryBlue/20 rounded-button transition-colors"
          >
            Create Citizen Account
          </Link>
        </div>

        {/* Security Notice */}
        <div className="mt-6 flex items-center justify-center gap-1.5 text-[11px] text-slate-400 font-medium">
          <Lock className="w-3.5 h-3.5 text-slate-400" />
          <span>Secure citizen authentication</span>
        </div>
      </div>

      {/* Demo helper callout for testing */}
      <div className="mt-4 p-3 bg-slate-100/70 border border-slate-200/80 rounded-xl text-center text-xs text-slate-500">
        <p>
          <strong className="text-slate-700">Prototype Demo Account:</strong> Mobile <code className="bg-white px-1.5 py-0.5 rounded border text-navy font-semibold font-mono">9876543210</code> | Password <code className="bg-white px-1.5 py-0.5 rounded border text-navy font-semibold font-mono">Password@123</code>
        </p>
      </div>

      {/* Forgot Password Modal */}
      {forgotPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy/40 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-xl border border-slate-200 text-center">
            <div className="w-10 h-10 rounded-full bg-blue-50 text-primaryBlue flex items-center justify-center mx-auto mb-3">
              <Lock className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-navy">
              Reset Citizen Password
            </h3>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              In production, password reset requires OTP authentication sent to your Aadhaar-linked mobile. For this prototype, you can login with the demo account or register a new citizen account.
            </p>
            <div className="mt-5 flex justify-center gap-2">
              <button
                type="button"
                onClick={() => setForgotPasswordModal(false)}
                className="px-4 py-2 bg-navy text-white rounded-button text-xs font-semibold hover:bg-navy-light"
              >
                Understood
              </button>
            </div>
          </div>
        </div>
      )}
    </AuthLayout>
  );
};
