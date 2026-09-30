import React, { useState } from 'react';
import {
  TrendingUp,
  BarChart3,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { GovernmentLayout } from '../../components/layout/GovernmentLayout';
import { useAuth } from '../../context/AuthContext';
import { useApplications } from '../../context/ApplicationContext';

export const GovernmentAnalyticsPage: React.FC = () => {
  const { currentGovUser } = useAuth();
  const { getApplicationsForGovUser } = useApplications();

  const departmentName = currentGovUser?.department || 'Department of Land Resources';
  const officerRole = currentGovUser?.officialRole || 'Government Officer';
  const districtName = currentGovUser?.districtOffice || 'Chennai District';

  const myApps = currentGovUser ? getApplicationsForGovUser(currentGovUser) : [];
  const routedCount = myApps.filter((a) => a.status === 'Routed' || a.status === 'Submitted').length;
  const reviewCount = myApps.filter((a) => a.status === 'Under Review').length;
  const moreInfoCount = myApps.filter((a) => a.status === 'More Information Required').length;
  const approvedCount = myApps.filter((a) => a.status === 'Approved' || a.status === 'Completed').length;

  const [timeRange, setTimeRange] = useState<'30D' | '90D' | '1Y'>('30D');

  const monthlyVelocityData = [
    { month: 'Apr', received: 42, processed: 38 },
    { month: 'May', received: 55, processed: 50 },
    { month: 'Jun', received: 68, processed: 62 },
    { month: 'Jul', received: 60, processed: 58 },
    { month: 'Aug', received: 72, processed: 69 },
    { month: 'Sep', received: 48, processed: 44 },
  ];

  const statusPieData = [
    { name: 'Approved/Completed', value: approvedCount > 0 ? approvedCount : 24, color: '#10B981' },
    { name: 'Under Review', value: reviewCount > 0 ? reviewCount : 12, color: '#F59E0B' },
    { name: 'New/Routed', value: routedCount > 0 ? routedCount : 8, color: '#3B82F6' },
    { name: 'Awaiting Info', value: moreInfoCount > 0 ? moreInfoCount : 4, color: '#F97316' },
  ];

  return (
    <GovernmentLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-navy text-white flex items-center justify-center shrink-0 shadow-sm">
              <BarChart3 className="w-6 h-6 text-tealAccent-light" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-navy">DEPARTMENT ANALYTICS</h1>
              <p className="text-xs font-semibold text-slate-600 mt-0.5">
                {departmentName} • {officerRole} ({districtName})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200">
            {(['30D', '90D', '1Y'] as const).map((rng) => (
              <button
                key={rng}
                type="button"
                onClick={() => setTimeRange(rng)}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                  timeRange === rng ? 'bg-navy text-white shadow-xs' : 'text-slate-600 hover:text-navy'
                }`}
              >
                {rng === '30D' ? '30 Days' : rng === '90D' ? '90 Days' : '1 Year'}
              </button>
            ))}
          </div>
        </div>

        {/* Top KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Total Processed" value="345" color="text-navy bg-slate-50 border-slate-200" />
          <StatCard label="Approval Rate" value="92.4%" color="text-emerald-700 bg-emerald-50 border-emerald-200" />
          <StatCard label="Avg Turnaround" value="4.2 Days" color="text-blue-700 bg-blue-50 border-blue-200" />
          <StatCard label="Current Queue" value={String(myApps.length)} color="text-amber-700 bg-amber-50 border-amber-200" />
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Monthly Velocity Bar Chart */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b pb-3 border-slate-100">
              <h3 className="text-base font-bold text-navy flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primaryBlue" /> Application Velocity
              </h3>
              <span className="text-xs text-slate-500">Received vs Disposed</span>
            </div>

            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyVelocityData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748B' }} />
                  <YAxis tick={{ fontSize: 11, fill: '#64748B' }} />
                  <Tooltip contentStyle={{ backgroundColor: '#1E293B', borderRadius: '12px', color: '#FFF', fontSize: '12px' }} />
                  <Bar dataKey="received" name="Received" fill="#246BCE" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="processed" name="Disposed" fill="#10B981" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Status Breakdown Pie Chart */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4 flex flex-col justify-between">
            <div className="border-b pb-3 border-slate-100">
              <h3 className="text-base font-bold text-navy flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-tealAccent" /> Status Distribution
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">Live status breakdown</p>
            </div>

            <div className="h-56 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={statusPieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={75} innerRadius={45}>
                    {statusPieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#1E293B', borderRadius: '12px', color: '#FFF', fontSize: '12px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-1.5 text-xs">
              {statusPieData.map((item) => (
                <div key={item.name} className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-slate-700 font-semibold">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                    {item.name}
                  </span>
                  <span className="font-bold text-navy">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </GovernmentLayout>
  );
};

function StatCard({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className={`p-4 rounded-2xl border ${color} space-y-1`}>
      <span className="text-[11px] font-bold opacity-70 uppercase tracking-wider block">{label}</span>
      <span className="text-2xl font-bold font-mono block">{value}</span>
    </div>
  );
}

