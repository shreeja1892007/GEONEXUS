import React, { useState } from 'react';
import {
  FileText,
  Download,
  Search,
} from 'lucide-react';
import { GovernmentLayout } from '../../components/layout/GovernmentLayout';
import { useAuth } from '../../context/AuthContext';

interface DocumentRecord {
  id: string;
  title: string;
  applicationId: string;
  type: string;
  uploadedBy: string;
  date: string;
  size: string;
}

export const GovernmentDocumentsPage: React.FC = () => {
  const { currentGovUser } = useAuth();

  const departmentName = currentGovUser?.department || 'Department of Land Resources';
  const officerRole = currentGovUser?.officialRole || 'Government Officer';
  const districtName = currentGovUser?.districtOffice || 'Chennai District';

  const [searchTerm, setSearchTerm] = useState('');

  const documentsList: DocumentRecord[] = [
    { id: 'DOC-101', title: 'Encumbrance Certificate (EC Extract)', applicationId: 'APP-2026-104921', type: 'PDF Scan', uploadedBy: 'Citizen', date: '12 Sep 2026', size: '1.4 MB' },
    { id: 'DOC-102', title: 'Registered Sale Deed (Deed #88412)', applicationId: 'APP-2026-104921', type: 'Certified Deed', uploadedBy: 'Sub-Registrar', date: '11 Sep 2026', size: '3.8 MB' },
    { id: 'DOC-103', title: 'Field Measurement Book (FMB Vector Sketch)', applicationId: 'APP-2026-224190', type: 'Cadastral Plan', uploadedBy: 'Surveyor', date: '10 Sep 2026', size: '2.1 MB' },
    { id: 'DOC-104', title: 'Water Availability Inspection Report', applicationId: 'APP-2026-339102', type: 'Inspection Report', uploadedBy: 'Junior Engineer', date: '09 Sep 2026', size: '890 KB' },
    { id: 'DOC-105', title: 'Town Planning Building Approval Permit', applicationId: 'APP-2026-440182', type: 'Permit Certificate', uploadedBy: 'Town Planner', date: '08 Sep 2026', size: '1.2 MB' },
  ];

  const filtered = documentsList.filter(
    (d) =>
      d.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.applicationId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <GovernmentLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-navy text-white flex items-center justify-center shrink-0 shadow-sm">
              <FileText className="w-6 h-6 text-tealAccent-light" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-navy">DEPARTMENT DOCUMENTS</h1>
              <p className="text-xs font-semibold text-slate-600 mt-0.5">
                {departmentName} • {officerRole} ({districtName})
              </p>
            </div>
          </div>

          <div className="relative w-full md:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search documents or APP ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs text-navy bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-navy"
            />
          </div>
        </div>

        {/* Documents Table */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b pb-3 border-slate-100">
            <span className="text-xs font-bold text-navy uppercase tracking-wider">
              {filtered.length} Archived Official Documents
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-500 border-b border-slate-200">
                  <th className="py-2.5 px-3 font-semibold">Document Title</th>
                  <th className="py-2.5 px-3 font-semibold">Application ID</th>
                  <th className="py-2.5 px-3 font-semibold">Type</th>
                  <th className="py-2.5 px-3 font-semibold">Uploaded By</th>
                  <th className="py-2.5 px-3 font-semibold">Date</th>
                  <th className="py-2.5 px-3 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((doc) => (
                  <tr key={doc.id} className="hover:bg-slate-50">
                    <td className="py-3 px-3 font-bold text-navy">{doc.title}</td>
                    <td className="py-3 px-3 font-mono font-semibold text-primaryBlue">{doc.applicationId}</td>
                    <td className="py-3 px-3 text-slate-600 font-medium">{doc.type}</td>
                    <td className="py-3 px-3 text-slate-500">{doc.uploadedBy}</td>
                    <td className="py-3 px-3 text-slate-500">{doc.date}</td>
                    <td className="py-3 px-3 text-right">
                      <button
                        type="button"
                        onClick={() => alert(`Opening ${doc.title}`)}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-slate-100 hover:bg-slate-200 text-navy font-semibold rounded-lg border border-slate-300 transition-colors"
                      >
                        <Download className="w-3 h-3 text-primaryBlue" />
                        Download
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

