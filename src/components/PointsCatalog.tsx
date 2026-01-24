import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as Icons from 'lucide-react';
import { supabase } from '../lib/supabase';
import { ensureSession } from '../lib/sessionHelper';
import { CatalogItem, CatalogCategory, Couple } from '../types';
import toast from 'react-hot-toast';
import ConfirmDialog from './ConfirmDialog';
import { checkAndUnlockAchievements } from '../lib/achievementsService';

interface PointsCatalogProps {
  coupleId: string;
  userId: string;
  couple: Couple;
  onActivityComplete: () => void;
}

const categoryColors = {
  household: 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400',
  childcare: 'bg-pink-100 dark:bg-pink-900 text-pink-600 dark:text-pink-400',
  management: 'bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400',
  self_care: 'bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400',
};

const categoryNames = {
  household: 'Hogar',
  childcare: 'Cuidado infantil',
  management: 'Gestión',
  self_care: 'Autocuidado',
};

export default function PointsCatalog({ coupleId, userId, couple, onActivityComplete }: PointsCatalogProps) {
  const navigate = useNavigate();
  const [catalogItems, setCatalogItems] = useState<CatalogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<CatalogCategory | 'all'>('all');
  const [selectedItem, setSelectedItem] = useState<CatalogItem | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    loadCatalog();
  }, []);

  const loadCatalog = async () => {
    try {
      const { data, error } = await supabase
        .from('points_catalog')
        .select('*')
        .order('category', { ascending: true })
        .order('points_value', { ascending: false });

      if (error) throw error;
      setCatalogItems(data || []);
    } catch (error) {
      console.error('Error loading catalog:', error);
      toast.error('Error al cargar el catálogo');
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteActivity = async () => {
    if (!selectedItem) return;

    try {
      await ensureSession();

      if (couple.requires_validation) {
        const { error: pendingError } = await supabase
          .from('pending_points')
          .insert({
            couple_id: coupleId,
            user_id: userId,
            points: selectedItem.points_value,
            description: selectedItem.name,
            catalog_item_id: selectedItem.id,
            status: 'pending',
          });

        if (pendingError) throw pendingError;

        const { error: completionError } = await supabase
          .from('catalog_completions')
          .insert({
            couple_id: coupleId,
            user_id: userId,
            catalog_item_id: selectedItem.id,
          });

        if (completionError) throw completionError;

        toast.success('Actividad enviada para validación');
      } else {
        const { error: completionError } = await supabase
          .from('catalog_completions')
          .insert({
            couple_id: coupleId,
            user_id: userId,
            catalog_item_id: selectedItem.id,
          });

        if (completionError) throw completionError;

        const { error: coupleError } = await supabase.rpc('add_points', {
          p_couple_id: coupleId,
          p_amount: selectedItem.points_value,
        });

        if (coupleError) throw coupleError;

        const { error: historyError } = await supabase.from('history').insert({
          couple_id: coupleId,
          user_id: userId,
          points: selectedItem.points_value,
          type: 'gain',
          description: selectedItem.name,
        });

        if (historyError) throw historyError;

        toast.success(`¡Actividad completada! +${selectedItem.points_value} puntos`);

        checkAndUnlockAchievements(userId);
      }

      onActivityComplete();
      setShowConfirm(false);
      setSelectedItem(null);
    } catch (error: any) {
      console.error('Error completing activity:', error);
      if (error.message?.includes('No active session')) {
        toast.error('Sesión expirada. Por favor, inicia sesión nuevamente');
        navigate('/login');
      } else {
        toast.error('Error al completar la actividad');
      }
    }
  };

  const getIconComponent = (iconName?: string) => {
    if (!iconName) return Icons.Star;

    const iconNameMap: Record<string, string> = {
      'Popcorn': 'Sandwich',
      'TreePalm': 'Palmtree',
      'Dices': 'Dice',
      'PartyPopper': 'Party',
      'Sparkle': 'Sparkles',
    };

    const mappedIconName = iconNameMap[iconName] || iconName;
    const Icon = (Icons as any)[mappedIconName];
    return Icon || Icons.Star;
  };

  const filteredItems = selectedCategory === 'all'
    ? catalogItems
    : catalogItems.filter(item => item.category === selectedCategory);

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-800 dark:text-white">Ganar Puntos</h3>
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {filteredItems.length} actividades
        </span>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
            selectedCategory === 'all'
              ? 'bg-orange-500 text-white'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
          }`}
        >
          Todas
        </button>
        {Object.keys(categoryNames).map((cat) => {
          const category = cat as CatalogCategory;
          return (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                selectedCategory === category
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {categoryNames[category]}
            </button>
          );
        })}
      </div>

      <div className="grid gap-3 max-h-96 overflow-y-auto pr-2">
        {filteredItems.map((item) => {
          const Icon = getIconComponent(item.icon);

          return (
            <div
              key={item.id}
              className="p-4 rounded-lg bg-white dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 hover:border-orange-300 dark:hover:border-orange-600 transition-all"
            >
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg ${categoryColors[item.category]}`}>
                  <Icon className="w-5 h-5" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-800 dark:text-white">
                        {item.name}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {item.description}
                      </p>
                      <span className={`inline-block mt-2 text-xs font-medium px-2 py-1 rounded-full ${categoryColors[item.category]}`}>
                        {categoryNames[item.category]}
                      </span>
                    </div>
                    <span className="text-lg font-bold text-orange-600 dark:text-orange-400 whitespace-nowrap ml-2">
                      +{item.points_value}
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedItem(item);
                      setShowConfirm(true);
                    }}
                    className="mt-3 w-full px-4 py-2 bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white text-sm font-medium rounded-lg transition-all duration-200 transform hover:scale-[1.02]"
                  >
                    Registrar y ganar puntos
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredItems.length === 0 && (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          No hay actividades en esta categoría
        </div>
      )}

      {showConfirm && selectedItem && (
        <ConfirmDialog
          title="Completar Actividad"
          message={`¿Confirmas que has completado "${selectedItem.name}"? Ganarás ${selectedItem.points_value} puntos.`}
          confirmText="Sí, completar"
          cancelText="Cancelar"
          onConfirm={handleCompleteActivity}
          onCancel={() => {
            setShowConfirm(false);
            setSelectedItem(null);
          }}
        />
      )}
    </div>
  );
}
