import { useState } from 'react';
import { X, Plus } from 'lucide-react';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';
import { checkAndUnlockAchievements } from '../lib/achievementsService';

interface AddPointsModalProps {
  coupleId: string;
  userId: string;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AddPointsModal({ coupleId, userId, onClose, onSuccess }: AddPointsModalProps) {
  const [points, setPoints] = useState(5);
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!description.trim()) {
      toast.error('Añade una descripción');
      return;
    }

    setLoading(true);

    try {
      const { data: couple } = await supabase
        .from('couples')
        .select('points')
        .eq('id', coupleId)
        .single();

      if (!couple) throw new Error('Couple not found');

      const { error: historyError } = await supabase
        .from('history')
        .insert({
          couple_id: coupleId,
          user_id: userId,
          points: points,
          type: 'gain',
          description: description.trim(),
        });

      if (historyError) throw historyError;

      const { error: updateError } = await supabase
        .from('couples')
        .update({ points: couple.points + points })
        .eq('id', coupleId);

      if (updateError) throw updateError;

      toast.success(`+${points} puntos añadidos`);

      checkAndUnlockAchievements(userId);

      onSuccess();
      onClose();
    } catch (error: any) {
      console.error('Error adding points:', error);
      toast.error('Error al añadir puntos');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white">Añadir Puntos</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Descripción
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ej: Preparé el desayuno"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              maxLength={100}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Puntos
            </label>
            <input
              type="number"
              value={points}
              onChange={(e) => setPoints(Math.max(1, parseInt(e.target.value) || 1))}
              min="1"
              max="100"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white rounded-lg transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <Plus className="w-5 h-5" />
              {loading ? 'Añadiendo...' : 'Añadir'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
