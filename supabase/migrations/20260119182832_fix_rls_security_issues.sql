/*
  # Fix RLS Security Issues

  This migration addresses multiple security and performance issues:

  1. **RLS Performance Optimization**
     - Updates all policies to use `(select auth.uid())` instead of `auth.uid()`
     - This prevents re-evaluation of the auth function for each row
     - Affects tables: weekly_challenges, messages, catalog_completions, push_subscriptions, user_achievements

  2. **Remove Duplicate Policies**
     - Removes redundant policies on the `messages` table
     - Keeps the more descriptive policy names

  3. **Fix Always-True RLS Policies**
     - Updates INSERT policies on achievements, couples, and points_catalog
     - Adds proper ownership checks instead of allowing unrestricted access

  4. **Configuration Notes**
     - Auth DB Connection Strategy: Requires manual change in Supabase dashboard
     - Leaked Password Protection: Requires enabling in Supabase Auth settings
*/

-- =============================================
-- 1. FIX WEEKLY_CHALLENGES RLS POLICIES
-- =============================================

DROP POLICY IF EXISTS "Users can view their couple's challenges" ON weekly_challenges;
CREATE POLICY "Users can view their couple's challenges"
  ON weekly_challenges
  FOR SELECT
  TO authenticated
  USING (
    couple_id IN (
      SELECT couple_id 
      FROM users 
      WHERE id = (select auth.uid())
    )
  );

DROP POLICY IF EXISTS "Users can update their couple's challenges" ON weekly_challenges;
CREATE POLICY "Users can update their couple's challenges"
  ON weekly_challenges
  FOR UPDATE
  TO authenticated
  USING (
    couple_id IN (
      SELECT couple_id 
      FROM users 
      WHERE id = (select auth.uid())
    )
  )
  WITH CHECK (
    couple_id IN (
      SELECT couple_id 
      FROM users 
      WHERE id = (select auth.uid())
    )
  );

-- =============================================
-- 2. FIX MESSAGES RLS POLICIES (Remove Duplicates)
-- =============================================

-- Remove old duplicate policies
DROP POLICY IF EXISTS "Couple members can view messages" ON messages;
DROP POLICY IF EXISTS "Couple members can send messages" ON messages;
DROP POLICY IF EXISTS "Couple members can mark messages as read" ON messages;

-- Keep the better-named policies and optimize them
DROP POLICY IF EXISTS "Users can view messages from their couple" ON messages;
CREATE POLICY "Users can view messages from their couple"
  ON messages
  FOR SELECT
  TO authenticated
  USING (
    couple_id IN (
      SELECT couple_id 
      FROM users 
      WHERE id = (select auth.uid())
    )
  );

DROP POLICY IF EXISTS "Users can create messages for their couple" ON messages;
CREATE POLICY "Users can create messages for their couple"
  ON messages
  FOR INSERT
  TO authenticated
  WITH CHECK (
    couple_id IN (
      SELECT couple_id 
      FROM users 
      WHERE id = (select auth.uid())
    )
    AND sender_id = (select auth.uid())
  );

DROP POLICY IF EXISTS "Users can update read status on messages from their couple" ON messages;
CREATE POLICY "Users can update read status on messages from their couple"
  ON messages
  FOR UPDATE
  TO authenticated
  USING (
    couple_id IN (
      SELECT couple_id 
      FROM users 
      WHERE id = (select auth.uid())
    )
    AND sender_id != (select auth.uid())
  )
  WITH CHECK (
    couple_id IN (
      SELECT couple_id 
      FROM users 
      WHERE id = (select auth.uid())
    )
  );

-- =============================================
-- 3. FIX CATALOG_COMPLETIONS RLS POLICIES
-- =============================================

DROP POLICY IF EXISTS "Users can view their couple's completions" ON catalog_completions;
CREATE POLICY "Users can view their couple's completions"
  ON catalog_completions
  FOR SELECT
  TO authenticated
  USING (
    couple_id IN (
      SELECT couple_id 
      FROM users 
      WHERE id = (select auth.uid())
    )
  );

DROP POLICY IF EXISTS "Users can create completions for their couple" ON catalog_completions;
CREATE POLICY "Users can create completions for their couple"
  ON catalog_completions
  FOR INSERT
  TO authenticated
  WITH CHECK (
    couple_id IN (
      SELECT couple_id 
      FROM users 
      WHERE id = (select auth.uid())
    )
    AND user_id = (select auth.uid())
  );

-- =============================================
-- 4. FIX PUSH_SUBSCRIPTIONS RLS POLICIES
-- =============================================

DROP POLICY IF EXISTS "Users can view own subscriptions" ON push_subscriptions;
CREATE POLICY "Users can view own subscriptions"
  ON push_subscriptions
  FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can create own subscriptions" ON push_subscriptions;
CREATE POLICY "Users can create own subscriptions"
  ON push_subscriptions
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can update own subscriptions" ON push_subscriptions;
CREATE POLICY "Users can update own subscriptions"
  ON push_subscriptions
  FOR UPDATE
  TO authenticated
  USING (user_id = (select auth.uid()))
  WITH CHECK (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can delete own subscriptions" ON push_subscriptions;
CREATE POLICY "Users can delete own subscriptions"
  ON push_subscriptions
  FOR DELETE
  TO authenticated
  USING (user_id = (select auth.uid()));

-- =============================================
-- 5. FIX USER_ACHIEVEMENTS RLS POLICIES
-- =============================================

DROP POLICY IF EXISTS "Users can view own achievements" ON user_achievements;
CREATE POLICY "Users can view own achievements"
  ON user_achievements
  FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can unlock own achievements" ON user_achievements;
CREATE POLICY "Users can unlock own achievements"
  ON user_achievements
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can update own achievement progress" ON user_achievements;
CREATE POLICY "Users can update own achievement progress"
  ON user_achievements
  FOR UPDATE
  TO authenticated
  USING (user_id = (select auth.uid()))
  WITH CHECK (user_id = (select auth.uid()));

-- =============================================
-- 6. FIX ALWAYS-TRUE RLS POLICIES
-- =============================================

-- Fix achievements INSERT policy
-- Only allow seeding if no achievements exist yet
DROP POLICY IF EXISTS "Authenticated users can insert achievements" ON achievements;
CREATE POLICY "Authenticated users can insert achievements"
  ON achievements
  FOR INSERT
  TO authenticated
  WITH CHECK (
    NOT EXISTS (SELECT 1 FROM achievements LIMIT 1)
  );

-- Fix couples INSERT policy
-- Users can only create a couple if they don't already have one
DROP POLICY IF EXISTS "Authenticated users can create couples" ON couples;
CREATE POLICY "Authenticated users can create couples"
  ON couples
  FOR INSERT
  TO authenticated
  WITH CHECK (
    NOT EXISTS (
      SELECT 1 
      FROM users 
      WHERE id = (select auth.uid()) 
      AND couple_id IS NOT NULL
    )
  );

-- Fix points_catalog INSERT policy
-- Only allow seeding if no catalog items exist yet
DROP POLICY IF EXISTS "Authenticated users can insert catalog items" ON points_catalog;
CREATE POLICY "Authenticated users can insert catalog items"
  ON points_catalog
  FOR INSERT
  TO authenticated
  WITH CHECK (
    NOT EXISTS (SELECT 1 FROM points_catalog LIMIT 1)
  );
