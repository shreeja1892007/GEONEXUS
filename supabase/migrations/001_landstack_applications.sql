-- =============================================================================
-- LAND STACK — SUPABASE DATABASE MIGRATION
-- Migration: 001_landstack_applications.sql
-- Description: Creates core schema for shared Citizen Applications, Status History,
--              Government Profiles, and Notifications.
-- =============================================================================

-- 1. GOVERNMENT PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.government_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_id TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    department TEXT NOT NULL,
    role TEXT NOT NULL,
    designation TEXT,
    state TEXT NOT NULL,
    district TEXT,
    office TEXT,
    access_scope TEXT DEFAULT 'OFFICER', -- OFFICER, DISTRICT_ADMIN, STATE_ADMIN, SYSTEM_ADMIN, AUDITOR
    account_status TEXT DEFAULT 'ACTIVE',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. CITIZEN APPLICATIONS TABLE
-- NOTE: NEVER STORE AADHAAR NUMBERS OR PASSWORDS IN THIS TABLE
CREATE TABLE IF NOT EXISTS public.citizen_applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    application_id TEXT UNIQUE NOT NULL,
    citizen_id TEXT NOT NULL,
    citizen_name TEXT,
    citizen_email TEXT,
    citizen_mobile TEXT,
    purpose_id TEXT NOT NULL,
    purpose_label TEXT NOT NULL,
    category TEXT,
    target_department TEXT NOT NULL,
    target_role TEXT NOT NULL,
    fallback_department TEXT,
    fallback_role TEXT,
    collaborating_departments JSONB DEFAULT '[]'::jsonb,
    collaborating_roles JSONB DEFAULT '[]'::jsonb,
    state TEXT NOT NULL,
    district TEXT NOT NULL,
    office TEXT,
    local_body TEXT,
    village_or_ward TEXT,
    parcel_id TEXT,
    ulpin TEXT,
    survey_number TEXT,
    property_id TEXT,
    location_description TEXT,
    request_details JSONB DEFAULT '{}'::jsonb,
    documents JSONB DEFAULT '[]'::jsonb,
    status TEXT NOT NULL DEFAULT 'Submitted',
    priority TEXT DEFAULT 'Normal',
    assigned_officer_id TEXT,
    assigned_officer_name TEXT,
    citizen_remarks TEXT,
    officer_remarks TEXT,
    rejection_reason TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. APPLICATION STATUS HISTORY TABLE
CREATE TABLE IF NOT EXISTS public.application_status_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    application_id TEXT NOT NULL,
    status TEXT NOT NULL,
    message TEXT,
    changed_by_type TEXT,
    changed_by_id TEXT,
    changed_by_name TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. CITIZEN NOTIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS public.citizen_notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    citizen_id TEXT NOT NULL,
    application_id TEXT,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================================================
