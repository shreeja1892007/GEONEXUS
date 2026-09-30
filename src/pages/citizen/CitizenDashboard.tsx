import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  ShieldCheck,
  Compass,
  FileCheck,
  FileText,
  Clock,
  ArrowRight,
  CheckCircle2,
  X,
  FilePlus2,
} from 'lucide-react';
import { CitizenLayout } from '../../components/layout/CitizenLayout';
import { ParcelSearch } from '../../components/parcel/ParcelSearch';
import { useAuth } from '../../context/AuthContext';
import { useApplications } from '../../context/ApplicationContext';

export const CitizenDashboard: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser } = useAuth();
  const { getApplicationsForCitizen } = useApplications();

  const [toast, setToast] = useState<{ title: string; message: string } | null>(null);

  useEffect(() => {
    const state = location.state as { showLoginToast?: boolean; toastTitle?: string; toastMessage?: string } | null;
    if (state?.showLoginToast) {
      setToast({
        title: state.toastTitle || 'Login successful',
        message: state.toastMessage || 'Welcome to GeoNexus',
      });
      window.history.replaceState({}, document.title);
      const timer = setTimeout(() => setToast(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [location]);

  const displayName = currentUser?.fullName || 'Ramesh Kumar Sharma';
  const firstName = displayName.split(' ')[0];

  const quickServices = [
    {
      title: 'Verify Land Information',
      description: 'Check verified ownership and land status against official registries.',
      icon: ShieldCheck,
      color: 'text-primaryBlue bg-blue-50 border-blue-100',
      action: () => navigate('/citizen/parcel/TN01ABC1234567'),
    },
    {
      title: 'Land Use & Zoning',
      description: 'Explore master plan permitted uses, FSI limits, and spatial restrictions.',
      icon: Compass,
      color: 'text-tealAccent bg-teal-50 border-teal-100',
      action: () => navigate('/citizen/map'),
    },
    {
      title: 'Track Application',
      description: 'Check real-time status of your certified record requests and mutations.',
      icon: FileText,
      color: 'text-[#E99A24] bg-amber-50 border-amber-100',
      action: () => navigate('/citizen/applications'),
    },
    {
      title: 'Certified Records',
      description: 'Request digitally signed extracts of Record of Rights (RoR Form 7/12).',
      icon: FileCheck,
      color: 'text-[#2E7D32] bg-emerald-50 border-emerald-100',
      action: () => navigate('/citizen/parcel/TN01ABC1234567'),
    },
  ];

  const myApps = currentUser ? getApplicationsForCitizen(currentUser.id) : [];
  const pendingApps = myApps.filter((a) =>
    a.status === 'Submitted' || a.status === 'Routed' || a.status === 'Under Review' || a.status === 'More Information Required'
  );
  const approvedApps = myApps.filter((a) => a.status === 'Approved' || a.status === 'Completed');

  return (
    <CitizenLayout>
      {/* Login Success Toast */}
      {toast && (
        <div className="fixed top-20 right-5 z-50 flex items-start gap-3 bg-white border border-emerald-200 rounded-2xl p-4 shadow-xl animate-in slide-in-from-top-3 duration-300 max-w-sm">
          <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-navy">{toast.title}</p>
            <p className="text-xs text-slate-600 mt-0.5 whitespace-pre-line">{toast.message}</p>
          </div>
          <button
            type="button"
            onClick={() => setToast(null)}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <div className="space-y-8">
        {/* Welcome Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-navy tracking-tight">
              Welcome, {firstName}
            </h1>
            <p className="text-xs sm:text-sm font-semibold text-tealAccent mt-0.5">
              Citizen Land Services • Unified Digital Platform
            </p>
          </div>

          <Link
            to="/citizen/applications/new"
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-navy hover:bg-navy-light text-white text-xs font-semibold rounded-button transition-colors shadow-sm self-start sm:self-auto"
          >
            <FilePlus2 className="w-4 h-4 text-tealAccent-light" />
            <span>Application Request</span>
          </Link>
        </div>

        {/* Main Parcel Search (Centerpiece) */}
        <ParcelSearch />

        {/* Quick Services (Exactly 4 cards) */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Quick Services
            </h3>
            <span className="text-[11px] text-slate-400">Integrated DPI Services</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickServices.map((srv) => {
              const Icon = srv.icon;
              return (
                <div
                  key={srv.title}
                  onClick={srv.action}
                  className="bg-white rounded-2xl p-5 border border-slate-200/90 hover:border-primaryBlue/50 hover:shadow-card transition-all cursor-pointer flex flex-col justify-between group"
                >
                  <div>
                    <div
                      className={`w-11 h-11 rounded-xl flex items-center justify-center border mb-3.5 transition-transform group-hover:scale-105 ${srv.color}`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <h4 className="text-sm font-bold text-navy group-hover:text-primaryBlue transition-colors mb-1">
                      {srv.title}
                    </h4>
                    <p className="text-xs text-[#657281] leading-relaxed line-clamp-2">
                      {srv.description}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-primaryBlue">
                    <span>Access</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* My Applications Summary */}
        <div className="bg-white rounded-card p-6 border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-slate-400" />
              <h3 className="text-sm font-bold text-navy">My Applications</h3>
              {pendingApps.length > 0 && (
                <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-[#C53A3A] text-white">
                  {pendingApps.length}
                </span>
              )}
            </div>
            <Link
              to="/citizen/applications"
              className="text-xs font-semibold text-primaryBlue hover:underline"
            >
              View All
            </Link>
          </div>

          {myApps.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="w-10 h-10 text-slate-200 mx-auto mb-3" />
              <p className="text-xs text-slate-400">No applications submitted yet.</p>
              <button
                type="button"
                onClick={() => navigate('/citizen/applications/new')}
                className="mt-3 inline-flex items-center gap-2 px-4 py-2 bg-navy text-white text-xs font-semibold rounded-xl"
              >
                <FilePlus2 className="w-4 h-4" /> Submit Application
              </button>
            </div>
          ) : (
            <>
              {/* Stat pills */}
              <div className="flex flex-wrap gap-3 mb-4">
                <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 border border-blue-100 rounded-xl">
                  <Clock className="w-3.5 h-3.5 text-blue-500" />
                  <span className="text-xs font-semibold text-blue-700">{pendingApps.length} Active</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-2 bg-emerald-50 border border-emerald-100 rounded-xl">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  <span className="text-xs font-semibold text-emerald-700">{approvedApps.length} Approved</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 border border-slate-100 rounded-xl">
                  <FileText className="w-3.5 h-3.5 text-slate-500" />
                  <span className="text-xs font-semibold text-slate-700">{myApps.length} Total</span>
                </div>
              </div>

              {/* Latest 3 applications */}
              <div className="divide-y divide-slate-100">
                {myApps.slice(0, 3).map((app) => (
                  <div
                    key={app.applicationId}
                    className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs cursor-pointer hover:bg-slate-50 -mx-2 px-2 rounded-xl transition-colors"
                    onClick={() => navigate(`/citizen/applications/${app.applicationId}`)}
                  >
                    <div>
                      <p className="font-semibold text-navy">{app.purposeLabel}</p>
                      <p className="text-slate-500 text-[11px]">{app.targetDepartment}</p>
                      <p className="font-mono text-[11px] text-primaryBlue">{app.applicationId}</p>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border shrink-0 ${
                      app.status === 'Approved' || app.status === 'Completed'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : app.status === 'Rejected'
                        ? 'bg-red-50 text-red-700 border-red-200'
                        : app.status === 'More Information Required'
                        ? 'bg-orange-50 text-orange-700 border-orange-200'
                        : app.status === 'Under Review'
                        ? 'bg-amber-50 text-amber-700 border-amber-200'
                        : 'bg-blue-50 text-blue-700 border-blue-200'
                    }`}>
                      {app.status}
                    </span>
                  </div>
                ))}
              </div>

              {myApps.length > 3 && (
                <button
                  type="button"
                  onClick={() => navigate('/citizen/applications')}
                  className="mt-3 w-full text-center text-xs font-semibold text-primaryBlue hover:underline"
                >
                  View all {myApps.length} applications →
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </CitizenLayout>
  );
};
