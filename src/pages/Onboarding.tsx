import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Users, Home, Baby, Sparkles, CheckCircle2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast';

interface OnboardingData {
  hasChildren: boolean;
  householdSize: number;
  interests: string[];
  rewardPreferences: string[];
}

export default function Onboarding() {
  const navigate = useNavigate();
  const { user, userProfile } = useAuth();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<OnboardingData>({
    hasChildren: false,
    householdSize: 2,
    interests: [],
    rewardPreferences: []
  });

  const interestOptions = [
    { id: 'household', label: 'Tareas del hogar', icon: Home },
    { id: 'childcare', label: 'Cuidado de niños', icon: Baby },
    { id: 'management', label: 'Gestión familiar', icon: Users },
    { id: 'self_care', label: 'Autocuidado', icon: Sparkles }
  ];

  const rewardOptions = [
    { id: 'leisure', label: 'Tiempo libre y descanso' },
    { id: 'dates', label: 'Citas y salidas' },
    { id: 'treats', label: 'Caprichos y regalos' },
    { id: 'help', label: 'Ayuda con tareas' }
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
      toast.error('No se encontró la pareja vinculada');
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
            rewardPreferences: data.rewardPreferences
          },
          onboarding_completed: true
        })
        .eq('id', userProfile.couple_id);

      if (error) throw error;

      toast.success('¡Configuración guardada! Personalizando tu experiencia...');
      navigate('/dashboard');
    } catch (error) {
      console.error('Error saving preferences:', error);
      toast.error('Error al guardar las preferencias');
    } finally {
      setLoading(false);
    }
  };

  const totalSteps = 4;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-pink-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-orange-500 to-pink-500 rounded-full mb-4">
              <Heart className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              ¡Bienvenidos a MatriPuntos!
            </h1>
            <p className="text-gray-600">
              Responde estas preguntas para personalizar tu experiencia
            </p>
          </div>

          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">
                Paso {step} de {totalSteps}
              </span>
              <span className="text-sm font-medium text-orange-600">
                {Math.round((step / totalSteps) * 100)}%
              </span>
            </div>
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-orange-500 to-pink-500 transition-all duration-300"
                style={{ width: `${(step / totalSteps) * 100}%` }}
              />
            </div>
          </div>

          {step === 1 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                ¿Tienen hijos?
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setData(prev => ({ ...prev, hasChildren: true }))}
                  className={`p-8 rounded-xl border-2 transition-all ${
                    data.hasChildren
                      ? 'border-orange-500 bg-orange-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Baby className={`w-12 h-12 mx-auto mb-3 ${
                    data.hasChildren ? 'text-orange-500' : 'text-gray-400'
                  }`} />
                  <p className="font-semibold text-gray-800">Sí</p>
                  <p className="text-sm text-gray-600 mt-1">
                    Verás actividades de cuidado infantil
                  </p>
                </button>
                <button
                  onClick={() => setData(prev => ({ ...prev, hasChildren: false }))}
                  className={`p-8 rounded-xl border-2 transition-all ${
                    !data.hasChildren
                      ? 'border-orange-500 bg-orange-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Heart className={`w-12 h-12 mx-auto mb-3 ${
                    !data.hasChildren ? 'text-orange-500' : 'text-gray-400'
                  }`} />
                  <p className="font-semibold text-gray-800">No</p>
                  <p className="text-sm text-gray-600 mt-1">
                    Enfoque en pareja y hogar
                  </p>
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                ¿Cuántas personas viven en su hogar?
              </h2>
              <div className="flex items-center justify-center space-x-6">
                <button
                  onClick={() => setData(prev => ({
                    ...prev,
                    householdSize: Math.max(2, prev.householdSize - 1)
                  }))}
                  className="w-12 h-12 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center text-2xl font-bold text-gray-700 transition-colors"
                >
                  -
                </button>
                <div className="text-center">
                  <div className="text-6xl font-bold text-orange-600 mb-2">
                    {data.householdSize}
                  </div>
                  <p className="text-gray-600">
                    {data.householdSize === 2 ? 'personas' : 'personas'}
                  </p>
                </div>
                <button
                  onClick={() => setData(prev => ({
                    ...prev,
                    householdSize: Math.min(10, prev.householdSize + 1)
                  }))}
                  className="w-12 h-12 rounded-full bg-orange-500 hover:bg-orange-600 flex items-center justify-center text-2xl font-bold text-white transition-colors"
                >
                  +
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                ¿Qué áreas les interesan?
              </h2>
              <p className="text-gray-600 mb-6">
                Selecciona todas las que apliquen para personalizar tu catálogo
              </p>
              <div className="grid grid-cols-2 gap-4">
                {interestOptions.map(option => {
                  const Icon = option.icon;
                  const isSelected = data.interests.includes(option.id);

                  if (option.id === 'childcare' && !data.hasChildren) {
                    return null;
                  }

                  return (
                    <button
                      key={option.id}
                      onClick={() => toggleInterest(option.id)}
                      className={`p-6 rounded-xl border-2 transition-all ${
                        isSelected
                          ? 'border-orange-500 bg-orange-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <Icon className={`w-10 h-10 mx-auto mb-3 ${
                        isSelected ? 'text-orange-500' : 'text-gray-400'
                      }`} />
                      <p className="font-semibold text-gray-800">{option.label}</p>
                      {isSelected && (
                        <CheckCircle2 className="w-6 h-6 text-orange-500 mx-auto mt-2" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                ¿Qué tipo de recompensas prefieren?
              </h2>
              <p className="text-gray-600 mb-6">
                Te sugeriremos recompensas basadas en tus preferencias
              </p>
              <div className="grid grid-cols-1 gap-3">
                {rewardOptions.map(option => {
                  const isSelected = data.rewardPreferences.includes(option.id);

                  return (
                    <button
                      key={option.id}
                      onClick={() => toggleReward(option.id)}
                      className={`p-4 rounded-xl border-2 transition-all text-left flex items-center justify-between ${
                        isSelected
                          ? 'border-orange-500 bg-orange-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <p className="font-semibold text-gray-800">{option.label}</p>
                      {isSelected && (
                        <CheckCircle2 className="w-6 h-6 text-orange-500" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
            {step > 1 ? (
              <button
                onClick={() => setStep(step - 1)}
                className="px-6 py-3 rounded-lg border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
              >
                Anterior
              </button>
            ) : (
              <div />
            )}

            {step < totalSteps ? (
              <button
                onClick={() => setStep(step + 1)}
                className="px-6 py-3 rounded-lg bg-gradient-to-r from-orange-500 to-pink-500 text-white font-semibold hover:from-orange-600 hover:to-pink-600 transition-colors"
              >
                Siguiente
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="px-8 py-3 rounded-lg bg-gradient-to-r from-orange-500 to-pink-500 text-white font-semibold hover:from-orange-600 hover:to-pink-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Guardando...' : '¡Comenzar!'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
