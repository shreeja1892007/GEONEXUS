import React from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { CadastralPattern } from '../ui/CadastralPattern';

interface AuthLayoutProps {
  children: React.ReactNode;
  showPattern?: boolean;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children, showPattern = true }) => {
  return (
    <div className="min-h-screen flex flex-col bg-[#F5F7F9] text-[#1D2733] relative selection:bg-primaryBlue/10 selection:text-primaryBlue">
      <Header />
      
      <main className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 relative">
        {showPattern && <CadastralPattern />}
        <div className="w-full max-w-xl mx-auto relative z-10 my-4 sm:my-8">
          {children}
        </div>
      </main>

      <Footer />
    </div>
  );
};

