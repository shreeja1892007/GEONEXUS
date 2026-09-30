import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Droplets,
  ClipboardList,
  AlertTriangle,
  TrendingUp,
  Activity,
  CloudRain,
  Sun,
  ShieldCheck,
  Building2,
  FileText,
  Download,
  ArrowRight,
  Layers,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { useAuth } from '../../../context/AuthContext';
import { useApplications } from '../../../context/ApplicationContext';
import { WaterResourcesGISMap } from './WaterResourcesGISMap';
import {
  WATER_USAGE_TRENDS,
  WATER_AVAILABILITY,
  RESERVOIR_DAM_STATUS,
  WATER_CONSUMPTION,
  WATER_SOURCES,
  RAINFALL_METRICS,
  GROUNDWATER_METRICS,
  WEATHER_METRICS,
  WATER_QUALITY_METRICS,
  WATER_RESOURCE_ASSET_STATUS,
  WATER_RESOURCE_ALERTS,
  WATER_REPORTS,
} from '../../../data/waterResourcesData';

export const WaterResourcesDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { currentGovUser } = useAuth();
  const { getApplicationsForGovUser } = useApplications();

  const [trendRange, setTrendRange] = useState<'7D' | '30D' | '6M' | '1Y'>('7D');
  const [downloadingReport, setDownloadingReport] = useState<string | null>(null);

  // Authenticated Officer Metadata
  const officerName = currentGovUser?.fullName || 'S. Water Resources Official';
  const officerRole = currentGovUser?.officialRole || 'Water Resources Officer';
  const departmentName = currentGovUser?.department || 'Water Resources Department';
  const districtName = currentGovUser?.districtOffice || 'Chennai District';
  const stateName = currentGovUser?.state || 'Tamil Nadu';

  // Live Citizen Requests from shared store
  const myApplications = currentGovUser ? getApplicationsForGovUser(currentGovUser) : [];
  const newRequestsCount = myApplications.filter(
    (a) => a.status === 'Routed' || a.status === 'Submitted'
  ).length;
  const underReviewCount = myApplications.filter((a) => a.status === 'Under Review').length;
  const moreInfoCount = myApplications.filter((a) => a.status === 'More Information Required').length;
  const approvedCount = myApplications.filter(
    (a) => a.status === 'Approved' || a.status === 'Completed'
  ).length;

  const handleDownload = (reportId: string, name: string) => {
    setDownloadingReport(reportId);
    setTimeout(() => {
      setDownloadingReport(null);
      alert(`Downloaded report: ${name}`);
    }, 800);
  };

  return (
    <div className="space-y-6">
      {/* ── HEADER / OFFICER INFORMATION ─────────────────────────────────────── */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-start sm:items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-navy text-white flex items-center justify-center shrink-0 shadow-sm">
            <Droplets className="w-7 h-7 text-tealAccent-light" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold text-navy tracking-tight">
                WATER RESOURCES ADMINISTRATION DASHBOARD
              </h1>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-navy/10 text-navy border border-navy/20">
                <ShieldCheck className="w-3 h-3 text-tealAccent" />
                {departmentName}
              </span>
            </div>
            <p className="text-xs sm:text-sm font-semibold text-slate-600 mt-1">
              {districtName} • <span className="text-tealAccent">{officerRole}</span>
            </p>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Welcome, <strong>{officerName}</strong> — Monitor water resources, citizen requests, water availability, reservoirs, groundwater, rainfall, water quality and departmental alerts.
            </p>
          </div>
        </div>
      </div>

      {/* ── SECTION 1 — DEPARTMENT OVERVIEW (4 KPI CARDS) ───────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          icon={<Droplets className="w-5 h-5 text-primaryBlue" />}
          metric="384"
          label="Water Assets"
          description="Active Assets"
          bgColor="bg-blue-50 border-blue-200 text-blue-900"
        />
        <KpiCard
          icon={<ClipboardList className="w-5 h-5 text-tealAccent" />}
          metric={String(myApplications.length > 0 ? myApplications.length : 42)}
          label="Citizen Requests"
          description={`${newRequestsCount} New / Routed`}
          bgColor="bg-teal-50 border-teal-200 text-teal-900"
        />
        <KpiCard
          icon={<Activity className="w-5 h-5 text-amber-600" />}
          metric="18"
          label="Inspections"
          description="Pending / Active"
          bgColor="bg-amber-50 border-amber-200 text-amber-900"
        />
        <KpiCard
          icon={<AlertTriangle className="w-5 h-5 text-red-600" />}
          metric="7"
          label="Critical Alerts"
          description="Needs Attention"
          bgColor="bg-red-50 border-red-200 text-red-900"
        />
      </div>

      {/* ── SECTION 2 — WATER MONITORING KPIs ─────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MonitoringCard
          title="WATER LEVEL"
          value="72%"
          subtitle="Reservoir Level"
          badge="NORMAL"
          badgeColor="bg-emerald-100 text-emerald-700 border-emerald-300"
        />
        <MonitoringCard
          title="AVAILABLE WATER"
          value="7.2 MLD"
          subtitle="Current Supply"
          badge="STABLE"
          badgeColor="bg-blue-100 text-blue-700 border-blue-300"
        />
        <MonitoringCard
          title="CONSUMPTION"
          value="4.8 MLD"
          subtitle="Daily Usage"
          badge="MODERATE"
          badgeColor="bg-amber-100 text-amber-700 border-amber-300"
        />
        <MonitoringCard
          title="WATER QUALITY"
          value="GOOD"
          subtitle="Overall Status"
          badge="PASS"
          badgeColor="bg-emerald-100 text-emerald-700 border-emerald-300"
        />
      </div>

      {/* ── SECTION 3 — WATER USAGE TREND ────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="text-base font-bold text-navy flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primaryBlue" /> Water Usage Trend
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Daily water consumption vs total supply capacity across the district network.
            </p>
          </div>
          {/* Time range toggle controls */}
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200 self-start sm:self-auto">
            {(['7D', '30D', '6M', '1Y'] as const).map((rng) => (
              <button
                key={rng}
                type="button"
                onClick={() => setTrendRange(rng)}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                  trendRange === rng
                    ? 'bg-navy text-white shadow-xs'
                    : 'text-slate-600 hover:text-navy hover:bg-slate-200'
                }`}
              >
                {rng === '7D' ? '7 Days' : rng === '30D' ? '30 Days' : rng === '6M' ? '6 Months' : '1 Year'}
              </button>
            ))}
          </div>
        </div>

        {/* Recharts Area Chart */}
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={WATER_USAGE_TRENDS[trendRange]}>
              <defs>
                <linearGradient id="colorConsumption" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#246BCE" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#246BCE" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="colorSupply" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#087F8C" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#087F8C" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
              <XAxis dataKey="periodLabel" tick={{ fontSize: 11, fill: '#64748B' }} />
              <YAxis unit=" MLD" tick={{ fontSize: 11, fill: '#64748B' }} domain={[0, 10]} />
              <Tooltip
                contentStyle={{ backgroundColor: '#1E293B', borderRadius: '12px', color: '#FFF', fontSize: '12px' }}
              />
              <Area type="monotone" dataKey="supplyMLD" name="Supply Capacity" stroke="#087F8C" fillOpacity={1} fill="url(#colorSupply)" strokeWidth={2} />
              <Area type="monotone" dataKey="consumptionMLD" name="Consumption" stroke="#246BCE" fillOpacity={1} fill="url(#colorConsumption)" strokeWidth={2.5} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ── SECTION 4 & 5 — WATER AVAILABILITY + RESERVOIR / DAM STATUS ─────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Section 4: Water Availability */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between border-b pb-3 border-slate-100">
            <h3 className="text-base font-bold text-navy flex items-center gap-2">
              <Droplets className="w-5 h-5 text-tealAccent" /> Water Availability
            </h3>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-700 border border-amber-300">
              {WATER_AVAILABILITY.status}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
              <span className="text-[11px] text-slate-400 font-semibold block">Current Water Availability</span>
              <span className="text-lg font-bold text-navy">{WATER_AVAILABILITY.currentTotalMLD} MLD</span>
            </div>
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
              <span className="text-[11px] text-slate-400 font-semibold block">Surface Water Availability</span>
              <span className="text-lg font-bold text-navy">{WATER_AVAILABILITY.surfaceWaterMLD} MLD</span>
            </div>
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
              <span className="text-[11px] text-slate-400 font-semibold block">Groundwater Availability</span>
              <span className="text-lg font-bold text-navy">{WATER_AVAILABILITY.groundwaterMLD} MLD</span>
            </div>
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
              <span className="text-[11px] text-slate-400 font-semibold block">Groundwater Level</span>
              <span className="text-lg font-bold text-navy">{WATER_AVAILABILITY.groundwaterLevelMeters} m</span>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 text-xs flex justify-between text-slate-600">
            <span>Recharge Rate: <strong className="text-navy">{WATER_AVAILABILITY.rechargeRateMLD} MLD</strong></span>
            <span>Extraction Rate: <strong className="text-navy">{WATER_AVAILABILITY.extractionRateMLD} MLD</strong></span>
          </div>
        </div>

        {/* Section 5: Reservoir / Dam Status */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between border-b pb-3 border-slate-100">
            <h3 className="text-base font-bold text-navy flex items-center gap-2">
              <Building2 className="w-5 h-5 text-primaryBlue" /> Reservoir / Dam Status
            </h3>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700 border border-emerald-300">
              {RESERVOIR_DAM_STATUS.status}
            </span>
          </div>

          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-slate-600">Reservoir Storage ({RESERVOIR_DAM_STATUS.storagePercentage}%)</span>
                <span className="text-navy font-bold">{RESERVOIR_DAM_STATUS.currentStorageMCM} / {RESERVOIR_DAM_STATUS.maxCapacityMCM} MCM</span>
              </div>
              <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-tealAccent rounded-full" style={{ width: `${RESERVOIR_DAM_STATUS.storagePercentage}%` }} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs pt-1">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <span className="text-[11px] text-slate-400 font-semibold block">Inflow</span>
                <span className="text-base font-bold text-emerald-600">+{RESERVOIR_DAM_STATUS.inflowMLD} MLD</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <span className="text-[11px] text-slate-400 font-semibold block">Outflow</span>
                <span className="text-base font-bold text-navy">-{RESERVOIR_DAM_STATUS.outflowMLD} MLD</span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => alert('Opening Reservoir Details Modal...')}
            className="w-full py-2 bg-navy text-white text-xs font-semibold rounded-xl hover:bg-navy/90 transition-colors"
          >
            View Reservoir Details
          </button>
        </div>
      </div>

      {/* ── SECTION 6 & 7 — WATER CONSUMPTION + WATER SOURCES ───────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Section 6: Water Consumption */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b pb-3 border-slate-100">
            <h3 className="text-base font-bold text-navy flex items-center gap-2">
              <Activity className="w-5 h-5 text-amber-600" /> Water Consumption
            </h3>
            <span className="text-xs text-slate-500">Total Today: <strong className="text-navy">{WATER_CONSUMPTION.totalTodayMLD} MLD</strong></span>
          </div>

          {/* Distribution Progress Bars */}
          <div className="space-y-2.5 text-xs">
            <ConsumptionBar label="Domestic" value="2.1 MLD" percent={44} color="bg-blue-600" />
            <ConsumptionBar label="Agricultural" value="1.7 MLD" percent={35} color="bg-emerald-600" />
            <ConsumptionBar label="Industrial" value="0.7 MLD" percent={15} color="bg-purple-600" />
            <ConsumptionBar label="Institutional" value="0.3 MLD" percent={6} color="bg-amber-600" />
          </div>

          <div className="pt-3 border-t border-slate-100 grid grid-cols-3 gap-2 text-center text-xs">
            <div>
              <span className="text-[10px] text-slate-400 font-semibold block">Monthly</span>
              <span className="font-bold text-navy">{WATER_CONSUMPTION.monthlyConsumptionML} ML</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-semibold block">Previous Month</span>
              <span className="font-bold text-navy">{WATER_CONSUMPTION.previousMonthML} ML</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-semibold block">Change</span>
              <span className="font-bold text-amber-600">{WATER_CONSUMPTION.changePercentage}%</span>
            </div>
          </div>
        </div>

        {/* Section 7: Water Sources */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between border-b pb-3 border-slate-100">
            <h3 className="text-base font-bold text-navy flex items-center gap-2">
              <Layers className="w-5 h-5 text-tealAccent" /> Water Sources
            </h3>
            <span className="text-xs font-semibold text-tealAccent">Primary: Reservoir</span>
          </div>

          <div className="space-y-2 text-xs">
            {WATER_SOURCES.map((src) => (
              <div key={src.name} className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-100">
                <span className="font-semibold text-navy flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: src.color }} />
                  {src.name}
                </span>
                <span className="font-bold text-slate-700">{src.percentage}%</span>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={() => alert('Opening Water Source Registry Details...')}
            className="w-full py-2 bg-white text-navy border border-slate-300 text-xs font-semibold rounded-xl hover:bg-slate-50 transition-colors"
          >
            View Source Details
          </button>
        </div>
      </div>

      {/* ── SECTION 8, 9 & 10 — RAINFALL + GROUNDWATER + WEATHER ─────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Section 8: Rainfall */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3">
          <div className="flex items-center gap-2 text-navy font-bold text-sm border-b pb-2">
            <CloudRain className="w-4 h-4 text-primaryBlue" /> Rainfall
          </div>
          <div className="space-y-1.5 text-xs">
            <RowItem label="Today" value={`${RAINFALL_METRICS.todayMm} mm`} />
            <RowItem label="Forecast" value={`${RAINFALL_METRICS.forecastMm} mm`} />
            <RowItem label="This Month" value={`${RAINFALL_METRICS.monthMm} mm`} />
            <RowItem label="Annual" value={`${RAINFALL_METRICS.annualMm} mm`} />
            <RowItem label="Compared to Avg" value={RAINFALL_METRICS.comparedToAverage} highlight />
          </div>
        </div>

        {/* Section 9: Groundwater */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b pb-2">
            <span className="flex items-center gap-2 text-navy font-bold text-sm">
              <Activity className="w-4 h-4 text-purple-600" /> Groundwater
            </span>
            <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-amber-100 text-amber-700 border border-amber-300">
              {GROUNDWATER_METRICS.status}
            </span>
          </div>
          <div className="space-y-1.5 text-xs">
            <RowItem label="Current Level" value={`${GROUNDWATER_METRICS.currentLevelMeters} m`} />
            <RowItem label="Recharge Rate" value={`${GROUNDWATER_METRICS.rechargeRateMLD} MLD`} />
            <RowItem label="Extraction Rate" value={`${GROUNDWATER_METRICS.extractionRateMLD} MLD`} />
            <RowItem label="Level Change" value={`${GROUNDWATER_METRICS.levelChangeMeters} m`} highlight />
          </div>
        </div>

        {/* Section 10: Weather */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3">
          <div className="flex items-center gap-2 text-navy font-bold text-sm border-b pb-2">
            <Sun className="w-4 h-4 text-amber-500" /> Weather
          </div>
          <div className="space-y-1.5 text-xs">
            <RowItem label="Temperature" value={`${WEATHER_METRICS.temperatureC}°C`} />
            <RowItem label="Humidity" value={`${WEATHER_METRICS.humidityPercent}%`} />
            <RowItem label="Rain Forecast" value={`${WEATHER_METRICS.rainfallForecastMm} mm`} />
            <RowItem label="Wind" value={`${WEATHER_METRICS.windSpeedKmh} km/h`} />
            <div className="flex justify-between pt-1 border-t border-slate-100 text-[11px]">
              <span>Flood: <strong className="text-amber-600">{WEATHER_METRICS.floodRisk}</strong></span>
              <span>Drought: <strong className="text-emerald-600">{WEATHER_METRICS.droughtRisk}</strong></span>
            </div>
          </div>
        </div>
      </div>

      {/* ── SECTION 11 — WATER QUALITY (FULL-WIDTH SECTION) ─────────────────── */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-3 border-slate-100">
          <div>
            <h3 className="text-base font-bold text-navy flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600" /> Water Quality Monitoring
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Real-time physicochemical parameters sampled from central water quality sensors.
            </p>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <span>Overall: <strong className="text-emerald-600">{WATER_QUALITY_METRICS.overallStatus}</strong></span>
            <span>Contamination: <strong className="text-navy">{WATER_QUALITY_METRICS.contaminationStatus}</strong></span>
          </div>
        </div>

        {/* Metric Pill Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          <QualityPill label="pH Level" value={String(WATER_QUALITY_METRICS.ph.value)} status={WATER_QUALITY_METRICS.ph.status} />
          <QualityPill label="TDS" value={WATER_QUALITY_METRICS.tds.value} status={WATER_QUALITY_METRICS.tds.status} />
          <QualityPill label="Turbidity" value={WATER_QUALITY_METRICS.turbidity.value} status={WATER_QUALITY_METRICS.turbidity.status} />
          <QualityPill label="Temperature" value={WATER_QUALITY_METRICS.temperature.value} status={WATER_QUALITY_METRICS.temperature.status} />
          <QualityPill label="Dissolved Oxygen" value={WATER_QUALITY_METRICS.dissolvedOxygen.value} status={WATER_QUALITY_METRICS.dissolvedOxygen.status} />
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-2 border-t border-slate-100 text-xs">
          <div className="flex gap-4 text-slate-600">
            <span>Tested Today: <strong className="text-navy">{WATER_QUALITY_METRICS.samplesTestedToday}</strong></span>
            <span>Passed: <strong className="text-emerald-600">{WATER_QUALITY_METRICS.passed}</strong></span>
            <span>Requires Review: <strong className="text-amber-600">{WATER_QUALITY_METRICS.requiresReview}</strong></span>
          </div>
          <button
            type="button"
            onClick={() => alert('Opening Full Quality Monitoring Dashboard...')}
            className="px-4 py-2 bg-navy text-white text-xs font-semibold rounded-xl hover:bg-navy/90 transition-colors"
          >
            View Quality Monitoring
          </button>
        </div>
      </div>

      {/* ── SECTION 12 & 13 — CITIZEN REQUESTS + WATER RESOURCE STATUS ───────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Section 12: Citizen Requests Summary */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b pb-3 border-slate-100">
            <div className="flex items-center gap-2">
              <ClipboardList className="w-5 h-5 text-tealAccent" />
              <h3 className="text-base font-bold text-navy">Citizen Requests Breakdown</h3>
            </div>
            <Link to="/government/requests" className="text-xs font-semibold text-primaryBlue hover:underline flex items-center gap-1">
              View All <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-1">
              <span className="text-slate-400 font-semibold block text-[11px]">Canal Issues</span>
              <span className="text-base font-bold text-navy">12</span>
            </div>
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-1">
              <span className="text-slate-400 font-semibold block text-[11px]">Lake Issues</span>
              <span className="text-base font-bold text-navy">8</span>
            </div>
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-1">
              <span className="text-slate-400 font-semibold block text-[11px]">Encroachments</span>
              <span className="text-base font-bold text-navy">6</span>
            </div>
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-1">
              <span className="text-slate-400 font-semibold block text-[11px]">Waterbody Complaints</span>
              <span className="text-base font-bold text-navy">9</span>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
            <span>New/Routed: <strong className="text-blue-600">{newRequestsCount}</strong></span>
            <span>Under Review: <strong className="text-amber-600">{underReviewCount}</strong></span>
            <span>More Info: <strong className="text-orange-600">{moreInfoCount}</strong></span>
            <span>Approved: <strong className="text-emerald-600">{approvedCount}</strong></span>
          </div>
        </div>

        {/* Section 13: Water Resource Status Asset Counts */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b pb-3 border-slate-100">
            <h3 className="text-base font-bold text-navy flex items-center gap-2">
              <Building2 className="w-5 h-5 text-primaryBlue" /> Water Resource Asset Registry
            </h3>
            <span className="text-xs font-semibold text-slate-500">384 Assets</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
            <AssetPill label="Canals" count={WATER_RESOURCE_ASSET_STATUS.canals} />
            <AssetPill label="Lakes" count={WATER_RESOURCE_ASSET_STATUS.lakes} />
            <AssetPill label="Tanks" count={WATER_RESOURCE_ASSET_STATUS.tanks} />
            <AssetPill label="Reservoirs" count={WATER_RESOURCE_ASSET_STATUS.reservoirs} />
            <AssetPill label="Rivers" count={WATER_RESOURCE_ASSET_STATUS.rivers} />
            <AssetPill label="Borewells" count={WATER_RESOURCE_ASSET_STATUS.borewells} />
            <AssetPill label="WTPs" count={WATER_RESOURCE_ASSET_STATUS.waterTreatmentPlants} />
            <AssetPill label="Restrictions" count={WATER_RESOURCE_ASSET_STATUS.waterbodyRestrictions} />
            <AssetPill label="Encroachments" count={WATER_RESOURCE_ASSET_STATUS.encroachmentCases} alert />
          </div>

          <button
            type="button"
            onClick={() => alert('Opening Water Asset Registry Table...')}
            className="w-full py-2 bg-navy text-white text-xs font-semibold rounded-xl hover:bg-navy/90 transition-colors"
          >
            View Asset Registry
          </button>
        </div>
      </div>

      {/* ── SECTION 14 — RECENT CITIZEN REQUEST TABLE ───────────────────────── */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b pb-3 border-slate-100">
          <div>
            <h3 className="text-base font-bold text-navy flex items-center gap-2">
              <ClipboardList className="w-5 h-5 text-tealAccent" /> Recent Citizen Requests
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Citizen applications submitted for {departmentName} in {districtName}, {stateName}.
            </p>
          </div>
          <Link to="/government/requests" className="text-xs font-semibold text-primaryBlue hover:underline">
            View All →
          </Link>
        </div>

        {myApplications.length === 0 ? (
          <div className="text-center py-10">
            <ClipboardList className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="text-xs font-semibold text-slate-500">No citizen requests in your queue.</p>
            <p className="text-[11px] text-slate-400 mt-1">
              Submit a request from Citizen Portal (e.g. <em>Issue related to canal/lake/waterbody</em>) to test.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-500 border-b border-slate-200">
                  <th className="py-2.5 px-3 font-semibold">Application ID</th>
                  <th className="py-2.5 px-3 font-semibold">Citizen</th>
                  <th className="py-2.5 px-3 font-semibold">Purpose</th>
                  <th className="py-2.5 px-3 font-semibold">Location</th>
                  <th className="py-2.5 px-3 font-semibold">District</th>
                  <th className="py-2.5 px-3 font-semibold">Submitted</th>
                  <th className="py-2.5 px-3 font-semibold">Status</th>
                  <th className="py-2.5 px-3 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {myApplications.slice(0, 5).map((app) => (
                  <tr key={app.applicationId} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-3 font-mono font-bold text-primaryBlue">{app.applicationId}</td>
                    <td className="py-3 px-3 font-semibold text-navy">{app.citizenName}</td>
                    <td className="py-3 px-3 text-slate-700">{app.purposeLabel}</td>
                    <td className="py-3 px-3 text-slate-500">{app.surveyNumber ? `Survey ${app.surveyNumber}` : app.location.villageOrWard || 'Chennai'}</td>
                    <td className="py-3 px-3 text-slate-600">{app.location.district}</td>
                    <td className="py-3 px-3 text-slate-500">{new Date(app.submittedAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}</td>
                    <td className="py-3 px-3">
                      <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full border ${
                        app.status === 'Approved' || app.status === 'Completed'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : app.status === 'Under Review'
                          ? 'bg-amber-50 text-amber-700 border-amber-200'
                          : 'bg-blue-50 text-blue-700 border-blue-200'
                      }`}>
                        {app.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        type="button"
                        onClick={() => navigate(`/government/requests/${app.applicationId}`)}
                        className="px-3 py-1 bg-navy text-white text-[11px] font-semibold rounded-lg hover:bg-navy/90"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── SECTION 16 — ALERTS TABLE ────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b pb-3 border-slate-100">
          <h3 className="text-base font-bold text-navy flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-600" /> Water Resource Alerts
          </h3>
          <button type="button" onClick={() => alert('Viewing All Alerts...')} className="text-xs font-semibold text-primaryBlue hover:underline">
            View All Alerts →
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 border-b border-slate-200">
                <th className="py-2.5 px-3 font-semibold">Severity</th>
                <th className="py-2.5 px-3 font-semibold">Alert Description</th>
                <th className="py-2.5 px-3 font-semibold">Location</th>
                <th className="py-2.5 px-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {WATER_RESOURCE_ALERTS.map((alt) => (
                <tr key={alt.id} className="hover:bg-slate-50">
                  <td className="py-2.5 px-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      alt.severity === 'HIGH' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {alt.severity}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 font-semibold text-navy">{alt.alert}</td>
                  <td className="py-2.5 px-3 text-slate-500">{alt.location}</td>
                  <td className="py-2.5 px-3 text-slate-600">{alt.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── SECTION 17 — WATER RESOURCES GIS ─────────────────────────────────── */}
      <WaterResourcesGISMap />

      {/* ── SECTION 18 — REPORTS & DATA TABLE ────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b pb-3 border-slate-100">
          <div>
            <h3 className="text-base font-bold text-navy flex items-center gap-2">
              <FileText className="w-5 h-5 text-tealAccent" /> Reports & Departmental Data
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Download certified hydrological summaries and citizen grievance statistics.
            </p>
          </div>
          <button
            type="button"
            onClick={() => alert('Generating Custom Water Resources Report...')}
            className="px-3.5 py-2 bg-navy text-white text-xs font-semibold rounded-xl hover:bg-navy/90 transition-colors"
          >
            Generate Custom Report
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 border-b border-slate-200">
                <th className="py-2.5 px-3 font-semibold">Report Name</th>
                <th className="py-2.5 px-3 font-semibold">Period</th>
                <th className="py-2.5 px-3 font-semibold">Last Generated</th>
                <th className="py-2.5 px-3 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {WATER_REPORTS.map((rep) => (
                <tr key={rep.id} className="hover:bg-slate-50">
                  <td className="py-3 px-3 font-semibold text-navy">{rep.report}</td>
                  <td className="py-3 px-3 text-slate-500">{rep.period}</td>
                  <td className="py-3 px-3 text-slate-500">{rep.lastGenerated}</td>
                  <td className="py-3 px-3 text-right">
                    <button
                      type="button"
                      onClick={() => handleDownload(rep.id, rep.report)}
                      disabled={downloadingReport === rep.id}
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-navy text-[11px] font-semibold rounded-lg transition-colors border border-slate-300"
                    >
                      <Download className="w-3 h-3 text-primaryBlue" />
                      {downloadingReport === rep.id ? 'Downloading...' : rep.actionLabel}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// ─── SUB-COMPONENTS ──────────────────────────────────────────────────────────

function KpiCard({ icon, metric, label, description, bgColor }: { icon: React.ReactNode; metric: string; label: string; description: string; bgColor: string }) {
  return (
    <div className={`p-5 rounded-2xl border ${bgColor} hover:shadow-card transition-all flex flex-col justify-between`}>
      <div className="flex items-center justify-between mb-2">
        <span className="p-2 bg-white rounded-xl shadow-2xs border border-slate-100">{icon}</span>
        <span className="text-2xl font-bold font-mono">{metric}</span>
      </div>
      <div>
        <p className="text-xs font-bold">{label}</p>
        <p className="text-[11px] opacity-80 mt-0.5">{description}</p>
      </div>
    </div>
  );
}

function MonitoringCard({ title, value, subtitle, badge, badgeColor }: { title: string; value: string; subtitle: string; badge: string; badgeColor: string }) {
  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{title}</span>
        <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full border ${badgeColor}`}>{badge}</span>
      </div>
      <div>
        <p className="text-2xl font-extrabold text-navy font-mono">{value}</p>
        <p className="text-xs font-semibold text-slate-500 mt-0.5">{subtitle}</p>
      </div>
    </div>
  );
}

function ConsumptionBar({ label, value, percent, color }: { label: string; value: string; percent: number; color: string }) {
  return (
    <div>
      <div className="flex justify-between text-xs font-semibold mb-1">
        <span className="text-slate-700">{label}</span>
        <span className="text-navy font-bold">{value} ({percent}%)</span>
      </div>
      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}

function RowItem({ label, value, highlight = false }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-slate-500">{label}:</span>
      <span className={`font-bold ${highlight ? 'text-primaryBlue' : 'text-navy'}`}>{value}</span>
    </div>
  );
}

function QualityPill({ label, value, status }: { label: string; value: string; status: string }) {
  return (
    <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-center">
      <span className="text-[10px] text-slate-400 font-semibold block uppercase">{label}</span>
      <span className="text-base font-bold text-navy block mt-0.5 font-mono">{value}</span>
      <span className="text-[10px] font-bold text-emerald-600">{status}</span>
    </div>
  );
}

function AssetPill({ label, count, alert = false }: { label: string; count: number; alert?: boolean }) {
  return (
    <div className={`p-2.5 rounded-xl border flex items-center justify-between ${alert ? 'bg-red-50 border-red-200 text-red-800' : 'bg-slate-50 border-slate-100 text-navy'}`}>
      <span className="font-semibold">{label}</span>
      <span className="font-bold font-mono">{count}</span>
    </div>
  );
}
