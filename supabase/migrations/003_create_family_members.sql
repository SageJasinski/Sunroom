-- ============================================================
-- Migration: 003_create_family_members
-- Junction table for RBAC: admin, member, senior
-- ============================================================

CREATE TABLE family_members (
  family_id          UUID REFERENCES families(id) ON DELETE CASCADE,
  user_id            UUID REFERENCES profiles(id) ON DELETE CASCADE,
  role               TEXT NOT NULL CHECK (role IN ('admin', 'member', 'senior')),
  is_trusted_caller  BOOLEAN DEFAULT false,
  joined_at          TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (family_id, user_id)
);

ALTER TABLE family_members ENABLE ROW LEVEL SECURITY;

-- Members can see other members in their family
CREATE POLICY "see_family_members" ON family_members
  FOR SELECT
  TO authenticated
  USING (
    family_id IN (
      SELECT family_id FROM family_members WHERE user_id = auth.uid()
    )
  );

-- Only admins can update family member records (e.g. trusted caller toggle)
CREATE POLICY "admin_update_members" ON family_members
  FOR UPDATE
  TO authenticated
  USING (
    family_id IN (
      SELECT family_id FROM family_members
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  )
  WITH CHECK (
    family_id IN (
      SELECT family_id FROM family_members
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Admins can insert new family members (via invite flow)
CREATE POLICY "admin_insert_members" ON family_members
  FOR INSERT
  TO authenticated
  WITH CHECK (
    family_id IN (
      SELECT family_id FROM family_members
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );
