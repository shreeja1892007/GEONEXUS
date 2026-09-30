import {
  GOVERNMENT_DEPARTMENTS,
  type GovernmentDepartment,
} from '../config/departments';
import {
  OFFICIAL_ROLES,
  type OfficialRole,
  DEPARTMENT_ROLE_MAP,
  getRolesForDepartment,
  isRoleAllowedForDepartment,
} from '../config/governmentRoles';

export type GuardianRelationship = 'Father' | 'Mother' | 'Legal Guardian' | 'Other';

export interface GuardianDetails {
  name: string;
  relationship: GuardianRelationship;
  otherRelationship?: string;
}

export interface RegistrationFormData {
  fullName: string;
  dob: string;
  age: number | null;
  isMinor: boolean;
  guardian: GuardianDetails;
  mobile: string;
  email: string;
  aadhaar: string;
  aadhaarConsent: boolean;
  password: string;
  confirmPassword: string;
}

export interface CitizenUser {
  id: string;
  fullName: string;
  mobile: string; // 10 digits (login identifier)
  password: string;
  email?: string;
  maskedAadhaar: string; // XXXX XXXX <last4>
  isMinor: boolean;
  guardian?: GuardianDetails;
  registeredAt: string;
}

export interface OTPState {
  isSent: boolean;
  secondsRemaining: number;
  isExpired: boolean;
  isVerifying: boolean;
  errorMessage: string | null;
  successMessage: string | null;
  demoHint: string;
}

// --------------------------------------------------------
// Government Authentication & Registration Types
// --------------------------------------------------------

export interface GovernmentUser {
  id: string;
  fullName: string;
  employeeId: string; // e.g. DLR-EMP-1042 (main identifier)
  department: GovernmentDepartment | string;
  designation: string;
  officialRole: OfficialRole | string;
  state: string;
  districtOffice: string;
  officialEmail: string;
  officialMobile: string;
  password: string;
  registeredAt: string;
}

export type GovernmentAccessStatus = 'draft' | 'pending' | 'approved' | 'rejected';

export interface GovernmentRegistrationFormData {
  // Step 1: Official Details
  fullName: string;
  employeeId: string;
  department: string;
  designation: string;
  officialRole: string;
  state: string;
  districtOffice: string;

  // Step 2: Verification
  officialEmail: string;
  officialMobile: string;
  proofFileName: string | null;
  confirmAuthorisation: boolean;

  // Step 3: Access Request & Approval
  requestId: string | null;
  accessStatus: GovernmentAccessStatus;
  rejectionReason?: string;

  // Step 4: Password
  password: string;
  confirmPassword: string;
}

// Re-export central definitions
export {
  GOVERNMENT_DEPARTMENTS,
  type GovernmentDepartment,
  OFFICIAL_ROLES,
  type OfficialRole,
  DEPARTMENT_ROLE_MAP,
  getRolesForDepartment,
  isRoleAllowedForDepartment,
};

export const INDIAN_STATES_UTS = [
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chhattisgarh',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
  'Andaman and Nicobar Islands',
  'Chandigarh',
  'Dadra and Nagar Haveli and Daman and Diu',
  'Delhi (NCT)',
  'Jammu and Kashmir',
  'Ladakh',
  'Lakshadweep',
  'Puducherry',
] as const;
