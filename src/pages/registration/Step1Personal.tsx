import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Calendar } from 'lucide-react';
import { AuthLayout } from '../../components/layout/AuthLayout';
import { RegistrationStepper } from '../../components/registration/RegistrationStepper';
import { MinorGuardianFields } from '../../components/registration/MinorGuardianFields';
import { FormField } from '../../components/ui/FormField';
import { Button } from '../../components/ui/Button';
import { useRegistration } from '../../context/RegistrationContext';

export const Step1Personal: React.FC = () => {
  const navigate = useNavigate();
  const {
    formData,
    setFormField,
    setGuardianField,
    updateDob,
  } = useRegistration();

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Input refs to focus first invalid field on submit
  const fullNameRef = useRef<HTMLInputElement>(null);
  const dobRef = useRef<HTMLInputElement>(null);
  const mobileRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);

  const todayStr = new Date().toISOString().split('T')[0];

  const validateField = (field: string, value: any): string => {
    switch (field) {
      case 'fullName':
        if (!value || !value.trim()) return 'Full name is required.';
        if (!/^[a-zA-Z\s'.]+$/.test(value.trim())) {
          return 'Only alphabetic letters and spaces are allowed.';
        }
        if (value.trim().length < 3) return 'Name must be at least 3 characters.';
        return '';

      case 'dob':
        if (!value) return 'Date of birth is required.';
        const selectedDate = new Date(value);
        if (selectedDate > new Date()) return 'Date of birth cannot be in the future.';
        return '';

      case 'mobile':
        if (!value) return 'Mobile number is required.';
        const cleanMobile = value.replace(/\D/g, '');
        if (cleanMobile.length !== 10) return 'Mobile number must be exactly 10 digits.';
        if (!/^[6-9]\d{9}$/.test(cleanMobile)) {
          return 'Please enter a valid Indian mobile number starting with 6, 7, 8, or 9.';
        }
        return '';

      case 'email':
        if (value && value.trim()) {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(value.trim())) return 'Please enter a valid email address.';
        }
        return '';

      case 'guardianName':
        if (formData.isMinor) {
          if (!value || !value.trim()) return 'Parent or guardian name is required for minor applicants.';
          if (!/^[a-zA-Z\s'.]+$/.test(value.trim())) return 'Only alphabetic letters and spaces are allowed.';
        }
        return '';

      case 'guardianOtherRelationship':
        if (formData.isMinor && formData.guardian.relationship === 'Other') {
          if (!value || !value.trim()) return 'Please specify the relationship.';
        }
        return '';

      default:
        return '';
    }
  };

  const handleBlur = (field: string, value: any) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const error = validateField(field, value);
    setErrors((prev) => ({ ...prev, [field]: error }));
  };

  const handleDobChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const dob = e.target.value;
    updateDob(dob);
    if (touched.dob) {
      setErrors((prev) => ({ ...prev, dob: validateField('dob', dob) }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: Record<string, string> = {
      fullName: validateField('fullName', formData.fullName),
      dob: validateField('dob', formData.dob),
      mobile: validateField('mobile', formData.mobile),
      email: validateField('email', formData.email),
    };

    if (formData.isMinor) {
      newErrors.guardianName = validateField('guardianName', formData.guardian.name);
      if (formData.guardian.relationship === 'Other') {
        newErrors.guardianOtherRelationship = validateField(
          'guardianOtherRelationship',
          formData.guardian.otherRelationship
        );
      }
    }

    // Filter out empty errors
    const activeErrors: Record<string, string> = {};
    Object.keys(newErrors).forEach((key) => {
      if (newErrors[key]) {
        activeErrors[key] = newErrors[key];
      }
    });

    setErrors(activeErrors);
    setTouched({
      fullName: true,
      dob: true,
      mobile: true,
      email: true,
      guardianName: true,
      guardianOtherRelationship: true,
    });

    // If errors exist, focus first invalid field
    if (Object.keys(activeErrors).length > 0) {
      if (activeErrors.fullName) fullNameRef.current?.focus();
      else if (activeErrors.dob) dobRef.current?.focus();
      else if (activeErrors.mobile) mobileRef.current?.focus();
      else if (activeErrors.email) emailRef.current?.focus();
      return;
    }

    // Advance to Step 2
    navigate('/citizen/register/aadhaar');
  };

  return (
    <AuthLayout>
      <div className="bg-white rounded-card p-6 sm:p-8 border border-slate-200 shadow-card">
        {/* Stepper Progress */}
        <RegistrationStepper currentStep={1} />

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-xl sm:text-2xl font-bold text-navy tracking-tight">
            Create Citizen Account
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Step 1 of 4 — Personal Details
          </p>
        </div>

        {/* Personal Details Form */}
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          {/* Full Name */}
          <FormField
            ref={fullNameRef}
            label="Full Name"
            required
            placeholder="Enter your full legal name"
            value={formData.fullName}
            onChange={(e) => setFormField('fullName', e.target.value)}
            onBlur={(e) => handleBlur('fullName', e.target.value)}
            error={touched.fullName ? errors.fullName : undefined}
            helperText="As printed on government photo identity documents"
          />

          {/* Date of Birth & Calculated Age */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <FormField
              ref={dobRef}
              label="Date of Birth"
              required
              type="date"
              max={todayStr}
              value={formData.dob}
              onChange={handleDobChange}
              onBlur={(e) => handleBlur('dob', e.target.value)}
              error={touched.dob ? errors.dob : undefined}
              suffix={<Calendar className="w-4 h-4 text-slate-400 pointer-events-none" />}
            />

            {/* Read-only Automatically Calculated Age */}
            <FormField
              label="Age (Auto-calculated)"
              readOnly
              isReadOnlyBadge
              tabIndex={-1}
              value={
                formData.age !== null && formData.age >= 0
                  ? `${formData.age} Years`
                  : 'Calculated from DOB'
              }
              placeholder="Select Date of Birth"
              helperText="Derived automatically from Date of Birth"
            />
          </div>

          {/* Conditional Minor Applicant Guardian Section */}
          {formData.isMinor && (
            <MinorGuardianFields
              guardian={formData.guardian}
              onChange={setGuardianField}
              errors={errors}
            />
          )}

          {/* Mobile Number */}
          <FormField
            ref={mobileRef}
            label="Mobile Number"
            required
            type="tel"
            inputMode="numeric"
            placeholder="98765 43210"
            prefix={<span className="text-navy font-semibold">+91</span>}
            maxLength={10}
            value={formData.mobile}
            onChange={(e) => {
              const val = e.target.value.replace(/\D/g, '').slice(0, 10);
              setFormField('mobile', val);
              if (touched.mobile) {
                setErrors((prev) => ({ ...prev, mobile: validateField('mobile', val) }));
              }
            }}
            onBlur={(e) => handleBlur('mobile', e.target.value)}
            error={touched.mobile ? errors.mobile : undefined}
            helperText="10-digit number. This will be your primary login credential."
          />

          {/* Email Address (Optional) */}
          <FormField
            ref={emailRef}
            label="Email Address (Optional)"
            type="email"
            placeholder="citizen@example.com"
            value={formData.email}
            onChange={(e) => {
              setFormField('email', e.target.value);
              if (touched.email) {
                setErrors((prev) => ({ ...prev, email: validateField('email', e.target.value) }));
              }
            }}
            onBlur={(e) => handleBlur('email', e.target.value)}
            error={touched.email ? errors.email : undefined}
            helperText="Used for digital receipts and land transaction notifications"
          />

          {/* Continue Button */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-4">
            <button
              type="button"
              onClick={() => navigate('/citizen/login')}
              className="text-xs font-semibold text-slate-500 hover:text-navy transition-colors py-2.5 px-3"
            >
              Back to Login
            </button>

            <Button
              type="submit"
              variant="primary"
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
