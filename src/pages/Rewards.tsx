import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Settings } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';
import { Reward, Couple } from '../types';
import Header from '../components/Header';
import PointsBadge from '../components/PointsBadge';
import RewardCard from '../components/RewardCard';
import ConfirmDialog from '../components/ConfirmDialog';
import RewardFormModal from '../components/RewardFormModal';
import toast from 'react-hot-toast';

export default function Rewards() {
  const { user, userProfile } = useAuth();
  const navigate = useNavigate();
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [couple, setCouple] = useState<Couple | null>(null);
  const [selectedReward, setSelectedReward] = useState<Reward | null>(null);
  const [loading, setLoading] = useState(true);
  const [adminMode, setAdminMode] = useState(false);
  const [showFormModal, setShowFormModal] = useState(false);
  const [editingReward, setEditingReward] = useState<Reward | null>(null);
  const [deletingReward, setDeletingReward] = useState<Reward | null>(null);

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

  const handleCreateReward = () => {
    setEditingReward(null);
    setShowFormModal(true);
  };

  const handleEditReward = (reward: Reward) => {
    setEditingReward(reward);
    setShowFormModal(true);
  };

  const handleDeleteClick = (reward: Reward) => {
    setDeletingReward(reward);
  };

  const handleConfirmDelete = async () => {
    if (!deletingReward) return;

    try {
      const { error } = await supabase
        .from('rewards')
        .delete()
        .eq('id', deletingReward.id);

      if (error) throw error;

      toast.success('Recompensa eliminada');
      setDeletingReward(null);
      loadData();
    } catch (error) {
      console.error('Error deleting reward:', error);
      toast.error('Error al eliminar recompensa');
    }
  };

  const handleSaveReward = async (data: {
    name: string;
    description: string;
    points_cost: number;
    image_url: string;
    icon: string;
  }) => {
    if (!userProfile?.couple_id) return;

    try {
      if (editingReward) {
        const { error } = await supabase
          .from('rewards')
          .update(data)
          .eq('id', editingReward.id);

        if (error) throw error;
        toast.success('Recompensa actualizada');
      } else {
        const { error } = await supabase.from('rewards').insert({
          ...data,
          couple_id: userProfile.couple_id,
        });

        if (error) throw error;
        toast.success('Recompensa creada');
      }

      setShowFormModal(false);
      setEditingReward(null);
      loadData();
    } catch (error) {
      console.error('Error saving reward:', error);
      toast.error('Error al guardar recompensa');
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
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">Recompensas</h1>
            <p className="text-gray-600 dark:text-gray-300">
              {adminMode ? 'Administra el catálogo de recompensas' : 'Canjea tus puntos por momentos especiales'}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setAdminMode(!adminMode)}
              className={`p-2 rounded-lg transition-colors ${
                adminMode
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
              title={adminMode ? 'Salir del modo admin' : 'Modo administración'}
            >
              <Settings className="w-5 h-5" />
            </button>
            <PointsBadge points={couple?.points || 0} />
          </div>
        </div>

        {rewards.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-12 text-center">
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Aún no hay recompensas en tu catálogo.
            </p>
            {adminMode && (
              <button
                onClick={handleCreateReward}
                className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium inline-flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Crear Primera Recompensa
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {rewards.map((reward) => (
              <RewardCard
                key={reward.id}
                reward={reward}
                onRedeem={() => handleRedeemClick(reward)}
                disabled={!couple || couple.points < reward.points_cost}
                adminMode={adminMode}
                onEdit={() => handleEditReward(reward)}
                onDelete={() => handleDeleteClick(reward)}
              />
            ))}
          </div>
        )}

        {adminMode && rewards.length > 0 && (
          <button
            onClick={handleCreateReward}
            className="fixed bottom-24 md:bottom-8 right-4 p-4 bg-orange-500 text-white rounded-full shadow-lg hover:bg-orange-600 transition-all duration-200 hover:scale-110"
            title="Crear nueva recompensa"
          >
            <Plus className="w-6 h-6" />
          </button>
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

      {deletingReward && (
        <ConfirmDialog
          title="Confirmar Eliminación"
          message={`¿Estás seguro de eliminar "${deletingReward.name}"? Esta acción no se puede deshacer.`}
          confirmText="Sí, eliminar"
          cancelText="Cancelar"
          onConfirm={handleConfirmDelete}
          onCancel={() => setDeletingReward(null)}
        />
      )}

      {showFormModal && (
        <RewardFormModal
          reward={editingReward}
          onSave={handleSaveReward}
          onCancel={() => {
            setShowFormModal(false);
            setEditingReward(null);
          }}
        />
      )}
    </div>
  );
}
