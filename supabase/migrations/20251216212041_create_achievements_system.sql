/*
  # Create Achievements System

  1. New Tables
    - `achievements`
      - `id` (uuid, primary key) - Unique identifier for each achievement
      - `name` (text) - Display name of the achievement
      - `description` (text) - What the user needs to do to unlock it
      - `icon` (text) - Lucide icon name for display
      - `category` (text) - Category: points, streak, activity, special
      - `requirement` (integer) - Numeric requirement to unlock (e.g., 100 points)
      - `requirement_type` (text) - Type of requirement: total_points, streak_days, activity_count, category_count, etc.
      - `tier` (text) - bronze, silver, gold, platinum
      - `created_at` (timestamptz) - When the achievement was created

    - `user_achievements`
      - `id` (uuid, primary key) - Unique identifier
      - `user_id` (uuid, foreign key) - References auth.users
      - `achievement_id` (uuid, foreign key) - References achievements
      - `unlocked_at` (timestamptz) - When the user unlocked it
      - `progress` (integer) - Current progress toward unlocking (0-100)
      
  2. Security
    - Enable RLS on both tables
    - Users can read all achievements (public catalog)
    - Users can only read their own user_achievements
    - Users can insert their own user_achievements (when unlocking)
    - Users can update their own achievement progress
*/

-- Create achievements table
CREATE TABLE IF NOT EXISTS achievements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  icon text NOT NULL DEFAULT 'Award',
  category text NOT NULL CHECK (category IN ('points', 'streak', 'activity', 'special')),
  requirement integer NOT NULL DEFAULT 0,
  requirement_type text NOT NULL,
  tier text NOT NULL DEFAULT 'bronze' CHECK (tier IN ('bronze', 'silver', 'gold', 'platinum')),
  created_at timestamptz DEFAULT now()
);

-- Create user_achievements table
CREATE TABLE IF NOT EXISTS user_achievements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  achievement_id uuid NOT NULL REFERENCES achievements(id) ON DELETE CASCADE,
  unlocked_at timestamptz DEFAULT now(),
  progress integer DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  UNIQUE(user_id, achievement_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_achievements_user_id ON user_achievements(user_id);
CREATE INDEX IF NOT EXISTS idx_user_achievements_achievement_id ON user_achievements(achievement_id);
CREATE INDEX IF NOT EXISTS idx_achievements_category ON achievements(category);

-- Enable RLS
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;

-- RLS Policies for achievements (public catalog)
CREATE POLICY "Anyone can view all achievements"
  ON achievements FOR SELECT
  TO authenticated
  USING (true);

-- RLS Policies for user_achievements
CREATE POLICY "Users can view own achievements"
  ON user_achievements FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can unlock own achievements"
  ON user_achievements FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own achievement progress"
  ON user_achievements FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);