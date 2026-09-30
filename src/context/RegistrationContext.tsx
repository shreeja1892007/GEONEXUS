import React, { createContext, useContext, useState, useEffect } from 'react';
import type { GuardianDetails, RegistrationFormData } from '../types/auth';
import { calculateAge, maskAadhaar, maskMobile } from '../utils/formatters';

interface RegistrationContextType {
  formData: RegistrationFormData;
  setFormField: <K extends keyof RegistrationFormData>(field: K, value: RegistrationFormData[K]) => void;
  setGuardianField: <K extends keyof GuardianDetails>(field: K, value: GuardianDetails[K]) => void;
  updateDob: (dob: string) => void;
  
  // Verification states
  aadhaarVerified: boolean;
  maskedAadhaarDisplay: string;
  maskedMobileDisplay: string;
  
  // OTP state
  isOtpSent: boolean;
  otpValue: string;
  setOtpValue: (otp: string) => void;
  timerSeconds: number;
  isOtpExpired: boolean;
  otpError: string | null;
  otpNotification: string | null;
  
  // Actions
  sendOtp: () => Promise<void>;
  verifyOtp: (enteredOtp?: string) => Promise<boolean>;
  resendOtp: () => void;
  resetRegistration: () => void;
}

const initialFormData: RegistrationFormData = {
  fullName: '',
  dob: '',
  age: null,
  isMinor: false,
  guardian: {
    name: '',
    relationship: 'Father',
    otherRelationship: '',
  },
  mobile: '',
  email: '',
  aadhaar: '',
  aadhaarConsent: false,
  password: '',
  confirmPassword: '',
};

const RegistrationContext = createContext<RegistrationContextType | undefined>(undefined);

export const RegistrationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [formData, setFormData] = useState<RegistrationFormData>(() => {
    try {
      const saved = sessionStorage.getItem('landstack_reg_form');
      return saved ? JSON.parse(saved) : initialFormData;
    } catch {
      return initialFormData;
    }
  });

  const [aadhaarVerified, setAadhaarVerified] = useState<boolean>(() => {
    return sessionStorage.getItem('landstack_reg_aadhaar_verified') === 'true';
  });

  const [maskedAadhaarDisplay, setMaskedAadhaarDisplay] = useState<string>(() => {
    return sessionStorage.getItem('landstack_reg_masked_aadhaar') || 'XXXX XXXX 4582';
  });

  const [isOtpSent, setIsOtpSent] = useState<boolean>(false);
  const [otpValue, setOtpValue] = useState<string>('');
  const [timerSeconds, setTimerSeconds] = useState<number>(120); // 02:00
  const [isOtpExpired, setIsOtpExpired] = useState<boolean>(false);
  const [otpError, setOtpError] = useState<string | null>(null);
  const [otpNotification, setOtpNotification] = useState<string | null>(null);

  // Sync to session storage
  useEffect(() => {
    // Avoid saving full Aadhaar to storage for security
    const sanitized = { ...formData, aadhaar: '' };
    sessionStorage.setItem('landstack_reg_form', JSON.stringify(sanitized));
  }, [formData]);

  useEffect(() => {
    sessionStorage.setItem('landstack_reg_aadhaar_verified', aadhaarVerified ? 'true' : 'false');
  }, [aadhaarVerified]);

  useEffect(() => {
    sessionStorage.setItem('landstack_reg_masked_aadhaar', maskedAadhaarDisplay);
  }, [maskedAadhaarDisplay]);

  // Countdown timer for OTP
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (isOtpSent && timerSeconds > 0 && !aadhaarVerified) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => {
          if (prev <= 1) {
            setIsOtpExpired(true);
            setOtpError('OTP has expired. Please request a new OTP.');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isOtpSent, timerSeconds, aadhaarVerified]);

  const setFormField = <K extends keyof RegistrationFormData>(field: K, value: RegistrationFormData[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const setGuardianField = <K extends keyof GuardianDetails>(field: K, value: GuardianDetails[K]) => {
    setFormData((prev) => ({
      ...prev,
      guardian: {
        ...prev.guardian,
        [field]: value,
      },
    }));
  };

  const updateDob = (dob: string) => {
    const age = calculateAge(dob);
    const isMinor = age !== null && age >= 0 && age < 18;
    
    setFormData((prev) => ({
      ...prev,
      dob,
      age: age !== null && age >= 0 ? age : null,
      isMinor,
      // Reset guardian details if age becomes 18 or above
      guardian: isMinor
        ? prev.guardian
        : { name: '', relationship: 'Father', otherRelationship: '' },
    }));
  };

  const sendOtp = async () => {
    setIsOtpSent(true);
    setTimerSeconds(120); // 02:00
    setIsOtpExpired(false);
    setOtpError(null);
    setOtpValue('');
    const last4 = formData.mobile.slice(-4) || '4821';
    setOtpNotification(`OTP sent successfully to the mobile number registered with Aadhaar ending •••• ${last4}.`);
  };

  const resendOtp = () => {
    setOtpValue('');
    setTimerSeconds(120);
    setIsOtpExpired(false);
    setOtpError(null);
    setOtpNotification('A new OTP has been sent.');
  };

  const verifyOtp = async (enteredOtp?: string): Promise<boolean> => {
    const code = enteredOtp !== undefined ? enteredOtp : otpValue;
    setOtpError(null);

    if (isOtpExpired || timerSeconds <= 0) {
      setOtpError('OTP has expired. Please request a new OTP.');
      return false;
    }

    // Fixed demo OTP: 123456
    if (code === '123456') {
      const masked = maskAadhaar(formData.aadhaar || '123456784582');
      setMaskedAadhaarDisplay(masked);
      setAadhaarVerified(true);
      // Immediately wipe raw Aadhaar from memory for security
      setFormData((prev) => ({ ...prev, aadhaar: '' }));
      return true;
    } else {
      setOtpError('Incorrect OTP. Please check and try again.');
      return false;
    }
  };

  const resetRegistration = () => {
    setFormData(initialFormData);
    setAadhaarVerified(false);
    setMaskedAadhaarDisplay('XXXX XXXX 4582');
    setIsOtpSent(false);
    setOtpValue('');
    setTimerSeconds(120);
    setIsOtpExpired(false);
    setOtpError(null);
    setOtpNotification(null);
    sessionStorage.removeItem('landstack_reg_form');
    sessionStorage.removeItem('landstack_reg_aadhaar_verified');
    sessionStorage.removeItem('landstack_reg_masked_aadhaar');
  };

  const maskedMobileDisplay = maskMobile(formData.mobile || '9876544821');

  return (
    <RegistrationContext.Provider
      value={{
        formData,
        setFormField,
        setGuardianField,
        updateDob,
        aadhaarVerified,
        maskedAadhaarDisplay,
        maskedMobileDisplay,
        isOtpSent,
        otpValue,
        setOtpValue,
        timerSeconds,
        isOtpExpired,
        otpError,
        otpNotification,
        sendOtp,
        verifyOtp,
        resendOtp,
        resetRegistration,
      }}
    >
      {children}
    </RegistrationContext.Provider>
  );
};

export const useRegistration = () => {
  const context = useContext(RegistrationContext);
  if (!context) {
    throw new Error('useRegistration must be used within a RegistrationProvider');
  }
  return context;
};
