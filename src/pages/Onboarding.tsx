import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Heart, Users, Home, Baby, Sparkles, CheckCircle2,
  PawPrint, Briefcase, Clock, ChevronRight, ChevronLeft,
  ArrowRight
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';
import { seedRewardsForCouple } from '../lib/seedRewards';
import { seedWeeklyChallengesForCouple } from '../lib/seedChallenges';
import toast from 'react-hot-toast';

interface OnboardingData {
  hasChildren: boolean;
  hasPets: boolean;
  householdSize: number;
  workStyle: 'both_office' | 'both_remote' | 'mixed' | 'one_works';
  interests: string[];
  rewardPreferences: string[];
}

const TOTAL_STEPS = 5;

export default function Onboarding() {
  const navigate = useNavigate();
  const { userProfile } = useAuth();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<OnboardingData>({
    hasChildren: false,
    hasPets: false,
    householdSize: 2,
    workStyle: 'both_office',
    interests: [],
    rewardPreferences: []
  });

  const interestOptions = [
    { id: 'household', label: 'Tareas del hogar', description: 'Limpieza, cocina, lavanderia...', icon: Home },
    { id: 'childcare', label: 'Cuidado de ninos', description: 'Rutinas, colegio, deberes...', icon: Baby },
    { id: 'management', label: 'Gestion familiar', description: 'Facturas, citas, organizacion...', icon: Briefcase },
    { id: 'self_care', label: 'Autocuidado y pareja', description: 'Tiempo libre, detalles, descanso...', icon: Sparkles }
  ];

  const rewardOptions = [
    { id: 'leisure', label: 'Tiempo libre y descanso', description: 'Horas libres, dormir, siesta...' },
    { id: 'dates', label: 'Citas y salidas', description: 'Amigos, deporte, compras...' },
    { id: 'treats', label: 'Caprichos y regalos', description: 'Spa, peluqueria, hobby...' },
    { id: 'help', label: 'Ayuda con tareas', description: 'Dia sin tareas, la otra persona se encarga...' }
  ];

  const workOptions = [
    { id: 'both_office', label: 'Ambos fuera de casa', icon: Briefcase },
    { id: 'both_remote', label: 'Ambos teletrabajo', icon: Home },
    { id: 'mixed', label: 'Uno remoto, otro fuera', icon: Users },
    { id: 'one_works', label: 'Solo uno trabaja fuera', icon: Clock },
  ];

  const toggleInterest = (interest: string) => {
    setData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const toggleReward = (reward: string) => {
    setData(prev => ({
      ...prev,
      rewardPreferences: prev.rewardPreferences.includes(reward)
        ? prev.rewardPreferences.filter(r => r !== reward)
        : [...prev.rewardPreferences, reward]
    }));
  };

  const handleSubmit = async () => {
    if (!userProfile?.couple_id) {
      toast.error('No se encontro la pareja vinculada');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('couples')
        .update({
          has_children: data.hasChildren,
          household_size: data.householdSize,
          preferences: {
            interests: data.interests,
            rewardPreferences: data.rewardPreferences,
            hasPets: data.hasPets,
            workStyle: data.workStyle,
          },
          onboarding_completed: true
        })
        .eq('id', userProfile.couple_id);

      if (error) throw error;

      await seedRewardsForCouple(userProfile.couple_id, {
        rewardPreferences: data.rewardPreferences,
        hasPets: data.hasPets,
        hasChildren: data.hasChildren,
      });
      await seedWeeklyChallengesForCouple(userProfile.couple_id);

      toast.success('Experiencia personalizada lista');
      navigate('/dashboard');
    } catch (error) {
      console.error('Error saving preferences:', error);
      toast.error('Error al guardar las preferencias');
    } finally {
      setLoading(false);
    }
  };

  const canAdvance = () => {
    if (step === 4) return data.interests.length > 0;
    if (step === 5) return data.rewardPreferences.length > 0;
    return true;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-rose-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-xl">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-orange-500 to-rose-500 px-8 pt-8 pb-12 text-white text-center relative">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-white/20 backdrop-blur-sm rounded-full mb-4">
              <Heart className="w-7 h-7" fill="currentColor" />
            </div>
            <h1 className="text-2xl font-bold mb-1">Personaliza tu experiencia</h1>
            <p className="text-white/80 text-sm">
              Responde estas preguntas para adaptar MatriPuntos a tu hogar
            </p>
          </div>

          <div className="px-8 -mt-6">
            <div className="bg-white dark:bg-gray-700 rounded-xl shadow-lg p-1 flex gap-1">
              {Array.from({ length: TOTAL_STEPS }, (_, i) => (
                <div
                  key={i}
                  className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${
                    i < step
                      ? 'bg-gradient-to-r from-orange-500 to-rose-500'
                      : 'bg-gray-200 dark:bg-gray-600'
                  }`}
                />
              ))}
            </div>
            <p className="text-center text-xs text-gray-500 dark:text-gray-400 mt-2">
              Paso {step} de {TOTAL_STEPS}
            </p>
          </div>

          <div className="px-8 py-6 min-h-[340px]">
            {step === 1 && (
              <div className="space-y-5 animate-fadeIn">
                <div>
                  <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-1">
                    Cuentanos sobre tu familia
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Esto nos ayuda a mostrar actividades relevantes
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 block">
                    Tienen hijos?
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setData(prev => ({ ...prev, hasChildren: true }))}
                      className={`p-5 rounded-xl border-2 transition-all duration-200 ${
                        data.hasChildren
                          ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20 shadow-md'
                          : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                      }`}
                    >
                      <Baby className={`w-8 h-8 mx-auto mb-2 ${
                        data.hasChildren ? 'text-orange-500' : 'text-gray-400'
                      }`} />
                      <p className="font-semibold text-gray-800 dark:text-white text-sm">Si</p>
                    </button>
                    <button
                      onClick={() => setData(prev => ({ ...prev, hasChildren: false }))}
                      className={`p-5 rounded-xl border-2 transition-all duration-200 ${
                        !data.hasChildren
                          ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20 shadow-md'
                          : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                      }`}
                    >
                      <Heart className={`w-8 h-8 mx-auto mb-2 ${
                        !data.hasChildren ? 'text-orange-500' : 'text-gray-400'
                      }`} />
                      <p className="font-semibold text-gray-800 dark:text-white text-sm">No</p>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 block">
                    Tienen mascotas?
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setData(prev => ({ ...prev, hasPets: true }))}
                      className={`p-5 rounded-xl border-2 transition-all duration-200 ${
                        data.hasPets
                          ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20 shadow-md'
                          : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                      }`}
                    >
                      <PawPrint className={`w-8 h-8 mx-auto mb-2 ${
                        data.hasPets ? 'text-orange-500' : 'text-gray-400'
                      }`} />
                      <p className="font-semibold text-gray-800 dark:text-white text-sm">Si</p>
                    </button>
                    <button
                      onClick={() => setData(prev => ({ ...prev, hasPets: false }))}
                      className={`p-5 rounded-xl border-2 transition-all duration-200 ${
                        !data.hasPets
                          ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20 shadow-md'
                          : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                      }`}
                    >
                      <span className={`block text-2xl text-center mb-2 ${
                        !data.hasPets ? 'opacity-100' : 'opacity-40'
                      }`}>-</span>
                      <p className="font-semibold text-gray-800 dark:text-white text-sm">No</p>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-5 animate-fadeIn">
                <div>
                  <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-1">
                    Personas en el hogar
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Contando adultos y ninos
                  </p>
                </div>

                <div className="flex items-center justify-center py-8">
                  <button
                    onClick={() => setData(prev => ({
                      ...prev,
                      householdSize: Math.max(2, prev.householdSize - 1)
                    }))}
                    className="w-14 h-14 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 flex items-center justify-center text-2xl font-bold text-gray-600 dark:text-gray-300 transition-colors"
                  >
                    -
                  </button>
                  <div className="mx-10 text-center">
                    <div className="text-7xl font-bold bg-gradient-to-r from-orange-500 to-rose-500 bg-clip-text text-transparent">
                      {data.householdSize}
                    </div>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">personas</p>
                  </div>
                  <button
                    onClick={() => setData(prev => ({
                      ...prev,
                      householdSize: Math.min(12, prev.householdSize + 1)
                    }))}
                    className="w-14 h-14 rounded-full bg-gradient-to-r from-orange-500 to-rose-500 hover:from-orange-600 hover:to-rose-600 flex items-center justify-center text-2xl font-bold text-white transition-colors shadow-lg"
                  >
                    +
                  </button>
                </div>

                <div className="flex justify-center gap-2">
                  {Array.from({ length: Math.min(data.householdSize, 8) }, (_, i) => (
                    <div
                      key={i}
                      className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-100 to-rose-100 dark:from-orange-900/30 dark:to-rose-900/30 flex items-center justify-center"
                    >
                      <Users className="w-5 h-5 text-orange-500" />
                    </div>
                  ))}
                  {data.householdSize > 8 && (
                    <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-xs font-bold text-gray-500 dark:text-gray-400">
                      +{data.householdSize - 8}
                    </div>
                  )}
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-5 animate-fadeIn">
                <div>
                  <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-1">
                    Situacion laboral
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Nos ayuda a sugerir tareas segun sus horarios
                  </p>
                </div>

                <div className="space-y-3">
                  {workOptions.map(option => {
                    const Icon = option.icon;
                    const isSelected = data.workStyle === option.id;

                    return (
                      <button
                        key={option.id}
                        onClick={() => setData(prev => ({ ...prev, workStyle: option.id as OnboardingData['workStyle'] }))}
                        className={`w-full p-4 rounded-xl border-2 transition-all duration-200 flex items-center gap-4 ${
                          isSelected
                            ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20 shadow-md'
                            : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                        }`}
                      >
                        <div className={`p-2.5 rounded-lg ${
                          isSelected
                            ? 'bg-orange-500 text-white'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-400'
                        }`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <span className="font-medium text-gray-800 dark:text-white">{option.label}</span>
                        {isSelected && (
                          <CheckCircle2 className="w-5 h-5 text-orange-500 ml-auto" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-5 animate-fadeIn">
                <div>
                  <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-1">
                    Que areas les interesan?
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Selecciona las que apliquen para personalizar el catalogo
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {interestOptions.map(option => {
                    const Icon = option.icon;
                    const isSelected = data.interests.includes(option.id);

                    if (option.id === 'childcare' && !data.hasChildren) return null;

                    return (
                      <button
                        key={option.id}
                        onClick={() => toggleInterest(option.id)}
                        className={`p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                          isSelected
                            ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20 shadow-md'
                            : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                        }`}
                      >
                        <Icon className={`w-7 h-7 mb-2 ${
                          isSelected ? 'text-orange-500' : 'text-gray-400'
                        }`} />
                        <p className="font-semibold text-gray-800 dark:text-white text-sm">{option.label}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{option.description}</p>
                        {isSelected && (
                          <CheckCircle2 className="w-5 h-5 text-orange-500 mt-2" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {step === 5 && (
              <div className="space-y-5 animate-fadeIn">
                <div>
                  <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-1">
                    Que recompensas prefieren?
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Te sugeriremos premios basados en tus gustos
                  </p>
                </div>

                <div className="space-y-3">
                  {rewardOptions.map(option => {
                    const isSelected = data.rewardPreferences.includes(option.id);

                    return (
                      <button
                        key={option.id}
                        onClick={() => toggleReward(option.id)}
                        className={`w-full p-4 rounded-xl border-2 transition-all duration-200 text-left flex items-center justify-between ${
                          isSelected
                            ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20 shadow-md'
                            : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                        }`}
                      >
                        <div>
                          <p className="font-semibold text-gray-800 dark:text-white text-sm">{option.label}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{option.description}</p>
                        </div>
                        {isSelected && (
                          <CheckCircle2 className="w-5 h-5 text-orange-500 flex-shrink-0 ml-3" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          <div className="px-8 pb-8 flex items-center justify-between">
            {step > 1 ? (
              <button
                onClick={() => setStep(step - 1)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl border-2 border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                Anterior
              </button>
            ) : (
              <div />
            )}

            {step < TOTAL_STEPS ? (
              <button
                onClick={() => setStep(step + 1)}
                disabled={!canAdvance()}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-rose-500 text-white font-semibold hover:from-orange-600 hover:to-rose-600 transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Siguiente
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={loading || !canAdvance()}
                className="flex items-center gap-2 px-8 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-rose-500 text-white font-semibold hover:from-orange-600 hover:to-rose-600 transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Guardando...' : 'Comenzar'}
                {!loading && <ArrowRight className="w-4 h-4" />}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
