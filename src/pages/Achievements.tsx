import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trophy, ArrowLeft, Award, Lock } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { getAllAchievements, getUserAchievements, getAchievementProgress } from '../lib/achievementsService';
import AchievementCard from '../components/AchievementCard';
import Header from '../components/Header';

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

interface UserAchievement {
  achievement_id: string;
  unlocked_at: string;
  achievement: Achievement;
}

type AchievementCategory = 'points' | 'streak' | 'activity' | 'special';

const categoryNames: Record<AchievementCategory, string> = {
  points: 'Puntos',
  streak: 'Rachas',
  activity: 'Actividades',
  special: 'Especiales',
};

export default function Achievements() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [allAchievements, setAllAchievements] = useState<Achievement[]>([]);
  const [userAchievements, setUserAchievements] = useState<UserAchievement[]>([]);
  const [progress, setProgress] = useState({ total: 0, unlocked: 0, locked: 0, percentage: 0 });
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<AchievementCategory | 'all'>('all');

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    loadAchievements();
  }, [user, navigate]);

  const loadAchievements = async () => {
    if (!user) return;

    try {
      const [all, userAch, prog] = await Promise.all([
        getAllAchievements(),
        getUserAchievements(user.id),
        getAchievementProgress(user.id),
      ]);

      setAllAchievements(all);
      setUserAchievements(userAch);
      setProgress(prog);
    } catch (error) {
      console.error('Error loading achievements:', error);
    } finally {
      setLoading(false);
    }
  };

  const unlockedIds = new Set(userAchievements.map((ua) => ua.achievement_id));

  const filteredAchievements =
    selectedCategory === 'all'
      ? allAchievements
      : allAchievements.filter((a) => a.category === selectedCategory);

  const achievementsByCategory = filteredAchievements.reduce((acc, achievement) => {
    const cat = achievement.category as AchievementCategory;
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(achievement);
    return acc;
  }, {} as Record<AchievementCategory, Achievement[]>);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Header />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <button
          onClick={() => navigate('/dashboard')}
          className="mb-6 flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Volver
        </button>

        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl">
              <Trophy className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Logros</h1>
              <p className="text-gray-600 dark:text-gray-400">
                Desbloquea logros completando actividades
              </p>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Award className="w-5 h-5 text-yellow-500" />
                  <span className="text-2xl font-bold text-gray-800 dark:text-white">
                    {progress.unlocked}
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Desbloqueados</p>
              </div>

              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Lock className="w-5 h-5 text-gray-400" />
                  <span className="text-2xl font-bold text-gray-800 dark:text-white">
                    {progress.locked}
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Bloqueados</p>
              </div>

              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Trophy className="w-5 h-5 text-orange-500" />
                  <span className="text-2xl font-bold text-gray-800 dark:text-white">
                    {progress.total}
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total</p>
              </div>

              <div className="text-center">
                <div className="mb-2">
                  <span className="text-2xl font-bold text-gray-800 dark:text-white">
                    {progress.percentage}%
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Progreso</p>
              </div>
            </div>

            <div className="mt-4">
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-orange-500 to-pink-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${progress.percentage}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                selectedCategory === 'all'
                  ? 'bg-orange-500 text-white shadow-md'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              Todos
            </button>
            {(Object.keys(categoryNames) as AchievementCategory[]).map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  selectedCategory === cat
                    ? 'bg-orange-500 text-white shadow-md'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                {categoryNames[cat]}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-8">
          {selectedCategory === 'all' ? (
            Object.entries(achievementsByCategory).map(([category, achievements]) => (
              <div key={category}>
                <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
                  {categoryNames[category as AchievementCategory]}
                </h2>
                <div className="grid gap-4 md:grid-cols-2">
                  {achievements.map((achievement) => {
                    const userAch = userAchievements.find(
                      (ua) => ua.achievement_id === achievement.id
                    );
                    return (
                      <AchievementCard
                        key={achievement.id}
                        achievement={achievement}
                        unlocked={unlockedIds.has(achievement.id)}
                        unlockedAt={userAch?.unlocked_at}
                      />
                    );
                  })}
                </div>
              </div>
            ))
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {filteredAchievements.map((achievement) => {
                const userAch = userAchievements.find(
                  (ua) => ua.achievement_id === achievement.id
                );
                return (
                  <AchievementCard
                    key={achievement.id}
                    achievement={achievement}
                    unlocked={unlockedIds.has(achievement.id)}
                    unlockedAt={userAch?.unlocked_at}
                  />
                );
              })}
            </div>
          )}
        </div>

        {filteredAchievements.length === 0 && (
          <div className="text-center py-12">
            <Trophy className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">
              No hay logros en esta categoría
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
