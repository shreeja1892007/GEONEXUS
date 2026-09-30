import React, { useState } from 'react';
import { ShieldCheck } from 'lucide-react';

export const Footer: React.FC = () => {
  const [modalContent, setModalContent] = useState<{ title: string; body: string } | null>(null);

  const showPolicy = (title: string, body: string) => {
    setModalContent({ title, body });
  };

  return (
    <>
      <footer className="w-full bg-[#112B40] text-slate-300 text-xs py-8 border-t border-slate-700/60 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 pb-6 border-b border-slate-700/50">
            {/* Left Gov Info */}
            <div className="flex flex-col sm:flex-row items-center gap-3 text-center sm:text-left">
              <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-tealAccent-light">
                <ShieldCheck className="w-5 h-5 text-tealAccent-light" />
              </div>
              <div>
                <p className="font-semibold text-white tracking-wide">
                  Department of Land Resources
                </p>
                <p className="text-[11px] text-slate-400">
                  Ministry of Rural Development, Government of India
                </p>
              </div>
            </div>

            {/* Middle / Right Navigation Links */}
            <nav className="flex flex-wrap items-center justify-center gap-6 text-slate-300 font-medium">
              <button
                type="button"
                onClick={() =>
                  showPolicy(
                    'Privacy Policy',
                    'GeoNexus adheres strictly to the Digital Personal Data Protection (DPDP) Act, 2023. No biometric or Aadhaar data is permanently stored on prototype servers. Personal credentials and contact details are encrypted in transit and at rest in strict compliance with Government of India cybersecurity guidelines.'
                  )
                }
                className="hover:text-white transition-colors underline-offset-4 hover:underline"
              >
                Privacy
              </button>
              <button
                type="button"
                onClick={() =>
                  showPolicy(
                    'Terms of Service',
                    'By accessing GeoNexus, citizens and officials agree to use the platform solely for lawful land governance purposes. Unauthorized attempts to bypass verification or tamper with cadastral data will attract stringent penal action under the Information Technology Act.'
                  )
                }
                className="hover:text-white transition-colors underline-offset-4 hover:underline"
              >
                Terms
              </button>
              <button
                type="button"
                onClick={() =>
                  showPolicy(
                    'Contact Us',
                    'Department of Land Resources, NBO Building, Nirman Bhawan, New Delhi - 110011. Phone: 011-23062300. Prototype Technical Desk: contact@geonexus.gov.in.'
                  )
                }
                className="hover:text-white transition-colors underline-offset-4 hover:underline"
              >
                Contact
              </button>
              <button
                type="button"
                onClick={() =>
                  showPolicy(
                    'Help & Accessibility',
                    'For citizen onboarding support or accessibility inquiries, call 1800-11-LAND. Prototype OTP for verification is 123456.'
                  )
                }
                className="hover:text-white transition-colors underline-offset-4 hover:underline"
              >
                Help
              </button>
            </nav>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-400 gap-2 text-center sm:text-left">
            <p>
              © {new Date().getFullYear()} Department of Land Resources, Government of India. All rights reserved.
            </p>
            <div className="flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>DPI Land Governance Prototype v1.0</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Policy / Informational Modal */}
      {modalContent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="text-base font-bold text-navy pb-2 border-b border-slate-100">
              {modalContent.title}
            </h3>
            <p className="mt-3 text-xs text-slate-600 leading-relaxed">
              {modalContent.body}
            </p>
            <div className="mt-5 flex justify-end">
              <button
                type="button"
                onClick={() => setModalContent(null)}
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
