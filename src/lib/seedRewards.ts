import { supabase } from './supabase';

export const initialRewards = [
  {
    name: 'Tarde libre (3h)',
    description: 'Tarde libre para lo que quieras',
    points_cost: 30,
    image_url: 'https://images.pexels.com/photos/1405870/pexels-photo-1405870.jpeg?auto=compress&cs=tinysrgb&w=800',
    icon: 'Sun'
  },
  {
    name: 'Masaje de 30 min',
    description: 'Masaje relajante de 30 minutos',
    points_cost: 25,
    image_url: 'https://images.pexels.com/photos/3757952/pexels-photo-3757952.jpeg?auto=compress&cs=tinysrgb&w=800',
    icon: 'Waves'
  },
  {
    name: 'Cena hecha por la otra persona',
    description: 'Cena casera preparada por tu pareja',
    points_cost: 20,
    image_url: 'https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg?auto=compress&cs=tinysrgb&w=800',
    icon: 'Utensils'
  },
  {
    name: 'Noche de cine',
    description: 'Película y palomitas a elegir',
    points_cost: 15,
    image_url: 'https://images.pexels.com/photos/7991158/pexels-photo-7991158.jpeg?auto=compress&cs=tinysrgb&w=800',
    icon: 'Popcorn'
  },
  {
    name: 'Desayuno en la cama',
    description: 'Desayuno sorpresa en la cama',
    points_cost: 12,
    image_url: 'https://images.pexels.com/photos/5864266/pexels-photo-5864266.jpeg?auto=compress&cs=tinysrgb&w=800',
    icon: 'Coffee'
  },
  {
    name: 'Sin tareas domésticas (1 día)',
    description: 'La otra persona se hace cargo de las tareas',
    points_cost: 18,
    image_url: 'https://images.pexels.com/photos/4239091/pexels-photo-4239091.jpeg?auto=compress&cs=tinysrgb&w=800',
    icon: 'Home'
  },
  {
    name: 'Paseo romántico',
    description: 'Salida de pareja sin prisas',
    points_cost: 10,
    image_url: 'https://images.pexels.com/photos/1024993/pexels-photo-1024993.jpeg?auto=compress&cs=tinysrgb&w=800',
    icon: 'Footprints'
  },
  {
    name: 'Fin de semana sin niños',
    description: 'Cuidado de la niña por parte de la otra persona',
    points_cost: 60,
    image_url: 'https://images.pexels.com/photos/1659438/pexels-photo-1659438.jpeg?auto=compress&cs=tinysrgb&w=800',
    icon: 'TreePalm'
  },
  {
    name: 'Masaje + cena rápida',
    description: 'Combo relajación',
    points_cost: 40,
    image_url: 'https://images.pexels.com/photos/3997991/pexels-photo-3997991.jpeg?auto=compress&cs=tinysrgb&w=800',
    icon: 'Gem'
  },
  {
    name: 'Playlist personalizada',
    description: 'Playlist hecha por tu pareja',
    points_cost: 8,
    image_url: 'https://images.pexels.com/photos/165971/pexels-photo-165971.jpeg?auto=compress&cs=tinysrgb&w=800',
    icon: 'Music'
  },
  {
    name: 'Regalo sorpresa pequeño',
    description: 'Detalle comprado o hecho a mano',
    points_cost: 22,
    image_url: 'https://images.pexels.com/photos/264960/pexels-photo-264960.jpeg?auto=compress&cs=tinysrgb&w=800',
    icon: 'Gift'
  },
  {
    name: 'Clase de baile juntos',
    description: 'Una clase para los dos',
    points_cost: 45,
    image_url: 'https://images.pexels.com/photos/8520617/pexels-photo-8520617.jpeg?auto=compress&cs=tinysrgb&w=800',
    icon: 'PartyPopper'
  },
  {
    name: 'Día de desconexión',
    description: 'Día enfocado a la pareja sin móviles',
    points_cost: 35,
    image_url: 'https://images.pexels.com/photos/1449791/pexels-photo-1449791.jpeg?auto=compress&cs=tinysrgb&w=800',
    icon: 'Cloud'
  },
  {
    name: 'Tarde de juegos',
    description: 'Juegos de mesa o videojuegos juntos',
    points_cost: 12,
    image_url: 'https://images.pexels.com/photos/3394347/pexels-photo-3394347.jpeg?auto=compress&cs=tinysrgb&w=800',
    icon: 'Gamepad2'
  },
  {
    name: 'Carta romántica',
    description: 'Carta escrita a mano',
    points_cost: 6,
    image_url: 'https://images.pexels.com/photos/6372459/pexels-photo-6372459.jpeg?auto=compress&cs=tinysrgb&w=800',
    icon: 'ScrollText'
  },
  {
    name: 'Sesión de fotos casera',
    description: 'Fotos espontáneas de pareja',
    points_cost: 14,
    image_url: 'https://images.pexels.com/photos/1983037/pexels-photo-1983037.jpeg?auto=compress&cs=tinysrgb&w=800',
    icon: 'Camera'
  },
  {
    name: 'Plan sorpresa',
    description: 'Sorpresa organizada por tu pareja',
    points_cost: 28,
    image_url: 'https://images.pexels.com/photos/1303082/pexels-photo-1303082.jpeg?auto=compress&cs=tinysrgb&w=800',
    icon: 'Star'
  },
  {
    name: 'Cocinar juntos',
    description: 'Cocinar juntos una receta especial',
    points_cost: 10,
    image_url: 'https://images.pexels.com/photos/3184192/pexels-photo-3184192.jpeg?auto=compress&cs=tinysrgb&w=800',
    icon: 'ChefHat'
  },
  {
    name: 'Noche sin responsabilidades',
    description: 'Cuidado de la niña por la otra persona',
    points_cost: 40,
    image_url: 'https://images.pexels.com/photos/1183828/pexels-photo-1183828.jpeg?auto=compress&cs=tinysrgb&w=800',
    icon: 'Moon'
  },
  {
    name: 'Día de spa en casa',
    description: 'Espacio acondicionado para relajarse en casa',
    points_cost: 32,
    image_url: 'https://images.pexels.com/photos/3865906/pexels-photo-3865906.jpeg?auto=compress&cs=tinysrgb&w=800',
    icon: 'Bath'
  },
  {
    name: 'Carta de agradecimiento pública',
    description: 'Agradecimiento en redes o a familia',
    points_cost: 5,
    image_url: 'https://images.pexels.com/photos/2072165/pexels-photo-2072165.jpeg?auto=compress&cs=tinysrgb&w=800',
    icon: 'MailOpen'
  },
  {
    name: 'Lista de tareas organizada',
    description: 'La otra persona organiza la lista',
    points_cost: 7,
    image_url: 'https://images.pexels.com/photos/4226140/pexels-photo-4226140.jpeg?auto=compress&cs=tinysrgb&w=800',
    icon: 'ClipboardList'
  },
  {
    name: 'Paseo en bici',
    description: 'Paseo corto en bici juntos',
    points_cost: 9,
    image_url: 'https://images.pexels.com/photos/1571440/pexels-photo-1571440.jpeg?auto=compress&cs=tinysrgb&w=800',
    icon: 'Bike'
  },
  {
    name: 'Cita sorpresa en casa',
    description: 'Cena y ambiente sorpresa en casa',
    points_cost: 26,
    image_url: 'https://images.pexels.com/photos/3171201/pexels-photo-3171201.jpeg?auto=compress&cs=tinysrgb&w=800',
    icon: 'Heart'
  },
  {
    name: 'Clase de instrumento',
    description: 'Lección de ukulele o guitarra básica',
    points_cost: 20,
    image_url: 'https://images.pexels.com/photos/1751731/pexels-photo-1751731.jpeg?auto=compress&cs=tinysrgb&w=800',
    icon: 'Guitar'
  },
  {
    name: 'Elección de película',
    description: 'Tu pareja cede la elección',
    points_cost: 6,
    image_url: 'https://images.pexels.com/photos/7991319/pexels-photo-7991319.jpeg?auto=compress&cs=tinysrgb&w=800',
    icon: 'Film'
  },
  {
    name: 'Tarde de lectura juntos',
    description: 'Ambos leen y comparten',
    points_cost: 8,
    image_url: 'https://images.pexels.com/photos/4866020/pexels-photo-4866020.jpeg?auto=compress&cs=tinysrgb&w=800',
    icon: 'Book'
  },
  {
    name: 'Spa profesional',
    description: 'Visita a spa (coste adicional)',
    points_cost: 100,
    image_url: 'https://images.pexels.com/photos/3757959/pexels-photo-3757959.jpeg?auto=compress&cs=tinysrgb&w=800',
    icon: 'Crown'
  },
  {
    name: 'Día de hobbies',
    description: 'Dedicación a tu hobby sin interrupciones',
    points_cost: 22,
    image_url: 'https://images.pexels.com/photos/1109197/pexels-photo-1109197.jpeg?auto=compress&cs=tinysrgb&w=800',
    icon: 'Star'
  },
  {
    name: 'Cena fuera',
    description: 'Salir a cenar a un lugar asequible',
    points_cost: 55,
    image_url: 'https://images.pexels.com/photos/1307698/pexels-photo-1307698.jpeg?auto=compress&cs=tinysrgb&w=800',
    icon: 'UtensilsCrossed'
  },
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
