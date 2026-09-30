import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { AlertCircle, Loader2 } from 'lucide-react';
import type {
  ErodeParcel,
  MapBounds,
} from '../../services/erodeGisService';
import type { Parcel } from '../../types/parcel';
import 'leaflet/dist/leaflet.css';

interface ParcelMapProps {
  parcels: (ErodeParcel | Parcel)[];
  selectedParcel: ErodeParcel | Parcel | null;
  onSelectParcel: (parcel: any) => void;
  onBoundsChange?: (bounds: MapBounds) => void;
  isLoading?: boolean;
  error?: string | null;
  showParcelsLayer?: boolean;
  showBoundariesLayer?: boolean;
  showUlpinLayer?: boolean;
  showSatelliteLayer?: boolean;
  layerOpacity?: number;
}

const STREET_TILE_URL = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
const SATELLITE_TILE_URL =
  'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
const SATELLITE_ROADS_TILE_URL =
  'https://services.arcgisonline.com/ArcGIS/rest/services/Reference/World_Transportation/MapServer/tile/{z}/{y}/{x}';
const SATELLITE_LABELS_TILE_URL =
  'https://services.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}';

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

const isErodeParcel = (parcel: ErodeParcel | Parcel): parcel is ErodeParcel =>
  'parcel_id' in parcel && 'survey_number' in parcel;

const escapeHtml = (value: unknown): string =>
  String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');

