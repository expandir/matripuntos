/*
  # Create weekly challenges table

  1. New Tables
    - `weekly_challenges`
      - `id` (uuid, primary key) - Unique identifier for the challenge
      - `couple_id` (text) - Reference to the couple
      - `name` (text) - Name of the challenge
      - `description` (text) - Detailed description
      - `points_reward` (integer) - Points awarded for completion
      - `icon` (text, nullable) - Icon name from lucide-react
      - `completed` (boolean) - Whether the challenge has been completed
      - `week_start` (date) - Start date of the week for this challenge
      - `completed_at` (timestamptz, nullable) - When the challenge was completed
      - `created_at` (timestamptz) - When the challenge was created

  2. Security
    - Enable RLS on `weekly_challenges` table
    - Add policies for authenticated users to:
      - View challenges for their couple
      - Update challenges (mark as completed) for their couple
      - Insert new challenges for their couple

  3. Important Notes
    - Challenges are couple-specific
    - Each challenge is tied to a specific week
    - Completed challenges cannot be uncompleted
    - Points are awarded when marking as completed
*/

CREATE TABLE IF NOT EXISTS weekly_challenges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  couple_id text NOT NULL REFERENCES couples(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text NOT NULL,
  points_reward integer NOT NULL,
  icon text,
  completed boolean DEFAULT false,
  week_start date NOT NULL,
  completed_at timestamptz,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE weekly_challenges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their couple's challenges"
  ON weekly_challenges
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

CREATE POLICY "Users can update their couple's challenges"
  ON weekly_challenges
  FOR UPDATE
  TO authenticated
  USING (
    couple_id IN (
      SELECT couple_id 
      FROM users 
      WHERE id = auth.uid() 
      AND couple_id IS NOT NULL
    )
  )
  WITH CHECK (
    couple_id IN (
      SELECT couple_id 
      FROM users 
      WHERE id = auth.uid() 
      AND couple_id IS NOT NULL
    )
  );

CREATE POLICY "Users can create challenges for their couple"
  ON weekly_challenges
  FOR INSERT
  TO authenticated
  WITH CHECK (
    couple_id IN (
      SELECT couple_id 
      FROM users 
      WHERE id = auth.uid() 
      AND couple_id IS NOT NULL
    )
  );

CREATE INDEX IF NOT EXISTS idx_weekly_challenges_couple_id ON weekly_challenges(couple_id);
CREATE INDEX IF NOT EXISTS idx_weekly_challenges_week_start ON weekly_challenges(week_start);
CREATE INDEX IF NOT EXISTS idx_weekly_challenges_completed ON weekly_challenges(completed);