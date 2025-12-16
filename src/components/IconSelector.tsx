import * as LucideIcons from 'lucide-react';

export const REWARD_ICONS = [
  { name: 'Gift', label: 'Regalo' },
  { name: 'Heart', label: 'Corazón' },
  { name: 'Coffee', label: 'Café' },
  { name: 'Pizza', label: 'Pizza' },
  { name: 'IceCream', label: 'Helado' },
  { name: 'Cake', label: 'Pastel' },
  { name: 'Utensils', label: 'Cubiertos' },
  { name: 'Wine', label: 'Vino' },
  { name: 'Flower', label: 'Flor' },
  { name: 'TreePalm', label: 'Vacaciones' },
  { name: 'Plane', label: 'Avión' },
  { name: 'Car', label: 'Coche' },
  { name: 'Home', label: 'Casa' },
  { name: 'Sparkles', label: 'Estrellas' },
  { name: 'Music', label: 'Música' },
  { name: 'Film', label: 'Película' },
  { name: 'Popcorn', label: 'Palomitas' },
  { name: 'Gamepad2', label: 'Videojuegos' },
  { name: 'Book', label: 'Libro' },
  { name: 'Camera', label: 'Cámara' },
  { name: 'PartyPopper', label: 'Fiesta' },
  { name: 'Shirt', label: 'Ropa' },
  { name: 'Watch', label: 'Reloj' },
  { name: 'ShoppingBag', label: 'Compras' },
  { name: 'Gem', label: 'Joya' },
  { name: 'Crown', label: 'Corona' },
  { name: 'Star', label: 'Estrella' },
  { name: 'Zap', label: 'Rayo' },
  { name: 'Flame', label: 'Llama' },
  { name: 'Sun', label: 'Sol' },
  { name: 'Moon', label: 'Luna' },
  { name: 'Cloud', label: 'Nube' },
] as const;

interface IconSelectorProps {
  selectedIcon?: string;
  onSelect: (iconName: string) => void;
}

export default function IconSelector({ selectedIcon, onSelect }: IconSelectorProps) {
  const getIconComponent = (iconName: string) => {
    const IconComponent = (LucideIcons as any)[iconName];
    return IconComponent || LucideIcons.Gift;
  };

  return (
    <div className="grid grid-cols-6 gap-2 max-h-48 overflow-y-auto p-2 border border-gray-300 dark:border-gray-600 rounded-lg">
      {REWARD_ICONS.map((icon) => {
        const IconComponent = getIconComponent(icon.name);
        const isSelected = selectedIcon === icon.name;

        return (
          <button
            key={icon.name}
            type="button"
            onClick={() => onSelect(icon.name)}
            className={`p-3 rounded-lg transition-all duration-200 flex flex-col items-center justify-center gap-1 ${
              isSelected
                ? 'bg-orange-500 text-white shadow-lg scale-105'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
            title={icon.label}
          >
            <IconComponent className="w-5 h-5" />
          </button>
        );
      })}
    </div>
  );
}
