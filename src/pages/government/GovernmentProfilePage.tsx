import React from 'react';
import {
  ShieldCheck,
  Lock,
  LogOut,
} from 'lucide-react';
import { GovernmentLayout } from '../../components/layout/GovernmentLayout';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export const GovernmentProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { currentGovUser, govLogout } = useAuth();

  const handleLogout = () => {
    govLogout();
    navigate('/government/login');
  };

  const name = currentGovUser?.fullName || 'Government Official';
  const empId = currentGovUser?.employeeId || 'TN-GOV-1001';
  const dept = currentGovUser?.department || 'Department of Land Resources';
  const role = currentGovUser?.officialRole || 'Government Officer';
  const designation = currentGovUser?.designation || 'Official';
  const state = currentGovUser?.state || 'Tamil Nadu';
  const district = currentGovUser?.districtOffice || 'Chennai District';
  const email = currentGovUser?.officialEmail || `${empId.toLowerCase()}@tn.gov.in`;
  const mobile = currentGovUser?.officialMobile || '+91 98765 43210';
  const registeredAt = currentGovUser?.registeredAt || '15 Jan 2026';
  const accessScope = currentGovUser?.officialRole === 'System Administrator'
    ? 'SYSTEM_ADMIN'
    : currentGovUser?.officialRole === 'State Administrator'
    ? 'STATE_ADMIN'
    : currentGovUser?.officialRole === 'District Administrator'
    ? 'DISTRICT_ADMIN'
    : 'OFFICER';

  return (
    <GovernmentLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Profile Card Header */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-navy text-white text-2xl font-bold flex items-center justify-center shadow-md">
              {name.charAt(0)}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold text-navy">{name}</h1>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-700 border border-emerald-300">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Verified Official
                </span>
              </div>
              <p className="text-xs font-semibold text-slate-600 mt-1">
                {designation} • <span className="text-tealAccent">{role}</span>
              </p>
              <p className="text-xs font-mono text-primaryBlue mt-0.5">Service ID: {empId}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-semibold rounded-xl border border-red-200 flex items-center gap-2 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Official Logout
          </button>
        </div>

        {/* Profile Details Grid */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
          <h2 className="text-sm font-bold text-navy uppercase tracking-wider border-b pb-3 border-slate-100">
            Official Credentials & Jurisdiction
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <ProfileField label="Employee / Service ID" value={empId} fontMono />
            <ProfileField label="Full Official Name" value={name} />
            <ProfileField label="Department / Organisation" value={dept} />
            <ProfileField label="Official Designation" value={designation} />
            <ProfileField label="Assigned Official Role" value={role} />
            <ProfileField label="Access Scope Level" value={accessScope} badge="bg-navy text-white" />
            <ProfileField label="State Jurisdiction" value={state} />
            <ProfileField label="District / Office Jurisdiction" value={district} />
            <ProfileField label="NIC Official Email" value={email} />
            <ProfileField label="Official Mobile" value={mobile} />
            <ProfileField label="Registration Date" value={registeredAt} />
            <ProfileField label="Account Status" value="ACTIVE & AUTHORISED" badge="bg-emerald-100 text-emerald-700" />
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span className="flex items-center gap-1.5">
              <Lock className="w-4 h-4 text-tealAccent" />
              Cybersecurity Protocol: Access logs audited by NIC / Ministry of Land Resources.
            </span>
          </div>
        </div>
      </div>
    </GovernmentLayout>
  );
};

function ProfileField({ label, value, fontMono = false, badge }: { label: string; value: string; fontMono?: boolean; badge?: string }) {
  return (
    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
      <span className="text-[10px] text-slate-400 font-semibold block uppercase">{label}</span>
      <div className="flex items-center justify-between">
        <span className={`text-xs font-bold text-navy ${fontMono ? 'font-mono text-primaryBlue' : ''}`}>{value}</span>
        {badge && <span className={`px-2 py-0.5 text-[10px] font-bold rounded ${badge}`}>{value}</span>}
      </div>
    </div>
  );
}

