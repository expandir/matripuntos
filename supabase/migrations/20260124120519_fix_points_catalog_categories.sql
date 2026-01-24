/*
  # Fix Points Catalog Categories

  1. Changes
    - Updates the valid_category check constraint to match the application categories
    - Old categories: 'romantic', 'household', 'health', 'fun', 'surprise'
    - New categories: 'household', 'childcare', 'management', 'self_care'
*/

ALTER TABLE points_catalog DROP CONSTRAINT IF EXISTS valid_category;

ALTER TABLE points_catalog ADD CONSTRAINT valid_category 
  CHECK (category = ANY (ARRAY['household'::text, 'childcare'::text, 'management'::text, 'self_care'::text]));