/*
  # Add icon field to rewards table

  1. Changes
    - Add `icon` column to `rewards` table
      - Type: text (nullable)
      - Stores the name of the lucide-react icon to display
      - Default: null (will use Gift icon as fallback)
  
  2. Notes
    - Existing rewards will have null icon, which will default to the Gift icon
    - Users can now select from a variety of icons for their rewards
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'rewards' AND column_name = 'icon'
  ) THEN
    ALTER TABLE rewards ADD COLUMN icon text;
  END IF;
END $$;