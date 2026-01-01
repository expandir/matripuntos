/*
  # Fix Points Catalog Insert Policy

  1. Changes
    - Add INSERT policy for points_catalog table to allow seeding
    - Policy allows authenticated users to insert catalog items
    
  2. Security
    - Only authenticated users can insert catalog items
    - This allows the seed function to work properly
*/

-- Add INSERT policy for points_catalog table
CREATE POLICY "Authenticated users can insert catalog items"
  ON points_catalog FOR INSERT
  TO authenticated
  WITH CHECK (true);
