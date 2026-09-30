import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import type { GovernmentRegistrationFormData, GovernmentAccessStatus } from '../types/auth';
import {
  getGovernmentAccessRequestStatus,
  submitGovernmentAccessRequest,
} from '../services/governmentAccessService';

interface GovernmentRegistrationContextType {
  formData: GovernmentRegistrationFormData;
  setFormField: <K extends keyof GovernmentRegistrationFormData>(
    field: K,
    value: GovernmentRegistrationFormData[K]
  ) => void;

  isOtpSent: boolean;
  otpValue: string;
  setOtpValue: (val: string) => void;
  timerSeconds: number;
  isOtpExpired: boolean;
  otpError: string | null;
  otpNotification: string | null;
  officialContactVerified: boolean;

  sendGovOtp: () => Promise<void>;
  verifyGovOtp: (enteredOtp?: string) => Promise<boolean>;
  resendGovOtp: () => void;
  submitAccessRequest: () => Promise<string>;
  refreshAccessStatus: () => Promise<GovernmentAccessStatus>;
  resetGovRegistration: () => void;
}

const initialGovFormData: GovernmentRegistrationFormData = {
  fullName: '',
  employeeId: '',
  department: 'Department of Land Resources',
  designation: '',
  officialRole: 'Land Records Officer',
  state: 'Tamil Nadu',
  districtOffice: '',
  officialEmail: '',
  officialMobile: '',
  proofFileName: null,
  confirmAuthorisation: false,
  requestId: null,
  accessStatus: 'draft',
  rejectionReason: undefined,
  password: '',
  confirmPassword: '',
};

const GovernmentRegistrationContext = createContext<GovernmentRegistrationContextType | undefined>(
  undefined
);

export const GovernmentRegistrationProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [formData, setFormData] = useState<GovernmentRegistrationFormData>(() => {
    try {
      const saved = sessionStorage.getItem('landstack_gov_reg_form');
      return saved ? JSON.parse(saved) : initialGovFormData;
    } catch {
      return initialGovFormData;
    }
  });

  const [isOtpSent, setIsOtpSent] = useState<boolean>(false);
  const [otpValue, setOtpValue] = useState<string>('');
  const [timerSeconds, setTimerSeconds] = useState<number>(120);
  const [isOtpExpired, setIsOtpExpired] = useState<boolean>(false);
  const [otpError, setOtpError] = useState<string | null>(null);
  const [otpNotification, setOtpNotification] = useState<string | null>(null);
  const [officialContactVerified, setOfficialContactVerified] = useState<boolean>(() => {
    return sessionStorage.getItem('landstack_gov_contact_verified') === 'true';
  });

  useEffect(() => {
    const sanitized = { ...formData, password: '', confirmPassword: '' };
    sessionStorage.setItem('landstack_gov_reg_form', JSON.stringify(sanitized));
  }, [formData]);

  useEffect(() => {
    sessionStorage.setItem(
      'landstack_gov_contact_verified',
      officialContactVerified ? 'true' : 'false'
    );
  }, [officialContactVerified]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (isOtpSent && timerSeconds > 0 && !officialContactVerified) {
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
  }, [isOtpSent, timerSeconds, officialContactVerified]);

  const setFormField = <K extends keyof GovernmentRegistrationFormData>(
    field: K,
    value: GovernmentRegistrationFormData[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const sendGovOtp = async () => {
    setIsOtpSent(true);
    setTimerSeconds(120);
    setIsOtpExpired(false);
    setOtpError(null);
    setOtpValue('');
    setOtpNotification('OTP sent successfully.');
  };

  const resendGovOtp = () => {
    setOtpValue('');
    setTimerSeconds(120);
    setIsOtpExpired(false);
    setOtpError(null);
    setOtpNotification('A new OTP has been sent.');
  };

  const verifyGovOtp = async (enteredOtp?: string): Promise<boolean> => {
    const code = enteredOtp !== undefined ? enteredOtp : otpValue;
    setOtpError(null);

    if (isOtpExpired || timerSeconds <= 0) {
      setOtpError('OTP has expired. Please request a new OTP.');
      return false;
    }

    if (code === '123456') {
      setOfficialContactVerified(true);
      return true;
    }

    setOtpError('Incorrect OTP. Please check and try again.');
    return false;
  };

  const submitAccessRequest = useCallback(async (): Promise<string> => {
    if (!officialContactVerified) {
      throw new Error('Verify the official contact before submitting the access request.');
    }

    const requestId = await submitGovernmentAccessRequest(formData, officialContactVerified);
    setFormData((prev) => ({
      ...prev,
      requestId,
      accessStatus: 'pending',
      rejectionReason: undefined,
    }));
    return requestId;
  }, [formData, officialContactVerified]);

  const refreshAccessStatus = useCallback(async (): Promise<GovernmentAccessStatus> => {
    if (!formData.requestId || !formData.employeeId) return formData.accessStatus;

    const result = await getGovernmentAccessRequestStatus(formData.requestId, formData.employeeId);
    if (!result) return formData.accessStatus;

    setFormData((prev) => ({
      ...prev,
      requestId: result.requestId,
      accessStatus: result.status,
      rejectionReason: result.rejectionReason,
    }));

    return result.status;
  }, [formData.requestId, formData.employeeId, formData.accessStatus]);

  const resetGovRegistration = () => {
    setFormData(initialGovFormData);
    setIsOtpSent(false);
    setOtpValue('');
    setTimerSeconds(120);
    setIsOtpExpired(false);
    setOtpError(null);
    setOtpNotification(null);
    setOfficialContactVerified(false);
    sessionStorage.removeItem('landstack_gov_reg_form');
    sessionStorage.removeItem('landstack_gov_contact_verified');
  };

  return (
    <GovernmentRegistrationContext.Provider
      value={{
        formData,
        setFormField,
        isOtpSent,
        otpValue,
        setOtpValue,
        timerSeconds,
        isOtpExpired,
        otpError,
        otpNotification,
        officialContactVerified,
        sendGovOtp,
        verifyGovOtp,
        resendGovOtp,
        submitAccessRequest,
        refreshAccessStatus,
        resetGovRegistration,
      }}
    >
      {children}
    </GovernmentRegistrationContext.Provider>
  );
};

export const useGovernmentRegistration = () => {
  const context = useContext(GovernmentRegistrationContext);
  if (!context) {
    throw new Error(
      'useGovernmentRegistration must be used within a GovernmentRegistrationProvider'
    );
  }
  return context;
};
