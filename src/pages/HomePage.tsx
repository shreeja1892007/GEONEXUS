import React from 'react';
import { Link } from 'react-router-dom';
import { User, Building2, ArrowRight, ShieldCheck } from 'lucide-react';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { CadastralPattern } from '../components/ui/CadastralPattern';

export const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#F5F7F9] text-[#1D2733] relative selection:bg-primaryBlue/10 selection:text-primaryBlue">
      <Header />

      <main className="flex-1 flex flex-col relative overflow-hidden">
        {/* Subtle Cadastral / GIS Parcel Grid Pattern */}
        <CadastralPattern />

        {/* Hero Section */}
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16 pb-12 relative z-10 flex-1 flex flex-col justify-center">
          <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
            {/* DPI Tag */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-slate-200 shadow-2xs mb-5">
              <span className="w-2 h-2 rounded-full bg-tealAccent animate-pulse" />
              <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Digital Public Infrastructure
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-navy tracking-tight leading-tight sm:leading-tight">
              GeoNexus
            </h1>
            <p className="mt-2 text-lg sm:text-xl font-semibold text-primaryBlue tracking-tight">
              Unified Digital Platform for Land Governance
            </p>
            <p className="mt-4 text-sm sm:text-base text-[#657281] max-w-2xl mx-auto leading-relaxed">
              Access land services through a secure, integrated and GIS-enabled digital platform.
            </p>
          </div>

          {/* Two Primary Authentication Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto w-full mb-14">
            {/* CITIZEN CARD */}
            <div className="bg-white rounded-card p-6 sm:p-8 border border-slate-200/90 shadow-card hover:shadow-card-hover transition-all duration-200 flex flex-col justify-between group">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-primaryBlue mb-6 group-hover:scale-105 transition-transform">
                  <User className="w-7 h-7 text-primaryBlue" />
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-navy tracking-tight mb-2">
                  Citizen Login
                </h2>
                <p className="text-sm text-[#657281] leading-relaxed mb-6">
                  Access citizen land services securely.
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
                <Link
                  to="/citizen/login"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-primaryBlue hover:bg-primaryBlue-hover text-white font-medium text-sm rounded-button transition-all shadow-button active:scale-[0.99] focus:outline-none focus:ring-2 focus:ring-primaryBlue focus:ring-offset-2"
                >
                  <span>Login</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                </Link>

                <Link
                  to="/citizen/register"
                  className="text-xs font-semibold text-primaryBlue hover:underline p-1 text-center"
                >
                  New citizen? Register
                </Link>
              </div>
            </div>

            {/* GOVERNMENT CARD */}
            <div className="bg-white rounded-card p-6 sm:p-8 border border-slate-200/90 shadow-card hover:shadow-card-hover transition-all duration-200 flex flex-col justify-between group">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center text-navy mb-6 group-hover:scale-105 transition-transform">
                  <Building2 className="w-7 h-7 text-navy" />
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-navy tracking-tight mb-2">
                  Government Login
                </h2>
                <p className="text-sm text-[#657281] leading-relaxed mb-6">
                  Secure departmental access for authorised officials.
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <Link
                  to="/government/login"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-navy hover:bg-navy-light text-white font-medium text-sm rounded-button transition-all shadow-sm active:scale-[0.99] focus:outline-none focus:ring-2 focus:ring-navy focus:ring-offset-2"
                >
                  <span>Login</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                </Link>

                <span className="hidden sm:inline-flex items-center gap-1 text-xs text-slate-400 font-medium">
                  <ShieldCheck className="w-3.5 h-3.5 text-tealAccent" />
                  Official SSO
                </span>
              </div>
            </div>
          </div>

          {/* Minimal Lower Section: Integrated Land Governance Domains */}
          <div className="max-w-4xl mx-auto w-full pt-4 pb-6 text-center">
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">
              Integrated Land Governance
            </h3>
            <div className="inline-flex flex-wrap items-center justify-center gap-2 sm:gap-4 px-4 py-2.5 bg-white/70 backdrop-blur-xs border border-slate-200/80 rounded-full text-xs font-medium text-[#173B57]">
              <span>Cadastral Maps</span>
              <span className="text-slate-300">•</span>
              <span>Record of Rights</span>
              <span className="text-slate-300">•</span>
              <span>Registration</span>
              <span className="text-slate-300">•</span>
              <span>Planning</span>
              <span className="text-slate-300">•</span>
              <span>GIS</span>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};
