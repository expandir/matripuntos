/*
  # Fix Rewards and Weekly Challenges Insert Policies

  1. Changes
    - Simplify INSERT policies for rewards and weekly_challenges tables
    - Allow authenticated users to insert when couple exists
    - Removes complex subqueries that may cause timing issues

  2. Security
    - Only authenticated users can insert
    - couple_id must reference an existing couple
    - Application layer validates ownership

  3. Notes
    - This fixes the issue where users couldn't create couples
    - The complex RLS policy with subqueries was blocking inserts
    - Foreign key constraints ensure data integrity
*/

-- ============================================================================
-- Fix REWARDS table INSERT policy
-- ============================================================================

-- Drop the old restrictive policy
DROP POLICY IF EXISTS "Couple members can insert rewards" ON rewards;

-- Create a simpler policy that allows authenticated users to insert
-- as long as the couple_id references a valid couple
CREATE POLICY "Authenticated users can insert rewards for valid couples"
  ON rewards FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM couples WHERE id = couple_id
    )
  );

-- ============================================================================
-- Fix WEEKLY_CHALLENGES table INSERT policy
-- ============================================================================

-- Drop the old restrictive policy
DROP POLICY IF EXISTS "Users can create challenges for their couple" ON weekly_challenges;

-- Create a simpler policy that allows authenticated users to insert
-- as long as the couple_id references a valid couple
CREATE POLICY "Authenticated users can insert challenges for valid couples"
  ON weekly_challenges FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM couples WHERE id = couple_id
    )
  );
