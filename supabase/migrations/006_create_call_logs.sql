-- ============================================================
-- Migration: 006_create_call_logs
-- Records of all video calls for analytics
-- ============================================================

CREATE TABLE call_logs (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  family_id           UUID REFERENCES families(id) ON DELETE CASCADE,
  caller_id           UUID REFERENCES profiles(id) ON DELETE SET NULL,
  receiver_device_id  UUID REFERENCES devices(id) ON DELETE SET NULL,
  call_mode           TEXT NOT NULL DEFAULT 'regular' CHECK (call_mode IN ('regular', 'auto_answer')),
  duration_seconds    INTEGER DEFAULT 0,
  status              TEXT DEFAULT 'ringing' CHECK (status IN ('ringing', 'answered', 'declined', 'missed', 'ended')),
  started_at          TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE call_logs ENABLE ROW LEVEL SECURITY;

-- Family members can read call logs for their family
CREATE POLICY "family_read_call_logs" ON call_logs
  FOR SELECT
  TO authenticated
  USING (
    family_id IN (
      SELECT family_id FROM family_members WHERE user_id = auth.uid()
    )
  );
