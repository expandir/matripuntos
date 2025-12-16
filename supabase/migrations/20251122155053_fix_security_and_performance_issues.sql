/*
  # Fix Security and Performance Issues

  1. Performance Optimizations
    - Add missing index on history.user_id foreign key
    - Optimize RLS policies to use (select auth.uid()) instead of auth.uid()
    - Remove unused indexes to reduce overhead
  
  2. Changes
    - Add index: idx_history_user_id on history(user_id)
    - Drop unused indexes: idx_users_couple_id, idx_history_created_at
    - Recreate all RLS policies with optimized auth.uid() calls
  
  3. Security
    - All policies maintain same security level
    - Performance improved by caching auth.uid() evaluation
    - Leaked password protection must be enabled in Supabase Dashboard
*/

-- ============================================================================
-- STEP 1: Add missing index for foreign key
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_history_user_id ON history(user_id);

-- ============================================================================
-- STEP 2: Drop unused indexes
-- ============================================================================

DROP INDEX IF EXISTS idx_users_couple_id;
DROP INDEX IF EXISTS idx_history_created_at;

-- ============================================================================
-- STEP 3: Optimize RLS Policies - USERS table
-- ============================================================================

-- Drop old policies
DROP POLICY IF EXISTS "Users can view own profile" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;
DROP POLICY IF EXISTS "Users can insert own profile" ON users;

-- Recreate with optimized auth.uid() calls
CREATE POLICY "Users can view own profile"
  ON users FOR SELECT
  TO authenticated
  USING (id = (select auth.uid()));

CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  TO authenticated
  USING (id = (select auth.uid()))
  WITH CHECK (id = (select auth.uid()));

CREATE POLICY "Users can insert own profile"
  ON users FOR INSERT
  TO authenticated
  WITH CHECK (id = (select auth.uid()));

-- ============================================================================
-- STEP 4: Optimize RLS Policies - COUPLES table
-- ============================================================================

-- Drop old policy
DROP POLICY IF EXISTS "Couple members can update couple data" ON couples;

-- Recreate with optimized auth.uid() call
CREATE POLICY "Couple members can update couple data"
  ON couples FOR UPDATE
  TO authenticated
  USING (id IN (
    SELECT couple_id 
    FROM users 
    WHERE id = (select auth.uid())
  ))
  WITH CHECK (id IN (
    SELECT couple_id 
    FROM users 
    WHERE id = (select auth.uid())
  ));

-- ============================================================================
-- STEP 5: Optimize RLS Policies - REWARDS table
-- ============================================================================

-- Drop old policies
DROP POLICY IF EXISTS "Couple members can view rewards" ON rewards;
DROP POLICY IF EXISTS "Couple members can insert rewards" ON rewards;
DROP POLICY IF EXISTS "Couple members can update rewards" ON rewards;
DROP POLICY IF EXISTS "Couple members can delete rewards" ON rewards;

-- Recreate with optimized auth.uid() calls
CREATE POLICY "Couple members can view rewards"
  ON rewards FOR SELECT
  TO authenticated
  USING (couple_id IN (
    SELECT couple_id 
    FROM users 
    WHERE id = (select auth.uid())
  ));

CREATE POLICY "Couple members can insert rewards"
  ON rewards FOR INSERT
  TO authenticated
  WITH CHECK (couple_id IN (
    SELECT couple_id 
    FROM users 
    WHERE id = (select auth.uid())
  ));

CREATE POLICY "Couple members can update rewards"
  ON rewards FOR UPDATE
  TO authenticated
  USING (couple_id IN (
    SELECT couple_id 
    FROM users 
    WHERE id = (select auth.uid())
  ))
  WITH CHECK (couple_id IN (
    SELECT couple_id 
    FROM users 
    WHERE id = (select auth.uid())
  ));

CREATE POLICY "Couple members can delete rewards"
  ON rewards FOR DELETE
  TO authenticated
  USING (couple_id IN (
    SELECT couple_id 
    FROM users 
    WHERE id = (select auth.uid())
  ));

-- ============================================================================
-- STEP 6: Optimize RLS Policies - HISTORY table
-- ============================================================================

-- Drop old policies
DROP POLICY IF EXISTS "Couple members can view history" ON history;
DROP POLICY IF EXISTS "Couple members can insert history" ON history;

-- Recreate with optimized auth.uid() calls
CREATE POLICY "Couple members can view history"
  ON history FOR SELECT
  TO authenticated
  USING (
    user_id IN (
      SELECT id 
      FROM users 
      WHERE couple_id = (
        SELECT couple_id 
        FROM users 
        WHERE id = (select auth.uid())
      )
    )
  );

CREATE POLICY "Couple members can insert history"
  ON history FOR INSERT
  TO authenticated
  WITH CHECK (
    user_id IN (
      SELECT id 
      FROM users 
      WHERE couple_id = (
        SELECT couple_id 
        FROM users 
        WHERE id = (select auth.uid())
      )
    )
  );

-- ============================================================================
-- VERIFICATION QUERIES (commented, for reference)
-- ============================================================================

-- Verify indexes:
-- SELECT tablename, indexname FROM pg_indexes WHERE schemaname = 'public' ORDER BY tablename, indexname;

-- Verify RLS policies:
-- SELECT tablename, policyname, cmd FROM pg_policies WHERE schemaname = 'public' ORDER BY tablename, policyname;

-- Note: Leaked Password Protection must be enabled manually in Supabase Dashboard:
-- Go to Authentication > Providers > Email > Advanced Settings
-- Enable "Leaked Password Protection"
