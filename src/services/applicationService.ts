import { supabase, isSupabaseConfigured } from '../lib/supabase';
import type {
  CitizenApplicationRecord,
  ApplicationStatus,
  StatusHistoryEntry,
  AppNotification,
  ApplicationDocument,
} from '../types/application';
import type { GovernmentUser } from '../types/auth';

// ─── LocalStorage Fallback Storage Keys ──────────────────────────────────────
const APP_STORAGE_KEY = 'landstack_applications';
const NOTIF_STORAGE_KEY = 'landstack_app_notifications';

function readLocalStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (raw) return JSON.parse(raw) as T;
  } catch { /* ignore */ }
  return fallback;
}

function writeLocalStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch { /* ignore */ }
}

function generateApplicationId(): string {
  const year = new Date().getFullYear();
  const num = String(Math.floor(Math.random() * 900000) + 100000);
  return `APP-${year}-${num}`;
}

function districtMatch(appDistrict: string, officerDistrictOffice: string): boolean {
  if (!appDistrict || !officerDistrictOffice) return false;
  const d = appDistrict.trim().toLowerCase();
  const o = officerDistrictOffice.trim().toLowerCase();
  return o.includes(d) || d.includes(o);
}

// ─── Database Row Mapping Helpers ─────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function dbRowToApplication(row: any, historyRows: any[] = []): CitizenApplicationRecord {
  const history: StatusHistoryEntry[] = (historyRows || []).map((h) => ({
    status: h.status as ApplicationStatus,
    timestamp: h.created_at || new Date().toISOString(),
    note: h.message || undefined,
    updatedBy: h.changed_by_name || undefined,
  }));

  // If no history found from relation, parse default history
  const statusHistory = history.length > 0 ? history : [
    { status: 'Submitted' as ApplicationStatus, timestamp: row.created_at || new Date().toISOString(), note: 'Application submitted by citizen.' },
    ...(row.status !== 'Submitted' ? [{ status: row.status as ApplicationStatus, timestamp: row.updated_at || new Date().toISOString(), note: `Status updated to ${row.status}` }] : []),
  ];

  const reqDetails = row.request_details || {};

  return {
    applicationId: row.application_id,
    citizenId: row.citizen_id,
    citizenName: row.citizen_name || 'Citizen',
    citizenMobile: row.citizen_mobile || '',
    citizenEmail: row.citizen_email || undefined,

    purposeId: row.purpose_id,
    purposeLabel: row.purpose_label,
    category: row.category || 'General',

    parcelId: row.parcel_id || undefined,
    ulpin: row.ulpin || undefined,
    surveyNumber: row.survey_number || undefined,
    location: {
      state: row.state,
      district: row.district,
      localBody: row.local_body || row.office || undefined,
      villageOrWard: row.village_or_ward || undefined,
      description: row.location_description || undefined,
    },

    requestDetails: reqDetails,
    documents: (row.documents as ApplicationDocument[]) || [],

    targetDepartment: row.target_department,
    targetRole: row.target_role,
    fallbackDepartments: row.fallback_department ? [row.fallback_department] : [],
    fallbackRoles: row.fallback_role ? [row.fallback_role] : [],
    collaboratingDepartments: (row.collaborating_departments as string[]) || [],
    collaboratingRoles: (row.collaborating_roles as string[]) || [],

    submittedAt: row.created_at || new Date().toISOString(),
    status: row.status as ApplicationStatus,
    statusHistory,

    assignedOfficerId: row.assigned_officer_id || undefined,
    assignedOfficerName: row.assigned_officer_name || undefined,
    officerRemarks: row.officer_remarks || undefined,
    citizenRemarks: row.citizen_remarks || undefined,

    moreInfoRequest: reqDetails._moreInfoRequest || undefined,
    moreInfoResponse: reqDetails._moreInfoResponse || undefined,
  };
}

