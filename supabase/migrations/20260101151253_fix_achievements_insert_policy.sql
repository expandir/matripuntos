/*
  # Fix Achievements Insert Policy

  1. Changes
    - Add INSERT policy for achievements table to allow seeding
    - Policy allows authenticated users to insert achievements
    
  2. Security
    - Only authenticated users can insert achievements
    - This allows the seed function to work properly
*/

-- Add INSERT policy for achievements table
CREATE POLICY "Authenticated users can insert achievements"
  ON achievements FOR INSERT
  TO authenticated
  WITH CHECK (true);