export const ParcelMap: React.FC<ParcelMapProps> = ({
  parcels,
  selectedParcel,
  onSelectParcel,
  onBoundsChange,
  isLoading = false,
  error = null,
  showParcelsLayer = true,
  showBoundariesLayer = true,
  showUlpinLayer = true,
  showSatelliteLayer = false,
  layerOpacity = 0.5,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const baseLayerRef = useRef<L.TileLayer | null>(null);
  const transportLayerRef = useRef<L.TileLayer | null>(null);
  const referenceLayerRef = useRef<L.TileLayer | null>(null);
  const parcelLayersRef = useRef<Record<string, L.GeoJSON>>({});
  const labelLayersRef = useRef<Record<string, L.Marker>>({});
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const initialLoadTimersRef = useRef<number[]>([]);
  const onBoundsChangeRef = useRef(onBoundsChange);

  useEffect(() => {
    onBoundsChangeRef.current = onBoundsChange;
  }, [onBoundsChange]);

  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [11.3889, 77.5071],
      zoom: 10,
      minZoom: 4,
      maxZoom: 19,
      worldCopyJump: true,
      zoomControl: true,
      attributionControl: true,
    });

    map.createPane('transportPane');
    const transportPane = map.getPane('transportPane');
    if (transportPane) {
      transportPane.style.zIndex = '430';
      transportPane.style.pointerEvents = 'none';
    }

    map.createPane('referencePane');
    const referencePane = map.getPane('referencePane');
    if (referencePane) {
      referencePane.style.zIndex = '450';
      referencePane.style.pointerEvents = 'none';
    }

    baseLayerRef.current = L.tileLayer(STREET_TILE_URL, {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap contributors | GeoNexus GIS',
    }).addTo(map);

    L.control.scale({ imperial: false, position: 'bottomleft' }).addTo(map);

    mapInstanceRef.current = map;

    const triggerBoundsUpdate = () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      debounceTimerRef.current = setTimeout(() => {
        const currentMap = mapInstanceRef.current;
        const callback = onBoundsChangeRef.current;
        if (!currentMap || !callback) return;

        const bounds = currentMap.getBounds();
        callback({
          west: bounds.getWest(),
          south: bounds.getSouth(),
          east: bounds.getEast(),
          north: bounds.getNorth(),
        });
      }, 300);
    };

    map.on('moveend', triggerBoundsUpdate);
    map.on('zoomend', triggerBoundsUpdate);

    // Load parcels immediately after the Leaflet container settles.
    // The second pass fixes dashboards where the map receives its final width
    // a little later because sidebars/layouts are still rendering.
    const initialLoadDelays = [100, 450, 1000];
    initialLoadTimersRef.current = initialLoadDelays.map((delay) =>
      window.setTimeout(() => {
        map.invalidateSize();
        triggerBoundsUpdate();
      }, delay)
    );

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      initialLoadTimersRef.current.forEach((timer) => window.clearTimeout(timer));
      initialLoadTimersRef.current = [];
      map.off('moveend', triggerBoundsUpdate);
      map.off('zoomend', triggerBoundsUpdate);
      map.remove();
      mapInstanceRef.current = null;
      baseLayerRef.current = null;
      transportLayerRef.current = null;
      referenceLayerRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (baseLayerRef.current) {
      map.removeLayer(baseLayerRef.current);
    }
    if (transportLayerRef.current) {
      map.removeLayer(transportLayerRef.current);
      transportLayerRef.current = null;
    }
    if (referenceLayerRef.current) {
      map.removeLayer(referenceLayerRef.current);
      referenceLayerRef.current = null;
    }

    baseLayerRef.current = L.tileLayer(
      showSatelliteLayer ? SATELLITE_TILE_URL : STREET_TILE_URL,
      {
        maxZoom: 19,
        attribution: showSatelliteLayer
          ? 'Imagery &copy; Esri'
          : '&copy; OpenStreetMap contributors | GeoNexus GIS',
      }
    ).addTo(map);

    if (showSatelliteLayer) {
      // Hybrid reference layers keep the satellite basemap readable by
      // overlaying roads plus state/city/place labels and boundaries.
      transportLayerRef.current = L.tileLayer(SATELLITE_ROADS_TILE_URL, {
        pane: 'transportPane',
        maxZoom: 19,
        opacity: 0.9,
        attribution: 'Roads &copy; Esri, HERE, Garmin, OpenStreetMap contributors',
      }).addTo(map);

      referenceLayerRef.current = L.tileLayer(SATELLITE_LABELS_TILE_URL, {
        pane: 'referencePane',
        maxZoom: 19,
        opacity: 1,
        attribution: 'Reference &copy; Esri',
      }).addTo(map);
    }

    baseLayerRef.current.bringToBack();
  }, [showSatelliteLayer]);

  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    Object.values(parcelLayersRef.current).forEach((layer) => map.removeLayer(layer));
    Object.values(labelLayersRef.current).forEach((layer) => map.removeLayer(layer));
    parcelLayersRef.current = {};
    labelLayersRef.current = {};

    if (!showParcelsLayer) return;

    parcels.forEach((parcel) => {
      if (isErodeParcel(parcel)) {
        if (!parcel.geometry) return;

        const selected =
          selectedParcel &&
          isErodeParcel(selectedParcel) &&
          selectedParcel.parcel_id === parcel.parcel_id;
        const landUse = parcel.current_land_use || 'Unclassified';
        const fillColor = LAND_USE_COLORS[landUse] || '#246BCE';

        const boundaryColor = showSatelliteLayer ? '#F8FAFC' : '#173B57';
        const selectedBoundaryColor = showSatelliteLayer ? '#FACC15' : '#0F2942';

        const geoJsonLayer = L.geoJSON(parcel.geometry as any, {
          style: {
            color: selected
              ? selectedBoundaryColor
              : showBoundariesLayer
                ? boundaryColor
                : 'transparent',
            weight: selected ? 4 : showSatelliteLayer ? 1.8 : 1.4,
            opacity: selected ? 1 : showSatelliteLayer ? 0.95 : 0.85,
            fillColor,
            fillOpacity: selected
              ? showSatelliteLayer
                ? 0.38
                : Math.min(0.8, Math.max(0.5, layerOpacity + 0.15))
              : showSatelliteLayer
                ? Math.min(0.38, Math.max(0.2, layerOpacity * 0.5))
                : Math.min(0.75, Math.max(0.18, layerOpacity)),
            dashArray: selected ? undefined : showSatelliteLayer ? undefined : '2,3',
          },
        }).addTo(map);

        geoJsonLayer.eachLayer((layer) => {
          layer.on('click', () => onSelectParcel(parcel));
          layer.bindTooltip(
            `<div style="font-family:sans-serif;font-size:12px;line-height:1.4">
              <strong>Survey ${escapeHtml(parcel.survey_number)}</strong><br/>
              ${escapeHtml(landUse)} &bull; ${escapeHtml(parcel.village || 'Erode')}
            </div>`,
            { direction: 'top', sticky: true }
          );
        });

        parcelLayersRef.current[parcel.parcel_id] = geoJsonLayer;

        if (
          showUlpinLayer &&
          map.getZoom() >= 14 &&
          parcel.latitude !== null &&
          parcel.longitude !== null
        ) {
          const icon = L.divIcon({
            className: 'bg-transparent',
            html: `<div style="padding:2px 5px;border-radius:5px;background:rgba(255,255,255,.88);border:1px solid rgba(23,59,87,.2);font-size:10px;font-weight:700;color:#173B57;white-space:nowrap;box-shadow:0 1px 4px rgba(0,0,0,.12)">${escapeHtml(parcel.survey_number)}</div>`,
            iconSize: [55, 18],
            iconAnchor: [27, 9],
          });

          const marker = L.marker(
            [Number(parcel.latitude), Number(parcel.longitude)],
            { icon, interactive: false }
          ).addTo(map);

          labelLayersRef.current[parcel.parcel_id] = marker;
        }

        return;
      }

      // Backward compatibility for older mock Parcel objects used elsewhere.
      const selected =
        selectedParcel &&
        !isErodeParcel(selectedParcel) &&
        selectedParcel.ulpin === parcel.ulpin;
      const fillColor = LAND_USE_COLORS[parcel.landUse] || '#246BCE';

      const mockLayer = L.geoJSON(
        {
          type: 'Polygon',
          coordinates: [[...parcel.polygon.map(([lat, lng]) => [lng, lat]), [parcel.polygon[0][1], parcel.polygon[0][0]]]],
        } as any,
        {
          style: {
            color: selected
              ? '#0F2942'
              : showBoundariesLayer
                ? '#173B57'
                : 'transparent',
            weight: selected ? 3.5 : 1.2,
            fillColor,
            fillOpacity: selected ? 0.75 : layerOpacity,
            dashArray: selected ? undefined : '2,3',
          },
        }
      ).addTo(map);

      mockLayer.eachLayer((layer) => {
        layer.on('click', () => onSelectParcel(parcel));
        layer.bindTooltip(
          `<div><strong>Survey ${escapeHtml(parcel.surveyNumber)}</strong><br/>${escapeHtml(parcel.landUse)} &bull; ${escapeHtml(parcel.area)} m²</div>`,
          { direction: 'top', sticky: true }
        );
      });

      parcelLayersRef.current[parcel.ulpin] = mockLayer;

      if (showUlpinLayer && map.getZoom() >= 14) {
        const icon = L.divIcon({
          className: 'bg-transparent',
          html: `<div style="padding:2px 5px;border-radius:5px;background:rgba(255,255,255,.88);border:1px solid rgba(23,59,87,.2);font-size:10px;font-weight:700;color:#173B57;white-space:nowrap">${escapeHtml(parcel.surveyNumber)}</div>`,
          iconSize: [55, 18],
          iconAnchor: [27, 9],
        });
        labelLayersRef.current[parcel.ulpin] = L.marker(parcel.center, {
          icon,
          interactive: false,
        }).addTo(map);
      }
    });
  }, [
    parcels,
    selectedParcel,
    onSelectParcel,
    showParcelsLayer,
    showBoundariesLayer,
    showUlpinLayer,
    showSatelliteLayer,
    layerOpacity,
  ]);

  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !selectedParcel) return;

    if (isErodeParcel(selectedParcel)) {
      const lat = Number(selectedParcel.latitude);
      const lng = Number(selectedParcel.longitude);

      if (Number.isFinite(lat) && Number.isFinite(lng)) {
        map.flyTo([lat, lng], Math.max(map.getZoom(), 16), {
          duration: 0.8,
        });
      }
      return;
    }

    map.flyTo(selectedParcel.center, Math.max(map.getZoom(), 16), {
      duration: 0.8,
    });
  }, [selectedParcel]);

  return (
    <div className="relative w-full h-full min-h-[450px] overflow-hidden border border-slate-200 shadow-card">
      <div ref={mapContainerRef} className="absolute inset-0 w-full h-full z-0" />

      <div className="absolute bottom-2 left-2 z-[500] pointer-events-none bg-white/90 backdrop-blur-xs px-2.5 py-1 rounded-lg border border-slate-200/80 text-[10px] text-slate-600 font-medium shadow-xs">
        <span className="text-navy font-bold">GeoNexus GIS</span> · Erode District ·
        PostGIS parcel polygons
      </div>

      <div className="absolute bottom-9 right-3 z-[500] w-[220px] rounded-xl border border-slate-200 bg-white/95 p-3 shadow-lg backdrop-blur-sm">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-[10px] font-bold uppercase tracking-wider text-navy">Land Use Legend</span>
          <span className="text-[9px] font-semibold text-slate-400">Erode</span>
        </div>
        <div className="grid grid-cols-2 gap-x-3 gap-y-1.5">
          {Object.entries(LAND_USE_COLORS).map(([label, color]) => (
            <div key={label} className="flex min-w-0 items-center gap-1.5">
              <span
                className="h-2.5 w-2.5 shrink-0 rounded-sm border border-black/10"
                style={{ backgroundColor: color }}
              />
              <span className="truncate text-[9px] font-medium text-slate-600">
                {label}
              </span>
            </div>
          ))}
        </div>
        <div className="mt-2 border-t border-slate-100 pt-2 text-[9px] leading-4 text-slate-500">
          {showSatelliteLayer
            ? 'Satellite + roads + place/state labels'
            : 'Street basemap + parcel polygons'}
        </div>
      </div>

      {isLoading && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 z-[600] pointer-events-none">
          <div className="flex items-center gap-2 bg-white/95 border border-slate-200 shadow-lg rounded-xl px-4 py-2.5">
            <Loader2 className="w-4 h-4 text-primaryBlue animate-spin" />
            <span className="text-xs font-semibold text-slate-700">
              Loading Erode parcels...
            </span>
          </div>
        </div>
      )}

      {error && (
        <div className="absolute bottom-6 right-3 z-[600] max-w-sm">
          <div className="flex items-start gap-2 bg-red-50 border border-red-200 shadow-lg rounded-xl px-4 py-3">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <span className="text-xs font-medium text-red-700">{error}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ParcelMap;
