import { supabase } from './supabase';

export const weeklyChallengesPool = [
  {
    name: 'Cita nocturna sin móviles',
    description: 'Pasar una noche juntos sin usar dispositivos móviles',
    points_reward: 50,
    icon: 'Heart'
  },
  {
    name: 'Cocinar juntos una receta nueva',
    description: 'Probar una receta que nunca habéis hecho antes',
    points_reward: 35,
    icon: 'Utensils'
  },
  {
    name: 'Paseo de 30 minutos al aire libre',
    description: 'Dar un paseo juntos durante al menos 30 minutos',
    points_reward: 25,
    icon: 'Sun'
  },
  {
    name: 'Carta de amor',
    description: 'Escribir una carta expresando lo que aprecias del otro',
    points_reward: 40,
    icon: 'Heart'
  },
  {
    name: 'Noche de juegos',
    description: 'Jugar juntos durante al menos 1 hora',
    points_reward: 30,
    icon: 'Gamepad2'
  },
  {
    name: 'Sorpresa diaria',
    description: 'Hacer 3 pequeñas sorpresas a tu pareja durante la semana',
    points_reward: 45,
    icon: 'Gift'
  },
  {
    name: 'Desayuno especial',
    description: 'Preparar un desayuno especial juntos en el fin de semana',
    points_reward: 30,
    icon: 'Coffee'
  },
  {
    name: 'Lista de agradecimientos',
    description: 'Cada uno hace una lista de 5 cosas que agradece del otro',
    points_reward: 35,
    icon: 'Star'
  },
  {
    name: 'Sesión de fotos divertida',
    description: 'Hacer una sesión de fotos casera creativa',
    points_reward: 30,
    icon: 'Camera'
  },
  {
    name: 'Baile en casa',
    description: 'Bailar juntos vuestra canción favorita',
    points_reward: 25,
    icon: 'Music'
  },
  {
    name: 'Maratón de película',
    description: 'Ver 2 películas elegidas por turnos',
    points_reward: 30,
    icon: 'Film'
  },
  {
    name: 'Día sin discusiones',
    description: 'Pasar 3 días completos sin discutir',
    points_reward: 60,
    icon: 'Cloud'
  },
  {
    name: 'Masajes mutuos',
    description: 'Daros masajes de 15 minutos cada uno',
    points_reward: 35,
    icon: 'Sparkles'
  },
  {
    name: 'Proyecto conjunto',
    description: 'Completar juntos un proyecto pequeño (puzzle, manualidad, etc)',
    points_reward: 40,
    icon: 'Star'
  },
  {
    name: 'Picnic en casa o parque',
    description: 'Organizar un picnic, aunque sea en casa',
    points_reward: 35,
    icon: 'TreePalm'
  },
  {
    name: 'Tarde de lectura compartida',
    description: 'Leer juntos durante 30 minutos y comentar lo leído',
    points_reward: 25,
    icon: 'Book'
  },
  {
    name: 'Playlist personalizada',
    description: 'Crear una playlist de canciones significativas para vuestra relación',
    points_reward: 30,
    icon: 'Music'
  },
  {
    name: 'Noche de spa casero',
    description: 'Crear un ambiente de spa en casa con velas y música relajante',
    points_reward: 40,
    icon: 'Sparkles'
  },
  {
    name: 'Mañana sin responsabilidades',
    description: 'Dedicar una mañana completa solo a estar juntos sin tareas',
    points_reward: 45,
    icon: 'Sun'
  },
  {
    name: 'Intercambio de cumplidos',
    description: 'Cada día de la semana decir 2 cumplidos sinceros al otro',
    points_reward: 35,
    icon: 'Heart'
  }
];

function getStartOfCurrentWeek(): string {
  const now = new Date();
  const day = now.getDay();
  const diff = now.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(now.setDate(diff));
  monday.setHours(0, 0, 0, 0);
  return monday.toISOString().split('T')[0];
}

function getRandomChallenges(count: number) {
  const shuffled = [...weeklyChallengesPool].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

export async function seedWeeklyChallengesForCouple(coupleId: string) {
  try {
    const weekStart = getStartOfCurrentWeek();

    const { data: existingChallenges } = await supabase
      .from('weekly_challenges')
      .select('id')
      .eq('couple_id', coupleId)
      .eq('week_start', weekStart)
      .limit(1);

    if (existingChallenges && existingChallenges.length > 0) {
      console.log('Weekly challenges already exist for this couple');
      return { success: true, message: 'Challenges already seeded for this week' };
    }

    const randomChallenges = getRandomChallenges(3);
    const challengesToInsert = randomChallenges.map((challenge) => ({
      ...challenge,
      couple_id: coupleId,
      week_start: weekStart,
    }));

    const { error } = await supabase.from('weekly_challenges').insert(challengesToInsert);

    if (error) throw error;

    return { success: true, message: 'Weekly challenges seeded successfully' };
  } catch (error) {
    console.error('Error seeding weekly challenges:', error);
    return { success: false, error };
  }
}
