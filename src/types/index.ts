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
  has_children?: boolean;
  household_size?: number;
  preferences?: Record<string, any>;
  onboarding_completed?: boolean;
  calendar_enabled?: boolean;
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

export type CalendarTaskCategory = 'hogar' | 'hijos' | 'gestion' | 'social' | 'bienestar';
export type TaskFrequency = 'daily' | 'weekly' | 'biweekly' | 'monthly' | 'flexible';

export interface CalendarTask {
  id: string;
  name: string;
  description: string;
  category: CalendarTaskCategory;
  estimated_minutes: number;
  base_points: number;
  icon: string;
  is_default: boolean;
  created_at: string;
}

export interface TaskOwnership {
  id: string;
  couple_id: string;
  task_id: string;
  owner_id: string;
  frequency: TaskFrequency;
  preferred_day: number | null;
  active: boolean;
  created_at: string;
  updated_at: string;
  task?: CalendarTask;
}

export interface MemberWorkConfig {
  id: string;
  couple_id: string;
  user_id: string;
  monthly_income: number;
  weekly_work_hours: number;
  created_at: string;
  updated_at: string;
}

export interface CalendarEntry {
  id: string;
  couple_id: string;
  task_id: string | null;
  user_id: string;
  title: string;
  scheduled_date: string;
  completed: boolean;
  points_earned: number;
  notes: string | null;
  completed_at: string | null;
  created_at: string;
}

export interface FairnessResult {
  score: number;
  member1ExpectedShare: number;
  member2ExpectedShare: number;
  member1ActualShare: number;
  member2ActualShare: number;
  member1TotalPoints: number;
  member2TotalPoints: number;
  suggestion: string;
}
