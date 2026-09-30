import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { AuthLayout } from '../../components/layout/AuthLayout';
import { GovernmentRegistrationStepper } from '../../components/government/GovernmentRegistrationStepper';
import { FormField } from '../../components/ui/FormField';
import { Button } from '../../components/ui/Button';
import { useGovernmentRegistration } from '../../context/GovernmentRegistrationContext';
import {
  GOVERNMENT_DEPARTMENTS,
  INDIAN_STATES_UTS,
  getRolesForDepartment,
} from '../../types/auth';

export const Step1OfficialDetails: React.FC = () => {
  const navigate = useNavigate();
  const { formData, setFormField } = useGovernmentRegistration();

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const fullNameRef = useRef<HTMLInputElement>(null);
  const employeeIdRef = useRef<HTMLInputElement>(null);
  const designationRef = useRef<HTMLInputElement>(null);
  const districtOfficeRef = useRef<HTMLInputElement>(null);

  const availableRoles = getRolesForDepartment(formData.department);

  const handleDepartmentChange = (newDept: string) => {
    setFormField('department', newDept);
    const validRoles = getRolesForDepartment(newDept);
    if (!validRoles.includes(formData.officialRole as any)) {
      setFormField('officialRole', validRoles[0] || 'Land Records Officer');
    }
  };

  const validate = (field: string, val: string): string => {
    switch (field) {
      case 'fullName':
        if (!val || !val.trim()) return 'Full legal name is required.';
        if (!/^[a-zA-Z\s'.]+$/.test(val.trim())) return 'Only alphabetic letters and spaces allowed.';
        if (val.trim().length < 3) return 'Name must be at least 3 characters.';
        return '';
      case 'employeeId':
        if (!val || !val.trim()) return 'Employee ID / Service ID is required.';
        if (val.trim().length < 3) return 'Please enter a valid Employee / Service ID.';
        return '';
      case 'department':
        if (!val) return 'Department / Organisation is required.';
        return '';
      case 'designation':
        if (!val || !val.trim()) return 'Designation is required.';
        return '';
      case 'officialRole':
        if (!val) return 'Official Role is required.';
        return '';
      case 'state':
        if (!val) return 'State / Union Territory is required.';
        return '';
      case 'districtOffice':
        if (!val || !val.trim()) return 'District / Office is required.';
        return '';
      default:
        return '';
    }
  };

  const handleBlur = (field: string, val: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const error = validate(field, val);
    setErrors((prev) => ({ ...prev, [field]: error }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: Record<string, string> = {
      fullName: validate('fullName', formData.fullName),
      employeeId: validate('employeeId', formData.employeeId),
      department: validate('department', formData.department),
      designation: validate('designation', formData.designation),
      officialRole: validate('officialRole', formData.officialRole),
      state: validate('state', formData.state),
      districtOffice: validate('districtOffice', formData.districtOffice),
    };

    const activeErrors: Record<string, string> = {};
    Object.keys(newErrors).forEach((key) => {
      if (newErrors[key]) activeErrors[key] = newErrors[key];
    });

    setErrors(activeErrors);
    setTouched({
      fullName: true,
      employeeId: true,
      department: true,
      designation: true,
      officialRole: true,
      state: true,
      districtOffice: true,
    });

    if (Object.keys(activeErrors).length > 0) {
      if (activeErrors.fullName) fullNameRef.current?.focus();
      else if (activeErrors.employeeId) employeeIdRef.current?.focus();
      else if (activeErrors.designation) designationRef.current?.focus();
      else if (activeErrors.districtOffice) districtOfficeRef.current?.focus();
      return;
    }

    navigate('/government/register/verification');
  };

  return (
    <AuthLayout>
      <div className="bg-white rounded-card p-6 sm:p-8 border border-slate-200 shadow-card max-w-2xl mx-auto">
        <GovernmentRegistrationStepper currentStep={1} />

        <div className="mb-6">
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 text-[10px] font-bold bg-navy/10 text-navy rounded uppercase tracking-wider">
              Official Request
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-navy tracking-tight">
            Request Government Access
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Step 1 of 4 — Official Details
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          {/* Full Name */}
          <FormField
            ref={fullNameRef}
            label="Full Name"
            required
            placeholder="e.g. Dr. Ramesh Kumar"
            value={formData.fullName}
            onChange={(e) => setFormField('fullName', e.target.value)}
            onBlur={(e) => handleBlur('fullName', e.target.value)}
            error={touched.fullName ? errors.fullName : undefined}
            helperText="As recorded in service book or government establishment roll"
          />

          {/* Employee ID & Department */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
              ref={employeeIdRef}
              label="Employee ID / Service ID"
              required
              placeholder="e.g. DLR-EMP-1042"
              value={formData.employeeId}
              onChange={(e) => setFormField('employeeId', e.target.value.toUpperCase())}
              onBlur={(e) => handleBlur('employeeId', e.target.value)}
              error={touched.employeeId ? errors.employeeId : undefined}
              helperText="Examples: DLR-EMP-1042, TN-REV-3821"
            />

            <div className="w-full flex flex-col gap-1.5">
              <label
                htmlFor="gov-reg-department"
                className="text-xs font-semibold text-[#1D2733] flex items-center gap-1 select-none"
              >
                <span>Department / Organisation</span>
                <span className="text-[#C53A3A] font-bold">*</span>
              </label>
              <select
                id="gov-reg-department"
                value={formData.department}
                onChange={(e) => handleDepartmentChange(e.target.value)}
                className="w-full h-11 px-3.5 text-sm text-[#1D2733] bg-white border border-slate-300 rounded-xl focus:border-navy focus:ring-2 focus:ring-navy/20 focus:outline-none transition-all"
              >
                {!formData.department && (
                  <option value="" disabled>
                    [ Select Department ▼ ]
                  </option>
                )}
                {GOVERNMENT_DEPARTMENTS.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Designation & Official Role */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
              ref={designationRef}
              label="Designation"
              required
              placeholder="e.g. Revenue Inspector, Executive Engineer"
              value={formData.designation}
              onChange={(e) => setFormField('designation', e.target.value)}
              onBlur={(e) => handleBlur('designation', e.target.value)}
              error={touched.designation ? errors.designation : undefined}
              helperText="Current substantive or officiated designation"
            />

            <div className="w-full flex flex-col gap-1.5">
              <label
                htmlFor="gov-reg-role"
                className="text-xs font-semibold text-[#1D2733] flex items-center gap-1 select-none"
              >
                <span>Official Role</span>
                <span className="text-[#C53A3A] font-bold">*</span>
              </label>
              <select
                id="gov-reg-role"
                value={formData.officialRole}
                onChange={(e) => setFormField('officialRole', e.target.value)}
                className="w-full h-11 px-3.5 text-sm text-[#1D2733] bg-white border border-slate-300 rounded-xl focus:border-navy focus:ring-2 focus:ring-navy/20 focus:outline-none transition-all"
              >
                {availableRoles.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* State / UT & District / Office */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="w-full flex flex-col gap-1.5">
              <label
                htmlFor="gov-reg-state"
                className="text-xs font-semibold text-[#1D2733] flex items-center gap-1 select-none"
              >
                <span>State / Union Territory</span>
                <span className="text-[#C53A3A] font-bold">*</span>
              </label>
              <select
                id="gov-reg-state"
                value={formData.state}
                onChange={(e) => setFormField('state', e.target.value)}
                className="w-full h-11 px-3.5 text-sm text-[#1D2733] bg-white border border-slate-300 rounded-xl focus:border-navy focus:ring-2 focus:ring-navy/20 focus:outline-none transition-all"
              >
                {INDIAN_STATES_UTS.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
            </div>

            <FormField
              ref={districtOfficeRef}
              label="District / Office"
              required
              placeholder="e.g. Pune Division / Collectorate"
              value={formData.districtOffice}
              onChange={(e) => setFormField('districtOffice', e.target.value)}
              onBlur={(e) => handleBlur('districtOffice', e.target.value)}
              error={touched.districtOffice ? errors.districtOffice : undefined}
              helperText="Jurisdictional office or posting unit"
            />
          </div>

          {/* Navigation Controls */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-4">
            <button
              type="button"
              onClick={() => navigate('/government/login')}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-navy transition-colors py-2 px-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Login</span>
            </button>

            <Button
              type="submit"
              variant="secondary"
              size="md"
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Continue
            </Button>
          </div>
        </form>
      </div>
    </AuthLayout>
  );
};
