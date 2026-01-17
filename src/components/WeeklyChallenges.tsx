import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as Icons from 'lucide-react';
import { supabase } from '../lib/supabase';
import { ensureSession } from '../lib/sessionHelper';
import { WeeklyChallenge } from '../types';
import toast from 'react-hot-toast';
import ConfirmDialog from './ConfirmDialog';

interface WeeklyChallengesProps {
  coupleId: string;
  userId: string;
  onChallengeComplete: () => void;
}

export default function WeeklyChallenges({ coupleId, userId, onChallengeComplete }: WeeklyChallengesProps) {
  const navigate = useNavigate();
  const [challenges, setChallenges] = useState<WeeklyChallenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedChallenge, setSelectedChallenge] = useState<WeeklyChallenge | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    loadChallenges();

    const subscription = supabase
      .channel('challenges-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'weekly_challenges',
          filter: `couple_id=eq.${coupleId}`,
        },
        () => {
          loadChallenges();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [coupleId]);

  const loadChallenges = async () => {
    try {
      const weekStart = getStartOfCurrentWeek();

      const { data, error } = await supabase
        .from('weekly_challenges')
        .select('*')
        .eq('couple_id', coupleId)
        .eq('week_start', weekStart)
        .order('points_reward', { ascending: false });

      if (error) throw error;
      setChallenges(data || []);
    } catch (error) {
      console.error('Error loading challenges:', error);
      toast.error('Error al cargar retos');
    } finally {
      setLoading(false);
    }
  };

  const getStartOfCurrentWeek = () => {
    const now = new Date();
    const day = now.getDay();
    const diff = now.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(now.setDate(diff));
    monday.setHours(0, 0, 0, 0);
    return monday.toISOString().split('T')[0];
  };

  const handleCompleteChallenge = async () => {
    if (!selectedChallenge) return;

    try {
      await ensureSession();

      const { data: couple, error: coupleReadError } = await supabase
        .from('couples')
        .select('points')
        .eq('id', coupleId)
        .single();

      if (coupleReadError) throw coupleReadError;

      const { error: updateError } = await supabase
        .from('weekly_challenges')
        .update({
          completed: true,
          completed_at: new Date().toISOString(),
        })
        .eq('id', selectedChallenge.id);

      if (updateError) throw updateError;

      const { error: coupleError } = await supabase
        .from('couples')
        .update({
          points: couple.points + selectedChallenge.points_reward,
        })
        .eq('id', coupleId);

      if (coupleError) throw coupleError;

      const { error: historyError } = await supabase.from('history').insert({
        couple_id: coupleId,
        user_id: userId,
        points: selectedChallenge.points_reward,
        type: 'gain',
        description: `Reto completado: ${selectedChallenge.name}`,
      });

      if (historyError) throw historyError;

      toast.success(`¡Reto completado! +${selectedChallenge.points_reward} puntos`);
      onChallengeComplete();
      setShowConfirm(false);
      setSelectedChallenge(null);
    } catch (error: any) {
      console.error('Error completing challenge:', error);
      if (error.message?.includes('No active session')) {
        toast.error('Sesión expirada. Por favor, inicia sesión nuevamente');
        navigate('/login');
      } else {
        toast.error('Error al completar el reto');
      }
    }
  };

  const getIconComponent = (iconName?: string) => {
    if (!iconName) return Icons.Star;

    const iconNameMap: Record<string, string> = {
      'Popcorn': 'Sandwich',
      'TreePalm': 'Palmtree',
      'Dices': 'Dice',
      'PartyPopper': 'Party',
      'Sparkle': 'Sparkles',
    };

    const mappedIconName = iconNameMap[iconName] || iconName;
    const Icon = (Icons as any)[mappedIconName];
    return Icon || Icons.Star;
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (challenges.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
        <p className="mb-2">No hay retos para esta semana</p>
        <p className="text-sm">Los retos se generan automáticamente cada lunes</p>
      </div>
    );
  }

  const completedCount = challenges.filter((c) => c.completed).length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-800 dark:text-white">Retos Semanales</h3>
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {completedCount}/{challenges.length} completados
        </span>
      </div>

      <div className="space-y-3">
        {challenges.map((challenge) => {
          const Icon = getIconComponent(challenge.icon);
          const isCompleted = challenge.completed;

          return (
            <div
              key={challenge.id}
              className={`p-4 rounded-lg border-2 transition-all ${
                isCompleted
                  ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                  : 'bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 hover:border-orange-300 dark:hover:border-orange-600'
              }`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`p-2 rounded-lg ${
                    isCompleted
                      ? 'bg-green-100 dark:bg-green-800'
                      : 'bg-orange-100 dark:bg-orange-900'
                  }`}
                >
                  <Icon
                    className={`w-5 h-5 ${
                      isCompleted
                        ? 'text-green-600 dark:text-green-400'
                        : 'text-orange-600 dark:text-orange-400'
                    }`}
                  />
                </div>

                <div className="flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <h4
                      className={`font-medium ${
                        isCompleted
                          ? 'text-gray-600 dark:text-gray-400 line-through'
                          : 'text-gray-800 dark:text-white'
                      }`}
                    >
                      {challenge.name}
                    </h4>
                    <span
                      className={`text-sm font-bold whitespace-nowrap ${
                        isCompleted
                          ? 'text-green-600 dark:text-green-400'
                          : 'text-orange-600 dark:text-orange-400'
                      }`}
                    >
                      +{challenge.points_reward}
                    </span>
                  </div>

                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {challenge.description}
                  </p>

                  {!isCompleted && (
                    <button
                      onClick={() => {
                        setSelectedChallenge(challenge);
                        setShowConfirm(true);
                      }}
                      className="mt-3 px-4 py-2 bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white text-sm font-medium rounded-lg transition-all duration-200 transform hover:scale-[1.02]"
                    >
                      Marcar como completado
                    </button>
                  )}

                  {isCompleted && challenge.completed_at && (
                    <p className="text-xs text-green-600 dark:text-green-400 mt-2">
                      Completado el{' '}
                      {new Date(challenge.completed_at).toLocaleDateString('es-ES', {
                        day: 'numeric',
                        month: 'short',
                      })}
                    </p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {showConfirm && selectedChallenge && (
        <ConfirmDialog
          title="Completar Reto"
          message={`¿Confirmas que has completado "${selectedChallenge.name}"? Ganarás ${selectedChallenge.points_reward} puntos.`}
          confirmText="Sí, completar"
          cancelText="Cancelar"
          onConfirm={handleCompleteChallenge}
          onCancel={() => {
            setShowConfirm(false);
            setSelectedChallenge(null);
          }}
        />
      )}
    </div>
  );
}
