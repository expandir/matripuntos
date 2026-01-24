export interface User {
  id: string;
  email: string;
  name: string;
  photo_url?: string;
  couple_id?: string;
  created_at: string;
}

export interface Couple {
  id: string;
  points: number;
  requires_validation: boolean;
  created_at: string;
}

export interface Reward {
  id: string;
  couple_id: string;
  name: string;
  description: string;
  points_cost: number;
  image_url?: string;
  icon?: string;
  created_at: string;
}

export interface HistoryEntry {
  id: string;
  couple_id: string;
  user_id: string;
  points: number;
  type: 'gain' | 'spend';
  description: string;
  created_at: string;
}

export interface WeeklyChallenge {
  id: string;
  couple_id: string;
  name: string;
  description: string;
  points_reward: number;
  icon?: string;
  completed: boolean;
  week_start: string;
  completed_at?: string;
  created_at: string;
}

export type CatalogCategory = 'household' | 'childcare' | 'management' | 'self_care';

export interface CatalogItem {
  id: string;
  name: string;
  description: string;
  points_value: number;
  category: CatalogCategory;
  icon?: string;
  created_at: string;
}

export interface CatalogCompletion {
  id: string;
  couple_id: string;
  user_id: string;
  catalog_item_id: string;
  completed_at: string;
}

export interface PendingPoints {
  id: string;
  couple_id: string;
  user_id: string;
  points: number;
  description: string;
  catalog_item_id?: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
}
