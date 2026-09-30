import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  ClipboardList,
  Compass,
  GitPullRequest,
  TrendingUp,
  AlertTriangle,
  FileText,
  BarChart3,
  Bell,
  User,
  LogOut,
  Menu,
  X,
  Layers,
  ChevronDown,
  ShieldCheck,
  MapPin,
  Home,
  UserCheck,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useApplications } from '../../context/ApplicationContext';
import { useHomeNavigation } from '../../hooks/useHomeNavigation';
import { LogoutConfirmModal } from '../common/LogoutConfirmModal';

interface GovernmentLayoutProps {
  children: React.ReactNode;
}

export const GovernmentLayout: React.FC<GovernmentLayoutProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentGovUser, govLogout } = useAuth();
  const { getApplicationsForGovUser, unreadNotifCount } = useApplications();
  const {
    isModalOpen,
    modalTitle,
    modalMessage,
    handleHomeClick,
    confirmLogout,
    closeModal,
  } = useHomeNavigation();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const handleLogout = () => {
    govLogout();
    navigate('/government/login');
  };

  const displayName = currentGovUser?.fullName || 'Officer';
  const firstName = displayName.split(' ')[0];
  const displayRole = currentGovUser?.officialRole || 'Government Officer';
  const displayDept = currentGovUser?.department || '';

  const pendingRequests = currentGovUser
    ? getApplicationsForGovUser(currentGovUser).filter(
        (a) => a.status === 'Routed' || a.status === 'Submitted'
      ).length
    : 0;

  const isWaterOfficer = currentGovUser?.department === 'Water Resources Department';
  const isAccessAdmin = ['System Administrator', 'State Administrator'].includes(
    String(currentGovUser?.officialRole || '')
  );

  const navItems = [
    { label: 'Dashboard', path: '/government/dashboard', icon: LayoutDashboard },
    ...(isAccessAdmin
      ? [{ label: 'Access Approvals', path: '/admin/government-access', icon: UserCheck }]
      : []),
    {
      label: 'Citizen Requests',
      path: '/government/requests',
      icon: ClipboardList,
      badge: pendingRequests > 0 ? pendingRequests : undefined,
    },
    { label: 'GIS Explorer', path: '/government/gis', icon: Compass },
    { label: 'Workflows', path: '/government/workflows', icon: GitPullRequest },
    { label: 'Analytics', path: '/government/analytics', icon: TrendingUp },
    {
      label: 'Alerts',
      path: '/government/alerts',
      icon: AlertTriangle,
      badge: isWaterOfficer ? 7 : undefined,
    },
    { label: 'Documents', path: '/government/documents', icon: FileText },
    { label: 'Reports', path: '/government/reports', icon: BarChart3 },
    {
      label: 'Notifications',
      path: '/government/notifications',
      icon: Bell,
      badge: unreadNotifCount > 0 ? unreadNotifCount : undefined,
    },
    { label: 'Profile', path: '/government/profile', icon: User },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F7F9] text-[#1D2733]">
      <LogoutConfirmModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onConfirm={confirmLogout}
        title={modalTitle}
        message={modalMessage}
      />

      {/* Header */}
      <header className="w-full bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
        <div className="h-1 w-full bg-gradient-to-r from-[#FF9933] via-white to-[#138808]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-lg text-slate-600 hover:text-navy hover:bg-slate-100"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
              <Link to="/government/dashboard" className="flex items-center gap-3 group">
                <div className="w-10 h-10 rounded-xl bg-navy flex items-center justify-center text-white shadow-sm">
                  <Layers className="w-5 h-5 text-tealAccent-light" />
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-1.5">
                    <span className="text-base font-bold tracking-tight text-navy">GeoNexus</span>
                    <span className="hidden sm:inline-block px-1.5 py-0.5 text-[9px] font-semibold bg-navy/10 text-navy rounded border border-navy/20">
                      Gov Portal
                    </span>
                  </div>
                  <span className="text-[10px] font-medium text-slate-500 hidden sm:inline">
                    Department of Land Resources, Govt. of India
                  </span>
                </div>
              </Link>
            </div>

            {/* Right */}
            <div className="flex items-center gap-2 sm:gap-4">
              {/* Home link with logout guard */}
              <button
                type="button"
                onClick={handleHomeClick}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-navy hover:bg-slate-100 rounded-lg transition-colors"
              >
                <Home className="w-3.5 h-3.5 text-primaryBlue" />
                Home
              </button>

              {/* Profile */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-2.5 py-1 px-2.5 rounded-xl border border-slate-200 hover:border-slate-300 bg-slate-50 hover:bg-white transition-all"
                >
                  <div className="w-8 h-8 rounded-lg bg-navy text-white font-bold text-xs flex items-center justify-center">
                    {firstName.charAt(0)}
                  </div>
                  <div className="hidden sm:flex flex-col text-left">
                    <span className="text-xs font-bold text-navy leading-none">{firstName}</span>
                    <span className="text-[10px] text-slate-400 leading-tight">{displayRole}</span>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white border border-slate-200 rounded-2xl shadow-xl py-2 z-50">
                    <div className="px-4 py-3 border-b border-slate-100">
                      <p className="text-xs font-bold text-navy">{displayName}</p>
                      <p className="text-[11px] text-tealAccent font-semibold mt-0.5">{displayRole}</p>
                      <p className="text-[11px] text-slate-500 truncate">{displayDept}</p>
                      <div className="mt-1 flex items-center gap-1 text-[10px] font-semibold text-[#2E7D32]">
                        <ShieldCheck className="w-3 h-3" />
                        <span>Authorised Official</span>
                      </div>
                    </div>
                    <div className="mt-1">
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="w-full text-left flex items-center gap-2.5 px-4 py-2 text-xs text-red-600 hover:bg-red-50 transition-colors font-medium"
                      >
                        <LogOut className="w-4 h-4" />
                        Official Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main layout */}
      <div className="flex-1 flex w-full relative">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-slate-200 shrink-0 sticky top-[68px] h-[calc(100vh-68px)] overflow-y-auto">
          <div className="p-4 space-y-1">
            <div className="px-3 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Navigation</div>
            {navItems.map((item) => {
              const isActive = location.pathname === item.path || (item.path.length > 1 && location.pathname.startsWith(item.path + '/'));
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive ? 'bg-navy text-white shadow-xs' : 'text-slate-600 hover:text-navy hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-tealAccent-light' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && (
                    <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-[#C53A3A] text-white">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>

          {/* Officer info footer */}
          <div className="mt-auto p-4 border-t border-slate-100">
            <div className="bg-slate-50 rounded-xl p-3 space-y-1">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Logged In As</p>
              <p className="text-xs font-bold text-navy">{displayName}</p>
              <p className="text-[11px] text-tealAccent font-semibold">{displayRole}</p>
              {currentGovUser?.districtOffice && (
                <p className="text-[11px] text-slate-400 flex items-center gap-1">
                  <MapPin className="w-3 h-3" />{currentGovUser.districtOffice}
                </p>
              )}
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="mt-3 w-full flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Official Logout
            </button>
          </div>
        </aside>

        {/* Mobile drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-40 flex">
            <div className="fixed inset-0 bg-navy/60 backdrop-blur-xs" onClick={() => setMobileMenuOpen(false)} />
            <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white shadow-2xl p-5 z-50">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <span className="font-bold text-navy text-sm">GeoNexus Government Portal</span>
                <button type="button" onClick={() => setMobileMenuOpen(false)} className="p-1 rounded-lg text-slate-400">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="py-4 space-y-1 overflow-y-auto">
                {/* Home option in mobile drawer */}
                <button
                  type="button"
                  onClick={(e) => {
                    setMobileMenuOpen(false);
                    handleHomeClick(e);
                  }}
                  className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-100 text-left"
                >
                  <div className="flex items-center gap-3">
                    <Home className="w-4 h-4 text-primaryBlue" />
                    <span>Home</span>
                  </div>
                </button>

                {navItems.map((item) => {
                  const isActive = location.pathname === item.path;
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                        isActive ? 'bg-navy text-white' : 'text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="w-4 h-4" />
                        <span>{item.label}</span>
                      </div>
                      {item.badge !== undefined && (
                        <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-[#C53A3A] text-white">{item.badge}</span>
                      )}
                    </Link>
                  );
                })}
              </div>
              <div className="pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 py-2.5 bg-red-50 text-red-600 text-xs font-semibold rounded-xl"
                >
                  <LogOut className="w-4 h-4" />
                  Official Logout
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Content */}
        <main className="flex-1 flex flex-col min-w-0 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
};
