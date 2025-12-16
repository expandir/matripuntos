import { supabase } from './supabase';
import toast from 'react-hot-toast';

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  requirement: number;
  requirement_type: string;
  tier: string;
}

export async function checkAndUnlockAchievements(userId: string) {
  try {
    const achievements = await checkAllAchievements(userId);

    for (const achievement of achievements) {
      await unlockAchievement(userId, achievement);
    }
  } catch (error) {
    console.error('Error checking achievements:', error);
  }
}

async function checkAllAchievements(userId: string): Promise<Achievement[]> {
  const toUnlock: Achievement[] = [];

  const pointsAchievements = await checkPointsAchievements(userId);
  const activityAchievements = await checkActivityAchievements(userId);
  const specialAchievements = await checkSpecialAchievements(userId);

  return [...pointsAchievements, ...activityAchievements, ...specialAchievements];
}

async function checkPointsAchievements(userId: string): Promise<Achievement[]> {
  const { data: historyPoints } = await supabase
    .from('history')
    .select('points, type')
    .eq('user_id', userId);

  if (!historyPoints) return [];

  const total = historyPoints.reduce((sum, record) => {
    return record.type === 'gain' ? sum + record.points : sum;
  }, 0);

  const { data: achievements } = await supabase
    .from('achievements')
    .select('*')
    .eq('requirement_type', 'total_points')
    .lte('requirement', total);

  if (!achievements) return [];

  const { data: unlocked } = await supabase
    .from('user_achievements')
    .select('achievement_id')
    .eq('user_id', userId);

  const unlockedIds = new Set(unlocked?.map(u => u.achievement_id) || []);

  return achievements.filter(a => !unlockedIds.has(a.id));
}

async function checkActivityAchievements(userId: string): Promise<Achievement[]> {
  const { data: completions } = await supabase
    .from('catalog_completions')
    .select(`
      id,
      catalog_item:points_catalog(category)
    `)
    .eq('user_id', userId);

  if (!completions) return [];

  const totalActivities = completions.length;

  const categoryCounts: Record<string, number> = {
    romantic: 0,
    household: 0,
    health: 0,
    fun: 0,
    surprise: 0
  };

  completions.forEach(completion => {
    const category = (completion.catalog_item as any)?.category;
    if (category && categoryCounts.hasOwnProperty(category)) {
      categoryCounts[category]++;
    }
  });

  const { data: achievements } = await supabase
    .from('achievements')
    .select('*')
    .in('requirement_type', [
      'activity_count',
      'romantic_count',
      'household_count',
      'health_count',
      'fun_count',
      'surprise_count'
    ]);

  if (!achievements) return [];

  const { data: unlocked } = await supabase
    .from('user_achievements')
    .select('achievement_id')
    .eq('user_id', userId);

  const unlockedIds = new Set(unlocked?.map(u => u.achievement_id) || []);

  const toUnlock: Achievement[] = [];

  for (const achievement of achievements) {
    if (unlockedIds.has(achievement.id)) continue;

    let meetsRequirement = false;

    switch (achievement.requirement_type) {
      case 'activity_count':
        meetsRequirement = totalActivities >= achievement.requirement;
        break;
      case 'romantic_count':
        meetsRequirement = categoryCounts.romantic >= achievement.requirement;
        break;
      case 'household_count':
        meetsRequirement = categoryCounts.household >= achievement.requirement;
        break;
      case 'health_count':
        meetsRequirement = categoryCounts.health >= achievement.requirement;
        break;
      case 'fun_count':
        meetsRequirement = categoryCounts.fun >= achievement.requirement;
        break;
      case 'surprise_count':
        meetsRequirement = categoryCounts.surprise >= achievement.requirement;
        break;
    }

    if (meetsRequirement) {
      toUnlock.push(achievement);
    }
  }

  return toUnlock;
}

