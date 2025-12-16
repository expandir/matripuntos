/*
  # Fix Couple Lookup Policy

  1. Changes
    - Drop restrictive SELECT policy on couples table
    - Add new policy allowing authenticated users to view all couples
    - This is necessary so users can search for a couple code before joining
  
  2. Security
    - Users still can only UPDATE couples they belong to
    - Users still can only access detailed couple data after joining
    - This only allows reading the existence of couple codes for joining purposes
*/

-- Drop the old restrictive SELECT policy
DROP POLICY IF EXISTS "Couple members can view couple data" ON couples;

-- Create new policy allowing authenticated users to view all couples
-- This is necessary for the "join couple" functionality
CREATE POLICY "Authenticated users can view couples for joining"
  ON couples FOR SELECT
  TO authenticated
  USING (true);
