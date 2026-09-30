import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  AlertTriangle,
  ArrowLeft,
  BookOpen,
  Building2,
  FileCheck2,
  Gavel,
  Landmark,
  Layers3,
  Loader2,
  MapPin,
  Orbit,
  ReceiptText,
  ShieldAlert,
  UtilityPole,
  WalletCards,
} from 'lucide-react';
import { GovernmentLayout } from '../../components/layout/GovernmentLayout';
import {
  getErodeParcel360Details,
  type ErodeParcel360Details,
  type Parcel360Record,
} from '../../services/erodeGisService';

type SectionId =
  | 'record_of_rights'
  | 'registrations'
  | 'land_use'
  | 'master_plan'
  | 'building_permissions'
  | 'property_tax'
  | 'utility_infrastructure'
  | 'restrictions'
  | 'data_conflicts'
  | 'mortgages'
  | 'encumbrances';

interface SectionConfig {
  id: SectionId;
  label: string;
  shortLabel: string;
  icon: React.ElementType;
  className: string;
}

const SECTIONS: SectionConfig[] = [
  { id: 'record_of_rights', label: 'Record of Rights', shortLabel: 'RoR', icon: BookOpen, className: 'border-emerald-300 bg-emerald-50 text-emerald-700' },
  { id: 'registrations', label: 'Registration', shortLabel: 'Registration', icon: FileCheck2, className: 'border-blue-300 bg-blue-50 text-blue-700' },
  { id: 'land_use', label: 'Land Use', shortLabel: 'Land Use', icon: Layers3, className: 'border-cyan-300 bg-cyan-50 text-cyan-700' },
  { id: 'master_plan', label: 'Master Plan / Zone', shortLabel: 'Master Plan', icon: Landmark, className: 'border-indigo-300 bg-indigo-50 text-indigo-700' },
  { id: 'building_permissions', label: 'Building Permissions', shortLabel: 'Permissions', icon: Building2, className: 'border-violet-300 bg-violet-50 text-violet-700' },
  { id: 'property_tax', label: 'Property Tax', shortLabel: 'Tax', icon: ReceiptText, className: 'border-amber-300 bg-amber-50 text-amber-700' },
  { id: 'utility_infrastructure', label: 'Utilities', shortLabel: 'Utilities', icon: UtilityPole, className: 'border-teal-300 bg-teal-50 text-teal-700' },
  { id: 'restrictions', label: 'Restrictions', shortLabel: 'Restrictions', icon: ShieldAlert, className: 'border-orange-300 bg-orange-50 text-orange-700' },
  { id: 'data_conflicts', label: 'Data Conflicts', shortLabel: 'Conflicts', icon: AlertTriangle, className: 'border-red-300 bg-red-50 text-red-700' },
  { id: 'mortgages', label: 'Mortgages', shortLabel: 'Mortgage', icon: WalletCards, className: 'border-pink-300 bg-pink-50 text-pink-700' },
  { id: 'encumbrances', label: 'Encumbrances', shortLabel: 'Encumbrance', icon: Gavel, className: 'border-slate-300 bg-slate-50 text-slate-700' },
];

function hasRecord(value: Parcel360Record | null): boolean {
  return Boolean(value && Object.keys(value).length > 0);
}

function getSectionCount(
  id: SectionId,
  details: ErodeParcel360Details
): number {
  switch (id) {
    case 'record_of_rights':
      return details.record_of_rights.length;
    case 'registrations':
      return details.registrations.length;
    case 'land_use':
      return hasRecord(details.land_use) ? 1 : 0;
    case 'master_plan':
      return hasRecord(details.master_plan) ? 1 : 0;
    case 'building_permissions':
      return details.building_permissions.length;
    case 'property_tax':
      return details.property_tax.length;
    case 'utility_infrastructure':
      return hasRecord(details.utility_infrastructure) ? 1 : 0;
    case 'restrictions':
      return details.restrictions.length;
    case 'data_conflicts':
      return details.data_conflicts.length;
    case 'mortgages':
      return details.mortgages.length;
    case 'encumbrances':
      return details.encumbrances.length;
  }
}

