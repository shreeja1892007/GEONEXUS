import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  ChevronRight,
  Database,
  Filter,
  Info,
  Layers,
  Loader2,
  MapPin,
  Orbit,
  ShieldCheck,
  X,
} from 'lucide-react';
import { GovernmentLayout } from '../../components/layout/GovernmentLayout';
import { ParcelMap } from '../../components/map/ParcelMap';
import { WaterResourcesGISMap } from '../../components/government/water/WaterResourcesGISMap';
import { LiveErodeParcelSearch } from '../../components/parcel/LiveErodeParcelSearch';
import { useAuth } from '../../context/AuthContext';
import { getDepartmentGISConfig } from '../../config/departmentGISLayers';
import {
  getErodeParcel360Details,
  getErodeParcelById,
  getErodeParcelsInBounds,
  type ErodeParcel,
  type ErodeParcel360Details,
  type MapBounds,
  type Parcel360Record,
} from '../../services/erodeGisService';

const valueText = (
  record: Parcel360Record | null | undefined,
  key: string,
  fallback = 'N/A'
): string => {
  if (!record) return fallback;
  const value = record[key];
  if (value === null || value === undefined || value === '') return fallback;
  if (typeof value === 'boolean') return value ? 'Yes' : 'No';
  return String(value);
};

const formatArea = (value: number | null): string =>
  value === null ? 'N/A' : `${Number(value).toLocaleString('en-IN')} m²`;

const formatMoney = (value: unknown): string => {
  const amount = Number(value);
  if (!Number.isFinite(amount)) return 'N/A';
  return `₹${amount.toLocaleString('en-IN')}`;
};

interface InspectionField {
  label: string;
  value: string;
  badgeClass?: string;
}

