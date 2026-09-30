import React, { useState, useMemo } from 'react';
import { Search, ChevronDown } from 'lucide-react';
import { CITIZEN_SERVICE_CATALOG, SERVICE_CATEGORIES } from '../../data/citizenServiceCatalog';
import type { CitizenServiceDefinition } from '../../types/citizenService';

interface PurposeSelectorProps {
  value: string; // service id
  onChange: (service: CitizenServiceDefinition) => void;
}

export const PurposeSelector: React.FC<PurposeSelectorProps> = ({ value, onChange }) => {
  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(false);

  const selected = CITIZEN_SERVICE_CATALOG.find((s) => s.id === value);

  const filtered = useMemo(() => {
    if (!search.trim()) return CITIZEN_SERVICE_CATALOG;
    const q = search.toLowerCase();
    return CITIZEN_SERVICE_CATALOG.filter(
      (s) => s.label.toLowerCase().includes(q) || s.category.toLowerCase().includes(q)
    );
  }, [search]);

  const grouped = useMemo(() => {
    const map: Record<string, CitizenServiceDefinition[]> = {};
    for (const s of filtered) {
      if (!map[s.category]) map[s.category] = [];
      map[s.category].push(s);
    }
    return map;
  }, [filtered]);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`w-full h-12 px-4 flex items-center justify-between gap-2 text-sm bg-slate-50 border-2 rounded-xl transition-all ${
          open ? 'border-navy ring-4 ring-navy/10 bg-white' : 'border-slate-300 hover:border-slate-400'
        }`}
      >
        <span className={selected ? 'text-navy font-medium' : 'text-slate-400'}>
          {selected ? selected.label : 'Search and select a citizen purpose...'}
        </span>
        <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute top-14 left-0 right-0 bg-white border border-slate-200 rounded-2xl shadow-2xl z-50 overflow-hidden">
          <div className="p-3 border-b border-slate-100">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Type to search purposes..."
                className="w-full h-9 pl-9 pr-3 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:border-navy focus:ring-2 focus:ring-navy/10 focus:outline-none"
                autoFocus
              />
            </div>
          </div>
          <div className="max-h-80 overflow-y-auto p-2">
            {SERVICE_CATEGORIES.map((cat) => {
              const items = grouped[cat];
              if (!items || items.length === 0) return null;
              return (
                <div key={cat} className="mb-2">
                  <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    {cat}
                  </div>
                  {items.map((service) => (
                    <button
                      key={service.id}
                      type="button"
                      onClick={() => {
                        onChange(service);
                        setOpen(false);
                        setSearch('');
                      }}
                      className={`w-full text-left px-3 py-2 rounded-xl text-sm transition-colors ${
                        service.id === value
                          ? 'bg-navy text-white'
                          : 'hover:bg-slate-100 text-navy'
                      }`}
                    >
                      {service.label}
                    </button>
                  ))}
                </div>
              );
            })}
            {filtered.length === 0 && (
              <p className="text-xs text-slate-400 text-center py-6">No matching purposes found.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