-- INDEXES FOR HIGH-PERFORMANCE QUERYING & ROUTING
-- =============================================================================
CREATE INDEX IF NOT EXISTS idx_applications_department ON public.citizen_applications(target_department);
CREATE INDEX IF NOT EXISTS idx_applications_role ON public.citizen_applications(target_role);
CREATE INDEX IF NOT EXISTS idx_applications_jurisdiction ON public.citizen_applications(state, district);
CREATE INDEX IF NOT EXISTS idx_applications_citizen ON public.citizen_applications(citizen_id);
CREATE INDEX IF NOT EXISTS idx_applications_status ON public.citizen_applications(status);
CREATE INDEX IF NOT EXISTS idx_applications_created ON public.citizen_applications(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_history_app_id ON public.application_status_history(application_id);
CREATE INDEX IF NOT EXISTS idx_notifications_citizen ON public.citizen_notifications(citizen_id);

-- =============================================================================
-- UPDATED_AT TRIGGER FUNCTION
-- =============================================================================
CREATE OR REPLACE FUNCTION public.set_updated_at_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_set_updated_at_applications ON public.citizen_applications;
CREATE TRIGGER trigger_set_updated_at_applications
    BEFORE UPDATE ON public.citizen_applications
    FOR EACH ROW
    EXECUTE FUNCTION public.set_updated_at_timestamp();

DROP TRIGGER IF EXISTS trigger_set_updated_at_gov_profiles ON public.government_profiles;
CREATE TRIGGER trigger_set_updated_at_gov_profiles
    BEFORE UPDATE ON public.government_profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.set_updated_at_timestamp();

-- =============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =============================================================================
-- DEMO POLICY — NOT FOR PRODUCTION.
-- The policies below enable full read/write access for anon/prototype API keys.
-- For production deployment, configure Supabase Auth JWT claims to enforce server-side RLS.

ALTER TABLE public.government_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.citizen_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.application_status_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.citizen_notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read/write on government_profiles (DEMO)"
    ON public.government_profiles FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow public read/write on citizen_applications (DEMO)"
    ON public.citizen_applications FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow public read/write on application_status_history (DEMO)"
    ON public.application_status_history FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow public read/write on citizen_notifications (DEMO)"
    ON public.citizen_notifications FOR ALL USING (true) WITH CHECK (true);

-- Enable Supabase Realtime for instant application updates across browser sessions
ALTER PUBLICATION supabase_realtime ADD TABLE public.citizen_applications;
ALTER PUBLICATION supabase_realtime ADD TABLE public.application_status_history;
ALTER PUBLICATION supabase_realtime ADD TABLE public.citizen_notifications;

-- =============================================================================
-- SEED DATA — PROTOTYPE GOVERNMENT PROFILES
-- =============================================================================
INSERT INTO public.government_profiles (employee_id, full_name, department, role, designation, state, district, office, access_scope)
VALUES
  ('TN-REV-1042', 'R. Krishnamurthy', 'Revenue Department', 'Revenue Officer', 'Revenue Inspector', 'Tamil Nadu', 'Chennai', 'Chennai Revenue Office', 'OFFICER'),
  ('TN-SURV-2241', 'S. Murugesan', 'Survey & Settlement Department', 'Survey Officer', 'Survey Inspector', 'Tamil Nadu', 'Chennai', 'Chennai Survey Office', 'OFFICER'),
  ('TN-REG-3301', 'A. Rajendran', 'Registration Department', 'Registration Officer', 'Sub-Registrar', 'Tamil Nadu', 'Chennai', 'Chennai Sub-Registrar Office', 'OFFICER'),
  ('TN-WSD-4412', 'P. Soundarajan', 'Water & Sewerage Department', 'Water & Sewerage Officer', 'Junior Engineer', 'Tamil Nadu', 'Chennai', 'Chennai Water Board Office', 'OFFICER'),
  ('TN-ELEC-6629', 'H. Suresh Kumar', 'Electricity Department', 'Electricity Department Officer', 'Assistant Engineer', 'Tamil Nadu', 'Chennai', 'TANGEDCO Chennai South Division', 'OFFICER'),
  ('TN-TCP-5521', 'K. Balasubramanian', 'Town & Country Planning Department', 'Town Planning Officer', 'Town Planning Inspector', 'Tamil Nadu', 'Chennai', 'Chennai Planning Authority', 'OFFICER'),
  ('TN-LEG-6630', 'V. Natarajan', 'Legal / Dispute Management Department', 'Legal / Dispute Management Officer', 'Legal Officer', 'Tamil Nadu', 'Chennai', 'Chennai Legal Cell Office', 'OFFICER'),
  ('TN-ARCH-7741', 'M. Deivanayagam', 'Archaeology / Heritage Department', 'Archaeology / Heritage Officer', 'Assistant Archaeological Officer', 'Tamil Nadu', 'Chennai', 'Tamil Nadu Archaeology Dept, Chennai', 'OFFICER'),
  ('TN-LAQ-8852', 'G. Subramaniam', 'Land Acquisition / Revenue Department', 'Land Acquisition Officer', 'Special Tahsildar (Land Acquisition)', 'Tamil Nadu', 'Chennai', 'Chennai District Collectorate (LA)', 'OFFICER'),
  ('TN-DM-9963', 'T. Ramasamy', 'Disaster Management Department', 'Disaster Management Officer', 'Disaster Management Officer', 'Tamil Nadu', 'Chennai', 'Chennai Disaster Management Cell', 'OFFICER'),
  ('TN-RDP-1174', 'C. Ponnazhagan', 'Rural Development / Panchayat Department', 'Rural Development / Panchayat Officer', 'Block Development Officer', 'Tamil Nadu', 'Chennai', 'Chennai Panchayat Development Office', 'OFFICER'),
  ('TN-FOR-2285', 'L. Suresh', 'Forest Department', 'Forest Department Officer', 'Forest Range Officer', 'Tamil Nadu', 'Chennai', 'Chennai Forest Division Office', 'OFFICER'),
  ('TN-ENV-3396', 'N. Vijayalakshmi', 'Environment Department', 'Environment Department Officer', 'Environmental Engineer', 'Tamil Nadu', 'Chennai', 'TNPCB Chennai Regional Office', 'OFFICER'),
  ('TN-HWY-4407', 'D. Annamalai', 'Highways Department', 'Highways Officer', 'Junior Engineer (Highways)', 'Tamil Nadu', 'Chennai', 'Chennai Highways Division', 'OFFICER'),
  ('TN-WRD-5518', 'F. Anand', 'Water Resources Department', 'Water Resources Officer', 'Assistant Executive Engineer', 'Tamil Nadu', 'Chennai', 'Chennai Water Resources Office', 'OFFICER'),
  ('TN-ULB-7740', 'J. Meenakshi', 'Municipal Administration / Urban Local Body', 'Municipal / Urban Local Body Officer', 'Municipal Inspector', 'Tamil Nadu', 'Chennai', 'Greater Chennai Corporation', 'OFFICER'),
  ('TN-TAX-8851', 'B. Ramachandran', 'Property Tax Department', 'Property Tax Officer', 'Revenue Inspector (Property Tax)', 'Tamil Nadu', 'Chennai', 'Chennai Property Tax Office', 'OFFICER'),
  ('TN-DLR-9900', 'TN DLR Records', 'Department of Land Resources', 'Land Records Officer', 'District Land Records Officer', 'Tamil Nadu', 'Chennai', 'Chennai Land Records Office', 'OFFICER'),
  ('TN-ADMIN-0001', 'E. Palaniswami', 'Revenue Department', 'State Administrator', 'State Land Commissioner', 'Tamil Nadu', 'Chennai', 'Tamil Nadu Secretariat, Chennai', 'STATE_ADMIN'),
  ('SYS-ADMIN-001', 'System Admin', 'Department of Land Resources', 'System Administrator', 'System Administrator', 'Delhi (NCT)', 'New Delhi', 'Land Stack Platform Operations', 'SYSTEM_ADMIN')
ON CONFLICT (employee_id) DO NOTHING;

