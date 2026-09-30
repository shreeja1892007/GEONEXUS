import React, { useState } from 'react';
import {
  Layers,
  ChevronDown,
  ChevronUp,
  Sliders,
  Building,
  Home,
  Factory,
  GraduationCap,
  Trees,
  Sprout,
  Store,
} from 'lucide-react';
import type { LandUseType } from '../../types/parcel';

interface LayerPanelProps {
  layerStates: Record<string, boolean>;
  onToggleLayer: (layerName: string) => void;
  opacity: number;
  onOpacityChange: (value: number) => void;
  className?: string;
}

export const LayerPanel: React.FC<LayerPanelProps> = ({
  layerStates,
  onToggleLayer,
  opacity,
  onOpacityChange,
  className = '',
}) => {
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
    base: true,
    essential: true,
    usecase: false,
  });

  const toggleGroup = (key: string) => {
    setOpenGroups((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const BASE_LAYERS = [
    { id: 'cadastralParcels', name: 'Cadastral Parcels' },
    { id: 'parcelBoundaries', name: 'Parcel Boundaries' },
    { id: 'ulpin', name: 'ULPIN & Survey Nos' },
    { id: 'surveyBoundaries', name: 'Survey Boundaries' },
    { id: 'adminBoundaries', name: 'Administrative Boundaries' },
    { id: 'satellite', name: 'Satellite Imagery' },
  ];

  const ESSENTIAL_LAYERS = [
    { id: 'ror', name: 'Record of Rights' },
    { id: 'registration', name: 'Registration' },
    { id: 'zoning', name: 'Zoning / Master Plan' },
    { id: 'landUse', name: 'Land Use' },
    { id: 'buildingPermissions', name: 'Building Permissions' },
    { id: 'mortgages', name: 'Mortgages' },
    { id: 'encumbrances', name: 'Encumbrances' },
    { id: 'disputes', name: 'Disputes' },
  ];

  const USE_CASE_LAYERS = [
    { id: 'propertyTax', name: 'Property Tax' },
    { id: 'roads', name: 'Roads & Alignments' },
    { id: 'metro', name: 'Metro / Rail Corridors' },
    { id: 'electricity', name: 'Electricity Lines' },
    { id: 'water', name: 'Water Networks' },
    { id: 'sewerage', name: 'Sewerage Networks' },
    { id: 'floodZones', name: 'Flood Hazard Zones' },
    { id: 'environmental', name: 'Environmental / CRZ Zones' },
    { id: 'heritage', name: 'Heritage Zones' },
    { id: 'acquisition', name: 'Land Acquisition' },
    { id: 'valuation', name: 'Guideline Valuation' },
  ];

  const LEGEND_ITEMS: { type: LandUseType; color: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { type: 'Residential', color: '#246BCE', icon: Home },
    { type: 'Commercial', color: '#087F8C', icon: Store },
    { type: 'Industrial', color: '#7C3AED', icon: Factory },
    { type: 'Institutional', color: '#173B57', icon: GraduationCap },
    { type: 'Agricultural', color: '#2E7D32', icon: Sprout },
    { type: 'Open Space', color: '#10B981', icon: Trees },
    { type: 'Mixed Use', color: '#E99A24', icon: Building },
  ];

  return (
    <div
      className={`bg-white rounded-card border border-slate-200 shadow-card p-4 flex flex-col h-full overflow-y-auto text-xs ${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
        <div className="flex items-center gap-2 font-bold text-navy text-sm">
          <Layers className="w-4 h-4 text-tealAccent" />
          <span>GIS Layers</span>
        </div>
        <span className="text-[10px] font-semibold text-slate-400">Integrated DPI</span>
      </div>

      {/* Layer Opacity Slider */}
      <div className="p-2.5 bg-slate-50 rounded-xl mb-3 border border-slate-100">
        <div className="flex items-center justify-between text-[11px] font-semibold text-slate-600 mb-1.5">
          <span className="flex items-center gap-1">
            <Sliders className="w-3 h-3 text-slate-400" />
            <span>Cadastral Opacity</span>
          </span>
          <span className="font-mono text-navy">{Math.round(opacity * 100)}%</span>
        </div>
        <input
          type="range"
          min={0.1}
          max={1.0}
          step={0.05}
          value={opacity}
          onChange={(e) => onOpacityChange(parseFloat(e.target.value))}
          className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-primaryBlue"
        />
      </div>

      {/* Accordion Groups */}
      <div className="space-y-2 flex-1">
        {/* 1. BASE LAYERS */}
        <div className="border border-slate-200/80 rounded-xl overflow-hidden">
          <button
            type="button"
            onClick={() => toggleGroup('base')}
            className="w-full px-3 py-2 bg-slate-50 hover:bg-slate-100 text-left font-bold text-navy flex items-center justify-between transition-colors"
          >
            <span className="text-[11px] uppercase tracking-wider">Base Layers</span>
            {openGroups.base ? <ChevronUp className="w-3.5 h-3.5 text-slate-400" /> : <ChevronDown className="w-3.5 h-3.5 text-slate-400" />}
          </button>

          {openGroups.base && (
            <div className="p-2.5 space-y-2 bg-white">
              {BASE_LAYERS.map((layer) => (
                <label
                  key={layer.id}
                  className="flex items-center gap-2 cursor-pointer select-none text-slate-700 hover:text-navy"
                >
                  <input
                    type="checkbox"
                    checked={layerStates[layer.id] === true}
                    onChange={() => onToggleLayer(layer.id)}
                    className="w-3.5 h-3.5 rounded border-slate-300 text-primaryBlue focus:ring-primaryBlue"
                  />
                  <span className="text-[11px]">{layer.name}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* 2. ESSENTIAL LAYERS */}
        <div className="border border-slate-200/80 rounded-xl overflow-hidden">
          <button
            type="button"
            onClick={() => toggleGroup('essential')}
            className="w-full px-3 py-2 bg-slate-50 hover:bg-slate-100 text-left font-bold text-navy flex items-center justify-between transition-colors"
          >
            <span className="text-[11px] uppercase tracking-wider">Essential Layers</span>
            {openGroups.essential ? <ChevronUp className="w-3.5 h-3.5 text-slate-400" /> : <ChevronDown className="w-3.5 h-3.5 text-slate-400" />}
          </button>

          {openGroups.essential && (
            <div className="p-2.5 space-y-2 bg-white">
              {ESSENTIAL_LAYERS.map((layer) => (
                <label
                  key={layer.id}
                  className="flex items-center gap-2 cursor-pointer select-none text-slate-700 hover:text-navy"
                >
                  <input
                    type="checkbox"
                    checked={layerStates[layer.id] === true}
                    onChange={() => onToggleLayer(layer.id)}
                    className="w-3.5 h-3.5 rounded border-slate-300 text-primaryBlue focus:ring-primaryBlue"
                  />
                  <span className="text-[11px]">{layer.name}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* 3. USE-CASE LAYERS */}
        <div className="border border-slate-200/80 rounded-xl overflow-hidden">
          <button
            type="button"
            onClick={() => toggleGroup('usecase')}
            className="w-full px-3 py-2 bg-slate-50 hover:bg-slate-100 text-left font-bold text-navy flex items-center justify-between transition-colors"
          >
            <span className="text-[11px] uppercase tracking-wider">Use-Case Layers</span>
            {openGroups.usecase ? <ChevronUp className="w-3.5 h-3.5 text-slate-400" /> : <ChevronDown className="w-3.5 h-3.5 text-slate-400" />}
          </button>

          {openGroups.usecase && (
            <div className="p-2.5 space-y-2 bg-white">
              {USE_CASE_LAYERS.map((layer) => (
                <label
                  key={layer.id}
                  className="flex items-center gap-2 cursor-pointer select-none text-slate-700 hover:text-navy"
                >
                  <input
                    type="checkbox"
                    checked={layerStates[layer.id] === true}
                    onChange={() => onToggleLayer(layer.id)}
                    className="w-3.5 h-3.5 rounded border-slate-300 text-primaryBlue focus:ring-primaryBlue"
                  />
                  <span className="text-[11px]">{layer.name}</span>
                </label>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Accessible Land Use Map Legend */}
      <div className="mt-4 pt-3 border-t border-slate-100">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
          Land Use Legend
        </p>
        <div className="grid grid-cols-1 gap-1.5">
          {LEGEND_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.type} className="flex items-center gap-2">
                <span
                  className="w-3.5 h-3.5 rounded border border-black/10 flex items-center justify-center shrink-0 text-white"
                  style={{ backgroundColor: item.color }}
                >
                  <Icon className="w-2.5 h-2.5 stroke-[2.5]" />
                </span>
                <span className="text-[11px] text-slate-600 font-medium">{item.type}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
