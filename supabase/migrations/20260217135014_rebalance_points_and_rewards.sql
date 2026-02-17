/*
  # Rebalance points catalog and rewards for time/effort equivalence

  Scale: ~1 point = 3 minutes of real time/effort
  - 5 pts = quick task (~5-10 min)
  - 10 pts = short task (~15-20 min)
  - 15 pts = medium-short task (~25-35 min)
  - 20 pts = medium task (~40-50 min)
  - 25 pts = medium-long task (~1 hour)
  - 30 pts = long task (~1-1.5 hours)
  - 40 pts = very long task (~2 hours)
  - 50 pts = half-day effort (~2.5-3 hours)
  - 60+ pts = major effort (3+ hours)

  Rewards use the same scale based on what the partner must provide/sacrifice.

  1. Modified Tables
    - `points_catalog` - Rebalanced all point values
    - `rewards` - Rebalanced all reward costs for both couples

  2. Changes Summary
    - Reduced inflated earning values (e.g., "Preparar cena" 30 -> 20)
    - Increased undervalued rewards (e.g., "Sin tareas domesticas 1 dia" 18 -> 50)
    - Ensured earning 1 hour of tasks roughly equals 1 hour of reward time
    - No structural changes, only numeric value adjustments
*/

-- =============================================
-- POINTS CATALOG: Childcare
-- =============================================
UPDATE points_catalog SET points_value = 5 WHERE name = 'Cambiar pañales';
UPDATE points_catalog SET points_value = 5 WHERE name = 'Preparar mochila escolar';
UPDATE points_catalog SET points_value = 10 WHERE name = 'Alimentar bebé';
UPDATE points_catalog SET points_value = 10 WHERE name = 'Preparar lunch escolar';
UPDATE points_catalog SET points_value = 10 WHERE name = 'Leer cuentos';
UPDATE points_catalog SET points_value = 8 WHERE name = 'Lavar y cortar uñas';
UPDATE points_catalog SET points_value = 15 WHERE name = 'Recoger del cole';
UPDATE points_catalog SET points_value = 15 WHERE name = 'Rutina de baño';
UPDATE points_catalog SET points_value = 15 WHERE name = 'Jugar con los niños';
UPDATE points_catalog SET points_value = 10 WHERE name = 'Vigilar siesta';
UPDATE points_catalog SET points_value = 15 WHERE name = 'Llevar al cole';
UPDATE points_catalog SET points_value = 20 WHERE name = 'Actividad extraescolar';
UPDATE points_catalog SET points_value = 20 WHERE name = 'Ayudar con deberes';
UPDATE points_catalog SET points_value = 20 WHERE name = 'Rutina de dormir';
UPDATE points_catalog SET points_value = 25 WHERE name = 'Llevar al parque';
UPDATE points_catalog SET points_value = 15 WHERE name = 'Calmar rabietas';
UPDATE points_catalog SET points_value = 50 WHERE name = 'Llevar al médico';
UPDATE points_catalog SET points_value = 60 WHERE name = 'Cuidado completo del bebé';

-- =============================================
-- POINTS CATALOG: Household
-- =============================================
UPDATE points_catalog SET points_value = 5 WHERE name = 'Sacar la basura';
UPDATE points_catalog SET points_value = 5 WHERE name = 'Regar plantas';
UPDATE points_catalog SET points_value = 10 WHERE name = 'Preparar desayuno';
UPDATE points_catalog SET points_value = 10 WHERE name = 'Lavar los platos';
UPDATE points_catalog SET points_value = 10 WHERE name = 'Cambiar sábanas';
UPDATE points_catalog SET points_value = 15 WHERE name = 'Limpiar la cocina';
UPDATE points_catalog SET points_value = 15 WHERE name = 'Ordenar la casa';
UPDATE points_catalog SET points_value = 20 WHERE name = 'Planchar';
UPDATE points_catalog SET points_value = 15 WHERE name = 'Hacer la colada';
UPDATE points_catalog SET points_value = 20 WHERE name = 'Limpiar ventanas';
UPDATE points_catalog SET points_value = 15 WHERE name = 'Limpiar el baño';
UPDATE points_catalog SET points_value = 20 WHERE name = 'Preparar cena';
UPDATE points_catalog SET points_value = 30 WHERE name = 'Hacer la compra';
UPDATE points_catalog SET points_value = 20 WHERE name = 'Preparar comida';
UPDATE points_catalog SET points_value = 25 WHERE name = 'Aspirar y fregar';

