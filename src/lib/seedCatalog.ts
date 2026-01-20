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
    name: 'Lavar los platos',
    description: 'Lavar y secar todos los platos',
    points_value: 15,
    category: 'household',
    icon: 'Droplet'
  },
  {
    name: 'Limpiar la cocina',
    description: 'Dejar la cocina limpia y ordenada',
    points_value: 20,
    category: 'household',
    icon: 'Sparkles'
  },
  {
    name: 'Limpiar el baño',
    description: 'Limpieza completa del baño',
    points_value: 25,
    category: 'household',
    icon: 'Droplet'
  },
  {
    name: 'Hacer la compra',
    description: 'Ir al supermercado y hacer la compra',
    points_value: 30,
    category: 'household',
    icon: 'ShoppingBag'
  },
  {
    name: 'Sacar la basura',
    description: 'Sacar toda la basura de casa',
    points_value: 10,
    category: 'household',
    icon: 'Trash2'
  },
  {
    name: 'Hacer la colada',
    description: 'Lavar, tender y recoger la ropa',
    points_value: 25,
    category: 'household',
    icon: 'Shirt'
  },
  {
    name: 'Planchar',
    description: 'Planchar la ropa acumulada',
    points_value: 20,
    category: 'household',
    icon: 'Shirt'
  },
  {
    name: 'Preparar desayuno',
    description: 'Hacer el desayuno para la familia',
    points_value: 15,
    category: 'household',
    icon: 'Coffee'
  },
  {
    name: 'Preparar comida',
    description: 'Cocinar la comida del mediodía',
    points_value: 30,
    category: 'household',
    icon: 'Utensils'
  },
  {
    name: 'Preparar cena',
    description: 'Cocinar la cena',
    points_value: 30,
    category: 'household',
    icon: 'Utensils'
  },
  {
    name: 'Ordenar la casa',
    description: 'Recoger y ordenar espacios comunes',
    points_value: 20,
    category: 'household',
    icon: 'Home'
  },
  {
    name: 'Cuidado completo del bebé',
    description: 'Hacerse cargo del bebé durante 3+ horas',
    points_value: 40,
    category: 'childcare',
    icon: 'Baby'
  },
  {
    name: 'Cambiar pañales',
    description: 'Cambiar pañales del bebé',
    points_value: 10,
    category: 'childcare',
    icon: 'Baby'
  },
  {
    name: 'Preparar lunch escolar',
    description: 'Preparar comida para llevar al colegio',
    points_value: 15,
    category: 'childcare',
    icon: 'Backpack'
  },
  {
    name: 'Llevar al cole',
    description: 'Llevar a los niños al colegio',
    points_value: 20,
    category: 'childcare',
    icon: 'School'
  },
  {
    name: 'Recoger del cole',
    description: 'Recoger a los niños del colegio',
    points_value: 20,
    category: 'childcare',
    icon: 'School'
  },
  {
    name: 'Ayudar con deberes',
    description: 'Supervisar y ayudar con tareas escolares',
    points_value: 25,
    category: 'childcare',
    icon: 'BookOpen'
  },
  {
    name: 'Rutina de baño',
    description: 'Bañar a los niños',
    points_value: 20,
    category: 'childcare',
    icon: 'Bath'
  },
  {
    name: 'Rutina de dormir',
    description: 'Acostar a los niños (cuento incluido)',
    points_value: 25,
    category: 'childcare',
    icon: 'Moon'
  },
  {
    name: 'Llevar al médico',
    description: 'Llevar a los niños a cita médica',
    points_value: 35,
    category: 'childcare',
    icon: 'Stethoscope'
  },
  {
    name: 'Actividad extraescolar',
    description: 'Llevar/recoger de actividades',
    points_value: 25,
    category: 'childcare',
    icon: 'Music'
  },
  {
    name: 'Gestionar calendario familiar',
    description: 'Organizar agenda y citas de la familia',
    points_value: 20,
    category: 'management',
    icon: 'Calendar'
  },
  {
    name: 'Pagar facturas',
    description: 'Gestionar y pagar facturas pendientes',
    points_value: 20,
    category: 'management',
    icon: 'CreditCard'
  },
  {
    name: 'Gestiones administrativas',
    description: 'Trámites, papeleos, llamadas oficiales',
    points_value: 30,
    category: 'management',
    icon: 'FileText'
  },
  {
    name: 'Organizar cumpleaños',
    description: 'Planificar fiesta de cumpleaños',
    points_value: 40,
    category: 'management',
    icon: 'PartyPopper'
  },
  {
    name: 'Comprar regalos',
    description: 'Comprar regalos para eventos familiares',
    points_value: 25,
    category: 'management',
    icon: 'Gift'
  },
  {
    name: 'Mantenimiento del hogar',
    description: 'Pequeñas reparaciones o gestionar averías',
    points_value: 30,
    category: 'management',
    icon: 'Wrench'
  },
  {
    name: 'Revisar coche',
    description: 'Llevar coche a revisión o mantenimiento',
    points_value: 30,
    category: 'management',
    icon: 'Car'
  },
  {
    name: 'Tiempo personal',
    description: 'Dar tiempo libre a tu pareja sin interrupciones',
    points_value: 35,
    category: 'self_care',
    icon: 'Smile'
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
