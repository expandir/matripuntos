import { Sparkles } from 'lucide-react';

interface PointsBadgeProps {
  points: number;
}

export default function PointsBadge({ points }: PointsBadgeProps) {
  return (
    <div className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-pink-500 text-white px-6 py-3 rounded-full shadow-lg">
      <Sparkles className="w-5 h-5" />
      <span className="text-2xl font-bold">{points}</span>
      <span className="text-sm font-medium">pts</span>
    </div>
  );
}
