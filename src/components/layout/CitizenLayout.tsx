import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Home,
  Map,
  House,
  FileText,
  History,
  Folder,
  Bell,
  CircleHelp,
  User,
  LogOut,
  Menu,
  X,
  Layers,
  ChevronDown,
  ShieldCheck,
  Info,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { MOCK_NOTIFICATIONS } from '../../data/mockParcels';
import { useHomeNavigation } from '../../hooks/useHomeNavigation';
import { LogoutConfirmModal } from '../common/LogoutConfirmModal';

interface CitizenLayoutProps {
  children: React.ReactNode;
  fullWidthContent?: boolean; // For Map Explorer which occupies full area
}

export const CitizenLayout: React.FC<CitizenLayoutProps> = ({
  children,
  fullWidthContent = false,
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
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
  const [helpModalOpen, setHelpModalOpen] = useState(false);
  const [aboutModalOpen, setAboutModalOpen] = useState(false);

  const unreadNotificationsCount = MOCK_NOTIFICATIONS.filter((n) => !n.read).length;

  const handleLogout = () => {
    logout();
    navigate('/citizen/login', { state: { toast: 'You have been securely logged out.' } });
  };

  const displayName = currentUser?.fullName || 'Ramesh';
  const firstName = displayName.split(' ')[0];

  const navItems = [
    { label: 'Dashboard', path: '/citizen/dashboard', icon: Home },
    { label: 'Parcel Explorer', path: '/citizen/map', icon: Map },
    { label: 'My Properties', path: '/citizen/properties', icon: House },
    { label: 'Applications', path: '/citizen/applications', icon: FileText },
    { label: 'Transactions', path: '/citizen/transactions', icon: History },
    { label: 'Documents', path: '/citizen/documents', icon: Folder },
    {
      label: 'Notifications',
      path: '/citizen/notifications',
      icon: Bell,
      badge: unreadNotificationsCount > 0 ? unreadNotificationsCount : undefined,
    },
    { label: 'Profile', path: '/citizen/profile', icon: User },
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

      {/* Top Common Citizen Header */}
      <header className="w-full bg-white border-b border-slate-200 sticky top-0 z-30 shadow-2xs">
        <div className="h-1 w-full bg-gradient-to-r from-[#FF9933] via-white to-[#138808]" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left: Mobile menu toggle + Logo & Brand */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-lg text-slate-600 hover:text-navy hover:bg-slate-100 transition-colors"
                aria-label="Toggle navigation drawer"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>

              <Link to="/citizen/dashboard" className="flex items-center gap-3 group">
                <div className="w-10 h-10 rounded-xl bg-navy flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform">
                  <Layers className="w-5 h-5 text-tealAccent-light" />
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-1.5">
                    <span className="text-base sm:text-lg font-bold tracking-tight text-navy">
                      GeoNexus
                    </span>
                    <span className="hidden sm:inline-block px-1.5 py-0.2 text-[9px] font-semibold bg-tealAccent-light text-tealAccent rounded border border-tealAccent/20">
                      Citizen Portal
                    </span>
                  </div>
                  <span className="text-[10px] font-medium text-slate-500 hidden sm:inline">
                    Department of Land Resources, Govt. of India
                  </span>
                </div>
              </Link>
            </div>

            {/* Right: Global Nav (Home | About | Help), Notifications, Avatar, Dropdown */}
            <div className="flex items-center gap-2 sm:gap-4">
              {/* Global Header Navigation: Home | About | Help */}
              <nav aria-label="Global Header Navigation" className="hidden md:flex items-center gap-1 sm:gap-2">
                <button
                  type="button"
                  onClick={handleHomeClick}
                  className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-primaryBlue ${
                    location.pathname === '/'
                      ? 'text-primaryBlue bg-blue-50 border border-blue-200 shadow-2xs'
                      : 'text-slate-600 hover:text-navy hover:bg-slate-100 border border-transparent'
                  }`}
                  title="GeoNexus Main Landing Page"
                >
                  <Home className="w-3.5 h-3.5 text-primaryBlue" />
                  <span>Home</span>
                </button>

                <span className="text-slate-200 text-xs select-none">|</span>

                <button
                  type="button"
                  onClick={() => setAboutModalOpen(true)}
                  className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-navy hover:bg-slate-100 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-primaryBlue"
                  title="About GeoNexus"
                >
                  <Info className="w-3.5 h-3.5 text-primaryBlue" />
                  <span>About</span>
                </button>

                <span className="text-slate-200 text-xs select-none">|</span>

                <button
                  type="button"
                  onClick={() => setHelpModalOpen(true)}
                  className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-navy hover:bg-slate-100 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-primaryBlue"
                  title="Citizen Help & Guidelines"
                >
                  <CircleHelp className="w-3.5 h-3.5 text-tealAccent" />
                  <span>Help</span>
                </button>
              </nav>

              {/* Mobile Home Quick Link */}
              <button
                type="button"
                onClick={handleHomeClick}
                className="flex md:hidden items-center gap-1 px-2.5 py-1 text-xs font-semibold text-slate-700 hover:text-navy bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg shadow-2xs focus:outline-none focus:ring-2 focus:ring-primaryBlue"
                title="Home (Landing Page)"
              >
                <Home className="w-3.5 h-3.5 text-primaryBlue" />
                <span>Home</span>
              </button>

              {/* Notifications */}
              <Link
                to="/citizen/notifications"
                className="relative p-2 text-slate-600 hover:text-navy hover:bg-slate-100 rounded-xl transition-colors"
                title="Notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadNotificationsCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-[#C53A3A] rounded-full ring-2 ring-white animate-pulse" />
                )}
              </Link>

              {/* User Profile Pill & Dropdown */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-2.5 py-1 px-2.5 rounded-xl border border-slate-200 hover:border-slate-300 bg-slate-50 hover:bg-white transition-all shadow-2xs"
                  aria-expanded={profileDropdownOpen}
                >
                  <div className="w-8 h-8 rounded-lg bg-navy text-white font-bold text-xs flex items-center justify-center">
                    {firstName.charAt(0)}
                  </div>
                  <div className="hidden sm:flex flex-col text-left">
                    <span className="text-xs font-bold text-navy leading-none">{firstName}</span>
                    <span className="text-[10px] text-slate-400 leading-tight">Verified Citizen</span>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-2xl shadow-xl py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                    <div className="px-4 py-2.5 border-b border-slate-100">
                      <p className="text-xs font-bold text-navy truncate">{displayName}</p>
                      <p className="text-[10px] text-slate-400 truncate">{currentUser?.mobile}</p>
                      <div className="mt-1 flex items-center gap-1 text-[10px] font-semibold text-[#2E7D32]">
                        <ShieldCheck className="w-3 h-3" />
                        <span>Aadhaar Authenticated</span>
                      </div>
                    </div>

                    <div className="py-1 border-b border-slate-100">
                      <Link
                        to="/citizen/profile"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 transition-colors"
                      >
                        <User className="w-4 h-4 text-slate-400" />
                        <span>Profile Settings</span>
                      </Link>
                      <Link
                        to="/citizen/applications"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 transition-colors"
                      >
                        <FileText className="w-4 h-4 text-slate-400" />
                        <span>My Applications</span>
                      </Link>
                    </div>

                    <div className="pt-1">
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="w-full text-left flex items-center gap-2.5 px-4 py-2 text-xs text-[#C53A3A] hover:bg-red-50 transition-colors font-medium"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Logout</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Body with Left Navigation Drawer & Main Content */}
      <div className="flex-1 flex w-full relative">
        {/* Desktop Sidebar Navigation */}
        <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-slate-200 shrink-0 sticky top-[68px] h-[calc(100vh-68px)] overflow-y-auto">
          <div className="p-4 space-y-1">
            <div className="px-3 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Citizen Portal Navigation
            </div>
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-navy text-white shadow-xs'
                      : 'text-slate-600 hover:text-navy hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-tealAccent-light' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-[#C53A3A] text-white">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>

          <div className="mt-auto p-4 border-t border-slate-100">
            <div className="bg-slate-50 rounded-xl p-3 space-y-1">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Signed In As</p>
              <p className="text-xs font-bold text-navy truncate">{displayName}</p>
              <p className="text-[10px] text-tealAccent font-semibold truncate">{currentUser?.mobile}</p>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="mt-3 w-full flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-[#C53A3A] hover:bg-red-50 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </aside>

        {/* Mobile Hamburger Slide-over Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-40 flex">
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-navy/60 backdrop-blur-xs transition-opacity"
              onClick={() => setMobileMenuOpen(false)}
            />

            {/* Drawer */}
            <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white shadow-2xl p-5 z-50 animate-in slide-in-from-left duration-200">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-navy flex items-center justify-center text-white">
                    <Layers className="w-4 h-4 text-tealAccent-light" />
                  </div>
                  <span className="font-bold text-navy text-sm">GeoNexus Menu</span>
                </div>
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="py-4 space-y-1 flex-1 overflow-y-auto">
                {/* Global Top-Level Navigation in Mobile Drawer */}
                <div className="pb-3 mb-2 border-b border-slate-100 space-y-1">
                  <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Global Navigation
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      setMobileMenuOpen(false);
                      handleHomeClick(e);
                    }}
                    className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-left transition-colors ${
                      location.pathname === '/'
                        ? 'bg-blue-50 text-primaryBlue border border-blue-200'
                        : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <Home className="w-4 h-4 text-primaryBlue" />
                    <span>Home (Landing Page)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setAboutModalOpen(true);
                    }}
                    className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-100 text-left transition-colors"
                  >
                    <Info className="w-4 h-4 text-primaryBlue" />
                    <span>About GeoNexus</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setHelpModalOpen(true);
                    }}
                    className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-100 text-left transition-colors"
                  >
                    <CircleHelp className="w-4 h-4 text-tealAccent" />
                    <span>Citizen Helpdesk</span>
                  </button>
                </div>

                <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Citizen Services
                </div>
                {navItems.map((item) => {
                  const isActive = location.pathname === item.path;
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                        isActive
                          ? 'bg-navy text-white'
                          : 'text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="w-4 h-4" />
                        <span>{item.label}</span>
                      </div>
                      {item.badge && (
                        <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-[#C53A3A] text-white">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>

              <div className="pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 py-2.5 bg-red-50 text-[#C53A3A] text-xs font-semibold rounded-xl"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Content Container */}
        <main
          className={`flex-1 flex flex-col min-w-0 ${
            fullWidthContent ? 'p-0' : 'p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full'
          }`}
        >
          {children}
        </main>
      </div>

      {/* Citizen Help Modal */}
      {helpModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy/50 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-navy flex items-center gap-2">
                <CircleHelp className="w-5 h-5 text-tealAccent" />
                Citizen Land Services Guide
              </h3>
              <button
                type="button"
                onClick={() => setHelpModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 text-xs text-slate-600 space-y-3 leading-relaxed">
              <p>
                <strong>What is ULPIN?</strong> Unique Land Parcel Identification Number (14 alphanumeric digits), serving as the digital Aadhaar for your land parcel.
              </p>
              <p>
                <strong>How to search?</strong> Use the smart search box to enter your Survey Number (e.g. <code>54/2B</code>), ULPIN, or Village name.
              </p>
              <p>
                <strong>Need certified extracts?</strong> You can request digital certified extracts of your Record of Rights (RoR) directly from the Parcel Profile page.
              </p>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 font-mono text-[11px] text-navy">
                National Citizen Land Helpline: 1800-11-LAND (Toll-Free)
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={() => setHelpModalOpen(false)}
                className="px-4 py-2 bg-navy text-white rounded-xl text-xs font-semibold hover:bg-navy-light"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* About Modal */}
      {aboutModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy/50 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-navy flex items-center gap-2">
                <Info className="w-5 h-5 text-primaryBlue" />
                About GeoNexus
              </h3>
              <button
                type="button"
                onClick={() => setAboutModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 text-xs text-slate-600 space-y-3 leading-relaxed">
              <p>
                <strong>GeoNexus</strong> is an integrated Digital Public Infrastructure (DPI) platform uniting Land Records, Registration, Town Planning, Survey & Settlement, and Local Governance into a seamless single-window ecosystem.
              </p>
              <p>
                Citizens can access 360° parcel profiles, submit service applications with automated departmental routing, and track end-to-end status transparently.
              </p>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-[11px] text-slate-600">
                Department of Land Resources, Ministry of Rural Development, Government of India.
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={() => setAboutModalOpen(false)}
                className="px-4 py-2 bg-navy text-white rounded-xl text-xs font-semibold hover:bg-navy-light"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
