-- ============================================================
-- Migration: 004_create_devices
-- Device registry for headless senior tablets
-- ============================================================

CREATE TABLE devices (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  family_id       UUID REFERENCES families(id) ON DELETE CASCADE,
  device_name     TEXT DEFAULT 'Senior Tablet',
  provision_code  TEXT UNIQUE,
  status          TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'offline')),
  paired_at       TIMESTAMPTZ,
  created_at      TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE devices ENABLE ROW LEVEL SECURITY;

-- Family members can see devices in their family
CREATE POLICY "family_read_devices" ON devices
  FOR SELECT
  TO authenticated
  USING (
    family_id IN (
      SELECT family_id FROM family_members WHERE user_id = auth.uid()
    )
  );

-- Only admins can create devices
CREATE POLICY "admin_insert_devices" ON devices
  FOR INSERT
  TO authenticated
  WITH CHECK (
    family_id IN (
      SELECT family_id FROM family_members
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Only admins can update device records
CREATE POLICY "admin_update_devices" ON devices
  FOR UPDATE
  TO authenticated
  USING (
    family_id IN (
      SELECT family_id FROM family_members
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );
