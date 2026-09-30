import { supabase } from '../lib/supabase';
import type {
  GovernmentAccessStatus,
  GovernmentRegistrationFormData,
  GovernmentUser,
} from '../types/auth';

export interface GovernmentAccessRequestRecord {
  id: string;
  request_id: string;
  employee_id: string;
  full_name: string;
  department: string;
  designation: string | null;
  official_role: string;
  state: string;
  district_office: string | null;
  official_email: string;
  official_mobile: string;
  proof_file_name: string | null;
  contact_verified: boolean;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  rejection_reason: string | null;
  submitted_at: string;
  reviewed_at: string | null;
  reviewed_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface GovernmentAccessStatusResult {
  requestId: string;
  status: GovernmentAccessStatus;
  rejectionReason?: string;
  reviewedAt?: string;
  reviewedBy?: string;
}

const requireSupabase = () => {
  if (!supabase) {
    throw new Error('Supabase is not configured. Check VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');
  }
  return supabase;
};

const toAppStatus = (status: string): GovernmentAccessStatus => {
  const normalized = status.toUpperCase();
  if (normalized === 'APPROVED') return 'approved';
  if (normalized === 'REJECTED') return 'rejected';
  return 'pending';
};

export async function submitGovernmentAccessRequest(
  formData: GovernmentRegistrationFormData,
  contactVerified: boolean
): Promise<string> {
  const client = requireSupabase();
  const { data, error } = await client.rpc('submit_government_access_request', {
    p_full_name: formData.fullName,
    p_employee_id: formData.employeeId,
    p_department: formData.department,
    p_designation: formData.designation,
    p_official_role: formData.officialRole,
    p_state: formData.state,
    p_district_office: formData.districtOffice,
    p_official_email: formData.officialEmail,
    p_official_mobile: formData.officialMobile,
    p_proof_file_name: formData.proofFileName,
    p_contact_verified: contactVerified,
    p_request_id: formData.requestId,
  });

  if (error) throw new Error(error.message);
  if (!data || typeof data !== 'string') {
    throw new Error('The government access request could not be created.');
  }

  return data;
}

export async function getGovernmentAccessRequestStatus(
  requestId: string,
  employeeId: string
): Promise<GovernmentAccessStatusResult | null> {
  const client = requireSupabase();
  const { data, error } = await client.rpc('get_government_access_request_status', {
    p_request_id: requestId,
    p_employee_id: employeeId,
  });

  if (error) throw new Error(error.message);
  const row = Array.isArray(data) ? data[0] : null;
  if (!row) return null;

  return {
    requestId: row.request_id,
    status: toAppStatus(row.status),
    rejectionReason: row.rejection_reason || undefined,
    reviewedAt: row.reviewed_at || undefined,
    reviewedBy: row.reviewed_by || undefined,
  };
}

function assertPrototypeAdmin(admin: GovernmentUser) {
  const role = String(admin.officialRole);
  if (!['System Administrator', 'State Administrator'].includes(role)) {
    throw new Error('This account is not authorised to review government access requests.');
  }
}

export async function listGovernmentAccessRequests(
  admin: GovernmentUser,
  status: 'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED' = 'ALL'
): Promise<GovernmentAccessRequestRecord[]> {
  assertPrototypeAdmin(admin);
  const client = requireSupabase();
  const { data, error } = await client.rpc('admin_list_government_access_requests', {
    p_admin_employee_id: admin.employeeId,
    p_admin_department: admin.department,
    p_status: status,
  });

  if (error) throw new Error(error.message);
  return (data ?? []) as GovernmentAccessRequestRecord[];
}

export async function reviewGovernmentAccessRequest(
  admin: GovernmentUser,
  requestId: string,
  decision: 'APPROVED' | 'REJECTED',
  reason?: string
): Promise<GovernmentAccessRequestRecord> {
  assertPrototypeAdmin(admin);
  const client = requireSupabase();
  const { data, error } = await client.rpc('admin_review_government_access_request', {
    p_admin_employee_id: admin.employeeId,
    p_admin_department: admin.department,
    p_request_id: requestId,
    p_decision: decision,
    p_reason: reason ?? null,
  });

  if (error) throw new Error(error.message);
  if (!data) throw new Error('The access request could not be updated.');
  return data as GovernmentAccessRequestRecord;
}
