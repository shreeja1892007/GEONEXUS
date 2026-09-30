import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Layers, MapPin, Orbit, Ruler, X } from 'lucide-react';
import type { ErodeParcel } from '../../services/erodeGisService';

const LAND_USE_COLORS: Record<string, string> = {
  Residential: '#246BCE',
  Commercial: '#087F8C',
  Industrial: '#7C3AED',
  Institutional: '#173B57',
  Agricultural: '#2E7D32',
  'Open Space': '#10B981',
  'Mixed Use': '#E99A24',
  'Public Infrastructure': '#0891B2',
  'Vacant Land': '#64748B',
};

interface ErodeParcelInfoPanelProps {
  selectedParcel: ErodeParcel | null;
  onClose?: () => void;
}

export const ErodeParcelInfoPanel: React.FC<ErodeParcelInfoPanelProps> = ({
  selectedParcel,
  onClose,
}) => {
  const navigate = useNavigate();

  if (!selectedParcel) {
    return (
      <div className="flex flex-col h-full bg-white border-l border-slate-200">
        <div className="flex flex-col items-center justify-center h-full px-6 py-10 text-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center">
            <MapPin className="w-7 h-7 text-slate-400" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-600">
              Select an Erode parcel
            </p>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Click a parcel polygon on the map to view its dataset details.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const landUse = selectedParcel.current_land_use || 'Unclassified';
  const landUseColor = LAND_USE_COLORS[landUse] || '#246BCE';
  const area = selectedParcel.area_sq_m ?? selectedParcel.cadastral_area_sq_m;

  return (
    <div className="flex flex-col h-full bg-white border-l border-slate-200 overflow-y-auto">
      <div className="sticky top-0 z-10 bg-white border-b border-slate-100 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2 min-w-0">
          <div
            className="w-3 h-3 rounded-full shrink-0"
            style={{
              backgroundColor: landUseColor,
              boxShadow: `0 0 0 2px ${landUseColor}40`,
            }}
          />
          <span className="text-xs font-bold text-navy truncate">
            Survey {selectedParcel.survey_number}
          </span>
        </div>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
            aria-label="Close parcel details"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="divide-y divide-slate-100">
        <div className="px-4 py-4 space-y-3">
          <div className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5">
            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
              Parcel ID
            </p>
            <p className="font-mono text-xs font-bold text-navy mt-1 break-all">
              {selectedParcel.parcel_id}
            </p>
          </div>

          <div className="flex items-start gap-2">
            <MapPin className="w-3.5 h-3.5 text-teal-600 mt-0.5 shrink-0" />
            <div>
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                Location
              </p>
              <p className="text-xs font-semibold text-navy mt-0.5">
                {selectedParcel.village || 'Village N/A'}
              </p>
              <p className="text-[11px] text-slate-500">
                {selectedParcel.taluk || 'Taluk N/A'} · {selectedParcel.district},{' '}
                {selectedParcel.state}
              </p>
              {selectedParcel.pincode && (
                <p className="text-[11px] text-slate-400">
                  PIN {selectedParcel.pincode}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-start gap-2">
            <Layers className="w-3.5 h-3.5 text-purple-600 mt-0.5 shrink-0" />
            <div>
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                Land Use / Zone
              </p>
              <div className="flex items-center gap-1.5 flex-wrap mt-1">
                <span
                  className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold text-white"
                  style={{ backgroundColor: landUseColor }}
                >
                  {landUse}
                </span>
                <span className="text-[11px] text-slate-500">
                  {selectedParcel.zone || 'Zone N/A'}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <Ruler className="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" />
            <div>
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                Area
              </p>
              <p className="text-xs font-semibold text-navy mt-0.5">
                {area !== null && area !== undefined
                  ? `${Number(area).toLocaleString('en-IN')} m²`
                  : 'N/A'}
              </p>
            </div>
          </div>
        </div>

        <div className="px-4 py-4 space-y-2.5">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
            Parcel Record
          </p>
          <InfoRow label="Subdivision" value={selectedParcel.subdivision_number} />
          <InfoRow label="Land Type" value={selectedParcel.land_type} />
          <InfoRow label="Ownership" value={selectedParcel.ownership_type} />
          <InfoRow label="Parcel Status" value={selectedParcel.parcel_status} />
          <InfoRow
            label="Boundary"
            value={selectedParcel.geometry ? 'Polygon available' : 'Not available'}
          />
        </div>

        <div className="px-4 py-4">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
            GIS Coordinates
          </p>
          <p className="text-[11px] font-mono text-slate-600">
            {selectedParcel.latitude !== null && selectedParcel.longitude !== null
              ? `${Number(selectedParcel.latitude).toFixed(6)}, ${Number(
                  selectedParcel.longitude
                ).toFixed(6)}`
              : 'N/A'}
          </p>
        </div>

        <div className="px-4 py-4">
          <button
            type="button"
            onClick={() =>
              navigate(`/citizen/parcel/${selectedParcel.parcel_id}/360`)
            }
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-navy px-4 py-3 text-xs font-bold text-white shadow-sm hover:bg-navy-light transition-colors"
          >
            <Orbit className="w-4 h-4" />
            OPEN PARCEL 360°
          </button>
        </div>

        <div className="px-4 py-4 bg-blue-50/60">
          <p className="text-[11px] text-blue-700 leading-relaxed">
            Synthetic Erode district land-governance dataset. Parcel 360° connects
            RoR, owners, registration, land use, master plan, permissions, tax,
            utilities, restrictions, conflicts, mortgages and encumbrances.
          </p>
        </div>
      </div>
    </div>
  );
};

const InfoRow: React.FC<{ label: string; value: string | null }> = ({
  label,
  value,
}) => (
  <div className="flex items-start justify-between gap-3">
    <span className="text-[11px] text-slate-500">{label}</span>
    <span className="text-[11px] font-semibold text-navy text-right">
      {value || 'N/A'}
    </span>
  </div>
);

export default ErodeParcelInfoPanel;
