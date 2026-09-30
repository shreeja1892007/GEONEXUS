import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Building2, Shield, Lock, ArrowRight, ChevronDown, ChevronUp, Copy, Check } from 'lucide-react';
import { AuthLayout } from '../components/layout/AuthLayout';
import { FormField } from '../components/ui/FormField';
import { PasswordField } from '../components/ui/PasswordField';
import { Button } from '../components/ui/Button';
import { AlertBanner } from '../components/ui/AlertBanner';
import { useAuth } from '../context/AuthContext';
import { GOVERNMENT_DEPARTMENTS } from '../types/auth';

// Quick-access demo accounts for testing the end-to-end routing flow
const DEMO_ACCOUNTS = [
  { dept: 'Water Resources Department',                 id: 'TN-WRD-5518',   role: 'Water Resources Officer',            note: 'Water Resources Admin Dashboard & Canal/Lake Issues' },
  { dept: 'Revenue Department',                          id: 'TN-REV-1042',   role: 'Revenue Officer',                    note: 'Patta Transfer' },
  { dept: 'Survey & Settlement Department',              id: 'TN-SURV-2241',  role: 'Survey Officer',                     note: 'Land Survey' },
  { dept: 'Registration Department',                    id: 'TN-REG-3301',   role: 'Registration Officer',               note: 'Property Registration' },
  { dept: 'Water & Sewerage Department',                 id: 'TN-WSD-4412',   role: 'Water & Sewerage Officer',           note: 'Water Connection' },
  { dept: 'Electricity Department',                     id: 'TN-ELEC-6629',  role: 'Electricity Department Officer',     note: 'Electricity Connection' },
  { dept: 'Town & Country Planning Department',          id: 'TN-TCP-5521',   role: 'Town Planning Officer',              note: 'Building/Planning' },
  { dept: 'Legal / Dispute Management Department',      id: 'TN-LEG-6630',   role: 'Legal / Dispute Management Officer', note: 'Land Disputes' },
  { dept: 'Land Acquisition / Revenue Department',      id: 'TN-LAQ-8852',   role: 'Land Acquisition Officer',           note: 'Acquisition' },
  { dept: 'Archaeology / Heritage Department',          id: 'TN-ARCH-7741',  role: 'Archaeology / Heritage Officer',     note: 'Heritage Site' },
  { dept: 'Disaster Management Department',             id: 'TN-DM-9963',    role: 'Disaster Management Officer',        note: 'Disaster/Flood' },
  { dept: 'Rural Development / Panchayat Department',   id: 'TN-RDP-1174',   role: 'Rural Development / Panchayat Officer', note: 'Rural Infra' },
  { dept: 'Forest Department',                          id: 'TN-FOR-2285',   role: 'Forest Department Officer',          note: 'Forest Permission' },
  { dept: 'Environment Department',                     id: 'TN-ENV-3396',   role: 'Environment Department Officer',     note: 'Environmental NOC' },
  { dept: 'Highways Department',                        id: 'TN-HWY-4407',   role: 'Highways Officer',                   note: 'Road Access' },
  { dept: 'Municipal Administration / Urban Local Body', id: 'TN-ULB-7740',  role: 'Municipal / Urban Local Body Officer', note: 'Urban Services' },
  { dept: 'Property Tax Department',                    id: 'TN-TAX-8851',   role: 'Property Tax Officer',               note: 'Property Tax' },
  { dept: 'Department of Land Resources',               id: 'TN-DLR-9900',   role: 'Land Records Officer',               note: 'Land Records / ULPIN' },
  { dept: 'Revenue Department',                         id: 'TN-ADMIN-0001', role: 'State Administrator',                note: 'State-wide visibility' },
  { dept: 'Department of Land Resources',               id: 'SYS-ADMIN-001', role: 'System Administrator',               note: 'All applications' },
] as const;

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch { /* ignore */ }
  };
  return (
    <button
      type="button"
      onClick={handleCopy}
      className="ml-1 p-0.5 rounded text-slate-400 hover:text-navy hover:bg-slate-200 transition-colors"
      title="Copy"
    >
      {copied ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
    </button>
  );
}

