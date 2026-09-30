import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Radio,
  MapPin,
  Layers,
  BookOpen,
  Download,
  FileText,
  Building2,
  Landmark,
  AlertTriangle,
  History,
  CheckCircle2,
  ShieldAlert,
  Lock,
  Home,
  FileCheck,
  ReceiptText,
  Gavel,
  Wifi,
  ScrollText,
} from 'lucide-react';
import { CitizenLayout } from '../../components/layout/CitizenLayout';
import { ParcelStatusBadge } from '../../components/parcel/ParcelStatusBadge';
import {
  getRoRStatusVariant,
  getRegistrationStatusVariant,
  getEncumbranceStatusVariant,
  getTaxStatusVariant,
  getDisputeStatusVariant,
  getBuildingStatusVariant,
} from '../../components/parcel/ParcelStatusBadge';
import { getParcelByUlpin, addApplication } from '../../data/mockParcels';
import type { Parcel, CitizenApplication } from '../../types/parcel';

const LAND_USE_COLORS: Record<string, string> = {
  Residential: '#246BCE',
  Commercial: '#087F8C',
  Industrial: '#7C3AED',
  Institutional: '#173B57',
  Agricultural: '#2E7D32',
  'Open Space': '#10B981',
  'Mixed Use': '#E99A24',
};

type TabId =
  | 'overview'
  | 'ownership'
  | 'transactions'
  | 'planning'
  | 'building'
  | 'tax'
  | 'encumbrance'
  | 'disputes'
  | 'utilities'
  | 'documents'
  | 'history';

const TABS: { id: TabId; label: string; icon: React.ElementType }[] = [
  { id: 'overview', label: 'Overview', icon: Home },
  { id: 'ownership', label: 'Ownership & RoR', icon: BookOpen },
  { id: 'transactions', label: 'Transactions', icon: FileCheck },
  { id: 'planning', label: 'Planning', icon: Layers },
  { id: 'building', label: 'Building', icon: Building2 },
  { id: 'tax', label: 'Tax', icon: ReceiptText },
  { id: 'encumbrance', label: 'Encumbrance', icon: Lock },
  { id: 'disputes', label: 'Disputes', icon: Gavel },
  { id: 'utilities', label: 'Utilities', icon: Wifi },
  { id: 'documents', label: 'Documents', icon: ScrollText },
  { id: 'history', label: 'History', icon: History },
];

type ActionModalType = 'verify' | 'restrictions' | 'certified' | 'discrepancy' | null;

const CITIZEN_ACTIONS = [
  {
    id: 'verify',
    title: 'Verify Land Information',
    description: 'Verify identity, RoR, registration, and encumbrance in official registries.',
    icon: CheckCircle2,
    color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    iconColor: 'text-emerald-600',
    type: 'modal' as const,
  },
  {
    id: 'zone',
    title: 'Check Zoning & Land Use',
    description: 'View permitted land use, FSI limits, and master plan provisions.',
    icon: Layers,
    color: 'bg-blue-50 text-blue-700 border-blue-200',
    iconColor: 'text-blue-600',
    type: 'tab' as const,
    tab: 'planning' as TabId,
  },
  {
    id: 'restrictions',
    title: 'Check Restrictions',
    description: 'Inspect flood zones, environmental/heritage restrictions, and acquisition status.',
    icon: ShieldAlert,
    color: 'bg-amber-50 text-amber-700 border-amber-200',
    iconColor: 'text-amber-600',
    type: 'modal' as const,
  },
  {
    id: 'encumbrance',
    title: 'Check Encumbrance',
    description: 'Review active mortgage, bank charges, and leasehold status.',
    icon: Lock,
    color: 'bg-purple-50 text-purple-700 border-purple-200',
    iconColor: 'text-purple-600',
    type: 'tab' as const,
    tab: 'encumbrance' as TabId,
  },
  {
    id: 'transactions',
    title: 'Transaction History',
    description: 'View historical deeds, mutation logs, and registration chronology.',
    icon: FileCheck,
    color: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    iconColor: 'text-indigo-600',
    type: 'tab' as const,
    tab: 'transactions' as TabId,
  },
  {
    id: 'building',
    title: 'Building Approval',
    description: 'Inspect plan sanction, approval number, and completion certificates.',
    icon: Building2,
    color: 'bg-teal-50 text-teal-700 border-teal-200',
    iconColor: 'text-teal-600',
    type: 'tab' as const,
    tab: 'building' as TabId,
  },
  {
    id: 'certified',
    title: 'Request Certified Record',
    description: 'Apply for digitally signed RoR, Registration, or Tax extract.',
    icon: ScrollText,
    color: 'bg-sky-50 text-sky-700 border-sky-200',
    iconColor: 'text-sky-600',
    type: 'modal' as const,
  },
  {
    id: 'discrepancy',
    title: 'Report Data Discrepancy',
    description: 'Submit an objection or report a boundary/attribute record error.',
    icon: AlertTriangle,
    color: 'bg-rose-50 text-rose-700 border-rose-200',
    iconColor: 'text-rose-600',
    type: 'modal' as const,
  },
];

