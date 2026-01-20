import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast';

export default function FairPlay() {
  const navigate = useNavigate();
  const { user, userProfile } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (!userProfile?.couple_id) {
      toast.error('Necesitas estar vinculado con tu pareja');
      navigate('/link');
      return;
    }

    setLoading(false);
  }, [user, userProfile, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-pink-50 dark:from-gray-900 dark:to-gray-800 p-6 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-pink-50 dark:from-gray-900 dark:to-gray-800 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate('/dashboard')}
            className="p-2 hover:bg-white/50 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-gray-700 dark:text-white" />
          </button>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Fair Play</h1>
          <div className="w-10" />
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
            Sistema Fair Play
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Fair Play es un sistema para distribuir equitativamente las responsabilidades del hogar.
            Cada carta representa una tarea que requiere <strong>CPE</strong>: Concebir, Planificar y Ejecutar.
          </p>
          <p className="text-gray-600 dark:text-gray-300">
            Esta funcionalidad está en desarrollo y estará disponible pronto.
          </p>
        </div>
      </div>
    </div>
  );
}
