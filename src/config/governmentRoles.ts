/**
 * Central Government Role Registry & Department Compatibility Map
 * 
 * Canonical source of truth for all official roles and their compatibility
 * with government departments.
 */

import type { GovernmentDepartment } from './departments';

export const OFFICIAL_ROLES = [
  'Land Records Officer',
  'Revenue Officer',
  'Registration Officer',
  'Survey Officer',
  'Town Planning Officer',
  'Municipal / Urban Local Body Officer',
  'Property Tax Officer',
  'Rural Development / Panchayat Officer',
  'Highways Officer',
  'Water Resources Officer',
  'Electricity Department Officer',
  'Water & Sewerage Officer',
  'Forest Department Officer',
  'Environment Department Officer',
  'Disaster Management Officer',
  'Legal / Dispute Management Officer',
  'Land Acquisition Officer',
  'Archaeology / Heritage Officer',
  'District Administrator',
  'State Administrator',
  'System Administrator',
  'Read-Only / Auditor',
] as const;

export type OfficialRole = (typeof OFFICIAL_ROLES)[number];

/**
 * Department to Role Compatibility Mapping
 * As specified in the Central Configuration Requirements.
 */
export const DEPARTMENT_ROLE_MAP: Record<GovernmentDepartment, readonly OfficialRole[]> = {
  'Department of Land Resources': [
    'Land Records Officer',
    'State Administrator',
    'System Administrator',
    'Read-Only / Auditor',
  ],

  'Revenue Department': [
    'Land Records Officer',
    'Revenue Officer',
    'District Administrator',
    'State Administrator',
    'Read-Only / Auditor',
  ],

  'Registration Department': [
    'Registration Officer',
    'District Administrator',
    'State Administrator',
    'Read-Only / Auditor',
  ],

  'Survey & Settlement Department': [
    'Survey Officer',
    'District Administrator',
    'State Administrator',
    'Read-Only / Auditor',
  ],

  'Town & Country Planning Department': [
    'Town Planning Officer',
    'District Administrator',
    'State Administrator',
    'Read-Only / Auditor',
  ],

  'Municipal Administration / Urban Local Body': [
    'Municipal / Urban Local Body Officer',
    'District Administrator',
    'Read-Only / Auditor',
  ],

  'Property Tax Department': [
    'Property Tax Officer',
    'District Administrator',
    'Read-Only / Auditor',
  ],

  'Rural Development / Panchayat Department': [
    'Rural Development / Panchayat Officer',
    'District Administrator',
    'Read-Only / Auditor',
  ],

  'Highways Department': [
    'Highways Officer',
    'District Administrator',
    'State Administrator',
    'Read-Only / Auditor',
  ],

  'Water Resources Department': [
    'Water Resources Officer',
    'District Administrator',
    'State Administrator',
    'Read-Only / Auditor',
  ],

  'Electricity Department': [
    'Electricity Department Officer',
    'District Administrator',
    'State Administrator',
    'Read-Only / Auditor',
  ],

  'Water & Sewerage Department': [
    'Water & Sewerage Officer',
    'District Administrator',
    'Read-Only / Auditor',
  ],

  'Forest Department': [
    'Forest Department Officer',
    'District Administrator',
    'State Administrator',
    'Read-Only / Auditor',
  ],

  'Environment Department': [
    'Environment Department Officer',
    'District Administrator',
    'State Administrator',
    'Read-Only / Auditor',
  ],

  'Disaster Management Department': [
    'Disaster Management Officer',
    'District Administrator',
    'State Administrator',
    'Read-Only / Auditor',
  ],

  'Legal / Dispute Management Department': [
    'Legal / Dispute Management Officer',
    'District Administrator',
    'State Administrator',
    'Read-Only / Auditor',
  ],

  'Archaeology / Heritage Department': [
    'Archaeology / Heritage Officer',
    'State Administrator',
    'Read-Only / Auditor',
  ],

  'Land Acquisition / Revenue Department': [
    'Land Acquisition Officer',
    'Revenue Officer',
    'District Administrator',
    'State Administrator',
    'Read-Only / Auditor',
  ],
};

/**
 * Returns the list of compatible roles for a given department name.
 * If department is unrecognized or empty, returns the full list of OFFICIAL_ROLES.
 */
export function getRolesForDepartment(department: string): readonly OfficialRole[] {
  if (!department) return OFFICIAL_ROLES;
  const roles = DEPARTMENT_ROLE_MAP[department as GovernmentDepartment];
  return roles || OFFICIAL_ROLES;
}

/**
 * Validates if a role is permitted for a specific department.
 */
export function isRoleAllowedForDepartment(department: string, role: string): boolean {
  const allowed = getRolesForDepartment(department);
  return allowed.includes(role as OfficialRole);
}

/**
 * Returns the primary/default officer role for a given department.
 */
export function getDefaultRoleForDepartment(department: string): OfficialRole {
  const roles = getRolesForDepartment(department);
  return roles[0] || 'Land Records Officer';
}
