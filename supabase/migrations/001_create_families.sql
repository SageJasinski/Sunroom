-- ============================================================
-- Migration: 001_create_families
-- Creates the families table (multi-tenant root)
-- ============================================================

CREATE TABLE families (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL,
  invite_code TEXT UNIQUE NOT NULL DEFAULT encode(gen_random_bytes(6), 'hex'),
  created_at  TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE families ENABLE ROW LEVEL SECURITY;

-- Family members can read their own family
CREATE POLICY "family_member_read" ON families
  FOR SELECT
  TO authenticated
  USING (
    id IN (
      SELECT family_id FROM family_members WHERE user_id = auth.uid()
    )
  );
