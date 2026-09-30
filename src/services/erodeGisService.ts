import { supabase, isSupabaseConfigured } from '../lib/supabase';

export interface MapBounds {
  west: number;
  south: number;
  east: number;
  north: number;
}

export interface GeoJSONGeometry {
  type: string;
  coordinates?: unknown;
  geometries?: GeoJSONGeometry[];
}

export interface ErodeParcel {
  parcel_id: string;
  survey_number: string;
  subdivision_number: string | null;
  state: string;
  district: string;
  taluk: string | null;
  village: string | null;
  pincode: string | null;
  area_sq_m: number | null;
  cadastral_area_sq_m: number | null;
  latitude: number | null;
  longitude: number | null;
  land_type: string | null;
  current_land_use: string | null;
  zone: string | null;
  parcel_status: string | null;
  ownership_type: string | null;
  geometry: GeoJSONGeometry | null;
}

export type Parcel360Record = Record<string, string | number | boolean | null>;

export interface ErodeParcel360Details {
  parcel: Parcel360Record;
  record_of_rights: Parcel360Record[];
  owners: Parcel360Record[];
  registrations: Parcel360Record[];
  land_use: Parcel360Record | null;
  master_plan: Parcel360Record | null;
  building_permissions: Parcel360Record[];
  property_tax: Parcel360Record[];
  utility_infrastructure: Parcel360Record | null;
  restrictions: Parcel360Record[];
  data_conflicts: Parcel360Record[];
  mortgages: Parcel360Record[];
  encumbrances: Parcel360Record[];
}

function getClient() {
  if (!isSupabaseConfigured() || !supabase) {
    throw new Error(
      'Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to .env.local.'
    );
  }

  return supabase;
}

export async function getErodeParcelsInBounds(
  bounds: MapBounds
): Promise<ErodeParcel[]> {
  const client = getClient();

  const { data, error } = await client.rpc('get_erode_parcels_in_bounds', {
    min_lng: bounds.west,
    min_lat: bounds.south,
    max_lng: bounds.east,
    max_lat: bounds.north,
  });

  if (error) {
    console.error('[Erode GIS] Bounds RPC failed:', error);
    throw error;
  }

  return Array.isArray(data) ? (data as ErodeParcel[]) : [];
}

function normalizeErodeSearchText(query: string): string {
  let text = query.trim();

  // Accept natural UI input such as "Survey 333/4C" or
  // "Parcel ID: ERD-P-000232", not only the raw database value.
  text = text
    .replace(/^survey\s*(?:no\.?|number)?\s*[:#-]?\s*/i, '')
    .replace(/^parcel\s*(?:id)?\s*[:#-]?\s*/i, '')
    .split('·')[0]
    .trim()
    .replace(/\s*\/\s*/g, '/');

  return text;
}

export async function searchErodeParcels(
  query: string
): Promise<ErodeParcel[]> {
  const text = normalizeErodeSearchText(query);
  if (!text) return [];

  const client = getClient();

  const { data, error } = await client.rpc('search_erode_parcels', {
    search_text: text,
  });

  if (error) {
    console.error('[Erode GIS] Search RPC failed:', error);
    throw error;
  }

  return Array.isArray(data) ? (data as ErodeParcel[]) : [];
}

export async function getErodeParcelById(
  parcelId: string
): Promise<ErodeParcel | null> {
  const id = parcelId.trim();
  if (!id) return null;

  const results = await searchErodeParcels(id);
  return results.find((parcel) => parcel.parcel_id === id) ?? null;
}

function recordOrNull(value: unknown): Parcel360Record | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
  const record = value as Parcel360Record;
  return Object.keys(record).length > 0 ? record : null;
}

function recordArray(value: unknown): Parcel360Record[] {
  if (!Array.isArray(value)) return [];
  return value.filter(
    (item): item is Parcel360Record =>
      Boolean(item) && typeof item === 'object' && !Array.isArray(item)
  );
}

export async function getErodeParcel360Details(
  parcelId: string
): Promise<ErodeParcel360Details | null> {
  const id = parcelId.trim();
  if (!id) return null;

  const client = getClient();
  const { data, error } = await client.rpc('get_erode_parcel_360', {
    p_parcel_id: id,
  });

  if (error) {
    console.error('[Erode Parcel 360] RPC failed:', error);
    throw error;
  }

  if (!data || typeof data !== 'object' || Array.isArray(data)) return null;

  const raw = data as Record<string, unknown>;
  const parcel = recordOrNull(raw.parcel);
  if (!parcel) return null;

  return {
    parcel,
    record_of_rights: recordArray(raw.record_of_rights),
    owners: recordArray(raw.owners),
    registrations: recordArray(raw.registrations),
    land_use: recordOrNull(raw.land_use),
    master_plan: recordOrNull(raw.master_plan),
    building_permissions: recordArray(raw.building_permissions),
    property_tax: recordArray(raw.property_tax),
    utility_infrastructure: recordOrNull(raw.utility_infrastructure),
    restrictions: recordArray(raw.restrictions),
    data_conflicts: recordArray(raw.data_conflicts),
    mortgages: recordArray(raw.mortgages),
    encumbrances: recordArray(raw.encumbrances),
  };
}