-- =============================================
-- POINTS CATALOG: Management
-- =============================================
UPDATE points_catalog SET points_value = 5 WHERE name = 'Gestionar reservas';
UPDATE points_catalog SET points_value = 5 WHERE name = 'Gestionar suscripciones';
UPDATE points_catalog SET points_value = 10 WHERE name = 'Gestionar calendario familiar';
UPDATE points_catalog SET points_value = 5 WHERE name = 'Pagar facturas';
UPDATE points_catalog SET points_value = 10 WHERE name = 'Llamadas médicas';
UPDATE points_catalog SET points_value = 10 WHERE name = 'Planificar menú semanal';
UPDATE points_catalog SET points_value = 15 WHERE name = 'Organizar fotos familiares';
UPDATE points_catalog SET points_value = 25 WHERE name = 'Comprar regalos';
UPDATE points_catalog SET points_value = 30 WHERE name = 'Gestiones administrativas';
UPDATE points_catalog SET points_value = 35 WHERE name = 'Mantenimiento del hogar';
UPDATE points_catalog SET points_value = 40 WHERE name = 'Revisar coche';
UPDATE points_catalog SET points_value = 15 WHERE name = 'Revisar seguros';
UPDATE points_catalog SET points_value = 25 WHERE name = 'Organizar armarios';
UPDATE points_catalog SET points_value = 50 WHERE name = 'Organizar cumpleaños';

-- =============================================
-- POINTS CATALOG: Self-care (done FOR partner)
-- =============================================
UPDATE points_catalog SET points_value = 5 WHERE name = 'Elogios sinceros';
UPDATE points_catalog SET points_value = 10 WHERE name = 'Noche de películas';
UPDATE points_catalog SET points_value = 10 WHERE name = 'Preparar baño relajante';
UPDATE points_catalog SET points_value = 15 WHERE name = 'Escuchar activamente';
UPDATE points_catalog SET points_value = 15 WHERE name = 'Apoyo emocional';
UPDATE points_catalog SET points_value = 15 WHERE name = 'Masaje relajante';
UPDATE points_catalog SET points_value = 10 WHERE name = 'Desayuno en la cama';
UPDATE points_catalog SET points_value = 25 WHERE name = 'Sorpresa romántica';
UPDATE points_catalog SET points_value = 30 WHERE name = 'Tiempo personal';
UPDATE points_catalog SET points_value = 35 WHERE name = 'Dejar dormir extra';
UPDATE points_catalog SET points_value = 40 WHERE name = 'Cita sorpresa';
UPDATE points_catalog SET points_value = 35 WHERE name = 'Plan sin niños';
UPDATE points_catalog SET points_value = 50 WHERE name = 'Tarde libre completa';

-- =============================================
-- REWARDS: Couple YMW9Q7 (Miguel & Anna)
-- =============================================
UPDATE rewards SET points_cost = 3 WHERE couple_id = 'YMW9Q7' AND name = 'Elección de película';
UPDATE rewards SET points_cost = 5 WHERE couple_id = 'YMW9Q7' AND name = 'Carta de agradecimiento pública';
UPDATE rewards SET points_cost = 10 WHERE couple_id = 'YMW9Q7' AND name = 'Carta romántica';
UPDATE rewards SET points_cost = 5 WHERE couple_id = 'YMW9Q7' AND name = 'Lista de tareas organizada';
UPDATE rewards SET points_cost = 10 WHERE couple_id = 'YMW9Q7' AND name = 'Playlist personalizada';
UPDATE rewards SET points_cost = 8 WHERE couple_id = 'YMW9Q7' AND name = 'Tarde de lectura juntos';
UPDATE rewards SET points_cost = 8 WHERE couple_id = 'YMW9Q7' AND name = 'Paseo en bici';
UPDATE rewards SET points_cost = 10 WHERE couple_id = 'YMW9Q7' AND name = 'Cocinar juntos';
UPDATE rewards SET points_cost = 8 WHERE couple_id = 'YMW9Q7' AND name = 'Paseo romántico';
UPDATE rewards SET points_cost = 8 WHERE couple_id = 'YMW9Q7' AND name = 'Sesión de fotos casera';
UPDATE rewards SET points_cost = 10 WHERE couple_id = 'YMW9Q7' AND name = 'Desayuno en la cama';
UPDATE rewards SET points_cost = 10 WHERE couple_id = 'YMW9Q7' AND name = 'Tarde de juegos';
UPDATE rewards SET points_cost = 12 WHERE couple_id = 'YMW9Q7' AND name = 'Noche de cine';
UPDATE rewards SET points_cost = 15 WHERE couple_id = 'YMW9Q7' AND name = 'Clase de instrumento';
UPDATE rewards SET points_cost = 15 WHERE couple_id = 'YMW9Q7' AND name = 'Masaje de 30 min';
UPDATE rewards SET points_cost = 20 WHERE couple_id = 'YMW9Q7' AND name = 'Cena hecha por la otra persona';
UPDATE rewards SET points_cost = 50 WHERE couple_id = 'YMW9Q7' AND name = 'Sin tareas domésticas (1 día)';
UPDATE rewards SET points_cost = 20 WHERE couple_id = 'YMW9Q7' AND name = 'Regalo sorpresa pequeño';
UPDATE rewards SET points_cost = 50 WHERE couple_id = 'YMW9Q7' AND name = 'Día de hobbies';
UPDATE rewards SET points_cost = 25 WHERE couple_id = 'YMW9Q7' AND name = 'Cita sorpresa en casa';
UPDATE rewards SET points_cost = 30 WHERE couple_id = 'YMW9Q7' AND name = 'Plan sorpresa';
UPDATE rewards SET points_cost = 15 WHERE couple_id = 'YMW9Q7' AND name = 'Día de desconexión';
UPDATE rewards SET points_cost = 25 WHERE couple_id = 'YMW9Q7' AND name = 'Masaje + cena rápida';
UPDATE rewards SET points_cost = 40 WHERE couple_id = 'YMW9Q7' AND name = 'Tarde libre (3h)';
UPDATE rewards SET points_cost = 30 WHERE couple_id = 'YMW9Q7' AND name = 'Día de spa en casa';
UPDATE rewards SET points_cost = 60 WHERE couple_id = 'YMW9Q7' AND name = 'Noche sin responsabilidades';
UPDATE rewards SET points_cost = 15 WHERE couple_id = 'YMW9Q7' AND name = 'Clase de baile juntos';
UPDATE rewards SET points_cost = 25 WHERE couple_id = 'YMW9Q7' AND name = 'Cena fuera';
UPDATE rewards SET points_cost = 120 WHERE couple_id = 'YMW9Q7' AND name = 'Fin de semana sin niños';
UPDATE rewards SET points_cost = 60 WHERE couple_id = 'YMW9Q7' AND name = 'Spa profesional';