function applicationToDbRow(app: CitizenApplicationRecord) {
  const reqDetails = {
    ...app.requestDetails,
    ...(app.moreInfoRequest ? { _moreInfoRequest: app.moreInfoRequest } : {}),
    ...(app.moreInfoResponse ? { _moreInfoResponse: app.moreInfoResponse } : {}),
  };

  return {
    application_id: app.applicationId,
    citizen_id: app.citizenId,
    citizen_name: app.citizenName,
    citizen_email: app.citizenEmail || null,
    citizen_mobile: app.citizenMobile,
    purpose_id: app.purposeId,
    purpose_label: app.purposeLabel,
    category: app.category,
    target_department: app.targetDepartment,
    target_role: app.targetRole,
    fallback_department: app.fallbackDepartments?.[0] || null,
    fallback_role: app.fallbackRoles?.[0] || null,
    collaborating_departments: app.collaboratingDepartments || [],
    collaborating_roles: app.collaboratingRoles || [],
    state: app.location.state,
    district: app.location.district,
    office: app.location.localBody || null,
    local_body: app.location.localBody || null,
    village_or_ward: app.location.villageOrWard || null,
    parcel_id: app.parcelId || null,
    ulpin: app.ulpin || null,
    survey_number: app.surveyNumber || null,
    location_description: app.location.description || null,
    request_details: reqDetails,
    documents: app.documents || [],
    status: app.status,
    assigned_officer_id: app.assignedOfficerId || null,
    assigned_officer_name: app.assignedOfficerName || null,
    citizen_remarks: app.citizenRemarks || null,
    officer_remarks: app.officerRemarks || null,
    updated_at: new Date().toISOString(),
  };
}

// ─── SERVICE OPERATIONS ───────────────────────────────────────────────────────

/** Create a new Citizen Application and record its initial status history */
export async function createApplicationService(
  appData: Omit<CitizenApplicationRecord, 'applicationId' | 'submittedAt' | 'status' | 'statusHistory'>
): Promise<{ success: boolean; application?: CitizenApplicationRecord; error?: string }> {
  const applicationId = generateApplicationId();
  const now = new Date().toISOString();

  const initialHistory: StatusHistoryEntry[] = [
    { status: 'Submitted', timestamp: now, note: 'Application submitted by citizen.' },
    {
      status: 'Routed',
      timestamp: new Date(Date.now() + 500).toISOString(),
      note: `Routed to ${appData.targetDepartment} — ${appData.targetRole}.`,
    },
  ];

  const fullApp: CitizenApplicationRecord = {
    ...appData,
    applicationId,
    submittedAt: now,
    status: 'Routed',
    statusHistory: initialHistory,
  };

  // If Supabase is configured, save to Supabase
  if (isSupabaseConfigured() && supabase) {
    try {
      const dbRow = applicationToDbRow(fullApp);
      const { error: insertErr } = await supabase.from('citizen_applications').insert([dbRow]);

      if (insertErr) {
        console.error('[Supabase Create Application Error]:', insertErr);
        return { success: false, error: insertErr.message || 'Database insert failed.' };
      }

      // Add status history rows
      const historyInsert = initialHistory.map((h) => ({
        application_id: applicationId,
        status: h.status,
        message: h.note,
        changed_by_type: h.status === 'Submitted' ? 'Citizen' : 'System',
        changed_by_id: h.status === 'Submitted' ? appData.citizenId : 'SYSTEM',
        changed_by_name: h.status === 'Submitted' ? appData.citizenName : 'GeoNexus Engine',
      }));

      await supabase.from('application_status_history').insert(historyInsert);

      // Create notification
      await createNotificationService(
        appData.citizenId,
        applicationId,
        'Application Submitted',
        `Your application ${applicationId} has been submitted and routed to ${appData.targetDepartment}.`,
        'success'
      );

      // Sync to local storage as secondary backup
      const localApps = readLocalStorage<CitizenApplicationRecord[]>(APP_STORAGE_KEY, []);
      writeLocalStorage(APP_STORAGE_KEY, [fullApp, ...localApps]);

      return { success: true, application: fullApp };
    } catch (err) {
      console.error('[Supabase Exception]:', err);
      return { success: false, error: 'Database service unavailable.' };
    }
  }

  // Fallback: LocalStorage only
  const localApps = readLocalStorage<CitizenApplicationRecord[]>(APP_STORAGE_KEY, []);
  writeLocalStorage(APP_STORAGE_KEY, [fullApp, ...localApps]);
  await createNotificationService(
    appData.citizenId,
    applicationId,
    'Application Submitted',
    `Your application ${applicationId} has been submitted and routed to ${appData.targetDepartment}.`,
    'success'
  );

  return { success: true, application: fullApp };
}

