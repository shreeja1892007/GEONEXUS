import React from 'react';
import { useNavigate } from 'react-router-dom';
import { House, Map, ArrowRight } from 'lucide-react';
import { CitizenLayout } from '../../components/layout/CitizenLayout';
import { MOCK_PARCELS } from '../../data/mockParcels';
import { ParcelStatusBadge, getRoRStatusVariant, getEncumbranceStatusVariant, getTaxStatusVariant } from '../../components/parcel/ParcelStatusBadge';

const LAND_USE_COLORS: Record<string, string> = {
  Residential: '#246BCE', Commercial: '#087F8C', Industrial: '#7C3AED',
  Institutional: '#173B57', Agricultural: '#2E7D32', 'Open Space': '#10B981', 'Mixed Use': '#E99A24',
};

export const MyPropertiesPage: React.FC = () => {
  const navigate = useNavigate();
  const myParcels = MOCK_PARCELS.filter((p) => p.isUserProperty);

  return (
    <CitizenLayout>
      <div className="mb-6">
        <h1 className="text-xl font-bold text-navy">My Properties</h1>
        <p className="text-xs text-slate-500 mt-1">Land parcels linked to your Aadhaar-verified citizen account.</p>
      </div>

      {myParcels.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
          <House className="w-14 h-14 text-slate-300" />
          <p className="text-sm font-semibold text-slate-500">No properties linked to your account yet.</p>
          <button type="button" onClick={() => navigate('/citizen/map')} className="px-5 py-2.5 bg-navy text-white text-xs font-bold rounded-xl">
            Explore Map
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {myParcels.map((parcel) => {
            const luColor = LAND_USE_COLORS[parcel.landUse] || '#246BCE';
            return (
              <div key={parcel.ulpin} className="bg-white border border-slate-200 rounded-2xl shadow-card overflow-hidden hover:shadow-card-hover transition-all">
                <div className="h-1" style={{ backgroundColor: luColor }} />
                <div className="px-5 py-4">
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div>
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="px-2 py-0.5 text-[10px] font-bold text-white rounded-full" style={{ backgroundColor: luColor }}>{parcel.landUse}</span>
                        <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-full">Linked</span>
                      </div>
                      <h2 className="text-base font-bold text-navy">Survey {parcel.surveyNumber}</h2>
                      <p className="text-xs text-slate-500 mt-0.5">{parcel.village}, {parcel.district} · {parcel.area.toLocaleString('en-IN')} {parcel.areaUnit}</p>
                      <p className="font-mono text-[11px] text-slate-400 mt-1">{parcel.ulpin}</p>
                    </div>
                    <div className="flex flex-col gap-2">
                      <button type="button" onClick={() => navigate(`/citizen/parcel/${parcel.ulpin}`)} className="flex items-center gap-1.5 px-3 py-1.5 bg-navy text-white text-xs font-bold rounded-xl hover:bg-navy-light transition-colors">
                        Full Profile <ArrowRight className="w-3 h-3" />
                      </button>
                      <button type="button" onClick={() => navigate(`/citizen/map?parcel=${parcel.ulpin}`)} className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 text-slate-600 text-xs font-semibold rounded-xl hover:bg-slate-50 transition-colors">
                        <Map className="w-3 h-3" /> View on Map
                      </button>
                    </div>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <ParcelStatusBadge variant={getRoRStatusVariant(parcel.rorStatus)} label={`RoR: ${parcel.rorStatus}`} size="sm" />
                    <ParcelStatusBadge variant={getEncumbranceStatusVariant(parcel.encumbranceStatus)} label={`EC: ${parcel.encumbranceStatus}`} size="sm" />
                    <ParcelStatusBadge variant={getTaxStatusVariant(parcel.taxStatus)} label={`Tax: ${parcel.taxStatus}`} size="sm" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </CitizenLayout>
  );
};
