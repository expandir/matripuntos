import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Mail, Calendar, Users, Award, KeyRound, X } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { withSessionRefresh } from '../lib/supabaseWrapper';
import { useAuth } from '../hooks/useAuth';
import { User } from '../types';
import Header from '../components/Header';
import NotificationSettings from '../components/NotificationSettings';
import toast from 'react-hot-toast';

export default function Profile() {
  const { user, userProfile, signOut } = useAuth();
  const navigate = useNavigate();
  const [partner, setPartner] = useState<User | null>(null);
  const [stats, setStats] = useState({
    totalGained: 0,
    totalSpent: 0,
    rewardsRedeemed: 0,
  });
  const [loading, setLoading] = useState(true);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [updatingPassword, setUpdatingPassword] = useState(false);

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
    if (!userProfile?.couple_id || !user) return;

    try {
      const [partnerData, historyData] = await withSessionRefresh(async () => {
        const [partnerResult, historyResult] = await Promise.all([
          supabase
            .from('users')
            .select('*')
            .eq('couple_id', userProfile.couple_id)
            .neq('id', user.id)
            .maybeSingle(),
          supabase
            .from('history')
            .select('*')
            .eq('couple_id', userProfile.couple_id)
            .eq('user_id', user.id),
        ]);

        if (partnerResult.error) throw partnerResult.error;
        if (historyResult.error) throw historyResult.error;

        return [partnerResult.data, historyResult.data];
      });

      setPartner(partnerData);

      const gained = historyData
        ?.filter((e) => e.type === 'gain')
        .reduce((sum, e) => sum + e.points, 0) || 0;

      const spent = historyData
        ?.filter((e) => e.type === 'spend')
        .reduce((sum, e) => sum + Math.abs(e.points), 0) || 0;

      const redeemed = historyData?.filter((e) => e.type === 'spend').length || 0;

      setStats({
        totalGained: gained,
        totalSpent: spent,
        rewardsRedeemed: redeemed,
      });
    } catch (error: any) {
      console.error('Error loading profile data:', error);
      if (error.message?.includes('Session expired')) {
        toast.error('Sesión expirada. Por favor, inicia sesión nuevamente');
        navigate('/login');
      } else {
        toast.error('Error al cargar perfil');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success('Sesión cerrada');
      navigate('/login');
    } catch (error) {
      toast.error('Error al cerrar sesión');
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword.length < 6) {
      toast.error('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('Las contraseñas no coinciden');
      return;
    }

    setUpdatingPassword(true);

    try {
      await withSessionRefresh(async () => {
        const { error } = await supabase.auth.updateUser({
          password: newPassword,
        });

        if (error) throw error;
      });

      toast.success('Contraseña actualizada correctamente');
      setShowPasswordModal(false);
      setNewPassword('');
      setConfirmPassword('');
    } catch (error: any) {
      console.error('Error updating password:', error);
      if (error.message?.includes('Session expired')) {
        toast.error('Sesión expirada. Por favor, inicia sesión nuevamente');
        await signOut();
        navigate('/login');
      } else {
        toast.error(error.message || 'Error al cambiar la contraseña');
      }
    } finally {
      setUpdatingPassword(false);
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

      <main className="max-w-4xl mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Mi Perfil</h1>

        <div className="grid md:grid-cols-3 gap-6 mb-6">
          <div className="md:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <div className="flex items-start gap-6 mb-6">
              {userProfile?.photo_url ? (
                <img
                  src={userProfile.photo_url}
                  alt={userProfile.name}
                  className="w-24 h-24 rounded-full"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-orange-400 to-pink-400 flex items-center justify-center text-white text-3xl font-bold">
                  {userProfile?.name?.[0] || '?'}
                </div>
              )}

              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">{userProfile?.name}</h2>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                    <Mail className="w-4 h-4" />
                    <span className="text-sm">{userProfile?.email}</span>
                  </div>

                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm">
                      Miembro desde{' '}
                      {new Date(userProfile?.created_at || '').toLocaleDateString('es-ES', {
                        month: 'long',
                        year: 'numeric',
                      })}
                    </span>
                  </div>

                  {partner && (
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                      <Users className="w-4 h-4" />
                      <span className="text-sm">Vinculado con {partner.name}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Award className="w-5 h-5" />
                Mis Estadísticas
              </h3>

              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <p className="text-3xl font-bold text-green-600">{stats.totalGained}</p>
                  <p className="text-sm text-gray-600 mt-1">Puntos Ganados</p>
                </div>

                <div className="text-center p-4 bg-red-50 rounded-lg">
                  <p className="text-3xl font-bold text-red-600">{stats.totalSpent}</p>
                  <p className="text-sm text-gray-600 mt-1">Puntos Gastados</p>
                </div>

                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <p className="text-3xl font-bold text-blue-600">{stats.rewardsRedeemed}</p>
                  <p className="text-sm text-gray-600 mt-1">Recompensas</p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {partner && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                <h3 className="font-semibold text-gray-800 mb-4">Mi Pareja</h3>

                <div className="flex items-center gap-3">
                  {partner.photo_url ? (
                    <img
                      src={partner.photo_url}
                      alt={partner.name}
                      className="w-12 h-12 rounded-full"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-green-400 flex items-center justify-center text-white font-semibold">
                      {partner.name[0]}
                    </div>
                  )}

                  <div>
                    <p className="font-medium text-gray-800 dark:text-white">{partner.name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{partner.email}</p>
                  </div>
                </div>
              </div>
            )}

            {user && <NotificationSettings userId={user.id} />}

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <h3 className="font-semibold text-gray-800 mb-4">Código de Pareja</h3>
              <p className="text-2xl font-mono font-bold text-center py-3 bg-gray-100 dark:bg-gray-700 rounded-lg text-gray-800 dark:text-white">
                {userProfile?.couple_id}
              </p>
              <p className="text-xs text-gray-500 mt-2 text-center">
                Comparte este código para vincular cuentas
              </p>
            </div>

            <button
              onClick={() => setShowPasswordModal(true)}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
            >
              <KeyRound className="w-5 h-5" />
              <span className="font-medium">Cambiar Contraseña</span>
            </button>

            <button
              onClick={handleSignOut}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Cerrar Sesión</span>
            </button>
          </div>
        </div>
      </main>

      {showPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                Cambiar Contraseña
              </h3>
              <button
                onClick={() => {
                  setShowPasswordModal(false);
                  setNewPassword('');
                  setConfirmPassword('');
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Nueva Contraseña
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  required
                  minLength={6}
                  placeholder="Mínimo 6 caracteres"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Confirmar Contraseña
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  required
                  minLength={6}
                  placeholder="Repite la contraseña"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowPasswordModal(false);
                    setNewPassword('');
                    setConfirmPassword('');
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  disabled={updatingPassword}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors disabled:bg-gray-400"
                  disabled={updatingPassword}
                >
                  {updatingPassword ? 'Actualizando...' : 'Actualizar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
