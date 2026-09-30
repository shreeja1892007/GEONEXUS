import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Info } from 'lucide-react';
import { CitizenLayout } from '../../components/layout/CitizenLayout';
import { ParcelMap } from '../../components/map/ParcelMap';
import { LayerPanel } from '../../components/map/LayerPanel';
import { ErodeParcelInfoPanel } from '../../components/map/ErodeParcelInfoPanel';
import { LiveErodeParcelSearch } from '../../components/parcel/LiveErodeParcelSearch';
import {
  getErodeParcelById,
  getErodeParcelsInBounds,
  type ErodeParcel,
  type MapBounds,
} from '../../services/erodeGisService';

export const ParcelExplorerPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [parcels, setParcels] = useState<ErodeParcel[]>([]);
  const [selectedParcel, setSelectedParcel] = useState<ErodeParcel | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [layerPanelOpen, setLayerPanelOpen] = useState(false);
  const [infoPanelOpen, setInfoPanelOpen] = useState(false);

  const [layerStates, setLayerStates] = useState<Record<string, boolean>>({
    cadastralParcels: true,
    parcelBoundaries: true,
    ulpin: true,
    surveyBoundaries: true,
    adminBoundaries: false,
    satellite: true,
    ror: true,
    registration: true,
    zoning: true,
    landUse: true,
    buildingPermissions: true,
    mortgages: false,
    encumbrances: false,
    disputes: true,
    propertyTax: true,
    roads: true,
    metro: false,
    electricity: false,
    water: false,
    sewerage: false,
    floodZones: false,
    environmental: false,
    heritage: false,
    acquisition: false,
    valuation: false,
  });

  const [layerOpacity, setLayerOpacity] = useState(0.62);

  const handleToggleLayer = useCallback((layerName: string) => {
    setLayerStates((previous) => ({
      ...previous,
      [layerName]: !previous[layerName],
    }));
  }, []);

  const handleBoundsChange = useCallback(async (bounds: MapBounds) => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await getErodeParcelsInBounds(bounds);
      setParcels(data);
      console.log('[Erode GIS] Viewport parcels:', data.length);
    } catch (err) {
      console.error('[Erode GIS] Viewport load failed:', err);
      setParcels([]);
      setError('Unable to load Erode parcel data from Supabase.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleSelectParcel = useCallback(
    (parcel: ErodeParcel) => {
      setSelectedParcel(parcel);
      setInfoPanelOpen(true);
      setSearchParams({ parcel: parcel.parcel_id }, { replace: true });
    },
    [setSearchParams]
  );

  const handleCloseInfoPanel = useCallback(() => {
    setInfoPanelOpen(false);
    setSelectedParcel(null);
    setSearchParams({}, { replace: true });
  }, [setSearchParams]);

  const parcelQuery = searchParams.get('parcel');

  useEffect(() => {
    if (!parcelQuery) return;

    let cancelled = false;

    const loadParcelFromUrl = async () => {
      try {
        const parcel = await getErodeParcelById(parcelQuery);
        if (!cancelled && parcel) {
          setSelectedParcel(parcel);
          setInfoPanelOpen(true);
        }
      } catch (err) {
        console.error('[Erode GIS] URL parcel lookup failed:', err);
      }
    };

    loadParcelFromUrl();

    return () => {
      cancelled = true;
    };
  }, [parcelQuery]);

  const mapParcels = useMemo(() => {
    if (!selectedParcel) return parcels;
    if (parcels.some((parcel) => parcel.parcel_id === selectedParcel.parcel_id)) {
      return parcels;
    }
    return [selectedParcel, ...parcels];
  }, [parcels, selectedParcel]);

  return (
    <CitizenLayout fullWidthContent>
      <div className="flex h-[calc(100vh-68px)] w-full overflow-hidden relative">
        <div className="hidden lg:flex flex-col w-[220px] xl:w-[240px] shrink-0 bg-white border-r border-slate-200 overflow-y-auto z-10">
          <LayerPanel
            layerStates={layerStates}
            onToggleLayer={handleToggleLayer}
            opacity={layerOpacity}
            onOpacityChange={setLayerOpacity}
          />
        </div>

        <div className="flex-1 relative min-w-0 flex flex-col">
          <div className="absolute top-3 left-3 right-3 z-[700] flex flex-col gap-2 pointer-events-none">
            <div className="flex items-start gap-2 pointer-events-auto">
              <button
                type="button"
                onClick={() => setLayerPanelOpen(true)}
                className="lg:hidden flex items-center justify-center w-10 h-10 bg-white border border-slate-200 rounded-xl shadow-md text-navy hover:bg-slate-50 transition-colors shrink-0"
                title="Layers"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-4.5 h-4.5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 2L2 7l10 5 10-5-10-5z" />
                  <path d="M2 17l10 5 10-5" />
                  <path d="M2 12l10 5 10-5" />
                </svg>
              </button>

              <div className="flex-1 max-w-lg">
                <LiveErodeParcelSearch
                  compact
                  onSelectParcel={handleSelectParcel}
                />
              </div>

              {selectedParcel && (
                <button
                  type="button"
                  onClick={() => setInfoPanelOpen((previous) => !previous)}
                  className="lg:hidden flex items-center justify-center w-10 h-10 bg-navy text-white rounded-xl shadow-md hover:bg-navy-light transition-colors shrink-0"
                  title="Parcel Details"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="pointer-events-none max-w-lg bg-white/90 backdrop-blur-xs border border-slate-200 shadow-sm rounded-xl px-3 py-1.5 flex items-center justify-between gap-4 text-[11px] text-navy font-semibold">
              <span>
                Viewport parcels: <strong>{parcels.length}</strong>
              </span>
              <span className="text-[10px] text-slate-500 font-medium flex items-center gap-1">
                <Info className="w-3 h-3 text-tealAccent" />
                Synthetic Erode dataset · PostGIS polygons
              </span>
            </div>
          </div>

          <div className="flex-1 w-full h-full">
            <ParcelMap
              parcels={mapParcels}
              selectedParcel={selectedParcel}
              onSelectParcel={handleSelectParcel}
              onBoundsChange={handleBoundsChange}
              isLoading={isLoading}
              error={error}
              showParcelsLayer={layerStates.cadastralParcels}
              showBoundariesLayer={layerStates.parcelBoundaries}
              showUlpinLayer={layerStates.ulpin}
              showSatelliteLayer={layerStates.satellite}
              layerOpacity={layerOpacity}
            />
          </div>
        </div>

        <div className="hidden lg:flex flex-col w-[260px] xl:w-[290px] shrink-0 overflow-y-auto z-10">
          <ErodeParcelInfoPanel
            selectedParcel={selectedParcel}
            onClose={handleCloseInfoPanel}
          />
        </div>

        {layerPanelOpen && (
          <div className="lg:hidden fixed inset-0 z-[1200] flex">
            <div
              className="fixed inset-0 bg-navy/50 backdrop-blur-xs"
              onClick={() => setLayerPanelOpen(false)}
            />
            <div className="relative w-72 max-w-[85vw] bg-white shadow-2xl z-50 overflow-y-auto animate-in slide-in-from-left duration-200">
              <div className="flex items-center justify-between p-4 border-b border-slate-100">
                <span className="text-sm font-bold text-navy">Map Layers</span>
                <button
                  type="button"
                  onClick={() => setLayerPanelOpen(false)}
                  className="p-1 text-slate-400 hover:text-slate-700 rounded-lg"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
              </div>
              <LayerPanel
                layerStates={layerStates}
                onToggleLayer={handleToggleLayer}
                opacity={layerOpacity}
                onOpacityChange={setLayerOpacity}
              />
            </div>
          </div>
        )}

        {infoPanelOpen && selectedParcel && (
          <div className="lg:hidden fixed inset-x-0 bottom-0 z-[1200] max-h-[70vh] flex flex-col">
            <div
              className="fixed inset-0 bg-navy/30 backdrop-blur-xs"
              onClick={() => setInfoPanelOpen(false)}
            />
            <div className="relative bg-white rounded-t-2xl shadow-2xl overflow-hidden z-50 animate-in slide-in-from-bottom duration-200 flex flex-col max-h-[70vh]">
              <div className="shrink-0 flex justify-center pt-3 pb-1">
                <div className="w-10 h-1 bg-slate-300 rounded-full" />
              </div>
              <div className="flex-1 overflow-y-auto">
                <ErodeParcelInfoPanel
                  selectedParcel={selectedParcel}
                  onClose={handleCloseInfoPanel}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </CitizenLayout>
  );
};
