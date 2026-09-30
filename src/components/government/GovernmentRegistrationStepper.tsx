import React from 'react';
import { Check, FileText, ShieldCheck, Clock, KeyRound } from 'lucide-react';

interface GovernmentRegistrationStepperProps {
  currentStep: number; // 1 to 4
}

interface StepConfig {
  id: number;
  label: string;
  shortLabel: string;
  icon: React.ComponentType<{ className?: string }>;
}

const STEPS: StepConfig[] = [
  { id: 1, label: 'Official Details', shortLabel: 'Official Details', icon: FileText },
  { id: 2, label: 'Verify Identity', shortLabel: 'Verify Identity', icon: ShieldCheck },
  { id: 3, label: 'Approval Status', shortLabel: 'Approval', icon: Clock },
  { id: 4, label: 'Create Password', shortLabel: 'Password', icon: KeyRound },
];

export const GovernmentRegistrationStepper: React.FC<GovernmentRegistrationStepperProps> = ({
  currentStep,
}) => {
  return (
    <div className="w-full mb-6 sm:mb-8">
      {/* Mobile Compact View */}
      <div className="sm:hidden mb-4">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-600 mb-1.5">
          <span className="text-tealAccent">Stage {currentStep} of 4</span>
          <span className="text-navy">{STEPS[currentStep - 1]?.label}</span>
        </div>
        <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-navy transition-all duration-300 rounded-full"
            style={{ width: `${(currentStep / 4) * 100}%` }}
          />
        </div>
      </div>

      {/* Desktop / Tablet Stepper */}
      <div className="hidden sm:flex items-center justify-between relative">
        {/* Background connector line */}
        <div className="absolute top-4 left-6 right-6 h-0.5 bg-slate-200 -z-0" />

        {/* Active connector line */}
        <div
          className="absolute top-4 left-6 h-0.5 bg-navy transition-all duration-300 -z-0"
          style={{
            width: `${((currentStep - 1) / (STEPS.length - 1)) * 88}%`,
          }}
        />

        {STEPS.map((step) => {
          const isCompleted = step.id < currentStep;
          const isCurrent = step.id === currentStep;
          const StepIcon = step.icon;

          return (
            <div
              key={step.id}
              className="flex flex-col items-center relative z-10 select-none group"
            >
              {/* Circle Icon Badge */}
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-200 border-2 ${
                  isCompleted
                    ? 'bg-[#2E7D32] border-[#2E7D32] text-white shadow-xs'
                    : isCurrent
                    ? 'bg-navy border-navy text-white ring-4 ring-navy/15 shadow-xs scale-105'
                    : 'bg-white border-slate-300 text-slate-400'
                }`}
              >
                {isCompleted ? (
                  <Check className="w-4 h-4 stroke-[3]" />
                ) : (
                  <StepIcon className="w-4 h-4" />
                )}
              </div>

              {/* Step Label */}
              <span
                className={`mt-2 text-xs text-center transition-colors font-medium whitespace-nowrap ${
                  isCurrent
                    ? 'text-navy font-bold'
                    : isCompleted
                    ? 'text-[#2E7D32]'
                    : 'text-slate-400'
                }`}
              >
                {step.shortLabel}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

