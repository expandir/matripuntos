import { supabase } from './supabase';

export interface PointsOverTime {
  date: string;
  gained: number;
  spent: number;
}

export interface CategoryStats {
  category: string;
  points: number;
  count: number;
}

export interface RewardStats {
  name: string;
  timesRedeemed: number;
  totalPoints: number;
}

export interface OverallStats {
  totalPointsGained: number;
  totalPointsSpent: number;
  currentPoints: number;
  totalRewards: number;
  completedChallenges: number;
  totalAchievements: number;
}

const categoryNames: Record<string, string> = {
  household: 'Tareas del hogar',
  childcare: 'Cuidado de niños',
  management: 'Gestión familiar',
  self_care: 'Autocuidado'
};

export async function getOverallStats(coupleId: string): Promise<OverallStats> {
  const [historyResult, coupleResult, challengesResult, achievementsResult] = await Promise.all([
    supabase
      .from('history')
      .select('points, type')
      .eq('couple_id', coupleId),
    supabase
      .from('couples')
      .select('points')
      .eq('id', coupleId)
      .maybeSingle(),
    supabase
      .from('weekly_challenges')
      .select('id')
      .eq('couple_id', coupleId)
      .eq('completed', true),
    supabase
      .from('user_achievements')
      .select('id')
      .eq('couple_id', coupleId)
      .eq('unlocked', true)
  ]);

  const history = historyResult.data || [];
  const totalPointsGained = history
    .filter(h => h.type === 'gain')
    .reduce((sum, h) => sum + h.points, 0);
  const totalPointsSpent = history
    .filter(h => h.type === 'spend')
    .reduce((sum, h) => sum + Math.abs(h.points), 0);

  return {
    totalPointsGained,
    totalPointsSpent,
    currentPoints: coupleResult.data?.points || 0,
    totalRewards: history.filter(h => h.type === 'spend').length,
    completedChallenges: challengesResult.data?.length || 0,
    totalAchievements: achievementsResult.data?.length || 0
  };
}

export async function getPointsOverTime(coupleId: string, days: number = 30): Promise<PointsOverTime[]> {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const { data: history } = await supabase
    .from('history')
    .select('points, type, created_at')
    .eq('couple_id', coupleId)
    .gte('created_at', startDate.toISOString())
    .order('created_at', { ascending: true });

  if (!history || history.length === 0) return [];

  const dailyStats = new Map<string, { gained: number; spent: number }>();

  history.forEach(entry => {
    const date = new Date(entry.created_at).toLocaleDateString('es-ES', {
      month: 'short',
      day: 'numeric'
    });

    if (!dailyStats.has(date)) {
      dailyStats.set(date, { gained: 0, spent: 0 });
    }

    const stats = dailyStats.get(date)!;
    if (entry.type === 'gain') {
      stats.gained += entry.points;
    } else {
      stats.spent += Math.abs(entry.points);
    }
  });

  return Array.from(dailyStats.entries()).map(([date, stats]) => ({
    date,
    gained: stats.gained,
    spent: stats.spent
  }));
}

export async function getCategoryStats(coupleId: string): Promise<CategoryStats[]> {
  const { data: completions } = await supabase
    .from('catalog_completions')
    .select(`
      catalog_items (
        category,
        points_value
      )
    `)
    .eq('couple_id', coupleId);

  if (!completions || completions.length === 0) return [];

  const categoryMap = new Map<string, { points: number; count: number }>();

  completions.forEach((completion: any) => {
    if (completion.catalog_items) {
      const category = completion.catalog_items.category;
      const points = completion.catalog_items.points_value;

      if (!categoryMap.has(category)) {
        categoryMap.set(category, { points: 0, count: 0 });
      }

      const stats = categoryMap.get(category)!;
      stats.points += points;
      stats.count += 1;
    }
  });

  return Array.from(categoryMap.entries()).map(([category, stats]) => ({
    category: categoryNames[category] || category,
    points: stats.points,
    count: stats.count
  }));
}

export async function getRewardStats(coupleId: string): Promise<RewardStats[]> {
  const { data: history } = await supabase
    .from('history')
    .select('description, points')
    .eq('couple_id', coupleId)
    .eq('type', 'spend')
    .order('created_at', { ascending: false });

  if (!history || history.length === 0) return [];

  const rewardMap = new Map<string, { timesRedeemed: number; totalPoints: number }>();

  history.forEach(entry => {
    const rewardName = entry.description.replace('Canjeaste: ', '');

    if (!rewardMap.has(rewardName)) {
      rewardMap.set(rewardName, { timesRedeemed: 0, totalPoints: 0 });
    }

    const stats = rewardMap.get(rewardName)!;
    stats.timesRedeemed += 1;
    stats.totalPoints += Math.abs(entry.points);
  });

  return Array.from(rewardMap.entries())
    .map(([name, stats]) => ({
      name,
      timesRedeemed: stats.timesRedeemed,
      totalPoints: stats.totalPoints
    }))
    .sort((a, b) => b.timesRedeemed - a.timesRedeemed)
    .slice(0, 5);
}
