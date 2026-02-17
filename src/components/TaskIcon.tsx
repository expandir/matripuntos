import {
  Sparkles, UtensilsCrossed, ShoppingCart, Wind, Utensils, Wrench,
  Flower2, FolderOpen, Trash2, Sun, Moon, Car, BookOpen, Trophy,
  ShoppingBag, Droplets, Smile, Receipt, CalendarDays, FileText,
  Wallet, Package, Phone, Laptop, Mail, Gift, Users, UserPlus,
  HeartHandshake, Plane, Home, Dumbbell, HeartPulse, Leaf, Heart,
  Battery, ClipboardList, Apple, Stethoscope,
  type LucideProps,
} from 'lucide-react';

const ICONS: Record<string, React.ComponentType<LucideProps>> = {
  Sparkles, UtensilsCrossed, ShoppingCart, Wind, Utensils, Wrench,
  Flower2, FolderOpen, Trash2, Sun, Moon, Car, BookOpen, Trophy,
  ShoppingBag, Droplets, Smile, Receipt, CalendarDays, FileText,
  Wallet, Package, Phone, Laptop, Mail, Gift, Users, UserPlus,
  HeartHandshake, Plane, Home, Dumbbell, HeartPulse, Leaf, Heart,
  Battery, ClipboardList, Apple, Stethoscope, PiggyBank: Wallet,
};

export default function TaskIcon({ name, ...props }: { name: string } & LucideProps) {
  const Icon = ICONS[name] || ClipboardList;
  return <Icon {...props} />;
}
