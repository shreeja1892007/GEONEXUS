export type LandUseType =
  | 'Residential'
  | 'Commercial'
  | 'Industrial'
  | 'Institutional'
  | 'Agricultural'
  | 'Open Space'
  | 'Mixed Use';

export interface RoRRecord {
  rorNumber: string;
  status: 'Linked' | 'Pending' | 'Disputed';
  ownershipType: 'Private' | 'Government' | 'Joint' | 'Institutional';
  recordedOwnersCount: number;
  mutationStatus: 'Completed' | 'In Process' | 'Objection Raised';
  landClassification: string;
  soilClassification: string;
  revenueAssessed: string;
  lastUpdated: string;
}

export interface RegistrationRecord {
  id: string;
  type: 'Sale Deed' | 'Partition Deed' | 'Settlement Deed' | 'Gift Deed' | 'Mortgage Deed';
  registrationNumber: string;
  date: string;
  status: 'Registered' | 'Pending';
  subRegistrarOffice: string;
  considerationAmount?: string;
  stampDutyPaid: string;
}

export interface PlanningRecord {
  planningZone: string; // e.g. "R2 - Primary Residential"
  masterPlan: string; // e.g. "Chennai Metropolitan Development Plan 2026-2046"
  permittedLandUse: string;
  currentLandUse: LandUseType;
  fsi: number; // Floor Space Index, e.g. 2.0
  heightLimit: string; // e.g. "18.3 Metres (Stilt + 5 floors)"
  applicableRestrictions: string[];
}

export interface BuildingRecord {
  permissionStatus: 'Approved' | 'In Review' | 'Not Applicable' | 'Restricted';
  approvalNumber?: string;
  buildingType?: string;
  approvedFloors?: string;
  builtUpArea?: string;
  approvalDate?: string;
  completionCertificateStatus?: 'Issued' | 'Pending Inspection' | 'Not Applicable';
  occupancyCertificateStatus?: 'Issued' | 'Pending' | 'Not Applicable';
}

export interface TaxRecord {
  assessmentNumber: string;
  wardNumber: string;
  propertyCategory: string;
  financialYear: string;
  taxStatus: 'Paid' | 'Pending' | 'Exempted';
  lastPaymentDate?: string;
  receiptNumber?: string;
  annualAssessment: string;
  outstandingAmount: string;
}

export interface EncumbranceRecord {
  encumbranceStatus: 'Clear' | 'Mortgage Exists' | 'Leasehold' | 'Lien Active';
  type?: string;
  institution?: string;
  status?: 'Active' | 'Discharged' | 'None';
  startDate?: string;
  loanReference?: string;
}

export interface DisputeRecord {
  courtDisputeStatus: 'None' | 'Case Pending' | 'Under Arbitration';
  courtOrAuthority?: string;
  caseType?: string;
  caseNumber?: string;
  filingDate?: string;
  stayOrder: 'No' | 'Active Interim Stay' | 'None';
  prayer?: string;
  nextHearingDate?: string;
}

export interface UtilitiesRecord {
  roadAccess: string;
  waterNetwork: string;
  sewerNetwork: string;
  electricity: string;
  stormwaterDrain: string;
  telecomFiber: string;
}

export interface DocumentRecord {
  id: string;
  title: string;
  code: string;
  category: string;
  date: string;
  isCertifiedAvailable: boolean;
}

export interface HistoryEvent {
  year: string;
  title: string;
  description: string;
  authority: string;
}

export interface Parcel {
  id: string;
  ulpin: string; // Unique Land Parcel Identification Number
  surveyNumber: string; // e.g. "54/2B"
  village: string;
  ward: string;
  district: string;
  state: string;
  area: number;
  areaUnit: 'm²' | 'sq.ft' | 'Acres' | 'Hectares';
  landUse: LandUseType;
  planningZone: string;
  ownershipType: 'Private' | 'Government' | 'Joint' | 'Institutional';
  ownerCount: number;
  ownersSummary: string; // Privacy compliant summary (e.g. "2 Recorded Private Owners")
  rorStatus: 'Linked' | 'Pending' | 'Disputed';
  registrationStatus: 'Registered' | 'Pending Verification';
  encumbranceStatus: 'Clear' | 'Mortgage Exists' | 'Leasehold' | 'Lien Active';
  taxStatus: 'Paid' | 'Pending' | 'Exempted';
  buildingPermissionStatus: 'Approved' | 'In Review' | 'Not Applicable' | 'Restricted';
  courtDisputeStatus: 'None' | 'Case Pending' | 'Under Arbitration';
  lastUpdated: string;
  
  // GIS Geometries
  center: [number, number]; // [lat, lng]
  polygon: [number, number][]; // Array of [lat, lng]
  isUserProperty?: boolean;

  // Integrated Subsystems
  ror: RoRRecord;
  registrations: RegistrationRecord[];
  planning: PlanningRecord;
  building: BuildingRecord;
  tax: TaxRecord;
  encumbrance: EncumbranceRecord;
  disputes: DisputeRecord;
  utilities: UtilitiesRecord;
  documents: DocumentRecord[];
  history: HistoryEvent[];
}

export interface CitizenApplication {
  id: string;
  service: string;
  parcelUlpin: string;
  surveyNumber: string;
  submittedDate: string;
  status: 'Processing' | 'Approved' | 'Submitted' | 'Action Required';
  remarks: string;
}

export interface CitizenTransaction {
  id: string;
  type: string;
  registrationNumber: string;
  parcelUlpin: string;
  surveyNumber: string;
  date: string;
  status: 'Registered' | 'Completed' | 'Pending';
  subRegistrarOffice: string;
}
