/*
  # Matripuntos Database Schema

  1. New Tables
    - `users`
      - `id` (uuid, primary key) - matches auth.users.id
      - `email` (text) - user email
      - `name` (text) - user display name
      - `photo_url` (text) - profile photo URL
      - `couple_id` (text, nullable) - reference to couples table
      - `created_at` (timestamptz) - account creation timestamp
    
    - `couples`
      - `id` (text, primary key) - unique couple code (6 chars)
      - `points` (integer) - current point balance
      - `created_at` (timestamptz) - couple creation timestamp
    
    - `rewards`
      - `id` (uuid, primary key)
      - `couple_id` (text) - reference to couples table
      - `name` (text) - reward name
      - `description` (text) - reward description
      - `points_cost` (integer) - points required to redeem
      - `image_url` (text, nullable) - optional reward image
      - `created_at` (timestamptz)
    
    - `history`
      - `id` (uuid, primary key)
      - `couple_id` (text) - reference to couples table
      - `user_id` (uuid) - user who performed the action
      - `points` (integer) - points gained (positive) or spent (negative)
      - `type` (text) - 'gain' or 'spend'
      - `description` (text) - action description
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Users can only access data for their own couple
    - Authenticated users required for all operations
*/

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  name text NOT NULL,
  photo_url text,
  couple_id text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON users FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON users FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Create couples table
CREATE TABLE IF NOT EXISTS couples (
  id text PRIMARY KEY,
  points integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE couples ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Couple members can view couple data"
  ON couples FOR SELECT
  TO authenticated
  USING (
    id IN (
      SELECT couple_id FROM users WHERE id = auth.uid()
    )
  );

CREATE POLICY "Couple members can update couple data"
  ON couples FOR UPDATE
  TO authenticated
  USING (
    id IN (
      SELECT couple_id FROM users WHERE id = auth.uid()
    )
  )
  WITH CHECK (
    id IN (
      SELECT couple_id FROM users WHERE id = auth.uid()
    )
  );

CREATE POLICY "Authenticated users can create couples"
  ON couples FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Create rewards table
CREATE TABLE IF NOT EXISTS rewards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  couple_id text NOT NULL REFERENCES couples(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text NOT NULL,
  points_cost integer NOT NULL,
  image_url text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE rewards ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Couple members can view rewards"
  ON rewards FOR SELECT
  TO authenticated
  USING (
    couple_id IN (
      SELECT couple_id FROM users WHERE id = auth.uid()
    )
  );

CREATE POLICY "Couple members can insert rewards"
  ON rewards FOR INSERT
  TO authenticated
  WITH CHECK (
    couple_id IN (
      SELECT couple_id FROM users WHERE id = auth.uid()
    )
  );

CREATE POLICY "Couple members can update rewards"
  ON rewards FOR UPDATE
  TO authenticated
  USING (
    couple_id IN (
      SELECT couple_id FROM users WHERE id = auth.uid()
    )
  )
  WITH CHECK (
    couple_id IN (
      SELECT couple_id FROM users WHERE id = auth.uid()
    )
  );

CREATE POLICY "Couple members can delete rewards"
  ON rewards FOR DELETE
  TO authenticated
  USING (
    couple_id IN (
      SELECT couple_id FROM users WHERE id = auth.uid()
    )
  );

-- Create history table
CREATE TABLE IF NOT EXISTS history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  couple_id text NOT NULL REFERENCES couples(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  points integer NOT NULL,
  type text NOT NULL CHECK (type IN ('gain', 'spend')),
  description text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Couple members can view history"
  ON history FOR SELECT
  TO authenticated
  USING (
    couple_id IN (
      SELECT couple_id FROM users WHERE id = auth.uid()
    )
  );

CREATE POLICY "Couple members can insert history"
  ON history FOR INSERT
  TO authenticated
  WITH CHECK (
    couple_id IN (
      SELECT couple_id FROM users WHERE id = auth.uid()
    )
  );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_couple_id ON users(couple_id);
CREATE INDEX IF NOT EXISTS idx_rewards_couple_id ON rewards(couple_id);
CREATE INDEX IF NOT EXISTS idx_history_couple_id ON history(couple_id);
CREATE INDEX IF NOT EXISTS idx_history_created_at ON history(created_at DESC);