/*
  # Fix couple has_children flag and rebalance large rewards

  1. Data Fix
    - Set `has_children = true` for couple YMW9Q7 (they have a daughter)
    - This was preventing childcare activities from appearing in the catalog

  2. Reward Rebalancing (large rewards)
    - Previous values underestimated real time commitment for big rewards
    - Example: "Fin de semana sin niños" was 120 pts (= 6h) but actual partner
      coverage is ~20-28 hours across 2 full days
    - Rewards now reflect realistic coverage time:
      - Tarde libre 3h: 40 -> 50 (partner covers 3h)
      - Día de hobbies: 50 -> 100 (partner covers 6-8h full day)
      - Sin tareas domésticas: 50 -> 70 (partner covers all chores ~4-5h)
      - Noche sin responsabilidades: 60 -> 80 (partner covers evening ~5h)
      - Spa profesional: 60 -> 70 (3-4h + money)
      - Fin de semana sin niños: 120 -> 250 (partner solo-parents entire weekend)
*/

-- Fix has_children for couple YMW9Q7
UPDATE couples SET has_children = true WHERE id = 'YMW9Q7';

-- =============================================
-- REWARDS: Couple YMW9Q7 - Fix large rewards
-- =============================================
UPDATE rewards SET points_cost = 50 WHERE couple_id = 'YMW9Q7' AND name = 'Tarde libre (3h)';
UPDATE rewards SET points_cost = 100 WHERE couple_id = 'YMW9Q7' AND name = 'Día de hobbies';
UPDATE rewards SET points_cost = 70 WHERE couple_id = 'YMW9Q7' AND name = 'Sin tareas domésticas (1 día)';
UPDATE rewards SET points_cost = 80 WHERE couple_id = 'YMW9Q7' AND name = 'Noche sin responsabilidades';
UPDATE rewards SET points_cost = 70 WHERE couple_id = 'YMW9Q7' AND name = 'Spa profesional';
UPDATE rewards SET points_cost = 250 WHERE couple_id = 'YMW9Q7' AND name = 'Fin de semana sin niños';

-- =============================================
-- REWARDS: Couple R2KXG6 - Fix large rewards
-- =============================================
UPDATE rewards SET points_cost = 50 WHERE couple_id = 'R2KXG6' AND name = '3 horas de tiempo libre';
UPDATE rewards SET points_cost = 55 WHERE couple_id = 'R2KXG6' AND name = 'Trabajar en proyecto personal';
UPDATE rewards SET points_cost = 60 WHERE couple_id = 'R2KXG6' AND name = 'Salir con amigos';
UPDATE rewards SET points_cost = 70 WHERE couple_id = 'R2KXG6' AND name = 'Manana libre (4h)';
UPDATE rewards SET points_cost = 70 WHERE couple_id = 'R2KXG6' AND name = 'Dia sin tareas domesticas';
UPDATE rewards SET points_cost = 85 WHERE couple_id = 'R2KXG6' AND name = 'Tarde libre completa (5h)';
UPDATE rewards SET points_cost = 80 WHERE couple_id = 'R2KXG6' AND name = 'Ir al spa o masaje';
UPDATE rewards SET points_cost = 150 WHERE couple_id = 'R2KXG6' AND name = 'Dia completo libre';
UPDATE rewards SET points_cost = 140 WHERE couple_id = 'R2KXG6' AND name = 'Semana sin cocinar';
UPDATE rewards SET points_cost = 250 WHERE couple_id = 'R2KXG6' AND name = 'Fin de semana libre';
