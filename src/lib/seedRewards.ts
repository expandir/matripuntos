import { supabase } from './supabase';

export const initialRewards = [
  { name: 'Tarde libre (3h)', description: 'Tarde libre para lo que quieras', points_cost: 30 },
  { name: 'Masaje de 30 min', description: 'Masaje relajante de 30 minutos', points_cost: 25 },
  { name: 'Cena hecha por la otra persona', description: 'Cena casera preparada por tu pareja', points_cost: 20 },
  { name: 'Noche de cine', description: 'Película y palomitas a elegir', points_cost: 15 },
  { name: 'Desayuno en la cama', description: 'Desayuno sorpresa en la cama', points_cost: 12 },
  { name: 'Sin tareas domésticas (1 día)', description: 'La otra persona se hace cargo de las tareas', points_cost: 18 },
  { name: 'Paseo romántico', description: 'Salida de pareja sin prisas', points_cost: 10 },
  { name: 'Fin de semana sin niños', description: 'Cuidado de la niña por parte de la otra persona', points_cost: 60 },
  { name: 'Masaje + cena rápida', description: 'Combo relajación', points_cost: 40 },
  { name: 'Playlist personalizada', description: 'Playlist hecha por tu pareja', points_cost: 8 },
  { name: 'Regalo sorpresa pequeño', description: 'Detalle comprado o hecho a mano', points_cost: 22 },
  { name: 'Clase de baile juntos', description: 'Una clase para los dos', points_cost: 45 },
  { name: 'Día de desconexión', description: 'Día enfocado a la pareja sin móviles', points_cost: 35 },
  { name: 'Tarde de juegos', description: 'Juegos de mesa o videojuegos juntos', points_cost: 12 },
  { name: 'Carta romántica', description: 'Carta escrita a mano', points_cost: 6 },
  { name: 'Sesión de fotos casera', description: 'Fotos espontáneas de pareja', points_cost: 14 },
  { name: 'Plan sorpresa', description: 'Sorpresa organizada por tu pareja', points_cost: 28 },
  { name: 'Cocinar juntos', description: 'Cocinar juntos una receta especial', points_cost: 10 },
  { name: 'Noche sin responsabilidades', description: 'Cuidado de la niña por la otra persona', points_cost: 40 },
  { name: 'Día de spa en casa', description: 'Espacio acondicionado para relajarse en casa', points_cost: 32 },
  { name: 'Carta de agradecimiento pública', description: 'Agradecimiento en redes o a familia', points_cost: 5 },
  { name: 'Lista de tareas organizada', description: 'La otra persona organiza la lista', points_cost: 7 },
  { name: 'Paseo en bici', description: 'Paseo corto en bici juntos', points_cost: 9 },
  { name: 'Cita sorpresa en casa', description: 'Cena y ambiente sorpresa en casa', points_cost: 26 },
  { name: 'Clase de instrumento', description: 'Lección de ukulele o guitarra básica', points_cost: 20 },
  { name: 'Elección de película', description: 'Tu pareja cede la elección', points_cost: 6 },
  { name: 'Tarde de lectura juntos', description: 'Ambos leen y comparten', points_cost: 8 },
  { name: 'Spa profesional', description: 'Visita a spa (coste adicional)', points_cost: 100 },
  { name: 'Día de hobbies', description: 'Dedicación a tu hobby sin interrupciones', points_cost: 22 },
  { name: 'Cena fuera', description: 'Salir a cenar a un lugar asequible', points_cost: 55 },
];

export async function seedRewardsForCouple(coupleId: string) {
  try {
    const { data: existingRewards } = await supabase
      .from('rewards')
      .select('id')
      .eq('couple_id', coupleId)
      .limit(1);

    if (existingRewards && existingRewards.length > 0) {
      console.log('Rewards already exist for this couple');
      return { success: true, message: 'Rewards already seeded' };
    }

    const rewardsToInsert = initialRewards.map((reward) => ({
      ...reward,
      couple_id: coupleId,
    }));

    const { error } = await supabase.from('rewards').insert(rewardsToInsert);

    if (error) throw error;

    return { success: true, message: 'Rewards seeded successfully' };
  } catch (error) {
    console.error('Error seeding rewards:', error);
    return { success: false, error };
  }
}
