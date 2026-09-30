import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Loader2, MapPin, Search, X } from 'lucide-react';
import {
  searchErodeParcels,
  type ErodeParcel,
} from '../../services/erodeGisService';

interface LiveErodeParcelSearchProps {
  onSelectParcel: (parcel: ErodeParcel) => void;
  compact?: boolean;
}

const normalizeSearchInput = (raw: string): string =>
  raw
    .trim()
    .replace(/^survey\s*(?:no\.?|number)?\s*[:#-]?\s*/i, '')
    .replace(/^parcel\s*(?:id)?\s*[:#-]?\s*/i, '')
    .split('·')[0]
    .trim()
    .replace(/\s*\/\s*/g, '/');

const isDirectParcelLookup = (raw: string): boolean => {
  const text = normalizeSearchInput(raw);
  return /^ERD-P-\d+$/i.test(text) || /^\d+\/[0-9A-Za-z-]+$/i.test(text);
};

export const LiveErodeParcelSearch: React.FC<LiveErodeParcelSearchProps> = ({
  onSelectParcel,
  compact = false,
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<ErodeParcel[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const skipNextAutoSearchRef = useRef(false);

  const selectParcel = useCallback(
    (parcel: ErodeParcel) => {
      skipNextAutoSearchRef.current = true;
      onSelectParcel(parcel);
      setQuery(
        `Survey ${parcel.survey_number}${parcel.village ? ` · ${parcel.village}` : ''}`
      );
      setResults([]);
      setError(null);
      setOpen(false);
    },
    [onSelectParcel]
  );

  const runSearch = useCallback(
    async (rawQuery: string, autoSelectDirectMatch = false) => {
      const text = rawQuery.trim();

      if (!text) {
        setResults([]);
        setError(null);
        setOpen(false);
        return;
      }

      setIsLoading(true);
      setError(null);
      setOpen(true);

      try {
        const data = await searchErodeParcels(text);
        setResults(data);

        // When the user explicitly presses Search/Enter with a parcel ID or
        // survey number, select the best matching parcel immediately so the
        // map flies to it and both citizen/government detail panels populate.
        if (autoSelectDirectMatch && data.length > 0 && isDirectParcelLookup(text)) {
          const normalized = normalizeSearchInput(text).toLowerCase();
          const exact = data.find(
            (parcel) =>
              parcel.parcel_id.toLowerCase() === normalized ||
              parcel.survey_number.toLowerCase() === normalized
          );

          selectParcel(exact ?? data[0]);
          return;
        }

        setOpen(true);
      } catch (err) {
        console.error('[Erode Search] Failed:', err);
        setResults([]);
        setError('Unable to search Erode parcels. Check the Supabase connection.');
        setOpen(true);
      } finally {
        setIsLoading(false);
      }
    },
    [selectParcel]
  );

  useEffect(() => {
    if (skipNextAutoSearchRef.current) {
      skipNextAutoSearchRef.current = false;
      return;
    }

    const text = query.trim();

    if (text.length < 2) {
      setResults([]);
      setError(null);
      if (!text) setOpen(false);
      return;
    }

    let cancelled = false;

    const timer = window.setTimeout(async () => {
      setIsLoading(true);
      setError(null);

      try {
        const data = await searchErodeParcels(text);
        if (!cancelled) {
          setResults(data);
          setOpen(true);
        }
      } catch (err) {
        console.error('[Erode Search] Failed:', err);
        if (!cancelled) {
          setResults([]);
          setError('Unable to search Erode parcels. Check the Supabase connection.');
          setOpen(true);
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }, 250);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [query]);

  const clearSearch = () => {
    setQuery('');
    setResults([]);
    setError(null);
    setOpen(false);
  };

  return (
    <div className="relative w-full">
      <form
        onSubmit={(event) => {
          event.preventDefault();
          void runSearch(query, true);
        }}
        className={`flex items-center bg-white border border-slate-200 shadow-md focus-within:ring-2 focus-within:ring-primaryBlue/20 focus-within:border-primaryBlue ${
          compact ? 'rounded-xl' : 'rounded-2xl'
        }`}
      >
        <Search className="w-4 h-4 text-slate-400 ml-3.5 shrink-0" />
        <input
          type="search"
          value={query}
          autoComplete="off"
          onChange={(event) => {
            setQuery(event.target.value);
            setOpen(true);
          }}
          onFocus={() => {
            if (query.trim().length >= 2) setOpen(true);
          }}
          placeholder="Survey No., Parcel ID or Village (e.g. 333/4C)"
          className={`min-w-0 flex-1 bg-transparent text-sm text-navy placeholder:text-slate-400 focus:outline-none ${
            compact ? 'px-3 py-2.5' : 'px-3 py-3'
          }`}
        />

        {query && !isLoading && (
          <button
            type="button"
            onClick={clearSearch}
            className="p-1.5 text-slate-400 hover:text-slate-700 shrink-0"
            aria-label="Clear parcel search"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        {isLoading ? (
          <Loader2 className="w-4 h-4 mx-3 text-primaryBlue animate-spin shrink-0" />
        ) : (
          <button
            type="submit"
            disabled={!query.trim()}
            className="m-1.5 ml-1 px-3 py-1.5 rounded-lg bg-navy text-white text-xs font-bold hover:bg-navy/90 disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
          >
            Search
          </button>
        )}
      </form>

      {open && query.trim().length >= 1 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-xl shadow-2xl overflow-hidden z-[1600] max-h-80 overflow-y-auto">
          {error ? (
            <div className="px-4 py-3 text-xs text-red-600">{error}</div>
          ) : isLoading ? (
            <div className="px-4 py-3 text-xs text-slate-500 flex items-center gap-2">
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              Searching Erode parcels...
            </div>
          ) : results.length === 0 ? (
            <div className="px-4 py-3 text-xs text-slate-500">
              No Erode parcels found. Try a parcel ID like ERD-P-000232,
              survey 333/4C, or a village name.
            </div>
          ) : (
            results.map((parcel) => (
              <button
                key={parcel.parcel_id}
                type="button"
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => selectParcel(parcel)}
                className="w-full text-left px-4 py-3 border-b border-slate-100 last:border-b-0 hover:bg-blue-50 transition-colors"
              >
                <div className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-teal-600 mt-0.5 shrink-0" />
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-navy">
                      Survey {parcel.survey_number}
                      {parcel.subdivision_number
                        ? ` / ${parcel.subdivision_number}`
                        : ''}
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5 truncate">
                      {parcel.village || 'Village N/A'}
                      {parcel.taluk ? ` · ${parcel.taluk}` : ''} · Erode
                    </div>
                    <div className="text-[10px] font-mono text-slate-400 mt-1">
                      {parcel.parcel_id}
                    </div>
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default LiveErodeParcelSearch;
