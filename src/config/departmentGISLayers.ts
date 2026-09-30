export interface GISLayerDefinition {
  id: string;
  label: string;
  defaultOn: boolean;
  category: 'core' | 'departmental' | 'spatial' | 'grievance';
}

export interface DepartmentGISConfig {
  department: string;
  layers: GISLayerDefinition[];
  getOperationalFields: (parcelUlpin: string) => { label: string; value: string; badge?: string }[];
}

export const DEPARTMENT_GIS_CONFIGS: Record<string, DepartmentGISConfig> = {
  'Water Resources Department': {
    department: 'Water Resources Department',
    layers: [
      { id: 'parcelBoundaries', label: 'Parcel Boundaries', defaultOn: true, category: 'core' },
      { id: 'rivers', label: 'Rivers & Streams', defaultOn: true, category: 'departmental' },
      { id: 'canals', label: 'Canals & Feeders', defaultOn: true, category: 'departmental' },
      { id: 'lakes', label: 'Lakes & Ponds', defaultOn: true, category: 'departmental' },
      { id: 'reservoirs', label: 'Reservoirs & Dams', defaultOn: true, category: 'departmental' },
      { id: 'tanks', label: 'Water Tanks', defaultOn: true, category: 'departmental' },
      { id: 'borewells', label: 'Borewells & Aquifers', defaultOn: true, category: 'departmental' },
      { id: 'groundwaterZones', label: 'Groundwater Zones', defaultOn: true, category: 'spatial' },
      { id: 'bufferZones', label: 'Waterbody Buffer Zones', defaultOn: true, category: 'spatial' },
      { id: 'floodRiskZones', label: 'Flood Risk Zones', defaultOn: true, category: 'spatial' },
      { id: 'encroachments', label: 'Encroachment Spots', defaultOn: true, category: 'grievance' },
      { id: 'complaints', label: 'Citizen Water Complaints', defaultOn: true, category: 'grievance' },
      { id: 'wtp', label: 'Water Treatment Plants', defaultOn: true, category: 'departmental' },
    ],
    getOperationalFields: () => [
      { label: 'Nearest Waterbody', value: 'Lake WR-14 (320m)' },
      { label: 'Flood Risk Level', value: 'MODERATE', badge: 'bg-amber-100 text-amber-700' },
      { label: 'Canal Proximity', value: 'Buckingham Feeder CN-04 (180m)' },
      { label: 'Waterbody Buffer Zone', value: 'Outside 500m mandatory buffer', badge: 'bg-emerald-100 text-emerald-700' },
      { label: 'Groundwater Zone', value: 'Semi-Critical Aquifer Zone B' },
      { label: 'Active Water Requests', value: '2 Pending Grievances' },
    ],
  },

  'Revenue Department': {
    department: 'Revenue Department',
    layers: [
      { id: 'parcelBoundaries', label: 'Parcel Boundaries', defaultOn: true, category: 'core' },
      { id: 'ulpin', label: 'ULPIN Labels', defaultOn: true, category: 'core' },
      { id: 'ror', label: 'Record of Rights (RoR)', defaultOn: true, category: 'departmental' },
      { id: 'mutationStatus', label: 'Mutation Status', defaultOn: true, category: 'departmental' },
      { id: 'govtLand', label: 'Government / Poramboke Land', defaultOn: true, category: 'spatial' },
      { id: 'classification', label: 'Land Classification', defaultOn: true, category: 'spatial' },
      { id: 'disputes', label: 'Revenue Disputes', defaultOn: true, category: 'grievance' },
      { id: 'encumbrances', label: 'Encumbrances', defaultOn: true, category: 'departmental' },
    ],
    getOperationalFields: () => [
      { label: 'Mutation Status', value: 'Approved (Patta #TN-88412)', badge: 'bg-emerald-100 text-emerald-700' },
      { label: 'Land Classification', value: 'Private Ryotwari Dry' },
      { label: 'Govt Poramboke Status', value: 'Clear Private Ownership' },
      { label: 'Revenue Division', value: 'Chennai Central Revenue Sub-Division' },
    ],
  },

  'Registration Department': {
    department: 'Registration Department',
    layers: [
      { id: 'parcelBoundaries', label: 'Parcel Boundaries', defaultOn: true, category: 'core' },
      { id: 'ulpin', label: 'ULPIN Labels', defaultOn: true, category: 'core' },
      { id: 'registeredProperties', label: 'Registered Properties', defaultOn: true, category: 'departmental' },
      { id: 'recentTransactions', label: 'Recent Sale Deeds (2025-2026)', defaultOn: true, category: 'departmental' },
      { id: 'registrationStatus', label: 'Registration Status', defaultOn: true, category: 'departmental' },
      { id: 'encumbrances', label: 'Encumbrance Certificate (EC)', defaultOn: true, category: 'departmental' },
      { id: 'mortgages', label: 'Bank Mortgages', defaultOn: true, category: 'spatial' },
      { id: 'mutationPending', label: 'Pending Post-Reg Mutation', defaultOn: true, category: 'grievance' },
    ],
    getOperationalFields: () => [
      { label: 'Last Registration', value: 'Deed #REG-2026-9918 (12 Feb 2026)' },
      { label: 'Sub-Registrar Office', value: 'Chennai Central SRO' },
      { label: 'Encumbrance Status', value: '1 Mortgage Active (State Bank)', badge: 'bg-amber-100 text-amber-700' },
      { label: 'Guideline Value', value: '₹4,500 / sq.ft.' },
    ],
  },

  'Survey & Settlement Department': {
    department: 'Survey & Settlement Department',
    layers: [
      { id: 'cadastralParcels', label: 'Cadastral Parcels', defaultOn: true, category: 'core' },
      { id: 'surveyBoundaries', label: 'Survey Boundaries', defaultOn: true, category: 'core' },
      { id: 'fmb', label: 'Field Measurement Book (FMB)', defaultOn: true, category: 'departmental' },
      { id: 'surveyPoints', label: 'Geodetic Survey Benchmark Points', defaultOn: true, category: 'spatial' },
      { id: 'resurveyAreas', label: 'Re-survey Active Zones', defaultOn: true, category: 'spatial' },
      { id: 'boundaryConflicts', label: 'Boundary Conflict Alerts', defaultOn: true, category: 'grievance' },
      { id: 'areaMismatches', label: 'Area Mismatch Flags', defaultOn: true, category: 'grievance' },
    ],
    getOperationalFields: () => [
      { label: 'FMB Map Status', value: 'Digitized Vector Map Available', badge: 'bg-emerald-100 text-emerald-700' },
      { label: 'Survey Benchmark', value: 'DGPS Point TN-CHE-104' },
      { label: 'Boundary Verification', value: 'No Active Discrepancy' },
      { label: 'Re-Survey Status', value: 'NLRMP Completed 2025' },
    ],
  },

  'Town & Country Planning Department': {
    department: 'Town & Country Planning Department',
    layers: [
      { id: 'parcelBoundaries', label: 'Parcel Boundaries', defaultOn: true, category: 'core' },
      { id: 'masterPlan', label: 'Chennai Master Plan 2026-2036', defaultOn: true, category: 'departmental' },
      { id: 'zoning', label: 'Master Plan Zoning', defaultOn: true, category: 'departmental' },
      { id: 'landUse', label: 'Permitted Land Use', defaultOn: true, category: 'departmental' },
      { id: 'buildingPermissions', label: 'Building Plan Approvals', defaultOn: true, category: 'departmental' },
      { id: 'roadWidth', label: 'Abutting Road Width', defaultOn: true, category: 'spatial' },
      { id: 'fsi', label: 'FSI / FAR Zones', defaultOn: true, category: 'spatial' },
      { id: 'heightRestrictions', label: 'Airport Height Restrictions', defaultOn: true, category: 'spatial' },
    ],
    getOperationalFields: () => [
      { label: 'Planning Zone', value: 'Primary Residential (R2 Zone)' },
      { label: 'Max Permissible FSI', value: '2.0 (Premium FSI up to 2.5)', badge: 'bg-blue-100 text-blue-700' },
      { label: 'Building Approval Status', value: 'Plan Approvals CMDA/2026/0411' },
      { label: 'Abutting Road Width', value: '18.0 m (60 ft Road)' },
      { label: 'Airport Height Limit', value: 'Unrestricted (<60m max)' },
    ],
  },
};

export function getDepartmentGISConfig(department: string): DepartmentGISConfig {
  if (DEPARTMENT_GIS_CONFIGS[department]) {
    return DEPARTMENT_GIS_CONFIGS[department];
  }

  // General default fallback configuration for all other government departments
  return {
    department,
    layers: [
      { id: 'parcelBoundaries', label: 'Parcel Boundaries', defaultOn: true, category: 'core' },
      { id: 'ulpin', label: 'ULPIN Labels', defaultOn: true, category: 'core' },
      { id: 'landUse', label: 'Land Use & Zoning', defaultOn: true, category: 'departmental' },
      { id: 'utilities', label: 'Public Utilities', defaultOn: true, category: 'spatial' },
      { id: 'restrictions', label: 'Development Restrictions', defaultOn: true, category: 'spatial' },
      { id: 'grievances', label: 'Citizen Requests & Complaints', defaultOn: true, category: 'grievance' },
    ],
    getOperationalFields: () => [
      { label: 'Department Access', value: `Authorised view for ${department}` },
      { label: 'Jurisdiction Status', value: 'Verified Official Parcel Record' },
    ],
  };
}

