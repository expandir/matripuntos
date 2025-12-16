import { supabase } from './supabase';

export async function seedAchievements() {
  const { data: existing } = await supabase
    .from('achievements')
    .select('id')
    .limit(1);

  if (existing && existing.length > 0) {
    console.log('Achievements already seeded');
    return;
  }

  const achievements = [
    // Points-based achievements
    {
      name: 'Primer Paso',
      description: 'Gana tus primeros 10 puntos',
      icon: 'Star',
      category: 'points',
      requirement: 10,
      requirement_type: 'total_points',
      tier: 'bronze'
    },
    {
      name: 'Escalando',
      description: 'Acumula 50 puntos en total',
      icon: 'TrendingUp',
      category: 'points',
      requirement: 50,
      requirement_type: 'total_points',
      tier: 'bronze'
    },
    {
      name: 'Centurión',
      description: 'Alcanza 100 puntos totales',
      icon: 'Award',
      category: 'points',
      requirement: 100,
      requirement_type: 'total_points',
      tier: 'silver'
    },
    {
      name: 'Imparable',
      description: 'Consigue 250 puntos en total',
      icon: 'Zap',
      category: 'points',
      requirement: 250,
      requirement_type: 'total_points',
      tier: 'silver'
    },
    {
      name: 'Leyenda',
      description: 'Acumula 500 puntos totales',
      icon: 'Crown',
      category: 'points',
      requirement: 500,
      requirement_type: 'total_points',
      tier: 'gold'
    },
    {
      name: 'Maestro Supremo',
      description: 'Alcanza 1000 puntos totales',
      icon: 'Trophy',
      category: 'points',
      requirement: 1000,
      requirement_type: 'total_points',
      tier: 'platinum'
    },

    // Streak-based achievements
    {
      name: 'Constancia',
      description: 'Gana puntos 3 días seguidos',
      icon: 'Flame',
      category: 'streak',
      requirement: 3,
      requirement_type: 'streak_days',
      tier: 'bronze'
    },
    {
      name: 'Dedicación',
      description: 'Mantén una racha de 7 días',
      icon: 'Calendar',
      category: 'streak',
      requirement: 7,
      requirement_type: 'streak_days',
      tier: 'silver'
    },
    {
      name: 'Compromiso',
      description: 'Racha de 14 días consecutivos',
      icon: 'CalendarCheck',
      category: 'streak',
      requirement: 14,
      requirement_type: 'streak_days',
      tier: 'gold'
    },
    {
      name: 'Inquebrantable',
      description: 'Consigue una racha de 30 días',
      icon: 'Sparkles',
      category: 'streak',
      requirement: 30,
      requirement_type: 'streak_days',
      tier: 'platinum'
    },

    // Activity-based achievements
    {
      name: 'Primera Actividad',
      description: 'Completa tu primera actividad',
      icon: 'CheckCircle',
      category: 'activity',
      requirement: 1,
      requirement_type: 'activity_count',
      tier: 'bronze'
    },
    {
      name: 'Activo',
      description: 'Completa 10 actividades',
      icon: 'ListChecks',
      category: 'activity',
      requirement: 10,
      requirement_type: 'activity_count',
      tier: 'bronze'
    },
    {
      name: 'Muy Activo',
      description: 'Completa 25 actividades',
      icon: 'Target',
      category: 'activity',
      requirement: 25,
      requirement_type: 'activity_count',
      tier: 'silver'
    },
    {
      name: 'Incansable',
      description: 'Completa 50 actividades',
      icon: 'Rocket',
      category: 'activity',
      requirement: 50,
      requirement_type: 'activity_count',
      tier: 'gold'
    },
    {
      name: 'Todopoderoso',
      description: 'Completa 100 actividades',
      icon: 'Sparkle',
      category: 'activity',
      requirement: 100,
      requirement_type: 'activity_count',
      tier: 'platinum'
    },

    // Category-specific achievements
    {
      name: 'Romántico Nato',
      description: 'Completa 10 actividades románticas',
      icon: 'Heart',
      category: 'activity',
      requirement: 10,
      requirement_type: 'romantic_count',
      tier: 'silver'
    },
    {
      name: 'Amo de Casa',
      description: 'Completa 15 actividades del hogar',
      icon: 'Home',
      category: 'activity',
      requirement: 15,
      requirement_type: 'household_count',
      tier: 'silver'
    },
    {
      name: 'Vida Saludable',
      description: 'Completa 10 actividades de salud',
      icon: 'Heart',
      category: 'activity',
      requirement: 10,
      requirement_type: 'health_count',
      tier: 'silver'
    },
    {
      name: 'Maestro de Sorpresas',
      description: 'Completa 10 actividades sorpresa',
      icon: 'Gift',
      category: 'activity',
      requirement: 10,
      requirement_type: 'surprise_count',
      tier: 'silver'
    },
    {
      name: 'Alma de la Fiesta',
      description: 'Completa 15 actividades de diversión',
      icon: 'PartyPopper',
      category: 'activity',
      requirement: 15,
      requirement_type: 'fun_count',
      tier: 'silver'
    },

    // Special achievements
    {
      name: 'Primera Recompensa',
      description: 'Canjea tu primera recompensa',
      icon: 'Gift',
      category: 'special',
      requirement: 1,
      requirement_type: 'reward_redeemed',
      tier: 'bronze'
    },
    {
      name: 'Equilibrio Perfecto',
      description: 'Completa al menos 5 actividades de cada categoría',
      icon: 'Scale',
      category: 'special',
      requirement: 5,
      requirement_type: 'all_categories',
      tier: 'gold'
    },
    {
      name: 'Equipo Perfecto',
      description: 'Ambos miembros de la pareja tienen más de 100 puntos',
      icon: 'Users',
      category: 'special',
      requirement: 100,
      requirement_type: 'couple_balance',
      tier: 'gold'
    },
    {
      name: 'Madrugador',
      description: 'Completa una actividad antes de las 8 AM',
      icon: 'Sunrise',
      category: 'special',
      requirement: 1,
      requirement_type: 'early_bird',
      tier: 'bronze'
    },
    {
      name: 'Noctámbulo',
      description: 'Completa una actividad después de las 10 PM',
      icon: 'Moon',
      category: 'special',
      requirement: 1,
      requirement_type: 'night_owl',
      tier: 'bronze'
    }
  ];

  const { error } = await supabase
    .from('achievements')
    .insert(achievements);

  if (error) {
    console.error('Error seeding achievements:', error);
  } else {
    console.log('Successfully seeded achievements');
  }
}
