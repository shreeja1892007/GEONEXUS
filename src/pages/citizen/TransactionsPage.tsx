import React from 'react';
import { History, Inbox } from 'lucide-react';
import { CitizenLayout } from '../../components/layout/CitizenLayout';
import { MOCK_TRANSACTIONS } from '../../data/mockParcels';
import { ParcelStatusBadge } from '../../components/parcel/ParcelStatusBadge';

export const TransactionsPage: React.FC = () => {
  return (
    <CitizenLayout>
      <div className="mb-6">
        <h1 className="text-xl font-bold text-navy">My Transactions</h1>
        <p className="text-xs text-slate-500 mt-1">Registered deeds and transactions associated with your parcels.</p>
      </div>

      {MOCK_TRANSACTIONS.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
          <Inbox className="w-14 h-14 text-slate-300" />
          <p className="text-sm font-semibold text-slate-500">No transactions on record.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {MOCK_TRANSACTIONS.map((txn) => (
            <div key={txn.id} className="bg-white border border-slate-200 rounded-2xl shadow-card px-5 py-4 hover:shadow-card-hover transition-all">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center shrink-0">
                    <History className="w-4 h-4 text-teal-700" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-navy">{txn.type}</p>
                    <p className="text-xs text-slate-500 mt-0.5">Survey {txn.surveyNumber} · {txn.date}</p>
                    <p className="font-mono text-[11px] text-slate-400 mt-0.5">{txn.registrationNumber}</p>
                    <p className="text-[11px] text-slate-400">{txn.subRegistrarOffice}</p>
                  </div>
                </div>
                <ParcelStatusBadge
                  variant={txn.status === 'Registered' || txn.status === 'Completed' ? 'success' : 'pending'}
                  label={txn.status}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </CitizenLayout>
  );
};