export const GovernmentGISExplorer: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { currentGovUser } = useAuth();

  const [parcels, setParcels] = useState<ErodeParcel[]>([]);
  const [selectedParcel, setSelectedParcel] = useState<ErodeParcel | null>(null);
  const [parcel360, setParcel360] = useState<ErodeParcel360Details | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const officerName = currentGovUser?.fullName || 'Government Officer';
  const officerRole = currentGovUser?.officialRole || 'Official';
  const departmentName =
    currentGovUser?.department || 'Department of Land Resources';
  const districtName = currentGovUser?.districtOffice || 'District Office';
  const stateName = currentGovUser?.state || 'Tamil Nadu';

  const isWaterDepartment = departmentName === 'Water Resources Department';
  const deptGISConfig = getDepartmentGISConfig(departmentName);

  const [layerStates, setLayerStates] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {
      satellite: true,
      parcelBoundaries: true,
      cadastralParcels: true,
      ulpin: true,
    };
    deptGISConfig.layers.forEach((layer) => {
      // Parcel polygons are a core government GIS layer and should be visible
      // when the explorer first opens, regardless of department defaults.
      initial[layer.id] =
        layer.id === 'parcelBoundaries' || layer.id === 'cadastralParcels'
          ? true
          : layer.defaultOn;
    });
    return initial;
  });

  useEffect(() => {
    setLayerStates((previous) => {
      const next: Record<string, boolean> = {
        satellite: previous.satellite ?? true,
        parcelBoundaries: previous.parcelBoundaries ?? true,
        cadastralParcels: previous.cadastralParcels ?? true,
        ulpin: previous.ulpin ?? true,
      };
      deptGISConfig.layers.forEach((layer) => {
        const fallback =
          layer.id === 'parcelBoundaries' || layer.id === 'cadastralParcels'
            ? true
            : layer.defaultOn;
        next[layer.id] = previous[layer.id] ?? fallback;
      });
      return next;
    });
  }, [departmentName]); // eslint-disable-line react-hooks/exhaustive-deps

  const toggleLayer = useCallback((layerId: string) => {
    setLayerStates((previous) => ({
      ...previous,
      [layerId]: !previous[layerId],
    }));
  }, []);

  const handleBoundsChange = useCallback(async (bounds: MapBounds) => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await getErodeParcelsInBounds(bounds);
      setParcels(data);
      console.log('[Government Erode GIS] Viewport parcels:', data.length);
    } catch (err) {
      console.error('[Government Erode GIS] Viewport load failed:', err);
      setParcels([]);
      setError('Unable to load Erode parcel data from Supabase.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleSelectParcel = useCallback(
    (parcel: ErodeParcel) => {
      setSelectedParcel(parcel);
      setSearchParams({ parcel: parcel.parcel_id }, { replace: true });
    },
    [setSearchParams]
  );

  const handleCloseParcel = useCallback(() => {
    setSelectedParcel(null);
    setParcel360(null);
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
        }
      } catch (err) {
        console.error('[Government Erode GIS] URL parcel lookup failed:', err);
      }
    };

    loadParcelFromUrl();

    return () => {
      cancelled = true;
    };
  }, [parcelQuery]);

  useEffect(() => {
    if (!selectedParcel) {
      setParcel360(null);
      return;
    }

    let cancelled = false;

    const loadIntegratedDetails = async () => {
      setDetailsLoading(true);
      try {
        const details = await getErodeParcel360Details(selectedParcel.parcel_id);
        if (!cancelled) setParcel360(details);
      } catch (err) {
        console.error('[Government Erode GIS] Parcel 360 load failed:', err);
        if (!cancelled) setParcel360(null);
      } finally {
        if (!cancelled) setDetailsLoading(false);
      }
    };

    loadIntegratedDetails();

    return () => {
      cancelled = true;
    };
  }, [selectedParcel]);

  const mapParcels = useMemo(() => {
    if (!selectedParcel) return parcels;
    if (parcels.some((parcel) => parcel.parcel_id === selectedParcel.parcel_id)) {
      return parcels;
    }
    return [selectedParcel, ...parcels];
  }, [parcels, selectedParcel]);

  const parcelLayerEnabled =
    layerStates.parcelBoundaries !== false &&
    layerStates.cadastralParcels !== false;
  const labelsEnabled = layerStates.ulpin !== false;

  const inspectionFields = useMemo<InspectionField[]>(() => {
    if (!parcel360) return [];

    const department = departmentName.toLowerCase();
    const utility = parcel360.utility_infrastructure;
    const masterPlan = parcel360.master_plan;
    const landUse = parcel360.land_use;
    const latestTax = parcel360.property_tax[0];
    const latestRegistration = parcel360.registrations[0];
    const latestRoR = parcel360.record_of_rights[0];

    if (department.includes('electricity')) {
      return [
        {
          label: 'Electricity Available',
          value: valueText(utility, 'electricity_available'),
          badgeClass:
            utility?.electricity_available === true
              ? 'bg-emerald-100 text-emerald-700'
              : 'bg-slate-100 text-slate-600',
        },
        {
          label: 'Connection Type',
          value: valueText(utility, 'electricity_connection_type'),
        },
        {
          label: 'Electricity Meter ID',
          value: valueText(utility, 'electricity_meter_id'),
        },
        {
          label: 'Utility Status',
          value: valueText(utility, 'utility_status'),
        },
        {
          label: 'Last Inspection',
          value: valueText(utility, 'last_inspection_date'),
        },
      ];
    }

    if (department.includes('water')) {
      return [
        { label: 'Water Connection', value: valueText(utility, 'water_connection') },
        {
          label: 'Drainage Connection',
          value: valueText(utility, 'drainage_connection'),
        },
        { label: 'Water Meter ID', value: valueText(utility, 'water_meter_id') },
        { label: 'Utility Status', value: valueText(utility, 'utility_status') },
        {
          label: 'Last Inspection',
          value: valueText(utility, 'last_inspection_date'),
        },
      ];
    }

    if (department.includes('registration')) {
      return [
        {
          label: 'Registration Records',
          value: String(parcel360.registrations.length),
        },
        {
          label: 'Latest Registration',
          value: valueText(latestRegistration, 'registration_number'),
        },
        {
          label: 'Registration Status',
          value: valueText(latestRegistration, 'registration_status'),
        },
        {
          label: 'Encumbrances',
          value: String(parcel360.encumbrances.length),
        },
        { label: 'Mortgages', value: String(parcel360.mortgages.length) },
      ];
    }

    if (department.includes('revenue')) {
      return [
        { label: 'RoR Records', value: String(parcel360.record_of_rights.length) },
        { label: 'RoR Status', value: valueText(latestRoR, 'ror_status') },
        { label: 'Tenure Type', value: valueText(latestRoR, 'tenure_type') },
        {
          label: 'Possession Status',
          value: valueText(latestRoR, 'possession_status'),
        },
        { label: 'Restrictions', value: String(parcel360.restrictions.length) },
      ];
    }

    if (
      department.includes('planning') ||
      department.includes('town') ||
      department.includes('municipal')
    ) {
      return [
        { label: 'Zone', value: valueText(masterPlan, 'zone_id') },
        { label: 'Permitted Use', value: valueText(masterPlan, 'permitted_use') },
        {
          label: 'Floor Area Ratio',
          value: valueText(masterPlan, 'floor_area_ratio'),
        },
        {
          label: 'Maximum Height',
          value:
            valueText(masterPlan, 'maximum_height') === 'N/A'
              ? 'N/A'
              : `${valueText(masterPlan, 'maximum_height')} m`,
        },
        {
          label: 'Building Permissions',
          value: String(parcel360.building_permissions.length),
        },
      ];
    }

    if (department.includes('tax')) {
      return [
        { label: 'Assessment Year', value: valueText(latestTax, 'assessment_year') },
        { label: 'Property Type', value: valueText(latestTax, 'property_type') },
        { label: 'Annual Tax', value: formatMoney(latestTax?.annual_tax) },
        { label: 'Tax Due', value: formatMoney(latestTax?.tax_due) },
        { label: 'Tax Status', value: valueText(latestTax, 'tax_status') },
      ];
    }

    return [
      { label: 'RoR Records', value: String(parcel360.record_of_rights.length) },
      { label: 'Registrations', value: String(parcel360.registrations.length) },
      { label: 'Land Use', value: valueText(landUse, 'current_land_use') },
      {
        label: 'Building Permissions',
        value: String(parcel360.building_permissions.length),
      },
      { label: 'Mortgages', value: String(parcel360.mortgages.length) },
      { label: 'Encumbrances', value: String(parcel360.encumbrances.length) },
      { label: 'Data Conflicts', value: String(parcel360.data_conflicts.length) },
    ];
  }, [departmentName, parcel360]);

  const area = selectedParcel
    ? selectedParcel.area_sq_m ?? selectedParcel.cadastral_area_sq_m
    : null;

  return (
    <GovernmentLayout>
      <div className="space-y-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col xl:flex-row items-start xl:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-navy text-white flex items-center justify-center shrink-0 shadow-sm">
              <Layers className="w-6 h-6 text-tealAccent-light" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-lg font-bold text-navy tracking-tight">
                  GOVERNMENT GIS EXPLORER
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-navy/10 text-navy border border-navy/20">
                  {departmentName}
                </span>
              </div>
              <p className="text-xs font-semibold text-slate-600 mt-0.5">
                {districtName}, {stateName} ·{' '}
                <span className="text-tealAccent">{officerRole}</span> ({officerName})
              </p>
              <p className="text-[10px] text-slate-400 mt-1">
                Map dataset: Synthetic Erode District land-governance dataset
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="px-3 py-1.5 rounded-xl bg-blue-50 text-primaryBlue font-semibold border border-blue-200 flex items-center gap-1.5">
              <Database className="w-4 h-4" />
              Live PostGIS · {parcels.length} in viewport
            </span>
            <span className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" />
              Integrated Land Record View
            </span>
          </div>
        </div>

        <div className="bg-amber-50/80 border border-amber-200 rounded-xl px-4 py-2.5 text-xs text-amber-800 flex items-start gap-2">
          <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <span>
            <strong>Dataset note:</strong> this government GIS is displaying the same
            synthetic Erode parcel polygons and integrated records used by the citizen GIS.
          </span>
        </div>

        {isWaterDepartment && (
          <div className="mb-4">
            <WaterResourcesGISMap />
          </div>
        )}

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col lg:flex-row min-h-[620px] relative">
          <div className="w-full lg:w-64 border-b lg:border-b-0 lg:border-r border-slate-200 bg-slate-50/50 p-4 space-y-4 shrink-0 overflow-y-auto max-h-[680px]">
            <div className="flex items-center justify-between border-b pb-2 border-slate-200">
              <span className="text-xs font-bold text-navy uppercase tracking-wider flex items-center gap-1.5">
                <Filter className="w-3.5 h-3.5 text-primaryBlue" />
                {departmentName} Layers
              </span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-200 text-slate-700">
                {Object.values(layerStates).filter(Boolean).length} Active
              </span>
            </div>

            <div className="space-y-1.5 text-xs">
              <label className="flex items-center justify-between p-2 rounded-xl bg-white border border-slate-200 hover:border-slate-300 cursor-pointer transition-colors">
                <span className="font-semibold text-slate-700 text-[11px]">
                  Satellite Imagery
                </span>
                <input
                  type="checkbox"
                  checked={!!layerStates.satellite}
                  onChange={() => toggleLayer('satellite')}
                  className="w-4 h-4 rounded text-navy focus:ring-navy"
                />
              </label>

              {deptGISConfig.layers.map((layer) => (
                <label
                  key={layer.id}
                  className="flex items-center justify-between p-2 rounded-xl bg-white border border-slate-200 hover:border-slate-300 cursor-pointer transition-colors"
                >
                  <span className="font-semibold text-slate-700 text-[11px]">
                    {layer.label}
                  </span>
                  <input
                    type="checkbox"
                    checked={!!layerStates[layer.id]}
                    onChange={() => toggleLayer(layer.id)}
                    className="w-4 h-4 rounded text-navy focus:ring-navy"
                  />
                </label>
              ))}
            </div>
          </div>

          <div className="flex-1 relative min-w-0 flex flex-col min-h-[540px]">
            <div className="absolute top-3 left-3 right-3 z-[700] flex flex-col gap-2 pointer-events-none">
              <div className="max-w-xl pointer-events-auto">
                <LiveErodeParcelSearch
                  compact
                  onSelectParcel={handleSelectParcel}
                />
              </div>

              <div className="pointer-events-none max-w-xl bg-white/90 backdrop-blur-xs border border-slate-200 shadow-sm rounded-xl px-3 py-1.5 flex flex-wrap items-center justify-between gap-2 text-[11px]">
                <span className="font-semibold text-navy">
                  Viewport parcels: <strong>{parcels.length}</strong>
                </span>
                <span className="text-slate-500 font-medium flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-tealAccent" />
                  Erode · PostGIS polygons
                </span>
              </div>
            </div>

            <div className="flex-1 w-full h-full min-h-[520px]">
              <ParcelMap
                parcels={mapParcels}
                selectedParcel={selectedParcel}
                onSelectParcel={handleSelectParcel}
                onBoundsChange={handleBoundsChange}
                isLoading={isLoading}
                error={error}
                showParcelsLayer={parcelLayerEnabled}
                showBoundariesLayer={true}
                showUlpinLayer={labelsEnabled}
                showSatelliteLayer={!!layerStates.satellite}
                layerOpacity={0.55}
              />
            </div>
          </div>

          <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-slate-200 bg-white p-4 space-y-4 shrink-0 overflow-y-auto max-h-[680px]">
            <div className="flex items-center justify-between border-b pb-2 border-slate-100">
              <span className="text-xs font-bold text-navy uppercase tracking-wider">
                Parcel Inspection
              </span>
              {selectedParcel && (
                <button
                  type="button"
                  onClick={handleCloseParcel}
                  className="p-1 rounded text-slate-400 hover:text-slate-700"
                  aria-label="Close parcel inspection"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {!selectedParcel ? (
              <div className="py-16 text-center">
                <div className="w-14 h-14 mx-auto rounded-2xl bg-slate-100 flex items-center justify-center mb-3">
                  <MapPin className="w-6 h-6 text-slate-400" />
                </div>
                <p className="text-sm font-semibold text-slate-600">
                  Select an Erode parcel
                </p>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Click a parcel polygon or search by survey number, parcel ID, or village.
                </p>
              </div>
            ) : (
              <>
                <div className="space-y-2 text-xs">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-[10px] text-slate-400 font-bold block uppercase">
                      Parcel ID
                    </span>
                    <span className="text-xs font-mono font-bold text-primaryBlue break-all">
                      {selectedParcel.parcel_id}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                      <span className="text-[10px] text-slate-400 font-semibold block">
                        Survey No
                      </span>
                      <span className="font-bold text-navy">
                        {selectedParcel.survey_number}
                      </span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                      <span className="text-[10px] text-slate-400 font-semibold block">
                        Area
                      </span>
                      <span className="font-bold text-navy">{formatArea(area)}</span>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-[10px] text-slate-400 font-semibold block">
                      Location
                    </span>
                    <span className="font-semibold text-slate-700">
                      {selectedParcel.village || 'Village N/A'}
                      {selectedParcel.taluk ? `, ${selectedParcel.taluk}` : ''}, Erode,
                      Tamil Nadu
                    </span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between gap-3">
                    <span className="text-slate-500 font-semibold">Land Use</span>
                    <span className="font-bold text-navy text-right">
                      {selectedParcel.current_land_use || 'N/A'}
                    </span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between gap-3">
                    <span className="text-slate-500 font-semibold">Zone</span>
                    <span className="font-bold text-navy">
                      {selectedParcel.zone || 'N/A'}
                    </span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between gap-3">
                    <span className="text-slate-500 font-semibold">Parcel Status</span>
                    <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-emerald-100 text-emerald-700">
                      {selectedParcel.parcel_status || 'Active'}
                    </span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between gap-3">
                    <span className="text-slate-500 font-semibold">Boundary</span>
                    <span className="font-bold text-emerald-700">
                      {selectedParcel.geometry ? 'PostGIS polygon' : 'Unavailable'}
                    </span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 space-y-2">
                  <span className="text-[11px] font-bold text-navy uppercase tracking-wider block">
                    {departmentName} Inspection Data
                  </span>

                  {detailsLoading ? (
                    <div className="flex items-center gap-2 p-3 rounded-xl bg-blue-50 border border-blue-100 text-xs text-slate-600">
                      <Loader2 className="w-4 h-4 animate-spin text-primaryBlue" />
                      Loading integrated parcel records...
                    </div>
                  ) : (
                    <div className="space-y-1.5 text-xs">
                      {inspectionFields.map((field) => (
                        <div
                          key={field.label}
                          className="p-2.5 rounded-xl bg-blue-50/60 border border-blue-100 space-y-0.5"
                        >
                          <span className="text-[10px] font-semibold text-slate-500 block">
                            {field.label}
                          </span>
                          <span
                            className={`inline-block font-bold text-navy ${
                              field.badgeClass
                                ? `px-1.5 py-0.5 text-[10px] rounded ${field.badgeClass}`
                                : ''
                            }`}
                          >
                            {field.value}
                          </span>
                        </div>
                      ))}

                      {!parcel360 && (
                        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-500">
                          No integrated record was returned for this parcel.
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {parcel360 && (
                  <div className="pt-2 border-t border-slate-100">
                    <span className="text-[11px] font-bold text-navy uppercase tracking-wider block mb-2">
                      Integrated Record Coverage
                    </span>
                    <div className="grid grid-cols-2 gap-2 text-[10px]">
                      <Coverage label="RoR" count={parcel360.record_of_rights.length} />
                      <Coverage label="Registration" count={parcel360.registrations.length} />
                      <Coverage label="Permissions" count={parcel360.building_permissions.length} />
                      <Coverage label="Tax" count={parcel360.property_tax.length} />
                      <Coverage label="Mortgage" count={parcel360.mortgages.length} />
                      <Coverage label="Encumbrance" count={parcel360.encumbrances.length} />
                    </div>
                  </div>
                )}

                <div className="pt-2 border-t border-slate-100 space-y-2">
                  <Link
                    to={`/government/parcel/${encodeURIComponent(selectedParcel.parcel_id)}/360`}
                    className="w-full py-2.5 px-3 bg-tealAccent text-white text-xs font-bold rounded-xl hover:opacity-90 transition-all flex items-center justify-between shadow-sm"
                  >
                    <span className="flex items-center gap-2">
                      <Orbit className="w-4 h-4" />
                      OPEN PARCEL 360°
                    </span>
                    <ChevronRight className="w-4 h-4" />
                  </Link>

                  <Link
                    to="/government/requests"
                    className="w-full py-2 px-3 bg-navy text-white text-xs font-semibold rounded-xl hover:bg-navy/90 transition-colors flex items-center justify-between"
                  >
                    <span>View Related Citizen Requests</span>
                    <ChevronRight className="w-4 h-4 text-tealAccent" />
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </GovernmentLayout>
  );
};

const Coverage: React.FC<{ label: string; count: number }> = ({ label, count }) => (
  <div className="rounded-lg border border-slate-200 bg-slate-50 px-2 py-1.5 flex items-center justify-between gap-2">
    <span className="text-slate-500 font-semibold">{label}</span>
    <span
      className={`font-bold ${count > 0 ? 'text-emerald-700' : 'text-slate-400'}`}
    >
      {count}
    </span>
  </div>
);

export default GovernmentGISExplorer;
