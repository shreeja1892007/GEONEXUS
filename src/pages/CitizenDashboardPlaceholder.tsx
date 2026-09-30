import React from 'react';
import { useNavigate } from 'react-router-dom';
import { UserCheck, ShieldCheck, LogOut, Layers, FileText, Map, Sparkles } from 'lucide-react';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { CadastralPattern } from '../components/ui/CadastralPattern';
import { useAuth } from '../context/AuthContext';
import { maskMobile } from '../utils/formatters';

export const CitizenDashboardPlaceholder: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/citizen/login');
  };

  const displayName = currentUser?.fullName || 'Citizen User';
  const displayMobile = maskMobile(currentUser?.mobile || '9876543210');
  const displayAadhaar = currentUser?.maskedAadhaar || 'XXXX XXXX 4582';

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F7F9] text-[#1D2733] relative selection:bg-primaryBlue/10 selection:text-primaryBlue">
      <Header />

      <main className="flex-1 flex flex-col relative py-8 sm:py-12">
        <CadastralPattern />

        <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 relative z-10">
          {/* Top User Status Header */}
          <div className="bg-white rounded-card p-6 sm:p-8 border border-slate-200 shadow-card mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-tealAccent-light border border-tealAccent/20 flex items-center justify-center text-tealAccent">
                <UserCheck className="w-7 h-7" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-bold text-navy">
                    {displayName}
                  </h1>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#EAF5EB] text-[#2E7D32] border border-[#2E7D32]/20">
                    <ShieldCheck className="w-3 h-3" />
                    Verified Citizen
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-1">
                  <span>Mobile: <strong className="text-navy">{displayMobile}</strong></span>
                  <span>•</span>
                  <span>Aadhaar: <strong className="text-navy">{displayAadhaar}</strong></span>
                </div>
              </div>
            </div>

            {/* Logout Button */}
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-[#C53A3A] bg-red-50 hover:bg-red-100/80 border border-red-200 rounded-button transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>

          {/* Citizen Dashboard Polished Placeholder */}
          <div className="bg-white rounded-card p-8 sm:p-12 border border-slate-200 shadow-card text-center max-w-2xl mx-auto">
            <div className="w-16 h-16 rounded-3xl bg-blue-50 border border-blue-100 flex items-center justify-center text-primaryBlue mx-auto mb-6">
              <Layers className="w-8 h-8 text-primaryBlue" />
            </div>

            <h2 className="text-2xl sm:text-3xl font-bold text-navy tracking-tight">
              Citizen Dashboard
            </h2>

            <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EAF5EB] text-[#2E7D32] text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Authentication Successful</span>
            </div>

            <p className="mt-4 text-sm sm:text-base font-medium text-slate-700">
              Your account has been successfully authenticated.
            </p>

            <p className="mt-2 text-xs sm:text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
              GeoNexus citizen services will appear here. In the upcoming releases, you will be able to view integrated parcel records, track mutation requests, and access GIS-certified maps.
            </p>

            {/* Placeholder Service Badges */}
            <div className="mt-8 pt-8 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70">
                <Map className="w-5 h-5 text-tealAccent mb-2" />
                <p className="text-xs font-bold text-navy">Cadastral Parcels</p>
                <p className="text-[11px] text-slate-400 mt-0.5">Upcoming integration</p>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70">
                <FileText className="w-5 h-5 text-primaryBlue mb-2" />
                <p className="text-xs font-bold text-navy">Record of Rights</p>
                <p className="text-[11px] text-slate-400 mt-0.5">Upcoming integration</p>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70">
                <ShieldCheck className="w-5 h-5 text-[#2E7D32] mb-2" />
                <p className="text-xs font-bold text-navy">Mutual Consent</p>
                <p className="text-[11px] text-slate-400 mt-0.5">Upcoming integration</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

