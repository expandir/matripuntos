/*
  # Create points catalog system

  1. New Tables
    - `points_catalog`
      - `id` (uuid, primary key) - Unique identifier for the activity
      - `name` (text) - Name of the activity
      - `description` (text) - Detailed description
      - `points_value` (integer) - Points awarded for completion
      - `category` (text) - Category (romantic, household, health, fun, surprise)
      - `icon` (text, nullable) - Icon name from lucide-react
      - `created_at` (timestamptz) - When the activity was created
    
    - `catalog_completions`
      - `id` (uuid, primary key) - Unique identifier
      - `couple_id` (text) - Reference to the couple
      - `user_id` (uuid) - User who completed the activity
      - `catalog_item_id` (uuid) - Reference to the catalog activity
      - `completed_at` (timestamptz) - When the activity was completed

  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users to:
      - View all catalog items (public catalog)
      - View completions for their couple
      - Insert completions for their couple

  3. Important Notes
    - Catalog items are shared across all couples
    - Each completion is tracked separately
    - Activities can be completed multiple times
    - Completions are tied to specific users within a couple
*/

CREATE TABLE IF NOT EXISTS points_catalog (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  points_value integer NOT NULL,
  category text NOT NULL,
  icon text,
  created_at timestamptz DEFAULT now(),
  CONSTRAINT valid_category CHECK (category IN ('romantic', 'household', 'health', 'fun', 'surprise'))
);

CREATE TABLE IF NOT EXISTS catalog_completions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  couple_id text NOT NULL REFERENCES couples(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  catalog_item_id uuid NOT NULL REFERENCES points_catalog(id) ON DELETE CASCADE,
  completed_at timestamptz DEFAULT now()
);

ALTER TABLE points_catalog ENABLE ROW LEVEL SECURITY;
ALTER TABLE catalog_completions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view catalog items"
  ON points_catalog
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can view their couple's completions"
  ON catalog_completions
  FOR SELECT
  TO authenticated
  USING (
    couple_id IN (
      SELECT couple_id 
      FROM users 
      WHERE id = auth.uid() 
      AND couple_id IS NOT NULL
    )
  );

CREATE POLICY "Users can create completions for their couple"
  ON catalog_completions
  FOR INSERT
  TO authenticated
  WITH CHECK (
    couple_id IN (
      SELECT couple_id 
      FROM users 
      WHERE id = auth.uid() 
      AND couple_id IS NOT NULL
    )
    AND user_id = auth.uid()
  );

CREATE INDEX IF NOT EXISTS idx_catalog_completions_couple_id ON catalog_completions(couple_id);
CREATE INDEX IF NOT EXISTS idx_catalog_completions_user_id ON catalog_completions(user_id);
CREATE INDEX IF NOT EXISTS idx_catalog_completions_catalog_item_id ON catalog_completions(catalog_item_id);
CREATE INDEX IF NOT EXISTS idx_points_catalog_category ON points_catalog(category);