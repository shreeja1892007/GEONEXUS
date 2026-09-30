import React from 'react';
import type { DynamicFieldDefinition } from '../../types/citizenService';

interface DynamicApplicationFormProps {
  fields: DynamicFieldDefinition[];
  values: Record<string, string>;
  onChange: (id: string, value: string) => void;
  errors?: Record<string, string>;
}

export const DynamicApplicationForm: React.FC<DynamicApplicationFormProps> = ({
  fields,
  values,
  onChange,
  errors = {},
}) => {
  if (fields.length === 0) {
    return (
      <p className="text-xs text-slate-400 text-center py-4">
        No additional details required for this purpose.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {fields.map((field) => {
        const error = errors[field.id];
        const baseInputClass = `w-full px-3 text-sm text-navy bg-white border rounded-xl transition-all focus:outline-none focus:ring-2 ${
          error
            ? 'border-red-400 focus:border-red-400 focus:ring-red-400/20'
            : 'border-slate-300 focus:border-navy focus:ring-navy/10'
        }`;

        const isFullWidth = field.type === 'textarea' || (field.options && field.options.length > 4);

        return (
          <div
            key={field.id}
            className={`flex flex-col gap-1.5 ${isFullWidth ? 'sm:col-span-2' : ''}`}
          >
            <label className="text-xs font-semibold text-navy flex items-center gap-1">
              {field.label}
              {field.required && <span className="text-red-500">*</span>}
            </label>

            {field.type === 'textarea' ? (
              <textarea
                value={values[field.id] || ''}
                onChange={(e) => onChange(field.id, e.target.value)}
                placeholder={field.placeholder}
                rows={field.rows || 3}
                className={`${baseInputClass} py-2 resize-none`}
              />
            ) : field.type === 'select' && field.options ? (
              <select
                value={values[field.id] || ''}
                onChange={(e) => onChange(field.id, e.target.value)}
                className={`${baseInputClass} h-10`}
              >
                <option value="">Select...</option>
                {field.options.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            ) : (
              <input
                type={field.type}
                value={values[field.id] || ''}
                onChange={(e) => onChange(field.id, e.target.value)}
                placeholder={field.placeholder}
                className={`${baseInputClass} h-10`}
              />
            )}

            {field.helperText && !error && (
              <p className="text-[11px] text-slate-400">{field.helperText}</p>
            )}
            {error && <p className="text-[11px] text-red-500">{error}</p>}
          </div>
        );
      })}
    </div>
  );
};