export const GovernmentLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { govLogin, prefillGovLogin } = useAuth();

  const [department, setDepartment] = useState<string>(GOVERNMENT_DEPARTMENTS[0]);
  const [employeeId, setEmployeeId] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [rememberMe, setRememberMe] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [forgotPasswordModal, setForgotPasswordModal] = useState<boolean>(false);
  const [demoOpen, setDemoOpen] = useState(false);

  // Prefill if redirected from government registration activation
  useEffect(() => {
    if (prefillGovLogin) {
      setDepartment(prefillGovLogin.department);
      setEmployeeId(prefillGovLogin.employeeId);
    }
  }, [prefillGovLogin]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    if (!department) { setErrorMessage('Please select your department.'); return; }
    if (!employeeId.trim()) { setErrorMessage('Please enter your Employee ID / Service ID.'); return; }
    if (!password) { setErrorMessage('Please enter your password.'); return; }
    setIsLoading(true);
    const result = await govLogin(department, employeeId, password);
    setIsLoading(false);
    if (result.success) { navigate('/government/dashboard'); }
    else { setErrorMessage(result.message || 'Incorrect login credentials.'); }
  };

  const handleQuickFill = (dept: string, id: string) => {
    setDepartment(dept);
    setEmployeeId(id);
    setPassword('GovPassword@123');
    setErrorMessage(null);
  };

  return (
    <AuthLayout>
      <div className="bg-white rounded-card p-6 sm:p-8 border border-slate-200 shadow-card max-w-lg mx-auto">
        {/* Institutional Header */}
        <div className="text-center mb-6">
          <div className="w-13 h-13 rounded-2xl bg-navy/5 border border-navy/15 flex items-center justify-center text-navy mx-auto mb-3">
            <Building2 className="w-7 h-7 text-navy" />
          </div>
          <h1 className="text-2xl font-bold text-navy tracking-tight">Government Login</h1>
          <p className="text-xs sm:text-sm text-[#657281] mt-1">
            Secure access for authorised government officials
          </p>
        </div>

        {/* Error Banner */}
        {errorMessage && (
          <AlertBanner
            type="error"
            message={errorMessage}
            onClose={() => setErrorMessage(null)}
            className="mb-5"
          />
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          {/* Department / Organisation */}
          <div className="w-full flex flex-col gap-1.5">
            <label
              htmlFor="gov-department"
              className="text-xs font-semibold text-[#1D2733] flex items-center gap-1 select-none"
            >
              <span>Department / Organisation</span>
              <span className="text-[#C53A3A] font-bold">*</span>
            </label>
            <select
              id="gov-department"
              value={department}
              onChange={(e) => { setDepartment(e.target.value); if (errorMessage) setErrorMessage(null); }}
              className="w-full h-11 px-3.5 text-sm text-[#1D2733] bg-white border border-slate-300 rounded-xl focus:border-navy focus:ring-2 focus:ring-navy/20 focus:outline-none transition-all"
            >
              {GOVERNMENT_DEPARTMENTS.map((dept) => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>

          {/* Employee ID */}
          <FormField
            label="Employee ID / Service ID"
            required
            placeholder="e.g. TN-REV-1042"
            value={employeeId}
            onChange={(e) => { setEmployeeId(e.target.value); if (errorMessage) setErrorMessage(null); }}
            helperText="Official Service Identity issued by your department"
            autoFocus={!employeeId}
          />

          {/* Password */}
          <PasswordField
            label="Password"
            required
            placeholder="Enter your government password"
            value={password}
            onChange={(e) => { setPassword(e.target.value); if (errorMessage) setErrorMessage(null); }}
            autoFocus={!!employeeId}
          />

          {/* Remember me & Forgot Password */}
          <div className="flex items-center justify-between text-xs pt-1">
            <label className="flex items-center gap-2 cursor-pointer select-none text-slate-600">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded border-slate-300 text-navy focus:ring-navy"
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

          {/* Secure Login Button */}
          <div className="pt-2">
            <Button
              type="submit"
              variant="secondary"
              size="lg"
              className="w-full"
              isLoading={isLoading}
              leftIcon={<Shield className="w-4 h-4 mr-1 text-tealAccent-light" />}
            >
              Secure Login
            </Button>
          </div>
        </form>

        {/* New Official Flow */}
        <div className="mt-6 pt-5 border-t border-slate-100 text-center">
          <p className="text-xs text-slate-500 mb-2">New authorised official?</p>
          <Link
            to="/government/register"
            className="inline-flex items-center justify-center w-full py-2.5 px-4 text-xs font-semibold text-navy bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-button transition-colors"
          >
            <span>Request Government Access</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1.5 text-slate-500" />
          </Link>
        </div>

        {/* Security Message */}
        <div className="mt-6 flex items-center justify-center gap-1.5 text-[11px] text-slate-500 font-medium">
          <Lock className="w-3.5 h-3.5 text-tealAccent" />
          <span>Authorised officials only</span>
        </div>
      </div>

      {/* ── Demo Test Accounts Panel ────────────────────────────────────────────── */}
      <div className="mt-4 max-w-lg mx-auto bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <button
          type="button"
          onClick={() => setDemoOpen((v) => !v)}
          className="w-full flex items-center justify-between px-4 py-3 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
        >
          <span className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center text-[10px] font-bold">!</span>
            Prototype Demo Accounts — All passwords: <code className="ml-1 bg-slate-100 px-1.5 py-0.5 rounded border font-mono text-navy">GovPassword@123</code>
          </span>
          {demoOpen ? <ChevronUp className="w-3.5 h-3.5 text-slate-400" /> : <ChevronDown className="w-3.5 h-3.5 text-slate-400" />}
        </button>

        {demoOpen && (
          <div className="border-t border-slate-100 max-h-72 overflow-y-auto divide-y divide-slate-50">
            {DEMO_ACCOUNTS.map((acc) => (
              <div
                key={acc.id}
                className="flex items-center justify-between gap-2 px-4 py-2.5 hover:bg-slate-50 group"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <code className="text-[11px] font-mono font-bold text-navy bg-slate-100 px-1.5 py-0.5 rounded border flex items-center gap-0.5">
                      {acc.id}
                      <CopyButton text={acc.id} />
                    </code>
                    <span className="text-[11px] text-slate-500 truncate">{acc.role}</span>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-0.5 truncate">{acc.dept}</p>
                  <p className="text-[10px] text-tealAccent font-semibold mt-0.5">→ {acc.note}</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleQuickFill(acc.dept, acc.id)}
                  className="shrink-0 px-2.5 py-1 text-[10px] font-semibold bg-navy text-white rounded-lg hover:bg-navy/90 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  Use
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Forgot Password Modal */}
      {forgotPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy/50 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-xl border border-slate-200 text-center">
            <div className="w-10 h-10 rounded-full bg-slate-100 text-navy flex items-center justify-center mx-auto mb-3">
              <Lock className="w-5 h-5 text-navy" />
            </div>
            <h3 className="text-base font-bold text-navy">Official Password Reset</h3>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              In accordance with government cybersecurity protocol, official credentials can only be reset by your Department Administrator or via your registered NIC/Gov e-Mail token.
            </p>
            <div className="mt-5 flex justify-center">
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
