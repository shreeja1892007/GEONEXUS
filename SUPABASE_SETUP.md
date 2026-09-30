# Land Stack — Supabase Setup Guide

This guide explains how to connect your Land Stack application to a shared **Supabase PostgreSQL** database.

---

## Step 1: Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com) and log in or create a free account.
2. Click **New Project**.
3. Set your project name (e.g. `LandStack`), set a secure database password, and select your preferred region.
4. Wait a couple of minutes for your Supabase database to finish provisioning.

---

## Step 2: Run Database Migration SQL

1. In your Supabase Dashboard, click **SQL Editor** in the left sidebar.
2. Click **New Query**.
3. Open the migration file [`supabase/migrations/001_landstack_applications.sql`](./supabase/migrations/001_landstack_applications.sql) in this repository, copy its entire contents, and paste it into the SQL Editor.
4. Click **Run** (or press `Ctrl+Enter`).
5. Verify that the tables `government_profiles`, `citizen_applications`, `application_status_history`, and `citizen_notifications` were created successfully.

---

## Step 3: Configure Environment Variables

1. In your Supabase Dashboard, go to **Project Settings** (gear icon) $\to$ **API**.
2. Copy the **Project URL** and the **anon public API key**.
3. In the root directory of this project (`GeoNexus`), create a file named `.env`:

```env
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-actual-anon-public-key
```

> ⚠️ **IMPORTANT SECURITY NOTICE**:
> - Use ONLY the `anon` / `public` API key in frontend code.
> - **NEVER** expose your `service_role` secret key in Vite environment variables or commit it to source control.

---

## Step 4: Restart the Development Server

If Vite is currently running, restart it to load the new `.env` variables:

```bash
npm run dev
```

---

## Verification & Testing Across Browsers

1. **Submit Application as Citizen (Browser A)**:
   - Open [http://localhost:5173/citizen/login](http://localhost:5173/citizen/login) $\to$ Login with `9876543210` / `Password@123`.
   - Submit an application (e.g., *Transfer Patta after purchasing land* in *Chennai, Tamil Nadu*).

2. **View Application as Government Officer (Browser B or Incognito)**:
   - Open [http://localhost:5173/government/login](http://localhost:5173/government/login) in another browser window.
   - Expand **Prototype Demo Accounts** and click **Use** for `TN-REV-1042` (*Revenue Department / Revenue Officer*).
   - Go to **Citizen Requests** ([`/government/requests`](http://localhost:5173/government/requests)).
   - The application submitted from Browser A will appear in real time!

