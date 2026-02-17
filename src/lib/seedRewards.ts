import { supabase } from './supabase';

interface RewardDef {
  name: string;
  description: string;
  points_cost: number;
  image_url: string;
  icon: string;
  tags: string[];
}

const allRewards: RewardDef[] = [
  { name: 'Paseo con la mascota cubierto', description: 'Tu pareja saca a pasear a la mascota por ti', points_cost: 10, image_url: 'https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=800', icon: 'PawPrint', tags: ['help', 'pets'] },
  { name: 'Siesta tranquila', description: 'Tiempo para descansar sin interrupciones', points_cost: 20, image_url: 'https://images.pexels.com/photos/3771069/pexels-photo-3771069.jpeg?auto=compress&cs=tinysrgb&w=800', icon: 'CloudMoon', tags: ['leisure'] },
  { name: 'Leer tranquilamente', description: 'Tiempo ininterrumpido para leer', points_cost: 20, image_url: 'https://images.pexels.com/photos/1741230/pexels-photo-1741230.jpeg?auto=compress&cs=tinysrgb&w=800', icon: 'Book', tags: ['leisure'] },
  { name: 'Pasear sin rumbo', description: 'Tiempo para caminar y desconectar', points_cost: 20, image_url: 'https://images.pexels.com/photos/1024993/pexels-photo-1024993.jpeg?auto=compress&cs=tinysrgb&w=800', icon: 'Footprints', tags: ['leisure', 'dates'] },
  { name: 'Ir al gimnasio', description: 'Tiempo para ir al gym tranquilamente', points_cost: 25, image_url: 'https://images.pexels.com/photos/1552242/pexels-photo-1552242.jpeg?auto=compress&cs=tinysrgb&w=800', icon: 'Dumbbell', tags: ['dates'] },
  { name: 'Ver series o peliculas', description: 'Tiempo para maratonear sin interrupciones', points_cost: 25, image_url: 'https://images.pexels.com/photos/7991158/pexels-photo-7991158.jpeg?auto=compress&cs=tinysrgb&w=800', icon: 'Tv', tags: ['leisure'] },
  { name: 'Dormir hasta tarde', description: 'Despertar sin despertador ni responsabilidades', points_cost: 30, image_url: 'https://images.pexels.com/photos/1183828/pexels-photo-1183828.jpeg?auto=compress&cs=tinysrgb&w=800', icon: 'Moon', tags: ['leisure'] },
  { name: '2 horas de tiempo libre', description: 'Tiempo para ti sin interrupciones', points_cost: 30, image_url: 'https://images.pexels.com/photos/3897529/pexels-photo-3897529.jpeg?auto=compress&cs=tinysrgb&w=800', icon: 'Clock', tags: ['leisure'] },
  { name: 'Deporte o actividad personal', description: 'Tiempo para tu actividad deportiva favorita', points_cost: 30, image_url: 'https://images.pexels.com/photos/235922/pexels-photo-235922.jpeg?auto=compress&cs=tinysrgb&w=800', icon: 'Bike', tags: ['dates'] },
  { name: 'Hobby personal', description: 'Tiempo dedicado a tu hobby', points_cost: 30, image_url: 'https://images.pexels.com/photos/1109197/pexels-photo-1109197.jpeg?auto=compress&cs=tinysrgb&w=800', icon: 'Star', tags: ['treats'] },
  { name: 'Ir a la peluqueria', description: 'Tiempo para cuidado personal', points_cost: 30, image_url: 'https://images.pexels.com/photos/3065209/pexels-photo-3065209.jpeg?auto=compress&cs=tinysrgb&w=800', icon: 'Scissors', tags: ['treats'] },
  { name: 'Ir de compras solo/a', description: 'Tiempo para ir de compras sin prisas', points_cost: 35, image_url: 'https://images.pexels.com/photos/972995/pexels-photo-972995.jpeg?auto=compress&cs=tinysrgb&w=800', icon: 'ShoppingBag', tags: ['dates', 'treats'] },
  { name: '3 horas de tiempo libre', description: 'Tiempo personal para hacer lo que quieras', points_cost: 40, image_url: 'https://images.pexels.com/photos/1109197/pexels-photo-1109197.jpeg?auto=compress&cs=tinysrgb&w=800', icon: 'Clock', tags: ['leisure'] },
  { name: 'Trabajar en proyecto personal', description: 'Tiempo sin interrupciones para tus proyectos', points_cost: 45, image_url: 'https://images.pexels.com/photos/1181406/pexels-photo-1181406.jpeg?auto=compress&cs=tinysrgb&w=800', icon: 'Lightbulb', tags: ['leisure'] },
  { name: 'Cita romantica organizada', description: 'Tu pareja organiza todo para una cita perfecta', points_cost: 45, image_url: 'https://images.pexels.com/photos/1024960/pexels-photo-1024960.jpeg?auto=compress&cs=tinysrgb&w=800', icon: 'Heart', tags: ['dates'] },
  { name: 'Salir con amigos', description: 'Tiempo para salir con tus amistades', points_cost: 50, image_url: 'https://images.pexels.com/photos/1267696/pexels-photo-1267696.jpeg?auto=compress&cs=tinysrgb&w=800', icon: 'Users', tags: ['dates'] },
  { name: 'Manana libre (4h)', description: 'Manana completa para ti', points_cost: 55, image_url: 'https://images.pexels.com/photos/851213/pexels-photo-851213.jpeg?auto=compress&cs=tinysrgb&w=800', icon: 'Sunrise', tags: ['leisure'] },
  { name: 'Dia sin tareas domesticas', description: 'La otra persona se hace cargo de todo', points_cost: 60, image_url: 'https://images.pexels.com/photos/4239091/pexels-photo-4239091.jpeg?auto=compress&cs=tinysrgb&w=800', icon: 'Home', tags: ['help'] },
  { name: 'Tarde libre completa (5h)', description: 'Toda la tarde sin responsabilidades', points_cost: 65, image_url: 'https://images.pexels.com/photos/1449791/pexels-photo-1449791.jpeg?auto=compress&cs=tinysrgb&w=800', icon: 'Sun', tags: ['leisure'] },
  { name: 'Noche libre de ninos', description: 'Tu pareja se encarga de los ninos toda la noche', points_cost: 60, image_url: 'https://images.pexels.com/photos/3771069/pexels-photo-3771069.jpeg?auto=compress&cs=tinysrgb&w=800', icon: 'Moon', tags: ['help', 'children'] },
  { name: 'Ir al spa o masaje', description: 'Tiempo para autocuidado profesional', points_cost: 70, image_url: 'https://images.pexels.com/photos/3757952/pexels-photo-3757952.jpeg?auto=compress&cs=tinysrgb&w=800', icon: 'Sparkles', tags: ['treats'] },
  { name: 'Dia completo libre', description: 'Todo el dia para ti', points_cost: 100, image_url: 'https://images.pexels.com/photos/1659438/pexels-photo-1659438.jpeg?auto=compress&cs=tinysrgb&w=800', icon: 'Calendar', tags: ['leisure'] },
  { name: 'Semana sin cocinar', description: 'Tu pareja cocina toda la semana', points_cost: 120, image_url: 'https://images.pexels.com/photos/1267320/pexels-photo-1267320.jpeg?auto=compress&cs=tinysrgb&w=800', icon: 'Utensils', tags: ['help'] },
  { name: 'Fin de semana libre', description: 'Sabado y domingo completos libres', points_cost: 150, image_url: 'https://images.pexels.com/photos/346529/pexels-photo-346529.jpeg?auto=compress&cs=tinysrgb&w=800', icon: 'CalendarDays', tags: ['leisure'] },
];

interface SeedPreferences {
  rewardPreferences?: string[];
  hasPets?: boolean;
  hasChildren?: boolean;
}

export async function seedRewardsForCouple(coupleId: string, preferences?: SeedPreferences) {
  try {
    const { data: existingRewards } = await supabase
      .from('rewards')
      .select('id')
      .eq('couple_id', coupleId)
      .limit(1);

    if (existingRewards && existingRewards.length > 0) {
      return { success: true, message: 'Rewards already seeded' };
    }

    let filtered = allRewards.filter(r => {
      if (r.tags.includes('children') && !preferences?.hasChildren) return false;
      if (r.tags.includes('pets') && !preferences?.hasPets) return false;
      return true;
    });

    if (preferences?.rewardPreferences && preferences.rewardPreferences.length > 0) {
      const prefs = preferences.rewardPreferences;
      const preferred = filtered.filter(r => r.tags.some(t => prefs.includes(t)));
      const others = filtered.filter(r => !r.tags.some(t => prefs.includes(t)));
      filtered = [...preferred, ...others.slice(0, 4)];
    }

    const rewardsToInsert = filtered.map(({ tags: _tags, ...reward }) => ({
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
