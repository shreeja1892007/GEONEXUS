import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { Layers, MapPin, AlertCircle, FileText, ChevronRight } from 'lucide-react';
import { DEMO_WATER_GIS_ASSETS, type WaterGISAsset } from '../../../data/waterResourcesData';
import { useNavigate } from 'react-router-dom';

interface LayerToggleState {
  parcels: boolean;
  rivers: boolean;
  canals: boolean;
  lakes: boolean;
  reservoirs: boolean;
  tanks: boolean;
  borewells: boolean;
  groundwaterZones: boolean;
  bufferZones: boolean;
  floodRiskZones: boolean;
  encroachments: boolean;
  complaints: boolean;
  wtp: boolean;
}

const DEFAULT_LAYERS: LayerToggleState = {
  parcels: true,
  rivers: true,
  canals: true,
  lakes: true,
  reservoirs: true,
  tanks: true,
  borewells: true,
  groundwaterZones: true,
  bufferZones: true,
  floodRiskZones: true,
  encroachments: true,
  complaints: true,
  wtp: true,
};

export const WaterResourcesGISMap: React.FC = () => {
  const navigate = useNavigate();
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<{ [id: string]: L.Layer }>({});

  const [layers, setLayers] = useState<LayerToggleState>(DEFAULT_LAYERS);
  const [selectedAsset, setSelectedAsset] = useState<WaterGISAsset | null>(DEMO_WATER_GIS_ASSETS[0]);
  const [layersOpen, setLayersOpen] = useState(false);

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [13.0112, 80.2215],
        zoom: 15,
        zoomControl: true,
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; OpenStreetMap contributors | Water Resources GIS',
      }).addTo(map);

      mapInstanceRef.current = map;
    }
  }, []);

  // Update map markers whenever layers change or assets update
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Clear existing markers
    Object.values(markersRef.current).forEach((layer) => map.removeLayer(layer));
    markersRef.current = {};

    DEMO_WATER_GIS_ASSETS.forEach((asset) => {
      // Layer visibility filter
      let isVisible = false;
      if (asset.type === 'Lake' && layers.lakes) isVisible = true;
      if (asset.type === 'Reservoir' && layers.reservoirs) isVisible = true;
      if (asset.type === 'Canal' && layers.canals) isVisible = true;
      if (asset.type === 'WTP' && layers.wtp) isVisible = true;
      if (asset.type === 'Borewell' && layers.borewells) isVisible = true;
      if (asset.type === 'Encroachment' && layers.encroachments) isVisible = true;
      if (asset.type === 'Complaint' && layers.complaints) isVisible = true;

      if (!isVisible) return;

      const isSelected = selectedAsset?.id === asset.id;
      const color =
        asset.type === 'Reservoir' ? '#087F8C' :
        asset.type === 'Lake' ? '#246BCE' :
        asset.type === 'Canal' ? '#3B82F6' :
        asset.type === 'WTP' ? '#10B981' :
        asset.type === 'Encroachment' ? '#EF4444' : '#F59E0B';

      // Create custom SVG circle marker
      const circleMarker = L.circleMarker(asset.center, {
        radius: isSelected ? 12 : 8,
        fillColor: color,
        color: isSelected ? '#173B57' : '#FFFFFF',
        weight: isSelected ? 3 : 1.5,
        fillOpacity: 0.85,
      }).addTo(map);

      circleMarker.bindTooltip(
        `<div><strong>${asset.name}</strong><br/>${asset.type} • Quality: ${asset.quality}</div>`,
        { direction: 'top', sticky: true }
      );

      circleMarker.on('click', () => {
        setSelectedAsset(asset);
      });

      markersRef.current[asset.id] = circleMarker;
    });

    // Add flood risk zone overlay polygon if toggled
    if (layers.floodRiskZones) {
      const floodZone = L.polygon(
        [
          [13.003, 80.210],
          [13.015, 80.212],
          [13.018, 80.228],
          [13.005, 80.225],
        ],
        { color: '#EF4444', weight: 1.5, fillColor: '#FCA5A5', fillOpacity: 0.2, dashArray: '4,4' }
      ).addTo(map);
      floodZone.bindTooltip('Flood Risk Zone A-1', { sticky: true });
      markersRef.current['flood-zone-a1'] = floodZone;
    }

    // Add waterbody buffer zone if toggled
    if (layers.bufferZones) {
      const bufferZone = L.circle([13.0112, 80.2185], {
        radius: 400,
        color: '#3B82F6',
        weight: 1,
        fillColor: '#93C5FD',
        fillOpacity: 0.15,
        dashArray: '3,3',
      }).addTo(map);
      bufferZone.bindTooltip('Buffer Zone (500m mandatory protection)', { sticky: true });
      markersRef.current['buffer-chembaram'] = bufferZone;
    }
  }, [layers, selectedAsset]);

  const toggleLayer = (key: keyof LayerToggleState) => {
    setLayers((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-tealAccent" />
            <h3 className="text-base font-bold text-navy">Water Resources GIS</h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Spatial monitoring of waterbodies, drainage canals, treatment plants, flood zones and citizen grievances.
          </p>
        </div>

        {/* Layer toggle trigger */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setLayersOpen(!layersOpen)}
            className="inline-flex items-center gap-2 px-3 py-2 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-navy rounded-xl border border-slate-300 transition-colors"
          >
            <Layers className="w-3.5 h-3.5 text-primaryBlue" />
            <span>Map Layers ({Object.values(layers).filter(Boolean).length})</span>
          </button>

          {/* Layers Dropdown Menu */}
          {layersOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white border border-slate-200 rounded-2xl shadow-xl p-3 z-50 text-xs space-y-2 max-h-80 overflow-y-auto">
              <p className="font-bold text-navy border-b pb-1 text-[11px] uppercase tracking-wider">Toggle Map Layers</p>
              {([
                { key: 'parcels', label: 'Parcel Boundaries' },
                { key: 'rivers', label: 'Rivers & Streams' },
                { key: 'canals', label: 'Canals & Feeders' },
                { key: 'lakes', label: 'Lakes & Ponds' },
                { key: 'reservoirs', label: 'Reservoirs & Dams' },
                { key: 'tanks', label: 'Water Tanks' },
                { key: 'borewells', label: 'Borewells & Aquifers' },
                { key: 'groundwaterZones', label: 'Groundwater Zones' },
                { key: 'bufferZones', label: 'Waterbody Buffer Zones' },
                { key: 'floodRiskZones', label: 'Flood Risk Zones' },
                { key: 'encroachments', label: 'Encroachments' },
                { key: 'complaints', label: 'Citizen Complaints' },
                { key: 'wtp', label: 'Water Treatment Plants' },
              ] as const).map(({ key, label }) => (
                <label key={key} className="flex items-center justify-between cursor-pointer py-1 px-1 rounded hover:bg-slate-50">
                  <span className="text-slate-700">{label}</span>
                  <input
                    type="checkbox"
                    checked={layers[key]}
                    onChange={() => toggleLayer(key)}
                    className="w-4 h-4 rounded text-navy focus:ring-navy"
                  />
                </label>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Map + Selected Asset Split View */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 min-h-[460px]">
        {/* Leaflet Map container */}
        <div className="lg:col-span-2 relative rounded-2xl border border-slate-200 overflow-hidden min-h-[400px]">
          <div ref={mapContainerRef} className="w-full h-full min-h-[400px] z-10" />

          {/* Quick Map Legend */}
          <div className="absolute bottom-3 left-3 z-20 bg-white/90 backdrop-blur-xs px-3 py-2 rounded-xl border border-slate-200 text-[10px] text-slate-600 flex flex-wrap gap-3 font-semibold shadow-xs">
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#087F8C]" /> Reservoir</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#246BCE]" /> Lake</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#3B82F6]" /> Canal</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#10B981]" /> WTP</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#EF4444]" /> Encroachment</span>
          </div>
        </div>

        {/* Selected Asset Details Panel */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col justify-between space-y-4">
          {selectedAsset ? (
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-navy text-white uppercase tracking-wider">
                    {selectedAsset.type}
                  </span>
                  <h4 className="text-sm font-bold text-navy mt-1.5">{selectedAsset.name}</h4>
                  <p className="text-[11px] text-slate-500 font-mono mt-0.5">Asset ID: {selectedAsset.id}</p>
                </div>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                  selectedAsset.quality === 'GOOD'
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : selectedAsset.quality === 'MODERATE'
                    ? 'bg-amber-50 text-amber-700 border-amber-200'
                    : 'bg-red-50 text-red-700 border-red-200'
                }`}>
                  {selectedAsset.quality} QUALITY
                </span>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed bg-white p-3 rounded-xl border border-slate-200">
                {selectedAsset.details}
              </p>

              <div className="grid grid-cols-2 gap-2 text-xs">
                {selectedAsset.storagePercentage !== undefined && (
                  <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                    <span className="text-[10px] text-slate-400 font-semibold block">Storage Level</span>
                    <span className="text-sm font-bold text-navy">{selectedAsset.storagePercentage}%</span>
                  </div>
                )}
                <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                  <span className="text-[10px] text-slate-400 font-semibold block">Active Alerts</span>
                  <span className="text-sm font-bold text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" /> {selectedAsset.activeAlerts}
                  </span>
                </div>
                <div className="bg-white p-2.5 rounded-xl border border-slate-200 col-span-2 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 font-semibold block">Citizen Requests</span>
                    <span className="text-sm font-bold text-navy">{selectedAsset.citizenRequests} Requests</span>
                  </div>
                  <FileText className="w-5 h-5 text-tealAccent" />
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-slate-400 text-xs">
              <MapPin className="w-8 h-8 mx-auto mb-2 opacity-50" />
              Click any asset on the map to inspect storage, water quality, alerts and grievances.
            </div>
          )}

          {/* Action buttons */}
          <div className="space-y-2 pt-2 border-t border-slate-200">
            <button
              type="button"
              onClick={() => alert(`Opening technical registry extract for ${selectedAsset?.name}`)}
              className="w-full py-2 px-3 bg-navy text-white text-xs font-semibold rounded-xl hover:bg-navy/90 transition-colors flex items-center justify-between"
            >
              <span>View Asset Registry</span>
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => navigate('/government/requests')}
              className="w-full py-2 px-3 bg-white text-slate-700 border border-slate-300 text-xs font-semibold rounded-xl hover:bg-slate-100 transition-colors flex items-center justify-between"
            >
              <span>View Related Citizen Requests</span>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