/** Get applications for a specific citizen */
export async function getCitizenApplicationsService(citizenId: string): Promise<CitizenApplicationRecord[]> {
  if (isSupabaseConfigured() && supabase) {
    try {
      const { data: rows, error } = await supabase
        .from('citizen_applications')
        .select('*')
        .eq('citizen_id', citizenId)
        .order('created_at', { ascending: false });

      if (!error && rows) {
        // Fetch status histories
        const appIds = rows.map((r) => r.application_id);
        const { data: historyRows } = appIds.length > 0
          ? await supabase.from('application_status_history').select('*').in('application_id', appIds).order('created_at', { ascending: true })
          : { data: [] };

        const historyMap = new Map<string, any[]>();
        (historyRows || []).forEach((h) => {
          if (!historyMap.has(h.application_id)) historyMap.set(h.application_id, []);
          historyMap.get(h.application_id)!.push(h);
        });

        return rows.map((r) => dbRowToApplication(r, historyMap.get(r.application_id) || []));
      }
    } catch (err) {
      console.error('[Supabase Query Error]:', err);
    }
  }

  // Local storage fallback
  const local = readLocalStorage<CitizenApplicationRecord[]>(APP_STORAGE_KEY, []);
  return local.filter((a) => a.citizenId === citizenId);
}

/** Get single application by application_id */
export async function getApplicationByIdService(applicationId: string): Promise<CitizenApplicationRecord | undefined> {
  if (isSupabaseConfigured() && supabase) {
    try {
      const { data, error } = await supabase
        .from('citizen_applications')
        .select('*')
        .eq('application_id', applicationId)
        .single();

      if (!error && data) {
        const { data: historyRows } = await supabase
          .from('application_status_history')
          .select('*')
          .eq('application_id', applicationId)
          .order('created_at', { ascending: true });

        return dbRowToApplication(data, historyRows || []);
      }
    } catch (err) {
      console.error('[Supabase Query Single Error]:', err);
    }
  }

  const local = readLocalStorage<CitizenApplicationRecord[]>(APP_STORAGE_KEY, []);
  return local.find((a) => a.applicationId === applicationId);
}