-- =============================================
-- REWARDS: Couple R2KXG6
-- =============================================
UPDATE rewards SET points_cost = 20 WHERE couple_id = 'R2KXG6' AND name = 'Siesta tranquila';
UPDATE rewards SET points_cost = 30 WHERE couple_id = 'R2KXG6' AND name = 'Dormir hasta tarde';
UPDATE rewards SET points_cost = 20 WHERE couple_id = 'R2KXG6' AND name = 'Pasear sin rumbo';
UPDATE rewards SET points_cost = 20 WHERE couple_id = 'R2KXG6' AND name = 'Leer tranquilamente';
UPDATE rewards SET points_cost = 25 WHERE couple_id = 'R2KXG6' AND name = 'Ir al gimnasio';
UPDATE rewards SET points_cost = 25 WHERE couple_id = 'R2KXG6' AND name = 'Ver series o peliculas';
UPDATE rewards SET points_cost = 30 WHERE couple_id = 'R2KXG6' AND name = '2 horas de tiempo libre';
UPDATE rewards SET points_cost = 30 WHERE couple_id = 'R2KXG6' AND name = 'Deporte o actividad personal';
UPDATE rewards SET points_cost = 30 WHERE couple_id = 'R2KXG6' AND name = 'Hobby personal';
UPDATE rewards SET points_cost = 30 WHERE couple_id = 'R2KXG6' AND name = 'Ir a la peluqueria';
UPDATE rewards SET points_cost = 35 WHERE couple_id = 'R2KXG6' AND name = 'Ir de compras solo/a';
UPDATE rewards SET points_cost = 40 WHERE couple_id = 'R2KXG6' AND name = '3 horas de tiempo libre';
UPDATE rewards SET points_cost = 50 WHERE couple_id = 'R2KXG6' AND name = 'Salir con amigos';
UPDATE rewards SET points_cost = 45 WHERE couple_id = 'R2KXG6' AND name = 'Trabajar en proyecto personal';
UPDATE rewards SET points_cost = 55 WHERE couple_id = 'R2KXG6' AND name = 'Manana libre (4h)';
UPDATE rewards SET points_cost = 60 WHERE couple_id = 'R2KXG6' AND name = 'Dia sin tareas domesticas';
UPDATE rewards SET points_cost = 65 WHERE couple_id = 'R2KXG6' AND name = 'Tarde libre completa (5h)';
UPDATE rewards SET points_cost = 45 WHERE couple_id = 'R2KXG6' AND name = 'Cita romantica organizada';
UPDATE rewards SET points_cost = 70 WHERE couple_id = 'R2KXG6' AND name = 'Ir al spa o masaje';
UPDATE rewards SET points_cost = 100 WHERE couple_id = 'R2KXG6' AND name = 'Dia completo libre';
UPDATE rewards SET points_cost = 120 WHERE couple_id = 'R2KXG6' AND name = 'Semana sin cocinar';
UPDATE rewards SET points_cost = 150 WHERE couple_id = 'R2KXG6' AND name = 'Fin de semana libre';
