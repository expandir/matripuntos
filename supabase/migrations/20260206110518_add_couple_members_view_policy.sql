/*
  # Allow couple members to view each other's profiles

  1. Security Changes
    - Add policy allowing authenticated users to view profiles of members in the same couple
    - This is needed so partners can see each other's names in the validation flow

  2. Important Notes
    - Users can only see other users who share the same `couple_id`
    - The existing "Users can view own profile" policy remains as fallback
*/

DROP POLICY IF EXISTS "Users can view couple members" ON users;

CREATE POLICY "Users can view couple members"
  ON users
  FOR SELECT
  TO authenticated
  USING (
    couple_id IS NOT NULL
    AND couple_id = (SELECT u.couple_id FROM users u WHERE u.id = (SELECT auth.uid()))
  );
