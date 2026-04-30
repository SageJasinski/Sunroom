-- ============================================================
-- Migration: 005_create_device_telemetry
-- Hardware health reports from senior tablets
-- ============================================================

CREATE TABLE device_telemetry (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  device_id     UUID REFERENCES devices(id) ON DELETE CASCADE,
  family_id     UUID REFERENCES families(id) ON DELETE CASCADE,
  battery_level INTEGER,
  wifi_strength INTEGER,
  status        TEXT DEFAULT 'online',
  reported_at   TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE device_telemetry ENABLE ROW LEVEL SECURITY;

-- Only admins can read telemetry
CREATE POLICY "admin_read_telemetry" ON device_telemetry
  FOR SELECT
  TO authenticated
  USING (
    family_id IN (
      SELECT family_id FROM family_members
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Devices can insert their own telemetry (via service role in edge function)
-- The actual insert will happen through an Edge Function using the service role,
-- so we don't need an INSERT policy for authenticated users here.
