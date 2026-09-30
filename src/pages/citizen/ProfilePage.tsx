import React, { useState } from 'react';
import { ShieldCheck, Phone, Mail, Key, Edit3, Save, X } from 'lucide-react';
import { CitizenLayout } from '../../components/layout/CitizenLayout';
import { useAuth } from '../../context/AuthContext';

export const ProfilePage: React.FC = () => {
  const { currentUser } = useAuth();
  const [editing, setEditing] = useState(false);

  const displayName = currentUser?.fullName || 'Rajesh Kumar Sharma';
  const firstName = displayName.split(' ')[0];

  return (
    <CitizenLayout>
      <div className="mb-6">
        <h1 className="text-xl font-bold text-navy">My Profile</h1>
        <p className="text-xs text-slate-500 mt-1">Your citizen account details registered with GeoNexus.</p>
      </div>

      <div className="max-w-2xl space-y-4">
        {/* Avatar + Identity */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-card p-6">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-navy flex items-center justify-center text-white text-2xl font-bold shrink-0">
              {firstName.charAt(0)}
            </div>
            <div>
              <h2 className="text-lg font-bold text-navy">{displayName}</h2>
              <div className="mt-1 flex items-center gap-2">
                <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                  <ShieldCheck className="w-3 h-3" /> Aadhaar Verified
                </span>
                <span className="text-[11px] text-slate-400">Citizen Account</span>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Details */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-card overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
            <h3 className="text-sm font-bold text-navy">Contact Information</h3>
            <button
              type="button"
              onClick={() => setEditing(!editing)}
              className="flex items-center gap-1.5 text-xs font-semibold text-navy hover:text-tealAccent transition-colors"
            >
              {editing ? <><X className="w-3.5 h-3.5" /> Cancel</> : <><Edit3 className="w-3.5 h-3.5" /> Edit</>}
            </button>
          </div>
          <div className="px-6 py-4 space-y-4">
            <div className="flex items-center gap-3">
              <Phone className="w-4 h-4 text-slate-400 shrink-0" />
              <div className="flex-1">
                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Mobile (Registered)</p>
                <p className="text-sm font-semibold text-navy mt-0.5">+91 {currentUser?.mobile || '9876543210'}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="w-4 h-4 text-slate-400 shrink-0" />
              <div className="flex-1">
                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Email Address</p>
                {editing ? (
                  <input
                    type="email"
                    defaultValue={currentUser?.email || ''}
                    className="mt-0.5 w-full text-sm border border-slate-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-navy/30"
                  />
                ) : (
                  <p className="text-sm font-semibold text-navy mt-0.5">{currentUser?.email || 'Not provided'}</p>
                )}
              </div>
            </div>
          </div>
          {editing && (
            <div className="px-6 pb-4">
              <button
                type="button"
                onClick={() => setEditing(false)}
                className="flex items-center gap-1.5 px-4 py-2 bg-navy text-white text-xs font-bold rounded-xl hover:bg-navy-light transition-colors"
              >
                <Save className="w-3.5 h-3.5" /> Save Changes (Prototype)
              </button>
            </div>
          )}
        </div>

        {/* Aadhaar Verification */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-card overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100">
            <h3 className="text-sm font-bold text-navy">Aadhaar Verification</h3>
          </div>
          <div className="px-6 py-4 flex items-center gap-3">
            <ShieldCheck className="w-8 h-8 text-emerald-600 shrink-0" />
            <div>
              <p className="text-sm font-semibold text-emerald-700">Aadhaar Verified</p>
              <p className="text-xs text-slate-500 mt-0.5">Masked Aadhaar: {currentUser?.maskedAadhaar || 'XXXX XXXX ••••'}</p>
            </div>
          </div>
        </div>

        {/* Security */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-card overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100">
            <h3 className="text-sm font-bold text-navy">Security</h3>
          </div>
          <div className="px-6 py-4">
            <button
              type="button"
              className="flex items-center gap-2 text-xs font-semibold text-navy hover:text-tealAccent transition-colors"
            >
              <Key className="w-4 h-4" />
              Change Password (Prototype — not functional)
            </button>
          </div>
        </div>

        {/* Prototype notice */}
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-700">
          <p className="font-semibold mb-1">🧪 Prototype Notice</p>
          <p>Profile editing, password change, and Aadhaar re-verification are simulated in this prototype. No real data is modified or stored.</p>
        </div>
      </div>
    </CitizenLayout>
  );
};
