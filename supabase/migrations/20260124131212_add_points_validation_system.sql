/*
  # Add Points Validation System

  1. New Tables
    - `pending_points`
      - `id` (uuid, primary key)
      - `couple_id` (uuid, foreign key to couples)
      - `user_id` (uuid, foreign key to users) - quien añadió los puntos
      - `points` (integer) - cantidad de puntos
      - `description` (text) - descripción de la actividad
      - `catalog_item_id` (uuid, nullable) - referencia al item del catálogo si aplica
      - `created_at` (timestamp)
      - `status` (text) - 'pending', 'approved', 'rejected'

  2. Changes
    - Add `requires_validation` boolean to couples table (default false)

  3. Security
    - Enable RLS on `pending_points` table
    - Add policies for couple members to view pending points
    - Add policy for partner to approve/reject points
    - Add policy for user to create pending points
*/

-- Add validation setting to couples table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'couples' AND column_name = 'requires_validation'
  ) THEN
    ALTER TABLE couples ADD COLUMN requires_validation boolean DEFAULT false;
  END IF;
END $$;

-- Create pending_points table
CREATE TABLE IF NOT EXISTS pending_points (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  couple_id uuid REFERENCES couples(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  points integer NOT NULL,
  description text NOT NULL,
  catalog_item_id uuid REFERENCES points_catalog(id) ON DELETE SET NULL,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE pending_points ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view pending points from their couple
CREATE POLICY "Couple members can view pending points"
  ON pending_points
  FOR SELECT
  TO authenticated
  USING (
    couple_id IN (
      SELECT couple_id FROM users WHERE id = auth.uid()
    )
  );

-- Policy: Users can create pending points for their couple
CREATE POLICY "Users can create pending points"
  ON pending_points
  FOR INSERT
  TO authenticated
  WITH CHECK (
    user_id = auth.uid()
    AND couple_id IN (
      SELECT couple_id FROM users WHERE id = auth.uid()
    )
  );

-- Policy: Partner can update pending points status (approve/reject)
CREATE POLICY "Partner can update pending points"
  ON pending_points
  FOR UPDATE
  TO authenticated
  USING (
    couple_id IN (
      SELECT couple_id FROM users WHERE id = auth.uid()
    )
    AND user_id != auth.uid()
  )
  WITH CHECK (
    couple_id IN (
      SELECT couple_id FROM users WHERE id = auth.uid()
    )
    AND user_id != auth.uid()
  );