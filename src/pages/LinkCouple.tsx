import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link2, UserPlus, LogOut } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast';

function generateCoupleCode(): string {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

export default function LinkCouple() {
  const { user, userProfile, signOut } = useAuth();
  const navigate = useNavigate();
  const [generatedCode, setGeneratedCode] = useState('');
  const [inputCode, setInputCode] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (userProfile?.couple_id) {
      checkOnboardingStatus(userProfile.couple_id);
    }
  }, [user, userProfile, navigate]);

  const checkOnboardingStatus = async (coupleId: string) => {
    try {
      const { data: couple } = await supabase
        .from('couples')
        .select('onboarding_completed')
        .eq('id', coupleId)
        .maybeSingle();

      if (couple?.onboarding_completed) {
        navigate('/dashboard');
      } else {
        navigate('/onboarding');
      }
    } catch (error) {
      console.error('Error checking onboarding status:', error);
      navigate('/dashboard');
    }
  };

  const handleCreateCouple = async () => {
    if (!user) return;
    setLoading(true);

    try {
      const code = generateCoupleCode();

      const { error: coupleError } = await supabase
        .from('couples')
        .insert({
          id: code,
          points: 0,
        });

      if (coupleError) throw coupleError;

      const { error: updateError } = await supabase
        .from('users')
        .update({ couple_id: code })
        .eq('id', user.id);

      if (updateError) throw updateError;

      setGeneratedCode(code);
      toast.success('Codigo creado. Comenzando configuracion...');

      setTimeout(() => {
        navigate('/onboarding');
      }, 1000);
    } catch (error: any) {
      console.error('Error creating couple:', error);
      toast.error('Error al crear el código');
    } finally {
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
        if (couple.onboarding_completed) {
          navigate('/dashboard');
        } else {
          navigate('/onboarding');
        }
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
              onClick={handleCreateCouple}
              disabled={loading || !!generatedCode}
              className="w-full bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white font-semibold py-3 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Generando...' : 'Crear Código'}
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
