import type { GovernmentDepartment } from '../config/departments';
import type { OfficialRole } from '../config/governmentRoles';

export type ApplicationStatus =
  | 'Submitted'
  | 'Routed'
  | 'Under Review'
  | 'More Information Required'
  | 'Approved'
  | 'Rejected'
  | 'Completed';

export interface StatusHistoryEntry {
  status: ApplicationStatus;
  timestamp: string;
  note?: string;
  updatedBy?: string;
}

export interface ApplicationLocation {
  state: string;
  district: string;
  localBody?: string;
  villageOrWard?: string;
  taluk?: string;
  panchayat?: string;
  landmark?: string;
  description?: string;
}

export interface ApplicationDocument {
  id: string;
  name: string;
  fileName: string;
  required: boolean;
  uploaded: boolean;
}

export interface CitizenApplicationRecord {
  applicationId: string; // e.g. APP-2026-000124
  citizenId: string;
  citizenName: string;
  citizenMobile: string;
  citizenEmail?: string;

  // Purpose
  purposeId: string;
  purposeLabel: string;
  category: string;

  // Location / Parcel
  parcelId?: string;
  ulpin?: string;
  surveyNumber?: string;
  location: ApplicationLocation;

  // Dynamic form data
  requestDetails: Record<string, string>;

  // Documents
  documents: ApplicationDocument[];

  // Routing (Canonical)
  targetDepartment: GovernmentDepartment | string;
  targetRole: OfficialRole | string;
  fallbackDepartments?: (GovernmentDepartment | string)[];
  fallbackRoles: (OfficialRole | string)[];
  collaboratingDepartments: (GovernmentDepartment | string)[];
  collaboratingRoles?: (OfficialRole | string)[];

  // Timestamps & status
  submittedAt: string;
  status: ApplicationStatus;
  statusHistory: StatusHistoryEntry[];

  // Officer
  assignedOfficerId?: string;
  assignedOfficerName?: string;
  officerRemarks?: string;

  // Citizen additional info
  citizenRemarks?: string;

  // More information flow
  moreInfoRequest?: {
    message: string;
    requestedDocument?: string;
    requestedAt: string;
  };
  moreInfoResponse?: {
    message: string;
    respondedAt: string;
    additionalDocuments?: ApplicationDocument[];
  };
}

export interface AppNotification {
  id: string;
  applicationId: string;
  title: string;
  message: string;
  date: string;
  read: boolean;
  type: 'info' | 'success' | 'warning' | 'error';
}
