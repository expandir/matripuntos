import * as Icons from 'lucide-react';

interface AchievementCardProps {
  achievement: {
    id: string;
    name: string;
    description: string;
    icon: string;
    tier: string;
    category: string;
  };
  unlocked: boolean;
  unlockedAt?: string;
}

const tierColors = {
  bronze: 'from-amber-700 to-amber-900',
  silver: 'from-gray-400 to-gray-600',
  gold: 'from-yellow-400 to-yellow-600',
  platinum: 'from-cyan-400 to-blue-600',
};

const tierBadgeColors = {
  bronze: 'bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300',
  silver: 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300',
  gold: 'bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300',
  platinum: 'bg-cyan-100 dark:bg-cyan-900 text-cyan-700 dark:text-cyan-300',
};

const tierLabels = {
  bronze: 'Bronce',
  silver: 'Plata',
  gold: 'Oro',
  platinum: 'Platino',
};

export default function AchievementCard({ achievement, unlocked, unlockedAt }: AchievementCardProps) {
  const iconNameMap: Record<string, string> = {
    'Popcorn': 'Sandwich',
    'TreePalm': 'Palmtree',
    'Dices': 'Dice',
    'PartyPopper': 'Party',
    'Sparkle': 'Sparkles',
  };

  const getIconComponent = (iconName: string) => {
    const mappedIconName = iconNameMap[iconName] || iconName;
    const Icon = (Icons as any)[mappedIconName];
    return Icon || Icons.Award;
  };

  const Icon = getIconComponent(achievement.icon);
  const tierGradient = tierColors[achievement.tier as keyof typeof tierColors] || tierColors.bronze;
  const tierBadge = tierBadgeColors[achievement.tier as keyof typeof tierBadgeColors] || tierBadgeColors.bronze;
  const tierLabel = tierLabels[achievement.tier as keyof typeof tierLabels] || 'Bronce';

  return (
    <div
      className={`relative rounded-xl p-4 border-2 transition-all duration-300 ${
        unlocked
          ? 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-md'
          : 'bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-800 opacity-60'
      }`}
    >
      {unlocked && (
        <div className="absolute -top-2 -right-2 bg-green-500 text-white rounded-full p-1">
          <Icons.Check className="w-4 h-4" />
        </div>
      )}

      <div className="flex items-start gap-3">
        <div
          className={`flex-shrink-0 w-14 h-14 rounded-xl bg-gradient-to-br ${tierGradient} flex items-center justify-center ${
            !unlocked && 'grayscale'
          }`}
        >
          <Icon className="w-7 h-7 text-white" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3
              className={`font-semibold ${
                unlocked
                  ? 'text-gray-800 dark:text-white'
                  : 'text-gray-500 dark:text-gray-600'
              }`}
            >
              {achievement.name}
            </h3>
          </div>

          <p
            className={`text-sm mb-2 ${
              unlocked
                ? 'text-gray-600 dark:text-gray-400'
                : 'text-gray-400 dark:text-gray-600'
            }`}
          >
            {achievement.description}
          </p>

          <div className="flex items-center gap-2">
            <span className={`text-xs font-medium px-2 py-1 rounded-full ${tierBadge}`}>
              {tierLabel}
            </span>
            {unlocked && unlockedAt && (
              <span className="text-xs text-gray-500 dark:text-gray-500">
                {new Date(unlockedAt).toLocaleDateString('es-ES', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                })}
              </span>
            )}
            {!unlocked && (
              <span className="text-xs text-gray-400 dark:text-gray-600 flex items-center gap-1">
                <Icons.Lock className="w-3 h-3" />
                Bloqueado
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
