/*
  # Fix duplicate add_points function

  1. Changes
    - Drop the `add_points(uuid, integer)` overload that conflicts with the correct `add_points(text, integer)` version
    - The `couples.id` column is of type `text`, so the uuid overload is incorrect
    - Having two overloads causes PostgREST ambiguity errors when calling via Supabase client

  2. Impact
    - Fixes "Error al validar puntos" when partner tries to approve/reject pending points
    - No data changes, only function cleanup
*/

DROP FUNCTION IF EXISTS add_points(uuid, integer);
