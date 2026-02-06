import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, TrendingUp, Award, Trophy, BarChart3, HeartHandshake, X } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { withSessionRefresh } from '../lib/supabaseWrapper';
import { useAuth } from '../hooks/useAuth';
import { Couple, HistoryEntry } from '../types';
import Header from '../components/Header';
import PointsBadge from '../components/PointsBadge';
import AddPointsModal from '../components/AddPointsModal';
import PointsCatalog from '../components/PointsCatalog';
import PendingValidation from '../components/PendingValidation';
import toast from 'react-hot-toast';

export default function Dashboard() {
  const { user, userProfile } = useAuth();
  const navigate = useNavigate();
  const [couple, setCouple] = useState<Couple | null>(null);
  const [recentHistory, setRecentHistory] = useState<HistoryEntry[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showBanner, setShowBanner] = useState(() => {
    return localStorage.getItem('matripuntos_banner_dismissed') !== 'true';
  });

  const dismissBanner = () => {
    setShowBanner(false);
    localStorage.setItem('matripuntos_banner_dismissed', 'true');
  };

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (!userProfile?.couple_id) {
      navigate('/link');
      return;
    }

    checkOnboardingAndLoadData();
  }, [user, userProfile, navigate]);

  const checkOnboardingAndLoadData = async () => {
    if (!userProfile?.couple_id) return;

    try {
      const { data: couple } = await supabase
        .from('couples')
        .select('onboarding_completed')
        .eq('id', userProfile.couple_id)
        .maybeSingle();

      if (couple && !couple.onboarding_completed) {
        navigate('/onboarding');
        return;
      }

      loadCoupleData();
      loadRecentHistory();
    } catch (error) {
      console.error('Error checking onboarding:', error);
      loadCoupleData();
      loadRecentHistory();
    }
  };

  useEffect(() => {
    if (!userProfile?.couple_id) return;

    const coupleSubscription = supabase
      .channel('couple-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'couples',
          filter: `id=eq.${userProfile.couple_id}`,
        },
        () => {
          loadCoupleData();
        }
      )
      .subscribe();

    const historySubscription = supabase
      .channel('history-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'history',
          filter: `couple_id=eq.${userProfile.couple_id}`,
        },
        () => {
          loadRecentHistory();
        }
      )
      .subscribe();

    return () => {
      coupleSubscription.unsubscribe();
      historySubscription.unsubscribe();
    };
  }, [user, userProfile, navigate]);

  const loadCoupleData = async () => {
    if (!userProfile?.couple_id) return;

    try {
      const data = await withSessionRefresh(async () => {
        const { data, error } = await supabase
          .from('couples')
          .select('*')
          .eq('id', userProfile.couple_id)
          .single();

        if (error) throw error;
        return data;
      });

      setCouple(data);
    } catch (error: any) {
      console.error('Error loading couple data:', error);
      if (error.message?.includes('Session expired')) {
        toast.error('Sesión expirada. Por favor, inicia sesión nuevamente');
        navigate('/login');
      } else {
        toast.error('Error al cargar datos');
      }
    } finally {
      setLoading(false);
    }
  };

  const loadRecentHistory = async () => {
    if (!userProfile?.couple_id) return;

    try {
      const data = await withSessionRefresh(async () => {
        const { data, error } = await supabase
          .from('history')
          .select('*')
          .eq('couple_id', userProfile.couple_id)
          .order('created_at', { ascending: false })
          .limit(5);

        if (error) throw error;
        return data || [];
      });

      setRecentHistory(data);
    } catch (error: any) {
      console.error('Error loading history:', error);
      if (error.message?.includes('Session expired')) {
        toast.error('Sesión expirada. Por favor, inicia sesión nuevamente');
        navigate('/login');
      }
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

      <main className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {showBanner && (
          <div className="relative bg-gradient-to-r from-amber-50 to-orange-50 dark:from-gray-800 dark:to-gray-800 border border-amber-200 dark:border-amber-800/40 rounded-xl p-4 pr-12 flex items-start gap-3">
            <HeartHandshake className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-amber-800 dark:text-amber-300 leading-relaxed">
              La relacion de pareja no es una competicion. Esta herramienta es solo un apoyo ludico para mejorar la cooperacion, no un marcador para juzgar a nadie.
            </p>
            <button
              onClick={dismissBanner}
              className="absolute top-3 right-3 p-1 rounded-lg text-amber-400 hover:text-amber-600 dark:text-amber-600 dark:hover:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-900/30 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
              ¡Hola, {userProfile?.name}!
            </h1>
            <p className="text-gray-600 dark:text-gray-300">Reconociendo tu trabajo en casa</p>
          </div>
          <PointsBadge points={couple?.points || 0} />
        </div>

        <div className="grid gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Acciones Rápidas</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <button
                onClick={() => setShowAddModal(true)}
                className="flex items-center justify-center gap-3 p-4 bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white rounded-xl transition-all duration-200 transform hover:scale-[1.02] shadow-lg"
              >
                <Plus className="w-6 h-6" />
                <span className="font-semibold">Añadir Puntos</span>
              </button>

              <button
                onClick={() => navigate('/rewards')}
                className="flex items-center justify-center gap-3 p-4 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-xl transition-all duration-200 transform hover:scale-[1.02] shadow-lg"
              >
                <Award className="w-6 h-6" />
                <span className="font-semibold">Ver Recompensas</span>
              </button>

              <button
                onClick={() => navigate('/achievements')}
                className="flex items-center justify-center gap-3 p-4 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white rounded-xl transition-all duration-200 transform hover:scale-[1.02] shadow-lg"
              >
                <Trophy className="w-6 h-6" />
                <span className="font-semibold">Ver Logros</span>
              </button>

              <button
                onClick={() => navigate('/statistics')}
                className="flex items-center justify-center gap-3 p-4 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-xl transition-all duration-200 transform hover:scale-[1.02] shadow-lg"
              >
                <BarChart3 className="w-6 h-6" />
                <span className="font-semibold">Estadísticas</span>
              </button>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                <h3 className="font-semibold text-gray-800 dark:text-white">Actividad Reciente</h3>
              </div>

              {recentHistory.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                  Aún no hay actividad. ¡Comienza añadiendo puntos!
                </p>
              ) : (
                <div className="space-y-2">
                  {recentHistory.map((entry) => (
                    <div
                      key={entry.id}
                      className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                    >
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-800 dark:text-white">
                          {entry.description}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {new Date(entry.created_at).toLocaleDateString('es-ES', {
                            day: 'numeric',
                            month: 'short',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>
                      <span
                        className={`font-bold ${
                          entry.type === 'gain' ? 'text-green-600' : 'text-red-600'
                        }`}
                      >
                        {entry.type === 'gain' ? '+' : '-'}
                        {Math.abs(entry.points)}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {recentHistory.length > 0 && (
                <button
                  onClick={() => navigate('/history')}
                  className="w-full mt-4 py-2 text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 font-medium"
                >
                  Ver todo el historial →
                </button>
              )}
            </div>
          </div>
        </div>

        {couple?.requires_validation && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <PendingValidation
              coupleId={userProfile!.couple_id!}
              currentUserId={user!.id}
              onPointsValidated={() => {
                loadCoupleData();
                loadRecentHistory();
              }}
            />
          </div>
        )}

        {couple && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <PointsCatalog
              coupleId={userProfile!.couple_id!}
              userId={user!.id}
              couple={couple}
              onActivityComplete={() => {
                loadCoupleData();
                loadRecentHistory();
              }}
            />
          </div>
        )}
      </main>

      {showAddModal && userProfile && couple && (
        <AddPointsModal
          coupleId={userProfile.couple_id!}
          userId={user!.id}
          couple={couple}
          onClose={() => setShowAddModal(false)}
          onSuccess={() => {
            loadCoupleData();
            loadRecentHistory();
          }}
        />
      )}
    </div>
  );
}
