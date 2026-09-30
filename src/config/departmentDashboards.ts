export interface DepartmentDashboardConfig {
  department: string;
  role: string;
  title: string;
  subtitle: string;
  themeColor: string;
}

export const DEPARTMENT_DASHBOARD_REGISTRY: Record<string, DepartmentDashboardConfig> = {
  'Water Resources Department': {
    department: 'Water Resources Department',
    role: 'Water Resources Officer',
    title: 'WATER RESOURCES ADMINISTRATION DASHBOARD',
    subtitle: 'Monitor water resources, citizen requests, water availability, reservoirs, groundwater, rainfall, water quality and departmental alerts.',
    themeColor: '#087F8C',
  },
  'Revenue Department': {
    department: 'Revenue Department',
    role: 'Revenue Officer',
    title: 'REVENUE ADMINISTRATION DASHBOARD',
    subtitle: 'Manage land revenue records, patta transfers, mutations, and citizen land requests.',
    themeColor: '#173B57',
  },
  'Registration Department': {
    department: 'Registration Department',
    role: 'Registration Officer',
    title: 'REGISTRATION & STAMPS ADMINISTRATION DASHBOARD',
    subtitle: 'Process deed registrations, encumbrance certificates, and stamp duty verifications.',
    themeColor: '#2E7D32',
  },
  'Survey & Settlement Department': {
    department: 'Survey & Settlement Department',
    role: 'Survey Officer',
    title: 'SURVEY & SETTLEMENT ADMINISTRATION DASHBOARD',
    subtitle: 'Manage boundary surveys, sub-division requests, GIS maps, and spatial land records.',
    themeColor: '#7C3AED',
  },
};

export function getDepartmentDashboardConfig(department: string): DepartmentDashboardConfig | null {
  return DEPARTMENT_DASHBOARD_REGISTRY[department] || null;
}