function VerifyModal({ parcel, onClose }: { parcel: Parcel; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy/50 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <h3 className="text-sm font-bold text-navy">Verified Land Information</h3>
          </div>
          <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-700 p-1">✕</button>
        </div>
        <div className="mt-4 space-y-3">
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-xs text-emerald-800">
            <p className="font-bold">Official Registry Verification</p>
            <p className="text-[11px] mt-0.5 opacity-90">Records verified against State Revenue Department and National Land Registry data sync.</p>
          </div>
          <div className="divide-y divide-slate-100 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2">
            <InfoRow label="Survey Number" value={parcel.surveyNumber} />
            <InfoRow label="ULPIN" value={<span className="font-mono">{parcel.ulpin}</span>} />
            <InfoRow label="Location" value={`${parcel.village}, ${parcel.ward}, ${parcel.district}`} />
            <InfoRow label="Area" value={`${parcel.area.toLocaleString('en-IN')} ${parcel.areaUnit}`} />
            <InfoRow label="RoR Status" value={<ParcelStatusBadge variant={getRoRStatusVariant(parcel.rorStatus)} label={parcel.rorStatus} size="sm" />} />
            <InfoRow label="Registration" value={<ParcelStatusBadge variant={getRegistrationStatusVariant(parcel.registrationStatus)} label={parcel.registrationStatus} size="sm" />} />
            <InfoRow label="Planning Zone" value={parcel.planningZone} />
            <InfoRow label="Encumbrance" value={<ParcelStatusBadge variant={getEncumbranceStatusVariant(parcel.encumbranceStatus)} label={parcel.encumbranceStatus} size="sm" />} />
            <InfoRow label="Last Updated" value={parcel.lastUpdated} />
          </div>
        </div>
        <div className="mt-5 flex justify-end">
          <button type="button" onClick={onClose} className="px-5 py-2 text-xs font-bold bg-navy text-white rounded-xl hover:bg-navy-light">Close</button>
        </div>
      </div>
    </div>
  );
}

