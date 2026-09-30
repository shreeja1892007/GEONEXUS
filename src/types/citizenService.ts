import type { GovernmentDepartment } from '../config/departments';
import type { OfficialRole } from '../config/governmentRoles';

export interface DynamicFieldDefinition {
  id: string;
  label: string;
  type: 'text' | 'textarea' | 'select' | 'date' | 'number';
  required: boolean;
  placeholder?: string;
  options?: string[];
  helperText?: string;
  rows?: number; // for textarea
}

export interface DocumentRequirement {
  id: string;
  label: string;
  required: boolean;
  hint?: string;
}

export interface CitizenServiceDefinition {
  id: string;
  category: string;
  label: string;
  targetDepartment: GovernmentDepartment | string;
  primaryRole: OfficialRole | string;
  fallbackDepartments?: (GovernmentDepartment | string)[];
  fallbackRoles: (OfficialRole | string)[];
  collaboratingDepartments: (GovernmentDepartment | string)[];
  collaboratingRoles?: (OfficialRole | string)[];
  requiresParcel: boolean;
  allowsLocationOnly: boolean;
  fields: DynamicFieldDefinition[];
  requiredDocuments: DocumentRequirement[];
}
