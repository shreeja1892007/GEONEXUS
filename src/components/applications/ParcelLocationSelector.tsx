import React, { useState } from 'react';
import { MapPin, Search, X } from 'lucide-react';
import { MOCK_PARCELS, findParcelsByQuery } from '../../data/mockParcels';
import type { Parcel } from '../../types/parcel';
import type { ApplicationLocation } from '../../types/application';
import { INDIAN_STATES_UTS } from '../../types/auth';

interface ParcelLocationSelectorProps {
  allowsLocationOnly: boolean;
  requiresParcel: boolean;
  selectedParcel: Parcel | null;
  location: ApplicationLocation;
  onParcelSelect: (parcel: Parcel | null) => void;
  onLocationChange: (loc: Partial<ApplicationLocation>) => void;
}

export const ParcelLocationSelector: React.FC<ParcelLocationSelectorProps> = ({
  allowsLocationOnly,
  requiresParcel,
  selectedParcel,
  location,
  onParcelSelect,
  onLocationChange,
}) => {
  const [mode, setMode] = useState<'parcel' | 'location'>(requiresParcel ? 'parcel' : (allowsLocationOnly ? 'location' : 'parcel'));
  const [parcelSearch, setParcelSearch] = useState('');
  const [searchResults, setSearchResults] = useState<Parcel[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  const myProperties = MOCK_PARCELS.filter((p) => p.isUserProperty);

  const handleParcelSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const { parcels } = findParcelsByQuery(parcelSearch);
    setSearchResults(parcels);
    setHasSearched(true);
  };

  const handleSelectParcel = (parcel: Parcel) => {
    onParcelSelect(parcel);
    onLocationChange({
      state: parcel.state,
      district: parcel.district,
      villageOrWard: parcel.village,
    });
    setSearchResults([]);
    setHasSearched(false);
    setParcelSearch('');
  };

  return (
    <div className="space-y-4">
      {/* Mode switcher */}
      {allowsLocationOnly && (
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => { setMode('parcel'); onParcelSelect(null); }}
            className={`flex-1 py-2 text-xs font-semibold rounded-xl border transition-all ${
              mode === 'parcel'
                ? 'bg-navy text-white border-navy'
                : 'bg-white text-slate-600 border-slate-300 hover:border-slate-400'
            }`}
          >
            Select from My Properties / Search Parcel
          </button>
          <button
            type="button"
            onClick={() => { setMode('location'); onParcelSelect(null); }}
            className={`flex-1 py-2 text-xs font-semibold rounded-xl border transition-all ${
              mode === 'location'
                ? 'bg-navy text-white border-navy'
                : 'bg-white text-slate-600 border-slate-300 hover:border-slate-400'
            }`}
          >
            Use Location Instead
          </button>
        </div>
      )}

      {mode === 'parcel' && (
        <div className="space-y-4">
          {/* My Properties */}
          {myProperties.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-slate-500 mb-2">My Registered Properties</p>
              <div className="space-y-2">
                {myProperties.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => handleSelectParcel(p)}
                    className={`w-full text-left p-3 rounded-xl border transition-all ${
                      selectedParcel?.id === p.id
                        ? 'border-navy bg-navy/5 ring-2 ring-navy/20'
                        : 'border-slate-200 hover:border-navy/50 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-bold text-navy">Survey {p.surveyNumber}</p>
                        <p className="text-xs text-slate-500">{p.village}, {p.district}</p>
                        <p className="text-[11px] font-mono text-slate-400">{p.ulpin}</p>
                      </div>
                      {selectedParcel?.id === p.id && (
                        <span className="text-xs font-bold text-[#2E7D32] bg-emerald-50 px-2 py-0.5 rounded-lg">Selected</span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Search another parcel */}
          <div>
            <p className="text-xs font-semibold text-slate-500 mb-2">Search Another Parcel</p>
            <form onSubmit={handleParcelSearch} className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={parcelSearch}
                  onChange={(e) => setParcelSearch(e.target.value)}
                  placeholder="ULPIN / Survey No / Address"
                  className="w-full h-10 pl-9 pr-3 text-xs text-navy bg-slate-50 border border-slate-300 rounded-xl focus:border-navy focus:ring-2 focus:ring-navy/10 focus:outline-none"
                />
              </div>
              <button
                type="submit"
                className="px-4 h-10 bg-navy text-white text-xs font-semibold rounded-xl hover:bg-navy/90 transition-colors"
              >
                Search
              </button>
            </form>

            {hasSearched && searchResults.length > 0 && (
              <div className="mt-2 space-y-2">
                {searchResults.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => handleSelectParcel(p)}
                    className="w-full text-left p-3 rounded-xl border border-slate-200 hover:border-navy/50 bg-white transition-all"
                  >
                    <p className="text-sm font-bold text-navy">Survey {p.surveyNumber}</p>
                    <p className="text-xs text-slate-500">{p.village}, {p.district}, {p.state}</p>
                    <p className="text-[11px] font-mono text-slate-400">{p.ulpin}</p>
                  </button>
                ))}
              </div>
            )}

            {hasSearched && searchResults.length === 0 && (
              <p className="text-xs text-slate-400 mt-2 text-center py-2">No parcels found.</p>
            )}
          </div>

          {/* Selected Parcel Info */}
          {selectedParcel && (
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-tealAccent" />
                  <p className="text-xs font-bold text-navy">Selected Parcel</p>
                </div>
                <button type="button" onClick={() => onParcelSelect(null)} className="text-slate-400 hover:text-slate-600">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div><span className="text-slate-400">ULPIN:</span> <span className="font-mono font-semibold text-navy">{selectedParcel.ulpin}</span></div>
                <div><span className="text-slate-400">Survey No:</span> <span className="font-semibold text-navy">{selectedParcel.surveyNumber}</span></div>
                <div><span className="text-slate-400">Village/Ward:</span> <span className="font-semibold text-navy">{selectedParcel.village}</span></div>
                <div><span className="text-slate-400">District:</span> <span className="font-semibold text-navy">{selectedParcel.district}</span></div>
                <div><span className="text-slate-400">State:</span> <span className="font-semibold text-navy">{selectedParcel.state}</span></div>
                <div><span className="text-slate-400">Area:</span> <span className="font-semibold text-navy">{selectedParcel.area.toLocaleString()} {selectedParcel.areaUnit}</span></div>
                <div className="col-span-2"><span className="text-slate-400">Land Use:</span> <span className="font-semibold text-navy">{selectedParcel.landUse}</span></div>
              </div>
            </div>
          )}
        </div>
      )}

      {mode === 'location' && (
        <div className="space-y-3">
          <p className="text-xs text-slate-500">Describe the location for this request.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-navy">State / UT <span className="text-red-500">*</span></label>
              <select
                value={location.state || ''}
                onChange={(e) => onLocationChange({ state: e.target.value })}
                className="h-10 px-3 text-xs text-navy bg-white border border-slate-300 rounded-xl focus:border-navy focus:ring-2 focus:ring-navy/10 focus:outline-none"
              >
                <option value="">Select state...</option>
                {INDIAN_STATES_UTS.map((st) => <option key={st} value={st}>{st}</option>)}
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-navy">District <span className="text-red-500">*</span></label>
              <input
                type="text"
                value={location.district || ''}
                onChange={(e) => onLocationChange({ district: e.target.value })}
                placeholder="e.g. Chennai"
                className="h-10 px-3 text-xs text-navy bg-white border border-slate-300 rounded-xl focus:border-navy focus:ring-2 focus:ring-navy/10 focus:outline-none"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-navy">Taluk / Block</label>
              <input
                type="text"
                value={location.taluk || ''}
                onChange={(e) => onLocationChange({ taluk: e.target.value })}
                placeholder="e.g. Ambattur"
                className="h-10 px-3 text-xs text-navy bg-white border border-slate-300 rounded-xl focus:border-navy focus:ring-2 focus:ring-navy/10 focus:outline-none"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-navy">Village / Ward</label>
              <input
                type="text"
                value={location.villageOrWard || ''}
                onChange={(e) => onLocationChange({ villageOrWard: e.target.value })}
                placeholder="e.g. Villivakkam"
                className="h-10 px-3 text-xs text-navy bg-white border border-slate-300 rounded-xl focus:border-navy focus:ring-2 focus:ring-navy/10 focus:outline-none"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-navy">Panchayat / Municipality</label>
              <input
                type="text"
                value={location.panchayat || ''}
                onChange={(e) => onLocationChange({ panchayat: e.target.value })}
                placeholder="e.g. Villivakkam Panchayat"
                className="h-10 px-3 text-xs text-navy bg-white border border-slate-300 rounded-xl focus:border-navy focus:ring-2 focus:ring-navy/10 focus:outline-none"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-navy">Landmark</label>
              <input
                type="text"
                value={location.landmark || ''}
                onChange={(e) => onLocationChange({ landmark: e.target.value })}
                placeholder="Nearest landmark"
                className="h-10 px-3 text-xs text-navy bg-white border border-slate-300 rounded-xl focus:border-navy focus:ring-2 focus:ring-navy/10 focus:outline-none"
              />
            </div>
            <div className="col-span-1 sm:col-span-2 flex flex-col gap-1">
              <label className="text-xs font-semibold text-navy">Location description</label>
              <textarea
                rows={2}
                value={location.description || ''}
                onChange={(e) => onLocationChange({ description: e.target.value })}
                placeholder="Additional description..."
                className="px-3 py-2 text-xs text-navy bg-white border border-slate-300 rounded-xl focus:border-navy focus:ring-2 focus:ring-navy/10 focus:outline-none resize-none"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
