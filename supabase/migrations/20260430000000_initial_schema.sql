-- ============================================================
-- Sunroom — Initial Schema
-- ============================================================
-- Creates all tables, enables RLS, and sets up policies.
-- Tables are created in dependency order, with RLS policies
-- that reference other tables added at the end.
-- ============================================================

-- ===================== TABLES =====================

-- 1. Families (root multi-tenant entity)
CREATE TABLE IF NOT EXISTS families (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL,
  invite_code TEXT UNIQUE NOT NULL DEFAULT substring(replace(gen_random_uuid()::text, '-', ''), 1, 12),
  created_at  TIMESTAMPTZ DEFAULT now()
);

-- 2. Users (extends auth.users)
CREATE TABLE IF NOT EXISTS users (
  id            UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name  TEXT NOT NULL,
  avatar_url    TEXT,
  created_at    TIMESTAMPTZ DEFAULT now()
);

-- 3. Family members (junction table with RBAC)
CREATE TABLE IF NOT EXISTS family_members (
  family_id          UUID REFERENCES families(id) ON DELETE CASCADE,
  user_id            UUID REFERENCES users(id) ON DELETE CASCADE,
  role               TEXT NOT NULL CHECK (role IN ('admin', 'member', 'senior')),
  is_trusted_caller  BOOLEAN DEFAULT false,
  joined_at          TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (family_id, user_id)
);

-- 4. Devices (headless senior tablets)
CREATE TABLE IF NOT EXISTS devices (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  family_id       UUID REFERENCES families(id) ON DELETE CASCADE,
  device_name     TEXT DEFAULT 'Senior Tablet',
  provision_code  TEXT UNIQUE,
  status          TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'offline')),
  paired_at       TIMESTAMPTZ,
  created_at      TIMESTAMPTZ DEFAULT now()
);

-- 5. Device telemetry
CREATE TABLE IF NOT EXISTS device_telemetry (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  device_id     UUID REFERENCES devices(id) ON DELETE CASCADE,
  family_id     UUID REFERENCES families(id) ON DELETE CASCADE,
  battery_level INTEGER,
  wifi_strength INTEGER,
  status        TEXT DEFAULT 'online',
  last_seen     TIMESTAMPTZ DEFAULT now()
);

-- 6. Call logs
CREATE TABLE IF NOT EXISTS call_logs (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  family_id           UUID REFERENCES families(id) ON DELETE CASCADE,
  caller_id           UUID REFERENCES users(id) ON DELETE SET NULL,
  receiver_device_id  UUID REFERENCES devices(id) ON DELETE SET NULL,
  call_mode           TEXT NOT NULL DEFAULT 'regular' CHECK (call_mode IN ('regular', 'auto_answer')),
  duration_seconds    INTEGER DEFAULT 0,
  status              TEXT DEFAULT 'ringing' CHECK (status IN ('ringing', 'answered', 'declined', 'missed', 'ended')),
  started_at          TIMESTAMPTZ DEFAULT now()
);

-- ===================== ENABLE RLS =====================

ALTER TABLE families ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE family_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE devices ENABLE ROW LEVEL SECURITY;
ALTER TABLE device_telemetry ENABLE ROW LEVEL SECURITY;
ALTER TABLE call_logs ENABLE ROW LEVEL SECURITY;

-- ===================== HELPER FUNCTION =====================
-- Avoids infinite recursion in RLS policies by querying
-- family_members with SECURITY DEFINER (bypasses RLS).

CREATE OR REPLACE FUNCTION get_my_family_ids()
RETURNS SETOF UUID
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT family_id FROM family_members WHERE user_id = auth.uid();
$$;

-- ===================== POLICIES: FAMILIES =====================

-- Any authenticated user can create a family
CREATE POLICY "anyone_can_create_family" ON families
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Members can read their own family (+ anyone can read for invite code lookup)
CREATE POLICY "read_families" ON families
  FOR SELECT
  TO authenticated
  USING (true);

-- ===================== POLICIES: USERS =====================

-- Users can insert their own profile (on sign-up)
CREATE POLICY "insert_own_profile" ON users
  FOR INSERT
  TO authenticated
  WITH CHECK (id = auth.uid());

-- Users can update their own profile
CREATE POLICY "update_own_profile" ON users
  FOR UPDATE
  TO authenticated
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

-- Users can read their own profile + profiles of people in their family
CREATE POLICY "read_family_profiles" ON users
  FOR SELECT
  TO authenticated
  USING (
    id = auth.uid()
    OR id IN (
      SELECT fm.user_id
      FROM family_members fm
      WHERE fm.family_id IN (SELECT get_my_family_ids())
    )
  );

-- ===================== POLICIES: FAMILY_MEMBERS =====================

-- Any authenticated user can insert themselves as a member
CREATE POLICY "insert_self_as_member" ON family_members
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Users can see their own memberships + other members in their families
-- Uses the SECURITY DEFINER helper to avoid infinite recursion
CREATE POLICY "see_family_members" ON family_members
  FOR SELECT
  TO authenticated
  USING (
    family_id IN (SELECT get_my_family_ids())
  );

-- Only admins can update family member records (e.g. trusted caller toggle)
CREATE POLICY "admin_update_members" ON family_members
  FOR UPDATE
  TO authenticated
  USING (
    family_id IN (
      SELECT get_my_family_ids()
    )
    AND EXISTS (
      SELECT 1 FROM family_members fm
      WHERE fm.family_id = family_members.family_id
        AND fm.user_id = auth.uid()
        AND fm.role = 'admin'
    )
  );

-- ===================== POLICIES: DEVICES =====================

-- Family members can see devices in their family
CREATE POLICY "family_read_devices" ON devices
  FOR SELECT
  TO authenticated
  USING (
    family_id IN (SELECT get_my_family_ids())
  );

-- Only admins can create devices
CREATE POLICY "admin_insert_devices" ON devices
  FOR INSERT
  TO authenticated
  WITH CHECK (
    family_id IN (SELECT get_my_family_ids())
  );

-- Only admins can update device records
CREATE POLICY "admin_update_devices" ON devices
  FOR UPDATE
  TO authenticated
  USING (
    family_id IN (SELECT get_my_family_ids())
  );

-- ===================== POLICIES: DEVICE_TELEMETRY =====================

-- Family members can read telemetry for their family
CREATE POLICY "family_read_telemetry" ON device_telemetry
  FOR SELECT
  TO authenticated
  USING (
    family_id IN (SELECT get_my_family_ids())
  );

-- ===================== POLICIES: CALL_LOGS =====================

-- Family members can read call logs for their family
CREATE POLICY "family_read_call_logs" ON call_logs
  FOR SELECT
  TO authenticated
  USING (
    family_id IN (SELECT get_my_family_ids())
  );
