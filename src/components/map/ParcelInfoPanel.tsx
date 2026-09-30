import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MapPin,
  Layers,
  Ruler,
  ExternalLink,
  Radio,
  Info,
  X,
} from 'lucide-react';
import type { Parcel } from '../../types/parcel';
import {
  ParcelStatusBadge,
  getRoRStatusVariant,
  getRegistrationStatusVariant,
  getEncumbranceStatusVariant,
  getTaxStatusVariant,
  getDisputeStatusVariant,
} from '../parcel/ParcelStatusBadge';

const LAND_USE_COLORS: Record<string, string> = {
  Residential: '#246BCE',
  Commercial: '#087F8C',
  Industrial: '#7C3AED',
  Institutional: '#173B57',
  Agricultural: '#2E7D32',
  'Open Space': '#10B981',
  'Mixed Use': '#E99A24',
};

interface ParcelInfoPanelProps {
  selectedParcel: Parcel | null;
  onClose?: () => void;
}

export const ParcelInfoPanel: React.FC<ParcelInfoPanelProps> = ({
  selectedParcel,
  onClose,
}) => {
  const navigate = useNavigate();

  if (!selectedParcel) {
    return (
      <div className="flex flex-col h-full bg-white border-l border-slate-200 overflow-y-auto">
        {/* Empty State */}
        <div className="flex flex-col items-center justify-center h-full px-6 py-10 text-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center">
            <MapPin className="w-7 h-7 text-slate-400" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-600 leading-snug">
              Select a parcel on the map
            </p>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Click any highlighted parcel to view its details here.
            </p>
          </div>

          <div className="mt-4 w-full p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-700 leading-relaxed text-left">
            <p className="font-semibold mb-1 flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5" />
              Quick Tip
            </p>
            <p>Parcels are colour-coded by land use. Use the layer panel to toggle cadastral overlays.</p>
          </div>
        </div>
      </div>
    );
  }

  const luColor = LAND_USE_COLORS[selectedParcel.landUse] || '#246BCE';

  return (
    <div className="flex flex-col h-full bg-white border-l border-slate-200 overflow-y-auto">
      {/* Panel Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-slate-100 px-4 py-3 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <div
            className="w-3 h-3 rounded-full shrink-0"
            style={{ backgroundColor: luColor, boxShadow: `0 0 0 2px ${luColor}40` }}
          />
          <span className="text-xs font-bold text-navy truncate">
            Survey {selectedParcel.surveyNumber}
          </span>
        </div>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors lg:hidden"
            aria-label="Close panel"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto divide-y divide-slate-100">

        {/* Identity */}
        <div className="px-4 py-4 space-y-3">
          <div className="flex items-start gap-2">
            <MapPin className="w-3.5 h-3.5 text-teal-600 mt-0.5 shrink-0" />
            <div>
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-0.5">
                Location
              </p>
              <p className="text-xs font-semibold text-navy leading-snug">
                {selectedParcel.village}, {selectedParcel.district}
              </p>
              <p className="text-[11px] text-slate-500">
                {selectedParcel.ward} · {selectedParcel.state}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <Layers className="w-3.5 h-3.5 text-purple-600 mt-0.5 shrink-0" />
            <div>
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-0.5">
                Land Use / Zone
              </p>
              <div className="flex items-center gap-1.5 flex-wrap">
                <span
                  className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold text-white"
                  style={{ backgroundColor: luColor }}
                >
                  {selectedParcel.landUse}
                </span>
                <span className="text-[11px] text-slate-500">
                  Zone {selectedParcel.planningZone}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <Ruler className="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" />
            <div>
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-0.5">
                Area
              </p>
              <p className="text-xs font-semibold text-navy">
                {selectedParcel.area.toLocaleString('en-IN')}{' '}
                <span className="font-normal text-slate-500">{selectedParcel.areaUnit}</span>
              </p>
            </div>
          </div>

          {/* ULPIN */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2">
            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
              ULPIN
            </p>
            <p className="font-mono text-xs font-bold text-navy tracking-widest">
              {selectedParcel.ulpin}
            </p>
          </div>
        </div>

        {/* Status Grid */}
        <div className="px-4 py-4">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3">
            Status Overview
          </p>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-slate-600">Record of Rights</span>
              <ParcelStatusBadge
                variant={getRoRStatusVariant(selectedParcel.rorStatus)}
                label={selectedParcel.rorStatus}
                size="sm"
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-slate-600">Registration</span>
              <ParcelStatusBadge
                variant={getRegistrationStatusVariant(selectedParcel.registrationStatus)}
                label={
                  selectedParcel.registrationStatus === 'Pending Verification'
                    ? 'Pending'
                    : selectedParcel.registrationStatus
                }
                size="sm"
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-slate-600">Encumbrance</span>
              <ParcelStatusBadge
                variant={getEncumbranceStatusVariant(selectedParcel.encumbranceStatus)}
                label={
                  selectedParcel.encumbranceStatus === 'Mortgage Exists'
                    ? 'Mortgage'
                    : selectedParcel.encumbranceStatus
                }
                size="sm"
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-slate-600">Property Tax</span>
              <ParcelStatusBadge
                variant={getTaxStatusVariant(selectedParcel.taxStatus)}
                label={selectedParcel.taxStatus}
                size="sm"
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-slate-600">Court Dispute</span>
              <ParcelStatusBadge
                variant={getDisputeStatusVariant(selectedParcel.courtDisputeStatus)}
                label={selectedParcel.courtDisputeStatus}
                size="sm"
              />
            </div>
          </div>
        </div>

        {/* Ownership */}
        <div className="px-4 py-4">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
            Ownership
          </p>
          <p className="text-xs text-slate-700 leading-relaxed">
            {selectedParcel.ownersSummary}
          </p>
          <p className="text-[11px] text-slate-500 mt-1">
            Type: {selectedParcel.ownershipType}
          </p>
        </div>

        {/* Last Updated */}
        <div className="px-4 py-3">
          <p className="text-[10px] text-slate-400 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
            Last updated: {selectedParcel.lastUpdated}
          </p>
        </div>
      </div>

      {/* Action Buttons — Sticky at Bottom */}
      <div className="shrink-0 px-4 py-4 border-t border-slate-100 space-y-2 bg-white">
        <button
          type="button"
          onClick={() => navigate(`/citizen/parcel/${selectedParcel.ulpin}`)}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-navy text-white rounded-xl text-xs font-bold hover:bg-navy-light transition-colors shadow-sm"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          View Full Parcel Profile
        </button>
        <button
          type="button"
          onClick={() => navigate(`/citizen/parcel/${selectedParcel.ulpin}/360`)}
          className="w-full flex items-center justify-center gap-2 py-2 px-4 border border-tealAccent text-tealAccent rounded-xl text-xs font-bold hover:bg-tealAccent-light/30 transition-colors"
        >
          <Radio className="w-3.5 h-3.5" />
          Parcel 360°
        </button>
      </div>
    </div>
  );
};
