import { Gift, Pencil, Trash2 } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { Reward } from '../types';

interface RewardCardProps {
  reward: Reward;
  onRedeem: () => void;
  disabled?: boolean;
  adminMode?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
}

export default function RewardCard({ reward, onRedeem, disabled, adminMode, onEdit, onDelete }: RewardCardProps) {
  const getIconComponent = () => {
    if (reward.icon) {
      const IconComponent = (LucideIcons as any)[reward.icon];
      return IconComponent || Gift;
    }
    return Gift;
  };

  const IconComponent = getIconComponent();

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-200">
      <div className="h-40 bg-gradient-to-br from-orange-100 to-pink-100 dark:from-orange-900/30 dark:to-pink-900/30 flex items-center justify-center">
        {reward.image_url ? (
          <img
            src={reward.image_url}
            alt={reward.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <IconComponent className="w-16 h-16 text-orange-400" />
        )}
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-lg text-gray-800 dark:text-white mb-2">{reward.name}</h3>
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">{reward.description}</p>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <span className="text-2xl font-bold text-orange-600 dark:text-orange-400">{reward.points_cost}</span>
            <span className="text-sm text-gray-500 dark:text-gray-400">pts</span>
          </div>

          {adminMode ? (
            <div className="flex gap-2">
              <button
                onClick={onEdit}
                className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                title="Editar"
              >
                <Pencil className="w-4 h-4" />
              </button>
              <button
                onClick={onDelete}
                className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
                title="Eliminar"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={onRedeem}
              disabled={disabled}
              className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              Canjear
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
