import React from 'react';
import { User, MapPin, FileText, Building2, Files } from 'lucide-react';
import type { CitizenServiceDefinition } from '../../types/citizenService';
import type { Parcel } from '../../types/parcel';

interface ApplicationReviewProps {
  appData: {
    citizenName: string;
    citizenMobile: string;
    citizenEmail?: string;
    purposeLabel: string;
    category: string;
    selectedParcel: Parcel | null;
    location: import('../../types/application').ApplicationLocation;
    requestDetails: Record<string, string>;
    documents: import('../../types/application').ApplicationDocument[];
    targetDepartment: string;
    targetRole: string;
  };
  service: CitizenServiceDefinition;
  declarationChecked: boolean;
  onDeclarationChange: (v: boolean) => void;
}

export const ApplicationReview: React.FC<ApplicationReviewProps> = ({
  appData,
  service,
  declarationChecked,
  onDeclarationChange,
}) => {
  const uploadedDocs = appData.documents.filter((d) => d.uploaded);

  return (
    <div className="space-y-5">
      {/* Applicant */}
      <ReviewSection icon={<User className="w-4 h-4" />} title="Applicant">
        <ReviewRow label="Name" value={appData.citizenName} />
        <ReviewRow label="Mobile" value={`+91 ${appData.citizenMobile}`} />
        {appData.citizenEmail && <ReviewRow label="Email" value={appData.citizenEmail} />}
      </ReviewSection>

      {/* Purpose */}
      <ReviewSection icon={<FileText className="w-4 h-4" />} title="Purpose">
        <ReviewRow label="Category" value={appData.category} />
        <ReviewRow label="Purpose" value={appData.purposeLabel} />
      </ReviewSection>

      {/* Parcel / Location */}
      <ReviewSection icon={<MapPin className="w-4 h-4" />} title="Parcel / Location">
        {appData.selectedParcel ? (
          <>
            <ReviewRow label="Survey No." value={appData.selectedParcel.surveyNumber} />
            <ReviewRow label="ULPIN" value={appData.selectedParcel.ulpin} mono />
            <ReviewRow label="Village" value={appData.selectedParcel.village} />
            <ReviewRow label="District" value={appData.selectedParcel.district} />
            <ReviewRow label="State" value={appData.selectedParcel.state} />
          </>
        ) : (
          <>
            {appData.location.state && <ReviewRow label="State" value={appData.location.state} />}
            {appData.location.district && <ReviewRow label="District" value={appData.location.district} />}
            {appData.location.villageOrWard && <ReviewRow label="Village / Ward" value={appData.location.villageOrWard} />}
            {appData.location.landmark && <ReviewRow label="Landmark" value={appData.location.landmark} />}
          </>
        )}
      </ReviewSection>

      {/* Request Details */}
      {Object.keys(appData.requestDetails).length > 0 && (
        <ReviewSection icon={<FileText className="w-4 h-4" />} title="Request Details">
          {service.fields
            .filter((f) => appData.requestDetails[f.id])
            .map((f) => (
              <ReviewRow key={f.id} label={f.label} value={appData.requestDetails[f.id]} />
            ))}
        </ReviewSection>
      )}

      {/* Documents */}
      <ReviewSection icon={<Files className="w-4 h-4" />} title="Documents">
        {uploadedDocs.length === 0 ? (
          <p className="text-xs text-slate-400">No documents uploaded.</p>
        ) : (
          <ul className="space-y-1">
            {uploadedDocs.map((d) => (
              <li key={d.id} className="text-xs text-navy flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-tealAccent" />
                {d.name} — <span className="text-slate-500 font-mono text-[11px]">{d.fileName}</span>
              </li>
            ))}
          </ul>
        )}
      </ReviewSection>

      {/* Routing & Authority */}
      <ReviewSection icon={<Building2 className="w-4 h-4" />} title="Responsible Authority & Jurisdiction">
        <ReviewRow label="Responsible Department" value={appData.targetDepartment} />
        <ReviewRow label="Responsible Officer" value={appData.targetRole} />
        <ReviewRow
          label="Jurisdiction"
          value={
            appData.selectedParcel
              ? `${appData.selectedParcel.state} → ${appData.selectedParcel.district} District`
              : appData.location.state && appData.location.district
              ? `${appData.location.state} → ${appData.location.district} District`
              : appData.location.state || 'National / State Level'
          }
        />
        {service.fallbackRoles.length > 0 && (
          <ReviewRow label="Fallback Roles" value={service.fallbackRoles.join(', ')} />
        )}
      </ReviewSection>

      {/* Declaration */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={declarationChecked}
            onChange={(e) => onDeclarationChange(e.target.checked)}
            className="mt-0.5 w-4 h-4 rounded border-slate-300 text-navy focus:ring-navy"
          />
          <span className="text-xs text-slate-700 leading-relaxed">
            I confirm that the information provided in this application is correct to the best of my knowledge. I understand that providing false information may lead to rejection or legal action.
          </span>
        </label>
      </div>
    </div>
  );
};

function ReviewSection({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-3 bg-slate-50 border-b border-slate-200">
        <span className="text-tealAccent">{icon}</span>
        <h4 className="text-xs font-bold text-navy uppercase tracking-wider">{title}</h4>
      </div>
      <div className="px-4 py-3 space-y-2">{children}</div>
    </div>
  );
}

function ReviewRow({
  label,
  value,
  mono = false,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="flex items-start gap-2 text-xs">
      <span className="text-slate-400 w-32 shrink-0">{label}:</span>
      <span className={`text-navy font-semibold ${mono ? 'font-mono' : ''}`}>{value}</span>
    </div>
  );
}
