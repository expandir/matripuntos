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
  created_at: string;
}

export interface Reward {
  id: string;
  couple_id: string;
  name: string;
  description: string;
  points_cost: number;
  image_url?: string;
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
