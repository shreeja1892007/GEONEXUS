export interface UsageTrendPoint {
  periodLabel: string;
  consumptionMLD: number;
  supplyMLD: number;
}

export const WATER_USAGE_TRENDS: Record<'7D' | '30D' | '6M' | '1Y', UsageTrendPoint[]> = {
  '7D': [
    { periodLabel: 'Monday', consumptionMLD: 4.1, supplyMLD: 6.8 },
    { periodLabel: 'Tuesday', consumptionMLD: 4.5, supplyMLD: 7.0 },
    { periodLabel: 'Wednesday', consumptionMLD: 5.2, supplyMLD: 7.2 },
    { periodLabel: 'Thursday', consumptionMLD: 4.7, supplyMLD: 7.1 },
    { periodLabel: 'Friday', consumptionMLD: 4.9, supplyMLD: 7.2 },
    { periodLabel: 'Saturday', consumptionMLD: 5.1, supplyMLD: 7.3 },
    { periodLabel: 'Sunday', consumptionMLD: 4.8, supplyMLD: 7.2 },
  ],
  '30D': [
    { periodLabel: 'Week 1', consumptionMLD: 4.3, supplyMLD: 6.9 },
    { periodLabel: 'Week 2', consumptionMLD: 4.6, supplyMLD: 7.1 },
    { periodLabel: 'Week 3', consumptionMLD: 4.9, supplyMLD: 7.2 },
    { periodLabel: 'Week 4', consumptionMLD: 4.8, supplyMLD: 7.2 },
  ],
  '6M': [
    { periodLabel: 'Apr', consumptionMLD: 4.2, supplyMLD: 6.7 },
    { periodLabel: 'May', consumptionMLD: 4.8, supplyMLD: 6.8 },
    { periodLabel: 'Jun', consumptionMLD: 5.4, supplyMLD: 7.0 },
    { periodLabel: 'Jul', consumptionMLD: 5.1, supplyMLD: 7.1 },
    { periodLabel: 'Aug', consumptionMLD: 4.7, supplyMLD: 7.2 },
    { periodLabel: 'Sep', consumptionMLD: 4.8, supplyMLD: 7.2 },
  ],
  '1Y': [
    { periodLabel: 'Q1', consumptionMLD: 4.1, supplyMLD: 6.6 },
    { periodLabel: 'Q2', consumptionMLD: 4.9, supplyMLD: 6.9 },
    { periodLabel: 'Q3', consumptionMLD: 5.2, supplyMLD: 7.1 },
    { periodLabel: 'Q4', consumptionMLD: 4.8, supplyMLD: 7.2 },
  ],
};

export const WATER_AVAILABILITY = {
  currentTotalMLD: 7.2,
  surfaceWaterMLD: 4.9,
  groundwaterMLD: 2.3,
  groundwaterLevelMeters: 14.8,
  rechargeRateMLD: 1.8,
  extractionRateMLD: 2.1,
  status: 'MODERATE' as const,
};

export const RESERVOIR_DAM_STATUS = {
  storagePercentage: 72,
  currentStorageMCM: 72,
  maxCapacityMCM: 100,
  inflowMLD: 2.4,
  outflowMLD: 1.9,
  status: 'NORMAL' as const,
};

export const WATER_CONSUMPTION = {
  totalTodayMLD: 4.8,
  domesticMLD: 2.1,
  agriculturalMLD: 1.7,
  industrialMLD: 0.7,
  institutionalMLD: 0.3,
  monthlyConsumptionML: 144.2,
  previousMonthML: 139.8,
  changePercentage: +3.1,
};

export const WATER_SOURCES = [
  { name: 'River', percentage: 32, color: '#246BCE' },
  { name: 'Reservoir', percentage: 28, color: '#087F8C' },
  { name: 'Groundwater', percentage: 24, color: '#7C3AED' },
  { name: 'Lakes', percentage: 9, color: '#2E7D32' },
  { name: 'Rainwater Harvesting', percentage: 7, color: '#E99A24' },
];

export const RAINFALL_METRICS = {
  todayMm: 82,
  forecastMm: 65,
  monthMm: 426,
  annualMm: 1248,
  comparedToAverage: '+7.4%',
};

export const GROUNDWATER_METRICS = {
  currentLevelMeters: 14.8,
  rechargeRateMLD: 1.8,
  extractionRateMLD: 2.1,
  levelChangeMeters: -0.8,
  status: 'WATCH' as const,
};

export const WEATHER_METRICS = {
  temperatureC: 29,
  humidityPercent: 76,
  rainfallForecastMm: 65,
  windSpeedKmh: 18,
  floodRisk: 'MODERATE' as const,
  droughtRisk: 'LOW' as const,
};

export const WATER_QUALITY_METRICS = {
  ph: { value: 7.2, status: 'Normal' },
  tds: { value: '320 ppm', status: 'Normal' },
  turbidity: { value: '2.1 NTU', status: 'Normal' },
  temperature: { value: '26.4°C', status: 'Normal' },
  dissolvedOxygen: { value: '7.8 mg/L', status: 'Good' },
  overallStatus: 'GOOD' as const,
  contaminationStatus: 'NO MAJOR ISSUE',
  samplesTestedToday: 18,
  passed: 17,
  requiresReview: 1,
};