function RestrictionsModal({ parcel, onClose }: { parcel: Parcel; onClose: () => void }) {
  const p = parcel.planning;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy/50 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-amber-600" />
            <h3 className="text-sm font-bold text-navy">Spatial & Planning Restrictions</h3>
          </div>
          <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-700 p-1">✕</button>
        </div>
        <div className="mt-4 space-y-3">
          <p className="text-xs text-slate-600">Restrictions check for Survey {parcel.surveyNumber} ({parcel.ulpin}):</p>
          <div className="divide-y divide-slate-100 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2">
            <InfoRow label="Flood Risk" value={<span className="text-emerald-700 font-semibold">Low / Zone C (Non-inundation)</span>} />
            <InfoRow label="Environmental / CRZ" value={<span className="text-emerald-700 font-semibold">None (Outside CRZ Buffer)</span>} />
            <InfoRow label="Heritage Zone" value={<span className="text-emerald-700 font-semibold">Not affected</span>} />
            <InfoRow label="Road Widening" value={<span className="text-emerald-700 font-semibold">Not affected by Master Plan road alignment</span>} />
            <InfoRow label="Acquisition" value={<span className="text-emerald-700 font-semibold">No active acquisition proceedings</span>} />
            <InfoRow label="High Voltage Corridor" value={<span className="text-emerald-700 font-semibold">Outside overhead buffer zone</span>} />
          </div>
          {p.applicableRestrictions.length > 0 && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-700 space-y-1">
              <p className="font-bold">Specific Master Plan Conditions:</p>
              <ul className="list-disc list-inside">
                {p.applicableRestrictions.map((r, i) => (
                  <li key={i}>{r}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
        <div className="mt-5 flex justify-end">
          <button type="button" onClick={onClose} className="px-5 py-2 text-xs font-bold bg-navy text-white rounded-xl hover:bg-navy-light">Close</button>
        </div>
      </div>
    </div>
  );
}

function CertifiedRecordModal({ parcel, onClose, onNavigate }: { parcel: Parcel; onClose: () => void; onNavigate: (path: string) => void }) {
  const [docType, setDocType] = useState('Record of Rights (RoR Form 7/12)');
  const [purpose, setPurpose] = useState('');
  const [submittedId, setSubmittedId] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newId = `CERT-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const newApp: CitizenApplication = {
      id: newId,
      service: `Certified Copy of ${docType}`,
      parcelUlpin: parcel.ulpin,
      surveyNumber: parcel.surveyNumber,
      submittedDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      status: 'Processing',
      remarks: purpose ? `Purpose: ${purpose}. Under digital signature processing.` : 'Under digital signature processing.',
    };
    addApplication(newApp);
    setSubmittedId(newId);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy/50 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <ScrollText className="w-5 h-5 text-sky-600" />
            <h3 className="text-sm font-bold text-navy">Request Certified Record</h3>
          </div>
          <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-700 p-1">✕</button>
        </div>

        {submittedId ? (
          <div className="mt-4 space-y-4 text-center">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-navy">Certified Record Request Submitted</h4>
              <p className="text-xs text-slate-500 mt-1">Application Reference ID:</p>
              <p className="font-mono text-base font-bold text-navy mt-1 bg-slate-50 border border-slate-200 py-1.5 px-3 rounded-xl inline-block">{submittedId}</p>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Certified record request submitted successfully. It has been added to your Applications dashboard.
            </p>
            <div className="flex gap-2 justify-center pt-2">
              <button type="button" onClick={onClose} className="px-4 py-2 border border-slate-200 text-xs font-semibold rounded-xl text-slate-600 hover:bg-slate-50">Done</button>
              <button type="button" onClick={() => { onClose(); onNavigate('/citizen/applications'); }} className="px-4 py-2 bg-navy text-white text-xs font-bold rounded-xl hover:bg-navy-light">View in Applications</button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            <div className="bg-slate-50 p-3 rounded-xl text-xs text-slate-600">
              <p><span className="font-semibold text-navy">Target Parcel:</span> Survey {parcel.surveyNumber} ({parcel.village})</p>
              <p className="font-mono text-[11px] text-slate-500 mt-0.5">ULPIN: {parcel.ulpin}</p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-navy mb-1.5">Select Document Type</label>
              <select
                value={docType}
                onChange={(e) => setDocType(e.target.value)}
                className="w-full text-xs border border-slate-200 rounded-xl p-2.5 bg-white text-navy focus:outline-none focus:ring-2 focus:ring-navy/20"
              >
                <option value="Record of Rights (RoR Form 7/12)">Record of Rights (RoR Form 7/12 / Patta-Chitta)</option>
                <option value="Registration Extract (Sale Deed)">Registration Extract (Registered Deed Copy)</option>
                <option value="Property Tax Record">Property Tax Assessment & Clearance Extract</option>
                <option value="Building Permission Sanction Order">Building Permission Sanction Order</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-navy mb-1.5">Purpose of Request</label>
              <textarea
                rows={3}
                required
                placeholder="e.g. Bank loan collateral verification, property sale due diligence, personal record..."
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                className="w-full text-xs border border-slate-200 rounded-xl p-2.5 bg-white text-navy focus:outline-none focus:ring-2 focus:ring-navy/20"
              />
            </div>

            <div className="flex gap-3 justify-end pt-2">
              <button type="button" onClick={onClose} className="px-4 py-2 text-xs font-semibold text-slate-600 border border-slate-200 rounded-xl hover:bg-slate-50">Cancel</button>
              <button type="submit" className="px-5 py-2 text-xs font-bold bg-navy text-white rounded-xl hover:bg-navy-light">Submit Request</button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

function ReportDiscrepancyModal({ parcel, onClose, onNavigate }: { parcel: Parcel; onClose: () => void; onNavigate: (path: string) => void }) {
  const [issueType, setIssueType] = useState('Parcel Boundary');
  const [description, setDescription] = useState('');
  const [submittedId, setSubmittedId] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newId = `DIS-2026-${Math.floor(10000 + Math.random() * 90000)}`;
    const newApp: CitizenApplication = {
      id: newId,
      service: `Data Discrepancy: ${issueType}`,
      parcelUlpin: parcel.ulpin,
      surveyNumber: parcel.surveyNumber,
      submittedDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      status: 'Submitted',
      remarks: description ? `Issue: ${issueType}. ${description}` : `Issue: ${issueType}. Submitted for departmental review.`,
    };
    addApplication(newApp);
    setSubmittedId(newId);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy/50 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-rose-600" />
            <h3 className="text-sm font-bold text-navy">Report Data Discrepancy</h3>
          </div>
          <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-700 p-1">✕</button>
        </div>

        {submittedId ? (
          <div className="mt-4 space-y-4 text-center">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-navy">Discrepancy Report Logged</h4>
              <p className="text-xs text-slate-500 mt-1">Discrepancy Reference ID:</p>
              <p className="font-mono text-base font-bold text-navy mt-1 bg-slate-50 border border-slate-200 py-1.5 px-3 rounded-xl inline-block">{submittedId}</p>
              <p className="text-xs font-semibold text-emerald-700 mt-1">Status: Submitted</p>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Your discrepancy grievance has been forwarded to the Revenue Inspector & Tahsildar. Added to your Applications list.
            </p>
            <div className="flex gap-2 justify-center pt-2">
              <button type="button" onClick={onClose} className="px-4 py-2 border border-slate-200 text-xs font-semibold rounded-xl text-slate-600 hover:bg-slate-50">Done</button>
              <button type="button" onClick={() => { onClose(); onNavigate('/citizen/applications'); }} className="px-4 py-2 bg-navy text-white text-xs font-bold rounded-xl hover:bg-navy-light">View in Applications</button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            <div className="bg-slate-50 p-3 rounded-xl text-xs text-slate-600">
              <p><span className="font-semibold text-navy">Target Parcel:</span> Survey {parcel.surveyNumber} ({parcel.village})</p>
              <p className="font-mono text-[11px] text-slate-500 mt-0.5">ULPIN: {parcel.ulpin}</p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-navy mb-1.5">Issue Type</label>
              <select
                value={issueType}
                onChange={(e) => setIssueType(e.target.value)}
                className="w-full text-xs border border-slate-200 rounded-xl p-2.5 bg-white text-navy focus:outline-none focus:ring-2 focus:ring-navy/20"
              >
                <option value="Parcel Boundary">Parcel Boundary / Geometry Mismatch</option>
                <option value="Survey Number">Survey Number / Sub-division Error</option>
                <option value="Land Use">Land Use / Classification Discrepancy</option>
                <option value="Ownership Record">Ownership Record / Joint Owners Omission</option>
                <option value="Registration Record">Registration Record / Deed Missing</option>
                <option value="Tax Record">Property Tax Dues / Assessment Error</option>
                <option value="Building Record">Building Sanction / OC Discrepancy</option>
                <option value="Other Data Issue">Other Integrated Data Error</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-navy mb-1.5">Description of Discrepancy</label>
              <textarea
                rows={3}
                required
                placeholder="Provide detailed description of the error observed and correct expected values..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full text-xs border border-slate-200 rounded-xl p-2.5 bg-white text-navy focus:outline-none focus:ring-2 focus:ring-navy/20"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-navy mb-1.5">Supporting Document (Optional)</label>
              <input
                type="file"
                className="w-full text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-navy/10 file:text-navy hover:file:bg-navy/20"
              />
            </div>

            <div className="flex gap-3 justify-end pt-2">
              <button type="button" onClick={onClose} className="px-4 py-2 text-xs font-semibold text-slate-600 border border-slate-200 rounded-xl hover:bg-slate-50">Cancel</button>
              <button type="submit" className="px-5 py-2 text-xs font-bold bg-navy text-white rounded-xl hover:bg-navy-light">Submit Report</button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}


function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start py-2.5 border-b border-slate-50 last:border-0">
      <dt className="w-44 shrink-0 text-[11px] font-semibold text-slate-400 uppercase tracking-wide leading-relaxed">
        {label}
      </dt>
      <dd className="text-xs text-navy font-medium leading-relaxed">{value}</dd>
    </div>
  );
}

function TabOverview({ parcel }: { parcel: Parcel }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Area', value: `${parcel.area.toLocaleString('en-IN')} ${parcel.areaUnit}` },
          { label: 'Land Use', value: parcel.landUse },
          { label: 'Ownership', value: parcel.ownershipType },
          { label: 'Planning Zone', value: parcel.planningZone },
        ].map((kv) => (
          <div key={kv.label} className="p-4 bg-slate-50 border border-slate-100 rounded-2xl">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              {kv.label}
            </p>
            <p className="text-sm font-bold text-navy leading-snug">{kv.value}</p>
          </div>
        ))}
      </div>

      <div>
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">
          Status at a Glance
        </h3>
        <dl className="bg-white border border-slate-100 rounded-2xl divide-y divide-slate-50">
          <InfoRow
            label="Record of Rights"
            value={
              <ParcelStatusBadge
                variant={getRoRStatusVariant(parcel.rorStatus)}
                label={parcel.rorStatus}
              />
            }
          />
          <InfoRow
            label="Registration"
            value={
              <ParcelStatusBadge
                variant={getRegistrationStatusVariant(parcel.registrationStatus)}
                label={parcel.registrationStatus}
              />
            }
          />
          <InfoRow
            label="Encumbrance"
            value={
              <ParcelStatusBadge
                variant={getEncumbranceStatusVariant(parcel.encumbranceStatus)}
                label={parcel.encumbranceStatus}
              />
            }
          />
          <InfoRow
            label="Property Tax"
            value={
              <ParcelStatusBadge
                variant={getTaxStatusVariant(parcel.taxStatus)}
                label={parcel.taxStatus}
              />
            }
          />
          <InfoRow
            label="Building Permit"
            value={
              <ParcelStatusBadge
                variant={getBuildingStatusVariant(parcel.buildingPermissionStatus)}
                label={parcel.buildingPermissionStatus}
              />
            }
          />
          <InfoRow
            label="Court Dispute"
            value={
              <ParcelStatusBadge
                variant={getDisputeStatusVariant(parcel.courtDisputeStatus)}
                label={parcel.courtDisputeStatus}
              />
            }
          />
          <InfoRow label="Ownership Summary" value={parcel.ownersSummary} />
          <InfoRow label="Last Updated" value={parcel.lastUpdated} />
        </dl>
      </div>
    </div>
  );
}

function TabOwnership({ parcel }: { parcel: Parcel }) {
  const r = parcel.ror;
  return (
    <div className="space-y-4">
      <div className="bg-white border border-slate-100 rounded-2xl">
        <div className="px-5 py-3 border-b border-slate-100">
          <h3 className="text-xs font-bold text-navy">Record of Rights (RoR)</h3>
        </div>
        <dl className="px-5 divide-y divide-slate-50">
          <InfoRow label="RoR Number" value={<span className="font-mono">{r.rorNumber}</span>} />
          <InfoRow
            label="RoR Status"
            value={<ParcelStatusBadge variant={getRoRStatusVariant(r.status)} label={r.status} />}
          />
          <InfoRow label="Ownership Type" value={r.ownershipType} />
          <InfoRow label="Recorded Owners" value={`${r.recordedOwnersCount} Owner(s)`} />
          <InfoRow
            label="Mutation Status"
            value={
              <ParcelStatusBadge
                variant={
                  r.mutationStatus === 'Completed'
                    ? 'success'
                    : r.mutationStatus === 'In Process'
                    ? 'pending'
                    : 'error'
                }
                label={r.mutationStatus}
              />
            }
          />
          <InfoRow label="Land Classification" value={r.landClassification} />
          <InfoRow label="Soil Classification" value={r.soilClassification} />
          <InfoRow label="Revenue Assessed" value={r.revenueAssessed} />
          <InfoRow label="Last Updated" value={r.lastUpdated} />
        </dl>
      </div>

      {!parcel.isUserProperty && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
          <p className="text-xs text-amber-700">
            Detailed owner names and contact information are only shown for parcels linked to your
            citizen account.
          </p>
        </div>
      )}

      <p className="text-[11px] text-slate-400 text-center">
        {parcel.ownersSummary}
      </p>
    </div>
  );
}

function TabTransactions({ parcel }: { parcel: Parcel }) {
  return (
    <div className="space-y-3">
      {parcel.registrations.length === 0 && (
        <p className="text-xs text-slate-500 text-center py-8">No registered transactions on record.</p>
      )}
      {parcel.registrations.map((reg) => (
        <div key={reg.id} className="bg-white border border-slate-100 rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3 border-b border-slate-50">
            <span className="text-xs font-bold text-navy">{reg.type}</span>
            <ParcelStatusBadge
              variant={reg.status === 'Registered' ? 'success' : 'pending'}
              label={reg.status}
            />
          </div>
          <dl className="px-5 divide-y divide-slate-50">
            <InfoRow
              label="Reg. Number"
              value={<span className="font-mono">{reg.registrationNumber}</span>}
            />
            <InfoRow label="Date" value={reg.date} />
            <InfoRow label="Sub-Registrar" value={reg.subRegistrarOffice} />
            {reg.considerationAmount && (
              <InfoRow label="Consideration" value={reg.considerationAmount} />
            )}
            <InfoRow label="Stamp Duty Paid" value={reg.stampDutyPaid} />
          </dl>
        </div>
      ))}
    </div>
  );
}

function TabPlanning({ parcel }: { parcel: Parcel }) {
  const p = parcel.planning;
  return (
    <div className="space-y-4">
      <div className="bg-white border border-slate-100 rounded-2xl">
        <div className="px-5 py-3 border-b border-slate-100">
          <h3 className="text-xs font-bold text-navy">Planning & Zoning Details</h3>
        </div>
        <dl className="px-5 divide-y divide-slate-50">
          <InfoRow label="Planning Zone" value={p.planningZone} />
          <InfoRow label="Master Plan" value={p.masterPlan} />
          <InfoRow label="Permitted Land Use" value={p.permittedLandUse} />
          <InfoRow label="Current Land Use" value={p.currentLandUse} />
          <InfoRow label="FSI (Floor Space Index)" value={p.fsi.toString()} />
          <InfoRow label="Height Limit" value={p.heightLimit} />
        </dl>
      </div>
      {p.applicableRestrictions.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
          <p className="text-xs font-bold text-amber-700 mb-2">Applicable Restrictions</p>
          <ul className="list-disc list-inside space-y-1">
            {p.applicableRestrictions.map((r, i) => (
              <li key={i} className="text-xs text-amber-700">
                {r}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function TabBuilding({ parcel }: { parcel: Parcel }) {
  const b = parcel.building;
  return (
    <div className="bg-white border border-slate-100 rounded-2xl">
      <div className="px-5 py-3 border-b border-slate-100">
        <h3 className="text-xs font-bold text-navy">Building Permit Details</h3>
      </div>
      <dl className="px-5 divide-y divide-slate-50">
        <InfoRow
          label="Permit Status"
          value={
            <ParcelStatusBadge
              variant={getBuildingStatusVariant(b.permissionStatus)}
              label={b.permissionStatus}
            />
          }
        />
        {b.approvalNumber && <InfoRow label="Approval Number" value={<span className="font-mono">{b.approvalNumber}</span>} />}
        {b.buildingType && <InfoRow label="Building Type" value={b.buildingType} />}
        {b.approvedFloors && <InfoRow label="Approved Floors" value={b.approvedFloors} />}
        {b.builtUpArea && <InfoRow label="Built-up Area" value={b.builtUpArea} />}
        {b.approvalDate && <InfoRow label="Approval Date" value={b.approvalDate} />}
        {b.completionCertificateStatus && (
          <InfoRow
            label="Completion Certificate"
            value={
              <ParcelStatusBadge
                variant={
                  b.completionCertificateStatus === 'Issued'
                    ? 'success'
                    : b.completionCertificateStatus === 'Pending Inspection'
                    ? 'pending'
                    : 'neutral'
                }
                label={b.completionCertificateStatus}
              />
            }
          />
        )}
        {b.occupancyCertificateStatus && (
          <InfoRow
            label="Occupancy Certificate"
            value={
              <ParcelStatusBadge
                variant={
                  b.occupancyCertificateStatus === 'Issued'
                    ? 'success'
                    : b.occupancyCertificateStatus === 'Pending'
                    ? 'pending'
                    : 'neutral'
                }
                label={b.occupancyCertificateStatus}
              />
            }
          />
        )}
      </dl>
    </div>
  );
}

function TabTax({ parcel }: { parcel: Parcel }) {
  const t = parcel.tax;
  return (
    <div className="bg-white border border-slate-100 rounded-2xl">
      <div className="px-5 py-3 border-b border-slate-100">
        <h3 className="text-xs font-bold text-navy">Property Tax Record</h3>
      </div>
      <dl className="px-5 divide-y divide-slate-50">
        <InfoRow label="Assessment Number" value={<span className="font-mono">{t.assessmentNumber}</span>} />
        <InfoRow label="Ward Number" value={t.wardNumber} />
        <InfoRow label="Property Category" value={t.propertyCategory} />
        <InfoRow label="Financial Year" value={t.financialYear} />
        <InfoRow
          label="Tax Status"
          value={
            <ParcelStatusBadge
              variant={getTaxStatusVariant(t.taxStatus)}
              label={t.taxStatus}
            />
          }
        />
        {t.lastPaymentDate && <InfoRow label="Last Payment Date" value={t.lastPaymentDate} />}
        {t.receiptNumber && (
          <InfoRow label="Receipt Number" value={<span className="font-mono">{t.receiptNumber}</span>} />
        )}
        <InfoRow label="Annual Assessment" value={t.annualAssessment} />
        <InfoRow
          label="Outstanding Amount"
          value={
            t.outstandingAmount === '₹ 0' ? (
              <span className="text-emerald-600 font-bold">₹ 0 (Nil)</span>
            ) : (
              <span className="text-red-600 font-bold">{t.outstandingAmount}</span>
            )
          }
        />
      </dl>
    </div>
  );
}

function TabEncumbrance({ parcel }: { parcel: Parcel }) {
  const e = parcel.encumbrance;
  return (
    <div className="space-y-4">
      <div className="bg-white border border-slate-100 rounded-2xl">
        <div className="px-5 py-3 border-b border-slate-100">
          <h3 className="text-xs font-bold text-navy">Encumbrance Details</h3>
        </div>
        <dl className="px-5 divide-y divide-slate-50">
          <InfoRow
            label="Encumbrance Status"
            value={
              <ParcelStatusBadge
                variant={getEncumbranceStatusVariant(e.encumbranceStatus)}
                label={e.encumbranceStatus}
              />
            }
          />
          {e.type && <InfoRow label="Type" value={e.type} />}
          {e.institution && <InfoRow label="Lending Institution" value={e.institution} />}
          {e.status && (
            <InfoRow
              label="Status"
              value={
                <ParcelStatusBadge
                  variant={e.status === 'Active' ? 'warning' : e.status === 'Discharged' ? 'success' : 'neutral'}
                  label={e.status}
                />
              }
            />
          )}
          {e.startDate && <InfoRow label="Start Date" value={e.startDate} />}
          {e.loanReference && (
            <InfoRow label="Loan Reference" value={<span className="font-mono">{e.loanReference}</span>} />
          )}
        </dl>
      </div>
    </div>
  );
}

function TabDisputes({ parcel }: { parcel: Parcel }) {
  const d = parcel.disputes;
  return (
    <div className="space-y-4">
      <div className="bg-white border border-slate-100 rounded-2xl">
        <div className="px-5 py-3 border-b border-slate-100">
          <h3 className="text-xs font-bold text-navy">Court & Legal Disputes</h3>
        </div>
        <dl className="px-5 divide-y divide-slate-50">
          <InfoRow
            label="Dispute Status"
            value={
              <ParcelStatusBadge
                variant={getDisputeStatusVariant(d.courtDisputeStatus)}
                label={d.courtDisputeStatus}
              />
            }
          />
          {d.courtOrAuthority && <InfoRow label="Court / Authority" value={d.courtOrAuthority} />}
          {d.caseType && <InfoRow label="Case Type" value={d.caseType} />}
          {d.caseNumber && <InfoRow label="Case Number" value={<span className="font-mono">{d.caseNumber}</span>} />}
          {d.filingDate && <InfoRow label="Filing Date" value={d.filingDate} />}
          <InfoRow
            label="Stay Order"
            value={
              <ParcelStatusBadge
                variant={d.stayOrder === 'No' || d.stayOrder === 'None' ? 'success' : 'error'}
                label={d.stayOrder}
              />
            }
          />
          {d.prayer && <InfoRow label="Prayer" value={d.prayer} />}
          {d.nextHearingDate && <InfoRow label="Next Hearing" value={d.nextHearingDate} />}
        </dl>
      </div>
    </div>
  );
}

function TabUtilities({ parcel }: { parcel: Parcel }) {
  const u = parcel.utilities;
  const getUtilVariant = (val: string) =>
    val.toLowerCase().includes('available') || val.toLowerCase().includes('connected')
      ? 'success'
      : val.toLowerCase().includes('planned')
      ? 'pending'
      : 'neutral';

  return (
    <div className="bg-white border border-slate-100 rounded-2xl">
      <div className="px-5 py-3 border-b border-slate-100">
        <h3 className="text-xs font-bold text-navy">Utilities & Infrastructure</h3>
      </div>
      <dl className="px-5 divide-y divide-slate-50">
        <InfoRow label="Road Access" value={u.roadAccess} />
        <InfoRow
          label="Water Network"
          value={
            <ParcelStatusBadge variant={getUtilVariant(u.waterNetwork)} label={u.waterNetwork} />
          }
        />
        <InfoRow
          label="Sewer Network"
          value={
            <ParcelStatusBadge
              variant={getUtilVariant(u.sewerNetwork)}
              label={u.sewerNetwork}
            />
          }
        />
        <InfoRow
          label="Electricity"
          value={
            <ParcelStatusBadge variant={getUtilVariant(u.electricity)} label={u.electricity} />
          }
        />
        <InfoRow
          label="Stormwater Drain"
          value={
            <ParcelStatusBadge
              variant={getUtilVariant(u.stormwaterDrain)}
              label={u.stormwaterDrain}
            />
          }
        />
        <InfoRow
          label="Telecom / Fibre"
          value={
            <ParcelStatusBadge
              variant={getUtilVariant(u.telecomFiber)}
              label={u.telecomFiber}
            />
          }
        />
      </dl>
    </div>
  );
}

function TabDocuments({ parcel }: { parcel: Parcel }) {
  return (
    <div className="space-y-3">
      {parcel.documents.length === 0 && (
        <p className="text-xs text-slate-500 text-center py-8">No documents on record.</p>
      )}
      {parcel.documents.map((doc) => (
        <div
          key={doc.id}
          className="flex items-start justify-between bg-white border border-slate-100 rounded-2xl px-5 py-4 gap-4"
        >
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-navy/10 flex items-center justify-center shrink-0">
              <FileText className="w-4 h-4 text-navy" />
            </div>
            <div>
              <p className="text-xs font-bold text-navy leading-snug">{doc.title}</p>
              <p className="text-[11px] text-slate-500 mt-0.5">
                {doc.category} · {doc.date}
              </p>
              <span className="mt-1 inline-block font-mono text-[10px] text-slate-400 bg-slate-50 border border-slate-100 px-1.5 py-0.5 rounded">
                {doc.code}
              </span>
            </div>
          </div>
          {doc.isCertifiedAvailable ? (
            <button
              type="button"
              className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-bold text-navy border border-navy/30 rounded-xl hover:bg-navy hover:text-white transition-colors"
            >
              <Download className="w-3 h-3" />
              Download
            </button>
          ) : (
            <span className="shrink-0 text-[10px] text-slate-400 bg-slate-50 border border-slate-100 px-2 py-1 rounded-full">On Request</span>
          )}
        </div>
      ))}
    </div>
  );
}

function TabHistory({ parcel }: { parcel: Parcel }) {
  return (
    <div className="space-y-2 relative">
      <div className="absolute left-[23px] top-0 bottom-0 w-0.5 bg-slate-100" />
      {parcel.history.map((ev, i) => (
        <div key={i} className="relative flex items-start gap-4 pl-12">
          <div className="absolute left-4 top-3 w-5 h-5 rounded-full bg-white border-2 border-navy flex items-center justify-center z-10">
            <div className="w-2 h-2 rounded-full bg-navy" />
          </div>
          <div className="flex-1 bg-white border border-slate-100 rounded-2xl px-4 py-3">
            <div className="flex items-center justify-between mb-1">
              <p className="text-xs font-bold text-navy">{ev.title}</p>
              <span className="text-[10px] font-mono text-slate-400 bg-slate-50 px-2 py-0.5 rounded-full border border-slate-100">
                {ev.year}
              </span>
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed">{ev.description}</p>
            <p className="text-[10px] text-slate-400 mt-1">{ev.authority}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export const ParcelProfilePage: React.FC = () => {
  const { ulpin } = useParams<{ ulpin: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabId>('overview');
  const [activeModal, setActiveModal] = useState<ActionModalType>(null);
  const tabsRef = React.useRef<HTMLDivElement>(null);
  const parcel = ulpin ? getParcelByUlpin(ulpin) : undefined;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [ulpin]);

  const handleActionClick = (action: (typeof CITIZEN_ACTIONS)[number]) => {
    if (action.type === 'tab' && action.tab) {
      setActiveTab(action.tab);
      tabsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else if (action.type === 'modal') {
      setActiveModal(action.id as ActionModalType);
    }
  };

  if (!parcel) {
    return (
      <CitizenLayout>
        <div className="flex flex-col items-center justify-center py-24 text-center gap-4">
          <Landmark className="w-16 h-16 text-slate-300" />
          <p className="text-base font-bold text-slate-500">Parcel not found</p>
          <p className="text-xs text-slate-400">ULPIN: {ulpin || 'unknown'}</p>
          <button
            type="button"
            onClick={() => navigate('/citizen/map')}
            className="mt-2 px-5 py-2.5 bg-navy text-white text-xs font-bold rounded-xl"
          >
            Back to Map
          </button>
        </div>
      </CitizenLayout>
    );
  }

  const luColor = LAND_USE_COLORS[parcel.landUse] || '#246BCE';

  const TAB_CONTENT: Record<TabId, React.ReactNode> = {
    overview: <TabOverview parcel={parcel} />,
    ownership: <TabOwnership parcel={parcel} />,
    transactions: <TabTransactions parcel={parcel} />,
    planning: <TabPlanning parcel={parcel} />,
    building: <TabBuilding parcel={parcel} />,
    tax: <TabTax parcel={parcel} />,
    encumbrance: <TabEncumbrance parcel={parcel} />,
    disputes: <TabDisputes parcel={parcel} />,
    utilities: <TabUtilities parcel={parcel} />,
    documents: <TabDocuments parcel={parcel} />,
    history: <TabHistory parcel={parcel} />,
  };

  return (
    <CitizenLayout>
      {/* Back + Actions Bar */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <button
          type="button"
          onClick={() => navigate('/citizen/map')}
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-navy transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Map
        </button>
        <button
          type="button"
          onClick={() => navigate(`/citizen/parcel/${parcel.ulpin}/360`)}
          className="flex items-center gap-2 px-4 py-2 border border-tealAccent text-tealAccent text-xs font-bold rounded-xl hover:bg-tealAccent/10 transition-colors"
        >
          <Radio className="w-3.5 h-3.5" />
          Parcel 360°
        </button>
      </div>

      {/* Parcel Header Card */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-card overflow-hidden mb-6">
        <div className="h-1.5" style={{ backgroundColor: luColor }} />
        <div className="px-6 py-5">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <span
                  className="px-2.5 py-0.5 rounded-full text-[11px] font-bold text-white"
                  style={{ backgroundColor: luColor }}
                >
                  {parcel.landUse}
                </span>
                {parcel.isUserProperty && (
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-700 border border-emerald-200">
                    Your Property
                  </span>
                )}
              </div>
              <h1 className="text-2xl font-bold text-navy">
                Survey {parcel.surveyNumber}
              </h1>
              <p className="text-sm text-slate-500 mt-1 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5" />
                {parcel.village}, {parcel.ward}, {parcel.district}, {parcel.state}
              </p>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                ULPIN
              </p>
              <p className="font-mono text-sm font-bold text-navy tracking-widest bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl">
                {parcel.ulpin}
              </p>
              <p className="text-[11px] text-slate-400 mt-1">
                {parcel.area.toLocaleString('en-IN')} {parcel.areaUnit} · Zone {parcel.planningZone}
              </p>
            </div>
          </div>

          {/* Quick Status Row */}
          <div className="mt-4 flex flex-wrap gap-2">
            <ParcelStatusBadge variant={getRoRStatusVariant(parcel.rorStatus)} label={`RoR: ${parcel.rorStatus}`} size="sm" />
            <ParcelStatusBadge variant={getEncumbranceStatusVariant(parcel.encumbranceStatus)} label={`EC: ${parcel.encumbranceStatus}`} size="sm" />
            <ParcelStatusBadge variant={getTaxStatusVariant(parcel.taxStatus)} label={`Tax: ${parcel.taxStatus}`} size="sm" />
            <ParcelStatusBadge variant={getDisputeStatusVariant(parcel.courtDisputeStatus)} label={`Dispute: ${parcel.courtDisputeStatus}`} size="sm" />
          </div>
        </div>
      </div>

      {/* Horizontal Scrollable Tabs */}
      <div ref={tabsRef} className="bg-white border border-slate-200 rounded-2xl shadow-card overflow-hidden mb-6">
        <div className="overflow-x-auto scrollbar-hide">
          <div className="flex min-w-max border-b border-slate-100">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-1.5 px-4 py-3.5 text-xs font-semibold whitespace-nowrap border-b-2 transition-all ${
                    isActive
                      ? 'border-navy text-navy bg-slate-50'
                      : 'border-transparent text-slate-500 hover:text-navy hover:bg-slate-50'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-5">{TAB_CONTENT[activeTab]}</div>
      </div>

      {/* Citizen Parcel Services / Actions */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-card p-6">
        <h2 className="text-sm font-bold text-navy mb-1">What would you like to do?</h2>
        <p className="text-xs text-slate-500 mb-5">Select a service or action to perform for Survey {parcel.surveyNumber}:</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {CITIZEN_ACTIONS.map((action) => {
            const Icon = action.icon;
            return (
              <button
                key={action.id}
                type="button"
                onClick={() => handleActionClick(action)}
                className={`flex flex-col items-start gap-2 p-4 border rounded-2xl text-left hover:shadow-card-hover transition-all group ${action.color}`}
              >
                <Icon className={`w-5 h-5 ${action.iconColor} group-hover:scale-110 transition-transform`} />
                <div>
                  <p className="text-xs font-bold leading-snug">{action.title}</p>
                  <p className="text-[10px] leading-relaxed mt-0.5 opacity-80">
                    {action.description}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Action Modals */}
      {activeModal === 'verify' && (
        <VerifyModal parcel={parcel} onClose={() => setActiveModal(null)} />
      )}
      {activeModal === 'restrictions' && (
        <RestrictionsModal parcel={parcel} onClose={() => setActiveModal(null)} />
      )}
      {activeModal === 'certified' && (
        <CertifiedRecordModal parcel={parcel} onClose={() => setActiveModal(null)} onNavigate={navigate} />
      )}
      {activeModal === 'discrepancy' && (
        <ReportDiscrepancyModal parcel={parcel} onClose={() => setActiveModal(null)} onNavigate={navigate} />
      )}
    </CitizenLayout>
  );
};
