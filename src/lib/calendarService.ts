import { supabase } from './supabase';
import type {
  CalendarTask,
  TaskOwnership,
  MemberWorkConfig,
  CalendarEntry,
  TaskFrequency,
  FairnessResult,
  CalendarTaskCategory,
} from '../types';

export async function getAllTasks(): Promise<CalendarTask[]> {
  const { data, error } = await supabase
    .from('calendar_tasks')
    .select('*')
    .order('category')
    .order('base_points', { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function getTaskOwnerships(coupleId: string): Promise<TaskOwnership[]> {
  const { data, error } = await supabase
    .from('task_ownership')
    .select('*, task:calendar_tasks(*)')
    .eq('couple_id', coupleId)
    .eq('active', true);
  if (error) throw error;
  return (data || []) as TaskOwnership[];
}

export async function assignTask(
  coupleId: string,
  taskId: string,
  ownerId: string,
  frequency: TaskFrequency = 'weekly',
  preferredDay?: number
): Promise<void> {
  const { error } = await supabase.from('task_ownership').upsert(
    {
      couple_id: coupleId,
      task_id: taskId,
      owner_id: ownerId,
      frequency,
      preferred_day: preferredDay ?? null,
      active: true,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'couple_id,task_id' }
  );
  if (error) throw error;
}

export async function unassignTask(coupleId: string, taskId: string): Promise<void> {
  const { error } = await supabase
    .from('task_ownership')
    .delete()
    .eq('couple_id', coupleId)
    .eq('task_id', taskId);
  if (error) throw error;
}

export async function updateTaskFrequency(
  ownershipId: string,
  frequency: TaskFrequency,
  preferredDay?: number
): Promise<void> {
  const { error } = await supabase
    .from('task_ownership')
    .update({
      frequency,
      preferred_day: preferredDay ?? null,
      updated_at: new Date().toISOString(),
    })
    .eq('id', ownershipId);
  if (error) throw error;
}

export async function getMemberWorkConfigs(coupleId: string): Promise<MemberWorkConfig[]> {
  const { data, error } = await supabase
    .from('member_work_config')
    .select('*')
    .eq('couple_id', coupleId);
  if (error) throw error;
  return data || [];
}

export async function upsertMemberWorkConfig(
  coupleId: string,
  userId: string,
  monthlyIncome: number,
  weeklyWorkHours: number
): Promise<void> {
  const { error } = await supabase.from('member_work_config').upsert(
    {
      couple_id: coupleId,
      user_id: userId,
      monthly_income: monthlyIncome,
      weekly_work_hours: weeklyWorkHours,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'couple_id,user_id' }
  );
  if (error) throw error;
}

export async function getCalendarEntries(
  coupleId: string,
  startDate: string,
  endDate: string
): Promise<CalendarEntry[]> {
  const { data, error } = await supabase
    .from('calendar_entries')
    .select('*')
    .eq('couple_id', coupleId)
    .gte('scheduled_date', startDate)
    .lte('scheduled_date', endDate)
    .order('scheduled_date');
  if (error) throw error;
  return data || [];
}

export async function completeCalendarTask(
  coupleId: string,
  taskId: string,
  userId: string,
  title: string,
  date: string,
  points: number
): Promise<void> {
  const { error: entryError } = await supabase.from('calendar_entries').insert({
    couple_id: coupleId,
    task_id: taskId,
    user_id: userId,
    title,
    scheduled_date: date,
    completed: true,
    points_earned: points,
    completed_at: new Date().toISOString(),
  });
  if (entryError) throw entryError;

  const { error: historyError } = await supabase.from('history').insert({
    couple_id: coupleId,
    user_id: userId,
    points,
    type: 'gain',
    description: `Calendario: ${title}`,
  });
  if (historyError) throw historyError;

  const { error: pointsError } = await supabase.rpc('add_points', {
    p_couple_id: coupleId,
    p_amount: points,
  });
  if (pointsError) throw pointsError;
}

export async function uncompleteEntry(
  entryId: string,
  coupleId: string,
  points: number
): Promise<void> {
  const { error: deleteError } = await supabase
    .from('calendar_entries')
    .delete()
    .eq('id', entryId);
  if (deleteError) throw deleteError;

  const { error: pointsError } = await supabase.rpc('add_points', {
    p_couple_id: coupleId,
    p_amount: -points,
  });
  if (pointsError) throw pointsError;
}

export async function toggleCalendar(coupleId: string, enabled: boolean): Promise<void> {
  const { error } = await supabase
    .from('couples')
    .update({ calendar_enabled: enabled })
    .eq('id', coupleId);
  if (error) throw error;
}

export function getWeekStart(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

export function getWeekDates(weekStart: Date): Date[] {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(weekStart);
    d.setDate(d.getDate() + i);
    return d;
  });
}

export function formatDateKey(date: Date): string {
  return date.toISOString().split('T')[0];
}

export function getTasksForDay(dayOfWeek: number, ownerships: TaskOwnership[]): TaskOwnership[] {
  return ownerships.filter((o) => {
    if (!o.active) return false;
    if (o.frequency === 'daily') return true;
    if (o.frequency === 'weekly' && o.preferred_day === dayOfWeek) return true;
    if (o.frequency === 'biweekly' && o.preferred_day === dayOfWeek) return true;
    return false;
  });
}

export function getFlexibleTasks(ownerships: TaskOwnership[]): TaskOwnership[] {
  return ownerships.filter(
    (o) => o.active && (o.frequency === 'flexible' || o.frequency === 'monthly')
  );
}

const WAKING_HOURS_PER_WEEK = 112;

export function calculateFairness(
  configs: MemberWorkConfig[],
  ownerships: TaskOwnership[],
  tasks: CalendarTask[],
  member1Id: string,
  member2Id: string
): FairnessResult {
  const config1 = configs.find((c) => c.user_id === member1Id);
  const config2 = configs.find((c) => c.user_id === member2Id);

  const income1 = Number(config1?.monthly_income ?? 0);
  const income2 = Number(config2?.monthly_income ?? 0);
  const hours1 = Number(config1?.weekly_work_hours ?? 40);
  const hours2 = Number(config2?.weekly_work_hours ?? 40);

  const free1 = Math.max(WAKING_HOURS_PER_WEEK - hours1, 10);
  const free2 = Math.max(WAKING_HOURS_PER_WEEK - hours2, 10);
  const totalFree = free1 + free2;

  const totalIncome = income1 + income2;
  const incomeShare1 = totalIncome > 0 ? income1 / totalIncome : 0.5;
  const incomeShare2 = totalIncome > 0 ? income2 / totalIncome : 0.5;

  const timeShare1 = free1 / totalFree;
  const timeShare2 = free2 / totalFree;

  const rawExpected1 = timeShare1 * (1 - incomeShare1 * 0.4);
  const rawExpected2 = timeShare2 * (1 - incomeShare2 * 0.4);
  const totalExpected = rawExpected1 + rawExpected2;

  const expected1 = totalExpected > 0 ? rawExpected1 / totalExpected : 0.5;
  const expected2 = totalExpected > 0 ? rawExpected2 / totalExpected : 0.5;

  const taskMap = new Map(tasks.map((t) => [t.id, t]));
  let points1 = 0;
  let points2 = 0;

  for (const o of ownerships) {
    if (!o.active) continue;
    const task = o.task || taskMap.get(o.task_id);
    if (!task) continue;

    let weeklyMultiplier = 1;
    if (o.frequency === 'daily') weeklyMultiplier = 7;
    else if (o.frequency === 'biweekly') weeklyMultiplier = 0.5;
    else if (o.frequency === 'monthly') weeklyMultiplier = 0.25;
    else if (o.frequency === 'flexible') weeklyMultiplier = 0.5;

    const weeklyPoints = task.base_points * weeklyMultiplier;
    if (o.owner_id === member1Id) points1 += weeklyPoints;
    else if (o.owner_id === member2Id) points2 += weeklyPoints;
  }

  const totalPoints = points1 + points2;
  const actual1 = totalPoints > 0 ? points1 / totalPoints : 0.5;
  const actual2 = totalPoints > 0 ? points2 / totalPoints : 0.5;

  const deviation = Math.abs(actual1 - expected1);
  const score = Math.max(0, Math.min(100, Math.round((1 - deviation * 2) * 100)));

  let suggestion = '';
  if (totalPoints === 0) {
    suggestion = 'Asigna tareas a cada miembro para ver el equilibrio.';
  } else if (score >= 85) {
    suggestion = 'La distribucion esta bien equilibrada segun vuestro acuerdo.';
  } else if (score >= 60) {
    const overloaded = actual1 > expected1 ? 'member1' : 'member2';
    suggestion =
      overloaded === 'member1'
        ? 'Podrias reasignar algunas tareas para mejorar el equilibrio.'
        : 'Tu pareja tiene mas carga de la esperada. Considera asumir alguna tarea mas.';
  } else {
    suggestion =
      'La distribucion esta bastante desequilibrada. Revisad la asignacion de tareas juntos.';
  }

  return {
    score,
    member1ExpectedShare: expected1,
    member2ExpectedShare: expected2,
    member1ActualShare: actual1,
    member2ActualShare: actual2,
    member1TotalPoints: Math.round(points1),
    member2TotalPoints: Math.round(points2),
    suggestion,
  };
}

export const CATEGORY_CONFIG: Record<
  CalendarTaskCategory,
  { label: string; color: string; bgColor: string; borderColor: string }
> = {
  hogar: {
    label: 'Hogar',
    color: 'text-blue-600 dark:text-blue-400',
    bgColor: 'bg-blue-50 dark:bg-blue-900/20',
    borderColor: 'border-blue-200 dark:border-blue-800',
  },
  hijos: {
    label: 'Hijos',
    color: 'text-rose-600 dark:text-rose-400',
    bgColor: 'bg-rose-50 dark:bg-rose-900/20',
    borderColor: 'border-rose-200 dark:border-rose-800',
  },
  gestion: {
    label: 'Gestion',
    color: 'text-amber-600 dark:text-amber-400',
    bgColor: 'bg-amber-50 dark:bg-amber-900/20',
    borderColor: 'border-amber-200 dark:border-amber-800',
  },
  social: {
    label: 'Social',
    color: 'text-teal-600 dark:text-teal-400',
    bgColor: 'bg-teal-50 dark:bg-teal-900/20',
    borderColor: 'border-teal-200 dark:border-teal-800',
  },
  bienestar: {
    label: 'Bienestar',
    color: 'text-emerald-600 dark:text-emerald-400',
    bgColor: 'bg-emerald-50 dark:bg-emerald-900/20',
    borderColor: 'border-emerald-200 dark:border-emerald-800',
  },
};

export const DAY_NAMES = ['Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab', 'Dom'];
export const DAY_NAMES_FULL = [
  'Lunes',
  'Martes',
  'Miercoles',
  'Jueves',
  'Viernes',
  'Sabado',
  'Domingo',
];
