/**
 * Land Stack Utilities & Masking Formatters
 */

/**
 * Calculates exact age in whole years from Date of Birth string (YYYY-MM-DD).
 * Correctly accounts for whether the birthday has occurred in the current calendar year.
 */
export function calculateAge(dobString: string): number | null {
  if (!dobString) return null;
  const birthDate = new Date(dobString);
  if (isNaN(birthDate.getTime())) return null;

  const today = new Date();
  
  // Future date check
  if (birthDate > today) {
    return -1;
  }

  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  
  // If birth month hasn't occurred this year, or if it's the birth month but birth day hasn't occurred yet
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  return Math.max(0, age);
}

/**
 * Masks a 12-digit Aadhaar number showing only the last 4 digits.
 * Output format: "XXXX XXXX 4582"
 * Never returns full Aadhaar.
 */
export function maskAadhaar(aadhaar: string): string {
  const digits = (aadhaar || '').replace(/\D/g, '');
  const last4 = digits.slice(-4) || '4582';
  return `XXXX XXXX ${last4}`;
}

/**
 * Masks a 10-digit Indian mobile number showing only the last 4 digits.
 * Output format: "+91 ••••••4821"
 */
export function maskMobile(mobile: string): string {
  const digits = (mobile || '').replace(/\D/g, '');
  const last4 = digits.slice(-4) || '4821';
  return `+91 ••••••${last4}`;
}

/**
 * Masks an official government email address.
 * Preserves the first 2 characters and the domain.
 * Example: "ramesh.kumar@gov.in" -> "ra•••••••••@gov.in"
 */
export function maskEmail(email: string): string {
  if (!email || !email.includes('@')) return 'of••••••@gov.in';
  const [local, domain] = email.split('@');
  if (local.length <= 2) {
    return `${local}••••@${domain}`;
  }
  const prefix = local.slice(0, 2);
  const maskedLocal = '•'.repeat(Math.max(4, local.length - 2));
  return `${prefix}${maskedLocal}@${domain}`;
}

/**
 * Generates an official Government Access Request ID.
 * Format: "GOV-REQ-2026-XXXXX"
 */
export function generateGovRequestId(): string {
  const randomNum = Math.floor(10000 + Math.random() * 90000);
  return `GOV-REQ-2026-${randomNum}`;
}

/**
 * Formats user input as grouped 12-digit Aadhaar: "1234 5678 9012"
 */
export function formatAadhaarInput(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 12);
  const parts: string[] = [];
  for (let i = 0; i < digits.length; i += 4) {
    parts.push(digits.slice(i, i + 4));
  }
  return parts.join(' ');
}

/**
 * Formats countdown seconds to mm:ss (e.g., 120 -> "02:00")
 */
export function formatTimer(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Password criteria validator
 */
export interface PasswordCriteria {
  minLength: boolean;
  hasUppercase: boolean;
  hasLowercase: boolean;
  hasNumber: boolean;
  hasSpecial: boolean;
  allValid: boolean;
  strength: 'Weak' | 'Medium' | 'Strong';
  strengthPercentage: number;
}

export function evaluatePassword(password: string): PasswordCriteria {
  const minLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);

  const satisfiedCount = [minLength, hasUppercase, hasLowercase, hasNumber, hasSpecial].filter(Boolean).length;
  const allValid = satisfiedCount === 5;

  let strength: 'Weak' | 'Medium' | 'Strong' = 'Weak';
  let strengthPercentage = (satisfiedCount / 5) * 100;

  if (satisfiedCount <= 2) {
    strength = 'Weak';
  } else if (satisfiedCount === 3 || satisfiedCount === 4) {
    strength = 'Medium';
  } else if (satisfiedCount === 5) {
    strength = 'Strong';
  }

  return {
    minLength,
    hasUppercase,
    hasLowercase,
    hasNumber,
    hasSpecial,
    allValid,
    strength,
    strengthPercentage,
  };
}
