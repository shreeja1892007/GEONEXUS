import React, { useState } from 'react';
import {
  BarChart3,
  Download,
} from 'lucide-react';
import { GovernmentLayout } from '../../components/layout/GovernmentLayout';
import { useAuth } from '../../context/AuthContext';
import { WATER_REPORTS, type WaterReportItem } from '../../data/waterResourcesData';

export const GovernmentReportsPage: React.FC = () => {
  const { currentGovUser } = useAuth();

  const departmentName = currentGovUser?.department || 'Department of Land Resources';
  const officerRole = currentGovUser?.officialRole || 'Government Officer';
  const districtName = currentGovUser?.districtOffice || 'Chennai District';

  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const isWater = departmentName === 'Water Resources Department';

  const reportsList: WaterReportItem[] = isWater
    ? WATER_REPORTS
    : [
        { id: 'REP-101', report: 'Monthly Application Processing Summary', period: 'Monthly', lastGenerated: '01 Sep 2026', actionLabel: 'Download PDF' },
        { id: 'REP-102', report: 'Citizen Grievance Audit & SLA Performance', period: 'Monthly', lastGenerated: '01 Sep 2026', actionLabel: 'Download CSV' },
        { id: 'REP-103', report: 'Land Records Verification Audit Register', period: 'Quarterly', lastGenerated: '15 Aug 2026', actionLabel: 'Download PDF' },
        { id: 'REP-104', report: 'Inter-Departmental Clearance Log', period: 'Weekly', lastGenerated: '12 Sep 2026', actionLabel: 'Download CSV' },
      ];

  const handleDownload = (id: string, name: string) => {
    setDownloadingId(id);
    setTimeout(() => {
      setDownloadingId(null);
      alert(`Downloaded report: ${name}`);
    }, 800);
  };

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
              <h1 className="text-xl font-bold text-navy">REPORTS & DATA</h1>
              <p className="text-xs font-semibold text-slate-600 mt-0.5">
                {departmentName} • {officerRole} ({districtName})
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => alert(`Generating Custom Report for ${departmentName}...`)}
            className="px-4 py-2 bg-navy text-white text-xs font-semibold rounded-xl hover:bg-navy/90 transition-colors"
          >
            Generate Custom Report
          </button>
        </div>

        {/* Reports Table */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b pb-3 border-slate-100">
            <span className="text-xs font-bold text-navy uppercase tracking-wider">
              {reportsList.length} Available Official Reports
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-500 border-b border-slate-200">
                  <th className="py-2.5 px-3 font-semibold">Report Name</th>
                  <th className="py-2.5 px-3 font-semibold">Frequency</th>
                  <th className="py-2.5 px-3 font-semibold">Last Generated</th>
                  <th className="py-2.5 px-3 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {reportsList.map((rep) => (
                  <tr key={rep.id} className="hover:bg-slate-50">
                    <td className="py-3.5 px-3 font-bold text-navy">{rep.report}</td>
                    <td className="py-3.5 px-3 text-slate-500">{rep.period}</td>
                    <td className="py-3.5 px-3 text-slate-500">{rep.lastGenerated}</td>
                    <td className="py-3.5 px-3 text-right">
                      <button
                        type="button"
                        onClick={() => handleDownload(rep.id, rep.report)}
                        disabled={downloadingId === rep.id}
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-navy font-semibold rounded-xl border border-slate-300 transition-colors text-xs"
                      >
                        <Download className="w-3.5 h-3.5 text-primaryBlue" />
                        {downloadingId === rep.id ? 'Generating...' : rep.actionLabel}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </GovernmentLayout>
  );
};

