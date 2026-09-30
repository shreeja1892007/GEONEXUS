import React from 'react';
import { AlertTriangle } from 'lucide-react';
import type { GuardianDetails, GuardianRelationship } from '../../types/auth';
import { FormField } from '../ui/FormField';

interface MinorGuardianFieldsProps {
  guardian: GuardianDetails;
  onChange: <K extends keyof GuardianDetails>(field: K, value: GuardianDetails[K]) => void;
  errors: Record<string, string>;
}

export const MinorGuardianFields: React.FC<MinorGuardianFieldsProps> = ({
  guardian,
  onChange,
  errors,
}) => {
  const relationships: GuardianRelationship[] = ['Father', 'Mother', 'Legal Guardian', 'Other'];

  return (
    <div className="mt-4 p-4.5 bg-[#FEF6E9]/50 border border-[#E99A24]/40 rounded-2xl animate-in fade-in slide-in-from-top-2 duration-200">
      {/* Minor Notice Banner */}
      <div className="flex items-start gap-3 pb-3 border-b border-[#E99A24]/20 mb-4">
        <div className="p-1.5 bg-[#E99A24]/15 rounded-lg text-[#965A08] mt-0.5">
          <AlertTriangle className="w-4 h-4 text-[#E99A24]" />
        </div>
        <div>
          <h4 className="text-xs font-bold text-[#965A08] uppercase tracking-wide flex items-center gap-1.5">
            Minor Applicant
          </h4>
          <p className="text-xs text-slate-700 mt-0.5">
            The applicant is below 18 years of age. Parent or guardian details are required.
          </p>
        </div>
      </div>

      <div className="space-y-3.5">
        {/* Parent / Guardian Name */}
        <FormField
          label="Parent / Guardian Name"
          required
          placeholder="Enter parent or guardian's full name"
          value={guardian.name}
          onChange={(e) => onChange('name', e.target.value)}
          error={errors.guardianName}
          helperText="As mentioned in official identification documents"
        />

        {/* Relationship Dropdown */}
        <div className="w-full flex flex-col gap-1.5">
          <label
            htmlFor="guardian-relationship"
            className="text-xs font-semibold text-[#1D2733] flex items-center gap-1 select-none"
          >
            <span>Relationship</span>
            <span className="text-[#C53A3A] font-bold">*</span>
          </label>

          <select
            id="guardian-relationship"
            value={guardian.relationship}
            onChange={(e) => onChange('relationship', e.target.value as GuardianRelationship)}
            className="w-full h-11 px-3.5 text-sm text-[#1D2733] bg-white border border-slate-300 rounded-xl focus:border-[#246BCE] focus:ring-2 focus:ring-[#246BCE]/20 focus:outline-none transition-all"
          >
            {relationships.map((rel) => (
              <option key={rel} value={rel}>
                {rel}
              </option>
            ))}
          </select>
        </div>

        {/* Conditional "Specify Relationship" if Other is selected */}
        {guardian.relationship === 'Other' && (
          <div className="animate-in fade-in slide-in-from-top-1 duration-150">
            <FormField
              label="Specify Relationship"
              required
              placeholder="e.g. Grandparent, Uncle, Court-Appointed Custodian"
              value={guardian.otherRelationship || ''}
              onChange={(e) => onChange('otherRelationship', e.target.value)}
              error={errors.guardianOtherRelationship}
            />
          </div>
        )}
      </div>
    </div>
  );
};
