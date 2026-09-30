import React from 'react';
import { Check } from 'lucide-react';

const STEPS = [
  { number: 1, label: 'Purpose' },
  { number: 2, label: 'Location' },
  { number: 3, label: 'Details' },
  { number: 4, label: 'Documents' },
  { number: 5, label: 'Review' },
  { number: 6, label: 'Submitted' },
];

interface ApplicationStepperProps {
  currentStep: number; // 1-6
}

export const ApplicationStepper: React.FC<ApplicationStepperProps> = ({ currentStep }) => {
  return (
    <div className="w-full overflow-x-auto">
      <div className="flex items-center min-w-max mx-auto">
        {STEPS.map((step, idx) => {
          const isDone = step.number < currentStep;
          const isActive = step.number === currentStep;
          const isLast = idx === STEPS.length - 1;

          return (
            <React.Fragment key={step.number}>
              <div className="flex flex-col items-center gap-1">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                    isDone
                      ? 'bg-[#2E7D32] text-white'
                      : isActive
                      ? 'bg-navy text-white ring-4 ring-navy/20'
                      : 'bg-slate-200 text-slate-500'
                  }`}
                >
                  {isDone ? <Check className="w-4 h-4" /> : step.number}
                </div>
                <span
                  className={`text-[10px] font-semibold whitespace-nowrap ${
                    isActive ? 'text-navy' : isDone ? 'text-[#2E7D32]' : 'text-slate-400'
                  }`}
                >
                  {step.label}
                </span>
              </div>
              {!isLast && (
                <div
                  className={`h-0.5 w-8 sm:w-12 mx-1 transition-colors ${
                    isDone ? 'bg-[#2E7D32]' : 'bg-slate-200'
                  }`}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