async function checkSpecialAchievements(userId: string): Promise<Achievement[]> {
  const toUnlock: Achievement[] = [];

  const { data: achievements } = await supabase
    .from('achievements')
    .select('*')
    .eq('category', 'special');

  if (!achievements) return [];

  const { data: unlocked } = await supabase
    .from('user_achievements')
    .select('achievement_id')
    .eq('user_id', userId);

  const unlockedIds = new Set(unlocked?.map(u => u.achievement_id) || []);

  for (const achievement of achievements) {
    if (unlockedIds.has(achievement.id)) continue;

    let meetsRequirement = false;

    switch (achievement.requirement_type) {
      case 'reward_redeemed':
        const { data: redeemed } = await supabase
          .from('rewards')
          .select('id')
          .eq('redeemed_by', userId)
          .not('redeemed_at', 'is', null);
        meetsRequirement = (redeemed?.length || 0) >= achievement.requirement;
        break;

      case 'all_categories':
        const { data: completions } = await supabase
          .from('catalog_completions')
          .select(`
            catalog_item:points_catalog(category)
          `)
          .eq('user_id', userId);

        if (completions) {
          const categoryCounts: Record<string, number> = {
            romantic: 0,
            household: 0,
            health: 0,
            fun: 0,
            surprise: 0
          };

          completions.forEach(completion => {
            const category = (completion.catalog_item as any)?.category;
            if (category && categoryCounts.hasOwnProperty(category)) {
              categoryCounts[category]++;
            }
          });

          const allCategoriesMeet = Object.values(categoryCounts)
            .every(count => count >= achievement.requirement);
          meetsRequirement = allCategoriesMeet;
        }
        break;

      case 'early_bird':
        const { data: earlyCompletions } = await supabase
          .from('catalog_completions')
          .select('completed_at')
          .eq('user_id', userId);

        if (earlyCompletions) {
          meetsRequirement = earlyCompletions.some(c => {
            const hour = new Date(c.completed_at).getHours();
            return hour < 8;
          });
        }
        break;

      case 'night_owl':
        const { data: lateCompletions } = await supabase
          .from('catalog_completions')
          .select('completed_at')
          .eq('user_id', userId);

        if (lateCompletions) {
          meetsRequirement = lateCompletions.some(c => {
            const hour = new Date(c.completed_at).getHours();
            return hour >= 22;
          });
        }
        break;
    }

    if (meetsRequirement) {
      toUnlock.push(achievement);
    }
  }

  return toUnlock;
}

async function unlockAchievement(userId: string, achievement: Achievement) {
  const { error } = await supabase
    .from('user_achievements')
    .insert({
      user_id: userId,
      achievement_id: achievement.id,
      progress: 100
    });

  if (!error) {
    const tierEmoji = {
      bronze: '🥉',
      silver: '🥈',
      gold: '🥇',
      platinum: '💎'
    }[achievement.tier] || '🏆';

    toast.success(
      `${tierEmoji} Logro desbloqueado: ${achievement.name}`,
      { duration: 5000 }
    );
  }
}

export async function getUserAchievements(userId: string) {
  const { data, error } = await supabase
    .from('user_achievements')
    .select(`
      *,
      achievement:achievements(*)
    `)
    .eq('user_id', userId)
    .order('unlocked_at', { ascending: false });

  if (error) {
    console.error('Error fetching user achievements:', error);
    return [];
  }

  return data || [];
}

export async function getAllAchievements() {
  const { data, error } = await supabase
    .from('achievements')
    .select('*')
    .order('tier', { ascending: true })
    .order('requirement', { ascending: true });

  if (error) {
    console.error('Error fetching achievements:', error);
    return [];
  }

  return data || [];
}

export async function getAchievementProgress(userId: string) {
  const allAchievements = await getAllAchievements();
  const userAchievements = await getUserAchievements(userId);

  const unlockedIds = new Set(userAchievements.map(ua => ua.achievement_id));

  return {
    total: allAchievements.length,
    unlocked: userAchievements.length,
    locked: allAchievements.length - userAchievements.length,
    percentage: Math.round((userAchievements.length / allAchievements.length) * 100)
  };
}