function humanizeKey(key: string): string {
  return key
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function formatValue(value: string | number | boolean | null): string {
  if (value === null || value === '') return 'N/A';
  if (typeof value === 'boolean') return value ? 'Yes' : 'No';
  if (typeof value === 'number') return value.toLocaleString('en-IN');
  return value;
}

const RecordCard: React.FC<{
  record: Parcel360Record;
  title?: string;
}> = ({ record, title }) => {
  const entries = Object.entries(record).filter(
    ([key, value]) => key !== 'parcel_id' && value !== null && value !== ''
  );

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      {title && <p className="mb-3 text-xs font-bold text-navy">{title}</p>}
      <div className="grid grid-cols-1 gap-x-6 gap-y-2 sm:grid-cols-2">
        {entries.map(([key, value]) => (
          <div key={key} className="flex items-start justify-between gap-3 border-b border-slate-100 pb-1.5">
            <span className="text-[11px] text-slate-500">{humanizeKey(key)}</span>
            <span className="max-w-[60%] text-right text-[11px] font-semibold text-navy break-words">
              {formatValue(value)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

const EmptyState: React.FC = () => (
  <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-5 py-8 text-center">
    <p className="text-xs font-semibold text-slate-500">
      No Erode record is linked to this parcel in this subsystem.
    </p>
  </div>
);

export const GovernmentParcel360Page: React.FC = () => {
  const { parcelId: routeParcelId } = useParams<{ parcelId: string }>();
  const navigate = useNavigate();
  const [details, setDetails] = useState<ErodeParcel360Details | null>(null);
  const [activeSection, setActiveSection] = useState<SectionId>('record_of_rights');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const detailsSectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      if (!routeParcelId) {
        setError('Parcel ID is missing.');
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const result = await getErodeParcel360Details(routeParcelId);
        if (!cancelled) {
          if (!result) {
            setError('Erode parcel was not found.');
          } else {
            setDetails(result);
          }
        }
      } catch (loadError) {
        console.error('[Parcel 360] Load failed:', loadError);
        if (!cancelled) {
          setError('Unable to load Parcel 360 data from Supabase.');
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    void load();

    return () => {
      cancelled = true;
    };
  }, [routeParcelId]);

  const parcelId = String(details?.parcel.parcel_id ?? routeParcelId ?? '');
  const surveyNumber = String(details?.parcel.survey_number ?? 'N/A');
  const village = String(details?.parcel.village ?? 'Village N/A');
  const taluk = String(details?.parcel.taluk ?? 'Taluk N/A');
  const landUse = String(details?.parcel.current_land_use ?? 'N/A');
  const zone = String(details?.parcel.zone ?? 'N/A');

  const totalLinkedRecords = useMemo(() => {
    if (!details) return 0;
    return SECTIONS.reduce(
      (sum, section) => sum + getSectionCount(section.id, details),
      0
    );
  }, [details]);

  const selectSection = (id: SectionId) => {
    setActiveSection(id);
    window.requestAnimationFrame(() => {
      detailsSectionRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    });
  };

  if (isLoading) {
    return (
      <GovernmentLayout>
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
            <Loader2 className="h-5 w-5 animate-spin text-primaryBlue" />
            <span className="text-sm font-semibold text-slate-600">Loading Official Parcel 360°…</span>
          </div>
        </div>
      </GovernmentLayout>
    );
  }

  if (error || !details) {
    return (
      <GovernmentLayout>
        <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
          <AlertTriangle className="h-12 w-12 text-amber-500" />
          <p className="text-sm font-bold text-slate-600">{error || 'Parcel 360 data unavailable.'}</p>
          <button
            type="button"
            onClick={() => navigate('/government/gis')}
            className="rounded-xl bg-navy px-5 py-2.5 text-xs font-bold text-white"
          >
            Back to Erode GIS
          </button>
        </div>
      </GovernmentLayout>
    );
  }

  const activeConfig = SECTIONS.find((section) => section.id === activeSection) ?? SECTIONS[0];

  return (
    <GovernmentLayout>
      <div className="mx-auto w-full max-w-7xl pb-12">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => navigate(`/government/gis?parcel=${encodeURIComponent(parcelId)}`)}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 transition-colors hover:text-navy"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Erode GIS
          </button>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Orbit className="h-4 w-4 text-tealAccent" />
            <span className="font-bold text-navy">Official Parcel 360°</span>
            <span>Integrated Erode land records</span>
          </div>
        </div>

        <div className="mb-6 rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-navy">
              <MapPin className="h-5 w-5 text-tealAccent-light" />
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="text-lg font-bold text-navy">Survey {surveyNumber} · Official Parcel 360°</h1>
              <p className="mt-0.5 text-xs text-slate-500">
                {village} · {taluk} · {parcelId}
              </p>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center">
              <SummaryPill label="Land Use" value={landUse} />
              <SummaryPill label="Zone" value={zone} />
              <SummaryPill label="Linked Records" value={String(totalLinkedRecords)} />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-3 text-center">
            <p className="text-xs font-semibold text-slate-500">
              Select a connected subsystem to inspect its records
            </p>
          </div>

          <div className="mx-auto overflow-x-auto pb-2">
            <div className="relative mx-auto h-[610px] w-[720px] min-w-[720px]">
              <svg className="absolute inset-0 h-full w-full" viewBox="0 0 720 610" aria-hidden="true">
                {SECTIONS.map((section, index) => {
                  const angle = (index / SECTIONS.length) * Math.PI * 2 - Math.PI / 2;
                  const x = 360 + Math.cos(angle) * 260;
                  const y = 300 + Math.sin(angle) * 220;
                  const active = section.id === activeSection;
                  return (
                    <line
                      key={section.id}
                      x1="360"
                      y1="300"
                      x2={x}
                      y2={y}
                      stroke={active ? '#173B57' : '#CBD5E1'}
                      strokeWidth={active ? 3 : 1.5}
                      strokeDasharray={active ? undefined : '6 5'}
                    />
                  );
                })}
              </svg>

              <div className="absolute left-1/2 top-1/2 z-10 flex h-[165px] w-[190px] -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-3xl bg-navy px-4 text-center text-white shadow-xl">
                <MapPin className="mb-2 h-7 w-7 text-tealAccent-light" />
                <p className="text-[10px] font-semibold uppercase tracking-wider text-white/70">Parcel 360</p>
                <p className="mt-1 text-sm font-bold">Survey {surveyNumber}</p>
                <p className="mt-1 max-w-[160px] truncate font-mono text-[10px] text-white/75">{parcelId}</p>
              </div>

              {SECTIONS.map((section, index) => {
                const angle = (index / SECTIONS.length) * Math.PI * 2 - Math.PI / 2;
                const x = 360 + Math.cos(angle) * 260;
                const y = 300 + Math.sin(angle) * 220;
                const active = section.id === activeSection;
                const count = getSectionCount(section.id, details);
                const Icon = section.icon;

                return (
                  <button
                    key={section.id}
                    type="button"
                    onClick={() => selectSection(section.id)}
                    className={`absolute z-20 flex h-[82px] w-[124px] -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-2xl border px-2 shadow-sm transition-all hover:-translate-y-[54%] hover:shadow-md ${section.className} ${active ? 'ring-2 ring-navy/30 shadow-lg' : ''}`}
                    style={{ left: x, top: y }}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="mt-1 text-[10px] font-bold leading-tight">{section.shortLabel}</span>
                    <span className="mt-0.5 rounded-full bg-white/80 px-1.5 py-0.5 text-[9px] font-bold">
                      {count} record{count === 1 ? '' : 's'}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div ref={detailsSectionRef} className="scroll-mt-24 pt-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center gap-3 border-b border-slate-100 pb-4">
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl border ${activeConfig.className}`}>
                <activeConfig.icon className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-navy">{activeConfig.label}</h2>
                <p className="text-[11px] text-slate-500">
                  Live synthetic Erode subsystem records linked by parcel ID
                </p>
              </div>
            </div>

            <SectionDetails section={activeSection} details={details} />
          </div>
        </div>
      </div>
    </GovernmentLayout>
  );
};

const SummaryPill: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="min-w-[92px] rounded-xl bg-slate-50 px-3 py-2">
    <p className="text-[9px] font-semibold uppercase tracking-wider text-slate-400">{label}</p>
    <p className="mt-0.5 max-w-[130px] truncate text-[11px] font-bold text-navy">{value}</p>
  </div>
);

const SectionDetails: React.FC<{
  section: SectionId;
  details: ErodeParcel360Details;
}> = ({ section, details }) => {
  switch (section) {
    case 'record_of_rights':
      if (details.record_of_rights.length === 0) return <EmptyState />;
      return (
        <div className="space-y-4">
          {details.record_of_rights.map((record, index) => (
            <RecordCard key={String(record.ror_id ?? index)} record={record} title={`RoR ${index + 1}`} />
          ))}
          {details.owners.length > 0 && (
            <div>
              <p className="mb-2 text-xs font-bold text-navy">Linked Owner Master Records</p>
              <div className="space-y-3">
                {details.owners.map((record, index) => (
                  <RecordCard key={String(record.owner_id ?? index)} record={record} title={`Owner ${index + 1}`} />
                ))}
              </div>
            </div>
          )}
        </div>
      );
    case 'registrations':
      return renderArray(details.registrations, 'Registration');
    case 'land_use':
      return details.land_use ? <RecordCard record={details.land_use} /> : <EmptyState />;
    case 'master_plan':
      return details.master_plan ? <RecordCard record={details.master_plan} /> : <EmptyState />;
    case 'building_permissions':
      return renderArray(details.building_permissions, 'Permission');
    case 'property_tax':
      return renderArray(details.property_tax, 'Tax Record');
    case 'utility_infrastructure':
      return details.utility_infrastructure ? <RecordCard record={details.utility_infrastructure} /> : <EmptyState />;
    case 'restrictions':
      return renderArray(details.restrictions, 'Restriction');
    case 'data_conflicts':
      return renderArray(details.data_conflicts, 'Conflict');
    case 'mortgages':
      return renderArray(details.mortgages, 'Mortgage');
    case 'encumbrances':
      return renderArray(details.encumbrances, 'Encumbrance');
  }
};

function renderArray(records: Parcel360Record[], label: string): React.ReactNode {
  if (records.length === 0) return <EmptyState />;
  return (
    <div className="space-y-3">
      {records.map((record, index) => (
        <RecordCard key={`${label}-${index}`} record={record} title={`${label} ${index + 1}`} />
      ))}
    </div>
  );
}

export default GovernmentParcel360Page;
