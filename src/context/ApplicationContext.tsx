import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { CitizenApplicationRecord, ApplicationStatus, AppNotification } from '../types/application';
import type { GovernmentUser } from '../types/auth';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import {
  createApplicationService,
  updateStatusService,
  updateApplicationFieldsService,
  markNotificationReadService,
} from '../services/applicationService';

const APP_STORAGE_KEY = 'landstack_applications';
const NOTIF_STORAGE_KEY = 'landstack_app_notifications';

function readFromStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (raw) return JSON.parse(raw) as T;
  } catch { /* ignore */ }
  return fallback;
}

function writeToStorage<T>(key: string, value: T): void {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* ignore */ }
}

function districtMatch(appDistrict: string, officerDistrictOffice: string): boolean {
  if (!appDistrict || !officerDistrictOffice) return false;
  const d = appDistrict.trim().toLowerCase();
  const o = officerDistrictOffice.trim().toLowerCase();
  return o.includes(d) || d.includes(o);
}

interface ApplicationContextType {
  applications: CitizenApplicationRecord[];
  notifications: AppNotification[];
  isLoading: boolean;
  isSupabaseActive: boolean;
  addApplication: (app: Omit<CitizenApplicationRecord, 'applicationId' | 'submittedAt' | 'status' | 'statusHistory'>) => Promise<CitizenApplicationRecord>;
  updateApplication: (applicationId: string, patch: Partial<CitizenApplicationRecord>) => Promise<void>;
  updateStatus: (applicationId: string, newStatus: ApplicationStatus, note?: string, updatedBy?: string, officerDetails?: { id: string; name: string }) => Promise<void>;
  getApplicationById: (applicationId: string) => CitizenApplicationRecord | undefined;
  getApplicationsForGovUser: (govUser: GovernmentUser) => CitizenApplicationRecord[];
  getApplicationsForCitizen: (citizenId: string) => CitizenApplicationRecord[];
  refreshApplications: () => Promise<void>;
  markNotificationRead: (notifId: string) => void;
  unreadNotifCount: number;
}

const ApplicationContext = createContext<ApplicationContextType | undefined>(undefined);

export const ApplicationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [applications, setApplications] = useState<CitizenApplicationRecord[]>(() =>
    readFromStorage<CitizenApplicationRecord[]>(APP_STORAGE_KEY, [])
  );
  const [notifications, setNotifications] = useState<AppNotification[]>(() =>
    readFromStorage<AppNotification[]>(NOTIF_STORAGE_KEY, [])
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const isSupabaseActive = isSupabaseConfigured();

  // Load applications from Supabase or LocalStorage on mount
  const refreshApplications = useCallback(async () => {
    setIsLoading(true);
    try {
      if (isSupabaseActive && supabase) {
        const { data: rows } = await supabase
          .from('citizen_applications')
          .select('*')
          .order('created_at', { ascending: false });

        if (rows && rows.length > 0) {
          const appIds = rows.map((r) => r.application_id);
          const { data: historyRows } = await supabase
            .from('application_status_history')
            .select('*')
            .in('application_id', appIds)
            .order('created_at', { ascending: true });

          const historyMap = new Map<string, any[]>();
          (historyRows || []).forEach((h) => {
            if (!historyMap.has(h.application_id)) historyMap.set(h.application_id, []);
            historyMap.get(h.application_id)!.push(h);
          });

          // Convert DB rows to CitizenApplicationRecord
          const records: CitizenApplicationRecord[] = rows.map((r) => {
            const hRows = historyMap.get(r.application_id) || [];
            const history = hRows.map((h) => ({
              status: h.status as ApplicationStatus,
              timestamp: h.created_at || new Date().toISOString(),
              note: h.message || undefined,
              updatedBy: h.changed_by_name || undefined,
            }));

            const reqDetails = r.request_details || {};
            return {
              applicationId: r.application_id,
              citizenId: r.citizen_id,
              citizenName: r.citizen_name || 'Citizen',
              citizenMobile: r.citizen_mobile || '',
              citizenEmail: r.citizen_email || undefined,
              purposeId: r.purpose_id,
              purposeLabel: r.purpose_label,
              category: r.category || 'General',
              parcelId: r.parcel_id || undefined,
              ulpin: r.ulpin || undefined,
              surveyNumber: r.survey_number || undefined,
              location: {
                state: r.state,
                district: r.district,
                localBody: r.local_body || r.office || undefined,
                villageOrWard: r.village_or_ward || undefined,
                description: r.location_description || undefined,
              },
              requestDetails: reqDetails,
              documents: r.documents || [],
              targetDepartment: r.target_department,
              targetRole: r.target_role,
              fallbackDepartments: r.fallback_department ? [r.fallback_department] : [],
              fallbackRoles: r.fallback_role ? [r.fallback_role] : [],
              collaboratingDepartments: r.collaborating_departments || [],
              collaboratingRoles: r.collaborating_roles || [],
              submittedAt: r.created_at || new Date().toISOString(),
              status: r.status as ApplicationStatus,
              statusHistory: history,
              assignedOfficerId: r.assigned_officer_id || undefined,
              assignedOfficerName: r.assigned_officer_name || undefined,
              officerRemarks: r.officer_remarks || undefined,
              citizenRemarks: r.citizen_remarks || undefined,
              moreInfoRequest: reqDetails._moreInfoRequest || undefined,
              moreInfoResponse: reqDetails._moreInfoResponse || undefined,
            };
          });

          setApplications(records);
          writeToStorage(APP_STORAGE_KEY, records);
        }
      }
    } catch (err) {
      console.error('[Supabase Fetch Exception]:', err);
    } finally {
      setIsLoading(false);
    }
  }, [isSupabaseActive]);

  useEffect(() => {
    refreshApplications();
  }, [refreshApplications]);

  // Set up Supabase Realtime Subscription if active
  useEffect(() => {
    if (!isSupabaseActive || !supabase) return;

    const channel = supabase
      .channel('public:citizen_applications')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'citizen_applications' },
        () => {
          refreshApplications();
        }
      )
      .subscribe();

    return () => {
      supabase?.removeChannel(channel);
    };
  }, [isSupabaseActive, refreshApplications]);

  // Sync to local storage
  useEffect(() => {
    writeToStorage(APP_STORAGE_KEY, applications);
  }, [applications]);

  useEffect(() => {
    writeToStorage(NOTIF_STORAGE_KEY, notifications);
  }, [notifications]);

  const addApplication = useCallback(
    async (
      appData: Omit<CitizenApplicationRecord, 'applicationId' | 'submittedAt' | 'status' | 'statusHistory'>
    ): Promise<CitizenApplicationRecord> => {
      const res = await createApplicationService(appData);

      if (res.success && res.application) {
        setApplications((prev) => [res.application!, ...prev]);
        return res.application;
      }

      throw new Error(res.error || 'Failed to submit application to database.');
    },
    []
  );

  const updateApplication = useCallback(
    async (applicationId: string, patch: Partial<CitizenApplicationRecord>) => {
      await updateApplicationFieldsService(applicationId, patch);
      setApplications((prev) =>
        prev.map((app) => (app.applicationId === applicationId ? { ...app, ...patch } : app))
      );
    },
    []
  );

  const updateStatus = useCallback(
    async (
      applicationId: string,
      newStatus: ApplicationStatus,
      note?: string,
      updatedBy?: string,
      officerDetails?: { id: string; name: string }
    ) => {
      await updateStatusService(applicationId, newStatus, note, updatedBy, officerDetails);
      await refreshApplications();
    },
    [refreshApplications]
  );

  const getApplicationById = useCallback(
    (applicationId: string) => {
      return applications.find((a) => a.applicationId === applicationId);
    },
    [applications]
  );

  const getApplicationsForCitizen = useCallback(
    (citizenId: string) => {
      return applications.filter((a) => a.citizenId === citizenId);
    },
    [applications]
  );

  const getApplicationsForGovUser = useCallback(
    (govUser: GovernmentUser): CitizenApplicationRecord[] => {
      const userRole = govUser.officialRole;
      const userDept = govUser.department;
      const userState = govUser.state;
      const userDistrict = govUser.districtOffice;

      if (userRole === 'System Administrator') return applications;

      if (userRole === 'State Administrator') {
        return applications.filter((a) => !a.location.state || a.location.state === userState);
      }

      if (userRole === 'District Administrator') {
        return applications.filter((a) => {
          const stateOk = !a.location.state || a.location.state === userState;
          const distOk = !a.location.district || districtMatch(a.location.district, userDistrict);
          return stateOk && distOk;
        });
      }

      if (userRole === 'Read-Only / Auditor') {
        return applications.filter((a) => {
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
      return applications.filter((a) => {
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
    },
    [applications]
  );

  const markNotificationRead = useCallback((notifId: string) => {
    markNotificationReadService(notifId);
    setNotifications((prev) => prev.map((n) => (n.id === notifId ? { ...n, read: true } : n)));
  }, []);

  const unreadNotifCount = notifications.filter((n) => !n.read).length;

  return (
    <ApplicationContext.Provider
      value={{
        applications,
        notifications,
        isLoading,
        isSupabaseActive,
        addApplication,
        updateApplication,
        updateStatus,
        getApplicationById,
        getApplicationsForGovUser,
        getApplicationsForCitizen,
        refreshApplications,
        markNotificationRead,
        unreadNotifCount,
      }}
    >
      {children}
    </ApplicationContext.Provider>
  );
};

export const useApplications = () => {
  const ctx = useContext(ApplicationContext);
  if (!ctx) throw new Error('useApplications must be used within ApplicationProvider');
  return ctx;
};
