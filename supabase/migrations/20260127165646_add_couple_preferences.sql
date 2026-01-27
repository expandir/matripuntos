/*
  # Add Couple Preferences for Personalization

  1. Changes to `couples` table
    - Add `has_children` (boolean) - Whether the couple has children
    - Add `household_size` (integer) - Number of people in the household
    - Add `preferences` (jsonb) - Additional preferences for customization
    - Add `onboarding_completed` (boolean) - Whether they completed the initial questionnaire

  2. Notes
    - Default values ensure existing couples can continue using the app
    - Preferences will be used to filter catalog items and suggest relevant rewards
*/

DO $$
BEGIN
  -- Add has_children column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'couples' AND column_name = 'has_children'
  ) THEN
    ALTER TABLE couples ADD COLUMN has_children boolean DEFAULT false;
  END IF;

  -- Add household_size column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'couples' AND column_name = 'household_size'
  ) THEN
    ALTER TABLE couples ADD COLUMN household_size integer DEFAULT 2;
  END IF;

  -- Add preferences column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'couples' AND column_name = 'preferences'
  ) THEN
    ALTER TABLE couples ADD COLUMN preferences jsonb DEFAULT '{}'::jsonb;
  END IF;

  -- Add onboarding_completed column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'couples' AND column_name = 'onboarding_completed'
  ) THEN
    ALTER TABLE couples ADD COLUMN onboarding_completed boolean DEFAULT false;
  END IF;
END $$;

-- Update existing couples to mark them as having completed onboarding
-- (since they're already using the system)
UPDATE couples
SET onboarding_completed = true
WHERE onboarding_completed = false;
