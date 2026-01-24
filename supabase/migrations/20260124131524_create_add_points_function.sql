/*
  # Create add_points function

  1. New Functions
    - `add_points(p_couple_id, p_amount)` - Safely adds points to a couple
*/

CREATE OR REPLACE FUNCTION add_points(
  p_couple_id uuid,
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