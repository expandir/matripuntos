import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Filter, TrendingUp, TrendingDown } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';
import { HistoryEntry, User } from '../types';
import Header from '../components/Header';
import toast from 'react-hot-toast';

export default function History() {
  const { user, userProfile } = useAuth();
  const navigate = useNavigate();
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [users, setUsers] = useState<Record<string, User>>({});
  const [filter, setFilter] = useState<'all' | 'gain' | 'spend'>('all');
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

    loadHistory();
    loadUsers();
  }, [user, userProfile, navigate]);

  const loadHistory = async () => {
    if (!userProfile?.couple_id) return;

    try {
      const { data, error } = await supabase
        .from('history')
        .select('*')
        .eq('couple_id', userProfile.couple_id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setHistory(data || []);
    } catch (error) {
      console.error('Error loading history:', error);
      toast.error('Error al cargar historial');
    } finally {
      setLoading(false);
    }
  };

  const loadUsers = async () => {
    if (!userProfile?.couple_id) return;

    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('couple_id', userProfile.couple_id);

      if (error) throw error;

      const usersMap: Record<string, User> = {};
      data?.forEach((u) => {
        usersMap[u.id] = u;
      });
      setUsers(usersMap);
    } catch (error) {
      console.error('Error loading users:', error);
    }
  };

  const filteredHistory = history.filter((entry) => {
    if (filter === 'all') return true;
    return entry.type === filter;
  });

  const totalGained = history
    .filter((e) => e.type === 'gain')
    .reduce((sum, e) => sum + e.points, 0);

  const totalSpent = history
    .filter((e) => e.type === 'spend')
    .reduce((sum, e) => sum + Math.abs(e.points), 0);

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
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">Historial de Actividad</h1>

        <div className="grid md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">Total Ganado</p>
                <p className="text-3xl font-bold text-green-600 dark:text-green-400">{totalGained}</p>
              </div>
              <div className="bg-green-100 dark:bg-green-900/40 p-3 rounded-lg">
                <TrendingUp className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">Total Gastado</p>
                <p className="text-3xl font-bold text-red-600 dark:text-red-400">{totalSpent}</p>
              </div>
              <div className="bg-red-100 dark:bg-red-900/40 p-3 rounded-lg">
                <TrendingDown className="w-8 h-8 text-red-600 dark:text-red-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">Transacciones</p>
                <p className="text-3xl font-bold text-gray-800 dark:text-white">{history.length}</p>
              </div>
              <div className="bg-blue-100 dark:bg-blue-900/40 p-3 rounded-lg">
                <Filter className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Todas las Transacciones</h2>

            <div className="flex gap-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  filter === 'all'
                    ? 'bg-orange-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                Todas
              </button>
              <button
                onClick={() => setFilter('gain')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  filter === 'gain'
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                Ganados
              </button>
              <button
                onClick={() => setFilter('spend')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  filter === 'spend'
                    ? 'bg-red-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                Canjeados
              </button>
            </div>
          </div>

          {filteredHistory.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 text-center py-8">No hay transacciones que mostrar</p>
          ) : (
            <div className="space-y-2">
              {filteredHistory.map((entry) => {
                const entryUser = users[entry.user_id];
                const isCurrentUser = entry.user_id === user?.id;

                return (
                  <div
                    key={entry.id}
                    className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                  >
                    <div className="flex items-center gap-4 flex-1">
                      {entryUser?.photo_url ? (
                        <img
                          src={entryUser.photo_url}
                          alt={entryUser.name}
                          className="w-10 h-10 rounded-full"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-pink-400 flex items-center justify-center text-white font-semibold">
                          {entryUser?.name?.[0] || '?'}
                        </div>
                      )}

                      <div className="flex-1">
                        <p className="font-medium text-gray-800 dark:text-white">{entry.description}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-300">
                          {isCurrentUser ? 'Tú' : entryUser?.name || 'Usuario'} •{' '}
                          {new Date(entry.created_at).toLocaleDateString('es-ES', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>
                    </div>

                    <span
                      className={`text-xl font-bold ${
                        entry.type === 'gain' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                      }`}
                    >
                      {entry.type === 'gain' ? '+' : '-'}
                      {Math.abs(entry.points)}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
