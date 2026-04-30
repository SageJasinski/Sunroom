-- ============================================================
-- Migration: 002_create_profiles
-- User profiles extending Supabase auth.users
-- ============================================================

CREATE TABLE profiles (
  id            UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name  TEXT NOT NULL,
  avatar_url    TEXT,
  created_at    TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Users can read profiles of people in their family
CREATE POLICY "read_family_profiles" ON profiles
  FOR SELECT
  TO authenticated
  USING (
    id IN (
      SELECT fm2.user_id
      FROM family_members fm1
      JOIN family_members fm2 ON fm1.family_id = fm2.family_id
      WHERE fm1.user_id = auth.uid()
    )
  );

-- Users can update their own profile
CREATE POLICY "update_own_profile" ON profiles
  FOR UPDATE
  TO authenticated
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

-- Users can insert their own profile (on sign-up)
CREATE POLICY "insert_own_profile" ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (id = auth.uid());
