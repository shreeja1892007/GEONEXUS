import React, { createContext, useContext, useState, useEffect } from 'react';
import type { CitizenUser, GovernmentUser } from '../types/auth';

interface AuthContextType {
  // Citizen auth
  currentUser: CitizenUser | null;
  registeredUsers: CitizenUser[];
  prefillMobile: string;
  setPrefillMobile: (mobile: string) => void;
  login: (mobile: string, password: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  registerUser: (userData: Omit<CitizenUser, 'id' | 'registeredAt'>) => CitizenUser;

  // Government auth
  currentGovUser: GovernmentUser | null;
  registeredGovUsers: GovernmentUser[];
  prefillGovLogin: { department: string; employeeId: string } | null;
  setPrefillGovLogin: (val: { department: string; employeeId: string } | null) => void;
  govLogin: (
    department: string,
    employeeId: string,
    password: string
  ) => Promise<{ success: boolean; message?: string }>;
  govLogout: () => void;
  registerGovUser: (userData: Omit<GovernmentUser, 'id' | 'registeredAt'>) => GovernmentUser;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ─── Seed citizen accounts ────────────────────────────────────────────────────
const SEED_USERS: CitizenUser[] = [
  {
    id: 'user-demo-1',
    fullName: 'Rajesh Kumar Sharma',
    mobile: '9876543210',
    password: 'Password@123',
    email: 'rajesh.sharma@example.gov.in',
    maskedAadhaar: 'XXXX XXXX 4582',
    isMinor: false,
    registeredAt: new Date().toISOString(),
  },
  {
    id: 'user-demo-2',
    fullName: 'Sim Subhash',
    mobile: '9876543211',
    password: 'Password@123',
    email: 'sim.subhash@example.com',
    maskedAadhaar: 'XXXX XXXX 7791',
    isMinor: false,
    registeredAt: new Date().toISOString(),
  },
];

// ─── Seed government accounts (18 departments + admins, all TN/Chennai) ───────
// All demo accounts share: Password — GovPassword@123
const _now = new Date().toISOString();

const SEED_GOV_USERS: GovernmentUser[] = [
  // ── National / Legacy seed ──────────────────────────────────────────────────
  {
    id: 'gov-demo-1',
    fullName: 'Dr. Arvind Subramanian',
    employeeId: 'DLR-EMP-1042',
    department: 'Department of Land Resources',
    designation: 'Joint Director (Land Systems)',
    officialRole: 'Land Records Officer',
    state: 'Delhi (NCT)',
    districtOffice: 'National Land Governance HQ, New Delhi',
    officialEmail: 'arvind.subramanian@gov.in',
    officialMobile: '9876544821',
    password: 'GovPassword@123',
    registeredAt: _now,
  },

  // ── Tamil Nadu — Chennai officers (key departments for demo) ───────────────
  {
    id: 'gov-demo-2',
    fullName: 'R. Krishnamurthy',
    employeeId: 'TN-REV-1042',
    department: 'Revenue Department',
    designation: 'Revenue Inspector',
    officialRole: 'Revenue Officer',
    state: 'Tamil Nadu',
    districtOffice: 'Chennai Revenue Office',
    officialEmail: 'krishnamurthy.rev@tn.gov.in',
    officialMobile: '9876544822',
    password: 'GovPassword@123',
    registeredAt: _now,
  },
  {
    id: 'gov-demo-3',
    fullName: 'S. Murugesan',
    employeeId: 'TN-SURV-2241',
    department: 'Survey & Settlement Department',
    designation: 'Survey Inspector',
    officialRole: 'Survey Officer',
    state: 'Tamil Nadu',
    districtOffice: 'Chennai Survey Office',
    officialEmail: 's.murugesan@tn.gov.in',
    officialMobile: '9876544823',
    password: 'GovPassword@123',
    registeredAt: _now,
  },
  {
    id: 'gov-demo-4',
    fullName: 'A. Rajendran',
    employeeId: 'TN-REG-3301',
    department: 'Registration Department',
    designation: 'Sub-Registrar',
    officialRole: 'Registration Officer',
    state: 'Tamil Nadu',
    districtOffice: 'Chennai Sub-Registrar Office',
    officialEmail: 'a.rajendran@tn.gov.in',
    officialMobile: '9876544824',
    password: 'GovPassword@123',
    registeredAt: _now,
  },
  {
    id: 'gov-demo-5',
    fullName: 'P. Soundarajan',
    employeeId: 'TN-WSD-4412',
    department: 'Water & Sewerage Department',
    designation: 'Junior Engineer',
    officialRole: 'Water & Sewerage Officer',
    state: 'Tamil Nadu',
    districtOffice: 'Chennai Water Board Office',
    officialEmail: 'p.soundarajan@tn.gov.in',
    officialMobile: '9876544825',
    password: 'GovPassword@123',
    registeredAt: _now,
  },
  {
    id: 'gov-demo-6',
    fullName: 'K. Balasubramanian',
    employeeId: 'TN-TCP-5521',
    department: 'Town & Country Planning Department',
    designation: 'Town Planning Inspector',
    officialRole: 'Town Planning Officer',
    state: 'Tamil Nadu',
    districtOffice: 'Chennai Planning Authority',
    officialEmail: 'k.balasubramanian@tn.gov.in',
    officialMobile: '9876544826',
    password: 'GovPassword@123',
    registeredAt: _now,
  },
  {
    id: 'gov-demo-7',
    fullName: 'V. Natarajan',
    employeeId: 'TN-LEG-6630',
    department: 'Legal / Dispute Management Department',
    designation: 'Legal Officer',
    officialRole: 'Legal / Dispute Management Officer',
    state: 'Tamil Nadu',
    districtOffice: 'Chennai Legal Cell Office',
    officialEmail: 'v.natarajan@tn.gov.in',
    officialMobile: '9876544827',
    password: 'GovPassword@123',
    registeredAt: _now,
  },
  {
    id: 'gov-demo-8',
    fullName: 'M. Deivanayagam',
    employeeId: 'TN-ARCH-7741',
    department: 'Archaeology / Heritage Department',
    designation: 'Assistant Archaeological Officer',
    officialRole: 'Archaeology / Heritage Officer',
    state: 'Tamil Nadu',
    districtOffice: 'Tamil Nadu Archaeology Dept, Chennai',
    officialEmail: 'm.deivanayagam@tn.gov.in',
    officialMobile: '9876544828',
    password: 'GovPassword@123',
    registeredAt: _now,
  },
  {
    id: 'gov-demo-9',
    fullName: 'G. Subramaniam',
    employeeId: 'TN-LAQ-8852',
    department: 'Land Acquisition / Revenue Department',
    designation: 'Special Tahsildar (Land Acquisition)',
    officialRole: 'Land Acquisition Officer',
    state: 'Tamil Nadu',
    districtOffice: 'Chennai District Collectorate (LA)',
    officialEmail: 'g.subramaniam@tn.gov.in',
    officialMobile: '9876544829',
    password: 'GovPassword@123',
    registeredAt: _now,
  },
  {
    id: 'gov-demo-10',
    fullName: 'T. Ramasamy',
    employeeId: 'TN-DM-9963',
    department: 'Disaster Management Department',
    designation: 'Disaster Management Officer',
    officialRole: 'Disaster Management Officer',
    state: 'Tamil Nadu',
    districtOffice: 'Chennai Disaster Management Cell',
    officialEmail: 't.ramasamy@tn.gov.in',
    officialMobile: '9876544830',
    password: 'GovPassword@123',
    registeredAt: _now,
  },
  {
    id: 'gov-demo-11',
    fullName: 'C. Ponnazhagan',
    employeeId: 'TN-RDP-1174',
    department: 'Rural Development / Panchayat Department',
    designation: 'Block Development Officer',
    officialRole: 'Rural Development / Panchayat Officer',
    state: 'Tamil Nadu',
    districtOffice: 'Chennai Panchayat Development Office',
    officialEmail: 'c.ponnazhagan@tn.gov.in',
    officialMobile: '9876544831',
    password: 'GovPassword@123',
    registeredAt: _now,
  },
  {
    id: 'gov-demo-12',
    fullName: 'L. Suresh',
    employeeId: 'TN-FOR-2285',
    department: 'Forest Department',
    designation: 'Forest Range Officer',
    officialRole: 'Forest Department Officer',
    state: 'Tamil Nadu',
    districtOffice: 'Chennai Forest Division Office',
    officialEmail: 'l.suresh@tn.gov.in',
    officialMobile: '9876544832',
    password: 'GovPassword@123',
    registeredAt: _now,
  },
  {
    id: 'gov-demo-13',
    fullName: 'N. Vijayalakshmi',
    employeeId: 'TN-ENV-3396',
    department: 'Environment Department',
    designation: 'Environmental Engineer',
    officialRole: 'Environment Department Officer',
    state: 'Tamil Nadu',
    districtOffice: 'TNPCB Chennai Regional Office',
    officialEmail: 'n.vijayalakshmi@tn.gov.in',
    officialMobile: '9876544833',
    password: 'GovPassword@123',
    registeredAt: _now,
  },
  {
    id: 'gov-demo-14',
    fullName: 'D. Annamalai',
    employeeId: 'TN-HWY-4407',
    department: 'Highways Department',
    designation: 'Junior Engineer (Highways)',
    officialRole: 'Highways Officer',
    state: 'Tamil Nadu',
    districtOffice: 'Chennai Highways Division',
    officialEmail: 'd.annamalai@tn.gov.in',
    officialMobile: '9876544834',
    password: 'GovPassword@123',
    registeredAt: _now,
  },
  {
    id: 'gov-demo-15',
    fullName: 'F. Anand',
    employeeId: 'TN-WRD-5518',
    department: 'Water Resources Department',
    designation: 'Assistant Executive Engineer',
    officialRole: 'Water Resources Officer',
    state: 'Tamil Nadu',
    districtOffice: 'Chennai Water Resources Office',
    officialEmail: 'f.anand@tn.gov.in',
    officialMobile: '9876544835',
    password: 'GovPassword@123',
    registeredAt: _now,
  },
  {
    id: 'gov-demo-16',
    fullName: 'H. Suresh Kumar',
    employeeId: 'TN-ELEC-6629',
    department: 'Electricity Department',
    designation: 'Assistant Engineer',
    officialRole: 'Electricity Department Officer',
    state: 'Tamil Nadu',
    districtOffice: 'TANGEDCO Chennai South Division',
    officialEmail: 'h.sureshkumar@tn.gov.in',
    officialMobile: '9876544836',
    password: 'GovPassword@123',
    registeredAt: _now,
  },
  {
    id: 'gov-demo-17',
    fullName: 'J. Meenakshi',
    employeeId: 'TN-ULB-7740',
    department: 'Municipal Administration / Urban Local Body',
    designation: 'Municipal Inspector',
    officialRole: 'Municipal / Urban Local Body Officer',
    state: 'Tamil Nadu',
    districtOffice: 'Greater Chennai Corporation',
    officialEmail: 'j.meenakshi@tn.gov.in',
    officialMobile: '9876544837',
    password: 'GovPassword@123',
    registeredAt: _now,
  },
  {
    id: 'gov-demo-18',
    fullName: 'B. Ramachandran',
    employeeId: 'TN-TAX-8851',
    department: 'Property Tax Department',
    designation: 'Revenue Inspector (Property Tax)',
    officialRole: 'Property Tax Officer',
    state: 'Tamil Nadu',
    districtOffice: 'Chennai Property Tax Office',
    officialEmail: 'b.ramachandran@tn.gov.in',
    officialMobile: '9876544838',
    password: 'GovPassword@123',
    registeredAt: _now,
  },
  {
    id: 'gov-demo-19',
    fullName: 'TN DLR Records',
    employeeId: 'TN-DLR-9900',
    department: 'Department of Land Resources',
    designation: 'District Land Records Officer',
    officialRole: 'Land Records Officer',
    state: 'Tamil Nadu',
    districtOffice: 'Chennai Land Records Office',
    officialEmail: 'dlr.chennai@tn.gov.in',
    officialMobile: '9876544839',
    password: 'GovPassword@123',
    registeredAt: _now,
  },
  // ── State & System Admins ───────────────────────────────────────────────────
  {
    id: 'gov-demo-20',
    fullName: 'E. Palaniswami',
    employeeId: 'TN-ADMIN-0001',
    department: 'Revenue Department',
    designation: 'State Land Commissioner',
    officialRole: 'State Administrator',
    state: 'Tamil Nadu',
    districtOffice: 'Tamil Nadu Secretariat, Chennai',
    officialEmail: 'e.palaniswami@tn.gov.in',
    officialMobile: '9876544840',
    password: 'GovPassword@123',
    registeredAt: _now,
  },
  {
    id: 'gov-demo-21',
    fullName: 'System Admin',
    employeeId: 'SYS-ADMIN-001',
    department: 'Department of Land Resources',
    designation: 'System Administrator',
    officialRole: 'System Administrator',
    state: 'Delhi (NCT)',
    districtOffice: 'GeoNexus Platform Operations',
    officialEmail: 'sysadmin@landstack.gov.in',
    officialMobile: '9876544841',
    password: 'GovPassword@123',
    registeredAt: _now,
  },
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Citizen state
  const [registeredUsers, setRegisteredUsers] = useState<CitizenUser[]>(() => {
    try {
      const saved = localStorage.getItem('landstack_users');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch { /* ignore */ }
    return SEED_USERS;
  });

  const [currentUser, setCurrentUser] = useState<CitizenUser | null>(() => {
    try {
      const saved = localStorage.getItem('landstack_current_user');
      return saved ? JSON.parse(saved) : null;
    } catch { return null; }
  });

  const [prefillMobile, setPrefillMobileState] = useState<string>(() => {
    return localStorage.getItem('landstack_prefill_mobile') || '';
  });

  // Government state — always ensure seed users are present
  const [registeredGovUsers, setRegisteredGovUsers] = useState<GovernmentUser[]>(() => {
    try {
      const saved = localStorage.getItem('landstack_gov_users');
      if (saved) {
        const parsed = JSON.parse(saved) as GovernmentUser[];
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Merge: preserve any user-registered accounts while ensuring seed accounts exist
          const byKey = new Map(parsed.map((u) => [`${u.department}::${u.employeeId.toUpperCase()}`, u]));
          for (const seed of SEED_GOV_USERS) {
            const key = `${seed.department}::${seed.employeeId.toUpperCase()}`;
            if (!byKey.has(key)) byKey.set(key, seed);
          }
          return Array.from(byKey.values());
        }
      }
    } catch { /* ignore */ }
    return SEED_GOV_USERS;
  });

  const [currentGovUser, setCurrentGovUser] = useState<GovernmentUser | null>(() => {
    try {
      const saved = localStorage.getItem('landstack_current_gov_user');
      return saved ? JSON.parse(saved) : null;
    } catch { return null; }
  });

  const [prefillGovLogin, setPrefillGovLoginState] = useState<{
    department: string; employeeId: string;
  } | null>(() => {
    try {
      const saved = localStorage.getItem('landstack_prefill_gov');
      return saved ? JSON.parse(saved) : null;
    } catch { return null; }
  });

  // Persistence
  useEffect(() => { localStorage.setItem('landstack_users', JSON.stringify(registeredUsers)); }, [registeredUsers]);
  useEffect(() => {
    if (currentUser) { localStorage.setItem('landstack_current_user', JSON.stringify(currentUser)); }
    else { localStorage.removeItem('landstack_current_user'); }
  }, [currentUser]);

  useEffect(() => { localStorage.setItem('landstack_gov_users', JSON.stringify(registeredGovUsers)); }, [registeredGovUsers]);
  useEffect(() => {
    if (currentGovUser) { localStorage.setItem('landstack_current_gov_user', JSON.stringify(currentGovUser)); }
    else { localStorage.removeItem('landstack_current_gov_user'); }
  }, [currentGovUser]);

  const setPrefillMobile = (mobile: string) => {
    setPrefillMobileState(mobile);
    localStorage.setItem('landstack_prefill_mobile', mobile);
  };

  const setPrefillGovLogin = (val: { department: string; employeeId: string } | null) => {
    setPrefillGovLoginState(val);
    if (val) { localStorage.setItem('landstack_prefill_gov', JSON.stringify(val)); }
    else { localStorage.removeItem('landstack_prefill_gov'); }
  };

  // Citizen Login
  const login = async (mobile: string, password: string): Promise<{ success: boolean; message?: string }> => {
    await new Promise((resolve) => setTimeout(resolve, 600));
    const cleanMobile = mobile.replace(/\D/g, '');
    const user = registeredUsers.find((u) => u.mobile === cleanMobile && u.password === password);
    if (user) {
      setCurrentUser(user);
      localStorage.removeItem('landstack_prefill_mobile');
      setPrefillMobileState('');
      return { success: true };
    }
    return { success: false, message: 'Incorrect mobile number or password.' };
  };

  const logout = () => { setCurrentUser(null); };

  const registerUser = (userData: Omit<CitizenUser, 'id' | 'registeredAt'>): CitizenUser => {
    const newUser: CitizenUser = {
      ...userData,
      id: `user-${Date.now()}`,
      registeredAt: new Date().toISOString(),
    };
    setRegisteredUsers((prev) => {
      const filtered = prev.filter((u) => u.mobile !== newUser.mobile);
      return [...filtered, newUser];
    });
    setPrefillMobile(newUser.mobile);
    return newUser;
  };

  // Government Login
  const govLogin = async (
    department: string,
    employeeId: string,
    password: string
  ): Promise<{ success: boolean; message?: string }> => {
    await new Promise((resolve) => setTimeout(resolve, 650));
    const cleanEmpId = employeeId.trim().toUpperCase();
    const user = registeredGovUsers.find(
      (u) =>
        u.department === department &&
        u.employeeId.trim().toUpperCase() === cleanEmpId &&
        u.password === password
    );
    if (user) {
      setCurrentGovUser(user);
      setPrefillGovLogin(null);
      return { success: true };
    }
    return { success: false, message: 'Incorrect login credentials.' };
  };

  const govLogout = () => { setCurrentGovUser(null); };

  const registerGovUser = (userData: Omit<GovernmentUser, 'id' | 'registeredAt'>): GovernmentUser => {
    const newGovUser: GovernmentUser = {
      ...userData,
      id: `gov-user-${Date.now()}`,
      registeredAt: new Date().toISOString(),
    };
    setRegisteredGovUsers((prev) => {
      const filtered = prev.filter(
        (u) =>
          !(
            u.department === newGovUser.department &&
            u.employeeId.trim().toUpperCase() === newGovUser.employeeId.trim().toUpperCase()
          )
      );
      return [...filtered, newGovUser];
    });
    setPrefillGovLogin({ department: newGovUser.department, employeeId: newGovUser.employeeId });
    return newGovUser;
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        registeredUsers,
        prefillMobile,
        setPrefillMobile,
        login,
        logout,
        registerUser,
        currentGovUser,
        registeredGovUsers,
        prefillGovLogin,
        setPrefillGovLogin,
        govLogin,
        govLogout,
        registerGovUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
