import React from 'react';
import { Check, X } from 'lucide-react';
import { evaluatePassword } from '../../utils/formatters';

interface PasswordStrengthProps {
  password: string;
}

export const PasswordStrength: React.FC<PasswordStrengthProps> = ({ password }) => {
  const criteria = evaluatePassword(password);

  const rules = [
    { label: 'Minimum 8 characters', met: criteria.minLength },
    { label: 'At least 1 uppercase letter', met: criteria.hasUppercase },
    { label: 'At least 1 lowercase letter', met: criteria.hasLowercase },
    { label: 'At least 1 number', met: criteria.hasNumber },
    { label: 'At least 1 special character', met: criteria.hasSpecial },
  ];

  const strengthColors = {
    Weak: 'bg-[#C53A3A]',
    Medium: 'bg-[#E99A24]',
    Strong: 'bg-[#2E7D32]',
  };

  const strengthTextColors = {
    Weak: 'text-[#C53A3A]',
    Medium: 'text-[#E99A24]',
    Strong: 'text-[#2E7D32]',
  };

  if (!password) {
    return (
      <div className="mt-2 p-3 bg-slate-50 border border-slate-200/80 rounded-xl space-y-1.5">
        <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
          Password Requirements:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs text-slate-500">
          {rules.map((rule) => (
            <div key={rule.label} className="flex items-center gap-1.5">
              <span className="w-3.5 h-3.5 rounded-full border border-slate-300 flex items-center justify-center text-[10px] text-slate-300">
                •
              </span>
              <span>{rule.label}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mt-2.5 p-3.5 bg-slate-50/90 border border-slate-200/90 rounded-xl space-y-3">
      {/* Strength Bar */}
      <div>
        <div className="flex items-center justify-between text-xs mb-1.5">
          <span className="text-slate-600 font-medium">Password Strength:</span>
          <span className={`font-bold ${strengthTextColors[criteria.strength]}`}>
            {criteria.strength}
          </span>
        </div>
        <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden flex gap-1">
          <div
            className={`h-full transition-all duration-300 rounded-full ${
              strengthColors[criteria.strength]
            }`}
            style={{ width: `${criteria.strengthPercentage}%` }}
          />
        </div>
      </div>

      {/* Dynamic Requirements Checklist */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-1 border-t border-slate-200/60 text-xs">
        {rules.map((rule) => (
          <div
            key={rule.label}
            className={`flex items-center gap-1.5 transition-colors ${
              rule.met ? 'text-[#2E7D32] font-medium' : 'text-slate-500'
            }`}
          >
            {rule.met ? (
              <span className="w-4 h-4 rounded-full bg-emerald-100 flex items-center justify-center text-[#2E7D32] shrink-0">
                <Check className="w-2.5 h-2.5 stroke-[3]" />
              </span>
            ) : (
              <span className="w-4 h-4 rounded-full bg-slate-200/70 flex items-center justify-center text-slate-400 shrink-0">
                <X className="w-2.5 h-2.5 stroke-[2]" />
              </span>
            )}
            <span>{rule.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

