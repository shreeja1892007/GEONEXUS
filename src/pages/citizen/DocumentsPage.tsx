import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Download, Folder, ArrowRight } from 'lucide-react';
import { CitizenLayout } from '../../components/layout/CitizenLayout';
import { MOCK_PARCELS } from '../../data/mockParcels';

export const DocumentsPage: React.FC = () => {
  const navigate = useNavigate();
  const myParcels = MOCK_PARCELS.filter((p) => p.isUserProperty);
  const allDocs = myParcels.flatMap((p) =>
    p.documents.map((d) => ({ ...d, surveyNumber: p.surveyNumber, ulpin: p.ulpin }))
  );

  return (
    <CitizenLayout>
      <div className="mb-6">
        <h1 className="text-xl font-bold text-navy">My Documents</h1>
        <p className="text-xs text-slate-500 mt-1">Official documents and certified extracts for your linked parcels.</p>
      </div>

      {allDocs.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
          <Folder className="w-14 h-14 text-slate-300" />
          <p className="text-sm font-semibold text-slate-500">No documents available yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {allDocs.map((doc) => (
            <div key={doc.id} className="flex items-start justify-between bg-white border border-slate-200 rounded-2xl px-5 py-4 shadow-card hover:shadow-card-hover transition-all gap-4">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-navy/10 flex items-center justify-center shrink-0">
                  <FileText className="w-4 h-4 text-navy" />
                </div>
                <div>
                  <p className="text-sm font-bold text-navy">{doc.title}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{doc.category} · Survey {doc.surveyNumber} · {doc.date}</p>
                  <span className="mt-1 inline-block font-mono text-[10px] text-slate-400 bg-slate-50 border border-slate-100 px-1.5 py-0.5 rounded">{doc.code}</span>
                </div>
              </div>
              <div className="flex flex-col gap-2 shrink-0">
                {doc.isCertifiedAvailable ? (
                  <button type="button" className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-navy border border-navy/30 rounded-xl hover:bg-navy hover:text-white transition-colors">
                    <Download className="w-3 h-3" /> Download
                  </button>
                ) : (
                  <button type="button" onClick={() => navigate(`/citizen/parcel/${doc.ulpin}`)} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">
                    Request <ArrowRight className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </CitizenLayout>
  );
};
