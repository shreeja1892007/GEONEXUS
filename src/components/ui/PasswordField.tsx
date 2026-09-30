import React, { useState, forwardRef } from 'react';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';

interface PasswordFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string | null;
  helperText?: string;
  containerClassName?: string;
}

export const PasswordField = forwardRef<HTMLInputElement, PasswordFieldProps>(
  ({ label, error, helperText, required, className = '', containerClassName = '', id, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const inputId = id || `password-${label.toLowerCase().replace(/\s+/g, '-')}`;

    return (
      <div className={`w-full flex flex-col gap-1.5 ${containerClassName}`}>
        <div className="flex items-center justify-between">
          <label
            htmlFor={inputId}
            className="text-xs font-semibold text-[#1D2733] flex items-center gap-1 select-none"
          >
            <span>{label}</span>
            {required && <span className="text-[#C53A3A] font-bold">*</span>}
          </label>
        </div>

        <div
          className={`relative flex items-center w-full rounded-xl border transition-all duration-150 ${
            error
              ? 'border-[#C53A3A] bg-red-50/20 ring-1 ring-[#C53A3A]/20'
              : 'border-slate-300 bg-white hover:border-slate-400 focus-within:border-[#246BCE] focus-within:ring-2 focus-within:ring-[#246BCE]/20'
          }`}
        >
          <input
            ref={ref}
            id={inputId}
            type={showPassword ? 'text' : 'password'}
            aria-invalid={!!error}
            aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined}
            className={`w-full h-11 pl-3.5 pr-11 text-sm text-[#1D2733] placeholder:text-slate-400 bg-transparent focus:outline-none rounded-xl ${className}`}
            {...props}
          />

          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-2.5 p-1.5 text-slate-400 hover:text-slate-700 focus:outline-none focus:text-primaryBlue rounded-md transition-colors"
            title={showPassword ? 'Hide password' : 'Show password'}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>

        {error && (
          <p
            id={`${inputId}-error`}
            className="text-xs text-[#C53A3A] flex items-center gap-1 mt-0.5 animate-in fade-in"
          >
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            <span>{error}</span>
          </p>
        )}

        {!error && helperText && (
          <p id={`${inputId}-helper`} className="text-[11px] text-slate-500 mt-0.5">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

PasswordField.displayName = 'PasswordField';

