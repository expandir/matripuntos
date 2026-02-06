/*
  # Fix infinite recursion in users RLS policy

  1. Bug Fix
    - The "Users can view couple members" policy caused infinite recursion
      because it queried the `users` table from within its own SELECT policy
    - Solution: create a SECURITY DEFINER helper function that bypasses RLS
      to get the current user's couple_id safely

  2. Changes
    - Drop the recursive policy
    - Create `get_my_couple_id()` function (SECURITY DEFINER, bypasses RLS)
    - Recreate "Users can view couple members" policy using the safe function
*/

DROP POLICY IF EXISTS "Users can view couple members" ON users;

CREATE OR REPLACE FUNCTION get_my_couple_id()
RETURNS text
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT couple_id FROM users WHERE id = auth.uid();
$$;

CREATE POLICY "Users can view couple members"
  ON users
  FOR SELECT
  TO authenticated
  USING (
    couple_id IS NOT NULL
    AND couple_id = get_my_couple_id()
  );
