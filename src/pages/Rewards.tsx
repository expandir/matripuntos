import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';
import { Reward, Couple } from '../types';
import Header from '../components/Header';
import PointsBadge from '../components/PointsBadge';
import RewardCard from '../components/RewardCard';
import ConfirmDialog from '../components/ConfirmDialog';
import toast from 'react-hot-toast';

export default function Rewards() {
  const { user, userProfile } = useAuth();
  const navigate = useNavigate();
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [couple, setCouple] = useState<Couple | null>(null);
  const [selectedReward, setSelectedReward] = useState<Reward | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (!userProfile?.couple_id) {
      navigate('/link');
      return;
    }

    loadData();
  }, [user, userProfile, navigate]);

  const loadData = async () => {
    if (!userProfile?.couple_id) return;

    try {
      const [coupleResult, rewardsResult] = await Promise.all([
        supabase
          .from('couples')
          .select('*')
          .eq('id', userProfile.couple_id)
          .single(),
        supabase
          .from('rewards')
          .select('*')
          .eq('couple_id', userProfile.couple_id)
          .order('points_cost', { ascending: true }),
      ]);

      if (coupleResult.error) throw coupleResult.error;
      if (rewardsResult.error) throw rewardsResult.error;

      setCouple(coupleResult.data);
      setRewards(rewardsResult.data || []);
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Error al cargar recompensas');
    } finally {
      setLoading(false);
    }
  };

  const handleRedeemClick = (reward: Reward) => {
    if (!couple) return;

    if (couple.points < reward.points_cost) {
      toast.error('No tienes suficientes puntos');
      return;
    }

    setSelectedReward(reward);
  };

  const handleConfirmRedeem = async () => {
    if (!selectedReward || !userProfile?.couple_id || !user || !couple) return;

    try {
      const { error: historyError } = await supabase.from('history').insert({
        couple_id: userProfile.couple_id,
        user_id: user.id,
        points: -selectedReward.points_cost,
        type: 'spend',
        description: `Canjeado: ${selectedReward.name}`,
      });

      if (historyError) throw historyError;

      const { error: updateError } = await supabase
        .from('couples')
        .update({ points: couple.points - selectedReward.points_cost })
        .eq('id', userProfile.couple_id);

      if (updateError) throw updateError;

      toast.success('¡Recompensa canjeada!');
      setSelectedReward(null);
      loadData();
    } catch (error) {
      console.error('Error redeeming reward:', error);
      toast.error('Error al canjear recompensa');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 pb-20 md:pb-4">
      <Header />

      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">Catálogo de Recompensas</h1>
            <p className="text-gray-600 dark:text-gray-300">Canjea tus puntos por momentos especiales</p>
          </div>
          <PointsBadge points={couple?.points || 0} />
        </div>

        {rewards.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-12 text-center">
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Aún no hay recompensas en tu catálogo.
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Las recompensas se añadirán automáticamente cuando se inicialice el sistema.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {rewards.map((reward) => (
              <RewardCard
                key={reward.id}
                reward={reward}
                onRedeem={() => handleRedeemClick(reward)}
                disabled={!couple || couple.points < reward.points_cost}
              />
            ))}
          </div>
        )}
      </main>

      {selectedReward && (
        <ConfirmDialog
          title="Confirmar Canje"
          message={`¿Quieres canjear "${selectedReward.name}" por ${selectedReward.points_cost} puntos?`}
          confirmText="Sí, canjear"
          cancelText="Cancelar"
          onConfirm={handleConfirmRedeem}
          onCancel={() => setSelectedReward(null)}
        />
      )}
    </div>
  );
}
