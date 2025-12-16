import { useState, useEffect } from 'react';
import { X, ExternalLink } from 'lucide-react';
import { Reward } from '../types';
import IconSelector from './IconSelector';

interface RewardFormModalProps {
  reward?: Reward | null;
  onSave: (data: {
    name: string;
    description: string;
    points_cost: number;
    image_url: string;
    icon: string;
  }) => void;
  onCancel: () => void;
}

export default function RewardFormModal({ reward, onSave, onCancel }: RewardFormModalProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [pointsCost, setPointsCost] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [selectedIcon, setSelectedIcon] = useState('Gift');

  useEffect(() => {
    if (reward) {
      setName(reward.name);
      setDescription(reward.description);
      setPointsCost(reward.points_cost.toString());
      setImageUrl(reward.image_url || '');
      setSelectedIcon(reward.icon || 'Gift');
    }
  }, [reward]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const points = parseInt(pointsCost);
    if (isNaN(points) || points < 1) {
      return;
    }

    onSave({
      name: name.trim(),
      description: description.trim(),
      points_cost: points,
      image_url: imageUrl.trim(),
      icon: selectedIcon,
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            {reward ? 'Editar Recompensa' : 'Nueva Recompensa'}
          </h2>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Nombre
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              maxLength={100}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              placeholder="Ej: Cena romántica"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Descripción
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              maxLength={500}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-gray-700 dark:text-white resize-none"
              placeholder="Describe la recompensa..."
            />
          </div>

          <div>
            <label htmlFor="points" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Costo en Puntos
            </label>
            <input
              type="number"
              id="points"
              value={pointsCost}
              onChange={(e) => setPointsCost(e.target.value)}
              required
              min="1"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              placeholder="100"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Ícono de la Recompensa
            </label>
            <IconSelector selectedIcon={selectedIcon} onSelect={setSelectedIcon} />
          </div>

          <div>
            <label htmlFor="image" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              URL de Imagen (opcional)
            </label>
            <input
              type="url"
              id="image"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              placeholder="https://ejemplo.com/imagen.jpg"
            />
            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
              Encuentra imágenes gratuitas en{' '}
              <a
                href="https://www.pexels.com/es-es/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-orange-500 hover:text-orange-600 inline-flex items-center gap-1"
              >
                Pexels
                <ExternalLink className="w-3 h-3" />
              </a>
            </p>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium"
            >
              {reward ? 'Guardar Cambios' : 'Crear Recompensa'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
