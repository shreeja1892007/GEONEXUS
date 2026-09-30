import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AlertCircle,
  ArrowRight,
  Loader2,
  Map,
  MapPin,
  Search,
  Sparkles,
} from 'lucide-react';
import {
  searchErodeParcels,
  type ErodeParcel,
} from '../../services/erodeGisService';

interface ParcelSearchProps {
  initialQuery?: string;
  onSelectParcel?: (parcel: ErodeParcel) => void;
  compact?: boolean;
}

function detectSearchType(query: string): string {
  const text = query.trim();

  if (/^ERD-P-\d+$/i.test(text)) return 'Parcel ID';
  if (/^\d+\s*\/\s*[0-9A-Za-z]+$/i.test(text)) return 'Survey Number';
  if (/^\d+$/.test(text)) return 'Survey Number';
  return 'Village / Taluk';
}

export const ParcelSearch: React.FC<ParcelSearchProps> = ({
  initialQuery = '',
  onSelectParcel,
  compact = false,
}) => {
  const navigate = useNavigate();
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<ErodeParcel[]>([]);
  const [detectedType, setDetectedType] = useState<string>(
    detectSearchType(initialQuery)
  );
  const [hasSearched, setHasSearched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [compactOpen, setCompactOpen] = useState(false);

  const runSearch = useCallback(async (rawQuery: string) => {
    const text = rawQuery.trim();

    if (!text) {
      setResults([]);
      setHasSearched(false);
      setError(null);
      setCompactOpen(false);
      return;
    }

    setDetectedType(detectSearchType(text));
    setIsLoading(true);
    setError(null);
    setHasSearched(true);

    try {
      const data = await searchErodeParcels(text);
      setResults(data);
      setCompactOpen(true);
    } catch (err) {
      console.error('[Citizen Dashboard Search] Search failed:', err);
      setResults([]);
      setError('Unable to search Erode parcels. Check the Supabase connection.');
      setCompactOpen(true);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Compact mode retains live suggestions for any legacy consumer.
  useEffect(() => {
    if (!compact) return;

    const text = query.trim();
    if (text.length < 2) {
      setResults([]);
      setHasSearched(false);
      setCompactOpen(false);
      return;
    }

    const timer = window.setTimeout(() => {
      void runSearch(text);
    }, 250);

    return () => window.clearTimeout(timer);
  }, [compact, query, runSearch]);

  const handleSearchSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    void runSearch(query);
  };

  const handleViewOnMap = (parcel: ErodeParcel) => {
    if (onSelectParcel) {
      onSelectParcel(parcel);
      setCompactOpen(false);
      return;
    }

    navigate(`/citizen/map?parcel=${encodeURIComponent(parcel.parcel_id)}`);
  };

  const handleOpen360 = (parcel: ErodeParcel) => {
    navigate(
      `/citizen/parcel/${encodeURIComponent(parcel.parcel_id)}/360`
    );
  };

  if (compact) {
    return (
      <div className="relative w-full max-w-md">
        <form onSubmit={handleSearchSubmit} className="relative flex items-center">
          <input
            type="search"
            value={query}
            autoComplete="off"
            onChange={(event) => {
              setQuery(event.target.value);
              setCompactOpen(true);
            }}
            onFocus={() => {
              if (query.trim().length >= 2) setCompactOpen(true);
            }}
            placeholder="Survey No., Parcel ID or Village"
            className="w-full h-10 pl-9 pr-24 text-xs text-[#1D2733] bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:border-primaryBlue focus:ring-2 focus:ring-primaryBlue/20 focus:outline-none transition-all placeholder:text-slate-400"
          />
          <Search className="absolute left-3 w-4 h-4 text-slate-400" />
          <button
            type="submit"
            disabled={!query.trim() || isLoading}
            className="absolute right-1 px-3 py-1.5 text-[11px] font-semibold text-white bg-primaryBlue hover:bg-primaryBlue-hover rounded-lg transition-colors disabled:opacity-50"
          >
            {isLoading ? '...' : 'Find'}
          </button>
        </form>

        {compactOpen && hasSearched && (
          <div className="absolute top-12 left-0 right-0 bg-white border border-slate-200 rounded-2xl shadow-xl p-2 z-[1600] max-h-80 overflow-y-auto animate-in fade-in slide-in-from-top-1">
            <div className="px-3 py-1.5 flex items-center justify-between text-[11px] text-slate-500 border-b border-slate-100">
              <span>
                Recognised as:{' '}
                <strong className="text-primaryBlue">{detectedType}</strong>
              </span>
              <span>{results.length} found</span>
            </div>

            {isLoading ? (
              <div className="px-3 py-4 text-xs text-slate-500 flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Searching Erode parcels...
              </div>
            ) : error ? (
              <div className="px-3 py-4 text-xs text-red-600">{error}</div>
            ) : results.length === 0 ? (
              <div className="px-3 py-4 text-xs text-slate-500">
                No Erode parcels found.
              </div>
            ) : (
              results.slice(0, 8).map((parcel) => (
                <button
                  type="button"
                  key={parcel.parcel_id}
                  onClick={() => handleViewOnMap(parcel)}
                  className="w-full p-2.5 hover:bg-slate-50 rounded-xl transition-colors text-left flex items-center justify-between gap-2"
                >
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-navy truncate">
                      Survey {parcel.survey_number} • {parcel.village || 'Erode'}
                    </p>
                    <p className="text-[11px] font-mono text-slate-500">
                      {parcel.parcel_id}
                    </p>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-primaryBlue shrink-0" />
                </button>
              ))
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="w-full bg-white rounded-card p-6 sm:p-8 border border-slate-200 shadow-card">
      <div className="max-w-3xl mx-auto">
        <div className="text-center sm:text-left mb-5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primaryBlue-light text-primaryBlue text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Live Erode Unified Registry Search</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-navy tracking-tight">
            Find a Land Parcel
          </h2>
          <p className="text-xs sm:text-sm text-[#657281] mt-1">
            Search the live synthetic Erode cadastral dataset by survey number,
            parcel ID, village, or taluk.
          </p>
        </div>

        <form onSubmit={handleSearchSubmit} className="space-y-4">
          <div className="relative">
            <input
              type="search"
              value={query}
              autoComplete="off"
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Survey No., Parcel ID or Village (e.g. 828/2B)"
              className="w-full h-14 pl-12 pr-4 text-sm sm:text-base text-[#1D2733] bg-slate-50 border-2 border-slate-300 hover:border-slate-400 rounded-2xl focus:bg-white focus:border-primaryBlue focus:ring-4 focus:ring-primaryBlue/15 focus:outline-none transition-all placeholder:text-slate-400 font-medium"
            />
            <Search className="absolute left-4 top-4.5 w-5 h-5 text-slate-400 pointer-events-none" />
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
            <div className="flex items-center gap-1.5 text-xs text-slate-500 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
              <span className="font-semibold text-slate-400 shrink-0">Try:</span>
              <button
                type="button"
                onClick={() => setQuery('333/4C')}
                className="px-2 py-1 bg-slate-100 hover:bg-slate-200 rounded-lg text-navy font-semibold shrink-0"
              >
                333/4C
              </button>
              <button
                type="button"
                onClick={() => setQuery('ERD-P-000232')}
                className="px-2 py-1 bg-slate-100 hover:bg-slate-200 rounded-lg text-navy font-semibold shrink-0 font-mono"
              >
                ERD-P-000232
              </button>
              <button
                type="button"
                onClick={() => setQuery('Senmedu')}
                className="px-2 py-1 bg-slate-100 hover:bg-slate-200 rounded-lg text-navy font-semibold shrink-0"
              >
                Senmedu
              </button>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => navigate('/citizen/map')}
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-button transition-colors"
              >
                <Map className="w-4 h-4 text-tealAccent" />
                <span>Open Map Explorer</span>
              </button>

              <button
                type="submit"
                disabled={!query.trim() || isLoading}
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-primaryBlue hover:bg-primaryBlue-hover text-white text-xs font-semibold rounded-button transition-all shadow-button disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Searching...</span>
                  </>
                ) : (
                  <>
                    <span>Search Parcel</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        </form>

        {hasSearched && (
          <div className="mt-6 pt-5 border-t border-slate-100 animate-in fade-in duration-200">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100 text-xs gap-3">
              <div className="flex items-center gap-2">
                <span className="text-slate-500">Recognised as:</span>
                <span className="px-2.5 py-0.5 rounded-full bg-tealAccent-light text-tealAccent font-bold">
                  {detectedType}
                </span>
              </div>
              <span className="text-slate-400 font-medium">
                {isLoading
                  ? 'Searching...'
                  : `${results.length} ${results.length === 1 ? 'parcel found' : 'parcels found'}`}
              </span>
            </div>

            {isLoading ? (
              <div className="text-center py-9">
                <Loader2 className="w-8 h-8 text-primaryBlue mx-auto mb-3 animate-spin" />
                <p className="text-sm font-semibold text-navy">
                  Searching the Erode registry...
                </p>
              </div>
            ) : error ? (
              <div className="text-center py-8">
                <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
                <p className="text-sm font-semibold text-red-700">Search failed</p>
                <p className="text-xs text-slate-500 mt-1">{error}</p>
              </div>
            ) : results.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {results.map((parcel) => (
                  <div
                    key={parcel.parcel_id}
                    className="p-4 rounded-2xl border border-slate-200/90 bg-slate-50/50 hover:bg-white hover:border-primaryBlue/50 hover:shadow-card transition-all flex flex-col justify-between group"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div>
                          <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">
                            Survey No.
                          </p>
                          <h3 className="text-lg font-bold text-navy tracking-tight">
                            {parcel.survey_number}
                          </h3>
                        </div>
                        <span className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-blue-50 text-primaryBlue border border-blue-200 text-right">
                          {parcel.current_land_use || parcel.land_type || 'Land Parcel'}
                        </span>
                      </div>

                      <div className="space-y-1.5 text-xs text-slate-600 mb-4">
                        <p className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-tealAccent" />
                          <span>
                            <strong className="text-navy">
                              {parcel.village || 'Village N/A'}
                            </strong>
                            {parcel.taluk ? ` · ${parcel.taluk}` : ''}
                          </span>
                        </p>
                        <p>
                          District:{' '}
                          <strong className="text-navy">{parcel.district}</strong>
                        </p>
                        <p className="font-mono text-[11px] text-slate-500">
                          Parcel ID:{' '}
                          <strong className="text-navy">{parcel.parcel_id}</strong>
                        </p>
                        <p>
                          Area:{' '}
                          <strong className="text-navy">
                            {parcel.area_sq_m !== null
                              ? `${Number(parcel.area_sq_m).toLocaleString()} m²`
                              : 'N/A'}
                          </strong>
                        </p>
                        {parcel.subdivision_number && (
                          <p>
                            Subdivision:{' '}
                            <strong className="text-navy">
                              {parcel.subdivision_number}
                            </strong>
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-200/70 flex flex-wrap items-center justify-between gap-2">
                      <button
                        type="button"
                        onClick={() => handleOpen360(parcel)}
                        className="text-xs font-semibold text-slate-600 hover:text-navy underline p-1"
                      >
                        Parcel 360°
                      </button>

                      <button
                        type="button"
                        onClick={() => handleViewOnMap(parcel)}
                        className="inline-flex items-center gap-1.5 px-4 py-2 bg-navy hover:bg-navy-light text-white text-xs font-semibold rounded-button transition-colors shadow-xs"
                      >
                        <Map className="w-3.5 h-3.5 text-tealAccent-light" />
                        <span>View on Map</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <AlertCircle className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <p className="text-sm font-semibold text-navy">
                  No matching Erode parcels found
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  Try survey <strong>333/4C</strong>, parcel ID{' '}
                  <strong>ERD-P-000232</strong>, or village{' '}
                  <strong>Senmedu</strong>.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