export const WATER_RESOURCE_ASSET_STATUS = {
  canals: 126,
  lakes: 38,
  tanks: 94,
  reservoirs: 14,
  rivers: 17,
  borewells: 71,
  waterTreatmentPlants: 24,
  waterbodyRestrictions: 21,
  floodRiskAreas: 15,
  encroachmentCases: 11,
};

export interface WaterAlert {
  id: string;
  severity: 'HIGH' | 'MEDIUM' | 'LOW';
  alert: string;
  location: string;
  status: 'Needs Action' | 'Investigation' | 'Monitoring' | 'Assigned';
}

export const WATER_RESOURCE_ALERTS: WaterAlert[] = [
  { id: 'ALT-101', severity: 'HIGH', alert: 'Low groundwater level detected', location: 'Zone WR-08', status: 'Needs Action' },
  { id: 'ALT-102', severity: 'HIGH', alert: 'Possible lake encroachment', location: 'Lake WR-14', status: 'Investigation' },
  { id: 'ALT-103', severity: 'MEDIUM', alert: 'High domestic water consumption', location: 'Ward 21', status: 'Monitoring' },
  { id: 'ALT-104', severity: 'MEDIUM', alert: 'Canal obstruction reported', location: 'Canal CN-04', status: 'Assigned' },
  { id: 'ALT-105', severity: 'LOW', alert: 'Increased reservoir inflow', location: 'Reservoir R-02', status: 'Monitoring' },
];

export interface WaterReportItem {
  id: string;
  report: string;
  period: string;
  lastGenerated: string;
  actionLabel: string;
}

export const WATER_REPORTS: WaterReportItem[] = [
  { id: 'REP-01', report: 'Daily Water Availability Report', period: 'Daily', lastGenerated: '13 Sep 2026', actionLabel: 'Download PDF' },
  { id: 'REP-02', report: 'Water Consumption Summary', period: 'Monthly', lastGenerated: 'Sep 2026', actionLabel: 'Download CSV' },
  { id: 'REP-03', report: 'Reservoir Status Report', period: 'Daily', lastGenerated: '13 Sep 2026', actionLabel: 'Download PDF' },
  { id: 'REP-04', report: 'Groundwater Monitoring Report', period: 'Monthly', lastGenerated: 'Sep 2026', actionLabel: 'Download CSV' },
  { id: 'REP-05', report: 'Water Quality Report', period: 'Weekly', lastGenerated: '12 Sep 2026', actionLabel: 'Download PDF' },
  { id: 'REP-06', report: 'Rainfall Analysis', period: 'Monthly', lastGenerated: 'Sep 2026', actionLabel: 'Download CSV' },
  { id: 'REP-07', report: 'Citizen Request Report', period: 'Monthly', lastGenerated: 'Sep 2026', actionLabel: 'Download PDF' },
];

export interface WaterGISAsset {
  id: string;
  name: string;
  type: 'Reservoir' | 'Lake' | 'Canal' | 'River' | 'Borewell' | 'WTP' | 'Flood Zone' | 'Encroachment' | 'Complaint';
  center: [number, number];
  storagePercentage?: number;
  quality: 'GOOD' | 'MODERATE' | 'CRITICAL';
  activeAlerts: number;
  citizenRequests: number;
  details: string;
  coordinates?: [number, number][]; // Optional polygon
}

export const DEMO_WATER_GIS_ASSETS: WaterGISAsset[] = [
  {
    id: 'LAKE-WR14',
    name: 'Lake WR-14 (Chembarambakkam Lake)',
    type: 'Lake',
    center: [13.0112, 80.2185],
    storagePercentage: 68,
    quality: 'GOOD',
    activeAlerts: 1,
    citizenRequests: 2,
    details: 'Primary freshwater lake feeding western Chennai Metro.',
  },
  {
    id: 'RES-R02',
    name: 'Reservoir R-02 (Poondi Reservoir)',
    type: 'Reservoir',
    center: [13.0185, 80.2290],
    storagePercentage: 72,
    quality: 'GOOD',
    activeAlerts: 1,
    citizenRequests: 1,
    details: 'Storage capacity: 100 MCM. Inflow 2.4 MLD.',
  },
  {
    id: 'CANAL-CN04',
    name: 'Canal CN-04 (Buckingham Feeder)',
    type: 'Canal',
    center: [13.0045, 80.2240],
    quality: 'MODERATE',
    activeAlerts: 1,
    citizenRequests: 3,
    details: 'Feeder canal connecting southern supply network.',
  },
  {
    id: 'WTP-03',
    name: 'Water Treatment Plant WTP-03',
    type: 'WTP',
    center: [13.0090, 80.2275],
    quality: 'GOOD',
    activeAlerts: 0,
    citizenRequests: 0,
    details: 'Daily throughput: 1.8 MLD filtered water.',
  },
  {
    id: 'BW-28',
    name: 'Borewell Station BW-28',
    type: 'Borewell',
    center: [13.0015, 80.2150],
    quality: 'MODERATE',
    activeAlerts: 1,
    citizenRequests: 1,
    details: 'Deep aquifer monitoring point, level 14.8m.',
  },
  {
    id: 'ENC-09',
    name: 'Encroachment Spot ENC-09',
    type: 'Encroachment',
    center: [13.0135, 80.2210],
    quality: 'CRITICAL',
    activeAlerts: 1,
    citizenRequests: 2,
    details: 'Unauthorised bund filling reported by citizens.',
  },
];