/** Get applications matching a government officer's scope */
export async function getGovernmentApplicationsService(govUser: GovernmentUser): Promise<CitizenApplicationRecord[]> {
  let allApps: CitizenApplicationRecord[] = [];

  if (isSupabaseConfigured() && supabase) {
    try {
      let query = supabase.from('citizen_applications').select('*').order('created_at', { ascending: false });

      // Apply server-side query filters if scope is OFFICER
      if (govUser.officialRole !== 'System Administrator' && govUser.officialRole !== 'State Administrator') {
        if (govUser.state) query = query.eq('state', govUser.state);
      }

      const { data: rows, error } = await query;

      if (!error && rows) {
        const appIds = rows.map((r) => r.application_id);
        const { data: historyRows } = appIds.length > 0
          ? await supabase.from('application_status_history').select('*').in('application_id', appIds).order('created_at', { ascending: true })
          : { data: [] };

        const historyMap = new Map<string, any[]>();
        (historyRows || []).forEach((h) => {
          if (!historyMap.has(h.application_id)) historyMap.set(h.application_id, []);
          historyMap.get(h.application_id)!.push(h);
        });

        allApps = rows.map((r) => dbRowToApplication(r, historyMap.get(r.application_id) || []));
      }
    } catch (err) {
      console.error('[Supabase Query Gov Apps Error]:', err);
    }
  }

  if (allApps.length === 0) {
    allApps = readLocalStorage<CitizenApplicationRecord[]>(APP_STORAGE_KEY, []);
  }

  // Filter in application layer based on officer access scope
  const userRole = govUser.officialRole;
  const userDept = govUser.department;
  const userState = govUser.state;
  const userDistrict = govUser.districtOffice;

  if (userRole === 'System Administrator') return allApps;

  if (userRole === 'State Administrator') {
    return allApps.filter((a) => !a.location.state || a.location.state === userState);
  }

  if (userRole === 'District Administrator') {
    return allApps.filter((a) => {
      const stateOk = !a.location.state || a.location.state === userState;
      const distOk = !a.location.district || districtMatch(a.location.district, userDistrict);
      return stateOk && distOk;
    });
  }

  if (userRole === 'Read-Only / Auditor') {
    return allApps.filter((a) => {
      const deptOk =
        !userDept ||
        a.targetDepartment === userDept ||
        (a.fallbackDepartments?.includes(userDept) ?? false) ||
        (a.collaboratingDepartments?.includes(userDept) ?? false);
      const stateOk = !a.location.state || a.location.state === userState;
      return deptOk && stateOk;
    });
  }

  // Normal Officer
  return allApps.filter((a) => {
    const deptOk =
      !userDept ||
      a.targetDepartment === userDept ||
      (a.fallbackDepartments?.includes(userDept) ?? false) ||
      (a.collaboratingDepartments?.includes(userDept) ?? false);

    const roleOk =
      a.targetRole === userRole ||
      (a.fallbackRoles?.includes(userRole) ?? false) ||
      (a.collaboratingRoles?.includes(userRole) ?? false);

    const stateOk = !a.location.state || a.location.state === userState;
    const distOk = !a.location.district || districtMatch(a.location.district, userDistrict);

    return deptOk && roleOk && stateOk && distOk;
  });
}

/** Update status of an application in database and insert history record */
export async function updateStatusService(
  applicationId: string,
  newStatus: ApplicationStatus,
  note?: string,
  updatedBy?: string,
  officerDetails?: { id: string; name: string }
): Promise<boolean> {
  const now = new Date().toISOString();

  if (isSupabaseConfigured() && supabase) {
    try {
      const patch: any = {
        status: newStatus,
        updated_at: now,
      };
      if (officerDetails) {
        patch.assigned_officer_id = officerDetails.id;
        patch.assigned_officer_name = officerDetails.name;
      }
      if (newStatus === 'Rejected' && note) {
        patch.rejection_reason = note;
      }
      if (note && newStatus !== 'Rejected') {
        patch.officer_remarks = note;
      }

      await supabase.from('citizen_applications').update(patch).eq('application_id', applicationId);

      // Insert status history
      await supabase.from('application_status_history').insert([
        {
          application_id: applicationId,
          status: newStatus,
          message: note || `Status changed to ${newStatus}`,
          changed_by_type: 'Government Officer',
          changed_by_id: officerDetails?.id || 'OFFICER',
          changed_by_name: updatedBy || officerDetails?.name || 'Officer',
        },
      ]);
    } catch (err) {
      console.error('[Supabase Status Update Error]:', err);
    }
  }

  // Also update LocalStorage
  const localApps = readLocalStorage<CitizenApplicationRecord[]>(APP_STORAGE_KEY, []);
  const updatedLocal = localApps.map((a) => {
    if (a.applicationId !== applicationId) return a;
    const entry: StatusHistoryEntry = {
      status: newStatus,
      timestamp: now,
      note,
      updatedBy: updatedBy || officerDetails?.name,
    };
    return {
      ...a,
      status: newStatus,
      statusHistory: [...a.statusHistory, entry],
      ...(officerDetails ? { assignedOfficerId: officerDetails.id, assignedOfficerName: officerDetails.name } : {}),
      ...(note ? { officerRemarks: note } : {}),
    };
  });
  writeLocalStorage(APP_STORAGE_KEY, updatedLocal);

  return true;
}

