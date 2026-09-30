import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Globe, HelpCircle, Info, Eye, Layers, Home, Menu, X } from 'lucide-react';
import { useHomeNavigation } from '../../hooks/useHomeNavigation';
import { LogoutConfirmModal } from '../common/LogoutConfirmModal';

export const Header: React.FC = () => {
  const location = useLocation();
  const {
    isModalOpen,
    modalTitle,
    modalMessage,
    handleHomeClick,
    confirmLogout,
    closeModal,
  } = useHomeNavigation();

  const [currentLang, setCurrentLang] = useState('English');
  const [showLangDropdown, setShowLangDropdown] = useState(false);
  const [fontSizeOffset, setFontSizeOffset] = useState(0);
  const [showAboutModal, setShowAboutModal] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isHome = location.pathname === '/';
  const languages = ['English', 'हिन्दी (Hindi)', 'বাংলা (Bengali)', 'मराठी (Marathi)', 'தமிழ் (Tamil)'];

  const toggleFontSize = () => {
    const nextOffset = fontSizeOffset >= 2 ? 0 : fontSizeOffset + 1;
    setFontSizeOffset(nextOffset);
    if (nextOffset === 0) {
      document.documentElement.style.fontSize = '16px';
    } else if (nextOffset === 1) {
      document.documentElement.style.fontSize = '17.5px';
    } else {
      document.documentElement.style.fontSize = '19px';
    }
  };

  return (
    <>
      <LogoutConfirmModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onConfirm={confirmLogout}
        title={modalTitle}
        message={modalMessage}
      />

      <header className="w-full bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
        {/* Top Government Tricolor Stripe */}
        <div className="h-1 w-full bg-gradient-to-r from-[#FF9933] via-white to-[#138808]" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Left Brand Area */}
            <div className="flex items-center gap-3.5 group">
              <button
                type="button"
                onClick={handleHomeClick}
                className="flex items-center gap-3.5 focus:outline-none focus:ring-2 focus:ring-primaryBlue rounded-lg p-1 text-left"
              >
                {/* National Emblem & GeoNexus Seal Icon */}
                <div className="w-12 h-12 rounded-xl bg-navy flex items-center justify-center text-white shadow-sm transition-transform group-hover:scale-105">
                  <Layers className="w-6 h-6 text-tealAccent-light" />
                </div>

                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-semibold tracking-wider text-slate-500 uppercase">
                      Government of India
                    </span>
                    <span className="text-slate-300">|</span>
                    <span className="text-[11px] font-medium text-slate-500">
                      Department of Land Resources
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-bold tracking-tight text-navy">
                      GeoNexus
                    </span>
                    <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-semibold bg-tealAccent-light text-tealAccent rounded-full border border-tealAccent/20">
                      DPI Platform
                    </span>
                  </div>
                </div>
              </button>
            </div>

            {/* Right Action Controls */}
            <div className="flex items-center gap-2 sm:gap-4">
              {/* Primary Top Header Nav: Home | About | Help */}
              <nav aria-label="Global Header Navigation" className="flex items-center gap-1 sm:gap-2">
                {/* Home Button - Visible on all viewports */}
                <button
                  type="button"
                  onClick={handleHomeClick}
                  className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-primaryBlue ${
                    isHome
                      ? 'text-primaryBlue bg-blue-50 border border-blue-200 shadow-2xs'
                      : 'text-slate-600 hover:text-navy hover:bg-slate-50 border border-transparent'
                  }`}
                  title="GeoNexus Main Landing Page"
                >
                  <Home className="w-3.5 h-3.5 text-primaryBlue" />
                  <span>Home</span>
                </button>

                <span className="text-slate-200 text-xs hidden sm:inline select-none">|</span>

                {/* About Button */}
                <button
                  type="button"
                  onClick={() => setShowAboutModal(true)}
                  className="hidden sm:flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-navy hover:bg-slate-50 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-primaryBlue"
                  title="About GeoNexus"
                >
                  <Info className="w-3.5 h-3.5 text-primaryBlue" />
                  <span>About</span>
                </button>

                <span className="text-slate-200 text-xs hidden sm:inline select-none">|</span>

                {/* Help Button */}
                <button
                  type="button"
                  onClick={() => setShowHelpModal(true)}
                  className="hidden sm:flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-navy hover:bg-slate-50 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-primaryBlue"
                  title="Help and Support"
                >
                  <HelpCircle className="w-3.5 h-3.5 text-tealAccent" />
                  <span>Help</span>
                </button>
              </nav>

              {/* Accessibility Font Size Toggle */}
              <button
                type="button"
                onClick={toggleFontSize}
                className="hidden xs:flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-primaryBlue"
                title="Accessibility: Adjust text size"
                aria-label="Toggle text size"
              >
                <Eye className="w-3.5 h-3.5 text-slate-600" />
                <span className="font-mono">A{fontSizeOffset > 0 ? `+${fontSizeOffset}` : ''}</span>
              </button>

              {/* Language Selector */}
              <div className="relative hidden xs:block">
                <button
                  type="button"
                  onClick={() => setShowLangDropdown(!showLangDropdown)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 border border-slate-300 rounded-lg hover:border-slate-400 bg-white transition-all shadow-2xs focus:outline-none focus:ring-2 focus:ring-primaryBlue"
                  aria-expanded={showLangDropdown}
                >
                  <Globe className="w-3.5 h-3.5 text-primaryBlue" />
                  <span className="hidden sm:inline">{currentLang.split(' ')[0]}</span>
                  <span className="text-[10px] text-slate-400">▼</span>
                </button>

                {showLangDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-xl shadow-lg py-1.5 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                    <div className="px-3 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                      Select Language
                    </div>
                    {languages.map((lang) => (
                      <button
                        key={lang}
                        type="button"
                        onClick={() => {
                          setCurrentLang(lang);
                          setShowLangDropdown(false);
                        }}
                        className={`w-full text-left px-3 py-1.5 text-xs hover:bg-slate-50 transition-colors ${
                          currentLang === lang ? 'font-bold text-navy bg-slate-50' : 'text-slate-700'
                        }`}
                      >
                        {lang}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Mobile Drawer Button */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="sm:hidden p-2 text-slate-600 hover:text-navy hover:bg-slate-100 rounded-lg transition-colors"
                aria-label="Toggle Menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="sm:hidden bg-white border-t border-slate-100 px-4 py-3 space-y-3 animate-in slide-in-from-top-2 duration-150">
            <div className="space-y-1">
              <button
                type="button"
                onClick={(e) => {
                  setMobileMenuOpen(false);
                  handleHomeClick(e);
                }}
                className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-left transition-colors ${
                  isHome ? 'text-primaryBlue bg-blue-50' : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <Home className="w-4 h-4 text-primaryBlue" />
                <span>Home</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  setShowAboutModal(true);
                }}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50 text-left"
              >
                <Info className="w-4 h-4 text-primaryBlue" />
                <span>About GeoNexus</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  setShowHelpModal(true);
                }}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50 text-left"
              >
                <HelpCircle className="w-4 h-4 text-tealAccent" />
                <span>Citizen Support & Help</span>
              </button>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
              <span className="font-medium">Text Size:</span>
              <button
                type="button"
                onClick={toggleFontSize}
                className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-slate-700 bg-slate-100 rounded-lg"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>A{fontSizeOffset > 0 ? `+${fontSizeOffset}` : ''}</span>
              </button>
            </div>
          </div>
        )}
      </header>

      {/* About Modal */}
      {showAboutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy/40 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-navy flex items-center gap-2">
                <Info className="w-5 h-5 text-primaryBlue" />
                About GeoNexus
              </h3>
              <button
                type="button"
                onClick={() => setShowAboutModal(false)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-lg text-lg"
              >
                ✕
              </button>
            </div>
            <div className="mt-4 text-sm text-slate-600 space-y-3 leading-relaxed">
              <p>
                <strong>GeoNexus</strong> is India's Digital Public Infrastructure for Land Governance, built under the aegis of the Department of Land Resources, Ministry of Rural Development, Government of India.
              </p>
              <p>
                It unifies geospatial cadastral data, Record of Rights (RoR), automated land registration, and multi-department planning into a single, high-trust digital ecosystem.
              </p>
            </div>
            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={() => setShowAboutModal(false)}
                className="px-4 py-2 bg-navy text-white rounded-button text-xs font-semibold hover:bg-navy-light"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Help Modal */}
      {showHelpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy/40 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-navy flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-tealAccent" />
                Citizen Support & Help
              </h3>
              <button
                type="button"
                onClick={() => setShowHelpModal(false)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-lg text-lg"
              >
                ✕
              </button>
            </div>
            <div className="mt-4 text-sm text-slate-600 space-y-3">
              <p>For assistance with Citizen Registration, Aadhaar Verification, or Login:</p>
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80 space-y-1.5 text-xs">
                <div><strong>National Land Helpline:</strong> 1800-11-LAND (Toll-Free)</div>
                <div><strong>Email Support:</strong> support-geonexus@gov.in</div>
                <div><strong>Operating Hours:</strong> 09:00 AM – 06:00 PM (IST)</div>
              </div>
              <p className="text-xs text-slate-500">
                Note: This prototype uses simulated verification. For testing, use Demo OTP <span className="font-mono font-semibold text-navy">123456</span>.
              </p>
            </div>
            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={() => setShowHelpModal(false)}
                className="px-4 py-2 bg-navy text-white rounded-button text-xs font-semibold hover:bg-navy-light"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
