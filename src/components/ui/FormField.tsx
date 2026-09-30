import React, { forwardRef } from 'react';
import { AlertCircle } from 'lucide-react';

interface FormFieldProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'prefix'> {
  label: string;
  error?: string | null;
  helperText?: string;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  containerClassName?: string;
  isReadOnlyBadge?: boolean;
}

export const FormField = forwardRef<HTMLInputElement, FormFieldProps>(
  (
    {
      label,
      error,
      helperText,
      prefix,
      suffix,
      required,
      className = '',
      containerClassName = '',
      id,
      isReadOnlyBadge = false,
      readOnly,
      disabled,
      ...props
    },
    ref
  ) => {
    const inputId = id || `field-${label.toLowerCase().replace(/\s+/g, '-')}`;

    return (
      <div className={`w-full flex flex-col gap-1.5 ${containerClassName}`}>
        <label
          htmlFor={inputId}
          className="text-xs font-semibold text-[#1D2733] flex items-center gap-1 select-none"
        >
          <span>{label}</span>
          {required && <span className="text-[#C53A3A] font-bold">*</span>}
        </label>

        <div
          className={`relative flex items-center w-full transition-all duration-150 rounded-xl border ${
            error
              ? 'border-[#C53A3A] bg-red-50/20 ring-1 ring-[#C53A3A]/20'
              : readOnly && isReadOnlyBadge
              ? 'border-slate-200 bg-slate-100/80 text-slate-700'
              : 'border-slate-300 bg-white hover:border-slate-400 focus-within:border-[#246BCE] focus-within:ring-2 focus-within:ring-[#246BCE]/20'
          }`}
        >
          {prefix && (
            <div className="pl-3.5 pr-2 flex items-center justify-center text-xs font-semibold text-slate-500 select-none border-r border-slate-200 my-2">
              {prefix}
            </div>
          )}

          <input
            ref={ref}
            id={inputId}
            readOnly={readOnly}
            disabled={disabled}
            aria-invalid={!!error}
            aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined}
            className={`w-full h-11 px-3.5 text-sm text-[#1D2733] placeholder:text-slate-400 bg-transparent focus:outline-none disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400 rounded-xl ${
              prefix ? 'pl-2.5' : ''
            } ${suffix ? 'pr-10' : ''} ${className}`}
            {...props}
          />

          {suffix && (
            <div className="absolute right-3.5 flex items-center pointer-events-auto">
              {suffix}
            </div>
          )}
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

FormField.displayName = 'FormField';
