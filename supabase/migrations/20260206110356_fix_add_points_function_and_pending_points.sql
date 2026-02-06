/*
  # Fix add_points function and pending_points table

  1. Bug Fix: add_points function
    - The function parameter `p_couple_id` was typed as `uuid` but `couples.id` is `text`
    - This caused "invalid input syntax for type uuid" errors on every activity completion
    - Recreate function with correct `text` parameter type

  2. Schema Fix: pending_points table
    - Add missing `catalog_item_id` column (references points_catalog)
    - This column was defined in a previous migration but not present in the live database
*/

CREATE OR REPLACE FUNCTION add_points(
  p_couple_id text,
  p_amount integer
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE couples
  SET points = points + p_amount
  WHERE id = p_couple_id;
END;
$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'pending_points' AND column_name = 'catalog_item_id'
  ) THEN
    ALTER TABLE pending_points ADD COLUMN catalog_item_id uuid REFERENCES points_catalog(id);
  END IF;
END $$;
