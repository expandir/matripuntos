import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link2, UserPlus, LogOut } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { seedRewardsForCouple } from '../lib/seedRewards';
import { seedWeeklyChallengesForCouple } from '../lib/seedChallenges';
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast';

function generateCoupleCode(): string {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

export default function LinkCouple() {
  const { user, userProfile, loading: authLoading, signOut } = useAuth();
  const navigate = useNavigate();
  const [generatedCode, setGeneratedCode] = useState('');
  const [inputCode, setInputCode] = useState('');
  const [loading, setLoading] = useState(false);

  console.log('🔵 LinkCouple render:', { user: user?.id, userProfile, authLoading, loading });

  useEffect(() => {
    console.log('🔵 LinkCouple useEffect:', { user: user?.id, userProfile: userProfile?.couple_id, authLoading });

    if (authLoading) {
      console.log('🔵 Auth still loading, waiting...');
      return;
    }

    if (!user) {
      console.log('🔵 No user, redirecting to login');
      navigate('/login');
      return;
    }

    if (userProfile?.couple_id) {
      console.log('🔵 User already has couple_id, redirecting to dashboard');
      navigate('/dashboard');
    }
  }, [user, userProfile, authLoading, navigate]);

  const handleCreateCouple = async () => {
    console.log('🔵 handleCreateCouple called');
    console.log('🔵 User:', user?.id);

    if (!user) {
      console.log('🔴 No user found');
      toast.error('No hay usuario autenticado');
      return;
    }

    setLoading(true);
    console.log('🔵 Loading set to true');

    try {
      const code = generateCoupleCode();
      console.log('🔵 Generated code:', code);

      console.log('🔵 Attempting to create couple...');
      const { data: coupleData, error: coupleError } = await supabase
        .from('couples')
        .insert({
          id: code,
          points: 0,
        })
        .select()
        .single();

      console.log('🔵 Couple creation response:', { coupleData, coupleError });

      if (coupleError) {
        console.error('🔴 Error creating couple:', coupleError);
        throw new Error(`No se pudo crear la pareja: ${coupleError.message}`);
      }

      console.log('🔵 Couple created successfully, updating user...');
      const { data: updatedUser, error: updateError } = await supabase
        .from('users')
        .update({ couple_id: code })
        .eq('id', user.id)
        .select()
        .single();

      console.log('🔵 User update response:', { updatedUser, updateError });

      if (updateError) {
        console.error('🔴 Error updating user:', updateError);
        throw new Error(`No se pudo vincular tu cuenta: ${updateError.message}`);
      }

      if (!updatedUser || updatedUser.couple_id !== code) {
        console.error('🔴 User update verification failed:', updatedUser);
        throw new Error('La vinculación no se completó correctamente');
      }

      console.log('🔵 User updated successfully, waiting...');
      await new Promise(resolve => setTimeout(resolve, 100));

      console.log('🔵 Seeding rewards...');
      const rewardsResult = await seedRewardsForCouple(code);
      console.log('🔵 Rewards result:', rewardsResult);
      if (!rewardsResult.success) {
        console.error('🟡 Warning: Error seeding rewards:', rewardsResult.error);
      }

      console.log('🔵 Seeding challenges...');
      const challengesResult = await seedWeeklyChallengesForCouple(code);
      console.log('🔵 Challenges result:', challengesResult);
      if (!challengesResult.success) {
        console.error('🟡 Warning: Error seeding challenges:', challengesResult.error);
      }

      console.log('🟢 Success! Setting generated code:', code);
      setGeneratedCode(code);
      toast.success('Código creado. Compártelo con tu pareja');
    } catch (error: any) {
      console.error('🔴 Error creating couple:', error);
      toast.error(error.message || 'Error al crear el código');
    } finally {
      console.log('🔵 Setting loading to false');
      setLoading(false);
    }
  };

  const handleJoinCouple = async () => {
    if (!user || !inputCode.trim()) {
      toast.error('Introduce un código válido');
      return;
    }

    const codeToCheck = inputCode.trim().toUpperCase();
    setLoading(true);

    try {
      const { data: couple, error: coupleError } = await supabase
        .from('couples')
        .select('*')
        .eq('id', codeToCheck)
        .maybeSingle();

      if (coupleError) throw coupleError;

      if (!couple) {
        toast.error('Código no encontrado. Verifica que esté correcto.');
        setLoading(false);
        return;
      }

      const { error: updateError } = await supabase
        .from('users')
        .update({ couple_id: codeToCheck })
        .eq('id', user.id);

      if (updateError) throw updateError;

      toast.success('¡Emparejados con éxito!');

      setTimeout(() => {
        navigate('/dashboard');
      }, 500);
    } catch (error: any) {
      console.error('Error joining couple:', error);
      toast.error('Error al unirse a la pareja');
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      toast.error('Error al cerrar sesión');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4">
      <div className="max-w-4xl mx-auto pt-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Vincular Pareja</h1>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span>Salir</span>
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-orange-100 p-3 rounded-lg">
                <Link2 className="w-6 h-6 text-orange-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Crear Código</h2>
            </div>

            <p className="text-gray-600 mb-6">
              Genera un código único y compártelo con tu pareja para vincular las cuentas
            </p>

            <button
              onClick={(e) => {
                e.preventDefault();
                console.log('🔵 Button clicked!');
                handleCreateCouple();
              }}
              disabled={loading || !!generatedCode || authLoading}
              className="w-full bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white font-semibold py-3 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Generando...' : authLoading ? 'Cargando...' : 'Crear Código'}
            </button>

            {generatedCode && (
              <div className="mt-6 p-4 bg-green-50 border-2 border-green-200 rounded-lg">
                <p className="text-sm text-gray-600 mb-2">Tu código:</p>
                <p className="text-3xl font-bold text-center text-green-700 tracking-wider">
                  {generatedCode}
                </p>
                <p className="text-sm text-gray-600 mt-3 text-center">
                  Comparte este código con tu pareja
                </p>
              </div>
            )}
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-blue-100 p-3 rounded-lg">
                <UserPlus className="w-6 h-6 text-blue-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Unirse con Código</h2>
            </div>

            <p className="text-gray-600 mb-6">
              Introduce el código que tu pareja ha compartido contigo
            </p>

            <input
              type="text"
              value={inputCode}
              onChange={(e) => setInputCode(e.target.value.toUpperCase())}
              placeholder="Ej: ABC123"
              maxLength={6}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none mb-4 text-center text-xl font-semibold tracking-wider uppercase"
            />

            <button
              onClick={handleJoinCouple}
              disabled={loading || !inputCode.trim()}
              className="w-full bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white font-semibold py-3 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Uniéndose...' : 'Unirse a Pareja'}
            </button>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-gray-500 text-sm">
            Una vez vinculados, ambos podrán ganar y canjear puntos juntos
          </p>
        </div>
      </div>
    </div>
  );
}
