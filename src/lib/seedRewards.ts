import { supabase } from './supabase';

export const initialRewards = [
  {
    name: '2 horas de tiempo libre',
    description: 'Tiempo para ti sin interrupciones',
    points_cost: 25,
    image_url: 'https://images.pexels.com/photos/1405870/pexels-photo-1405870.jpeg?auto=compress&cs=tinysrgb&w=800',
    icon: 'Clock'
  },
  {
    name: '3 horas de tiempo libre',
    description: 'Tiempo personal para hacer lo que quieras',
    points_cost: 35,
    image_url: 'https://images.pexels.com/photos/1109197/pexels-photo-1109197.jpeg?auto=compress&cs=tinysrgb&w=800',
    icon: 'Clock'
  },
  {
    name: 'Mañana libre (4h)',
    description: 'Mañana completa para ti',
    points_cost: 45,
    image_url: 'https://images.pexels.com/photos/851213/pexels-photo-851213.jpeg?auto=compress&cs=tinysrgb&w=800',
    icon: 'Sunrise'
  },
  {
    name: 'Tarde libre completa (5h)',
    description: 'Toda la tarde sin responsabilidades',
    points_cost: 55,
    image_url: 'https://images.pexels.com/photos/1449791/pexels-photo-1449791.jpeg?auto=compress&cs=tinysrgb&w=800',
    icon: 'Sun'
  },
  {
    name: 'Día completo libre',
    description: 'Todo el día para ti',
    points_cost: 90,
    image_url: 'https://images.pexels.com/photos/1659438/pexels-photo-1659438.jpeg?auto=compress&cs=tinysrgb&w=800',
    icon: 'Calendar'
  },
  {
    name: 'Fin de semana libre',
    description: 'Sábado y domingo completos libres',
    points_cost: 150,
    image_url: 'https://images.pexels.com/photos/346529/pexels-photo-346529.jpeg?auto=compress&cs=tinysrgb&w=800',
    icon: 'CalendarDays'
  },
  {
    name: 'Dormir hasta tarde',
    description: 'Despertar sin despertador ni responsabilidades',
    points_cost: 20,
    image_url: 'https://images.pexels.com/photos/1183828/pexels-photo-1183828.jpeg?auto=compress&cs=tinysrgb&w=800',
    icon: 'Moon'
  },
  {
    name: 'Siesta tranquila',
    description: 'Tiempo para descansar sin interrupciones',
    points_cost: 15,
    image_url: 'https://images.pexels.com/photos/3771069/pexels-photo-3771069.jpeg?auto=compress&cs=tinysrgb&w=800',
    icon: 'CloudMoon'
  },
  {
    name: 'Salir con amigos',
    description: 'Tiempo para salir con tus amistades',
    points_cost: 40,
    image_url: 'https://images.pexels.com/photos/1267696/pexels-photo-1267696.jpeg?auto=compress&cs=tinysrgb&w=800',
    icon: 'Users'
  },
  {
    name: 'Deporte o actividad personal',
    description: 'Tiempo para tu actividad deportiva favorita',
    points_cost: 30,
    image_url: 'https://images.pexels.com/photos/235922/pexels-photo-235922.jpeg?auto=compress&cs=tinysrgb&w=800',
    icon: 'Bike'
  },
  {
    name: 'Ir al gimnasio',
    description: 'Tiempo para ir al gym tranquilamente',
    points_cost: 25,
    image_url: 'https://images.pexels.com/photos/1552242/pexels-photo-1552242.jpeg?auto=compress&cs=tinysrgb&w=800',
    icon: 'Dumbbell'
  },
  {
    name: 'Ir de compras solo/a',
    description: 'Tiempo para ir de compras sin prisas',
    points_cost: 35,
    image_url: 'https://images.pexels.com/photos/972995/pexels-photo-972995.jpeg?auto=compress&cs=tinysrgb&w=800',
    icon: 'ShoppingBag'
  },
  {
    name: 'Leer tranquilamente',
    description: 'Tiempo ininterrumpido para leer',
    points_cost: 20,
    image_url: 'https://images.pexels.com/photos/4866020/pexels-photo-4866020.jpeg?auto=compress&cs=tinysrgb&w=800',
    icon: 'Book'
  },
  {
    name: 'Ver series o películas',
    description: 'Tiempo para maratonear sin interrupciones',
    points_cost: 25,
    image_url: 'https://images.pexels.com/photos/7991158/pexels-photo-7991158.jpeg?auto=compress&cs=tinysrgb&w=800',
    icon: 'Tv'
  },
  {
    name: 'Hobby personal',
    description: 'Tiempo dedicado a tu hobby',
    points_cost: 30,
    image_url: 'https://images.pexels.com/photos/1109197/pexels-photo-1109197.jpeg?auto=compress&cs=tinysrgb&w=800',
    icon: 'Star'
  },
  {
    name: 'Ir al spa o masaje',
    description: 'Tiempo para autocuidado profesional',
    points_cost: 80,
    image_url: 'https://images.pexels.com/photos/3757952/pexels-photo-3757952.jpeg?auto=compress&cs=tinysrgb&w=800',
    icon: 'Sparkles'
  },
  {
    name: 'Ir a la peluquería',
    description: 'Tiempo para cuidado personal',
    points_cost: 30,
    image_url: 'https://images.pexels.com/photos/3065209/pexels-photo-3065209.jpeg?auto=compress&cs=tinysrgb&w=800',
    icon: 'Scissors'
  },
  {
    name: 'Trabajar en proyecto personal',
    description: 'Tiempo sin interrupciones para tus proyectos',
    points_cost: 40,
    image_url: 'https://images.pexels.com/photos/1181406/pexels-photo-1181406.jpeg?auto=compress&cs=tinysrgb&w=800',
    icon: 'Lightbulb'
  },
  {
    name: 'Pasear sin rumbo',
    description: 'Tiempo para caminar y desconectar',
    points_cost: 20,
    image_url: 'https://images.pexels.com/photos/1024993/pexels-photo-1024993.jpeg?auto=compress&cs=tinysrgb&w=800',
    icon: 'Footprints'
  },
  {
    name: 'Día sin tareas domésticas',
    description: 'La otra persona se hace cargo de todo',
    points_cost: 50,
    image_url: 'https://images.pexels.com/photos/4239091/pexels-photo-4239091.jpeg?auto=compress&cs=tinysrgb&w=800',
    icon: 'Home'
  }
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