/** Update arbitrary fields on an application record */
export async function updateApplicationFieldsService(
  applicationId: string,
  patch: Partial<CitizenApplicationRecord>
): Promise<boolean> {
  if (isSupabaseConfigured() && supabase) {
    try {
      const dbPatch: any = { updated_at: new Date().toISOString() };
      if (patch.status) dbPatch.status = patch.status;
      if (patch.assignedOfficerId) dbPatch.assigned_officer_id = patch.assignedOfficerId;
      if (patch.assignedOfficerName) dbPatch.assigned_officer_name = patch.assignedOfficerName;
      if (patch.officerRemarks) dbPatch.officer_remarks = patch.officerRemarks;

      if (patch.moreInfoRequest || patch.moreInfoResponse || patch.requestDetails) {
        // Fetch current row request_details
        const { data: current } = await supabase.from('citizen_applications').select('request_details').eq('application_id', applicationId).single();
        const existingDetails = current?.request_details || {};
        dbPatch.request_details = {
          ...existingDetails,
          ...(patch.requestDetails || {}),
          ...(patch.moreInfoRequest ? { _moreInfoRequest: patch.moreInfoRequest } : {}),
          ...(patch.moreInfoResponse ? { _moreInfoResponse: patch.moreInfoResponse } : {}),
        };
      }

      await supabase.from('citizen_applications').update(dbPatch).eq('application_id', applicationId);
    } catch (err) {
      console.error('[Supabase Application Patch Error]:', err);
    }
  }

  // LocalStorage update
  const localApps = readLocalStorage<CitizenApplicationRecord[]>(APP_STORAGE_KEY, []);
  const updatedLocal = localApps.map((a) => (a.applicationId === applicationId ? { ...a, ...patch } : a));
  writeLocalStorage(APP_STORAGE_KEY, updatedLocal);

  return true;
}

// ─── NOTIFICATION SERVICES ──────────────────────────────────────────────────

export async function createNotificationService(
  citizenId: string,
  applicationId: string,
  title: string,
  message: string,
  type: AppNotification['type'] = 'info'
): Promise<void> {
  if (isSupabaseConfigured() && supabase) {
    try {
      await supabase.from('citizen_notifications').insert([
        {
          citizen_id: citizenId,
          application_id: applicationId,
          title,
          message,
          read: false,
        },
      ]);
    } catch (err) {
      console.error('[Supabase Notification Create Error]:', err);
    }
  }

  const notif: AppNotification = {
    id: `notif-app-${Date.now()}`,
    applicationId,
    title,
    message,
    date: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
    read: false,
    type,
  };
  const localNotifs = readLocalStorage<AppNotification[]>(NOTIF_STORAGE_KEY, []);
  writeLocalStorage(NOTIF_STORAGE_KEY, [notif, ...localNotifs]);
}

export async function getNotificationsService(citizenId: string): Promise<AppNotification[]> {
  if (isSupabaseConfigured() && supabase) {
    try {
      const { data, error } = await supabase
        .from('citizen_notifications')
        .select('*')
        .eq('citizen_id', citizenId)
        .order('created_at', { ascending: false });

      if (!error && data) {
        return data.map((n) => ({
          id: n.id,
          applicationId: n.application_id,
          title: n.title,
          message: n.message,
          date: new Date(n.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
          read: n.read,
          type: 'info' as const,
        }));
      }
    } catch (err) {
      console.error('[Supabase Get Notifications Error]:', err);
    }
  }

  return readLocalStorage<AppNotification[]>(NOTIF_STORAGE_KEY, []);
}

export async function markNotificationReadService(notifId: string): Promise<void> {
  if (isSupabaseConfigured() && supabase) {
    try {
      await supabase.from('citizen_notifications').update({ read: true }).eq('id', notifId);
    } catch (err) {
      console.error('[Supabase Mark Notif Read Error]:', err);
    }
  }

  const localNotifs = readLocalStorage<AppNotification[]>(NOTIF_STORAGE_KEY, []);
  const updated = localNotifs.map((n) => (n.id === notifId ? { ...n, read: true } : n));
  writeLocalStorage(NOTIF_STORAGE_KEY, updated);
}

