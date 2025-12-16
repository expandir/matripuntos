import { supabase } from './supabase';
import { CatalogCategory } from '../types';

interface CatalogItemData {
  name: string;
  description: string;
  points_value: number;
  category: CatalogCategory;
  icon: string;
}

export const catalogActivities: CatalogItemData[] = [
  {
    name: 'Desayuno en la cama',
    description: 'Preparar un desayuno especial y llevarlo a la cama',
    points_value: 20,
    category: 'romantic',
    icon: 'Coffee'
  },
  {
    name: 'Mensaje de amor inesperado',
    description: 'Enviar un mensaje romántico sin motivo especial',
    points_value: 10,
    category: 'romantic',
    icon: 'Heart'
  },
  {
    name: 'Abrazo de 30 segundos',
    description: 'Dar un abrazo prolongado y sincero',
    points_value: 5,
    category: 'romantic',
    icon: 'Heart'
  },
  {
    name: 'Cita sorpresa',
    description: 'Organizar una cita sin previo aviso',
    points_value: 30,
    category: 'romantic',
    icon: 'Calendar'
  },
  {
    name: 'Beso de buenos días',
    description: 'Despertar a tu pareja con un beso',
    points_value: 5,
    category: 'romantic',
    icon: 'Heart'
  },
  {
    name: 'Lavar los platos',
    description: 'Lavar todos los platos sin que te lo pidan',
    points_value: 15,
    category: 'household',
    icon: 'Droplet'
  },
  {
    name: 'Hacer la cama',
    description: 'Ordenar completamente la habitación',
    points_value: 10,
    category: 'household',
    icon: 'Home'
  },
  {
    name: 'Limpiar la cocina',
    description: 'Dejar la cocina impecable',
    points_value: 20,
    category: 'household',
    icon: 'Sparkles'
  },
  {
    name: 'Hacer la compra',
    description: 'Ir al supermercado y hacer la compra completa',
    points_value: 25,
    category: 'household',
    icon: 'ShoppingBag'
  },
  {
    name: 'Sacar la basura',
    description: 'Sacar toda la basura de la casa',
    points_value: 10,
    category: 'household',
    icon: 'Trash2'
  },
  {
    name: 'Preparar la cena',
    description: 'Cocinar una cena completa',
    points_value: 25,
    category: 'household',
    icon: 'Utensils'
  },
  {
    name: 'Hacer ejercicio juntos',
    description: 'Realizar al menos 30 minutos de actividad física',
    points_value: 20,
    category: 'health',
    icon: 'Dumbbell'
  },
  {
    name: 'Caminar 10,000 pasos',
    description: 'Dar un paseo largo juntos',
    points_value: 15,
    category: 'health',
    icon: 'Footprints'
  },
  {
    name: 'Cocinar comida saludable',
    description: 'Preparar una comida nutritiva juntos',
    points_value: 20,
    category: 'health',
    icon: 'Apple'
  },
  {
    name: 'Meditación en pareja',
    description: '15 minutos de meditación o relajación juntos',
    points_value: 15,
    category: 'health',
    icon: 'Cloud'
  },
  {
    name: 'Dormir 8 horas',
    description: 'Asegurar un descanso completo',
    points_value: 10,
    category: 'health',
    icon: 'Moon'
  },
  {
    name: 'Jugar videojuegos juntos',
    description: 'Sesión de videojuegos en pareja',
    points_value: 15,
    category: 'fun',
    icon: 'Gamepad2'
  },
  {
    name: 'Ver una película',
    description: 'Disfrutar de una película juntos',
    points_value: 15,
    category: 'fun',
    icon: 'Film'
  },
  {
    name: 'Karaoke casero',
    description: 'Cantar canciones favoritas juntos',
    points_value: 20,
    category: 'fun',
    icon: 'Music'
  },
  {
    name: 'Bailar una canción',
    description: 'Bailar al menos una canción completa',
    points_value: 10,
    category: 'fun',
    icon: 'Music'
  },
  {
    name: 'Hacer un puzzle',
    description: 'Completar un puzzle juntos',
    points_value: 25,
    category: 'fun',
    icon: 'Puzzle'
  },
  {
    name: 'Noche de juegos de mesa',
    description: 'Jugar juegos de mesa durante al menos 1 hora',
    points_value: 20,
    category: 'fun',
    icon: 'Dices'
  },
  {
    name: 'Regalo sorpresa',
    description: 'Dar un pequeño regalo inesperado',
    points_value: 25,
    category: 'surprise',
    icon: 'Gift'
  },
  {
    name: 'Nota de amor escondida',
    description: 'Esconder una nota romántica para que la encuentre',
    points_value: 15,
    category: 'surprise',
    icon: 'FileText'
  },
  {
    name: 'Postre favorito',
    description: 'Preparar o comprar el postre favorito de tu pareja',
    points_value: 20,
    category: 'surprise',
    icon: 'IceCream'
  },
  {
    name: 'Cumplido sincero',
    description: 'Dar un cumplido genuino y específico',
    points_value: 5,
    category: 'surprise',
    icon: 'MessageCircle'
  },
  {
    name: 'Masaje de 10 minutos',
    description: 'Dar un masaje relajante',
    points_value: 20,
    category: 'surprise',
    icon: 'Hand'
  },
  {
    name: 'Flores sin motivo',
    description: 'Traer flores sin que sea una ocasión especial',
    points_value: 25,
    category: 'surprise',
    icon: 'Flower2'
  }
];

export async function seedPointsCatalog() {
  try {
    const { data: existingItems, error: checkError } = await supabase
      .from('points_catalog')
      .select('id')
      .limit(1);

    if (checkError) throw checkError;

    if (existingItems && existingItems.length > 0) {
      console.log('Catalog already seeded');
      return { success: true, message: 'Catalog already exists' };
    }

    const { error: insertError } = await supabase
      .from('points_catalog')
      .insert(catalogActivities);

    if (insertError) throw insertError;

    return { success: true, message: 'Catalog seeded successfully' };
  } catch (error) {
    console.error('Error seeding catalog:', error);
    return { success: false, error };
  }
}
