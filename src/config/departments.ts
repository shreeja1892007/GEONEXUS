/**
 * Central Department Registry
 * 
 * Canonical source of truth for all departments across Land Stack.
 * Used by Government Registration, Citizen Application Routing, and Government Dashboards.
 */

export const GOVERNMENT_DEPARTMENTS = [
  'Department of Land Resources',
  'Revenue Department',
  'Registration Department',
  'Survey & Settlement Department',
  'Town & Country Planning Department',
  'Municipal Administration / Urban Local Body',
  'Property Tax Department',
  'Rural Development / Panchayat Department',
  'Highways Department',
  'Water Resources Department',
  'Electricity Department',
  'Water & Sewerage Department',
  'Forest Department',
  'Environment Department',
  'Disaster Management Department',
  'Legal / Dispute Management Department',
  'Archaeology / Heritage Department',
  'Land Acquisition / Revenue Department',
] as const;

export type GovernmentDepartment = (typeof GOVERNMENT_DEPARTMENTS)[number];

export interface DepartmentDefinition {
  id: string;
  name: GovernmentDepartment;
  shortCode: string;
  description: string;
}

export const DEPARTMENT_REGISTRY: DepartmentDefinition[] = [
  {
    id: 'land-resources',
    name: 'Department of Land Resources',
    shortCode: 'DLR',
    description: 'National land records policy, integration, standards, and ULPIN oversight.',
  },
  {
    id: 'revenue',
    name: 'Revenue Department',
    shortCode: 'REV',
    description: 'Land administration, Patta/RoR maintenance, mutation, and revenue records.',
  },
  {
    id: 'registration',
    name: 'Registration Department',
    shortCode: 'REG',
    description: 'Property deeds, sales, gifts, mortgages, encumbrance certificates, and stamp duty.',
  },
  {
    id: 'survey-settlement',
    name: 'Survey & Settlement Department',
    shortCode: 'SURV',
    description: 'Cadastral mapping, land demarcation, FMB sketches, and boundary dispute resolution.',
  },
  {
    id: 'town-country-planning',
    name: 'Town & Country Planning Department',
    shortCode: 'TCP',
    description: 'Master planning, zoning regulations, building plan approvals, and land use permissions.',
  },
  {
    id: 'municipal-urban-local-body',
    name: 'Municipal Administration / Urban Local Body',
    shortCode: 'ULB',
    description: 'Urban local infrastructure, building modifications, local permissions, and civic assets.',
  },
  {
    id: 'property-tax',
    name: 'Property Tax Department',
    shortCode: 'TAX',
    description: 'Property assessment, tax demand registers, receipts, and assessment revisions.',
  },
  {
    id: 'rural-development-panchayat',
    name: 'Rural Development / Panchayat Department',
    shortCode: 'RDP',
    description: 'Gram Panchayat records, village infrastructure, rural roads, and community facilities.',
  },
  {
    id: 'highways',
    name: 'Highways Department',
    shortCode: 'HWY',
    description: 'Right of way, highway access permissions, road corridors, and road grievance redressal.',
  },
  {
    id: 'water-resources',
    name: 'Water Resources Department',
    shortCode: 'WRD',
    description: 'Canals, irrigation tanks, lake buffers, waterbodies, and catchment protection.',
  },
  {
    id: 'electricity',
    name: 'Electricity Department',
    shortCode: 'ELEC',
    description: 'Power utility services, service line feasibility, load sanction, and metering.',
  },
  {
    id: 'water-sewerage',
    name: 'Water & Sewerage Department',
    shortCode: 'WSD',
    description: 'Municipal water supply, sewerage connections, drainage network, and pipelines.',
  },
  {
    id: 'forest',
    name: 'Forest Department',
    shortCode: 'FOR',
    description: 'Forest boundaries, Eco-Sensitive Zones (ESZ), wildlife corridors, and clearance permissions.',
  },
  {
    id: 'environment',
    name: 'Environment Department',
    shortCode: 'ENV',
    description: 'Environmental impact, pollution control consent, industry establishment clearance.',
  },
  {
    id: 'disaster-management',
    name: 'Disaster Management Department',
    shortCode: 'DM',
    description: 'Flood plain risk zones, disaster vulnerability, cyclone/landslide mitigation.',
  },
  {
    id: 'legal-dispute-management',
    name: 'Legal / Dispute Management Department',
    shortCode: 'LEG',
    description: 'Court case tracking, title disputes, injunction monitoring, and legal representations.',
  },
  {
    id: 'archaeology-heritage',
    name: 'Archaeology / Heritage Department',
    shortCode: 'ARCH',
    description: 'Protected monuments, heritage site buffer zones, and construction proximity NOCs.',
  },
  {
    id: 'land-acquisition-revenue',
    name: 'Land Acquisition / Revenue Department',
    shortCode: 'LAQ',
    description: 'Government acquisition notifications, awards, challenges, and compensation inquiries.',
  },
];

export function getDepartmentByName(name: string): DepartmentDefinition | undefined {
  return DEPARTMENT_REGISTRY.find((d) => d.name === name);
}

export function getDepartmentById(id: string): DepartmentDefinition | undefined {
  return DEPARTMENT_REGISTRY.find((d) => d.id === id);
}
